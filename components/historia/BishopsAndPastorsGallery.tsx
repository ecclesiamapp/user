'use client';

import React, { useState } from 'react';
import { Crown, Sparkles, User, Award, ShieldCheck, Heart } from 'lucide-react';
import { BISHOPS_SUCCESSION, PARISH_PRIESTS_SUCCESSION } from '@/lib/history';

export function BishopsAndPastorsGallery() {
  const [activeTab, setActiveTab] = useState<'bishops' | 'pastors'>('bishops');

  return (
    <section className="space-y-8">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] text-xs font-bold uppercase tracking-wider">
            Sucessão Apostólica & Governo Pastoral
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)] mt-1.5">
            Os Pastores da <span className="text-[#8B1E22]">Nossa Igreja</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] mt-1 max-w-2xl font-sans">
            A sucessão episcopal diocesana e o zelo dos párocos que edificaram a história pastoral da Catedral do Sagrado Coração de Jesus.
          </p>
        </div>

        {/* Abas Alternadoras */}
        <div className="flex items-center gap-2 p-1 bg-[var(--dash-surface)] rounded-xl border border-[var(--dash-border)] shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('bishops')}
            type="button"
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 min-h-[44px] cursor-pointer ${
              activeTab === 'bishops'
                ? 'bg-gradient-to-r from-[#8B1E22] to-[#5E1417] text-[#FFCC36] shadow-sm'
                : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Bispos Diocesanos</span>
          </button>
          <button
            onClick={() => setActiveTab('pastors')}
            type="button"
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 min-h-[44px] cursor-pointer ${
              activeTab === 'pastors'
                ? 'bg-gradient-to-r from-[#8B1E22] to-[#5E1417] text-[#FFCC36] shadow-sm'
                : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Párocos da Catedral</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Aba 1: Bispos Diocesanos */}
      {activeTab === 'bishops' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {BISHOPS_SUCCESSION.map((bishop) => (
            <div
              key={bishop.id}
              className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all relative overflow-hidden ${
                bishop.isCurrent
                  ? 'bg-[var(--dash-surface)] border-[#FFA82A] ring-1 ring-[#FFA82A]/30 shadow-md'
                  : 'bg-[var(--dash-surface)]/80 border-[var(--dash-border)] hover:border-[#8B1E22]/40'
              }`}
            >
              {bishop.isCurrent && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#FFA82A] to-[#FFCC36] text-[#2D1A16] px-3.5 py-1 rounded-bl-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#2D1A16]" />
                  <span>Bispo Atual</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#2D1A16] border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shadow-xs shrink-0">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#B75319]">
                      {bishop.orderLabel}
                    </span>
                    <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--dash-text-primary)]">
                      {bishop.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#8B1E22]">
                      {bishop.period}
                    </p>
                  </div>
                </div>

                {/* Lema Episcopal */}
                <div className="p-3.5 rounded-xl bg-[var(--dash-surface-hover)] border border-[var(--dash-border)] space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C8A463] uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5" />
                    <span>Lema Episcopal</span>
                  </div>
                  <p className="font-serif italic text-xs sm:text-sm font-semibold text-[var(--dash-text-primary)]">
                    "{bishop.motto}"
                  </p>
                  <p className="text-[11px] text-[var(--dash-text-secondary)]">
                    {bishop.mottoTranslation}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed font-sans">
                  {bishop.summary}
                </p>

                {/* Realizações Notáveis */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
                    Marcos do Ministério:
                  </span>
                  <ul className="space-y-1 text-xs text-[var(--dash-text-primary)]">
                    {bishop.achievements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8B1E22] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--dash-border)] flex items-center justify-between text-[11px] text-[var(--dash-text-secondary)]">
                <span>Diocese de Colatina</span>
                <span className="font-semibold text-[#8B1E22]">Cátedra Episcopal</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conteúdo Aba 2: Párocos da Catedral */}
      {activeTab === 'pastors' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARISH_PRIESTS_SUCCESSION.map((pastor) => (
              <div
                key={pastor.id}
                className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  pastor.isCurrent
                    ? 'bg-[var(--dash-surface)] border-[#8B1E22] ring-1 ring-[#8B1E22]/30 shadow-md'
                    : 'bg-[var(--dash-surface)]/80 border-[var(--dash-border)]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B75319]">
                      {pastor.role}
                    </span>
                    {pastor.isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] text-[10px] font-extrabold uppercase tracking-wide">
                        Pároco Atual
                      </span>
                    )}
                  </div>

                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--dash-text-primary)]">
                    {pastor.name}
                  </h3>

                  <p className="text-xs font-semibold text-[#8B1E22]">
                    {pastor.period}
                  </p>

                  <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed font-sans">
                    {pastor.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--dash-border)] flex items-center gap-1.5 text-xs text-[var(--dash-text-secondary)]">
                  <Heart className="w-3.5 h-3.5 text-[#8B1E22]" />
                  <span>Zelo pastoral pelo rebanho do Sagrado Coração</span>
                </div>
              </div>
            ))}
          </div>

          {/* Destaque para o Clero Paroquial Atual */}
          <div className="bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)] p-6 text-center space-y-3">
            <h4 className="font-cinzel text-base font-bold text-[var(--dash-text-primary)] uppercase tracking-wide">
              Clero em Atividade na Catedral
            </h4>
            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-xl mx-auto">
              Sob a liderança do Pároco Pe. Irineu Claudino Sales, a paróquia conta com o auxílio solene dos vigários paroquiais Padre Adilson Ramos de Melo, Padre Deivid José Langa Lopes e Padre Ernandes Samuel Fantin.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
