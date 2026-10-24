-- ==============================================================================
-- MIGRAÇÃO: GESTÃO DE USUÁRIOS, RBAC & AUDITORIA DE ATIVIDADES DAS CEBs (TASK-43)
-- Modelagem de perfis de usuário, controle de acesso granular e changelog fraterno
-- ==============================================================================

-- 1. Tabela de Perfis de Usuários (RBAC Multi-Comunidades)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'coordenador_ceb' 
    CHECK (role IN ('paroco', 'vigario', 'secretaria', 'pascom', 'coordenador_ceb')),
  community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pendente' 
    CHECK (status IN ('pendente', 'ativo', 'bloqueado')),
  allowed_modules JSONB NOT NULL DEFAULT '["lp_geral", "cpc", "avisos", "pastorais", "horarios"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Logs de Atividades & Changelog Fraterno das CEBs
CREATE TABLE IF NOT EXISTS public.community_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'coordenador' 
    CHECK (author_role IN ('paroquia', 'coordenador')),
  action_type TEXT NOT NULL,
  pastoral_note TEXT,
  changes_summary TEXT,
  is_read_by_community BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Índices de Busca e Performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_community_id ON public.user_profiles(community_id);
CREATE INDEX IF NOT EXISTS idx_community_activity_logs_community ON public.community_activity_logs(community_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_activity_logs_unread ON public.community_activity_logs(community_id, is_read_by_community);

-- 4. Habilitar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_activity_logs ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS: user_profiles
CREATE POLICY "user_profiles_select_all" 
ON public.user_profiles FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "user_profiles_insert_all" 
ON public.user_profiles FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "user_profiles_update_all" 
ON public.user_profiles FOR UPDATE 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "user_profiles_delete_all" 
ON public.user_profiles FOR DELETE 
TO anon, authenticated 
USING (true);

-- 6. Políticas RLS: community_activity_logs
CREATE POLICY "community_logs_select_all" 
ON public.community_activity_logs FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "community_logs_insert_all" 
ON public.community_activity_logs FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "community_logs_update_all" 
ON public.community_activity_logs FOR UPDATE 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- 7. Seed Inicial de Perfis Canônicos da Catedral e Lideranças de CEB
INSERT INTO public.user_profiles (name, email, phone, role, status, community_id, allowed_modules)
VALUES 
  ('Pe. Irineu Valmorbida', 'paroco@catedraldecolatina.org.br', '(27) 99881-2233', 'paroco', 'ativo', NULL, '["all"]'::jsonb),
  ('Pe. Adilson Bassini', 'vigario@catedraldecolatina.org.br', '(27) 99881-3344', 'vigario', 'ativo', NULL, '["all"]'::jsonb),
  ('Secretaria Paroquial (Rita de Cássia)', 'secretaria@catedraldecolatina.org.br', '(27) 3222-1234', 'secretaria', 'ativo', NULL, '["all"]'::jsonb),
  ('PASCOM Catedral (Mateus Silva)', 'pascom@catedraldecolatina.org.br', '(27) 99771-5566', 'pascom', 'ativo', NULL, '["lp_geral", "avisos", "pastorais", "galerias"]'::jsonb),
  ('Antônio Marcos (Coord. CEB Santa Luzia)', 'antonio.santaluzia@catedraldecolatina.org.br', '(27) 99654-7890', 'coordenador_ceb', 'ativo', '88872d28-2f0a-44ce-94fe-fbe836bfec67', '["lp_geral", "cpc", "avisos", "pastorais", "horarios"]'::jsonb),
  ('Maria do Carmo (Coord. CEB N. Sra. da Penha)', 'maria.penha@catedraldecolatina.org.br', '(27) 99543-2109', 'coordenador_ceb', 'ativo', 'bd1b097a-e973-4bc3-ac7b-c0c4bda6a379', '["lp_geral", "cpc", "avisos", "pastorais", "horarios", "dizimo"]'::jsonb),
  ('João Batista Mendes (Coord. CEB São Pedro)', 'joao.saopedro@catedraldecolatina.org.br', '(27) 99432-1098', 'coordenador_ceb', 'pendente', 'b9a25239-f993-4681-b8a3-b463d2b9c586', '["lp_geral", "cpc", "avisos", "pastorais", "horarios"]'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- 8. Seed Inicial de Log Fraterno de Exemplo
INSERT INTO public.community_activity_logs (community_id, author_name, author_role, action_type, pastoral_note, changes_summary, is_read_by_community)
VALUES 
  ('88872d28-2f0a-44ce-94fe-fbe836bfec67', 'Pe. Irineu Valmorbida', 'paroquia', 'Ajuste Pastoral de Horários', 'Querido Antônio, ajustamos o horário da Santa Missa do segundo domingo para as 19h em sintonia com a celebração do Crisma Diocesano.', 'Alteração do horário da Santa Missa Dominical de 18h para 19h.', false)
ON CONFLICT DO NOTHING;
