-- ==============================================================================
-- Migração: Criação da tabela sacramental_registrations e políticas RLS
-- Data: 12/10/2026
-- Objetivo: Módulo da Secretaria On-line (TASK-21) com suporte a inscrições
--           de Batismo, Catequese (Eucaristia/Crisma), Noivos e Gestantes.
-- ==============================================================================

-- 1. Criar tabela sacramental_registrations
CREATE TABLE IF NOT EXISTS public.sacramental_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
  sacrament_type text NOT NULL CHECK (
    sacrament_type IN ('batismo', 'eucaristia', 'crisma', 'noivos', 'gestantes', 'outro')
  ),
  status text NOT NULL DEFAULT 'pendente' CHECK (
    status IN ('pendente', 'em_analise', 'documentacao_pendente', 'aprovado', 'concluido', 'cancelado')
  ),
  applicant_name text NOT NULL,
  applicant_phone text NOT NULL,
  applicant_email text,
  applicant_role text DEFAULT 'proprio' CHECK (
    applicant_role IN ('proprio', 'mae', 'pai', 'responsavel', 'noivo', 'noiva', 'outro')
  ),
  candidate_name text,
  candidate_birth_date date,
  preferred_date date,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  documents_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  internal_notes text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Índices de performance e consulta rápida por paróquia
CREATE INDEX IF NOT EXISTS idx_sacramental_registrations_parish_id 
  ON public.sacramental_registrations(parish_id);

CREATE INDEX IF NOT EXISTS idx_sacramental_registrations_type 
  ON public.sacramental_registrations(parish_id, sacrament_type);

CREATE INDEX IF NOT EXISTS idx_sacramental_registrations_status 
  ON public.sacramental_registrations(parish_id, status);

CREATE INDEX IF NOT EXISTS idx_sacramental_registrations_community 
  ON public.sacramental_registrations(community_id);

CREATE INDEX IF NOT EXISTS idx_sacramental_registrations_created_at 
  ON public.sacramental_registrations(created_at DESC);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.sacramental_registrations ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de RLS
-- Permite que paroquianos anônimos ou logados façam inscrição pelo portal público
CREATE POLICY "Permitir inscricao publica em sacramentos"
  ON public.sacramental_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (parish_id IS NOT NULL);

-- Permite leitura de inscrições apenas para membros administrativos autenticados
CREATE POLICY "Permitir leitura de inscricoes sacramentais para autenticados"
  ON public.sacramental_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Permite atualização (mudança de status, anotações da secretaria) para autenticados
CREATE POLICY "Permitir atualizacao de inscricoes para autenticados"
  ON public.sacramental_registrations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Permite exclusão de inscrições para autenticados
CREATE POLICY "Permitir exclusao de inscricoes para autenticados"
  ON public.sacramental_registrations
  FOR DELETE
  TO authenticated
  USING (true);
