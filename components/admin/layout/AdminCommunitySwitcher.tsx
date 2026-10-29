'use client';

import React from 'react';
import { Church, MapPin, ShieldCheck, ChevronRight, RotateCcw } from 'lucide-react';
import { useAdminCommunity } from '@/components/admin/context/AdminCommunityContext';
import { Badge } from '@/components/ui';

export function AdminCommunitySwitcher() {
  const {
    currentUser,
    communities,
    selectedCommunityId,
    selectedCommunity,
    isParishMaster,
    setSelectedCommunityId,
  } = useAdminCommunity();

  // Caso o usuário seja Coordenador de CEB, exibe a comunidade travada
  if (!isParishMaster) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-xs text-[var(--dash-text-primary)]">
        <MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
        <span className="font-semibold truncate max-w-[150px] sm:max-w-[200px]">
          {selectedCommunity?.name || 'Minha Comunidade'}
        </span>
        <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-[var(--primary)]/30 text-[var(--primary)] font-bold">
          CEB
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center">
        {selectedCommunityId ? (
          <MapPin className="w-3.5 h-3.5 text-[var(--primary)] absolute left-3 pointer-events-none z-10" />
        ) : (
          <Church className="w-3.5 h-3.5 text-[var(--dash-text-muted)] absolute left-3 pointer-events-none z-10" />
        )}

        <select
          value={selectedCommunityId || ''}
          onChange={(e) => setSelectedCommunityId(e.target.value ? e.target.value : null)}
          className="dash-select text-xs font-medium rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] pl-9 pr-10 py-1.5 min-h-[38px] hover:border-[var(--primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all cursor-pointer shadow-sm max-w-[210px] sm:max-w-[260px] truncate"
          aria-label="Alternar contexto paroquial ou de comunidade"
        >
          <option value="">🏛️ Visão Paroquial (Geral)</option>
          <optgroup label="14 Comunidades Eclesiais de Base (CEBs)">
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.is_headquarters ? '⭐ ' : '⛪ '}
                {c.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Botão de reset rápido para Paróquia quando uma comunidade estiver selecionada */}
      {selectedCommunityId && (
        <button
          type="button"
          onClick={() => setSelectedCommunityId(null)}
          title="Voltar para a Visão Paroquial Geral"
          className="p-1.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] hover:border-[var(--primary)]/40 transition-colors flex items-center justify-center cursor-pointer min-h-[36px] min-w-[36px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
