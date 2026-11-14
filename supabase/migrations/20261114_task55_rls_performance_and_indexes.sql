-- ==============================================================================
-- Migração: 20261114_task55_rls_performance_and_indexes.sql
-- Tarefa: TASK-55 — Consolidação de Performance RLS (20 alertas multiple_permissive_policies)
--         e Indexação de Chaves Estrangeiras Pendentes (Supabase Performance Advisors)
-- Ordem de execução recomendada: imediatamente após 20261114_task53_auth_rls_lockdown.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. INDEXAÇÃO DE FOREIGN KEYS SEM ÍNDICE (SUPABASE LINT 0001)
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_parish_knowledge_documents_uploaded_by
  ON public.parish_knowledge_documents (uploaded_by);

CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_profile_id
  ON public.security_audit_logs (user_profile_id);

-- ------------------------------------------------------------------------------
-- 2. GARANTIA IDEMPOTENTE DAS FUNÇÕES AUXILIARES MULTI-TENANT
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
-- 3. CONSOLIDAÇÃO DE POLÍTICAS RLS REDUNDANTES (ZERO multiple_permissive_policies)
-- ------------------------------------------------------------------------------
-- Substitui pares conflitantes (SELECT público + FOR ALL admin) por:
--   • 1 única política PERMISSIVE de SELECT (TO anon, authenticated)
--   • 3 políticas distintas e não-sobrepostas para escrita (INSERT, UPDATE, DELETE TO authenticated)
-- com subqueries escalares (SELECT public.can_access_parish_admin(...)) para
-- cache por declaração (RLS initplan optimization).

DO $$
DECLARE
  tbl text;
  pol record;
  active_public_tables text[] := ARRAY[
    'announcements',
    'clergy',
    'communities',
    'galleries',
    'liturgical_booklets',
    'liturgy_booklets',
    'mass_schedules',
    'pastoral_messages',
    'pastorals'
  ];
BEGIN
  FOREACH tbl IN ARRAY active_public_tables LOOP
    IF to_regclass(format('public.%I', tbl)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);

      -- Remove políticas existentes nessa tabela para reconstruir conjunto único sem duplicidade
      FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = tbl
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', pol.policyname, tbl);
      END LOOP;

      -- 1 política única de leitura pública (registros ativos) ou gestão administrativa (inclusive rascunhos)
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (is_active = true OR (SELECT public.can_access_parish_admin(parish_id)));',
        tbl || '_select_unified',
        tbl
      );

      -- 3 políticas isoladas de escrita (sem sobreposição com SELECT)
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK ((SELECT public.can_access_parish_admin(parish_id)));',
        tbl || '_insert_admin',
        tbl
      );

      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING ((SELECT public.can_access_parish_admin(parish_id))) WITH CHECK ((SELECT public.can_access_parish_admin(parish_id)));',
        tbl || '_update_admin',
        tbl
      );

      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING ((SELECT public.can_access_parish_admin(parish_id)));',
        tbl || '_delete_admin',
        tbl
      );
    END IF;
  END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 4. CONSOLIDAÇÃO DA TABELA parishes (WHITE-LABEL PÚBLICO + ESCRITA RESTRITA)
-- ------------------------------------------------------------------------------

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'parishes'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.parishes;', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "parishes_select_unified"
ON public.parishes
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "parishes_insert_superadmin_only"
ON public.parishes
FOR INSERT
TO authenticated
WITH CHECK ((SELECT public.is_active_superadmin()));

CREATE POLICY "parishes_update_tenant_masters"
ON public.parishes
FOR UPDATE
TO authenticated
USING (
  (SELECT public.is_active_superadmin())
  OR (
    id = (SELECT public.get_active_admin_parish_id())
    AND (SELECT public.get_active_admin_role()) IN ('paroco', 'secretaria', 'pascom')
  )
)
WITH CHECK (
  (SELECT public.is_active_superadmin())
  OR (
    id = (SELECT public.get_active_admin_parish_id())
    AND (SELECT public.get_active_admin_role()) IN ('paroco', 'secretaria', 'pascom')
  )
);

CREATE POLICY "parishes_delete_superadmin_only"
ON public.parishes
FOR DELETE
TO authenticated
USING ((SELECT public.is_active_superadmin()));

-- ------------------------------------------------------------------------------
-- 5. CONSOLIDAÇÃO DAS DEMAIS TABELAS CMS (EVITAR OVERLAP DE SELECT POR FOR ALL)
-- ------------------------------------------------------------------------------

DO $$
DECLARE
  tbl text;
  pol record;
  other_cms_tables text[] := ARRAY[
    'parish_history_milestones',
    'parish_sacred_heritage',
    'parish_special_events',
    'parish_event_days',
    'parish_pastors_succession',
    'tithe_transparency_items',
    'tithe_faqs'
  ];
  has_parish_id boolean;
  admin_expr text;
BEGIN
  FOREACH tbl IN ARRAY other_cms_tables LOOP
    IF to_regclass(format('public.%I', tbl)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);

      FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = tbl
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', pol.policyname, tbl);
      END LOOP;

      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = tbl
          AND column_name = 'parish_id'
      ) INTO has_parish_id;

      IF has_parish_id THEN
        admin_expr := '(SELECT public.can_access_parish_admin(parish_id))';
      ELSE
        admin_expr := '((SELECT public.get_active_admin_role()) IS NOT NULL)';
      END IF;

      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true);',
        tbl || '_select_unified',
        tbl
      );
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (%s);',
        tbl || '_insert_admin',
        tbl,
        admin_expr
      );
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (%s) WITH CHECK (%s);',
        tbl || '_update_admin',
        tbl,
        admin_expr,
        admin_expr
      );
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (%s);',
        tbl || '_delete_admin',
        tbl,
        admin_expr
      );
    END IF;
  END LOOP;
END $$;

