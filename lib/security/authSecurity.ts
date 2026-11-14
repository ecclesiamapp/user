import { createClient } from '@/utils/supabase/client';
import { Parish, SecurityAuditEventType, UserProfile } from '@/types';

const RATE_LIMIT_KEY = 'ecclesiam_auth_rate_limit';
export const ADMIN_SESSION_STORAGE_KEY = 'ecclesiam_admin_session';

export interface RateLimitState {
  attempts: number;
  lockedUntil: number | null;
}

export interface AuthenticatedSessionPayload {
  active: boolean;
  id: string;
  name: string;
  email: string;
  role: string;
  parish_id: string;
  parish_name?: string;
  community_id?: string | null;
  is_simulating?: boolean;
  updatedAt: number;
}

/**
 * Lê apenas o contador visual de bloqueio retornado pelo servidor (para countdown na UI).
 * A aplicação real do rate-limit ocorre estritamente no servidor (/api/auth/login).
 */
export function getRateLimitState(): RateLimitState {
  if (typeof window === 'undefined') {
    return { attempts: 0, lockedUntil: null };
  }
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { attempts: 0, lockedUntil: null };
    const parsed = JSON.parse(raw) as RateLimitState;
    if (parsed.lockedUntil && Date.now() > parsed.lockedUntil) {
      localStorage.removeItem(RATE_LIMIT_KEY);
      return { attempts: 0, lockedUntil: null };
    }
    return parsed;
  } catch {
    return { attempts: 0, lockedUntil: null };
  }
}

function setUiLockoutFromServer(retryAfterSeconds?: number): void {
  if (typeof window === 'undefined' || !retryAfterSeconds) return;
  try {
    const nextState: RateLimitState = {
      attempts: 5,
      lockedUntil: Date.now() + retryAfterSeconds * 1000,
    };
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(nextState));
  } catch {
    // ignore storage quota errors
  }
}

export function clearRateLimit(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RATE_LIMIT_KEY);
  } catch {
    // ignore
  }
}

export async function recordSecurityAudit(params: {
  email: string;
  eventType: SecurityAuditEventType;
  parishId?: string | null;
  userProfileId?: string | null;
  role?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const supabase = createClient();
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Server';
    await supabase.from('security_audit_logs').insert([
      {
        email: params.email.trim().toLowerCase(),
        event_type: params.eventType,
        parish_id: params.parishId || null,
        user_profile_id: params.userProfileId || null,
        role: params.role || null,
        ip_hint: 'client-tls',
        user_agent: userAgent.slice(0, 250),
        metadata: params.metadata || {},
      },
    ]);
  } catch (err) {
    console.warn('Aviso ao registrar auditoria de segurança:', err);
  }
}

/**
 * Atualiza apenas o cache visual não-autoritativo em localStorage.
 * A autorização real de rotas e APIs é validada no servidor via JWT HttpOnly do Supabase Auth.
 */
export function establishAdminSession(user: UserProfile, parish?: Parish | null): void {
  if (typeof window === 'undefined') return;

  const parishId =
    parish?.id || user.parish_id || 'c0000000-0000-0000-0000-000000000001';
  const payload: AuthenticatedSessionPayload = {
    active: true,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    parish_id: parishId,
    parish_name: parish?.name || user.parish_name || 'Catedral Diocesana',
    community_id: user.community_id || null,
    updatedAt: Date.now(),
  };

  try {
    localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
}

export async function destroyAdminSession(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // fallback para signOut local
  }

  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  try {
    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    localStorage.removeItem(RATE_LIMIT_KEY);
  } catch {
    // ignore
  }

  // Limpeza defensiva de eventuais cookies legados
  document.cookie = 'ecclesiam_admin_active=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'ecclesiam_user_id=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'ecclesiam_parish_id=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'ecclesiam_user_role=; path=/; max-age=0; SameSite=Lax';
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: UserProfile;
  parish?: Parish | null;
  rateLimited?: boolean;
}

export async function authenticateEcclesiamUser(
  rawEmail: string,
  password: string
): Promise<AuthResult> {
  const email = rawEmail.trim().toLowerCase();

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
      lockedOut?: boolean;
      retryAfterSeconds?: number;
      profile?: UserProfile;
      parish?: Parish | null;
    } | null;

    if (!res.ok || !data?.ok || !data.profile) {
      if (data?.lockedOut && data.retryAfterSeconds) {
        setUiLockoutFromServer(data.retryAfterSeconds);
      }
      return {
        success: false,
        rateLimited: Boolean(data?.lockedOut),
        error:
          data?.error ||
          'E-mail ou senha inválidos, ou credencial não habilitada no Ecclesiam App.',
      };
    }

    clearRateLimit();
    establishAdminSession(data.profile, data.parish);

    return {
      success: true,
      user: data.profile,
      parish: data.parish ?? null,
    };
  } catch {
    return {
      success: false,
      error: 'Erro de comunicação com o servidor de autenticação.',
    };
  }
}
