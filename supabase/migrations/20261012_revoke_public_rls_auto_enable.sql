-- Migração: Revogar permissões públicas da função de trigger rls_auto_enable
-- Data: 12/10/2026
-- Objetivo: Blindar contra chamadas não autorizadas de DDL trigger function via API do Supabase

REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM authenticated;
