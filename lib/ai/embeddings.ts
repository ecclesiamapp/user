/**
 * Utilitários de Geração de Embeddings & Chunking Semântico
 * Ecclesiam App — FASE 5 (TASK-33: Pipeline de Ingestão Híbrida)
 *
 * Utiliza o modelo Google text-embedding-004 (768 dimensões)
 * para vetorização de dados relacionais e documentos paroquiais.
 */

export interface EmbeddingResult {
  values: number[];
  dimensions: number;
}

export interface TextChunk {
  title: string;
  content: string;
  referenceTable?: string;
  referenceId?: string;
  sourceType: 'uploaded_pdf' | 'database_sync' | 'faq_manual';
  metadata: Record<string, unknown>;
}

const EMBEDDING_MODEL = 'text-embedding-004';
const EXPECTED_DIMENSIONS = 768;

function getApiKey(): string | null {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    null
  );
}

/**
 * Gera um vetor pseudo-randômico determinístico de 768 dimensões
 * baseado no hash do texto (utilizado apenas como fallback em ambiente de desenvolvimento)
 */
function generateDeterministicVector(text: string): number[] {
  const vector = new Array(EXPECTED_DIMENSIONS).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let i = 0; i < EXPECTED_DIMENSIONS; i++) {
    const seed = Math.sin(hash + i) * 10000;
    vector[i] = seed - Math.floor(seed);
  }

  // Normalização euclidiana (L2 norm)
  const norm = Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0));
  return vector.map((val) => val / (norm || 1));
}

/**
 * Gera o embedding de um texto individual usando Google text-embedding-004
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const cleanedText = text.trim();
  if (!cleanedText) {
    throw new Error('O texto para geração de embedding não pode estar vazio.');
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'GEMINI_API_KEY não configurada no ambiente de produção. Impossível gerar embeddings.'
      );
    }
    console.warn(
      '⚠️ [Embeddings] GEMINI_API_KEY não detectada. Utilizando vetor determinístico de desenvolvimento.'
    );
    return generateDeterministicVector(cleanedText);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: {
        parts: [{ text: cleanedText }],
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Google AI Embedding Error ${response.status}]:`, errorBody);
    throw new Error(
      `Falha na API Google Gemini (${response.status}): ${errorBody}`
    );
  }

  const data = await response.json();
  const values = data?.embedding?.values;

  if (!values || !Array.isArray(values) || values.length !== EXPECTED_DIMENSIONS) {
    throw new Error(
      `Vetor retornado pela API inválido ou com dimensões divergentes de ${EXPECTED_DIMENSIONS}.`
    );
  }

  return values;
}

/**
 * Gera embeddings em lote (batch) otimizado em blocos de até 50 itens
 */
export async function generateBatchEmbeddings(
  texts: string[]
): Promise<number[][]> {
  if (!texts.length) return [];

  const apiKey = getApiKey();

  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'GEMINI_API_KEY não configurada no ambiente de produção.'
      );
    }
    console.warn(
      `⚠️ [Embeddings] GEMINI_API_KEY não detectada. Gerando ${texts.length} vetores determinísticos para teste.`
    );
    return texts.map((t) => generateDeterministicVector(t.trim() || 'vazio'));
  }

  const BATCH_SIZE = 50;
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const chunk = texts.slice(i, i + BATCH_SIZE);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents?key=${apiKey}`;

    const requests = chunk.map((text) => ({
      model: `models/${EMBEDDING_MODEL}`,
      content: {
        parts: [{ text: text.trim() || 'texto vazio' }],
      },
    }));

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Google AI Batch Embedding Error ${response.status}]:`, errorBody);
      throw new Error(
        `Falha na geração de embeddings em lote (${response.status}): ${errorBody}`
      );
    }

    const data = await response.json();
    const batchEmbeddings = data?.embeddings;

    if (!batchEmbeddings || !Array.isArray(batchEmbeddings)) {
      throw new Error('Resposta de embeddings em lote inválida da API do Gemini.');
    }

    for (const item of batchEmbeddings) {
      if (!item.values || item.values.length !== EXPECTED_DIMENSIONS) {
        throw new Error(`Item do lote com dimensões divergentes de ${EXPECTED_DIMENSIONS}.`);
      }
      results.push(item.values);
    }
  }

  return results;
}

