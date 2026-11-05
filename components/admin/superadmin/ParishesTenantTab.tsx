'use client';

import React, { useState } from 'react';
import {
  Building2,
  Globe,
  CheckCircle2,
  Clock,
  PauseCircle,
  ExternalLink,
  Plus,
  Edit3,
  Save,
  X,
  ArrowRight,
  Users,
  MapPin,
} from 'lucide-react';
import { Parish, ParishSubscriptionStatus } from '@/types';
import { Button, Card, Badge } from '@/components/ui';

interface ParishesTenantTabProps {
  parishes: Parish[];
  activeParishId: string;
  userCountsByParish: Record<string, number>;
  communityCountsByParish: Record<string, number>;
  onSelectActiveParish: (parishId: string) => void;
  onUpdateParish: (parishId: string, updates: Partial<Parish>) => Promise<boolean>;
  onOpenProvisionModal: () => void;
}

const STATUS_BADGES: Record<
  ParishSubscriptionStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  ativa: {
    label: 'Ativa em Produção',
    className: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    icon: CheckCircle2,
  },
  implantacao: {
    label: 'Em Implantação',
    className: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    icon: Clock,
  },
  suspensa: {
    label: 'Admin Suspenso',
    className: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
    icon: PauseCircle,
  },
};

const PLAN_LABELS: Record<string, string> = {
  catedral_enterprise: 'Catedral / Sede Diocesana',
  paroquia_pro: 'Paróquia Multi-CEBs (Pro)',
  paroquia_essencial: 'Paróquia Essencial',
};

