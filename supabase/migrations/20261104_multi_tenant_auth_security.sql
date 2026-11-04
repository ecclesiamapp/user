-- ==============================================================================
-- MIGRAÇÃO: PORTAL DE LOGIN SAAS (ecclesiamapp.com.br) & SEGURANÇA MULTI-TENANT
-- Data: 04/11/2026
-- Escopo:
--   1. Expansão Multi-Tenant da tabela public.parishes (custom_domain, subscription_status, plan_tier)
--   2. Expansão de credenciais e Superadmin SaaS em public.user_profiles
--   3. Criação da tabela imutável public.security_audit_logs (LGPD Art. 6, X & Art. 46)
-- ==============================================================================

DO $$
BEGIN
  -- 1. Colunas Multi-Tenant em public.parishes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'parishes' AND column_name = 'custom_domain'
  ) THEN
    ALTER TABLE public.parishes ADD COLUMN custom_domain TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'parishes' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE public.parishes
      ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'ativa'
      CHECK (subscription_status IN ('ativa', 'implantacao', 'suspensa'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'parishes' AND column_name = 'plan_tier'
  ) THEN
    ALTER TABLE public.parishes
      ADD COLUMN plan_tier TEXT NOT NULL DEFAULT 'catedral_enterprise';
  END IF;

  -- 2. Coluna de código/credencial inicial em public.user_profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'access_code'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN access_code TEXT DEFAULT 'Ecclesiam@2026';
  END IF;
END $$;

-- 3. Atualizar dados de domínio e status da Paróquia Piloto (Catedral de Colatina)
UPDATE public.parishes
SET
  custom_domain = 'catedraldecolatina.org.br',
  subscription_status = 'ativa',
  plan_tier = 'catedral_enterprise'
WHERE id = 'c0000000-0000-0000-0000-000000000001';

-- 4. Garantir perfil Superadmin Master do Ecclesiam App e vincular paróquia nos perfis existentes
UPDATE public.user_profiles
SET parish_id = 'c0000000-0000-0000-0000-000000000001'
WHERE parish_id IS NULL;

INSERT INTO public.user_profiles (
  parish_id,
  name,
  email,
  phone,
  role,
  status,
  community_id,
  allowed_modules,
  access_code
)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'Diretoria Ecclesiam SaaS (Superadmin)',
  'admin@ecclesiamapp.com.br',
  '(27) 99999-0000',
  'superadmin',
  'ativo',
  NULL,
  '["all"]'::jsonb,
  'Ecclesiam@2026'
)
ON CONFLICT (email) DO UPDATE
SET
  role = 'superadmin',
  status = 'ativo',
  allowed_modules = '["all"]'::jsonb;

-- 5. Tabela Imutável de Auditoria de Segurança e Acessos (LGPD Art. 6, X / Art. 46)
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id UUID REFERENCES public.parishes(id) ON DELETE SET NULL,
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'login_success',
      'login_failed',
      'login_blocked_rate_limit',
      'logout',
      'access_request_submitted',
      'tenant_switch',
      'password_reset_requested'
    )
  ),
  role TEXT,
  ip_hint TEXT,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_security_audit_logs_parish_created
  ON public.security_audit_logs (parish_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_audit_logs_email_created
  ON public.security_audit_logs (email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_audit_logs_event_type
  ON public.security_audit_logs (event_type, created_at DESC);

ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'security_audit_logs' AND policyname = 'security_audit_logs_select_policy'
  ) THEN
    CREATE POLICY "security_audit_logs_select_policy"
      ON public.security_audit_logs
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'security_audit_logs' AND policyname = 'security_audit_logs_insert_policy'
  ) THEN
    CREATE POLICY "security_audit_logs_insert_policy"
      ON public.security_audit_logs
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;
