'use client';

import React from 'react';
import { Eye, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAdminCommunity } from '@/components/admin/context/AdminCommunityContext';
import { Button } from '@/components/ui';

export function AdminSimulationBanner() {
  const { currentUser, isSimulating, exitSimulation, selectedCommunity } = useAdminCommunity();

  if (!isSimulating || !currentUser) {
    return null;
  }

  const roleText =
    currentUser.role === 'superadmin' ? 'Superadmin (SaaS)' :
    currentUser.role === 'paroco' ? 'Pároco' :
    currentUser.role === 'vigario' ? 'Vigário Paroquial' :
    currentUser.role === 'secretaria' ? 'Secretaria Paroquial' :
    currentUser.role === 'pascom' ? 'PASCOM Catedral' :
    'Coordenador de CEB';

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 border-b border-purple-500/40 text-purple-100 px-4 sm:px-8 py-2.5 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
          <Eye className="w-4 h-4 animate-pulse text-amber-300" />
        </div>
        <p className="leading-snug truncate">
          <span className="font-extrabold text-amber-300">Modo de Simulação Ativo:</span>{' '}
          Você está visualizando o painel como{' '}
          <strong className="text-white underline decoration-amber-400/50 underline-offset-2">
            {currentUser.name}
          </strong>{' '}
          <span className="text-purple-200">({roleText}{selectedCommunity ? ` • ${selectedCommunity.name}` : ''})</span>.
        </p>
      </div>

      <Button
        size="sm"
        onClick={exitSimulation}
        className="h-8 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-black/20 shrink-0 transition-transform active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-slate-950" />
        <span>Voltar ao Painel da Catedral</span>
      </Button>
    </div>
  );
}
