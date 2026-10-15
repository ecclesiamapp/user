'use client';

import React, { useState } from 'react';
import { 
  Cross, 
  Church, 
  Scroll, 
  Sparkles, 
  Crown, 
  Bell, 
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { CATHEDRAL_HISTORICAL_MILESTONES, HistoricalMilestone } from '@/lib/history';

interface ApostolicSuccessionTimelineProps {
  initialMilestones?: HistoricalMilestone[];
}

export function ApostolicSuccessionTimeline({ initialMilestones }: ApostolicSuccessionTimelineProps) {
  const milestoneList = initialMilestones && initialMilestones.length > 0
    ? initialMilestones
    : CATHEDRAL_HISTORICAL_MILESTONES;

  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(
    milestoneList[0]?.id || ''
  );

  const activeMilestone =
    milestoneList.find((m) => m.id === activeMilestoneId) ||
    milestoneList[0];

  const getMilestoneIcon = (iconName: HistoricalMilestone['iconName']) => {
    switch (iconName) {
      case 'cross':
        return <Cross className="w-5 h-5" />;
      case 'church':
        return <Church className="w-5 h-5" />;
      case 'scroll':
        return <Scroll className="w-5 h-5" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'crown':
        return <Crown className="w-5 h-5" />;
      case 'bell':
        return <Bell className="w-5 h-5" />;
      default:
        return <Church className="w-5 h-5" />;
    }
  };

  return (
    <section className="space-y-8">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] text-xs font-bold uppercase tracking-wider">
            Linha do Tempo Centenária
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)] mt-1.5">
            Quase um Século de <span className="text-[#8B1E22]">Fé & Comunidade</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] mt-1 max-w-2xl font-sans">
            Acompanhe os principais marcos históricos que transformaram a primitiva capela missionária na majestosa Catedral Diocesana de Colatina.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#8B1E22] bg-[#8B1E22]/10 px-3.5 py-1.5 rounded-xl border border-[#8B1E22]/20">
          <Calendar className="w-4 h-4" />
          <span>1928 — 2026</span>
        </div>
      </div>

      {/* Grid Principal: Seletor de Anos à Esquerda / Topo + Detalhe Imersivo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Barra Cronológica / Botões de Épocas */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="space-y-2">
            {milestoneList.map((milestone) => {
              const isActive = milestone.id === activeMilestoneId;
              return (
                <button
                  key={milestone.id}
                  onClick={() => setActiveMilestoneId(milestone.id)}
                  type="button"
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 min-h-[56px] cursor-pointer ${
                    isActive
                      ? 'bg-[var(--dash-surface)] border-[#8B1E22] shadow-md ring-1 ring-[#8B1E22]/30'
                      : 'bg-[var(--dash-surface)]/70 hover:bg-[var(--dash-surface)] border-[var(--dash-border)] text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-gradient-to-br from-[#8B1E22] to-[#5E1417] text-[#FFCC36] shadow-sm'
                          : 'bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)]'
                      }`}
                    >
                      {getMilestoneIcon(milestone.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-cinzel text-sm sm:text-base font-bold ${
                            isActive ? 'text-[#8B1E22]' : 'text-[var(--dash-text-primary)]'
                          }`}
                        >
                          {milestone.year}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)]">
                          {milestone.era}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[var(--dash-text-primary)] truncate max-w-[210px] sm:max-w-xs mt-0.5">
                        {milestone.title}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-[#8B1E22] translate-x-1' : 'text-[var(--dash-text-secondary)] opacity-50'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Card de Detalhe Imersivo do Marco Selecionado */}
        <div className="lg:col-span-7 bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)] p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          {/* Fundo Decorativo Sutil de Cruz */}
          <div className="absolute top-2 right-4 text-7xl font-serif text-[var(--dash-border)]/20 select-none pointer-events-none">
            ✝
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--dash-border)] pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#5E1417] text-[#FFCC36] font-cinzel text-lg font-bold tracking-wide shadow-xs">
                {activeMilestone.year}
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-[#B75319]">
                {activeMilestone.era}
              </span>
            </div>
            <span className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Memória Documentada</span>
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--dash-text-primary)] leading-tight">
              {activeMilestone.title}
            </h3>
            <p className="text-sm font-semibold text-[#8B1E22]">
              {activeMilestone.subtitle}
            </p>
          </div>

          <p className="text-sm sm:text-base text-[var(--dash-text-secondary)] leading-relaxed font-sans">
            {activeMilestone.description}
          </p>

          {activeMilestone.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-[var(--dash-border)] bg-black/40">
              <img
                src={activeMilestone.imageUrl}
                alt={activeMilestone.imageCaption || activeMilestone.title}
                loading="lazy"
                className="w-full h-56 sm:h-64 object-cover object-center"
              />
              {activeMilestone.imageCaption && (
                <p className="p-2.5 bg-[var(--dash-surface-hover)] text-[11px] text-[var(--dash-text-secondary)] italic text-center border-t border-[var(--dash-border)]">
                  📷 {activeMilestone.imageCaption}
                </p>
              )}
            </div>
          )}

          {activeMilestone.highlight && (
            <div className="p-4 rounded-xl bg-[#8B1E22]/5 border-l-4 border-[#8B1E22] text-xs sm:text-sm font-medium text-[var(--dash-text-primary)] italic">
              "{activeMilestone.highlight}"
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-[var(--dash-text-secondary)] border-t border-[var(--dash-border)]">
            <span>Paróquia Sagrado Coração de Jesus</span>
            <span className="font-medium text-[#C8A463]">Diocese de Colatina</span>
          </div>
        </div>
      </div>
    </section>
  );
}
