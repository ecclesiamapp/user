'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  Parish,
  Community,
  UserProfile,
  CommunityActivityLog,
  AllowedCommunityModule,
} from '@/types';
import {
  ADMIN_SESSION_STORAGE_KEY,
  AuthenticatedSessionPayload,
  destroyAdminSession,
  establishAdminSession,
  recordSecurityAudit,
} from '@/lib/security/authSecurity';

interface AdminCommunityContextType {
  parishes: Parish[];
  activeParish: Parish | null;
  setActiveParishId: (parishId: string) => void;
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  communities: Community[];
  selectedCommunityId: string | null;
  selectedCommunity: Community | null;
  isParishMaster: boolean;
  isSimulating: boolean;
  exitSimulation: () => void;
  logout: () => Promise<void>;
  unreadPastoralNotes: CommunityActivityLog[];
  loading: boolean;
  setSelectedCommunityId: (id: string | null) => void;
  switchUser: (userId: string) => void;
  hasModulePermission: (moduleKey: AllowedCommunityModule) => boolean;
  markNoteAsRead: (logId: string) => Promise<boolean>;
  recordActivityLog: (params: {
    communityId: string;
    actionType: string;
    pastoralNote?: string;
    changesSummary?: string;
  }) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const AdminCommunityContext = createContext<AdminCommunityContextType | undefined>(undefined);

export function AdminCommunityProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [activeParishId, setActiveParishIdState] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [primaryUserId, setPrimaryUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [selectedCommunityId, setSelectedCommunityIdState] = useState<string | null>(null);
  const [unreadPastoralNotes, setUnreadPastoralNotes] = useState<CommunityActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = createClient();

  const refreshData = useCallback(async () => {
    try {
      let sessionPayload: AuthenticatedSessionPayload | null = null;
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
        if (raw) {
          try {
            sessionPayload = JSON.parse(raw) as AuthenticatedSessionPayload;
          } catch {
            sessionPayload = null;
          }
        }
      }

      const [{ data: parishesData }, { data: commsData }, { data: usersData }] = await Promise.all([
        supabase.from('parishes').select('*').order('name'),
        supabase.from('communities').select('*').order('is_headquarters', { ascending: false }).order('name'),
        supabase.from('user_profiles').select('*').order('role').order('name'),
      ]);

      const loadedParishes = (parishesData as Parish[]) || [];
      setParishes(loadedParishes);
      if (commsData) setAllCommunities(commsData as Community[]);

      if (usersData && usersData.length > 0) {
        const profiles = usersData as UserProfile[];
        setAllUsers(profiles);

        const sessionUser =
          (sessionPayload?.id && profiles.find((u) => u.id === sessionPayload?.id)) ||
          (sessionPayload?.email &&
            profiles.find((u) => u.email.toLowerCase() === sessionPayload?.email.toLowerCase())) ||
          profiles.find((u) => u.role === 'paroco') ||
          profiles[0];

        setPrimaryUserId((prev) => prev || sessionUser.id);
        setCurrentUser((prev) => (prev ? profiles.find((u) => u.id === prev.id) || prev : sessionUser));

        const resolvedParishId =
          sessionPayload?.parish_id ||
          sessionUser.parish_id ||
          loadedParishes[0]?.id ||
          'c0000000-0000-0000-0000-000000000001';

        setActiveParishIdState((prev) => prev || resolvedParishId);
      }
    } catch (err) {
      console.error('Erro ao carregar contexto Multi-Tenant/RBAC:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const activeParish = useMemo(() => {
    if (parishes.length === 0) return null;
    if (!activeParishId) return parishes[0];
    return parishes.find((p) => p.id === activeParishId) || parishes[0];
  }, [parishes, activeParishId]);

  const communities = useMemo(() => {
    if (!activeParish) return allCommunities;
    const filtered = allCommunities.filter((c) => !c.parish_id || c.parish_id === activeParish.id);
    return filtered.length > 0 ? filtered : allCommunities;
  }, [allCommunities, activeParish]);

  const setActiveParishId = useCallback(
    (parishId: string) => {
      if (currentUser?.role !== 'superadmin') return;
      setActiveParishIdState(parishId);
      setSelectedCommunityIdState(null);
      const targetParish = parishes.find((p) => p.id === parishId) || null;
      if (currentUser) {
        establishAdminSession({ ...currentUser, parish_id: parishId }, targetParish);
        recordSecurityAudit({
          email: currentUser.email,
          eventType: 'tenant_switch',
          parishId,
          userProfileId: currentUser.id,
          role: currentUser.role,
          metadata: { target_parish_name: targetParish?.name },
        });
      }
    },
    [currentUser, parishes]
  );

  useEffect(() => {
    if (currentUser?.role === 'coordenador_ceb' && currentUser.community_id) {
      setSelectedCommunityIdState(currentUser.community_id);
    }
  }, [currentUser]);

  const fetchUnreadNotes = useCallback(
    async (communityId: string) => {
      try {
        const { data } = await supabase
          .from('community_activity_logs')
          .select('*')
          .eq('community_id', communityId)
          .eq('author_role', 'paroquia')
          .eq('is_read_by_community', false)
          .order('created_at', { ascending: false });
        if (data) setUnreadPastoralNotes(data as CommunityActivityLog[]);
      } catch (err) {
        console.warn('Erro ao carregar notas pastorais:', err);
      }
    },
    [supabase]
  );

  useEffect(() => {
    if (selectedCommunityId) fetchUnreadNotes(selectedCommunityId);
    else setUnreadPastoralNotes([]);
  }, [selectedCommunityId, fetchUnreadNotes]);

  const isParishMaster = useMemo(() => !currentUser || currentUser.role !== 'coordenador_ceb', [currentUser]);

  const selectedCommunity = useMemo(() => {
    if (!selectedCommunityId) return null;
    return communities.find((c) => c.id === selectedCommunityId) || null;
  }, [communities, selectedCommunityId]);

  const setSelectedCommunityId = useCallback(
    (id: string | null) => {
      if (!isParishMaster && currentUser?.community_id) {
        setSelectedCommunityIdState(currentUser.community_id);
        return;
      }
      setSelectedCommunityIdState(id);
    },
    [isParishMaster, currentUser]
  );

  const switchUser = useCallback(
    (userId: string) => {
      const found = allUsers.find((u) => u.id === userId);
      if (found) {
        setCurrentUser(found);
        if (found.parish_id) setActiveParishIdState(found.parish_id);
        if (found.role === 'coordenador_ceb') setSelectedCommunityIdState(found.community_id || null);
      }
    },
    [allUsers]
  );

  const hasModulePermission = useCallback(
    (moduleKey: AllowedCommunityModule): boolean => {
      if (!currentUser || isParishMaster) return true;
      const modules = currentUser.allowed_modules || [];
      return modules.includes('all') || modules.includes(moduleKey);
    },
    [currentUser, isParishMaster]
  );

  const markNoteAsRead = useCallback(
    async (logId: string): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('community_activity_logs')
          .update({ is_read_by_community: true })
          .eq('id', logId);
        if (!error) {
          setUnreadPastoralNotes((prev) => prev.filter((n) => n.id !== logId));
          return true;
        }
      } catch (err) {
        console.error('Erro ao marcar nota como lida:', err);
      }
      return false;
    },
    [supabase]
  );

