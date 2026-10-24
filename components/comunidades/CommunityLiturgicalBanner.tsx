import React from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';

interface CommunityLiturgicalBannerProps {
  liturgicalTheme?: LiturgicalColorTheme;
  celebrationTitle?: string;
  celebrationDay?: string;
}

export function CommunityLiturgicalBanner({
  liturgicalTheme,
  celebrationTitle,
  celebrationDay,
}: CommunityLiturgicalBannerProps) {
  const activeTheme = liturgicalTheme || getLiturgicalColorTheme('verde');

  const title = celebrationTitle || celebrationDay || 'Liturgia da Santa Igreja';
  const colorLabel = activeTheme.colorLabel || 'Tempo Comum';

  return (
    <div className="w-full bg-[#1A1412] border-b border-[#C8A463]/25 py-2 px-3 sm:px-6">
      <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 text-xs">
        {/* Lado Esquerdo: Indicador Litúrgico do Dia */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeTheme.pulseClass}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${activeTheme.dotClass}`} />
          </span>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="font-bold text-[#FFA82A] uppercase tracking-wider font-serif">
              {colorLabel}
            </span>
            <span className="text-[#C8A463]/50 hidden sm:inline">•</span>
            <span className="text-[#EAE3D9] font-medium truncate max-w-[280px] sm:max-w-md">
              {title}
            </span>
          </div>
        </div>

        {/* Lado Direito: Lembrança Sagrada */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#C8A463]/80 italic font-serif">
          <span>«Onde dois ou três estiverem reunidos em meu nome, ali estou Eu.»</span>
          <span className="text-[10px] text-[#FFA82A]/70 not-italic">(Mt 18, 20)</span>
        </div>
      </div>
    </div>
  );
}
