import { NextRequest, NextResponse } from 'next/server';
import {
  extractBrandFromManualBuffer,
  convertExtractionToBrandIdentity,
  ExtractedBrandData,
} from '@/lib/ai/brand-extractor';
import { requireAuthenticatedAdmin } from '@/lib/security/serverAuth';
import { createAdminClient } from '@/utils/supabase/admin';
import type { UserRole } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BRAND_ALLOWED_ROLES: UserRole[] = [
  'superadmin',
  'paroco',
  'secretaria',
  'pascom',
];

const MAX_REMOTE_ASSET_BYTES = 25 * 1024 * 1024; // 25 MB

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

  // Bloqueia IPs IPv4 privados / loopback / link-local / cloud metadata (169.254.x.x)
  const ipv4Match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(lower);
  if (ipv4Match) {
    const [a, b] = [Number(ipv4Match[1]), Number(ipv4Match[2])];
    if (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    ) {
      return true;
    }
  }

  // Bloqueia prefixos IPv6 locais
  if (
    lower.startsWith('fe80:') ||
    lower.startsWith('fc00:') ||
    lower.startsWith('fd')
  ) {
    return true;
  }

  return false;
}

function validateSafeRemoteUrl(rawUrl: string): URL | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return null;
    if (isPrivateOrBlockedHostname(parsed.hostname)) return null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const supabaseHost = new URL(supabaseUrl).hostname;
      if (parsed.hostname === supabaseHost) {
        return parsed;
      }
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

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
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
        const safeUrl = validateSafeRemoteUrl(String(body.fileUrl));
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
        buffer = Buffer.from(body.fileBase64, 'base64');
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
