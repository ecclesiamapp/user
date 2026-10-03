'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, X, ChevronRight, Bookmark } from 'lucide-react';
import { Modal, Button, Badge } from '@/components/ui';
import { getTodayLiturgicalInfo } from '@/lib/liturgy';

export function LiturgicalBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const liturgy = getTodayLiturgicalInfo();

  return (
    <>
      {/* Faixa Litúrgica Rica */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-[var(--dash-surface)] to-[var(--dash-surface)] p-5 sm:p-6 shadow-md transition-all hover:border-emerald-500/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {liturgy.colorLabel}
              </span>
              <span className="text-xs text-[var(--dash-text-secondary)]">
                {liturgy.date}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[var(--dash-text-primary)]">
              {liturgy.celebrationTitle}
            </h3>

            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] italic border-l-2 border-emerald-500/50 pl-3 leading-relaxed">
              {liturgy.evangeliumExcerpt}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-semibold border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-300"
              icon={<BookOpen className="w-4 h-4 text-emerald-400" />}
            >
              Leituras de Hoje (CNBB)
            </Button>
          </div>
        </div>
      </section>

      {/* Modal com as Leituras Oficiais da Liturgia Diária */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Liturgia Diária Oficial (CNBB)"
        description={`${liturgy.celebrationTitle} • ${liturgy.date}`}
        maxWidth="lg"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 text-sm leading-relaxed text-[var(--dash-text-primary)]">
          {/* Primeira Leitura */}
          <div className="space-y-2 p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Bookmark className="w-3.5 h-3.5" />
              <span>1ª Leitura • {liturgy.readings.firstReading.reference}</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed">
              {liturgy.readings.firstReading.text}
            </p>
            <p className="text-[11px] font-bold text-[var(--dash-text-primary)] mt-1">— Palavra do Senhor. Graças a Deus.</p>
          </div>

          {/* Salmo Responsorial */}
          <div className="space-y-2 p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Salmo Responsorial • {liturgy.readings.psalm.reference}</span>
            </div>
            <p className="font-bold text-amber-300 text-xs sm:text-sm italic">
              {liturgy.readings.psalm.response}
            </p>
            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed">
              {liturgy.readings.psalm.text}
            </p>
          </div>

          {/* Santo Evangelho */}
          <div className="space-y-2 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Evangelho • {liturgy.readings.gospel.reference}</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--dash-text-primary)] leading-relaxed font-medium">
              {liturgy.readings.gospel.text}
            </p>
            <p className="text-[11px] font-bold text-emerald-400 mt-1">— Palavra da Salvação. Glória a vós, Senhor.</p>
          </div>
        </div>
      </Modal>
    </>
  );
}
