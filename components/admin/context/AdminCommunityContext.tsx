'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Community, UserProfile, CommunityActivityLog, AllowedCommunityModule } from '@/types';

interface AdminCommunityContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  communities: Community[];
  selectedCommunityId: string | null;
  selectedCommunity: Community | null;
  isParishMaster: boolean;
  isSimulating: boolean;
  exitSimulation: () => void;
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
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [primaryUserId, setPrimaryUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunityId, setSelectedCommunityIdState] = useState<string | null>(null);
  const [unreadPastoralNotes, setUnreadPastoralNotes] = useState<CommunityActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = createClient();

  // 1. Carregar Comunidades e Usuários
  const refreshData = useCallback(async () => {
    try {
      // Buscar comunidades
      const { data: commsData } = await supabase
        .from('communities')
        .select('*')
        .order('is_headquarters', { ascending: false })
        .order('name');

      if (commsData) {
        setCommunities(commsData as Community[]);
      }

      // Buscar perfis de usuários
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select('*')
        .order('role')
        .order('name');

      if (usersData && usersData.length > 0) {
        setAllUsers(usersData as UserProfile[]);

        const defaultParoco = (usersData as UserProfile[]).find((u) => u.role === 'paroco') || usersData[0];
        setPrimaryUserId((prev) => prev || defaultParoco.id);

        // Se ainda não houver usuário selecionado, define o Pároco por padrão
        setCurrentUser((prev) => {
          if (prev) {
            const updated = (usersData as UserProfile[]).find((u) => u.id === prev.id);
            return updated || prev;
          }
          return defaultParoco as UserProfile;
        });
      }
    } catch (err) {
      console.error('Erro ao carregar dados de contexto comunitário/RBAC:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Se o usuário for Coordenador de CEB, força o selectedCommunityId para a sua comunidade
  useEffect(() => {
    if (currentUser && currentUser.role === 'coordenador_ceb') {
      if (currentUser.community_id) {
        setSelectedCommunityIdState(currentUser.community_id);
      }
    }
  }, [currentUser]);

  // 2. Buscar Notas Pastorais não lidas quando há comunidade selecionada
  const fetchUnreadNotes = useCallback(async (communityId: string) => {
    try {
      const { data } = await supabase
        .from('community_activity_logs')
        .select('*')
        .eq('community_id', communityId)
        .eq('author_role', 'paroquia')
        .eq('is_read_by_community', false)
        .order('created_at', { ascending: false });

      if (data) {
        setUnreadPastoralNotes(data as CommunityActivityLog[]);
      }
    } catch (err) {
      console.warn('Erro ao carregar notas pastorais:', err);
    }
  }, [supabase]);

  useEffect(() => {
    if (selectedCommunityId) {
      fetchUnreadNotes(selectedCommunityId);
    } else {
      setUnreadPastoralNotes([]);
    }
  }, [selectedCommunityId, fetchUnreadNotes]);

  // É nível paróquia? (Pároco, Vigário, Secretaria, PASCOM)
  const isParishMaster = useMemo(() => {
    if (!currentUser) return true;
    return currentUser.role !== 'coordenador_ceb';
  }, [currentUser]);

  // Comunidade selecionada ativa
  const selectedCommunity = useMemo(() => {
    if (!selectedCommunityId) return null;
    return communities.find((c) => c.id === selectedCommunityId) || null;
  }, [communities, selectedCommunityId]);

  // Permissão de alteração de comunidade
  const setSelectedCommunityId = useCallback((id: string | null) => {
    if (!isParishMaster && currentUser?.community_id) {
      // Coordenador de CEB não pode mudar para outra comunidade nem ir para o geral
      setSelectedCommunityIdState(currentUser.community_id);
      return;
    }
    setSelectedCommunityIdState(id);
  }, [isParishMaster, currentUser]);

  // Alternar usuário simulado (para testes rápidos de RBAC)
  const switchUser = useCallback((userId: string) => {
    const found = allUsers.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      if (found.role === 'coordenador_ceb') {
        setSelectedCommunityIdState(found.community_id || null);
      }
    }
  }, [allUsers]);

  // Checar permissão de módulo
  const hasModulePermission = useCallback((moduleKey: AllowedCommunityModule): boolean => {
    if (!currentUser) return true;
    if (isParishMaster) return true; // Nível paróquia tem acesso irrestrito
    const modules = currentUser.allowed_modules || [];
    if (modules.includes('all')) return true;
    return modules.includes(moduleKey);
  }, [currentUser, isParishMaster]);

  // Marcar nota pastoral como lida
  const markNoteAsRead = useCallback(async (logId: string): Promise<boolean> => {
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
  }, [supabase]);

  // Gravar log de atividade / changelog fraterno
  const recordActivityLog = useCallback(async ({
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
          is_read_by_community: !isParishMaster, // Se foi o coordenador, já está ciente
        },
      ]);

      if (!error) {
        if (selectedCommunityId === communityId) {
          fetchUnreadNotes(communityId);
        }
        return true;
      }
    } catch (err) {
      console.error('Erro ao registrar log de atividade:', err);
    }
    return false;
  }, [currentUser, isParishMaster, selectedCommunityId, fetchUnreadNotes, supabase]);

  // Modo de simulação ativo
  const isSimulating = useMemo(() => {
    return Boolean(primaryUserId && currentUser && currentUser.id !== primaryUserId);
  }, [primaryUserId, currentUser]);

  // Sair da simulação e voltar para o usuário mestre da paróquia
  const exitSimulation = useCallback(() => {
    if (primaryUserId) {
      const found = allUsers.find((u) => u.id === primaryUserId);
      if (found) {
        setCurrentUser(found);
        setSelectedCommunityIdState(null);
      }
    }
  }, [primaryUserId, allUsers]);

  // Sincronizar sessão administrativa para que páginas públicas e subpáginas reconheçam o usuário logado
  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      try {
        localStorage.setItem(
          'ecclesiam_admin_session',
          JSON.stringify({
            active: true,
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role,
            community_id: currentUser.community_id,
            is_simulating: isSimulating,
            updatedAt: Date.now(),
          })
        );
        document.cookie = 'ecclesiam_admin_active=true; path=/; max-age=86400; SameSite=Lax';
      } catch (e) {
        // ignore storage quota error
      }
    }
  }, [currentUser, isSimulating]);

  return (
    <AdminCommunityContext.Provider
      value={{
        currentUser,
        allUsers,
        communities,
        selectedCommunityId,
        selectedCommunity,
        isParishMaster,
        isSimulating,
        exitSimulation,
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
