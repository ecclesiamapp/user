'use client';

import React from 'react';
import { Church, CheckCircle2, ShieldCheck, Sparkles, X } from 'lucide-react';
import { LiturgicalColor } from '@/lib/liturgy';

interface LiturgicalFallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  canonicalTempo: string;
  canonicalColor: LiturgicalColor;
  canonicalCelebration: string;
}

export function LiturgicalFallbackModal({
  isOpen,
  onClose,
  canonicalTempo,
  canonicalColor,
  canonicalCelebration,
}: LiturgicalFallbackModalProps) {
  if (!isOpen) return null;

  const getColorName = (color: LiturgicalColor) => {
    switch (color) {
      case 'verde':
        return { name: 'Verde', bg: 'bg-emerald-500', text: 'text-emerald-400' };
      case 'roxo':
        return { name: 'Roxo', bg: 'bg-purple-600', text: 'text-purple-400' };
      case 'vermelho':
        return { name: 'Vermelho', bg: 'bg-rose-600', text: 'text-rose-400' };
      case 'rosa':
        return { name: 'Rosa', bg: 'bg-pink-500', text: 'text-pink-400' };
      case 'branco':
      default:
        return { name: 'Branco / Dourado', bg: 'bg-amber-500', text: 'text-amber-400' };
    }
  };

  const colorMeta = getColorName(canonicalColor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#8B1E22]/10 border border-[#8B1E22]/20 flex items-center justify-center text-[#8B1E22] shrink-0">
            <Church className="w-6 h-6 text-[#FFA82A]" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)] transition-all cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Textos Informativos */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFA82A]/10 text-[#FFA82A] border border-[#FFA82A]/20">
              Salvaguarda Canônica
            </span>
          </div>
          <h3 className="text-base font-bold text-[var(--dash-text-primary)] leading-snug">
            Fidelidade Litúrgica Restaurada
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            O modo de demonstração visual foi encerrado automaticamente ao sair da página de configuração.
            O painel retornou para o tempo litúrgico oficial de hoje para garantir conformidade com o calendário litúrgico da Igreja Católica.
          </p>
        </div>

        {/* Card do Tempo Canônico Vigente */}
        <div className="p-3.5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface-hover)]/40 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider block font-semibold">
              Liturgia Oficial de Hoje
            </span>
            <span className="text-xs font-bold text-[var(--dash-text-primary)] truncate block">
              {canonicalTempo}
            </span>
            <span className="text-[11px] text-[var(--dash-text-secondary)] truncate block">
              {canonicalCelebration}
            </span>
          </div>

          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${colorMeta.bg} text-white shadow-xs shrink-0`}>
            <span className="w-2 h-2 rounded-full bg-[var(--dash-surface)] animate-pulse" />
            <span>{colorMeta.name}</span>
          </span>
        </div>

        {/* Botão de Ação */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#FFA82A]" />
          <span>Entendido, Manter Fidelidade Litúrgica</span>
        </button>
      </div>
    </div>
  );
}
