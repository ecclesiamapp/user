-- ========================================================
-- 🎨 Ecclesiam App: Sistema de Cores e Temas de Festividades
-- Adiciona suporte a temas visuais litúrgicos exclusivos
-- ========================================================

ALTER TABLE public.parish_special_events
  ADD COLUMN IF NOT EXISTS color_preset text NOT NULL DEFAULT 'sagrado_coracao',
  ADD COLUMN IF NOT EXISTS primary_color text NOT NULL DEFAULT '#8B1E22',
  ADD COLUMN IF NOT EXISTS secondary_color text NOT NULL DEFAULT '#FFA82A',
  ADD COLUMN IF NOT EXISTS accent_color text NOT NULL DEFAULT '#FFFFFF';

-- Atualiza a Festa da Co-Padroeira 2026 para a paleta Mariana (Azul e Branco)
UPDATE public.parish_special_events
SET 
  color_preset = 'mariano',
  primary_color = '#1E3A8A',
  secondary_color = '#38BDF8',
  accent_color = '#FFFFFF',
  updated_at = now()
WHERE slug = 'festa-copadroeira-2026';
