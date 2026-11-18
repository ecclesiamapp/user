import { NextRequest, NextResponse } from 'next/server';
import dns from 'node:dns/promises';
import net from 'node:net';
import {
  extractBrandFromManualBuffer,
  convertExtractionToBrandIdentity,
  ExtractedBrandData,
} from '@/lib/ai/brand-extractor';
import { requireAuthenticatedAdmin } from '@/lib/security/serverAuth';
import {
  checkServerRateLimit,
  extractClientIp,
  recordServerRateLimitFailure,
} from '@/lib/security/rateLimit';
import { createAdminClient } from '@/utils/supabase/admin';
import type { UserRole } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BRAND_RATE_CFG = {
  maxAttempts: 6,
  windowMs: 5 * 60 * 1000,
  lockoutMs: 5 * 60 * 1000,
};

const BRAND_ALLOWED_ROLES: UserRole[] = [
  'superadmin',
  'paroco',
  'secretaria',
  'pascom',
];

const MAX_REMOTE_ASSET_BYTES = 25 * 1024 * 1024; // 25 MB

function isPrivateIpAddress(ip: string): boolean {
  const lower = ip.toLowerCase().replace(/^\[|\]$/g, '');
  if (net.isIPv4(lower)) {
    const parts = lower.split('.').map(Number);
    const [a, b] = parts;
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    );
  }
  if (net.isIPv6(lower)) {
    return (
      lower === '::1' ||
      lower === '::' ||
      lower.startsWith('fe80:') ||
      lower.startsWith('fc00:') ||
      lower.startsWith('fd') ||
      lower.startsWith('::ffff:127.') ||
      lower.startsWith('::ffff:10.') ||
      lower.startsWith('::ffff:169.254.') ||
      lower.startsWith('::ffff:192.168.')
    );
  }
  return false;
}

function isPrivateOrBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    lower === 'localhost' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal') ||
    lower.endsWith('.localhost')
  ) {
    return true;
  }

  return isPrivateIpAddress(lower);
}

