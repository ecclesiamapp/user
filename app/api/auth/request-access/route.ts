import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  checkServerRateLimit,
  extractClientIp,
  recordServerRateLimitFailure,
} from '@/lib/security/rateLimit';
import { recordServerAuditEvent } from '@/lib/security/serverAuth';
import type { UserRole } from '@/types';
import { createAdminClient, hasServiceRoleKey } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

const ALLOWED_REQUEST_ROLES: UserRole[] = [
  'coordenador_ceb',
  'pascom',
  'secretaria',
  'vigario',
];

const REQUEST_RATE_CFG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 10 * 60 * 1000,
};

export async function POST(request: NextRequest) {
  try {
    const clientIp = extractClientIp(request.headers);
    const rateKey = `req-access:${clientIp}`;
    const rateStatus = checkServerRateLimit(rateKey, REQUEST_RATE_CFG);

    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Muitas solicitações deste endereço. Aguarde alguns minutos antes de tentar novamente.',
        },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as {
      name?: string;
      email?: string;
      phone?: string;
      role?: string;
      parish_id?: string;
      community_id?: string | null;
      communityHint?: string;
    } | null;

    const cleanName = (body?.name || '').trim();
    const cleanEmail = (body?.email || '').trim().toLowerCase();
    const cleanPhone = (body?.phone || '').trim() || null;
    const requestedRole = (body?.role || 'coordenador_ceb') as UserRole;
    const parishId = (body?.parish_id || '').trim();
    const communityId = body?.community_id ? String(body.community_id).trim() : null;
    const communityHint = (body?.communityHint || '').trim();
    const displayName = communityHint ? `${cleanName} (${communityHint})` : cleanName;

    if (!cleanName || cleanName.length < 3 || !cleanEmail.includes('@') || !parishId) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Preencha nome completo, e-mail válido e paróquia.',
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_REQUEST_ROLES.includes(requestedRole)) {
      return NextResponse.json(
        { ok: false, error: 'Perfil solicitado não permitido pelo formulário.' },
        { status: 400 }
      );
    }

    recordServerRateLimitFailure(rateKey, REQUEST_RATE_CFG);

    const cookieStore = await cookies();
    const writer = hasServiceRoleKey()
      ? createAdminClient()
      : createClient(cookieStore);

    const { error } = await writer.from('user_profiles').insert([
      {
        parish_id: parishId,
        name: displayName,
        email: cleanEmail,
        phone: cleanPhone,
        role: requestedRole,
        community_id: requestedRole === 'coordenador_ceb' ? communityId : null,
        status: 'pendente',
        allowed_modules:
          requestedRole === 'pascom'
            ? ['lp_geral', 'avisos', 'pastorais', 'galerias']
            : ['lp_geral', 'cpc', 'avisos', 'pastorais', 'horarios'],
      },
    ]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Este e-mail já está cadastrado ou possui um pedido de acesso pendente.',
          },
          { status: 409 }
        );
      }

      console.error('[auth/request-access] Erro ao inserir pedido:', error.message);
      return NextResponse.json(
        { ok: false, error: 'Não foi possível registrar seu pedido no momento.' },
        { status: 500 }
      );
    }

    await recordServerAuditEvent({
      email: cleanEmail,
      eventType: 'access_request_submitted',
      parishId,
      role: requestedRole,
      ipHint: clientIp,
      userAgent: request.headers.get('user-agent'),
      metadata: { communityId },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[auth/request-access] Erro interno:', err);
    return NextResponse.json(
      { ok: false, error: 'Erro interno ao enviar solicitação.' },
      { status: 500 }
    );
  }
}
