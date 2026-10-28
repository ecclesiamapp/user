'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Badge } from '@/components/ui';
import { 
  Flame, 
  Sparkles, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  RotateCcw,
  Info 
} from 'lucide-react';
import { useAdminAppearance } from '@/components/admin/context/AdminAppearanceContext';
import { BASE_ADVENT_CANDLES, calculateAdventState } from '@/lib/advent';
import { AdventSimulationMode } from '@/types';

export function AdventPreviewControl() {
  const { previewColor, resetToCanonical } = useAdminAppearance();
  const [activeSim, setActiveSim] = useState<AdventSimulationMode>('auto');

  // Carregar do localStorage se existir
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ecclesiam_advent_sim_mode') as AdventSimulationMode;
      if (saved) {
        setActiveSim(saved);
      }
    } catch (e) {
      // Ignorar no SSR
    }
  }, []);

  const handleSelectSim = (mode: AdventSimulationMode) => {
    setActiveSim(mode);
    try {
      localStorage.setItem('ecclesiam_advent_sim_mode', mode);
    } catch (e) {}

    // Sincronizar o tema de cor com o contexto de aparência
    if (mode === 'auto') {
      resetToCanonical();
    } else if (mode === 'week-1') {
      previewColor('roxo', '1º Domingo do Advento', 'Vela dos Profetas (Esperança e Vigília)');
    } else if (mode === 'week-2') {
      previewColor('vermelho', '2º Domingo do Advento', 'Vela de Belém e dos Patriarcas (Amor e Fé)');
    } else if (mode === 'week-3') {
      previewColor('rosa', '3º Domingo do Advento (Gaudete)', 'Vela dos Pastores (Alegria no Senhor)');
    } else if (mode === 'week-4') {
      previewColor('branco', '4º Domingo do Advento', 'Vela dos Anjos e da Virgem Maria (Paz e Espera)');
    } else if (mode === 'christmas') {
      previewColor('branco', 'Natividade do Senhor • Santo Natal', '5ª Vela Central de Cristo Acesa (A Luz do Mundo)');
    }
  };

  const previewState = calculateAdventState(new Date(), activeSim);

  return (
    <Card className="p-5 sm:p-6 border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-5">
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--dash-border)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#FFA82A]/15 text-[#FFA82A] border border-[#FFA82A]/30">
              <Flame className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-[var(--dash-text-primary)] font-cinzel">
              Simulador da Coroa do Advento & Velas
            </h3>
            <span className="text-[10px] uppercase font-bold bg-[#FFA82A]/15 text-[#B75319] border border-[#FFA82A]/30 px-2 py-0.5 rounded-full">
              Liturgia 2026
            </span>
          </div>
          <p className="text-xs text-[var(--dash-text-secondary)]">
            Alterne entre os domingos do Advento e a Noite de Natal para homologar as chamas vivas e a oração familiar.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#FFA82A]/40 bg-[#FFA82A]/10 text-xs font-semibold text-[#B75319] hover:bg-[#FFA82A]/20 transition-all self-start sm:self-auto active:scale-95"
        >
          <span>Ver no Portal Público</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grade de Botões de Simulação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Modo Automático */}
        <button
          type="button"
          onClick={() => handleSelectSim('auto')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
            activeSim === 'auto'
              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/40 shadow-sm'
              : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/40 hover:bg-[var(--dash-surface-secondary)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Automático (Data Real)
            </span>
            {activeSim === 'auto' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <p className="text-[11px] text-[var(--dash-text-secondary)]">
            Segue o calendário litúrgico oficial da CNBB em tempo real.
          </p>
        </button>

        {/* 1º Domingo */}
        <button
          type="button"
          onClick={() => handleSelectSim('week-1')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
            activeSim === 'week-1'
              ? 'border-purple-500 bg-purple-500/15 ring-2 ring-purple-500/40 shadow-sm'
              : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/40 hover:bg-[var(--dash-surface-secondary)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> 1º Domingo (29/11)
            </span>
            {activeSim === 'week-1' && (
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
            )}
          </div>
          <p className="text-[11px] text-[var(--dash-text-secondary)]">
            🟣 Vela Roxa • Esperança & Vigília (Profetas)
          </p>
        </button>

        {/* 2º Domingo */}
        <button
          type="button"
          onClick={() => handleSelectSim('week-2')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
            activeSim === 'week-2'
              ? 'border-rose-500 bg-rose-500/15 ring-2 ring-rose-500/40 shadow-sm'
              : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/40 hover:bg-[var(--dash-surface-secondary)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> 2º Domingo (06/12)
            </span>
            {activeSim === 'week-2' && (
              <CheckCircle2 className="w-4 h-4 text-rose-600" />
            )}
          </div>
          <p className="text-[11px] text-[var(--dash-text-secondary)]">
            🔴 Vela Vermelha • Amor & Fé (Belém e Patriarcas)
          </p>
        </button>

        {/* 3º Domingo (Gaudete) */}
        <button
          type="button"
          onClick={() => handleSelectSim('week-3')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
            activeSim === 'week-3'
              ? 'border-pink-500 bg-pink-500/15 ring-2 ring-pink-500/40 shadow-sm'
              : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/40 hover:bg-[var(--dash-surface-secondary)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> 3º Domingo (13/12)
            </span>
            {activeSim === 'week-3' && (
              <CheckCircle2 className="w-4 h-4 text-pink-600" />
            )}
          </div>
          <p className="text-[11px] text-[var(--dash-text-secondary)]">
            🌸 Vela Rosa • Alegria Gaudete (Pastores e Rei Davi)
          </p>
        </button>

        {/* 4º Domingo */}
        <button
          type="button"
          onClick={() => handleSelectSim('week-4')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
            activeSim === 'week-4'
              ? 'border-slate-500 bg-slate-500/15 ring-2 ring-slate-500/40 shadow-sm'
              : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/40 hover:bg-[var(--dash-surface-secondary)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500" /> 4º Domingo (20/12)
            </span>
            {activeSim === 'week-4' && (
              <CheckCircle2 className="w-4 h-4 text-slate-700" />
            )}
          </div>
          <p className="text-[11px] text-[var(--dash-text-secondary)]">
            ⚪ Vela Branca • Paz Divina & Virgem Maria
          </p>
        </button>

        {/* Noite Santa de Natal */}
        <button
          type="button"
          onClick={() => handleSelectSim('christmas')}
          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
            activeSim === 'christmas'
              ? 'border-[#FFA82A] bg-amber-500/15 ring-2 ring-[#FFA82A]/50 shadow-sm'
              : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/40 hover:bg-[var(--dash-surface-secondary)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#B75319] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFA82A]" /> Santo Natal (24-25/12)
            </span>
            {activeSim === 'christmas' && (
              <CheckCircle2 className="w-4 h-4 text-[#FFA82A]" />
            )}
          </div>
          <p className="text-[11px] text-[var(--dash-text-secondary)]">
            🌟 5ª Vela Central de Cristo • O Verbo se Fez Carne!
          </p>
        </button>
      </div>

      {/* Nota Informativa de Pastoreio */}
      <div className="p-3 bg-[var(--dash-surface-secondary)]/60 rounded-xl border border-[var(--dash-border)] flex items-start gap-2.5 text-xs text-[var(--dash-text-secondary)]">
        <Info className="w-4 h-4 text-[#FFA82A] shrink-0 mt-0.5" />
        <span>
          <strong>Estado Atual Ativo:</strong> {previewState.seasonLabel} — {previewState.candles.filter(c => c.isLit).length} de 5 velas acesas.
        </span>
      </div>
    </Card>
  );
}
