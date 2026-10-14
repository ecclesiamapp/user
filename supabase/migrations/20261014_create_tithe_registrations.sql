-- Migração: Criação da tabela tithe_registrations (Adesão de Dizimistas "Sou do Sagrado")
-- Data: 14/10/2026
-- Objetivo: Módulo do Dízimo Pastoral (TASK-26B) com RLS, multi-tenant por parish_id e status

CREATE TABLE IF NOT EXISTS public.tithe_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  birth_date date,
  address text,
  neighborhood text,
  preferred_payment_method text NOT NULL DEFAULT 'pix' CHECK (
    preferred_payment_method IN ('pix', 'envelope', 'transferencia', 'debito', 'secretaria')
  ),
  preferred_day integer DEFAULT 10 CHECK (preferred_day BETWEEN 1 AND 31),
  status text NOT NULL DEFAULT 'pendente' CHECK (
    status IN ('pendente', 'cadastrado_theos', 'ativo', 'cancelado')
  ),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_tithe_registrations_parish_id ON public.tithe_registrations(parish_id);
CREATE INDEX IF NOT EXISTS idx_tithe_registrations_community_id ON public.tithe_registrations(community_id);
CREATE INDEX IF NOT EXISTS idx_tithe_registrations_phone ON public.tithe_registrations(phone);
CREATE INDEX IF NOT EXISTS idx_tithe_registrations_status ON public.tithe_registrations(status);

-- Habilitar Row Level Security
ALTER TABLE public.tithe_registrations ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Permitir adesão pública de dizimistas"
  ON public.tithe_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (parish_id IS NOT NULL);

CREATE POLICY "Permitir leitura de dizimistas para usuários autenticados"
  ON public.tithe_registrations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir atualização de dizimistas para usuários autenticados"
  ON public.tithe_registrations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusão de dizimistas para usuários autenticados"
  ON public.tithe_registrations
  FOR DELETE
  TO authenticated
  USING (true);
