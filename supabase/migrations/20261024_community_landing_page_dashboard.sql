-- ==============================================================================
-- MIGRAÇÃO: CAMPOS DO DASHBOARD DA LP DAS COMUNIDADES (TASK-42)
-- Adiciona suporte a Altar, Padroeiro, Lideranças do CPC, Avisos, Pastorais e Dízimo
-- ==============================================================================

ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS patron_image_url TEXT;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS cpc_leaders JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS notices JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS pastoral_groups JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS activities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS pix_key TEXT;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS pix_key_type TEXT;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS dizimo_info TEXT;

COMMENT ON COLUMN public.communities.banner_url IS 'Foto em alta resolução do presbitério/altar da comunidade para o hero da landing page';
COMMENT ON COLUMN public.communities.patron_image_url IS 'Foto ou estampa sacra oficial do santo padroeiro da capela';
COMMENT ON COLUMN public.communities.cpc_leaders IS 'Lista JSON de membros do Conselho Pastoral Comunitário (nome, cargo, telefone, foto, biografia)';
COMMENT ON COLUMN public.communities.notices IS 'Lista JSON do mural de comunicados e avisos da CEB (título, conteúdo, data, categoria)';
COMMENT ON COLUMN public.communities.pastoral_groups IS 'Lista JSON de pastorais e grupos de reflexão vinculados à comunidade';
COMMENT ON COLUMN public.communities.activities IS 'Lista JSON da agenda de atividades, encontros bíblicos e orações da capela';
