'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

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
      // 1. Verificar localStorage de sessão do painel administrativo
      const localData = localStorage.getItem('ecclesiam_admin_session');
      if (localData) {
        try {
          const parsed = JSON.parse(localData) as AdminSessionData;
          if (parsed && parsed.active) {
            setHasAdminSession(true);
            setAdminUser(parsed);
            setIsLoading(false);
            return;
          }
        } catch {
          // ignore parsing error
        }
      }

      // 2. Verificar cookie ecclesiam_admin_active
      if (document.cookie.includes('ecclesiam_admin_active=true')) {
        setHasAdminSession(true);
        setAdminUser({ active: true, name: 'Administrador Paroquial', role: 'admin' });
        setIsLoading(false);
        return;
      }

      // 3. Verificar Supabase Auth Session
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasAdminSession(true);
        setAdminUser({
          active: true,
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário Paroquial',
          role: session.user.user_metadata?.role || 'secretaria',
        });
        setIsLoading(false);
        return;
      }

      setHasAdminSession(false);
      setAdminUser(null);
    } catch (err) {
      console.warn('Erro ao verificar sessão administrativa:', err);
      setHasAdminSession(false);
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
      localStorage.removeItem('ecclesiam_admin_session');
      document.cookie = 'ecclesiam_admin_active=; path=/; max-age=0; SameSite=Lax';
      setHasAdminSession(false);
      setAdminUser(null);
    }
  }, []);

  return {
    hasAdminSession,
    adminUser,
    isLoading,
    clearAdminSession,
    refreshSession: checkSession,
  };
}
