'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, User, Mail, Phone, MapPin, CheckSquare, Square, Loader2 } from 'lucide-react';
import { UserProfile, UserRole, UserStatus, AllowedCommunityModule, Community } from '@/types';
import { Button, Input } from '@/components/ui';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<UserProfile>) => Promise<boolean>;
  userToEdit: UserProfile | null;
  communities: Community[];
}

const MODULE_OPTIONS: { id: AllowedCommunityModule; label: string; description: string }[] = [
  { id: 'lp_geral', label: 'Landing Page & Fachada', description: 'Edição de fotos de altar/fachada, história e endereço' },
  { id: 'cpc', label: 'Conselho Pastoral (CPC)', description: 'Gestão de coordenadores, tesoureiros e secretários locais' },
  { id: 'avisos', label: 'Mural de Avisos', description: 'Publicação de comunicados e Avisos da Comunidade' },
  { id: 'pastorais', label: 'Pastorais & Grupos', description: 'Gestão de grupos bíblicos, catequese e pastorais locais' },
  { id: 'horarios', label: 'Horários de Missas', description: 'Gestão dos horários de celebrações da comunidade' },
  { id: 'dizimo', label: 'Pastoral do Dízimo & PIX', description: 'Chave PIX e orientações pastorais de partilha da comunidade' },
  { id: 'galerias', label: 'Fotos & Galerias', description: 'Upload e fotos de eventos da comunidade' },
];

export function UserModal({
  isOpen,
  onClose,
  onSave,
  userToEdit,
  communities,
}: UserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('coordenador_ceb');
  const [communityId, setCommunityId] = useState<string>('');
  const [status, setStatus] = useState<UserStatus>('ativo');
  const [allowedModules, setAllowedModules] = useState<AllowedCommunityModule[]>([
    'lp_geral', 'cpc', 'avisos', 'pastorais', 'horarios'
  ]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || '');
      setEmail(userToEdit.email || '');
      setPhone(userToEdit.phone || '');
      setRole(userToEdit.role || 'coordenador_ceb');
      setCommunityId(userToEdit.community_id || '');
      setStatus(userToEdit.status || 'ativo');
      setAllowedModules((userToEdit.allowed_modules as AllowedCommunityModule[]) || ['lp_geral', 'cpc', 'avisos', 'pastorais', 'horarios']);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setRole('coordenador_ceb');
      setCommunityId(communities[0]?.id || '');
      setStatus('ativo');
      setAllowedModules(['lp_geral', 'cpc', 'avisos', 'pastorais', 'horarios']);
    }
    setErrorMsg(null);
  }, [userToEdit, communities, isOpen]);

  if (!isOpen) return null;

  const toggleModule = (modId: AllowedCommunityModule) => {
    if (allowedModules.includes(modId)) {
      setAllowedModules(allowedModules.filter((m) => m !== modId));
    } else {
      setAllowedModules([...allowedModules, modId]);
    }
  };

  const handleSelectAllModules = () => {
    setAllowedModules(['lp_geral', 'cpc', 'avisos', 'pastorais', 'horarios', 'dizimo', 'galerias']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Nome e E-mail são obrigatórios.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const payload: Partial<UserProfile> = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        role,
        community_id: role === 'coordenador_ceb' ? (communityId || null) : null,
        status,
        allowed_modules: role === 'coordenador_ceb' ? allowedModules : ['all'],
      };

      if (userToEdit?.id) {
        payload.id = userToEdit.id;
      }

      const success = await onSave(payload);
      if (success) {
        onClose();
      } else {
        setErrorMsg('Erro ao salvar usuário no banco de dados.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--dash-border)] flex items-center justify-between bg-[var(--dash-surface-secondary)]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--dash-text-primary)]">
                {userToEdit ? 'Editar Usuário & Permissões' : 'Novo Usuário & Colaborador'}
              </h3>
              <p className="text-xs text-[var(--dash-text-muted)]">
                Configuração de perfil canônico, comunidade vinculada e governança modular
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
                Nome Completo *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Antônio Marcos"
                required
                className="rounded-xl border-[var(--dash-border)] bg-[var(--dash-surface)] text-xs min-h-[40px]"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
                E-mail (Login/Notificações) *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: coordenador@catedral.org.br"
                required
                className="rounded-xl border-[var(--dash-border)] bg-[var(--dash-surface)] text-xs min-h-[40px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
                Telefone / WhatsApp
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (27) 99881-2233"
                className="rounded-xl border-[var(--dash-border)] bg-[var(--dash-surface)] text-xs min-h-[40px]"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
                Status do Usuário
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="dash-select w-full text-xs font-medium rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              >
                <option value="ativo">🟢 Ativo (Acesso Liberado)</option>
                <option value="pendente">🟡 Pendente (Aguardando Aprovação)</option>
                <option value="bloqueado">🔴 Bloqueado (Acesso Suspenso)</option>
              </select>
            </div>
          </div>

          {/* Cargo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
              Cargo Canônico / Papel RBAC
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="dash-select w-full text-xs font-medium rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              <option value="superadmin">⚡ Superadmin (Gestão Ecclesiam SaaS & Suporte Técnico)</option>
              <option value="paroco">👑 Pároco (Acesso Pleno Paroquial)</option>
              <option value="vigario">✝️ Vigário Paroquial (Acesso Pleno Paroquial)</option>
              <option value="secretaria">📋 Secretaria Paroquial (Gestão Administrativa & LPs)</option>
              <option value="pascom">📢 PASCOM (Comunicação & Notícias)</option>
              <option value="coordenador_ceb">⛪ Coordenador de CEB (Painel da Comunidade)</option>
            </select>
          </div>

          {/* Comunidade Vinculada (Exibida apenas se for Coordenador de CEB) */}
          {role === 'coordenador_ceb' && (
            <div className="space-y-1.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <label className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Comunidade Vinculada (CEB) *</span>
              </label>
              <select
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                className="dash-select w-full text-xs font-medium rounded-xl border border-amber-500/30 bg-[var(--dash-surface)] text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                required
              >
                <option value="">Selecione a comunidade...</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.is_headquarters ? '⭐ ' : '⛪ '}
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Governança de Módulos (se for Coordenador de CEB) */}
          {role === 'coordenador_ceb' && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--dash-text-primary)]">
                  Módulos Autorizados na Comunidade
                </label>
                <button
                  type="button"
                  onClick={handleSelectAllModules}
                  className="text-[11px] font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                >
                  Marcar Todos
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MODULE_OPTIONS.map((mod) => {
                  const isChecked = allowedModules.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isChecked
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--dash-text-primary)]'
                          : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/30 text-[var(--dash-text-muted)] hover:border-[var(--dash-border)]'
                      }`}
                    >
                      <div className="mt-0.5 text-[var(--primary)]">
                        {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 opacity-40" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight">{mod.label}</p>
                        <p className="text-[10px] leading-snug opacity-75 mt-0.5 truncate">{mod.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-[var(--dash-border)] flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl text-xs font-semibold min-h-[40px] px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl text-xs font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white min-h-[40px] px-5 flex items-center gap-1.5 shadow-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{userToEdit ? 'Atualizar Permissões' : 'Cadastrar Usuário'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
