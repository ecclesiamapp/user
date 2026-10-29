'use client';

import React, { useMemo } from 'react';
import { Users, UserCheck, Clock, Church } from 'lucide-react';
import { UserProfile, Community } from '@/types';
import { Card } from '@/components/ui';

interface UserStatsBannerProps {
  users: UserProfile[];
  communities: Community[];
}

export function UserStatsBanner({ users, communities }: UserStatsBannerProps) {
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'ativo').length;
    const pending = users.filter((u) => u.status === 'pendente').length;
    
    // Contagem de comunidades únicas que têm ao menos um coordenador cadastrado
    const coveredCommIds = new Set(
      users
        .filter((u) => u.role === 'coordenador_ceb' && u.community_id && u.status === 'ativo')
        .map((u) => u.community_id)
    );
    const coveredCount = coveredCommIds.size;
    const totalCommunities = communities.length || 12;

    return { total, active, pending, coveredCount, totalCommunities };
  }, [users, communities]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total */}
      <Card className="p-3.5 sm:p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[var(--dash-text-muted)] block">
            Total Cadastrados
          </span>
          <span className="text-lg font-black text-[var(--dash-text-primary)]">
            {stats.total}
          </span>
        </div>
      </Card>

      {/* 2. Ativos */}
      <Card className="p-3.5 sm:p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[var(--dash-text-muted)] block">
            Acessos Ativos
          </span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
            {stats.active}
          </span>
        </div>
      </Card>

      {/* 3. Pendentes */}
      <Card className="p-3.5 sm:p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          stats.pending > 0 
            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse'
            : 'bg-[var(--dash-surface-secondary)] text-[var(--dash-text-muted)]'
        }`}>
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[var(--dash-text-muted)] block">
            Solicitações Pendentes
          </span>
          <span className={`text-lg font-black ${stats.pending > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-[var(--dash-text-primary)]'}`}>
            {stats.pending}
          </span>
        </div>
      </Card>

      {/* 4. Cobertura de CEBs */}
      <Card className="p-3.5 sm:p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
          <Church className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[var(--dash-text-muted)] block">
            CEBs com Liderança
          </span>
          <span className="text-lg font-black text-purple-600 dark:text-purple-400">
            {stats.coveredCount} <span className="text-xs font-normal text-[var(--dash-text-muted)]">de {stats.totalCommunities}</span>
          </span>
        </div>
      </Card>
    </div>
  );
}
