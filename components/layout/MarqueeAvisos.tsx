import React from 'react';
import { ResolvedEventTheme } from '@/lib/events';

interface MarqueeAvisosProps {
  items?: string[];
  themeOverride?: ResolvedEventTheme;
}

const defaultItems = [
  'Catedral do Sagrado Coração de Jesus • Diocese de Colatina',
  'Santa Missa de Hoje às 19h30 na Catedral Diocesana',
  'Atendimento de Confissões: Terças e Quintas das 16h às 18h',
  'Campanha Sou do Sagrado, Sou Dizimista • Participe da conservação do nosso templo',
  'Plantão da Secretaria Paroquial pelo WhatsApp oficial',
  'Palavra do Pároco: Nova reflexão com Pe. Irineu Claudino Sales disponível no portal',
];

export function MarqueeAvisos({ items = defaultItems, themeOverride }: MarqueeAvisosProps) {
  const barStyle = themeOverride
    ? {
        backgroundColor: themeOverride.primary,
        color: themeOverride.textPrimary,
        borderColor: `${themeOverride.secondary}45`,
      }
    : undefined;

  const starColor = themeOverride ? themeOverride.secondary : '#FFCC36';

  return (
    <div
      suppressHydrationWarning
      className={`w-full overflow-hidden py-1.5 text-xs sm:text-sm font-semibold border-b select-none shadow-xs ${
        themeOverride ? '' : 'bg-[#8B1E22] text-[#FFFFFF] border-[#A62428]'
      }`}
      style={barStyle}
    >
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee flex items-center">
          {items.map((item, index) => (
            <span key={`m1-${index}`} className="inline-flex items-center mx-6 tracking-wide">
              <span>{item}</span>
              <span className="ml-6 font-bold text-base" style={{ color: starColor }}>
                ✦
              </span>
            </span>
          ))}
        </div>
        <div className="animate-marquee flex items-center" aria-hidden="true">
          {items.map((item, index) => (
            <span key={`m2-${index}`} className="inline-flex items-center mx-6 tracking-wide">
              <span>{item}</span>
              <span className="ml-6 font-bold text-base" style={{ color: starColor }}>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
