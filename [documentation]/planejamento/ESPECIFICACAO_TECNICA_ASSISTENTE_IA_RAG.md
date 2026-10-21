# 🧠 Especificação Técnica: Assistente IA Paroquial & RAG Interno

> **Módulo:** Inteligência Paroquial & Copilot da Secretaria  
> **Classificação:** Chat Interno Administrativo (`/admin`)  
> **Fase do Projeto:** FASE 5 (Janeiro de 2027 / Pós-Go Live de Natal)  
> **Status:** Escopo Aprovado via Alinhamento Estruturado (/grill-me)  
> **Repositório:** Ecclesiam App & Catedral de Colatina  

---

## 🎯 1. Visão Geral & Proposta de Valor

O **Assistente IA Paroquial** é uma inteligência interna exclusiva para a equipe administrativa da paróquia (secretária paroquial, pároco, vigários e coordenadores pastorais), acessível dentro do painel restrito `/admin`.

Seu objetivo é transformar o atendimento e a gestão paroquial, eliminando o tempo gasto na busca manual de normas diocesanas, regras de sacramentos, conferência de horários de missas nas 12 comunidades e rascunho de comunicados e mensagens pastorais.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PAINEL ADMINISTRATIVO (/admin)                       │
│                                                                        │
│  [Tela Dedicada /admin/assistente-ia]  +  [Drawer Flutuante Global]    │
│  - Gestão de documentos e PDFs            - Acesso rápido em qualquer   │
│  - Histórico completo de conversas          tela do admin              │
│  - Reindexação manual e status            - Consulta de agendamentos   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│               ROTA DE API & ORQUESTRADOR RAG (Next.js)                 │
│                                                                        │
│  1. Recebe pergunta + parish_id da sessão administrativa               │
│  2. Vetoriza com Google Gemini (text-embedding-004)                   │
│  3. Busca vetorial por similaridade no Supabase (match_embeddings)     │
│  4. Prompt canônico + Contexto injetado                               │
│  5. Streaming com Google Gemini (gemini-2.5-flash)                     │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌───────────────────────────────────┐  ┌─────────────────────────────────┐
│     DADOS RELACIONAIS DO BANCO    │  │     DOCUMENTOS E PDFs (RAG)     │
│  - Horários das 12 CEBs           │  │  - Diretrizes Diocesanas Batismo│
│  - Agendamentos com os 4 Padres   │  │  - Orientações de Matrimônio    │
│  - Inscrições Sacramentais        │  │  - Apostilas de Formação        │
│  - Dízimo & Mensagens Pastorais   │  │  - Atas e Regulamentos Internos │
└───────────────────────────────────┘  └─────────────────────────────────┘
```

---

## 🔒 2. Regra Fundamental de Segurança & Multi-Tenant

1. **Isolamento Estrito por Paróquia (`parish_id`):**  
   Nenhuma informação de uma paróquia pode jamais ser recuperada ou exposta a outra. Todas as consultas vetoriais (`match_embeddings`) executam obrigatoriamente um filtro no Postgres:
   ```sql
   WHERE parish_id = auth_parish_id()
   ```
2. **Políticas de Row Level Security (RLS):**  
   A tabela `parish_knowledge_embeddings` e seus chunks possuem RLS ativado para leitura e gravação exclusivas por usuários autenticados vinculados à respectiva paróquia.
3. **Escopo Read-Only + Copilot:**  
   O assistente **não realiza mutações destrutivas ou inserções diretas no banco de dados sem intervenção humana**. Ele responde perguntas, localiza dados, cruza informações e gera rascunhos (ex: rascunho de aviso paroquial, modelo de declaração), que a secretária pode copiar, revisar ou aprovar.

---

## 🛠️ 3. Stack Tecnológica & Provedores

| Componente | Tecnologia Escolhida | Justificativa |
| :--- | :--- | :--- |
| **LLM de Geração** | **Google Gemini 2.5 Flash** | Custo operacional mínimo, context window de 1M tokens, altíssima velocidade e excelente fluência em português e terminologia católica. |
| **Modelo de Embeddings** | **Google text-embedding-004** (768 dimensões) | Precisão semântica de ponta e perfeita integração nativa. |
| **Banco Vetorial** | **Supabase Postgres + pgvector** | Não requer infraestrutura externa; RLS nativo e busca via HNSW index. |
| **Leitor/Parser de PDFs** | **pdf-parse** ou Edge Worker | Extração de texto de documentos anexados pela paróquia. |
| **Interface Front-end** | **Next.js 16 (App Router) + Tailwind + Lucide** | Design System alinhado ao `/admin`, modo escuro nativo e drawer lateral responsivo. |

---

## 🗄️ 4. Modelagem de Dados no Supabase

### 4.1. Habilitação da Extensão
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 4.2. Tabela de Documentos da Base de Conhecimento
```sql
CREATE TABLE public.parish_knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('diretriz_diocesana', 'batismo', 'matrimonio', 'catequese', 'dizimo', 'norma_interna', 'geral')),
  file_url TEXT,
  file_size_bytes BIGINT,
  total_chunks INT DEFAULT 0,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.3. Tabela de Embeddings e Chunks Vetoriais