async function validateSafeRemoteUrl(rawUrl: string): Promise<URL | null> {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return null;
    if (isPrivateOrBlockedHostname(parsed.hostname)) return null;

    // [HARDENED] SEC-009: Resolve DNS antes do fetch para bloquear SSRF via DNS rebinding
    const resolved = await dns.lookup(parsed.hostname, { all: true });
    if (!resolved || resolved.length === 0) return null;
    for (const addr of resolved) {
      if (isPrivateIpAddress(addr.address)) return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * POST /api/admin/brand/extract
 *
 * Endpoint autenticado para ingestão e extração inteligente de manuais de marca (PDF ou imagem)
 * via Google Gemini 2.5 Flash Multimodal.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthenticatedAdmin({
      allowedRoles: BRAND_ALLOWED_ROLES,
    });
    if (!auth.ok) return auth.response;

    // [HARDENED] SEC-009: Rate limit em extrações multimodais Gemini
    const clientIp = extractClientIp(req.headers);
    const rateKey = `brand-extract:${auth.user.id}:${clientIp}`;
    const rateStatus = checkServerRateLimit(rateKey, BRAND_RATE_CFG);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { error: 'Muitas extrações de manual em sequência. Aguarde alguns minutos.' },
        { status: 429 }
      );
    }
    recordServerRateLimitFailure(rateKey, BRAND_RATE_CFG);

    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer | null = null;
    let mimeType = 'application/pdf';
    let filename = 'manual_marca.pdf';
    let parishId = auth.parishId || '';
    let uploadedFileUrl = '';

    const supabase = createAdminClient();

    // 1. Processamento via Multipart FormData (Upload de arquivo direto)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = (formData.get('file') || formData.get('manual_file')) as File | null;
      const paramParishId = (formData.get('parish_id') as string | null)?.trim() || null;

      if (paramParishId) {
        if (
          auth.role !== 'superadmin' &&
          auth.parishId &&
          paramParishId !== auth.parishId
        ) {
          return NextResponse.json(
            { error: 'Acesso negado para paróquia de outro locatário.' },
            { status: 403 }
          );
        }
        parishId = paramParishId;
      }

      if (!parishId) {
        return NextResponse.json(
          { error: 'Paróquia de destino não identificada.' },
          { status: 400 }
        );
      }

      if (!file) {
        return NextResponse.json(
          { error: 'Nenhum arquivo enviado no campo "file".' },
          { status: 400 }
        );
      }

      if (file.size > MAX_REMOTE_ASSET_BYTES) {
        return NextResponse.json(
          { error: 'O arquivo enviado excede o limite de 25 MB.' },
          { status: 413 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      if (buffer.byteLength > MAX_REMOTE_ASSET_BYTES) {
        return NextResponse.json(
          { error: 'O arquivo enviado excede o limite de 25 MB.' },
          { status: 413 }
        );
      }
      filename = file.name || 'manual_marca.pdf';
      mimeType = file.type || 'application/pdf';

      // Upload opcional para o Supabase Storage (brand_assets)
      try {
        const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `${parishId}/manuals/${Date.now()}_${safeFilename}`;

        const { error: uploadError } = await supabase.storage
          .from('brand_assets')
          .upload(storagePath, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('brand_assets')
            .getPublicUrl(storagePath);

          uploadedFileUrl = publicUrlData?.publicUrl || '';

          // Atualiza a URL do manual na tabela parishes
          await supabase
            .from('parishes')
            .update({ brand_manual_url: uploadedFileUrl })
            .eq('id', parishId);
        } else {
          console.warn('[Brand Extract Route] Falha ao persistir no Storage:', uploadError.message);
        }
      } catch (uploadErr) {
        console.warn('[Brand Extract Route] Erro no upload para storage:', uploadErr);
      }
    }
    // 2. Processamento via JSON (Base64 ou URL remota validada contra SSRF)
    else if (contentType.includes('application/json')) {
      const body = await req.json();
      const requestedParishId =
        typeof body.parishId === 'string' ? body.parishId.trim() : '';

      if (requestedParishId) {
        if (
          auth.role !== 'superadmin' &&
          auth.parishId &&
          requestedParishId !== auth.parishId
        ) {
          return NextResponse.json(
            { error: 'Acesso negado para paróquia de outro locatário.' },
            { status: 403 }
          );
        }
        parishId = requestedParishId;
      }

      if (!parishId) {
        return NextResponse.json(
          { error: 'Paróquia de destino não identificada.' },
          { status: 400 }
        );
      }

      if (body.fileUrl) {
        const safeUrl = await validateSafeRemoteUrl(String(body.fileUrl));
        if (!safeUrl) {
          return NextResponse.json(
            {
              error:
                'URL de arquivo inválida ou bloqueada pela política de segurança (apenas HTTPS público permitido).',
            },
            { status: 400 }
          );
        }

        uploadedFileUrl = safeUrl.toString();
        const response = await fetch(safeUrl.toString(), {
          redirect: 'error',
        });
        if (!response.ok) {
          return NextResponse.json(
            { error: `Não foi possível baixar o arquivo da URL fornecida (${response.status}).` },
            { status: 400 }
          );
        }
        const contentLen = Number(response.headers.get('content-length') || 0);
        if (contentLen > MAX_REMOTE_ASSET_BYTES) {
          return NextResponse.json(
            { error: 'O arquivo remoto excede o limite de 25 MB.' },
            { status: 413 }
          );
        }
        const arrayBuf = await response.arrayBuffer();
        if (arrayBuf.byteLength > MAX_REMOTE_ASSET_BYTES) {
          return NextResponse.json(
            { error: 'O arquivo remoto excede o limite de 25 MB.' },
            { status: 413 }
          );
        }
        buffer = Buffer.from(arrayBuf);
        mimeType = response.headers.get('content-type') || 'application/pdf';
        filename = body.filename || 'manual_marca.pdf';
      } else if (body.fileBase64) {
        buffer = Buffer.from(String(body.fileBase64), 'base64');
        if (buffer.byteLength > MAX_REMOTE_ASSET_BYTES) {
          return NextResponse.json(
            { error: 'O arquivo Base64 excede o limite de 25 MB.' },
            { status: 413 }
          );
        }
        mimeType = body.mimeType || 'application/pdf';
        filename = body.filename || 'manual_marca.pdf';
      } else {
        return NextResponse.json(
          { error: 'Envie "fileBase64" ou "fileUrl" no payload JSON.' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Content-Type deve ser multipart/form-data ou application/json.' },
        { status: 400 }
      );
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { error: 'O buffer do arquivo está vazio ou inválido.' },
        { status: 400 }
      );
    }

    // 3. Busca o nome da paróquia para contexto do Gemini
    let parishName = 'Catedral Sagrado Coração de Jesus';
    try {
      const { data: parishData } = await supabase
        .from('parishes')
        .select('name')
        .eq('id', parishId)
        .single();

      if (parishData?.name) {
        parishName = parishData.name;
      }
    } catch (dbErr) {
      console.warn('[Brand Extract Route] Aviso ao buscar paróquia:', dbErr);
    }

    // 4. Executa a extração multimodal via Google Gemini 2.5 Flash
    const extractedData: ExtractedBrandData = await extractBrandFromManualBuffer({
      buffer,
      mimeType,
      parishName,
      filename,
    });

    // 5. Monta o BrandIdentity estruturado para o Moodboard
    const brandIdentity = convertExtractionToBrandIdentity(extractedData, uploadedFileUrl);

    return NextResponse.json({
      success: true,
      parish_id: parishId,
      parish_name: parishName,
      filename,
      file_url: uploadedFileUrl || null,
      extracted: extractedData,
      brand_identity: brandIdentity,
      summary: extractedData.summary,
      confidence_score: extractedData.confidence_score,
    });
  } catch (error: unknown) {
    console.error('[Brand Extract API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Falha interna ao processar e extrair identidade do manual.',
      },
      { status: 500 }
    );
  }
}
