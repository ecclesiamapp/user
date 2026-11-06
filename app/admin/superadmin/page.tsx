'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Building2,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
  Activity,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
  Parish,
  UserProfile,
  UserStatus,
  SecurityAuditLog,
  Community,
} from '@/types';
import { Button, Card, Badge } from '@/components/ui';
import { AdminRoleGuard } from '@/components/admin/auth/AdminRoleGuard';
import { useAdminCommunity } from '@/components/admin/context/AdminCommunityContext';
import { recordSecurityAudit } from '@/lib/security/authSecurity';
import {
  ParishesTenantTab,
  ProvisionParishModal,
  ProvisionParishInput,
  CredentialsSupportTab,
  SecurityAuditTab,
} from '@/components/admin/superadmin';

type SuperadminTab = 'parishes' | 'credentials' | 'security';

export default function SuperadminHubPage() {
  const supabase = createClient();
  const {
    parishes,
    activeParish,
    setActiveParishId,
    currentUser,
    refreshData: refreshGlobalContext,
  } = useAdminCommunity();

  const [activeTab, setActiveTab] = useState<SuperadminTab>('parishes');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [provisionOpen, setProvisionOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchSuperadminData = useCallback(async () => {
    try {
      const [usersRes, commsRes, logsRes] = await Promise.all([
        supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('communities').select('id, parish_id, name'),
        supabase
          .from('security_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(80),
      ]);

      if (usersRes.data) setAllUsers(usersRes.data as UserProfile[]);
      if (commsRes.data) setAllCommunities(commsRes.data as Community[]);
      if (logsRes.data) setAuditLogs(logsRes.data as SecurityAuditLog[]);
    } catch (err) {
      console.warn('Erro ao carregar dados do Hub Superadmin:', err);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSuperadminData();
  }, [fetchSuperadminData]);

  const userCountsByParish = useMemo(() => {
    const counts: Record<string, number> = {};
    allUsers.forEach((u) => {
      const pid = u.parish_id || 'c0000000-0000-0000-0000-000000000001';
      counts[pid] = (counts[pid] || 0) + 1;
    });
    return counts;
  }, [allUsers]);

  const communityCountsByParish = useMemo(() => {
    const counts: Record<string, number> = {};
    allCommunities.forEach((c) => {
      const pid = c.parish_id || 'c0000000-0000-0000-0000-000000000001';
      counts[pid] = (counts[pid] || 0) + 1;
    });
    return counts;
  }, [allCommunities]);

  const handleUpdateParish = async (
    parishId: string,
    updates: Partial<Parish>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('parishes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', parishId);

      if (error) throw error;
      showToast('Configurações da paróquia atualizadas com sucesso!');
      await refreshGlobalContext();
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Erro ao atualizar paróquia.', 'error');
      return false;
    }
  };

  const handleProvisionParish = async (
    input: ProvisionParishInput
  ): Promise<{ success: boolean; error?: string; parishId?: string }> => {
    try {
      const slug = input.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // 1. Inserir Paróquia
      const { data: newParish, error: parishErr } = await supabase
        .from('parishes')
        .insert([
          {
            name: input.name,
            diocese: input.diocese,
            slug: `${slug}-${Date.now().toString().slice(-4)}`,
            city: input.city,
            state: input.state,
            primary_color: '#8B1E22',
            whatsapp_number: input.whatsappNumber,
            address: `${input.city} - ${input.state}`,
            pix_key: input.pixKey || 'Chave PIX em configuração',
            pix_key_type: 'cnpj',
            custom_domain: input.customDomain || null,
            subscription_status: 'ativa',
            plan_tier: input.planTier,
          },
        ])
        .select('*')
        .single();

      if (parishErr || !newParish) {
        return {
          success: false,
          error: parishErr?.message || 'Não foi possível criar o registro da paróquia.',
        };
      }

      // 2. Criar Comunidade Sede automaticamente
      await supabase.from('communities').insert([
        {
          parish_id: newParish.id,
          name: `${input.name} (Sede)`,
          patron_saint: input.name,
          is_headquarters: true,
          city: input.city,
          state: input.state,
          is_active: true,
          slug: `${slug}-sede`,
        },
      ]);

      // 3. Criar Credencial Inicial do Pároco / Secretaria
      const { error: userErr } = await supabase.from('user_profiles').insert([
        {
          parish_id: newParish.id,
          name: input.adminName,
          email: input.adminEmail,
          role: input.adminRole,
          status: 'ativo',
          allowed_modules: ['all'],
          access_code: input.initialAccessCode,
        },
      ]);

      if (userErr) {
        return {
          success: false,
          error: `Paróquia criada, mas houve erro ao criar o usuário: ${userErr.message}`,
        };
      }

      await refreshGlobalContext();
      await fetchSuperadminData();
      showToast(`Paróquia ${input.name} provisionada com sucesso!`);
      return { success: true, parishId: newParish.id };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Erro inesperado ao provisionar paróquia.',
      };
    }
  };

  const handleUpdateUserCredential = async (
    userId: string,
    updates: { status?: UserStatus; access_code?: string }
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      if (updates.access_code) {
        const targetUser = allUsers.find((u) => u.id === userId);
        if (targetUser) {
          await recordSecurityAudit({
            email: targetUser.email,
            eventType: 'password_reset_requested',
            parishId: targetUser.parish_id,
            userProfileId: targetUser.id,
            role: targetUser.role,
            metadata: { updated_by: currentUser?.email || 'superadmin' },
          });
        }
      }

      showToast('Credencial atualizada com sucesso!');
      await fetchSuperadminData();
      await refreshGlobalContext();
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Erro ao atualizar credencial.', 'error');
      return false;
    }
  };

  const activeParishesCount = parishes.filter(
    (p) => (p.subscription_status || 'ativa') === 'ativa'
  ).length;
  const pendingUsersCount = allUsers.filter((u) => u.status === 'pendente').length;

  return (
    <AdminRoleGuard allowedRoles={['superadmin']} moduleName="o Hub SaaS Master do Superadmin">
      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
        {feedback && (
          <div
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold ${
              feedback.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Header Master */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[var(--dash-border)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-[var(--primary)] text-white text-[10px] font-bold uppercase">
                Ecclesiam SaaS Master
              </Badge>
              <span className="text-xs font-semibold text-[var(--dash-text-muted)]">
                ecclesiamapp.com.br
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--dash-text-primary)] tracking-tight">
              Hub de Governança Multi-Paróquia (Superadmin)
            </h2>
            <p className="text-xs sm:text-sm text-[var(--dash-text-muted)]">
              Provisionamento de paróquias clientes, controle de assinaturas, suporte de senhas e auditoria LGPD.
            </p>
          </div>

          <Button
            onClick={() => setProvisionOpen(true)}
            className="rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold min-h-[44px] px-4 flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Paróquia Cliente</span>
          </Button>
        </div>

        {/* KPIs Operacionais SaaS (Não-Financeiros) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[var(--dash-text-muted)] block">
                Paróquias Ativas
              </span>
              <span className="text-xl font-black text-[var(--dash-text-primary)]">
                {activeParishesCount} / {parishes.length}
              </span>
            </div>
          </Card>

          <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[var(--dash-text-muted)] block">
                Credenciais Emitidas
              </span>
              <span className="text-xl font-black text-[var(--dash-text-primary)]">
                {allUsers.length}{' '}
                {pendingUsersCount > 0 && (
                  <span className="text-xs font-bold text-amber-600">
                    ({pendingUsersCount} pendentes)
                  </span>
                )}
              </span>
            </div>
          </Card>

          <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[var(--dash-text-muted)] block">
                Eventos de Segurança
              </span>
              <span className="text-xl font-black text-[var(--dash-text-primary)]">
                {auditLogs.length} registros
              </span>
            </div>
          </Card>
        </div>

        {/* Abas do Hub Superadmin */}
        <div className="flex items-center gap-2 border-b border-[var(--dash-border)] pb-px overflow-x-auto">
          {[
            {
              key: 'parishes' as SuperadminTab,
              label: 'Paróquias & Assinaturas',
              icon: Building2,
              count: parishes.length,
            },
            {
              key: 'credentials' as SuperadminTab,
              label: 'Suporte de Senhas & Credenciais',
              icon: KeyRound,
              count: allUsers.length,
            },
            {
              key: 'security' as SuperadminTab,
              label: 'Auditoria LGPD & Segurança',
              icon: ShieldCheck,
              count: auditLogs.length,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                  active
                    ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5'
                    : 'border-transparent text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo da Aba Ativa */}
        {activeTab === 'parishes' && (
          <ParishesTenantTab
            parishes={parishes}
            activeParishId={activeParish?.id || 'c0000000-0000-0000-0000-000000000001'}
            userCountsByParish={userCountsByParish}
            communityCountsByParish={communityCountsByParish}
            onSelectActiveParish={async (pid) => {
              setActiveParishId(pid);
              showToast('Contexto do painel alterado para a paróquia selecionada!');
              await recordSecurityAudit({
                email: currentUser?.email || 'admin@ecclesiamapp.com.br',
                eventType: 'tenant_switch',
                parishId: pid,
                role: 'superadmin',
                metadata: { switched_at: new Date().toISOString() },
              });
              await fetchSuperadminData();
            }}
            onUpdateParish={handleUpdateParish}
            onOpenProvisionModal={() => setProvisionOpen(true)}
          />
        )}

        {activeTab === 'credentials' && (
          <CredentialsSupportTab
            parishes={parishes}
            users={allUsers}
            currentUser={currentUser}
            onUpdateUserCredential={handleUpdateUserCredential}
          />
        )}

        {activeTab === 'security' && (
          <SecurityAuditTab
            logs={auditLogs}
            parishes={parishes}
            onRefresh={fetchSuperadminData}
          />
        )}

        <ProvisionParishModal
          isOpen={provisionOpen}
          onClose={() => setProvisionOpen(false)}
          onProvision={handleProvisionParish}
        />
      </div>
    </AdminRoleGuard>
  );
}

