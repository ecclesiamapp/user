import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { generateEmbedding } from "@/lib/ai/embeddings";
import {
  generateParishAssistantResponse,
  ChatMessage,
  MatchedKnowledgeChunk,
} from "@/lib/ai/gemini";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/ai-assistant
 * Retorna as informações do motor de IA ativo e modelos configurados.
 */
export async function GET() {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY
  );

  return NextResponse.json({
    status: "online",
    service: "Ecclesiam Parochial AI Assistant",
    engine: "Google Gemini 2.5 Flash",
    embedding_model: "Google text-embedding-004",
    api_key_configured: hasKey,
    canonical_protection: true,
  });
}

/**
 * POST /api/admin/ai-assistant
 * Recebe a pergunta da secretária, recupera o contexto semântico via pgvector
 * e devolve a resposta gerada pelo Google Gemini com citação de fontes.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const {
      message,
      history = [],
      parish_id,
      match_count = 5,
      similarity_threshold = 0.45,
    } = body as {
      message?: string;
      history?: ChatMessage[];
      parish_id?: string;
      match_count?: number;
      similarity_threshold?: number;
    };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A mensagem do usuário é obrigatória." },
        { status: 400 }
      );
    }

    // 1. Identificar a Paróquia
    let parishQuery = supabase.from("parishes").select("id, name, slug");
    if (parish_id) {
      parishQuery = parishQuery.eq("id", parish_id);
    } else {
      parishQuery = parishQuery.limit(1);
    }

    const { data: parishes, error: parishError } = await parishQuery;
    if (parishError || !parishes || parishes.length === 0) {
      return NextResponse.json(
        { error: "Paróquia não identificada." },
        { status: 404 }
      );
    }

    const parish = parishes[0];

    // 2. Gerar Vetor de Busca Semântica (768d)
    const queryEmbedding = await generateEmbedding(message.trim());

    // 3. Executar Busca por Similaridade na RPC Supabase pgvector
    const { data: matchedChunks, error: rpcError } = await supabase.rpc(
      "match_parish_knowledge",
      {
        query_embedding: queryEmbedding,
        filter_parish_id: parish.id,
        match_count: match_count,
        similarity_threshold: similarity_threshold,
      }
    );

    if (rpcError) {
      console.error("[RPC match_parish_knowledge Error]:", rpcError);
    }

    // 4. Gerar Resposta Assistida via Gemini 2.5 Flash
    const assistantResult = await generateParishAssistantResponse({
      message: message.trim(),
      history,
      contextChunks: (matchedChunks as MatchedKnowledgeChunk[]) || [],
      parishName: parish.name,
    });

    return NextResponse.json({
      success: true,
      answer: assistantResult.answer,
      sources: assistantResult.sources,
      suggested_draft: assistantResult.suggested_draft || null,
      parish: {
        id: parish.id,
        name: parish.name,
      },
      matches_found: matchedChunks ? matchedChunks.length : 0,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("[AI Assistant Route Error]:", errorMsg);
    return NextResponse.json(
      { error: `Falha ao processar consulta da IA: ${errorMsg}` },
      { status: 500 }
    );
  }
}
