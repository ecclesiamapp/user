'use client';

import React from 'react';
import Link from 'next/link';
import { Church, ExternalLink, ShieldCheck, LogOut, Building2 } from 'lucide-react';
import { Parish, UserProfile, Community } from '@/types';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface AdminSidebarFooterProps {
  currentUser: UserProfile | null;
  selectedCommunity: Community | null;
  parishes: Parish[];
  activeParish: Parish | null;
  onSelectParish: (parishId: string) => void;
  onLogout: () => void;
}

export function AdminSidebarFooter({
  currentUser,
  selectedCommunity,
  parishes,
  activeParish,
  onSelectParish,
  onLogout,
}: AdminSidebarFooterProps) {
  const userInitials = React.useMemo(() => {
    if (!currentUser?.name) return 'EC';
    const parts = currentUser.name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [currentUser]);

  const roleLabel = React.useMemo(() => {
    if (!currentUser) return 'Secretaria Paroquial';
    switch (currentUser.role) {
      case 'superadmin':
        return 'Superadmin (SaaS)';
      case 'paroco':
        return 'Pároco';
      case 'vigario':
        return 'Vigário Paroquial';
      case 'secretaria':
        return 'Secretaria Paroquial';
      case 'pascom':
        return 'PASCOM';
      case 'coordenador_ceb':
        return 'Coordenador de CEB';
      default:
        return 'Colaborador';
    }
  }, [currentUser]);

  const isSuperadmin = currentUser?.role === 'superadmin';

  return (
    <div className="p-3 border-t border-[#262A30] space-y-2 bg-[#131417]">
      {/* Seletor Master Multi-Paróquia exclusivo para o Superadmin do SaaS */}
      {isSuperadmin && parishes.length > 0 && (
        <div className="p-2.5 rounded-xl bg-[#1A1C22] border border-[#C8A463]/35 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#E5C158]">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              <span>Tenant SaaS Ativo</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#C8A463]/20 text-[9px]">Master</span>
          </div>
          <select
            value={activeParish?.id || ''}
            onChange={(e) => onSelectParish(e.target.value)}
            className="dash-select w-full rounded-lg border border-[#2E333D] bg-[#111318] text-xs font-semibold text-[#FAF6F0] pl-2.5 pr-8 py-1.5"
          >
            {parishes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Atalho Portal Público da Paróquia */}
      <Link
        href="/"
        target="_blank"
        className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-[var(--dash-surface)]/5 hover:bg-[var(--dash-surface)]/10 text-xs font-semibold text-[#EAE3D9] hover:text-[#FAF6F0] border border-[#262A30] hover:border-[#C8A463]/40 transition-all group"
      >
        <div className="flex items-center gap-2">
          <Church className="w-3.5 h-3.5 text-[#FFCC36]" />
          <span className="truncate">
            {isSuperadmin ? `Portal da Paróquia (${activeParish?.name?.split(' ')[0] || 'Ativa'})` : 'Ver Portal do Fiel'}
          </span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-[#7E838B] group-hover:text-[#FAF6F0] transition-colors shrink-0" />
      </Link>

      {/* Alternador de Tema Visual do Painel */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#1A1C20] border border-[#262A30] text-xs">
        <span className="text-[#A39E98] text-[11px] font-medium">Tema Visual:</span>
        <ThemeToggle variant="segmented" />
      </div>

      {/* Card do Usuário Autenticado + Botão de Logout */}
      <div className="px-3 py-2.5 rounded-xl bg-[#1A1C20] border border-[#262A30] flex items-center justify-between gap-2">
        <Link
          href="/admin/usuarios"
          title="Ver gestão de usuários e permissões"
          className="flex items-center gap-2.5 min-w-0 flex-1 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#8B1E22] text-[#FFCC36] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C8A463]/30 shadow-xs">
            {userInitials}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-[#FAF6F0] truncate group-hover:text-[#FFA82A] transition-colors">
              {currentUser?.name || 'Administrador'}
            </p>
            <p className="text-[10px] text-[#A39E98] truncate flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#C8A463] shrink-0" />
              <span className="truncate">
                {roleLabel} •{' '}
                {selectedCommunity?.name
                  ? selectedCommunity.name.replace('Comunidade ', '')
                  : activeParish?.name || 'Sede'}
              </span>
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={onLogout}
          title="Encerrar sessão com segurança"
          aria-label="Encerrar sessão"
          className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 transition-colors shrink-0 min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

