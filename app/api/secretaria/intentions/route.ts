import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient, hasServiceRoleKey } from '@/utils/supabase/admin';
import { isValidIdempotencyKey, runWithIdempotency } from '@/lib/security/idempotency';
import { toFriendlyErrorMessage } from '@/lib/security/friendlyError';

export const dynamic = 'force-dynamic';

const MAX_SUBMISSIONS_PER_CELEBRATION = 3;

interface IntentionEntryPayload {
  type: string;
  names: string[];
}

interface IntentionsRequestBody {
  parish_id?: string;
  community_id?: string | null;
  celebration_date?: string;
  celebration_time?: string;
  entries?: IntentionEntryPayload[];
  offered_by?: string;
  contact_phone?: string | null;
  contact_email?: string | null;
  is_anonymous?: boolean;
  notes?: string | null;
  idempotency_key?: string;
}

class LimitExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LimitExceededError';
  }
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
    const body = (await req.json().catch(() => null)) as IntentionsRequestBody | null;
    if (!body) {
      return NextResponse.json(
        { ok: false, error: 'Corpo da requisição inválido.' },
        { status: 400 }
      );
    }

    const parishId = (body.parish_id || '').trim();
    const celebrationDate = (body.celebration_date || '').trim();
    const celebrationTime = (body.celebration_time || '').trim();
    const idempotencyKey = (body.idempotency_key || '').trim();
    const entries = Array.isArray(body.entries)
      ? body.entries
          .map((e) => ({
            type: String(e?.type || '').trim(),
            names: Array.isArray(e?.names)
              ? e.names.map((n) => String(n || '').trim()).filter(Boolean)
              : [],
          }))
          .filter((e) => e.type && e.names.length > 0)
      : [];

    if (!parishId || !celebrationDate || !celebrationTime) {
      return NextResponse.json(
        { ok: false, error: 'Informe a data e o horário da Santa Missa.' },
        { status: 400 }
      );
    }

    if (entries.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Informe ao menos um nome ou intenção para a Santa Missa.' },
        { status: 400 }
      );
    }

    if (!isValidIdempotencyKey(idempotencyKey)) {
      return NextResponse.json(
        { ok: false, error: 'Chave de idempotência ausente ou em formato inválido.' },
        { status: 400 }
      );
    }

    const contactPhone = body.contact_phone?.trim() || null;
    const cleanPhone = contactPhone ? contactPhone.replace(/\D/g, '') : '';
    const isAnonymous = Boolean(body.is_anonymous);
    const resolvedOfferedBy = isAnonymous
      ? 'Anônimo'
      : (body.offered_by || '').trim() || 'Fiel da Comunidade';

    const { result, deduplicated } = await runWithIdempotency(
      `intentions:${parishId}`,
      idempotencyKey,
      async () => {
        const cookieStore = await cookies();
        const useAdmin = hasServiceRoleKey();
        const supabase = useAdmin ? createAdminClient() : createClient(cookieStore);

        if (cleanPhone && contactPhone) {
          const { data: existingRows } = await supabase
            .from('mass_intentions')
            .select('protocol_code')
            .eq('parish_id', parishId)
            .eq('celebration_date', celebrationDate)
            .eq('celebration_time', celebrationTime)
            .eq('contact_phone', contactPhone)
            .neq('status', 'cancelada');

          const distinctProtocols = new Set(
            (existingRows || []).map((r) => r.protocol_code).filter(Boolean)
          ).size;

          if (distinctProtocols >= MAX_SUBMISSIONS_PER_CELEBRATION) {
            throw new LimitExceededError(
              `Limite atingido: Você já possui ${distinctProtocols} solicitações registradas para esta mesma celebração (${celebrationTime}h). Para garantir a inclusão harmônica de toda a comunidade no púlpito, o limite é de ${MAX_SUBMISSIONS_PER_CELEBRATION} envios por celebração.`
            );
          }
        }

        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const protocolNumber = `INT-2026-${randomCode}`;

        const baseRows = entries.map((entry) => ({
          parish_id: parishId,
          community_id: body.community_id || null,
          celebration_date: celebrationDate,
          celebration_time: celebrationTime,
          intention_type: entry.type,
          intention_for: entry.names.join(', '),
          offered_by: resolvedOfferedBy,
          contact_phone: contactPhone,
          contact_email: body.contact_email?.trim() || null,
          is_anonymous: isAnonymous,
          protocol: protocolNumber,
          protocol_code: protocolNumber,
          notes: body.notes?.trim() || null,
          status: 'pendente',
        }));

        let { error: insertError } = await supabase
          .from('mass_intentions')
          .insert(baseRows.map((row) => ({ ...row, idempotency_key: idempotencyKey })));

        if (isMissingColumnError(insertError)) {
          const retry = await supabase.from('mass_intentions').insert(baseRows);
          insertError = retry.error;
        }

        if (insertError) {
          if (insertError.code === '23505') {
            let existingProtocol = protocolNumber;
            if (useAdmin) {
              const { data: existingRow } = await supabase
                .from('mass_intentions')
                .select('protocol_code')
                .eq('parish_id', parishId)
                .eq('idempotency_key', idempotencyKey)
                .limit(1)
                .maybeSingle();
              if (existingRow?.protocol_code) {
                existingProtocol = existingRow.protocol_code;
              }
            }
            return { protocol: existingProtocol, dbDeduplicated: true };
          }
          throw insertError;
        }

        return { protocol: protocolNumber, dbDeduplicated: false };
      }
    );

    return NextResponse.json({
      ok: true,
      protocol: result.protocol,
      deduplicated: deduplicated || result.dbDeduplicated,
    });
  } catch (err: unknown) {
    if (err instanceof LimitExceededError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 429 });
    }
    console.error('[api/secretaria/intentions] Erro ao registrar intenções:', err);
    return NextResponse.json(
      {
        ok: false,
        error: toFriendlyErrorMessage(
          err,
          'Ocorreu um erro ao enviar suas intenções. Tente novamente.'
        ),
      },
      { status: 500 }
    );
  }
}

