'use client';

import React from 'react';
import { UserRole, UserStatus } from '@/types';
import { Badge } from '@/components/ui';

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function UserRoleBadge({ role, className = '' }: UserRoleBadgeProps) {
  switch (role) {
    case 'paroco':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B1E22]/15 text-[#8B1E22] dark:text-[#FFA82A] border border-[#8B1E22]/30 ${className}`}>
          👑 Pároco
        </span>
      );
    case 'vigario':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 ${className}`}>
          ✝️ Vigário Paroquial
        </span>
      );
    case 'secretaria':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 ${className}`}>
          📋 Secretaria Paroquial
        </span>
      );
    case 'pascom':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 ${className}`}>
          📢 PASCOM Catedral
        </span>
      );
    case 'coordenador_ceb':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 ${className}`}>
          ⛪ Coordenador de CEB
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30 ${className}`}>
          👤 Colaborador
        </span>
      );
  }
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  switch (status) {
    case 'ativo':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Ativo
        </span>
      );
    case 'pendente':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Aguardando Aprovação
        </span>
      );
    case 'bloqueado':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Bloqueado
        </span>
      );
    default:
      return null;
  }
}
