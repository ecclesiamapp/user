import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient, hasServiceRoleKey } from '@/utils/supabase/admin';
import { isValidIdempotencyKey, runWithIdempotency } from '@/lib/security/idempotency';
import { toFriendlyErrorMessage } from '@/lib/security/friendlyError';
import {
  checkServerRateLimit,
  extractClientIp,
  recordServerRateLimitFailure,
} from '@/lib/security/rateLimit';
import { dispatchTransactionalNotification } from '@/lib/notifications/dispatchNotification';

export const dynamic = 'force-dynamic';

const APPOINTMENTS_RATE_CFG = {
  maxAttempts: 12,
  windowMs: 10 * 60 * 1000,
  lockoutMs: 5 * 60 * 1000,
};

interface AppointmentRequestBody {
  parish_id?: string;
  clergy_id?: string | null;
  community_id?: string | null;
  parishioner_name?: string;
  parishioner_phone?: string;
  parishioner_email?: string | null;
  community_name?: string | null;
  appointment_type?: string;
  appointment_date?: string;
  appointment_time?: string;
  duration_minutes?: number;
  notes?: string | null;
  appointment_type_label?: string;
  priest_name?: string;
  idempotency_key?: string;
}

function isMissingColumnError(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false;
  return (
    err.code === '42703' ||
    err.code === 'PGRST204' ||
    /idempotency_key/i.test(err.message || '')
  );
}

export async function POST(req: NextRequest) {
  try {
    // [HARDENED] SEC-009: Rate limiting por IP na criação de agendamentos
    const clientIp = extractClientIp(req.headers);
    const rateKey = `appointments:${clientIp}`;
    const rateStatus = checkServerRateLimit(rateKey, APPOINTMENTS_RATE_CFG);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { ok: false, error: 'Muitas solicitações em sequência. Aguarde alguns minutos.' },
        { status: 429 }
      );
    }

    const body = (await req.json().catch(() => null)) as AppointmentRequestBody | null;
    if (!body) {
      return NextResponse.json(
        { ok: false, error: 'Corpo da requisição inválido.' },
        { status: 400 }
      );
    }

    const parishId = (body.parish_id || '').trim();
    const parishionerName = (body.parishioner_name || '').trim();
    const parishionerPhone = (body.parishioner_phone || '').trim();
    const appointmentDate = (body.appointment_date || '').trim();
    const appointmentTime = (body.appointment_time || '').trim();
    const idempotencyKey = (body.idempotency_key || '').trim();

    if (!parishId || !parishionerName || parishionerPhone.length < 8) {
      return NextResponse.json(
        { ok: false, error: 'Por favor, informe seu nome completo e telefone WhatsApp válido.' },
        { status: 400 }
      );
    }

    if (!appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { ok: false, error: 'Por favor, escolha uma data e horário para o atendimento.' },
        { status: 400 }
      );
    }

    if (!isValidIdempotencyKey(idempotencyKey)) {
      return NextResponse.json(
        { ok: false, error: 'Chave de idempotência ausente ou em formato inválido.' },
        { status: 400 }
      );
    }

    recordServerRateLimitFailure(rateKey, APPOINTMENTS_RATE_CFG);

    const { result, deduplicated } = await runWithIdempotency(
      `appointments:${parishId}`,
      idempotencyKey,
      async () => {
        const cookieStore = await cookies();
        const useAdmin = hasServiceRoleKey();
        const supabase = useAdmin ? createAdminClient() : createClient(cookieStore);

        const generatedProtocol = `AG-${new Date().getFullYear().toString().slice(-2)}${String(
          Math.floor(1000 + Math.random() * 9000)
        )}`;

        const basePayload = {
          parish_id: parishId,
          clergy_id: body.clergy_id || null,
          community_id: body.community_id || null,
          parishioner_name: parishionerName,
          parishioner_phone: parishionerPhone,
          parishioner_email: body.parishioner_email?.trim() || null,
          community_name: body.community_name?.trim() || null,
          appointment_type: body.appointment_type || 'atendimento_padre',
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          duration_minutes: typeof body.duration_minutes === 'number' ? body.duration_minutes : 30,
          status: 'pendente',
          notes: body.notes?.trim()
            ? `[Protocolo: ${generatedProtocol}] ${body.notes.trim()}`
            : `[Protocolo: ${generatedProtocol}]`,
        };

        let { error } = await supabase
          .from('pastoral_appointments')
          .insert({ ...basePayload, idempotency_key: idempotencyKey });

        if (isMissingColumnError(error)) {
          const retry = await supabase
            .from('pastoral_appointments')
            .insert(basePayload);
          error = retry.error;
        }

        if (error) {
          if (error.code === '23505') {
            let existingProtocol = generatedProtocol;
            if (useAdmin) {
              const { data: existingRow } = await supabase
                .from('pastoral_appointments')
                .select('notes')
                .eq('parish_id', parishId)
                .eq('idempotency_key', idempotencyKey)
                .maybeSingle();
              const match = existingRow?.notes?.match(/\[Protocolo:\s*([^\]]+)\]/i);
              if (match?.[1]) {
                existingProtocol = match[1].trim();
              }
            }
            return { protocol: existingProtocol, dbDeduplicated: true };
          }
          throw error;
        }

        // [HARDENED] SEC-001: Disparo direto server-side sem chamar /api/notifications via HTTP
        try {
          await dispatchTransactionalNotification({
            type: 'appointment',
            protocol: generatedProtocol,
            parishionerName,
            parishionerPhone,
            parishionerEmail: body.parishioner_email?.trim() || undefined,
            appointmentTypeLabel: body.appointment_type_label || 'Atendimento Pastoral',
            priestName: body.priest_name || 'Qualquer Sacerdote Disponível',
            formattedDate: appointmentDate.split('-').reverse().join('/'),
            time: appointmentTime,
            communityName: body.community_name || 'Catedral Diocesana',
            notes: body.notes?.trim() || undefined,
          });
        } catch (notifErr) {
          console.warn('[api/secretaria/appointments] Alerta silencioso de notificação:', notifErr);
        }

        return { protocol: generatedProtocol, dbDeduplicated: false };
      }
    );

    return NextResponse.json({
      ok: true,
      protocol: result.protocol,
      deduplicated: deduplicated || result.dbDeduplicated,
    });
  } catch (err: unknown) {
    console.error('[api/secretaria/appointments] Erro ao registrar agendamento:', err);
    return NextResponse.json(
      {
        ok: false,
        error: toFriendlyErrorMessage(
          err,
          'Não foi possível gravar o agendamento no momento. Tente novamente ou contate a secretaria.'
        ),
      },
      { status: 500 }
    );
  }
}

