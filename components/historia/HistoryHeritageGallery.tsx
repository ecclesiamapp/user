'use client';

import React, { useState } from 'react';
import { Armchair, Sun, Flame, Bell, Shield, Sparkles, Scroll, Maximize2, X } from 'lucide-react';
import { SACRED_HERITAGE_ITEMS, SacredHeritageItem } from '@/lib/history';

export function HistoryHeritageGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; caption: string; title: string } | null>(null);

  const getHeritageIcon = (icon: SacredHeritageItem['icon']) => {
    switch (icon) {
      case 'chair':
        return <Armchair className="w-5 h-5" />;
      case 'sun':
        return <Sun className="w-5 h-5" />;
      case 'flame':
        return <Flame className="w-5 h-5" />;
      case 'bell':
        return <Bell className="w-5 h-5" />;
      case 'shield':
        return <Shield className="w-5 h-5" />;
      case 'scroll':
        return <Scroll className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section className="space-y-8">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] text-xs font-bold uppercase tracking-wider">
            Arquitetura & Simbolismo Sacro
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)] mt-1.5">
            O Patrimônio Espiritual da <span className="text-[#8B1E22]">Catedral</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] mt-1 max-w-2xl font-sans">
            Registros fotográficos e detalhes do projeto original de Benedito Calixto Neto, os vitrais históricos, o Altar coroado pelo baldaquino e o caminho das procissões.
          </p>
        </div>
      </div>

      {/* Grid de Itens de Patrimônio Sacro com Fotos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SACRED_HERITAGE_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)] overflow-hidden flex flex-col justify-between hover:border-[#8B1E22]/50 hover:shadow-md transition-all group"
          >
            {/* Foto Real do Patrimônio Sacro */}
            {item.imageUrl && (
              <div className="relative h-48 w-full overflow-hidden bg-black/40">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--dash-surface)] via-transparent to-black/30 pointer-events-none" />
                
                {/* Botão de Ampliação */}
                <button
                  onClick={() =>
                    setSelectedPhoto({
                      src: item.imageUrl!,
                      caption: item.imageCaption || item.title,
                      title: item.title,
                    })
                  }
                  type="button"
                  className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Ampliar imagem"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">Ver Foto</span>
                </button>

                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/60 text-[#FFCC36] backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#2D1A16] border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shadow-xs shrink-0">
                    {getHeritageIcon(item.icon)}
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--dash-text-primary)] group-hover:text-[#8B1E22] transition-colors leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed font-sans">
                  {item.description}
                </p>

                {/* Significado Teológico / Simbólico */}
                <div className="p-3.5 rounded-xl bg-[#8B1E22]/5 border-l-3 border-[#8B1E22] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B1E22] block">
                    Sentido Teológico
                  </span>
                  <p className="text-xs text-[var(--dash-text-primary)] italic leading-relaxed">
                    {item.theologicalMeaning}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[var(--dash-border)] text-[11px] text-[var(--dash-text-secondary)] flex items-center justify-between">
                <span>Acervo Catedral de Colatina</span>
                <span className="font-semibold text-[#C8A463]">Patrimônio Sacro</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Lightbox de Foto Ampliada */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedPhoto(null)}
          />
          <div className="relative max-w-4xl w-full bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)] overflow-hidden shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between p-4 border-b border-[var(--dash-border)]">
              <div>
                <h4 className="font-cinzel text-base sm:text-lg font-bold text-[var(--dash-text-primary)]">
                  {selectedPhoto.title}
                </h4>
                <p className="text-xs text-[var(--dash-text-secondary)]">
                  Catedral Diocesana Sagrado Coração de Jesus • Colatina/ES
                </p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                type="button"
                className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Fechar foto ampliada"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 max-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.caption}
                className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-md"
              />
              <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] italic text-center mt-3 max-w-2xl">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
