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

const SACRAMENTS_RATE_CFG = {
  maxAttempts: 10,
  windowMs: 10 * 60 * 1000,
  lockoutMs: 5 * 60 * 1000,
};

const VALID_SACRAMENT_TYPES = new Set([
  'batismo',
  'eucaristia',
  'crisma',
  'noivos',
  'gestantes',
]);

interface SacramentRequestBody {
  parish_id?: string;
  community_id?: string | null;
  sacrament_type?: string;
  applicant_name?: string;
  applicant_phone?: string;
  applicant_email?: string | null;
  applicant_role?: string;
  candidate_name?: string | null;
  candidate_birth_date?: string | null;
  preferred_date?: string | null;
  details?: Record<string, unknown>;
  notes?: string | null;
  sacrament_title?: string;
  community_name?: string | null;
  idempotency_key?: string;
}

/**
 * [HARDENED] VAL-001 / SEC-001:
 * Endpoint server-side para inscrições sacramentais com idempotência, rate limit e notificação interna.
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = extractClientIp(req.headers);
    const rateKey = `sacraments:${clientIp}`;
    const rateStatus = checkServerRateLimit(rateKey, SACRAMENTS_RATE_CFG);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { ok: false, error: 'Muitas solicitações em sequência. Aguarde alguns minutos.' },
        { status: 429 }
      );
    }

    const body = (await req.json().catch(() => null)) as SacramentRequestBody | null;
    if (!body) {
      return NextResponse.json(
        { ok: false, error: 'Corpo da requisição inválido.' },
        { status: 400 }
      );
    }

    const parishId = (body.parish_id || '').trim();
    const sacramentType = (body.sacrament_type || '').trim();
    const applicantName = (body.applicant_name || '').trim();
    const applicantPhone = (body.applicant_phone || '').trim();
    const idempotencyKey = (body.idempotency_key || '').trim();

    if (!parishId || !VALID_SACRAMENT_TYPES.has(sacramentType)) {
      return NextResponse.json(
        { ok: false, error: 'Tipo de inscrição sacramental ou paróquia inválida.' },
        { status: 400 }
      );
    }

    if (!applicantName || applicantPhone.replace(/\D/g, '').length < 8) {
      return NextResponse.json(
        { ok: false, error: 'Informe nome completo e telefone/WhatsApp válido.' },
        { status: 400 }
      );
    }

    if (!isValidIdempotencyKey(idempotencyKey)) {
      return NextResponse.json(
        { ok: false, error: 'Chave de idempotência ausente ou em formato inválido.' },
        { status: 400 }
      );
    }

    recordServerRateLimitFailure(rateKey, SACRAMENTS_RATE_CFG);

    const { result, deduplicated } = await runWithIdempotency(
      `sacraments:${parishId}`,
      idempotencyKey,
      async () => {
        const cookieStore = await cookies();
        const useAdmin = hasServiceRoleKey();
        const supabase = useAdmin ? createAdminClient() : createClient(cookieStore);

        const payload = {
          parish_id: parishId,
          community_id: body.community_id || null,
          sacrament_type: sacramentType,
          status: 'pendente',
          applicant_name: applicantName,
          applicant_phone: applicantPhone,
          applicant_email: body.applicant_email?.trim() || null,
          applicant_role: body.applicant_role || 'proprio',
          candidate_name: body.candidate_name?.trim() || null,
          candidate_birth_date: body.candidate_birth_date || null,
          preferred_date: body.preferred_date || null,
          details: body.details && typeof body.details === 'object' ? body.details : {},
          notes: body.notes?.trim() || null,
        };

        let generatedProtocol = `SAC-${new Date().getFullYear()}-${Math.random()
          .toString(36)
          .slice(2, 8)
          .toUpperCase()}`;

        if (useAdmin) {
          const { data: record, error } = await supabase
            .from('sacramental_registrations')
            .insert([payload])
            .select('id')
            .single();
          if (error || !record) {
            throw error || new Error('Erro ao gravar inscrição sacramental.');
          }
          generatedProtocol = `SAC-${new Date().getFullYear()}-${record.id
            .slice(0, 6)
            .toUpperCase()}`;
        } else {
          const { error } = await supabase
            .from('sacramental_registrations')
            .insert([payload]);
          if (error) throw error;
        }

        try {
          await dispatchTransactionalNotification({
            type: 'sacrament',
            protocol: generatedProtocol,
            applicantName,
            applicantPhone,
            applicantEmail: body.applicant_email?.trim() || undefined,
            sacramentTitle: body.sacrament_title || 'Inscrição Sacramental',
            candidateName: body.candidate_name?.trim() || undefined,
            communityName: body.community_name?.trim() || undefined,
            preferredDate: body.preferred_date || undefined,
            extraSummary: body.notes?.trim() || undefined,
          });
        } catch (notifErr) {
          console.warn('[api/secretaria/sacraments] Alerta silencioso de notificação:', notifErr);
        }

        return { protocol: generatedProtocol };
      }
    );

    return NextResponse.json({
      ok: true,
      protocol: result.protocol,
      deduplicated,
    });
  } catch (err: unknown) {
    console.error('[api/secretaria/sacraments] Erro ao registrar inscrição:', err);
    return NextResponse.json(
      {
        ok: false,
        error: toFriendlyErrorMessage(
          err,
          'Ocorreu um erro ao gravar sua inscrição. Tente novamente.'
        ),
      },
      { status: 500 }
    );
  }
}
