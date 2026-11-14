import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { SecurityAuditEventType, UserProfile, UserRole } from '@/types';
import { createAdminClient, hasServiceRoleKey } from '@/utils/supabase/admin';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';

export const USER_PROFILE_SAFE_COLUMNS =
  'id, parish_id, user_id, name, email, phone, role, community_id, status, allowed_modules, last_sign_in_at, invitation_sent_at, created_at, updated_at';

export const ADMIN_PANEL_ROLES: UserRole[] = [
  'superadmin',
  'paroco',
  'vigario',
  'secretaria',
  'pascom',
  'coordenador_ceb',
];

export interface AuthenticatedAdminContext {
  ok: true;
  user: User;
  profile: UserProfile;
  parishId: string | null;
  role: UserRole;
}

export interface UnauthenticatedAdminContext {
  ok: false;
  response: NextResponse;
}

export type AdminAuthResult = AuthenticatedAdminContext | UnauthenticatedAdminContext;

export interface RequireAdminOptions {
  allowedRoles?: UserRole[];
  requestedParishId?: string | null;
}

function getPublicSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variáveis públicas do Supabase ausentes no ambiente.');
  }

  return { supabaseUrl, supabaseKey };
}

/**
 * Cria cliente Supabase SSR para uso dentro de proxy.ts / Middleware,
 * permitindo atualização transparente dos cookies de sessão JWT.
 */
export function createMiddlewareSupabaseClient(
  request: NextRequest,
  getResponse: () => NextResponse,
  setResponse: (next: NextResponse) => void
) {
  const { supabaseUrl, supabaseKey } = getPublicSupabaseConfig();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        const updatedResponse = NextResponse.next({ request });
        const currentHeaders = getResponse().headers;
        currentHeaders.forEach((v, k) => {
          if (k.toLowerCase() !== 'set-cookie') {
            updatedResponse.headers.set(k, v);
          }
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          updatedResponse.cookies.set(name, value, options);
        });
        setResponse(updatedResponse);
      },
    },
  });
}

/**
 * Remove campos sensíveis de `user_profiles` antes de retornar para o browser.
 */
export function sanitizeUserProfile(profile: UserProfile): UserProfile {
  const safe = { ...profile };
  delete safe.access_code;
  return safe;
}

/**
 * Resolve o perfil administrativo a partir de um `auth.user` autenticado.
 */
export async function resolveProfileForAuthUser(
  user: User,
  ssrClient: ReturnType<typeof createServerSupabaseClient>
): Promise<UserProfile | null> {
  const reader = hasServiceRoleKey() ? createAdminClient() : ssrClient;

  const { data: byUserId } = await reader
    .from('user_profiles')
    .select(USER_PROFILE_SAFE_COLUMNS)
    .eq('user_id', user.id)
    .maybeSingle();

  if (byUserId) {
    return byUserId as UserProfile;
  }

  if (!user.email) {
    return null;
  }

  const { data: byEmail } = await reader
    .from('user_profiles')
    .select(USER_PROFILE_SAFE_COLUMNS)
    .ilike('email', user.email.trim())
    .maybeSingle();

  if (!byEmail) {
    return null;
  }

  if (hasServiceRoleKey() && byEmail.user_id !== user.id) {
    await reader
      .from('user_profiles')
      .update({ user_id: user.id })
      .eq('id', byEmail.id);
  }

  return { ...byEmail, user_id: user.id } as UserProfile;
}

/**
 * Guard obrigatório para todas as rotas /api/admin/** e /api/upload.
 * Verifica JWT Supabase no servidor (supabase.auth.getUser), status ativo em user_profiles,
 * RBAC por papel e isolamento multi-tenant por parish_id.
 */
export async function requireAuthenticatedAdmin(
  options: RequireAdminOptions = {}
): Promise<AdminAuthResult> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerSupabaseClient(cookieStore);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Sessão administrativa não autenticada.' },
          { status: 401 }
        ),
      };
    }

    const profile = await resolveProfileForAuthUser(user, supabase);

    if (!profile) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Perfil administrativo não encontrado para esta conta.' },
          { status: 403 }
        ),
      };
    }

    if (profile.status !== 'ativo') {
      const msg =
        profile.status === 'pendente'
          ? 'Seu acesso ainda aguarda aprovação do Administrador da Paróquia.'
          : 'Este perfil administrativo está bloqueado.';
      return {
        ok: false,
        response: NextResponse.json({ error: msg }, { status: 403 }),
      };
    }

    const allowedRoles = options.allowedRoles ?? ADMIN_PANEL_ROLES;
    if (!allowedRoles.includes(profile.role)) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Você não possui permissão para executar esta operação.' },
          { status: 403 }
        ),
      };
    }

    const requestedParishId = options.requestedParishId?.trim() || null;

    if (
      requestedParishId &&
      profile.role !== 'superadmin' &&
      profile.parish_id &&
      requestedParishId !== profile.parish_id
    ) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Acesso negado para dados de outra paróquia.' },
          { status: 403 }
        ),
      };
    }

    const effectiveParishId =
      profile.role === 'superadmin'
        ? requestedParishId || profile.parish_id || null
        : profile.parish_id || requestedParishId || null;

    if (profile.role !== 'superadmin' && effectiveParishId) {
      const reader = hasServiceRoleKey() ? createAdminClient() : supabase;
      const { data: parish } = await reader
        .from('parishes')
        .select('id, subscription_status')
        .eq('id', effectiveParishId)
        .maybeSingle();

      if (parish && parish.subscription_status === 'suspensa') {
        return {
          ok: false,
          response: NextResponse.json(
            {
              error:
                'Acesso suspenso temporariamente para esta paróquia. Contate o suporte.',
            },
            { status: 403 }
          ),
        };
      }
    }

    return {
      ok: true,
      user,
      profile: sanitizeUserProfile(profile),
      parishId: effectiveParishId,
      role: profile.role,
    };
  } catch (err) {
    console.error('[serverAuth] Falha na verificação de sessão:', err);
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Erro interno ao validar autenticação.' },
        { status: 500 }
      ),
    };
  }
}

export async function recordServerAuditEvent(params: {
  email: string;
  eventType: SecurityAuditEventType;
  parishId?: string | null;
  userProfileId?: string | null;
  role?: string | null;
  ipHint?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const cookieStore = await cookies();
    const writer = hasServiceRoleKey()
      ? createAdminClient()
      : createServerSupabaseClient(cookieStore);

    await writer.from('security_audit_logs').insert([
      {
        parish_id: params.parishId ?? null,
        user_profile_id: params.userProfileId ?? null,
        email: params.email.trim().toLowerCase(),
        event_type: params.eventType,
        role: params.role ?? null,
        ip_hint: params.ipHint ?? null,
        user_agent: params.userAgent ? params.userAgent.slice(0, 220) : null,
        metadata: params.metadata ?? {},
      },
    ]);
  } catch (err) {
    console.warn('[serverAuth] Erro ao registrar auditoria:', err);
  }
}

