import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase Administrativo (Service Role / Bypasses RLS)
 * Utilizado exclusivamente em rotas de API do servidor (/api/admin/...)
 * para rotinas de sincronização em lote e ingestão RAG.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Credenciais do Supabase ausentes no ambiente do servidor."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
