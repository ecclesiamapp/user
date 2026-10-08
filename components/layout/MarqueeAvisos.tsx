import React from 'react';

interface MarqueeAvisosProps {
  items?: string[];
}

const defaultItems = [
  'Catedral do Sagrado Coração de Jesus • Diocese de Colatina',
  'Santa Missa de Hoje às 19h30 no Altar Principal',
  'Atendimento de Confissões: Terças e Quintas das 16h às 18h',
  'Campanha Sou do Sagrado, Sou Dizimista • Participe da conservação do nosso templo',
  'Plantão da Secretaria Paroquial pelo WhatsApp oficial',
  'Palavra do Pároco: Nova reflexão com Pe. Irineu Claudino Sales disponível no portal',
];

export function MarqueeAvisos({ items = defaultItems }: MarqueeAvisosProps) {
  return (
    <div className="w-full bg-[#211A14] text-[#FCF7F1] overflow-hidden py-2 text-xs sm:text-sm font-medium border-b border-[#352A20] select-none">
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee flex items-center">
          {items.map((item, index) => (
            <span key={`m1-${index}`} className="inline-flex items-center mx-6 tracking-wide">
              <span>{item}</span>
              <span className="ml-6 text-[var(--brand-gold-500)] font-bold text-base">✦</span>
            </span>
          ))}
        </div>
        <div className="animate-marquee flex items-center" aria-hidden="true">
          {items.map((item, index) => (
            <span key={`m2-${index}`} className="inline-flex items-center mx-6 tracking-wide">
              <span>{item}</span>
              <span className="ml-6 text-[var(--brand-gold-500)] font-bold text-base">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
