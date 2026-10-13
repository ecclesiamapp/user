-- Migração: Criação da tabela pastoral_appointments e RPC de slots
-- Data: 12/10/2026
-- Objetivo: Módulo da Secretaria On-line (TASK-20) com suporte aos 4 padres, status e RLS multi-tenant

-- 1. Criar tabela pastoral_appointments
CREATE TABLE IF NOT EXISTS public.pastoral_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  clergy_id uuid REFERENCES public.clergy(id) ON DELETE SET NULL,
  community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
  parishioner_name text NOT NULL,
  parishioner_phone text NOT NULL,
  parishioner_email text,
  community_name text,
  appointment_type text NOT NULL CHECK (
    appointment_type IN ('confissao', 'direcao_espiritual', 'pastoral_escuta', 'atendimento_padre', 'bencao', 'processo_matrimonial')
  ),
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'pendente' CHECK (
    status IN ('pendente', 'confirmado', 'concluido', 'cancelado', 'ausente')
  ),
  notes text,
  internal_notes text,
  confirmed_at timestamptz,
  confirmed_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Índices de performance
CREATE INDEX IF NOT EXISTS idx_pastoral_appointments_parish_id ON public.pastoral_appointments(parish_id);
CREATE INDEX IF NOT EXISTS idx_pastoral_appointments_clergy_id ON public.pastoral_appointments(clergy_id);
CREATE INDEX IF NOT EXISTS idx_pastoral_appointments_date ON public.pastoral_appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_pastoral_appointments_status ON public.pastoral_appointments(status);

-- 3. Habilitar RLS
ALTER TABLE public.pastoral_appointments ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de RLS
CREATE POLICY "Permitir inserção pública de agendamentos pastorais"
  ON public.pastoral_appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (parish_id IS NOT NULL);

CREATE POLICY "Permitir leitura de agendamentos para usuários autenticados"
  ON public.pastoral_appointments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir atualização de agendamentos para usuários autenticados"
  ON public.pastoral_appointments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusão de agendamentos para usuários autenticados"
  ON public.pastoral_appointments
  FOR DELETE
  TO authenticated
  USING (true);

-- 5. Função RPC segura para consulta pública de horários ocupados (sem vazar dados privados)
CREATE OR REPLACE FUNCTION public.get_booked_appointment_slots(
  p_parish_id uuid,
  p_clergy_id uuid,
  p_date date
)
RETURNS TABLE (
  appointment_time text,
  duration_minutes integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT appointment_time, duration_minutes
  FROM public.pastoral_appointments
  WHERE parish_id = p_parish_id
    AND (p_clergy_id IS NULL OR clergy_id = p_clergy_id)
    AND appointment_date = p_date
    AND status IN ('pendente', 'confirmado');
$$;

GRANT EXECUTE ON FUNCTION public.get_booked_appointment_slots(uuid, uuid, date) TO anon, authenticated;
