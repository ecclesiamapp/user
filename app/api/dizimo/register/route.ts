import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      parishId,
      communityId,
      fullName,
      phone,
      email,
      birthDate,
      address,
      neighborhood,
      preferredPaymentMethod,
      preferredDay,
      notes,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Nome completo e telefone/WhatsApp são obrigatórios.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Gerar protocolo formal de adesão
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const protocol = `DIZ-${new Date().getFullYear()}-${randomSuffix}`;

    const registrationData = {
      parish_id: parishId || 'c0000000-0000-0000-0000-000000000001',
      community_id: communityId || null,
      full_name: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : null,
      birth_date: birthDate || null,
      address: address ? address.trim() : null,
      neighborhood: neighborhood ? neighborhood.trim() : null,
      preferred_payment_method: preferredPaymentMethod || 'pix',
      preferred_day: preferredDay ? Number(preferredDay) : 10,
      status: 'pendente',
      notes: notes ? `${notes} (Protocolo: ${protocol})` : `Protocolo: ${protocol}`,
    };

    // Tentar persistir no Supabase
    let dbSuccess = false;
    let dbId: string | null = null;

    try {
      const { data, error: dbError } = await supabase
        .from('tithe_registrations')
        .insert(registrationData)
        .select('id')
        .single();

      if (!dbError && data) {
        dbSuccess = true;
        dbId = data.id;
      } else if (dbError) {
        console.warn('Alerta Supabase tithe_registrations:', dbError.message);
      }
    } catch (err: any) {
      console.warn('Exceção Supabase tithe_registrations:', err.message);
    }

    // Disparar notificações transacionais em background
    const methodLabels: Record<string, string> = {
      pix: 'PIX Instantâneo',
      envelope: 'Envelope Mensal nas Santas Missas',
      transferencia: 'Transferência Bancária / TED',
      debito: 'Débito / Cartão',
      secretaria: 'Presencial na Secretaria Paroquial',
    };

    try {
      const notificationOrigin = req.nextUrl.origin;
      await fetch(`${notificationOrigin}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tithe',
          protocol,
          parishionerName: fullName,
          parishionerPhone: phone,
          parishionerEmail: email,
          preferredMethodLabel: methodLabels[preferredPaymentMethod] || 'PIX',
          preferredDay: preferredDay ? Number(preferredDay) : 10,
          communityName: body.communityName || 'Catedral Matriz',
          notes,
        }),
      });
    } catch (notifyErr: any) {
      console.warn('Erro silencioso ao disparar notificação de dízimo:', notifyErr.message);
    }

    return NextResponse.json({
      success: true,
      protocol,
      dbSuccess,
      registrationId: dbId,
      message: 'Adesão ao Dízimo registrada com sucesso!',
    });
  } catch (error: any) {
    console.error('Erro na API de cadastro de dizimista:', error);
    return NextResponse.json(
      { error: 'Falha interna ao processar adesão.', details: error.message },
      { status: 500 }
    );
  }
}
