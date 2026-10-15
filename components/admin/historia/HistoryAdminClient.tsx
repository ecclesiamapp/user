'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Scroll, 
  Calendar, 
  Crown, 
  Sparkles, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { 
  Parish, 
  ParishHistoryMilestone, 
  ParishPastorSuccession, 
  ParishSacredHeritage 
} from '@/types';
import { MilestonesTab } from './MilestonesTab';
import { PastorsTab } from './PastorsTab';
import { HeritageTab } from './HeritageTab';

interface HistoryAdminClientProps {
  parish: Parish;
  milestones: ParishHistoryMilestone[];
  pastors: ParishPastorSuccession[];
  heritage: ParishSacredHeritage[];
}

export function HistoryAdminClient({
  parish,
  milestones,
  pastors,
  heritage,
}: HistoryAdminClientProps) {
  const [activeTab, setActiveTab] = useState<'linha_tempo' | 'pastores' | 'patrimonio'>('linha_tempo');

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página Administrativa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--dash-border)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#FFA82A] uppercase tracking-wider">
              Memória & Patrimônio Canônico • {parish.name}
            </span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)] mt-1">
            História, Pastores & Arte Sacra
          </h1>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] mt-1 font-sans">
            Gerencie os marcos centenários, a galeria de bispos e párocos e o patrimônio sacro e vitrais da paróquia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/historia"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-primary)] text-xs font-bold transition-all shadow-sm min-h-[44px]"
          >
            <span>Ver Página Pública</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FFA82A]" />
          </Link>
          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#8B1E22]/10 dark:bg-[#FFA82A]/10 text-[#8B1E22] dark:text-[#FFA82A] text-xs font-bold min-h-[44px]">
            <Scroll className="w-4 h-4" />
            <span>Arquivo Paroquial</span>
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex items-center gap-2 border-b border-[var(--dash-border)] overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('linha_tempo')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap min-h-[44px] ${
            activeTab === 'linha_tempo'
              ? 'border-[#FFA82A] text-[#FFA82A]'
              : 'border-transparent text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Linha do Tempo Centenária</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B1E22]/10 dark:bg-[#FFA82A]/10 text-[#8B1E22] dark:text-[#FFA82A]">
            {milestones.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pastores')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap min-h-[44px] ${
            activeTab === 'pastores'
              ? 'border-[#FFA82A] text-[#FFA82A]'
              : 'border-transparent text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Sucessão Pastoral (Bispos & Párocos)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B1E22]/10 dark:bg-[#FFA82A]/10 text-[#8B1E22] dark:text-[#FFA82A]">
            {pastors.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('patrimonio')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap min-h-[44px] ${
            activeTab === 'patrimonio'
              ? 'border-[#FFA82A] text-[#FFA82A]'
              : 'border-transparent text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Patrimônio Sacro & Vitrais</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B1E22]/10 dark:bg-[#FFA82A]/10 text-[#8B1E22] dark:text-[#FFA82A]">
            {heritage.length}
          </span>
        </button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      {activeTab === 'linha_tempo' && (
        <MilestonesTab initialMilestones={milestones} parishId={parish.id} />
      )}

      {activeTab === 'pastores' && (
        <PastorsTab initialPastors={pastors} parishId={parish.id} />
      )}

      {activeTab === 'patrimonio' && (
        <HeritageTab initialHeritage={heritage} parishId={parish.id} />
      )}
    </div>
  );
}
