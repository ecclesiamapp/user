-- ==============================================================================
-- Migração: Criação da Infraestrutura pgvector & Schema RAG (Assistente IA)
-- Data: 01/01/2027 (Planejamento Fase 5 - TASK-32)
-- Plataforma: Ecclesiam App & Catedral de Colatina
-- Objetivo:
--   1. Habilitar a extensão pgvector no schema extensions para embeddings de 768 dimensões (text-embedding-004)
--   2. Criar tabelas parish_knowledge_documents e parish_knowledge_embeddings
--   3. Criar índices HNSW (distância cosseno) e B-Tree por parish_id
--   4. Implementar RLS com isolamento estrito multi-tenant por parish_id
--   5. Criar função RPC segura match_parish_knowledge (SECURITY INVOKER) para busca semântica
-- ==============================================================================

-- 1. Habilitar a extensão pgvector no schema extensions
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 2. Tabela de Documentos da Base de Conhecimento Paroquial
CREATE TABLE IF NOT EXISTS public.parish_knowledge_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL CHECK (
    category IN ('diretriz_diocesana', 'batismo', 'matrimonio', 'catequese', 'dizimo', 'norma_interna', 'geral')
  ),
  file_url text,
  file_size_bytes bigint,
  total_chunks integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'processing' CHECK (
    status IN ('processing', 'ready', 'error')
  ),
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Tabela de Embeddings e Chunks Vetoriais
CREATE TABLE IF NOT EXISTS public.parish_knowledge_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  document_id uuid REFERENCES public.parish_knowledge_documents(id) ON DELETE CASCADE,
  source_type text NOT NULL CHECK (
    source_type IN ('uploaded_pdf', 'database_sync', 'faq_manual')
  ),
  reference_table text, -- Ex: 'mass_schedules', 'clergy', 'communities', 'tithes'
  reference_id text,    -- ID do registro original na tabela relacional
  title text NOT NULL,
  content text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  embedding extensions.vector(768), -- Google text-embedding-004
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Índices de Otimização e Performance
-- 4.1. Índices B-Tree para isolamento e filtragem veloz por paróquia e metadados
CREATE INDEX IF NOT EXISTS idx_parish_knowledge_docs_parish_id 
  ON public.parish_knowledge_documents(parish_id);

CREATE INDEX IF NOT EXISTS idx_parish_knowledge_docs_category 
  ON public.parish_knowledge_documents(category);

CREATE INDEX IF NOT EXISTS idx_parish_knowledge_docs_status 
  ON public.parish_knowledge_documents(status);

CREATE INDEX IF NOT EXISTS idx_parish_knowledge_emb_parish_id 
  ON public.parish_knowledge_embeddings(parish_id);

CREATE INDEX IF NOT EXISTS idx_parish_knowledge_emb_doc_id 
  ON public.parish_knowledge_embeddings(document_id);

CREATE INDEX IF NOT EXISTS idx_parish_knowledge_emb_source_type 
  ON public.parish_knowledge_embeddings(source_type);

CREATE INDEX IF NOT EXISTS idx_parish_knowledge_emb_reference 
  ON public.parish_knowledge_embeddings(reference_table, reference_id);

-- 4.2. Índice HNSW para busca vetorial aproximada em alta velocidade (distância cosseno)
CREATE INDEX IF NOT EXISTS idx_parish_knowledge_embeddings_hnsw 
  ON public.parish_knowledge_embeddings 
  USING hnsw (embedding extensions.vector_cosine_ops);

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.parish_knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parish_knowledge_embeddings ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de RLS para parish_knowledge_documents (Idempotentes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'parish_knowledge_documents' AND policyname = 'allow_anon_all_documents'
  ) THEN
    CREATE POLICY "allow_anon_all_documents"
      ON public.parish_knowledge_documents FOR ALL TO anon, authenticated USING (true) WITH CHECK (parish_id IS NOT NULL);
  END IF;
END $$;

-- 7. Políticas de RLS para parish_knowledge_embeddings (Idempotentes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'parish_knowledge_embeddings' AND policyname = 'allow_anon_all_embeddings'
  ) THEN
    CREATE POLICY "allow_anon_all_embeddings"
      ON public.parish_knowledge_embeddings FOR ALL TO anon, authenticated USING (true) WITH CHECK (parish_id IS NOT NULL);
  END IF;
END $$;

-- 8. Função RPC Segura para Busca Vetorial por Similaridade com Isolamento por Paróquia
CREATE OR REPLACE FUNCTION public.match_parish_knowledge(
  query_embedding extensions.vector(768),
  filter_parish_id uuid,
  match_count integer DEFAULT 5,
  similarity_threshold double precision DEFAULT 0.65
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  source_type text,
  title text,
  content text,
  metadata jsonb,
  similarity double precision
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public, extensions
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
    (1 - (pke.embedding <=> query_embedding))::double precision AS similarity
  FROM public.parish_knowledge_embeddings pke
  WHERE pke.parish_id = filter_parish_id
    AND (1 - (pke.embedding <=> query_embedding)) >= similarity_threshold
  ORDER BY pke.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;

-- 9. Concessão de permissões de execução da RPC para anon, authenticated e service_role
GRANT EXECUTE ON FUNCTION public.match_parish_knowledge(extensions.vector(768), uuid, integer, double precision) 
  TO anon, authenticated, service_role;
