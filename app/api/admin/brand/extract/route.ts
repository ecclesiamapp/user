import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  extractBrandFromManualBuffer, 
  convertExtractionToBrandIdentity,
  ExtractedBrandData 
} from '@/lib/ai/brand-extractor';
import { CATEDRAL_PARISH_ID } from '@/lib/brand';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, serviceKey);
}

/**
 * POST /api/admin/brand/extract
 * 
 * Endpoint para ingestão e extração inteligente de manuais de marca (PDF ou imagem)
 * via Google Gemini 2.5 Flash Multimodal.
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer | null = null;
    let mimeType = 'application/pdf';
    let filename = 'manual_marca.pdf';
    let parishId = CATEDRAL_PARISH_ID;
    let uploadedFileUrl = '';

    const supabase = getSupabaseAdmin();

    // 1. Processamento via Multipart FormData (Upload de arquivo direto)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = (formData.get('file') || formData.get('manual_file')) as File | null;
      const paramParishId = formData.get('parish_id') as string | null;
      if (paramParishId) parishId = paramParishId;

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
    // 2. Processamento via JSON (Base64 ou URL remota)
    else if (contentType.includes('application/json')) {
      const body = await req.json();
      if (body.parishId) parishId = body.parishId;

      if (body.fileUrl) {
        uploadedFileUrl = body.fileUrl;
        const response = await fetch(body.fileUrl);
        if (!response.ok) {
          return NextResponse.json(
            { error: `Não foi possível baixar o arquivo da URL fornecida (${response.status}).` },
            { status: 400 }
          );
        }
        const arrayBuf = await response.arrayBuffer();
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
  } catch (error: any) {
    console.error('[Brand Extract API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Falha ao processar e extrair identidade do manual.',
      },
      { status: 500 }
    );
  }
}
