'use client';

import React, { useState, useMemo } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Ban,
  Save,
  Search,
  Lock,
  Building2,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
import { Parish, UserProfile, UserStatus } from '@/types';
import { Button, Card, Badge } from '@/components/ui';

interface CredentialsSupportTabProps {
  parishes: Parish[];
  users: UserProfile[];
  currentUser: UserProfile | null;
  onUpdateUserCredential: (
    userId: string,
    updates: { status?: UserStatus; access_code?: string }
  ) => Promise<boolean>;
}

const ROLE_LABELS: Record<string, string> = {
  superadmin: 'Superadmin (SaaS)',
  paroco: 'Pároco',
  vigario: 'Vigário Paroquial',
  secretaria: 'Secretaria Paroquial',
  pascom: 'PASCOM',
  coordenador_ceb: 'Coordenador de CEB',
};

export function CredentialsSupportTab({
  parishes,
  users,
  currentUser,
  onUpdateUserCredential,
}: CredentialsSupportTabProps) {
  const [selectedParishFilter, setSelectedParishFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCodeUserId, setEditingCodeUserId] = useState<string | null>(null);
  const [newAccessCode, setNewAccessCode] = useState('');
  const [masterNewPassword, setMasterNewPassword] = useState('');
  const [savingMaster, setSavingMaster] = useState(false);
  const [visibleCodes, setVisibleCodes] = useState<Record<string, boolean>>({});
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);

  const toggleCodeVisibility = (userId: string) => {
    setVisibleCodes((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleCopyCode = (userId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedUserId(userId);
    setTimeout(() => setCopiedUserId(null), 2500);
  };

  const parishNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    parishes.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [parishes]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (selectedParishFilter !== 'all' && u.parish_id !== selectedParishFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [users, selectedParishFilter, searchQuery]);

  const handleSaveMasterPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id || !masterNewPassword.trim()) return;
    if (masterNewPassword.trim().length < 8) {
      alert('A Senha Master do Superadmin deve ter no mínimo 8 caracteres para proteção em produção.');
      return;
    }
    setSavingMaster(true);
    const ok = await onUpdateUserCredential(currentUser.id, {
      access_code: masterNewPassword.trim(),
    });
    setSavingMaster(false);
    if (ok) setMasterNewPassword('');
  };

  const handleSaveUserCode = async (userId: string) => {
    if (!newAccessCode.trim()) return;
    const ok = await onUpdateUserCredential(userId, {
      access_code: newAccessCode.trim(),
      status: 'ativo',
    });
    if (ok) {
      setEditingCodeUserId(null);
      setNewAccessCode('');
    }
  };

  return (
    <div className="space-y-5">
      {/* Card de Segurança da Senha Master do Superadmin */}
      <Card className="p-5 rounded-2xl border border-[var(--primary)]/30 bg-[var(--dash-surface)]">
        <form
          onSubmit={handleSaveMasterPassword}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[var(--dash-text-primary)]">
                Credencial Master do Superadmin (`{currentUser?.email || 'admin@ecclesiamapp.com.br'}`)
              </h3>
              <p className="text-xs text-[var(--dash-text-muted)]">
                Altere sua senha Master de produção antes do Go-Live para blindar o acesso administrativo global.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={masterNewPassword}
              onChange={(e) => setMasterNewPassword(e.target.value)}
              placeholder="Nova senha Master..."
              className="flex-1 md:w-56 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3.5 py-2 text-xs min-h-[40px] font-mono"
            />
            <Button
              type="submit"
              disabled={savingMaster || !masterNewPassword.trim()}
              className="rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold min-h-[40px] px-4 shrink-0"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              <span>Atualizar Senha Master</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Filtros de Suporte de Credenciais */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--dash-surface)] p-4 rounded-2xl border border-[var(--dash-border)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--dash-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar colaborador por nome, e-mail ou função..."
            className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] pl-10 pr-4 py-2 text-xs min-h-[40px]"
          />
        </div>

        <select
          value={selectedParishFilter}
          onChange={(e) => setSelectedParishFilter(e.target.value)}
          className="dash-select rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] pl-3.5 pr-10 py-2 text-xs font-semibold min-h-[40px]"
        >
          <option value="all">Todas as Paróquias ({users.length})</option>
          {parishes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Credenciais para Suporte Rápido */}
      <div className="space-y-2.5">
        {filteredUsers.map((u) => {
          const isEditingCode = editingCodeUserId === u.id;
          const parishLabel =
            (u.parish_id && parishNameMap[u.parish_id]) || 'Catedral de Colatina';

          return (
            <Card
              key={u.id}
              className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex flex-col lg:flex-row lg:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[var(--dash-text-primary)]">
                    {u.name}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {ROLE_LABELS[u.role] || u.role}
                  </Badge>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      u.status === 'ativo'
                        ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                        : u.status === 'pendente'
                        ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-700 border-rose-500/30'
                    }`}
                  >
                    {u.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--dash-text-muted)] flex-wrap">
                  <span className="font-mono">{u.email}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[var(--dash-text-secondary)]">
                    <Building2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                    {parishLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span>Senha atual:</span>
                    <code className="px-1.5 py-0.5 rounded bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] font-mono">
                      {visibleCodes[u.id] ? u.access_code || 'Ecclesiam@2026' : '••••••••'}
                    </code>
                    <button
                      type="button"
                      onClick={() => toggleCodeVisibility(u.id)}
                      className="p-1 rounded text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] cursor-pointer"
                      title={visibleCodes[u.id] ? 'Ocultar senha' : 'Ver senha'}
                    >
                      {visibleCodes[u.id] ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(u.id, u.access_code || 'Ecclesiam@2026')}
                      className="p-1 rounded text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] cursor-pointer"
                      title="Copiar senha"
                    >
                      {copiedUserId === u.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {isEditingCode ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={newAccessCode}
                      onChange={(e) => setNewAccessCode(e.target.value)}
                      placeholder="Nova senha..."
                      className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3 py-1.5 text-xs min-h-[38px] font-mono w-full sm:w-44"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSaveUserCode(u.id)}
                      className="rounded-xl bg-[var(--primary)] text-white text-xs font-bold min-h-[38px]"
                    >
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCodeUserId(null)}
                      className="rounded-xl text-xs min-h-[38px]"
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingCodeUserId(u.id);
                        setNewAccessCode(u.access_code || 'Ecclesiam@2026');
                      }}
                      className="rounded-xl text-xs font-bold min-h-[38px] flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>Redefinir Senha</span>
                    </Button>

                    {u.status !== 'ativo' ? (
                      <Button
                        size="sm"
                        onClick={() => onUpdateUserCredential(u.id, { status: 'ativo' })}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold min-h-[38px] flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ativar / Desbloquear</span>
                      </Button>
                    ) : (
                      u.role !== 'superadmin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateUserCredential(u.id, { status: 'bloqueado' })}
                          className="rounded-xl text-rose-600 border-rose-500/30 hover:bg-rose-500/10 text-xs font-bold min-h-[38px] flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspender</span>
                        </Button>
                      )
                    )}
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

