-- ==============================================================================
-- MIGRAÇÃO: APERFEIÇOAMENTO DE RBAC & MULTI-TENANT EM USER_PROFILES
-- Adiciona parish_id, last_sign_in_at, invitation_sent_at e role 'superadmin'
-- ==============================================================================

DO $$
BEGIN
  -- 1. Adicionar parish_id se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'parish_id'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN parish_id UUID REFERENCES public.parishes(id) ON DELETE SET NULL;
  END IF;

  -- 2. Adicionar last_sign_in_at se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'last_sign_in_at'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN last_sign_in_at TIMESTAMPTZ;
  END IF;

  -- 3. Adicionar invitation_sent_at se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'invitation_sent_at'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN invitation_sent_at TIMESTAMPTZ;
  END IF;

  -- 4. Atualizar registros existentes com a paróquia padrão da Catedral
  UPDATE public.user_profiles 
  SET parish_id = 'c0000000-0000-0000-0000-000000000001'
  WHERE parish_id IS NULL;

  -- 5. Atualizar constraint de role para incluir 'superadmin'
  ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
  ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_role_check 
    CHECK (role IN ('superadmin', 'paroco', 'vigario', 'secretaria', 'pascom', 'coordenador_ceb'));

END $$;

-- 6. Índice de Performance por Paróquia
CREATE INDEX IF NOT EXISTS idx_user_profiles_parish_id ON public.user_profiles(parish_id);
