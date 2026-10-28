'use client';

import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  BookOpen, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Calendar 
} from 'lucide-react';
import { AdventCandle } from '@/types';

interface AdventCandleModalProps {
  candle: AdventCandle | null;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function AdventCandleModal({
  candle,
  onClose,
  onNavigate,
  hasPrev = true,
  hasNext = true,
}: AdventCandleModalProps) {
  const [copied, setCopied] = useState(false);

  if (!candle) return null;

  const handleCopyPrayer = () => {
    const textToCopy = `🕯️ *${candle.name} • ${candle.candleTitle}*\n\n📖 *${candle.biblicalPassage.reference}*\n${candle.biblicalPassage.text}\n\n🙏 *Oração em Família:*\n${candle.familyPrayer}\n\n❤️ *Gesto Fraterno:*\n${candle.fraternalGesture}\n\n🏛️ _Catedral do Sagrado Coração de Jesus • Diocese de Colatina_`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const message = `🕯️ *${candle.name} • ${candle.candleTitle}*\n\n📖 *${candle.biblicalPassage.reference}*\n${candle.biblicalPassage.text}\n\n🙏 *Oração em Família:*\n${candle.familyPrayer}\n\n❤️ *Gesto da Semana:*\n${candle.fraternalGesture}\n\nReze conosco no portal da Catedral: https://ecclesiam-app.vercel.app`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FCF7F1] text-[#2D1A16] rounded-2xl shadow-2xl border border-[#E8DFD3] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo / Header Litúrgico */}
        <div
          className="relative px-6 py-5 text-white flex items-center justify-between border-b border-white/10"
          style={{
            background:
              candle.week === 1
                ? 'linear-gradient(135deg, #4c1d95 0%, #7e22ce 50%, #2e1065 100%)'
                : candle.week === 2
                ? 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #450a0a 100%)'
                : candle.week === 3
                ? 'linear-gradient(135deg, #831843 0%, #db2777 50%, #500724 100%)'
                : candle.week === 4
                ? 'linear-gradient(135deg, #334155 0%, #64748b 50%, #1e293b 100%)'
                : 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #451a03 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--dash-surface)]/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-cinzel font-bold text-lg shadow-inner">
              {candle.week === 5 ? '✝' : `${candle.week}ª`}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#FFCC36]">
                  {candle.week === 5 ? 'Solenidade do Natal' : `Semana do Advento`}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[var(--dash-surface)]/20 text-white font-semibold">
                  {candle.isLit ? (
                    <>
                      <Flame className="w-3 h-3 text-[#FFA82A] fill-[#FFA82A]" /> Chama Acesa
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3 h-3 text-slate-300" /> Aguardando
                    </>
                  )}
                </span>
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide text-white">
                {candle.candleTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/25 active:scale-95 text-white flex items-center justify-center transition-colors border border-white/20"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Rolagem Confortável */}
        <div className="p-6 overflow-y-auto space-y-6 font-sans">
          {/* Período Litúrgico e Cor */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#EEE3D4]/60 rounded-xl border border-[#E8DFD3] text-xs">
            <span className="font-medium text-[#514D4B]">
              🗓️ <strong>Período:</strong> {candle.periodLabel}
            </span>
            <span className="font-medium text-[#514D4B]">
              🎨 <strong>Cor Litúrgica:</strong> {candle.colorLabel}
            </span>
          </div>

          {/* Citação Bíblica Sagrada */}
          <div className="p-4 rounded-xl bg-[#FCF7F1] border-l-4 border-[#FFA82A] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B75319] mb-1.5 font-cinzel">
              <BookOpen className="w-4 h-4 text-[#FFA82A]" />
              Palavra de Deus • {candle.biblicalPassage.reference}
            </div>
            <p className="font-serif italic text-base sm:text-lg text-[#2D1A16] leading-relaxed">
              {candle.biblicalPassage.text}
            </p>
            <p className="text-xs text-[#514D4B] mt-2 font-medium">
              🕊️ Figura Bíblica: {candle.biblicalFigure}
            </p>
          </div>

          {/* Significado Catequético */}
          <div className="space-y-2">
            <h4 className="font-cinzel text-sm font-bold text-[#8B1E22] uppercase tracking-wider">
              Sentido Catequético & Espiritual
            </h4>
            <p className="text-sm sm:text-base text-[#514D4B] leading-relaxed">
              {candle.catechesis}
            </p>
          </div>

          {/* Oração Familiar para o Lar */}
          <div className="p-4 rounded-xl bg-[#8B1E22]/5 border border-[#8B1E22]/20 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-cinzel text-sm font-bold text-[#8B1E22] uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#8B1E22]" /> Oração em Família para o Lar
              </h4>
              <button
                onClick={handleCopyPrayer}
                className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--dash-surface)] border border-[#E8DFD3] text-[#514D4B] hover:text-[#8B1E22] hover:border-[#8B1E22]/40 active:scale-95 transition-all"
                title="Copiar texto da oração"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar Oração
                  </>
                )}
              </button>
            </div>
            <p className="text-sm sm:text-base italic text-[#2D1A16] font-serif leading-relaxed bg-[var(--dash-surface)]/70 p-3.5 rounded-lg border border-[#E8DFD3]">
              «{candle.familyPrayer}»
            </p>
          </div>

          {/* Gesto Fraterno Concreto da Semana */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <Heart className="w-5 h-5 text-[#B75319] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B75319]">
                Gesto Fraterno para a Semana
              </span>
              <p className="text-xs sm:text-sm text-[#2D1A16]">
                {candle.fraternalGesture}
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé com Navegação entre Velas e Compartilhamento */}
        <div className="px-6 py-4 bg-[#EEE3D4] border-t border-[#E8DFD3] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('prev')}
                  disabled={!hasPrev}
                  className="min-h-[44px] px-3 rounded-xl border border-[#E8DFD3] bg-[var(--dash-surface)] text-xs font-semibold text-[#514D4B] hover:bg-[#FCF7F1] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                <button
                  onClick={() => onNavigate('next')}
                  disabled={!hasNext}
                  className="min-h-[44px] px-3 rounded-xl border border-[#E8DFD3] bg-[var(--dash-surface)] text-xs font-semibold text-[#514D4B] hover:bg-[#FCF7F1] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all active:scale-95"
                >
                  Próxima <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="min-h-[44px] px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold tracking-wide flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" /> Compartilhar no WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
