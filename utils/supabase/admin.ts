import { createClient } from "@supabase/supabase-js";

export function hasServiceRoleKey(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Cliente Supabase Administrativo (Service Role / Bypasses RLS)
 * Utilizado exclusivamente em rotas de API do servidor (/api/admin/... e /api/auth/...)
 * para rotinas administrativas, migração segura de sessão e ingestão RAG.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_URL ausente no ambiente do servidor."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