export function ParishesTenantTab({
  parishes,
  activeParishId,
  userCountsByParish,
  communityCountsByParish,
  onSelectActiveParish,
  onUpdateParish,
  onOpenProvisionModal,
}: ParishesTenantTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDomain, setEditDomain] = useState('');
  const [editPlan, setEditPlan] = useState('catedral_enterprise');
  const [savingId, setSavingId] = useState<string | null>(null);

  const startEditing = (p: Parish) => {
    setEditingId(p.id);
    setEditDomain(p.custom_domain || '');
    setEditPlan(p.plan_tier || 'catedral_enterprise');
  };

  const handleSaveEdit = async (parishId: string) => {
    setSavingId(parishId);
    const ok = await onUpdateParish(parishId, {
      custom_domain: editDomain.trim().toLowerCase() || null,
      plan_tier: editPlan,
    });
    setSavingId(null);
    if (ok) setEditingId(null);
  };

  const handleQuickStatusChange = async (
    parishId: string,
    nextStatus: ParishSubscriptionStatus
  ) => {
    setSavingId(parishId);
    await onUpdateParish(parishId, { subscription_status: nextStatus });
    setSavingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--dash-surface)] p-4 rounded-2xl border border-[var(--dash-border)]">
        <div>
          <h3 className="text-sm font-bold text-[var(--dash-text-primary)]">
            Paróquias Clientes & Isolamento de Tenants ({parishes.length})
          </h3>
          <p className="text-xs text-[var(--dash-text-muted)]">
            A suspensão de contrato bloqueia apenas o acesso ao painel `/admin` da paróquia, mantendo o portal público dos fiéis no ar.
          </p>
        </div>

        <Button
          onClick={onOpenProvisionModal}
          className="rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold min-h-[42px] px-4 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Provisionar Nova Paróquia</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {parishes.map((parish) => {
          const statusKey: ParishSubscriptionStatus = parish.subscription_status || 'ativa';
          const statusMeta = STATUS_BADGES[statusKey] || STATUS_BADGES.ativa;
          const StatusIcon = statusMeta.icon;
          const isCurrentTenant = parish.id === activeParishId;
          const isEditing = editingId === parish.id;
          const isSaving = savingId === parish.id;

          return (
            <Card
              key={parish.id}
              className={`p-5 rounded-2xl border transition-all space-y-4 ${
                isCurrentTenant
                  ? 'border-[var(--primary)] bg-[var(--dash-surface)] shadow-md'
                  : 'border-[var(--dash-border)] bg-[var(--dash-surface)]'
              }`}
            >
              {/* Topo do Card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-extrabold text-[var(--dash-text-primary)] truncate">
                        {parish.name}
                      </h4>
                      {isCurrentTenant && (
                        <Badge className="text-[10px] bg-[var(--primary)] text-white font-bold">
                          Painel Ativo Agora
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[var(--dash-text-muted)]">
                      {parish.diocese} • {parish.city}/{parish.state}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold shrink-0 ${statusMeta.className}`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>{statusMeta.label}</span>
                </span>
              </div>

              {/* Métricas e Domínio */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[var(--dash-surface-secondary)]/60 border border-[var(--dash-border)] text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--dash-text-muted)] block">
                    Domínio Público
                  </span>
                  <span className="font-bold text-[var(--dash-text-primary)] flex items-center gap-1 truncate mt-0.5">
                    <Globe className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                    <span className="truncate">
                      {parish.custom_domain || 'Não configurado'}
                    </span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--dash-text-muted)] block">
                    Comunidades
                  </span>
                  <span className="font-bold text-[var(--dash-text-primary)] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{communityCountsByParish[parish.id] || 1} CEBs</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--dash-text-muted)] block">
                    Credenciais
                  </span>
                  <span className="font-bold text-[var(--dash-text-primary)] flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{userCountsByParish[parish.id] || 0} usuários</span>
                  </span>
                </div>
              </div>

              {/* Modo de Edição Rápida de Domínio e Plano */}
              {isEditing ? (
                <div className="p-3.5 rounded-xl bg-[var(--dash-surface-elevated)] border border-[var(--dash-border)] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[var(--dash-text-primary)] block mb-1">
                        Domínio Oficial (sem https://)
                      </label>
                      <input
                        type="text"
                        value={editDomain}
                        onChange={(e) => setEditDomain(e.target.value)}
                        placeholder="ex: catedraldecolatina.org.br"
                        className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2 text-xs min-h-[40px]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[var(--dash-text-primary)] block mb-1">
                        Plano Contratado
                      </label>
                      <select
                        value={editPlan}
                        onChange={(e) => setEditPlan(e.target.value)}
                        className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] pl-3 pr-10 py-2 text-xs min-h-[40px]"
                      >
                        <option value="catedral_enterprise">Catedral / Sede Diocesana</option>
                        <option value="paroquia_pro">Paróquia Multi-CEBs (Pro)</option>
                        <option value="paroquia_essencial">Paróquia Essencial</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      className="rounded-xl text-xs"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      disabled={isSaving}
                      onClick={() => handleSaveEdit(parish.id)}
                      className="rounded-xl text-xs bg-[var(--primary)] text-white"
                    >
                      <Save className="w-3.5 h-3.5 mr-1" />
                      Salvar Domínio & Plano
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-[var(--dash-text-muted)] px-1">
                  <span>
                    Plano:{' '}
                    <strong className="text-[var(--dash-text-primary)]">
                      {PLAN_LABELS[parish.plan_tier || 'catedral_enterprise'] ||
                        parish.plan_tier}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => startEditing(parish)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Domínio / Plano</span>
                  </button>
                </div>
              )}

              {/* Rodapé do Card: Kill-Switch de Status + Botão de Assumir Painel */}
              <div className="pt-3 border-t border-[var(--dash-border)] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[var(--dash-text-muted)] mr-1">
                    Contrato:
                  </span>
                  {(['ativa', 'implantacao', 'suspensa'] as ParishSubscriptionStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        disabled={isSaving || statusKey === st}
                        onClick={() => handleQuickStatusChange(parish.id, st)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          statusKey === st
                            ? 'bg-[var(--dash-text-primary)] text-[var(--dash-surface)] border-[var(--dash-text-primary)]'
                            : 'bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] border-[var(--dash-border)] hover:brightness-95'
                        }`}
                      >
                        {st === 'ativa'
                          ? 'Ativa'
                          : st === 'implantacao'
                          ? 'Implantação'
                          : 'Suspender'}
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {parish.custom_domain && (
                    <a
                      href={`https://${parish.custom_domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-[var(--dash-border)] text-[var(--dash-text-secondary)] hover:text-[var(--primary)]"
                      title={`Abrir ${parish.custom_domain}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {!isCurrentTenant && (
                    <Button
                      size="sm"
                      onClick={() => onSelectActiveParish(parish.id)}
                      className="rounded-xl text-xs font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white flex items-center gap-1.5"
                    >
                      <span>Gerenciar Painel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

