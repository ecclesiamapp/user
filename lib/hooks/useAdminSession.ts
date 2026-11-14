'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { UserProfile } from '@/types';

export interface AdminSessionData {
  active: boolean;
  id?: string;
  name?: string;
  role?: string;
  community_id?: string | null;
  is_simulating?: boolean;
}

export function useAdminSession() {
  const [hasAdminSession, setHasAdminSession] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminSessionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkSession = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      // Verifica sessão oficial no servidor via JWT HttpOnly (@supabase/ssr getUser)
      const res = await fetch('/api/auth/session', { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as {
          authenticated?: boolean;
          profile?: UserProfile | null;
        };

        if (data.authenticated && data.profile) {
          setHasAdminSession(true);
          setAdminUser({
            active: true,
            id: data.profile.id,
            name: data.profile.name,
            role: data.profile.role,
            community_id: data.profile.community_id ?? null,
          });
          setIsLoading(false);
          return;
        }
      }

      // Fallback direto com Supabase getUser() (nunca getSession ou cookie forjável)
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setHasAdminSession(true);
        setAdminUser({
          active: true,
          id: user.id,
          name:
            (user.user_metadata?.name as string | undefined) ||
            user.email?.split('@')[0] ||
            'Usuário Paroquial',
          role: (user.app_metadata?.role as string | undefined) || 'secretaria',
        });
        setIsLoading(false);
        return;
      }

      localStorage.removeItem('ecclesiam_admin_session');
      setHasAdminSession(false);
      setAdminUser(null);
    } catch (err) {
      console.warn('Erro ao verificar sessão administrativa:', err);
      setHasAdminSession(false);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ecclesiam_admin_session') {
        checkSession();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [checkSession]);

  const clearAdminSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      localStorage.removeItem('ecclesiam_admin_session');
      document.cookie = 'ecclesiam_admin_active=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'ecclesiam_user_id=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'ecclesiam_parish_id=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'ecclesiam_user_role=; path=/; max-age=0; SameSite=Lax';
      setHasAdminSession(false);
      setAdminUser(null);
    }
  }, []);

  return {
    hasAdminSession,
    adminUser,
    isLoading,
    refreshSession: checkSession,
    clearAdminSession,
  };
}
