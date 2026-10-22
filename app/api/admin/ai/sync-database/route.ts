import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import {
  generateBatchEmbeddings,
  knowledgeFormatters,
  TextChunk,
} from "@/lib/ai/embeddings";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/ai/sync-database
 * Retorna o status atual dos embeddings e documentos indexados na base de conhecimento.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const parishId = searchParams.get("parish_id");

    // Identifica a paróquia alvo
    let parishQuery = supabase.from("parishes").select("id, name, slug");
    if (parishId) {
      parishQuery = parishQuery.eq("id", parishId);
    } else {
      parishQuery = parishQuery.limit(1);
    }

    const { data: parishes, error: parishError } = await parishQuery;
    if (parishError || !parishes || parishes.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma paróquia encontrada." },
        { status: 404 }
      );
    }

    const currentParish = parishes[0];

    // Estatísticas da base vetorial
    const { count: totalEmbeddings, error: countErr } = await supabase
      .from("parish_knowledge_embeddings")
      .select("*", { count: "exact", head: true })
      .eq("parish_id", currentParish.id);

    const { data: sourcesData } = await supabase
      .from("parish_knowledge_embeddings")
      .select("source_type, reference_table, created_at")
      .eq("parish_id", currentParish.id)
      .order("created_at", { ascending: false });

    // Estatísticas de documentos
    const { count: totalDocuments } = await supabase
      .from("parish_knowledge_documents")
      .select("*", { count: "exact", head: true })
      .eq("parish_id", currentParish.id);

    const bySource: Record<string, number> = {};
    const byTable: Record<string, number> = {};
    let lastSyncAt: string | null = null;

    if (sourcesData && sourcesData.length > 0) {
      lastSyncAt = sourcesData[0].created_at;
      for (const row of sourcesData) {
        bySource[row.source_type] = (bySource[row.source_type] || 0) + 1;
        if (row.reference_table) {
          byTable[row.reference_table] = (byTable[row.reference_table] || 0) + 1;
        }
      }
    }

    return NextResponse.json({
      success: true,
      parish: {
        id: currentParish.id,
        name: currentParish.name,
        slug: currentParish.slug,
      },
      stats: {
        total_embeddings: totalEmbeddings || 0,
        total_documents: totalDocuments || 0,
        by_source: bySource,
        by_table: byTable,
        last_sync_at: lastSyncAt,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Falha ao consultar status de indexação: ${message}` },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/ai/sync-database
 * Executa a ingestão híbrida completa: lê as tabelas relacionais da paróquia,
 * formata chunks enriquecidos, calcula os vetores com Google text-embedding-004
 * e persiste no banco Supabase com isolamento por parish_id.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    let body: { parish_id?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Body vazio: utiliza paróquia padrão
    }

    // 1. Identificar a Paróquia
    let parishQuery = supabase.from("parishes").select("*");
    if (body.parish_id) {
      parishQuery = parishQuery.eq("id", body.parish_id);
    } else {
      parishQuery = parishQuery.limit(1);
    }

    const { data: parishes, error: parishError } = await parishQuery;
    if (parishError || !parishes || parishes.length === 0) {
      return NextResponse.json(
        { error: "Paróquia não encontrada para sincronização." },
        { status: 404 }
      );
    }

    const parish = parishes[0];
    const chunks: TextChunk[] = [];
    const breakdown = {
      parish_info: 0,
      clergy: 0,
      communities: 0,
      schedules: 0,
      messages: 0,
    };

    // 2. Coletar Informações Gerais da Paróquia
    chunks.push(knowledgeFormatters.parish(parish));
    breakdown.parish_info++;

    // 3. Coletar Clero Oficial
    const { data: clergyList } = await supabase
      .from("clergy")
      .select("*")
      .eq("parish_id", parish.id)
      .eq("is_active", true);

    if (clergyList && clergyList.length > 0) {
      for (const priest of clergyList) {
        chunks.push(knowledgeFormatters.clergy(priest));
        breakdown.clergy++;
      }
    }

    // 4. Coletar Comunidades / CEBs
    const { data: communitiesList } = await supabase
      .from("communities")
      .select("*")
      .eq("parish_id", parish.id)
      .eq("is_active", true);

    const communityMap = new Map<string, string>();
    if (communitiesList && communitiesList.length > 0) {
      for (const comm of communitiesList) {
        communityMap.set(comm.id, comm.name);
        chunks.push(knowledgeFormatters.community(comm));
        breakdown.communities++;
      }
    }

    // 5. Coletar Horários de Missas e Celebrações
    const { data: schedulesList } = await supabase
      .from("mass_schedules")
      .select("*")
      .eq("parish_id", parish.id)
      .eq("is_active", true);

    if (schedulesList && schedulesList.length > 0) {
      for (const sched of schedulesList) {
        const commName = sched.community_id
          ? communityMap.get(sched.community_id) || "Comunidade"
          : "Igreja Matriz";
        chunks.push(knowledgeFormatters.schedule(sched, commName));
        breakdown.schedules++;
      }
    }

    // 6. Coletar Mensagens Pastorais Relevantes
    const { data: messagesList } = await supabase
      .from("pastoral_messages")
      .select("*")
      .eq("parish_id", parish.id)
      .eq("is_active", true)
      .limit(20);

    if (messagesList && messagesList.length > 0) {
      for (const msg of messagesList) {
        chunks.push(knowledgeFormatters.pastoralMessage(msg));
        breakdown.messages++;
      }
    }

    if (chunks.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Nenhum dado relacional disponível para indexação.",
        total_chunks: 0,
      });
    }

    // 7. Gerar Embeddings em Lote com Google text-embedding-004
    const textsToEmbed = chunks.map(
      (c) => `${c.title}\n\n${c.content}`
    );

    const embeddings = await generateBatchEmbeddings(textsToEmbed);

    // 8. Limpar Embeddings Anteriores do Tipo 'database_sync' para Esta Paróquia
    await supabase
      .from("parish_knowledge_embeddings")
      .delete()
      .eq("parish_id", parish.id)
      .eq("source_type", "database_sync");

    // 9. Persistir os Novos Embeddings no Supabase
    const rowsToInsert = chunks.map((chunk, index) => ({
      parish_id: parish.id,
      source_type: chunk.sourceType,
      reference_table: chunk.referenceTable || null,
      reference_id: chunk.referenceId || null,
      title: chunk.title,
      content: chunk.content,
      metadata: chunk.metadata || {},
      embedding: embeddings[index],
    }));

    // Inserção em lotes de 100 para segurança de payload
    const CHUNK_INSERT_SIZE = 100;
    for (let i = 0; i < rowsToInsert.length; i += CHUNK_INSERT_SIZE) {
      const slice = rowsToInsert.slice(i, i + CHUNK_INSERT_SIZE);
      const { error: insertErr } = await supabase
        .from("parish_knowledge_embeddings")
        .insert(slice);

      if (insertErr) {
        console.error("[Sync RAG DB Error]:", insertErr);
        throw new Error(`Erro ao salvar embeddings no banco: ${insertErr.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Ingestão híbrida concluída com sucesso.",
      parish: {
        id: parish.id,
        name: parish.name,
      },
      total_chunks: chunks.length,
      breakdown,
      synced_at: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("[AI Sync Database Handler Error]:", message);
    return NextResponse.json(
      { error: `Falha na sincronização vetorial: ${message}` },
      { status: 500 }
    );
  }
}
