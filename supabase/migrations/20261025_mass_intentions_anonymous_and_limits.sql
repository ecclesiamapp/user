-- ==============================================================================
-- Migração: Tornar dados do solicitante opcionais e adicionar flag is_anonymous
-- Data: 25/10/2026
-- Objetivo: Atender aos requisitos de privacidade e sigilo pastoral (LGPD)
--           permitindo intenções anônimas e controle de exposição de dados.
-- ==============================================================================

ALTER TABLE public.mass_intentions ALTER COLUMN offered_by DROP NOT NULL;
ALTER TABLE public.mass_intentions ALTER COLUMN contact_phone DROP NOT NULL;
ALTER TABLE public.mass_intentions ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false;

-- Índice para controle de limites por telefone e celebração
CREATE INDEX IF NOT EXISTS idx_mass_intentions_phone_date_time 
  ON public.mass_intentions(parish_id, celebration_date, celebration_time, contact_phone);
