'use client';

import React from 'react';
import { Type } from 'lucide-react';
import { useCommunityAccessibility, FontScale } from './CommunityAccessibilityContext';

export function AccessibilityFontScaleControl() {
  const { fontScale, setFontScale } = useCommunityAccessibility();

  const options: { scale: FontScale; label: string; title: string; symbol: string }[] = [
    { scale: 'normal', label: 'Padrão', title: 'Tamanho padrão de leitura', symbol: 'A-' },
    { scale: 'large', label: 'Médio', title: 'Tamanho confortável (ampliado)', symbol: 'A' },
    { scale: 'xlarge', label: 'Grande', title: 'Tamanho extra para melhor leitura de idosos', symbol: 'A+' },
  ];

  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#2D211D]/80 border border-[#C8A463]/30 text-[#EAE3D9] shadow-xs"
      role="group"
      aria-label="Ajustar tamanho da fonte para leitura confortável"
    >
      <div className="hidden sm:flex items-center gap-1 pl-2 pr-1 text-[11px] font-medium text-[#FFA82A]">
        <Type className="w-3.5 h-3.5" />
        <span className="font-serif">Fonte:</span>
      </div>

      <div className="flex items-center gap-0.5">
        {options.map((opt) => {
          const isActive = fontScale === opt.scale;

          return (
            <button
              key={opt.scale}
              type="button"
              onClick={() => setFontScale(opt.scale)}
              className={`min-h-[44px] min-w-[44px] px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                isActive
                  ? 'bg-[#FFA82A] text-[#2D1A16] shadow-sm font-black scale-105'
                  : 'hover:bg-[var(--dash-surface)]/10 text-[#EAE3D9]/80 hover:text-white'
              }`}
              title={opt.title}
              aria-label={opt.title}
              aria-pressed={isActive}
            >
              <span className={opt.scale === 'xlarge' ? 'text-sm font-black' : opt.scale === 'large' ? 'text-xs font-bold' : 'text-[11px]'}>
                {opt.symbol}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
