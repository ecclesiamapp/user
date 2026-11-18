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

export const dynamic = 'force-dynamic';

const CERTIFICATES_RATE_CFG = {
  maxAttempts: 10,
  windowMs: 10 * 60 * 1000,
  lockoutMs: 5 * 60 * 1000,
};

const VALID_CERT_TYPES = new Set([
  'batismo',
  'crisma',
  'matrimonio',
  'transferencia',
  'outros',
]);

interface CertificateRequestBody {
  parish_id?: string;
  certificate_type?: string;
  applicant_name?: string;
  applicant_phone?: string;
  applicant_email?: string | null;
  applicant_relation?: string;
  holder_name?: string;
  holder_birth_date?: string | null;
  parents_names?: string | null;
  godparents_names?: string | null;
  approximate_year?: number | null;
  community_name?: string | null;
  book_number?: string | null;
  page_number?: string | null;
  entry_number?: string | null;
  purpose?: string | null;
  delivery_preference?: string;
  notes?: string | null;
  idempotency_key?: string;
}

/**
 * [HARDENED] BUG-001 / VAL-001:
 * Endpoint server-side para solicitação pública de certidões sem exigir SELECT anônimo na tabela.
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = extractClientIp(req.headers);
    const rateKey = `certificates:${clientIp}`;
    const rateStatus = checkServerRateLimit(rateKey, CERTIFICATES_RATE_CFG);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { ok: false, error: 'Muitas solicitações em sequência. Aguarde alguns minutos.' },
        { status: 429 }
      );
    }

    const body = (await req.json().catch(() => null)) as CertificateRequestBody | null;
    if (!body) {
      return NextResponse.json(
        { ok: false, error: 'Corpo da requisição inválido.' },
        { status: 400 }
      );
    }

    const parishId = (body.parish_id || '').trim();
    const certType = (body.certificate_type || '').trim();
    const holderName = (body.holder_name || '').trim();
    const applicantName = (body.applicant_name || '').trim();
    const applicantPhone = (body.applicant_phone || '').trim();
    const cleanPhone = applicantPhone.replace(/\D/g, '');
    const idempotencyKey = (body.idempotency_key || '').trim();

    if (!parishId || !VALID_CERT_TYPES.has(certType)) {
      return NextResponse.json(
        { ok: false, error: 'Tipo de certidão ou paróquia inválida.' },
        { status: 400 }
      );
    }

    if (!holderName || !applicantName || cleanPhone.length < 10) {
      return NextResponse.json(
        { ok: false, error: 'Informe nome do titular, solicitante e WhatsApp válido com DDD.' },
        { status: 400 }
      );
    }

    if (!isValidIdempotencyKey(idempotencyKey)) {
      return NextResponse.json(
        { ok: false, error: 'Chave de idempotência ausente ou em formato inválido.' },
        { status: 400 }
      );
    }

    recordServerRateLimitFailure(rateKey, CERTIFICATES_RATE_CFG);

    const { result, deduplicated } = await runWithIdempotency(
      `certificates:${parishId}`,
      idempotencyKey,
      async () => {
        const cookieStore = await cookies();
        const useAdmin = hasServiceRoleKey();
        const supabase = useAdmin ? createAdminClient() : createClient(cookieStore);

        const payload = {
          parish_id: parishId,
          certificate_type: certType,
          applicant_name: applicantName,
          applicant_phone: applicantPhone,
          applicant_email: body.applicant_email?.trim() || null,
          applicant_relation: body.applicant_relation || 'proprio',
          holder_name: holderName,
          holder_birth_date: body.holder_birth_date || null,
          parents_names: body.parents_names?.trim() || null,
          godparents_names: body.godparents_names?.trim() || null,
          approximate_year:
            typeof body.approximate_year === 'number' && Number.isFinite(body.approximate_year)
              ? body.approximate_year
              : null,
          community_name: body.community_name?.trim() || null,
          book_number: body.book_number?.trim() || null,
          page_number: body.page_number?.trim() || null,
          entry_number: body.entry_number?.trim() || null,
          purpose: body.purpose?.trim() || null,
          delivery_preference: body.delivery_preference || 'retirada_presencial',
          notes: body.notes?.trim() || null,
          status: 'pendente',
        };

        if (useAdmin) {
          const { data, error } = await supabase
            .from('certificate_requests')
            .insert([payload])
            .select('id')
            .single();

          if (error || !data) throw error || new Error('Falha ao gravar pedido de certidão.');
          return {
            protocol: `CERT-${new Date().getFullYear()}-${data.id.slice(0, 6).toUpperCase()}`,
          };
        }

        // Sem SERVICE_ROLE_KEY, evita .select() para não violar política INSERT-only de anon
        const fallbackCode = `CERT-${new Date().getFullYear()}-${Math.random()
          .toString(36)
          .slice(2, 8)
          .toUpperCase()}`;
        const { error } = await supabase
          .from('certificate_requests')
          .insert([{ ...payload, notes: payload.notes ? `${payload.notes} [${fallbackCode}]` : `[${fallbackCode}]` }]);
        if (error) throw error;
        return { protocol: fallbackCode };
      }
    );

    return NextResponse.json({
      ok: true,
      protocol: result.protocol,
      deduplicated,
    });
  } catch (err: unknown) {
    console.error('[api/secretaria/certificates] Erro ao registrar certidão:', err);
    return NextResponse.json(
      {
        ok: false,
        error: toFriendlyErrorMessage(err, 'Erro ao registrar solicitação. Tente novamente.'),
      },
      { status: 500 }
    );
  }
}