/**
 * Utilitário de divisão de textos longos (chunking) com sobreposição (overlap)
 */
export function chunkText(
  text: string,
  maxChunkChars = 800,
  overlapChars = 100
): string[] {
  const clean = text.replace(/\r\n/g, '\n').trim();
  if (clean.length <= maxChunkChars) {
    return [clean];
  }

  const paragraphs = clean.split('\n\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    if ((currentChunk + '\n\n' + trimmedPara).length <= maxChunkChars) {
      currentChunk = currentChunk ? currentChunk + '\n\n' + trimmedPara : trimmedPara;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        // Preserva o overlap pegando o final do chunk anterior
        const overlap = currentChunk.slice(-overlapChars);
        currentChunk = overlap + '\n\n' + trimmedPara;
      } else {
        // Parágrafo individual maior que o maxChunkChars: divide por frases
        const sentences = trimmedPara.split('. ');
        for (const sentence of sentences) {
          if ((currentChunk + '. ' + sentence).length <= maxChunkChars) {
            currentChunk = currentChunk ? currentChunk + '. ' + sentence : sentence;
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence;
          }
        }
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Formatadores semânticos para converter entidades do banco em chunks de conhecimento
 */
export const knowledgeFormatters = {
  parish(parish: {
    name: string;
    diocese?: string;
    address?: string;
    city?: string;
    state?: string;
    whatsapp_number?: string;
    pix_key?: string;
    pix_key_type?: string;
  }): TextChunk {
    const content = [
      `Paróquia: ${parish.name}`,
      parish.diocese ? `Diocese: ${parish.diocese}` : null,
      parish.address ? `Endereço da Secretaria/Matriz: ${parish.address}, ${parish.city || ''} - ${parish.state || ''}` : null,
      parish.whatsapp_number ? `Contato / WhatsApp da Secretaria: ${parish.whatsapp_number}` : null,
      parish.pix_key ? `Chave PIX Oficial para Dízimo e Doações: ${parish.pix_key} (Tipo: ${parish.pix_key_type || 'Chave'})` : null,
    ]
      .filter(Boolean)
      .join('\n');

    return {
      title: `Informações Gerais da Paróquia: ${parish.name}`,
      content,
      referenceTable: 'parishes',
      sourceType: 'database_sync',
      metadata: { type: 'parish_info' },
    };
  },

  clergy(clergy: {
    id: string;
    name: string;
    role: string;
    title?: string;
    ordination_date?: string;
    bio?: string;
    office_hours?: string;
  }): TextChunk {
    const roleLabel =
      clergy.role === 'paroco'
        ? 'Pároco'
        : clergy.role === 'vigario'
        ? 'Vigário Paroquial'
        : clergy.role === 'diacono'
        ? 'Diácono'
        : clergy.role;

    const content = [
      `Sacerdote: ${clergy.name}`,
      `Função Canônica: ${roleLabel}`,
      clergy.title ? `Título: ${clergy.title}` : null,
      clergy.office_hours ? `Horários de Atendimento e Confissão: ${clergy.office_hours}` : null,
      clergy.ordination_date ? `Data de Ordenação: ${clergy.ordination_date}` : null,
      clergy.bio ? `Biografia / Histórico Pastoral: ${clergy.bio}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    return {
      title: `Clero Paroquial: ${clergy.name} (${roleLabel})`,
      content,
      referenceTable: 'clergy',
      referenceId: clergy.id,
      sourceType: 'database_sync',
      metadata: { clergy_id: clergy.id, role: clergy.role },
    };
  },

  community(community: {
    id: string;
    name: string;
    patron_saint?: string;
    is_headquarters?: boolean;
    address?: string;
    neighborhood?: string;
    city?: string;
    contact_name?: string;
    contact_phone?: string;
    foundation_year?: number;
    feast_day?: string;
    history?: string;
  }): TextChunk {
    const tipo = community.is_headquarters ? 'Igreja Matriz / Catedral' : 'Comunidade (CEB)';

    const content = [
      `Comunidade: ${community.name} (${tipo})`,
      community.patron_saint ? `Padroeiro(a): ${community.patron_saint}` : null,
      community.address ? `Endereço: ${community.address}, ${community.neighborhood || ''}, ${community.city || ''}` : null,
      community.contact_name ? `Coordenador(a): ${community.contact_name}` : null,
      community.contact_phone ? `Contato da Liderança: ${community.contact_phone}` : null,
      community.feast_day ? `Dia da Festa do(a) Padroeiro(a): ${community.feast_day}` : null,
      community.foundation_year ? `Ano de Fundação: ${community.foundation_year}` : null,
      community.history ? `História e Pioneiros: ${community.history}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    return {
      title: `Comunidade: ${community.name}`,
      content,
      referenceTable: 'communities',
      referenceId: community.id,
      sourceType: 'database_sync',
      metadata: {
        community_id: community.id,
        is_headquarters: !!community.is_headquarters,
      },
    };
  },

  schedule(
    schedule: {
      id: string;
      day_of_week: string;
      time: string;
      type: string;
      description?: string;
    },
    communityName = 'Igreja Matriz'
  ): TextChunk {
    const daysMap: Record<string, string> = {
      domingo: 'Domingo',
      segunda: 'Segunda-feira',
      terca: 'Terça-feira',
      quarta: 'Quarta-feira',
      quinta: 'Quinta-feira',
      sexta: 'Sexta-feira',
      sabado: 'Sábado',
    };

    const dayName = daysMap[schedule.day_of_week.toLowerCase()] || schedule.day_of_week;
    const typeLabel =
      schedule.type === 'missa'
        ? 'Santa Missa'
        : schedule.type === 'celebracao'
        ? 'Celebração da Palavra'
        : schedule.type === 'confissao'
        ? 'Atendimento de Confissões'
        : schedule.type === 'adoracao'
        ? 'Adoração ao Santíssimo'
        : schedule.type;

    const content = [
      `Celebração / Horário: ${typeLabel}`,
      `Local: ${communityName}`,
      `Dia da Semana: ${dayName}`,
      `Horário: ${schedule.time}`,
      schedule.description ? `Detalhes / Observações: ${schedule.description}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    return {
      title: `Horário de ${typeLabel} em ${communityName} (${dayName} às ${schedule.time})`,
      content,
      referenceTable: 'mass_schedules',
      referenceId: schedule.id,
      sourceType: 'database_sync',
      metadata: {
        schedule_id: schedule.id,
        day_of_week: schedule.day_of_week,
        time: schedule.time,
        community_name: communityName,
      },
    };
  },

  pastoralMessage(msg: {
    id: string;
    title: string;
    author_name: string;
    author_type: string;
    subtitle?: string;
    content: string;
    liturgical_season?: string;
  }): TextChunk {
    const authorRole = msg.author_type === 'bispo' ? 'Bispo Diocesano' : 'Pároco';
    const textContent = `${msg.title}\nAutor: ${msg.author_name} (${authorRole})\n${
      msg.subtitle ? `Subtítulo: ${msg.subtitle}\n` : ''
    }${msg.liturgical_season ? `Tempo Litúrgico: ${msg.liturgical_season}\n` : ''}\nMensagem:\n${msg.content}`;

    return {
      title: `Mensagem Pastoral: "${msg.title}" por ${msg.author_name}`,
      content: textContent,
      referenceTable: 'pastoral_messages',
      referenceId: msg.id,
      sourceType: 'database_sync',
      metadata: { message_id: msg.id, author_type: msg.author_type },
    };
  },
};
