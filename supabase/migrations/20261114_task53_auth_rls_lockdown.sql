-- ==============================================================================
-- Migração: 20261114_task53_auth_rls_lockdown.sql
-- Tarefa: TASK-53 — Blindagem Real de Autenticação, RBAC & Lockdown RLS Multi-Tenant
-- PRÉ-REQUISITO OBRIGATÓRIO ANTES DE APLICAR EM PRODUÇÃO:
--   1. Configurar SUPABASE_SERVICE_ROLE_KEY no .env.local e nas variáveis da Vercel.
--   2. Garantir que o fluxo /api/auth/login já esteja publicado para migração de
--      credenciais legadas em auth.users e geração de JWT HttpOnly (@supabase/ssr).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. FUNÇÕES AUXILIARES DE AUTORIZAÇÃO MULTI-TENANT (JWT auth.uid() -> user_profiles)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_active_admin_parish_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT up.parish_id
  FROM public.user_profiles up
  WHERE up.user_id = auth.uid()
    AND up.status = 'ativo'
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_active_admin_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT up.role::text
  FROM public.user_profiles up
  WHERE up.user_id = auth.uid()
    AND up.status = 'ativo'
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_active_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles up
    WHERE up.user_id = auth.uid()
      AND up.status = 'ativo'
      AND up.role = 'superadmin'
  );
$$;

CREATE OR REPLACE FUNCTION public.can_access_parish_admin(target_parish_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    public.is_active_superadmin()
    OR (
      target_parish_id IS NOT NULL
      AND public.get_active_admin_parish_id() = target_parish_id
      AND public.get_active_admin_role() IN (
        'paroco',
        'vigario',
        'secretaria',
        'pascom',
        'coordenador_ceb'
      )
    );
$$;

-- ------------------------------------------------------------------------------
-- 2. LIMPEZA DE POLÍTICAS LEGADAS PERMISSIVAS ({public}/{anon} WRITE OR SENSITIVE READ)
-- ------------------------------------------------------------------------------
-- Remove políticas antigas com "qual = true" ou cmd = 'ALL' abertas para {public}/{anon}
-- nas tabelas sensíveis de autenticação, IA e administração.

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'user_profiles',
        'security_audit_logs',
        'parish_knowledge_documents',
        'parish_knowledge_embeddings',
        'parishes'
      )
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I;',
      pol.policyname,
      pol.schemaname,
      pol.tablename
    );
  END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 3. BLINDAGEM DE user_profiles (REVOGAÇÃO TOTAL DE ACESSO ANÔNIMO)
-- ------------------------------------------------------------------------------
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Nota: Pedidos públicos de acesso (/api/auth/request-access) e login (/api/auth/login)
-- utilizam SUPABASE_SERVICE_ROLE_KEY exclusivamente no servidor Next.js.
-- Nenhuma role `anon` possui leitura, inserção, edição ou exclusão em user_profiles.

CREATE POLICY "user_profiles_select_authenticated_scoped"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_active_superadmin()
  OR (
    parish_id = public.get_active_admin_parish_id()
    AND public.get_active_admin_role() IN ('paroco', 'vigario', 'secretaria')
  )
);

CREATE POLICY "user_profiles_insert_authenticated_admins"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_active_superadmin()
  OR (
    parish_id = public.get_active_admin_parish_id()
    AND public.get_active_admin_role() IN ('paroco', 'secretaria')
    AND role <> 'superadmin'
  )
);

CREATE POLICY "user_profiles_update_authenticated_admins"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
  public.is_active_superadmin()
  OR (
    parish_id = public.get_active_admin_parish_id()
    AND public.get_active_admin_role() IN ('paroco', 'secretaria')
    AND role <> 'superadmin'
  )
)
WITH CHECK (
  public.is_active_superadmin()
  OR (
    parish_id = public.get_active_admin_parish_id()
    AND public.get_active_admin_role() IN ('paroco', 'secretaria')
    AND role <> 'superadmin'
  )
);

CREATE POLICY "user_profiles_delete_authenticated_admins"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (
  public.is_active_superadmin()
  OR (
    parish_id = public.get_active_admin_parish_id()
    AND public.get_active_admin_role() = 'paroco'
    AND role <> 'superadmin'
  )
);

