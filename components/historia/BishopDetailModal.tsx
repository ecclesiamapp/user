'use client';

import React, { useEffect } from 'react';
import { X, Crown, Sparkles, Award, ShieldCheck } from 'lucide-react';
import { BishopSuccession } from '@/lib/history';

interface BishopDetailModalProps {
  bishop: BishopSuccession | null;
  onClose: () => void;
}

export function BishopDetailModal({ bishop, onClose }: BishopDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (bishop) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [bishop, onClose]);

  if (!bishop) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[var(--dash-surface)] border border-[#C8A463]/40 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo Dourado com Botão Fechar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#8B1E22] text-[#FFCC36]">
              <Crown className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B75319]">
              {bishop.orderLabel}
            </span>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)] transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll Suave */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Retrato Canônico 4:5 */}
            <div className="w-44 sm:w-52 aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#C8A463]/60 shadow-xl bg-stone-900 shrink-0 relative">
              {bishop.imageUrl ? (
                <img
                  src={bishop.imageUrl}
                  alt={bishop.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#FFCC36]">
                  <Crown className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Informações Episcopais */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              {bishop.isCurrent && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFA82A] to-[#FFCC36] text-[#2D1A16] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  Bispo Diocesano Atual
                </span>
              )}

              {bishop.inMemoriam && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-900/80 border border-stone-600/50 text-stone-200 text-[10px] font-serif font-bold tracking-wider">
                  ✝ In Memoriam {bishop.deceasedYear ? `(${bishop.deceasedYear})` : ''}
                </span>
              )}

              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--dash-text-primary)] leading-tight pt-1">
                {bishop.name}
              </h3>

              <p className="text-sm font-semibold text-[#8B1E22] dark:text-[#FFA82A]">
                {bishop.period}
              </p>

              <p className="text-xs text-[var(--dash-text-secondary)]">
                {bishop.title} • Diocese de Colatina/ES
              </p>

              {/* Lema Episcopal */}
              {bishop.motto && (
                <div className="mt-4 p-3.5 rounded-xl bg-[var(--dash-surface-hover)] border border-[var(--dash-border)] text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#C8A463] uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>Lema Episcopal</span>
                  </div>
                  <p className="font-serif italic text-sm font-semibold text-[var(--dash-text-primary)]">
                    "{bishop.motto}"
                  </p>
                  <p className="text-xs text-[var(--dash-text-secondary)]">
                    {bishop.mottoTranslation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Biografia Resumida */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
              Ministério Pastoral
            </h4>
            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed font-sans">
              {bishop.summary}
            </p>
          </div>

          {/* Marcos do Ministério */}
          {bishop.achievements && bishop.achievements.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[var(--dash-border)]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
                Marcos Notáveis na Diocese:
              </h4>
              <ul className="space-y-1.5 text-xs text-[var(--dash-text-primary)]">
                {bishop.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
