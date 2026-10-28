'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  HelpCircle 
} from 'lucide-react';
import { calculateAdventState, getAdventLiturgicalTheme } from '@/lib/advent';
import { AdventCandle, AdventSimulationMode } from '@/types';
import { AdventWreathSvg } from './AdventWreathSvg';
import { AdventCandleModal } from './AdventCandleModal';

interface AdventWreathBannerProps {
  initialSimulationMode?: AdventSimulationMode;
  className?: string;
}

export function AdventWreathBanner({
  initialSimulationMode = 'auto',
  className = '',
}: AdventWreathBannerProps) {
  const [simulationMode, setSimulationMode] = useState<AdventSimulationMode>(initialSimulationMode);
  const [selectedCandle, setSelectedCandle] = useState<AdventCandle | null>(null);

  // Sincronizar com localStorage e parâmetro de URL (?adventSim=week-1, etc.)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const querySim = urlParams.get('adventSim') as AdventSimulationMode;
      if (querySim && ['auto', 'week-1', 'week-2', 'week-3', 'week-4', 'christmas'].includes(querySim)) {
        setSimulationMode(querySim);
        return;
      }

      const savedSim = localStorage.getItem('ecclesiam_advent_sim_mode') as AdventSimulationMode;
      if (savedSim && ['auto', 'week-1', 'week-2', 'week-3', 'week-4', 'christmas'].includes(savedSim)) {
        setSimulationMode(savedSim);
      }
    } catch (e) {
      // Ignorar no SSR
    }
  }, []);

  // Calcular estado do Advento
  const adventState = useMemo(() => {
    return calculateAdventState(new Date(), simulationMode);
  }, [simulationMode]);

  const liturgicalTheme = useMemo(() => {
    return getAdventLiturgicalTheme(adventState);
  }, [adventState]);

  const activeCandle = adventState.activeCandle;

  // Navegação no Modal (Anterior / Próxima)
  const handleNavigateModal = (direction: 'prev' | 'next') => {
    if (!selectedCandle) return;
    const currentIndex = adventState.candles.findIndex((c) => c.week === selectedCandle.week);
    if (currentIndex === -1) return;

    if (direction === 'prev' && currentIndex > 0) {
      setSelectedCandle(adventState.candles[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < adventState.candles.length - 1) {
      setSelectedCandle(adventState.candles[currentIndex + 1]);
    }
  };

  return (
    <section
      aria-label="Coroa do Advento e Liturgia do Natal"
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border border-[#FFA82A]/30 ${className}`}
    >
      {/* Fundo Sacramental Noturno com Gradiente Nobre e Ponto de Luz Dourado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1c120c] via-[#2b1812] to-[#120a06]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FFA82A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8B1E22]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Conteúdo do Banner */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Coluna Esquerda: Informações Litúrgicas, Textos e CTAs */}
        <div className="w-full lg:max-w-xl space-y-5 text-[#FCF7F1]">
          {/* Pílula do Tempo Litúrgico com Efeito Vivo */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFA82A]/15 text-[#FFCC36] border border-[#FFA82A]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#FFA82A]" />
              {adventState.seasonLabel}
            </span>

            {/* Contagem Regressiva para a Noite Santa de Natal */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--dash-surface)]/10 text-[#FCF7F1] border border-white/15">
              <Clock className="w-3.5 h-3.5 text-[#FFA82A]" />
              {adventState.daysUntilChristmas > 0 ? (
                <>
                  Faltam <strong className="text-[#FFCC36]">{adventState.daysUntilChristmas} dias</strong> para o Santo Natal
                </>
              ) : (
                <strong className="text-[#FFCC36]">Noite Santa • O Salvador Nasceu!</strong>
              )}
            </span>
          </div>

          {/* Título Monumental em Tipografia Cinzel */}
          <div className="space-y-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-white leading-tight">
              Coroa do Advento:{' '}
              <span className="text-[#FFA82A]">A Luz de Cristo Cresce</span>
            </h2>
            <p className="text-sm sm:text-base text-[#E8DFD3] leading-relaxed">
              Semana a semana, acendemos uma nova vela na Coroa do Advento preparando nosso lar e coração para a celebração do Natal do Senhor.
            </p>
          </div>

          {/* Card Resumo da Vela em Destaque nesta Semana */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface)]/5 border border-white/15 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full animate-pulse shadow-md"
                  style={{ backgroundColor: activeCandle.hexColor }}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFCC36] font-cinzel">
                  {activeCandle.candleTitle} • {activeCandle.colorLabel}
                </span>
              </div>
              <span className="text-xs text-[#E8DFD3]/80">
                {activeCandle.periodLabel}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#FCF7F1] italic font-serif leading-relaxed line-clamp-2">
              «{activeCandle.biblicalPassage.text}»
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
              <span className="text-xs text-[#E8DFD3] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#FFA82A]" />
                {activeCandle.theme}
              </span>

              <button
                onClick={() => setSelectedCandle(activeCandle)}
                className="min-h-[44px] px-4 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#B75319] hover:from-[#721C24] hover:to-[#963F0E] text-white text-xs font-bold tracking-wide flex items-center gap-2 shadow-lg hover:shadow-orange-950/50 active:scale-95 transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#FFCC36]" />
                Ver Oração da Família
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Seletor Rápido de Velas (Pílulas Clicáveis Mobile-First) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-[#E8DFD3]/80">
              <span className="font-semibold text-xs uppercase tracking-wider">
                Velas da Coroa (Toque para rezar):
              </span>
              <span className="text-[11px] text-[#FFA82A] hidden sm:inline">
                4 Semanas + Noite de Natal
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {adventState.candles.map((candle) => {
                const isSelected = selectedCandle?.week === candle.week;
                return (
                  <button
                    key={`quick-candle-${candle.week}`}
                    onClick={() => setSelectedCandle(candle)}
                    className={`min-h-[44px] px-1 py-1.5 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                      isSelected
                        ? 'border-[#FFA82A] bg-[#FFA82A]/20 text-white font-bold ring-2 ring-[#FFA82A]/40'
                        : candle.isLit
                        ? 'border-white/20 bg-[var(--dash-surface)]/10 text-white hover:bg-[var(--dash-surface)]/15'
                        : 'border-white/10 bg-[var(--dash-surface)]/5 text-white/60 hover:bg-[var(--dash-surface)]/10'
                    }`}
                    title={`${candle.name}: ${candle.theme}`}
                  >
                    <span className="flex items-center gap-1 text-[11px] font-bold">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: candle.hexColor }}
                      />
                      {candle.week === 5 ? 'Natal' : `${candle.week}º`}
                    </span>
                    <span className="text-[10px] text-white/70">
                      {candle.isLit ? 'Acesa' : 'Espera'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Ilustração Vetorial da Coroa & Chamas Vivas */}
        <div className="w-full lg:w-auto flex flex-col items-center justify-center relative">
          <AdventWreathSvg
            candles={adventState.candles}
            onSelectCandle={(candle) => setSelectedCandle(candle)}
            selectedWeek={selectedCandle?.week}
            className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px]"
          />

          <p className="text-xs text-[#E8DFD3]/80 text-center flex items-center justify-center gap-1.5 mt-3 select-none">
            <HelpCircle className="w-3.5 h-3.5 text-[#FFA82A]" />
            Toque nas velas acesas ou nos botões para abrir a oração do seu lar
          </p>
        </div>
      </div>

      {/* Modal Pastoral de Oração Familiar e Catequese */}
      <AdventCandleModal
        candle={selectedCandle}
        onClose={() => setSelectedCandle(null)}
        onNavigate={handleNavigateModal}
        hasPrev={selectedCandle ? selectedCandle.week > 1 : false}
        hasNext={selectedCandle ? selectedCandle.week < 5 : false}
      />
    </section>
  );
}
