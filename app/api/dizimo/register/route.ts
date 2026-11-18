import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient, hasServiceRoleKey } from '@/utils/supabase/admin';
import {
  checkServerRateLimit,
  extractClientIp,
  recordServerRateLimitFailure,
} from '@/lib/security/rateLimit';
import { toFriendlyErrorMessage } from '@/lib/security/friendlyError';
import { dispatchTransactionalNotification } from '@/lib/notifications/dispatchNotification';

const DIZIMO_RATE_CFG = {
  maxAttempts: 10,
  windowMs: 10 * 60 * 1000,
  lockoutMs: 5 * 60 * 1000,
};

export async function POST(req: NextRequest) {
  try {
    // [HARDENED] SEC-009: Rate limiting por IP na adesão pública ao dízimo
    const clientIp = extractClientIp(req.headers);
    const rateKey = `dizimo:${clientIp}`;
    const rateStatus = checkServerRateLimit(rateKey, DIZIMO_RATE_CFG);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { error: 'Muitas solicitações seguidas. Aguarde alguns minutos e tente novamente.' },
        { status: 429 }
      );
    }

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: 'Corpo da requisição inválido.' }, { status: 400 });
    }

    const parishId = typeof body.parishId === 'string' ? body.parishId.trim() : '';
    const communityId = typeof body.communityId === 'string' ? body.communityId.trim() || null : null;
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const birthDate = typeof body.birthDate === 'string' ? body.birthDate.trim() || null : null;
    const address = typeof body.address === 'string' ? body.address.trim() || null : null;
    const neighborhood = typeof body.neighborhood === 'string' ? body.neighborhood.trim() || null : null;
    const preferredPaymentMethod =
      typeof body.preferredPaymentMethod === 'string' ? body.preferredPaymentMethod : 'pix';
    const preferredDay = body.preferredDay ? Number(body.preferredDay) : 10;
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
    const communityName =
      typeof body.communityName === 'string' ? body.communityName.trim() : 'Catedral Diocesana';

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Nome completo e telefone/WhatsApp são obrigatórios.' },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
    }

    recordServerRateLimitFailure(rateKey, DIZIMO_RATE_CFG);

    const cookieStore = await cookies();
    const supabase = hasServiceRoleKey() ? createAdminClient() : createClient(cookieStore);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const protocol = `DIZ-${new Date().getFullYear()}-${randomSuffix}`;

    const registrationData = {
      parish_id: parishId || 'c0000000-0000-0000-0000-000000000001',
      community_id: communityId,
      full_name: fullName,
      phone,
      email: email || null,
      birth_date: birthDate,
      address,
      neighborhood,
      preferred_payment_method: preferredPaymentMethod,
      preferred_day: Number.isFinite(preferredDay) ? Math.min(28, Math.max(1, preferredDay)) : 10,
      status: 'pendente',
      notes: notes ? `${notes} (Protocolo: ${protocol})` : `Protocolo: ${protocol}`,
    };

    // [HARDENED] ERR-001: Falha de persistência nunca retorna HTTP 200 success
    const { data, error: dbError } = await supabase
      .from('tithe_registrations')
      .insert(registrationData)
      .select('id')
      .single();

    if (dbError || !data) {
      console.error('[api/dizimo/register] Erro ao gravar tithe_registrations:', dbError);
      return NextResponse.json(
        {
          error: toFriendlyErrorMessage(
            dbError,
            'Não foi possível registrar sua adesão no momento. Tente novamente ou procure a secretaria.'
          ),
        },
        { status: 500 }
      );
    }

    const methodLabels: Record<string, string> = {
      pix: 'PIX Instantâneo',
      envelope: 'Envelope Mensal nas Santas Missas',
      transferencia: 'Transferência Bancária / TED',
      debito: 'Débito / Cartão',
      secretaria: 'Presencial na Secretaria Paroquial',
    };

    // [HARDENED] SEC-001: Disparo direto server-side (sem auto-chamada HTTP para /api/notifications)
    try {
      await dispatchTransactionalNotification({
        type: 'tithe',
        protocol,
        parishionerName: fullName,
        parishionerPhone: phone,
        parishionerEmail: email || undefined,
        preferredMethodLabel: methodLabels[preferredPaymentMethod] || 'PIX',
        preferredDay: registrationData.preferred_day,
        communityName,
        notes: notes || undefined,
      });
    } catch (notifyErr: unknown) {
      console.warn('Alerta ao disparar notificação de dízimo:', notifyErr);
    }

    return NextResponse.json({
      success: true,
      protocol,
      dbSuccess: true,
      registrationId: data.id,
      message: 'Adesão ao Dízimo registrada com sucesso!',
    });
  } catch (error: unknown) {
    console.error('Erro na API de cadastro de dizimista:', error);
    return NextResponse.json(
      { error: 'Falha interna ao processar adesão.' },
      { status: 500 }
    );
  }
}
