-- Migration: 20261021_task30_performance_security_hardening.sql
-- Descrição: Otimização de Performance e Hardening de Segurança (TASK-30)
-- 1. Índices cobrindo Foreign Keys pendentes (Advisor de Performance Supabase)
-- 2. Hardening de search_path seguro com pg_temp em funções RPC SECURITY DEFINER (Advisor de Segurança Supabase)

-- 1. Criação de índices para Foreign Keys não indexadas
CREATE INDEX IF NOT EXISTS idx_liturgy_booklets_parish_id 
  ON public.liturgy_booklets (parish_id);

CREATE INDEX IF NOT EXISTS idx_parish_liturgical_events_community_id 
  ON public.parish_liturgical_events (community_id);

CREATE INDEX IF NOT EXISTS idx_pastoral_appointments_community_id 
  ON public.pastoral_appointments (community_id);

-- 2. Hardening de search_path seguro em RPC pública de agendamentos
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
SET search_path = public, pg_temp
AS $$
  SELECT appointment_time, duration_minutes
  FROM public.pastoral_appointments
  WHERE parish_id = p_parish_id
    AND (p_clergy_id IS NULL OR clergy_id = p_clergy_id)
    AND appointment_date = p_date
    AND status IN ('pendente', 'confirmado');
$$;

GRANT EXECUTE ON FUNCTION public.get_booked_appointment_slots(uuid, uuid, date) TO anon, authenticated;

-- 3. Hardening de search_path seguro em RPC de download de folhetos
CREATE OR REPLACE FUNCTION public.increment_booklet_downloads(booklet_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.liturgical_booklets
  SET download_count = download_count + 1
  WHERE id = booklet_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_booklet_downloads(UUID) TO anon, authenticated;