```sql
CREATE TABLE public.parish_knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.parish_knowledge_documents(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('uploaded_pdf', 'database_sync', 'faq_manual')),
  reference_table TEXT, -- Ex: 'mass_schedules', 'clergy', 'communities'
  reference_id TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding vector(768), -- text-embedding-004
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice HNSW para busca por similaridade em alta velocidade
CREATE INDEX idx_parish_knowledge_embeddings_hnsw 
ON public.parish_knowledge_embeddings 
USING hnsw (embedding vector_cosine_ops);

-- Índice composto por paróquia para isolamento instantâneo
CREATE INDEX idx_parish_knowledge_parish_id 
ON public.parish_knowledge_embeddings (parish_id);
```

### 4.4. Função de Busca por Similaridade com Filtro de Tenant
```sql
CREATE OR REPLACE FUNCTION match_parish_knowledge(
  query_embedding vector(768),
  filter_parish_id UUID,
  match_count INT DEFAULT 5,
  similarity_threshold FLOAT DEFAULT 0.65
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  source_type TEXT,
  title TEXT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pke.id,
    pke.document_id,
    pke.source_type,
    pke.title,
    pke.content,
    pke.metadata,
    1 - (pke.embedding <=> query_embedding) AS similarity
  FROM public.parish_knowledge_embeddings pke
  WHERE pke.parish_id = filter_parish_id
    AND 1 - (pke.embedding <=> query_embedding) > similarity_threshold
  ORDER BY pke.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 🎨 5. Experiência de Usuário (UX/UI) no `/admin`

A experiência do usuário é dividida em dois pontos de contato complementares:

### 1. Subpágina Completa: `/admin/assistente-ia`
* **Painel de Chat Principal:** Interface de conversa ampla com streaming de respostas, suporte a formatação rica (listas, tabelas, blocos de rascunho de texto e botão "Copiar").
* **Aba Base de Conhecimento:** Lista de documentos carregados, status de vetorização (`ready`, `processing`), botão de upload de novos PDFs e botão de "Sincronizar Dados do Banco" (para reindexar novos padres, horários ou CEBs).
* **Histórico de Sessões:** Registro das consultas recentes da secretaria com filtros de data.

### 2. Drawer / Widget Flutuante Global (`AdminAiFloatingDrawer`)
* Botão discreto no canto inferior direito de todas as telas do painel `/admin` (ícone de centelha/robô com badge de status).
* Ao clicar, abre um drawer lateral deslizante (*slide-over*) sem desviar a secretária do trabalho atual (ex: enquanto ela analisa uma inscrição em `/admin/secretaria`, pode perguntar rapidamente: *"Quais são os documentos exigidos para padrinhos de batismo segundo a diocese?"*).

---

## 📅 6. Decomposição das Tarefas no Cronograma (Fase 5)

| Tarefa | Nome | Estimativa | Descrição |
| :--- | :--- | :--- | :--- |
| **TASK-32** | Infraestrutura Supabase pgvector & Schema RAG | 45 min | Migration SQL com extensão `vector`, tabelas de documentos/chunks, índice HNSW, RLS e RPC `match_parish_knowledge`. |
| **TASK-33** | Pipeline de Ingestão Híbrida & Embeddings | 50 min | Rotas e scripts para indexar dados estruturados do banco (horários, 12 CEBs, clero, dízimo) e upload/parsing de PDFs com Google Gemini `text-embedding-004`. |
| **TASK-34** | Rota de API Copilot & RAG com Google Gemini | 45 min | Endpoint `/api/admin/ai-assistant` com busca semântica, streaming com Gemini 2.5 Flash, prompts canônicos e citações de fontes. |
| **TASK-35** | Front-end: Página `/admin/assistente-ia` & Drawer Flutuante | 60 min | Interface completa no design system do `/admin`, gerenciador de documentos e drawer global acessível em todas as telas. |

---

## ✅ 7. Critérios de Aceite & Validação

1. **Isolamento de Dados:** Consultas executadas com o `parish_id` da Catedral de Colatina nunca retornam nem vazam dados de outras paróquias cadastradas.
2. **Acurácia Canônica e Paroquial:** Perguntas sobre horários das 12 CEBs ou padres de plantão retornam respostas exatas baseadas nas tabelas oficiais.
3. **Respeito ao Cronograma de Natal:** A Fase 5 não interfere nas entregas prioritárias da Fase 4 (Solenidade do Natal 2026), entrando em execução logo após a consolidação piloto.
