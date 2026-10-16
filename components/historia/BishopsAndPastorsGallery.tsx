'use client';

import React, { useState } from 'react';
import { Crown, Sparkles, User, Award, ShieldCheck, Heart } from 'lucide-react';
import { BISHOPS_SUCCESSION, PARISH_PRIESTS_SUCCESSION, BishopSuccession, PastorSuccession } from '@/lib/history';

interface BishopsAndPastorsGalleryProps {
  initialBishops?: BishopSuccession[];
  initialPastors?: PastorSuccession[];
}

export function BishopsAndPastorsGallery({ initialBishops, initialPastors }: BishopsAndPastorsGalleryProps) {
  const [activeTab, setActiveTab] = useState<'bishops' | 'pastors'>('bishops');

  const bishopsList = initialBishops && initialBishops.length > 0
    ? initialBishops
    : BISHOPS_SUCCESSION;

  const pastorsList = initialPastors && initialPastors.length > 0
    ? initialPastors
    : PARISH_PRIESTS_SUCCESSION;

  return (
    <section className="space-y-8 overflow-hidden">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] text-xs font-bold uppercase tracking-wider">
            Sucessão Apostólica & Governo Pastoral
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)] mt-1.5">
            Os Pastores da <span className="text-[#8B1E22] dark:text-[#FFA82A]">Nossa Igreja</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] mt-1 max-w-2xl font-sans">
            A sucessão episcopal diocesana e o zelo dos párocos que edificaram a história pastoral da Catedral do Sagrado Coração de Jesus.
          </p>
        </div>

        {/* Abas Alternadoras Responsivas (Mobile-First) */}
        <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center gap-1.5 p-1 bg-[var(--dash-surface)] rounded-xl border border-[var(--dash-border)] shrink-0">
          <button
            onClick={() => setActiveTab('bishops')}
            type="button"
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer ${
              activeTab === 'bishops'
                ? 'bg-gradient-to-r from-[#8B1E22] to-[#5E1417] text-[#FFCC36] shadow-sm'
                : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            <Crown className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Bispos ({bishopsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pastors')}
            type="button"
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer ${
              activeTab === 'pastors'
                ? 'bg-gradient-to-r from-[#8B1E22] to-[#5E1417] text-[#FFCC36] shadow-sm'
                : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Párocos ({pastorsList.length})</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Aba 1: Bispos Diocesanos com Fotos Oficiais */}
      {activeTab === 'bishops' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {bishopsList.map((bishop) => (
            <div
              key={bishop.id}
              className={`rounded-2xl border p-5 sm:p-7 flex flex-col justify-between transition-all relative overflow-hidden ${
                bishop.isCurrent
                  ? 'bg-[var(--dash-surface)] border-[#FFA82A] ring-1 ring-[#FFA82A]/30 shadow-md'
                  : 'bg-[var(--dash-surface)]/80 border-[var(--dash-border)] hover:border-[#8B1E22]/40'
              }`}
            >
              {/* Badges Flutuantes de Status (Bispo Atual / In Memoriam) */}
              <div className="flex items-center justify-end gap-2 mb-3">
                {bishop.isCurrent && (
                  <span className="bg-gradient-to-l from-[#FFA82A] to-[#FFCC36] text-[#2D1A16] px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 text-[#2D1A16]" />
                    <span>Bispo Diocesano Atual</span>
                  </span>
                )}
                {bishop.inMemoriam && (
                  <span className="px-2.5 py-0.5 rounded-md bg-stone-900/80 dark:bg-stone-800 border border-stone-600/50 text-stone-200 text-[10px] font-serif font-bold tracking-wider flex items-center gap-1">
                    <span>✝ In Memoriam</span>
                    {bishop.deceasedYear && <span>({bishop.deceasedYear})</span>}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {/* Linha com Foto Oficial e Identificação */}
                <div className="flex items-start gap-4">
                  {bishop.imageUrl ? (
                    <div className="relative shrink-0">
                      <img
                        src={bishop.imageUrl}
                        alt={bishop.name}
                        loading="lazy"
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover object-top border-2 border-[#C8A463]/50 shadow-md bg-stone-900"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-md bg-[#8B1E22] text-[#FFCC36] shadow-xs">
                        <Crown className="w-3 h-3" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#2D1A16] border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shadow-xs shrink-0">
                      <Crown className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#B75319] block truncate">
                      {bishop.orderLabel}
                    </span>
                    <h3 className="font-cinzel text-base sm:text-xl font-bold text-[var(--dash-text-primary)] leading-snug">
                      {bishop.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#8B1E22] dark:text-[#FFA82A] mt-0.5">
                      {bishop.period}
                    </p>
                    <p className="text-[11px] text-[var(--dash-text-secondary)] mt-0.5">
                      {bishop.title}
                    </p>
                  </div>
                </div>

                {/* Lema Episcopal */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--dash-surface-hover)] border border-[var(--dash-border)] space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C8A463] uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 shrink-0" />
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
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8B1E22] dark:text-[#FFA82A] shrink-0 mt-0.5" />
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--dash-border)] flex items-center justify-between text-[11px] text-[var(--dash-text-secondary)]">
                <span>Diocese de Colatina</span>
                <span className="font-semibold text-[#8B1E22] dark:text-[#FFA82A]">Cátedra Episcopal</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conteúdo Aba 2: Censo Histórico de Párocos da Catedral */}
      {activeTab === 'pastors' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastorsList.map((pastor) => (
              <div
                key={pastor.id}
                className={`rounded-2xl border p-5 sm:p-7 flex flex-col justify-between transition-all ${
                  pastor.isCurrent
                    ? 'bg-[var(--dash-surface)] border-[#8B1E22] ring-1 ring-[#8B1E22]/30 shadow-md'
                    : 'bg-[var(--dash-surface)]/80 border-[var(--dash-border)] hover:border-[#8B1E22]/40'
                }`}
              >
                <div className="space-y-3">
                  {/* Badges de Status (Pároco Atual / In Memoriam) */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B75319]">
                      {pastor.role}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {pastor.isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] text-[10px] font-extrabold uppercase tracking-wide">
                          Pároco Atual
                        </span>
                      )}
                      {pastor.inMemoriam && (
                        <span className="px-2.5 py-0.5 rounded-md bg-stone-900/80 dark:bg-stone-800 border border-stone-600/50 text-stone-200 text-[10px] font-serif font-bold tracking-wider flex items-center gap-1">
                          <span>✝ In Memoriam</span>
                          {pastor.deceasedYear && <span>({pastor.deceasedYear})</span>}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Linha com Foto (se houver) e Títulos */}
                  <div className="flex items-start gap-4">
                    {pastor.imageUrl ? (
                      <div className="relative shrink-0">
                        <img
                          src={pastor.imageUrl}
                          alt={pastor.name}
                          loading="lazy"
                          className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl object-cover object-top border-2 border-[#C8A463]/50 shadow-md bg-stone-900"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-gradient-to-br from-[#8B1E22]/20 to-[#2D1A16]/20 border border-[var(--dash-border)] flex items-center justify-center text-[#8B1E22] dark:text-[#FFA82A] shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-cinzel text-base sm:text-xl font-bold text-[var(--dash-text-primary)] leading-snug">
                        {pastor.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#8B1E22] dark:text-[#FFA82A] mt-0.5">
                        {pastor.period}
                      </p>
                    </div>
                  </div>

                  {/* Nota Solene de Cripta da Catedral (Ex: Cônego Geraldo Meyers) */}
                  {pastor.cryptNote && (
                    <div className="p-2.5 rounded-xl bg-[#8B1E22]/10 border border-[#8B1E22]/20 text-[11px] text-[#8B1E22] dark:text-[#FFA82A] font-semibold flex items-center gap-2">
                      <span className="text-sm">🏛️</span>
                      <span>{pastor.cryptNote}</span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed font-sans">
                    {pastor.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--dash-border)] flex items-center gap-1.5 text-xs text-[var(--dash-text-secondary)]">
                  <Heart className="w-3.5 h-3.5 text-[#8B1E22] dark:text-[#FFA82A] shrink-0" />
                  <span className="truncate">Zelo pastoral pelo rebanho do Sagrado Coração</span>
                </div>
              </div>
            ))}
          </div>

          {/* Destaque para o Clero Paroquial Atual */}
          <div className="bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)] p-6 text-center space-y-3">
            <h4 className="font-cinzel text-base font-bold text-[var(--dash-text-primary)] uppercase tracking-wide">
              Clero em Atividade na Catedral
            </h4>
            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-xl mx-auto leading-relaxed">
              Sob a liderança do Pároco Pe. Irineu Claudino Sales, a paróquia conta com o auxílio solene dos vigários paroquiais Padre Adilson Ramos de Melo, Padre Deivid José Langa Lopes e Padre Ernandes Samuel Fantin.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