-- ------------------------------------------------------------------------------
-- 4. BLINDAGEM DE security_audit_logs (SEM LEITURA ANÔNIMA; INSERT VIA SERVIDOR/AUTH)
-- ------------------------------------------------------------------------------
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "security_audit_logs_select_admin_only"
ON public.security_audit_logs
FOR SELECT
TO authenticated
USING (
  public.is_active_superadmin()
  OR (
    parish_id IS NOT NULL
    AND parish_id = public.get_active_admin_parish_id()
    AND public.get_active_admin_role() IN ('paroco', 'secretaria')
  )
);

CREATE POLICY "security_audit_logs_insert_authenticated_only"
ON public.security_audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 5. BLINDAGEM DA BASE VETORIAL DA IA (parish_knowledge_documents / embeddings)
-- ------------------------------------------------------------------------------
ALTER TABLE public.parish_knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parish_knowledge_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parish_knowledge_documents_tenant_admin_only"
ON public.parish_knowledge_documents
FOR ALL
TO authenticated
USING (public.can_access_parish_admin(parish_id))
WITH CHECK (public.can_access_parish_admin(parish_id));

CREATE POLICY "parish_knowledge_embeddings_tenant_admin_only"
ON public.parish_knowledge_embeddings
FOR ALL
TO authenticated
USING (public.can_access_parish_admin(parish_id))
WITH CHECK (public.can_access_parish_admin(parish_id));

-- ------------------------------------------------------------------------------
-- 6. BLINDAGEM DE parishes (LEITURA PÚBLICA PARA WHITE-LABEL; ESCRITA RESTRITA)
-- ------------------------------------------------------------------------------
ALTER TABLE public.parishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parishes_public_read_whitelabel"
ON public.parishes
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "parishes_insert_superadmin_only"
ON public.parishes
FOR INSERT
TO authenticated
WITH CHECK (public.is_active_superadmin());

CREATE POLICY "parishes_update_tenant_masters"
ON public.parishes
FOR UPDATE
TO authenticated
USING (
  public.is_active_superadmin()
  OR (
    id = public.get_active_admin_parish_id()
    AND public.get_active_admin_role() IN ('paroco', 'secretaria', 'pascom')
  )
)
WITH CHECK (
  public.is_active_superadmin()
  OR (
    id = public.get_active_admin_parish_id()
    AND public.get_active_admin_role() IN ('paroco', 'secretaria', 'pascom')
  )
);

CREATE POLICY "parishes_delete_superadmin_only"
ON public.parishes
FOR DELETE
TO authenticated
USING (public.is_active_superadmin());

-- ------------------------------------------------------------------------------
-- 7. REVOGAÇÃO DE MUTAÇÕES ANÔNIMAS NAS TABELAS OPERACIONAIS DO CMS PAROQUIAL
-- ------------------------------------------------------------------------------
-- Mantém leitura pública (SELECT) quando já existente e garante que políticas
-- abertas para `{public}`/`{anon}` com ALL/INSERT/UPDATE/DELETE não persistam.

DO $$
DECLARE
  tbl text;
  pol record;
  cms_tables text[] := ARRAY[
    'announcements',
    'clergy',
    'communities',
    'galleries',
    'liturgical_booklets',
    'liturgy_booklets',
    'mass_schedules',
    'pastoral_messages',
    'pastorals',
    'parish_history_milestones',
    'parish_sacred_heritage',
    'parish_special_events',
    'parish_event_days',
    'tithe_transparency_items',
    'tithe_faqs'
  ];
BEGIN
  FOREACH tbl IN ARRAY cms_tables LOOP
    IF to_regclass(format('public.%I', tbl)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);

      FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = tbl
          AND ('anon' = ANY(roles) OR 'public' = ANY(roles))
          AND cmd IN ('ALL', 'INSERT', 'UPDATE', 'DELETE')
      LOOP
        EXECUTE format(
          'DROP POLICY IF EXISTS %I ON public.%I;',
          pol.policyname,
          tbl
        );
      END LOOP;

      EXECUTE format(
        'DROP POLICY IF EXISTS %I ON public.%I;',
        tbl || '_authenticated_tenant_manage',
        tbl
      );

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = tbl
          AND column_name = 'parish_id'
      ) THEN
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.can_access_parish_admin(parish_id)) WITH CHECK (public.can_access_parish_admin(parish_id));',
          tbl || '_authenticated_tenant_manage',
          tbl
        );
      ELSE
        EXECUTE format(
          'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.get_active_admin_role() IS NOT NULL) WITH CHECK (public.get_active_admin_role() IS NOT NULL);',
          tbl || '_authenticated_tenant_manage',
          tbl
        );
      END IF;
    END IF;
  END LOOP;
END $$;