  const recordActivityLog = useCallback(
    async ({
      communityId,
      actionType,
      pastoralNote,
      changesSummary,
    }: {
      communityId: string;
      actionType: string;
      pastoralNote?: string;
      changesSummary?: string;
    }): Promise<boolean> => {
      try {
        const authorRole = isParishMaster ? 'paroquia' : 'coordenador';
        const authorName = currentUser?.name || 'Administrador';
        const { error } = await supabase.from('community_activity_logs').insert([
          {
            community_id: communityId,
            user_id: currentUser?.user_id || null,
            author_name: authorName,
            author_role: authorRole,
            action_type: actionType,
            pastoral_note: pastoralNote || null,
            changes_summary: changesSummary || null,
            is_read_by_community: !isParishMaster,
          },
        ]);
        if (!error) {
          if (selectedCommunityId === communityId) fetchUnreadNotes(communityId);
          return true;
        }
      } catch (err) {
        console.error('Erro ao registrar log de atividade:', err);
      }
      return false;
    },
    [currentUser, isParishMaster, selectedCommunityId, fetchUnreadNotes, supabase]
  );

  const isSimulating = useMemo(
    () => Boolean(primaryUserId && currentUser && currentUser.id !== primaryUserId),
    [primaryUserId, currentUser]
  );

  const exitSimulation = useCallback(() => {
    if (primaryUserId) {
      const found = allUsers.find((u) => u.id === primaryUserId);
      if (found) {
        setCurrentUser(found);
        setSelectedCommunityIdState(null);
      }
    }
  }, [primaryUserId, allUsers]);

  const logout = useCallback(async () => {
    await destroyAdminSession();
    setCurrentUser(null);
    router.push('/login?switch=1');
    router.refresh();
  }, [router]);

  return (
    <AdminCommunityContext.Provider
      value={{
        parishes,
        activeParish,
        setActiveParishId,
        currentUser,
        allUsers,
        communities,
        selectedCommunityId,
        selectedCommunity,
        isParishMaster,
        isSimulating,
        exitSimulation,
        logout,
        unreadPastoralNotes,
        loading,
        setSelectedCommunityId,
        switchUser,
        hasModulePermission,
        markNoteAsRead,
        recordActivityLog,
        refreshData,
      }}
    >
      {children}
    </AdminCommunityContext.Provider>
  );
}

export function useAdminCommunity() {
  const context = useContext(AdminCommunityContext);
  if (!context) {
    throw new Error('useAdminCommunity deve ser usado dentro de um AdminCommunityProvider');
  }
  return context;
}
