/**
 * Cliente e Orquestrador Google Gemini — Ecclesiam App
 * FASE 5: Inteligência Paroquial & Assistente IA (TASK-34)
 *
 * Utiliza o modelo Gemini 2.5 Flash para geração de respostas contextuais,
 * síntese de diretrizes e rascunhos pastorais para a secretaria paroquial.
 */

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface MatchedKnowledgeChunk {
  id: string;
  document_id?: string | null;
  source_type: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown> | null;
  similarity: number;
}

export interface AssistantResponse {
  answer: string;
  sources: {
    title: string;
    source_type: string;
    similarity: number;
  }[];
  suggested_draft?: string | null;
}

const GEMINI_MODEL = 'gemini-2.5-flash';

function getGeminiApiKey(): string | null {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    null
  );
}

/**
 * Prompt de Sistema Canônico & Pastoral — Copilot da Secretaria
 */
export const SYSTEM_PROMPT_PARISH_COPILOT = `
Você é o Assistente Paroquial Inteligente do Ecclesiam App, operando a serviço da secretaria da Paróquia Sagrado Coração de Jesus — Catedral de Colatina (Diocese de Colatina/ES).

Suas diretrizes fundamentais:
1. DIRETRIZ CANÔNICA E LITÚRGICA:
   - NUNCA utilize o termo "culto". Utilize sempre "Santa Missa" (ou "Missas") e "Celebração da Palavra" (ou "Celebrações").
   - Trate os sacerdotes pelos seus títulos e nomes corretos: Pároco Pe. Irineu Claudino Sales, Vigários Paroquiais Pe. Adilson Ramos de Melo, Pe. Deivid José Langa Lopes e Pe. Ernandes Samuel Fantin.
   - O Bispo Diocesano é Dom Lauro Versiani Barbosa.
   - Mantenha tom solene, pastoral, acolhedor, gentil, discreto e eficiente.

2. CONTEXTO RECUPERADO (RAG):
   - Você receberá trechos da Base de Conhecimento da Paróquia (horários, 12 comunidades/CEBs, diretrizes diocesanas de sacramentos, etc.).
   - Baseie suas respostas prioritariamente nos fatos presentes no contexto.
   - Se o contexto não contiver a resposta com segurança, informe com caridade que a informação não consta na base atual e recomende consultar o Pároco Pe. Irineu ou o arquivo da secretaria.
   - NUNCA invente horários, taxas ou regras sacramentais que não estejam no contexto.

3. GERAÇÃO DE RASCUNHOS DE AVISOS:
   - Se a secretária solicitar um rascunho de aviso, comunicado para o mural ou mensagem para o WhatsApp das pastorais, elabore um texto pronto, elegante e pastoral, delimitando-o em um bloco destacado.

4. IDIOMA:
   - Português do Brasil, com pontuação impecável e vocabulário católico formal e acolhedor.
`.trim();

/**
 * Gera resposta de chat contextualizada com Google Gemini 2.5 Flash
 */
export async function generateParishAssistantResponse(params: {
  message: string;
  history?: ChatMessage[];
  contextChunks: MatchedKnowledgeChunk[];
  parishName?: string;
}): Promise<AssistantResponse> {
  const { message, history = [], contextChunks, parishName = 'Catedral de Colatina' } = params;
  const apiKey = getGeminiApiKey();

  // Formata as fontes consultadas para retorno na UI
  const sources = contextChunks.map((c) => ({
    title: c.title,
    source_type: c.source_type,
    similarity: Math.round(c.similarity * 100) / 100,
  }));

  // Monta a injeção de contexto RAG
  const contextText = contextChunks.length > 0
    ? contextChunks
        .map(
          (c, idx) =>
            `[DOCUMENTO/FONTE ${idx + 1}: ${c.title} (Relevância: ${Math.round(
              c.similarity * 100
            )}%)]\n${c.content}`
        )
        .join('\n\n---\n\n')
    : 'Nenhum documento específico encontrado com alta relevância para esta consulta.';

  // Fallback caso a chave do Gemini não esteja configurada no ambiente
  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'GEMINI_API_KEY não configurada no ambiente de produção. Impossível gerar resposta da IA.'
      );
    }

    return generateLocalFallbackResponse(message, contextChunks, parishName);
  }

  // Monta o payload para a API do Google Gemini
  const contents = [];

  // Adiciona histórico anterior
  for (const h of history.slice(-6)) {
    contents.push({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.content }],
    });
  }

  // Prompt final do usuário com contexto injetado
  const userPromptWithContext = `
CONTEXTO DA BASE DE CONHECIMENTO PAROQUIAL:
${contextText}

---

PERGUNTA DA SECRETARIA PAROQUIAL (${parishName}):
${message}
`.trim();

  contents.push({
    role: 'user',
    parts: [{ text: userPromptWithContext }],
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT_PARISH_COPILOT }],
      },
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Google Gemini Error ${response.status}]:`, errorBody);
    throw new Error(
      `Falha na comunicação com Google Gemini (${response.status}): ${errorBody}`
    );
  }

  const data = await response.json();
  const rawAnswer =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    'Não foi possível formular uma resposta neste momento.';

  // Detecção opcional de bloco de rascunho na resposta
  const draftMatch = rawAnswer.match(/```(?:aviso|rascunho|texto)?\n([\s\S]*?)```/i);
  const suggestedDraft = draftMatch ? draftMatch[1].trim() : null;

  return {
    answer: rawAnswer,
    sources,
    suggested_draft: suggestedDraft,
  };
}

/**
 * Resposta de fallback inteligente para testes e desenvolvimento sem chave ativa
 */
function generateLocalFallbackResponse(
  message: string,
  contextChunks: MatchedKnowledgeChunk[],
  parishName: string
): AssistantResponse {
  const sources = contextChunks.map((c) => ({
    title: c.title,
    source_type: c.source_type,
    similarity: Math.round(c.similarity * 100) / 100,
  }));

  if (contextChunks.length === 0) {
    return {
      answer: `Paz e bem! Consultando a base de dados da ${parishName}, não localizei registros diretos para a sua dúvida: "${message}". Recomendo verificar com o Pe. Irineu ou na secretaria paroquial.\n\n*(Nota: Configure a GEMINI_API_KEY no arquivo .env.local para habilitar a geração livre via Gemini 2.5 Flash)*.`,
      sources: [],
    };
  }

  const top = contextChunks[0];
  let answer = `Paz e bem! Localizei na base de conhecimento da ${parishName} as seguintes informações oficiais sobre sua consulta:\n\n`;
  answer += `**${top.title}**\n\n`;
  answer += `${top.content}\n\n`;

  if (contextChunks.length > 1) {
    answer += `*Também consultei:* ${contextChunks
      .slice(1)
      .map((c) => c.title)
      .join(', ')}.\n\n`;
  }

  answer += `*(Ambiente de Desenvolvimento: resposta sintetizada a partir da base vetorial do Supabase. Para síntese generativa completa, adicione GEMINI_API_KEY em .env.local)*.`;

  return {
    answer,
    sources,
  };
}
