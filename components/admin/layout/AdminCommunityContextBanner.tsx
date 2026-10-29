'use client';

import React from 'react';
import { MapPin, X, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAdminCommunity } from '@/components/admin/context/AdminCommunityContext';
import { Button } from '@/components/ui';

export function AdminCommunityContextBanner() {
  const {
    isParishMaster,
    selectedCommunityId,
    selectedCommunity,
    setSelectedCommunityId,
    isSimulating,
  } = useAdminCommunity();

  if (isSimulating || !isParishMaster || !selectedCommunityId || !selectedCommunity) {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 font-bold">
          <MapPin className="w-3.5 h-3.5" />
        </div>
        <p className="leading-snug">
          <span className="font-bold">Modo Comunidade Ativa:</span> Você está gerenciando o conteúdo exclusivo da{' '}
          <strong className="underline underline-offset-2">{selectedCommunity.name}</strong>.
          Edições salvas alimentam diretamente a LP desta comunidade.
        </p>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={() => setSelectedCommunityId(null)}
        className="text-[11px] h-7 px-2.5 rounded-lg border-amber-500/30 text-amber-800 dark:text-amber-200 hover:bg-amber-500/15 flex items-center gap-1.5 font-semibold"
      >
        <ArrowLeft className="w-3 h-3" />
        <span>Voltar à Visão Paroquial</span>
      </Button>
    </div>
  );
}
