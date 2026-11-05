'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  UserPlus,
  RefreshCw,
  KeyRound,
  ArrowLeftRight,
} from 'lucide-react';
import { Parish, SecurityAuditLog, SecurityAuditEventType } from '@/types';
import { Card, Badge, Button } from '@/components/ui';

interface SecurityAuditTabProps {
  logs: SecurityAuditLog[];
  parishes: Parish[];
  onRefresh: () => void;
}

const EVENT_META: Record<
  SecurityAuditEventType,
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  login_success: {
    label: 'Login Autorizado',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    icon: CheckCircle2,
  },
  login_failed: {
    label: 'Falha de Autenticação',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    icon: AlertTriangle,
  },
  login_blocked_rate_limit: {
    label: 'Bloqueio Força Bruta',
    badgeClass: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
    icon: AlertTriangle,
  },
  logout: {
    label: 'Sessão Encerrada',
    badgeClass: 'bg-slate-500/10 text-slate-700 border-slate-500/30',
    icon: LogOut,
  },
  access_request_submitted: {
    label: 'Solicitação de Cadastro',
    badgeClass: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
    icon: UserPlus,
  },
  tenant_switch: {
    label: 'Troca de Paróquia (SaaS)',
    badgeClass: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
    icon: ArrowLeftRight,
  },
  password_reset_requested: {
    label: 'Recuperação de Senha',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    icon: KeyRound,
  },
};

export function SecurityAuditTab({ logs, parishes, onRefresh }: SecurityAuditTabProps) {
  const [eventFilter, setEventFilter] = useState<string>('all');

  const parishNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    parishes.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [parishes]);

  const filteredLogs = useMemo(() => {
    if (eventFilter === 'all') return logs;
    return logs.filter((l) => l.event_type === eventFilter);
  }, [logs, eventFilter]);

  return (
    <div className="space-y-4">
      {/* Checklist de Prontidão de Produção Multi-Tenant */}
      <Card className="p-4 sm:p-5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-[var(--dash-text-primary)]">
              Checklist de Segurança em Produção (LGPD Art. 6, X & Art. 46)
            </h3>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[10px] font-bold">
            Proteção Ativa
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)]/50 border border-[var(--dash-border)]">
            <span className="font-bold text-[var(--dash-text-primary)] block">
              ✓ Roteamento de Domínio (`proxy.ts`)
            </span>
            <span className="text-[var(--dash-text-muted)] text-[11px]">
              Bloqueia `/admin` no domínio da paróquia e redireciona para `ecclesiamapp.com.br/login`.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)]/50 border border-[var(--dash-border)]">
            <span className="font-bold text-[var(--dash-text-primary)] block">
              ✓ Trava Anti-Força Bruta
            </span>
            <span className="text-[var(--dash-text-muted)] text-[11px]">
              Limite de 5 tentativas com bloqueio automático de 3 minutos e registro em log.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)]/50 border border-[var(--dash-border)]">
            <span className="font-bold text-[var(--dash-text-primary)] block">
              ✓ Isolamento Multi-Tenant (`parish_id`)
            </span>
            <span className="text-[var(--dash-text-muted)] text-[11px]">
              Cada colaborador acessa exclusivamente os dados da sua paróquia vinculada.
            </span>
          </div>
        </div>
      </Card>

      {/* Barra de Filtro dos Eventos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--dash-surface)] p-4 rounded-2xl border border-[var(--dash-border)]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[var(--dash-text-primary)]">
            Trilha de Auditoria (`security_audit_logs`):
          </span>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="dash-select rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] pl-3 pr-9 py-1.5 text-xs font-semibold min-h-[38px]"
          >
            <option value="all">Todos os Eventos ({logs.length})</option>
            <option value="login_success">Logins Autorizados</option>
            <option value="login_failed">Falhas de Senha</option>
            <option value="login_blocked_rate_limit">Bloqueios Força Bruta</option>
            <option value="access_request_submitted">Solicitações de Cadastro</option>
            <option value="tenant_switch">Trocas de Tenant SaaS</option>
          </select>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          className="rounded-xl text-xs font-bold min-h-[38px] flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Atualizar Logs</span>
        </Button>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-2">
        {filteredLogs.length === 0 ? (
          <Card className="p-8 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-center text-xs text-[var(--dash-text-muted)]">
            Nenhum evento de segurança registrado para este filtro ainda.
          </Card>
        ) : (
          filteredLogs.map((log) => {
            const meta = EVENT_META[log.event_type] || EVENT_META.login_success;
            const Icon = meta.icon;
            const dateFormatted = new Date(log.created_at).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold shrink-0 ${meta.badgeClass}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{meta.label}</span>
                  </span>

                  <div className="min-w-0">
                    <span className="font-mono font-bold text-[var(--dash-text-primary)] mr-2">
                      {log.email}
                    </span>
                    {log.parish_id && parishNameMap[log.parish_id] && (
                      <span className="text-[11px] text-[var(--dash-text-muted)]">
                        • {parishNameMap[log.parish_id]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[var(--dash-text-muted)] shrink-0">
                  {log.role && (
                    <span className="px-2 py-0.5 rounded bg-[var(--dash-surface-secondary)] font-semibold">
                      {log.role}
                    </span>
                  )}
                  <span className="tabular-nums font-medium">{dateFormatted}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

