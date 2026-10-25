-- ==============================================================================
-- Migração: Criação das tabelas mass_intentions e certificate_requests
-- Data: 25/10/2026
-- Objetivo: Módulo da Secretaria On-line (TASK-44) com suporte a:
--           1. Intenções de Santa Missa (com geração de folha de altar A4)
--           2. Solicitação de Certidões & Documentos Paroquiais (2ª via Batismo, Crisma, Matrimônio)
--           3. Políticas de RLS seguras e conformidade LGPD
-- ==============================================================================

-- 1. Criar tabela mass_intentions
CREATE TABLE IF NOT EXISTS public.mass_intentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
  celebration_date date NOT NULL,
  celebration_time text NOT NULL,
  intention_type text NOT NULL CHECK (
    intention_type IN ('falecimento', 'setimo_dia', 'trigesimo_dia', 'acao_gracas', 'saude', 'aniversario_vida', 'aniversario_matrimonio', 'outros')
  ),
  intention_for text NOT NULL,
  offered_by text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text,
  notes text,
  status text NOT NULL DEFAULT 'pendente' CHECK (
    status IN ('pendente', 'aprovada', 'rezada', 'cancelada')
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Índices de performance para mass_intentions
CREATE INDEX IF NOT EXISTS idx_mass_intentions_parish_id ON public.mass_intentions(parish_id);
CREATE INDEX IF NOT EXISTS idx_mass_intentions_date ON public.mass_intentions(celebration_date);
CREATE INDEX IF NOT EXISTS idx_mass_intentions_date_time ON public.mass_intentions(celebration_date, celebration_time);
CREATE INDEX IF NOT EXISTS idx_mass_intentions_status ON public.mass_intentions(status);
CREATE INDEX IF NOT EXISTS idx_mass_intentions_community_id ON public.mass_intentions(community_id);

-- 3. Habilitar RLS em mass_intentions
ALTER TABLE public.mass_intentions ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de RLS para mass_intentions
CREATE POLICY "Permitir envio publico de intencoes de Santa Missa"
  ON public.mass_intentions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (parish_id IS NOT NULL);

CREATE POLICY "Permitir leitura de intencoes para usuarios autenticados"
  ON public.mass_intentions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir atualizacao de intencoes para usuarios autenticados"
  ON public.mass_intentions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusao de intencoes para usuarios autenticados"
  ON public.mass_intentions
  FOR DELETE
  TO authenticated
  USING (true);

-- 5. Criar tabela certificate_requests
CREATE TABLE IF NOT EXISTS public.certificate_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  certificate_type text NOT NULL CHECK (
    certificate_type IN ('batismo', 'crisma', 'matrimonio', 'transferencia', 'outros')
  ),
  applicant_name text NOT NULL,
  applicant_phone text NOT NULL,
  applicant_email text,
  applicant_relation text NOT NULL DEFAULT 'proprio' CHECK (
    applicant_relation IN ('proprio', 'pai_mae', 'conjuge', 'responsavel', 'outro')
  ),
  holder_name text NOT NULL,
  holder_birth_date date,
  parents_names text,
  godparents_names text,
  approximate_year integer,
  community_name text,
  book_number text,
  page_number text,
  entry_number text,
  purpose text,
  status text NOT NULL DEFAULT 'pendente' CHECK (
    status IN ('pendente', 'em_busca', 'localizado', 'emitido', 'pronto_para_retirada', 'entregue', 'nao_localizado')
  ),
  delivery_preference text DEFAULT 'retirada_presencial' CHECK (
    delivery_preference IN ('retirada_presencial', 'email_digital', 'whatsapp')
  ),
  notes text,
  internal_notes text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Índices para certificate_requests
CREATE INDEX IF NOT EXISTS idx_certificate_requests_parish_id ON public.certificate_requests(parish_id);
CREATE INDEX IF NOT EXISTS idx_certificate_requests_type ON public.certificate_requests(certificate_type);
CREATE INDEX IF NOT EXISTS idx_certificate_requests_status ON public.certificate_requests(status);
CREATE INDEX IF NOT EXISTS idx_certificate_requests_created ON public.certificate_requests(created_at DESC);

-- 7. Habilitar RLS em certificate_requests
ALTER TABLE public.certificate_requests ENABLE ROW LEVEL SECURITY;

-- 8. Políticas de RLS para certificate_requests
CREATE POLICY "Permitir solicitacao publica de certidoes"
  ON public.certificate_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (parish_id IS NOT NULL);

CREATE POLICY "Permitir leitura de certidoes para usuarios autenticados"
  ON public.certificate_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir atualizacao de certidoes para usuarios autenticados"
  ON public.certificate_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusao de certidoes para usuarios autenticados"
  ON public.certificate_requests
  FOR DELETE
  TO authenticated
  USING (true);
