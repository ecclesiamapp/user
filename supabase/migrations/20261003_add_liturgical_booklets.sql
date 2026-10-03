-- ==============================================================================
-- MIGRAÇÃO: MÓDULO DE FOLHETOS DE MISSA (SOU DO SAGRADO MISSA)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.liturgical_booklets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    celebration_date DATE NOT NULL,
    sunday_label TEXT NOT NULL DEFAULT 'Domingo',
    theme TEXT,
    pdf_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    download_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.liturgical_booklets ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_liturgical_booklets_parish_id ON public.liturgical_booklets(parish_id);
CREATE INDEX IF NOT EXISTS idx_liturgical_booklets_date ON public.liturgical_booklets(celebration_date);

DROP POLICY IF EXISTS "Leitura pública de folhetos ativos" ON public.liturgical_booklets;
CREATE POLICY "Leitura pública de folhetos ativos"
ON public.liturgical_booklets FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de folhetos por administradores" ON public.liturgical_booklets;
CREATE POLICY "Gestão de folhetos por administradores"
ON public.liturgical_booklets FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Seed de exemplo para a Catedral
INSERT INTO public.liturgical_booklets (
    parish_id, title, celebration_date, sunday_label, theme, pdf_url
) VALUES 
(
    'c0000000-0000-0000-0000-000000000001',
    'Folheto Sou do Sagrado Missa • 27º Domingo do Tempo Comum',
    '2026-10-04',
    'Próximo Domingo',
    '«Aumenta a nossa fé, Senhor!»',
    'https://catedraldecolatina.org.br/folhetos/27-domingo-tempo-comum.pdf'
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Folheto Sou do Sagrado Missa • 26º Domingo do Tempo Comum',
    '2026-09-27',
    'Domingo Anterior',
    '«Acolher a Palavra com sinceridade de coração»',
    'https://catedraldecolatina.org.br/folhetos/26-domingo-tempo-comum.pdf'
)
ON CONFLICT DO NOTHING;
