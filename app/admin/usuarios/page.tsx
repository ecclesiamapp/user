'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Scroll, 
  Users, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { UserProfile, CommunityActivityLog } from '@/types';
import { Button, Card, Badge } from '@/components/ui';
import { 
  ActiveUsersTab, 
  PendingRequestsTab, 
  CebActivityFeedTab, 
  UserModal, 
  PastoralNoteModal 
} from '@/components/admin/usuarios';
import { useAdminCommunity } from '@/components/admin/context/AdminCommunityContext';

type TabKey = 'active' | 'pending' | 'activity';

export default function UsuariosAdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activityLogs, setActivityLogs] = useState<CommunityActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modais
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
  const [isPastoralModalOpen, setIsPastoralModalOpen] = useState<boolean>(false);

  const supabase = createClient();
  const { communities, refreshData: refreshContext } = useAdminCommunity();

  // Buscar Usuários e Logs
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Buscar perfis
      const { data: usersData, error: usersErr } = await supabase
        .from('user_profiles')
        .select('*')
        .order('role')
        .order('name');

      if (!usersErr && usersData) {
        setUsers(usersData as UserProfile[]);
      }

      // 2. Buscar logs
      const { data: logsData, error: logsErr } = await supabase
        .from('community_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!logsErr && logsData) {
        setActivityLogs(logsData as CommunityActivityLog[]);
      }
    } catch (err) {
      console.error('Erro ao buscar dados de RBAC:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Salvar ou Atualizar Usuário
  const handleSaveUser = async (userData: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (userData.id) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            community_id: userData.community_id,
            status: userData.status,
            allowed_modules: userData.allowed_modules,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userData.id);

        if (error) throw error;
        showFeedback('Perfil de usuário atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('user_profiles')
          .insert([userData]);

        if (error) throw error;
        showFeedback('Novo usuário cadastrado com sucesso!');
      }

      await fetchData();
      await refreshContext();
      return true;
    } catch (err: any) {
      console.error('Erro ao salvar usuário:', err);
      showFeedback(err.message || 'Erro ao salvar usuário.', 'error');
      return false;
    }
  };

  // Aprovar Solicitação Pendente
  const handleApprove = (user: UserProfile) => {
    setUserToEdit({ ...user, status: 'ativo' });
    setIsUserModalOpen(true);
  };

  // Recusar Solicitação
  const handleReject = async (user: UserProfile) => {
    if (!confirm(`Deseja realmente recusar a solicitação de acesso de ${user.name}?`)) return;
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: 'bloqueado' })
        .eq('id', user.id);

      if (error) throw error;
      showFeedback(`Solicitação de ${user.name} recusada.`);
      await fetchData();
      await refreshContext();
    } catch (err: any) {
      showFeedback('Erro ao recusar solicitação.', 'error');
    }
  };

  // Alternar Status de Usuário Ativo/Bloqueado
  const handleToggleStatus = async (user: UserProfile) => {
    const nextStatus = user.status === 'ativo' ? 'bloqueado' : 'ativo';
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: nextStatus })
        .eq('id', user.id);

      if (error) throw error;
      showFeedback(`Status de ${user.name} alterado para ${nextStatus}.`);
      await fetchData();
      await refreshContext();
    } catch (err: any) {
      showFeedback('Erro ao alterar status.', 'error');
    }
  };

  // Enviar Nova Nota Pastoral
  const handleSendPastoralNote = async (params: {
    communityId: string;
    actionType: string;
    pastoralNote: string;
    changesSummary: string;
  }): Promise<boolean> => {
    try {
      const { error } = await supabase.from('community_activity_logs').insert([
        {
          community_id: params.communityId,
          author_name: 'Pároco / Secretaria Catedral',
          author_role: 'paroquia',
          action_type: params.actionType,
          pastoral_note: params.pastoralNote,
          changes_summary: params.changesSummary,
          is_read_by_community: false,
        },
      ]);

      if (error) throw error;
      showFeedback('Nota pastoral emitida com sucesso para a comunidade!');
      await fetchData();
      await refreshContext();
      return true;
    } catch (err: any) {
      console.error('Erro ao emitir nota pastoral:', err);
      showFeedback('Erro ao emitir nota pastoral.', 'error');
      return false;
    }
  };

  const pendingCount = useMemo(() => {
    return users.filter((u) => u.status === 'pendente').length;
  }, [users]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Toast de Feedback */}
      {feedbackMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-slide-up ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--dash-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
              Governança Canônica & RBAC
            </span>
            <Badge variant="outline" className="text-[10px] bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30 font-bold">
              Multi-Comunidades
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--dash-text-primary)] tracking-tight">
            Gestão de Usuários & Permissões
          </h2>
          <p className="text-xs sm:text-sm text-[var(--dash-text-muted)] mt-0.5">
            Controle de acessos de Pároco, Vigário, Secretaria, PASCOM e Coordenadores de CEB com changelog fraterno.
          </p>
        </div>

        {/* Botões de Ação Rápida */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsPastoralModalOpen(true)}
            className="flex-1 sm:flex-none text-xs font-semibold rounded-xl border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 min-h-[42px] px-3.5 flex items-center justify-center gap-1.5"
          >
            <Scroll className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Emitir Nota Pastoral</span>
          </Button>

          <Button
            onClick={() => {
              setUserToEdit(null);
              setIsUserModalOpen(true);
            }}
            className="flex-1 sm:flex-none text-xs font-semibold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white min-h-[42px] px-4 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Colaborador</span>
          </Button>
        </div>
      </div>

      {/* Abas Superiores */}
      <div className="flex items-center gap-2 border-b border-[var(--dash-border)] pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 -mb-px ${
            activeTab === 'active'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5'
              : 'border-transparent text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Colaboradores & Perfis</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] font-semibold">
            {users.filter((u) => u.status !== 'pendente').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 -mb-px ${
            activeTab === 'pending'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/5'
              : 'border-transparent text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Solicitações Pendentes</span>
          {pendingCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 -mb-px ${
            activeTab === 'activity'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5'
              : 'border-transparent text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Auditoria & Changelog Fraterno</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] font-semibold">
            {activityLogs.length}
          </span>
        </button>
      </div>

      {/* Conteúdo da Aba Selecionada */}
      {activeTab === 'active' && (
        <ActiveUsersTab
          users={users}
          communities={communities}
          onEditUser={(user) => {
            setUserToEdit(user);
            setIsUserModalOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {activeTab === 'pending' && (
        <PendingRequestsTab
          users={users}
          communities={communities}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {activeTab === 'activity' && (
        <CebActivityFeedTab
          logs={activityLogs}
          communities={communities}
          onOpenNewNote={() => setIsPastoralModalOpen(true)}
        />
      )}

      {/* Modais Globais da Página */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={handleSaveUser}
        userToEdit={userToEdit}
        communities={communities}
      />

      <PastoralNoteModal
        isOpen={isPastoralModalOpen}
        onClose={() => setIsPastoralModalOpen(false)}
        onSend={handleSendPastoralNote}
        communities={communities}
      />
    </div>
  );
}
