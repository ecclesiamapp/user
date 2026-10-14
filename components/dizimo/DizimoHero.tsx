'use client';

import React from 'react';
import { HeartHandshake, Sparkles } from 'lucide-react';

interface DizimoHeroProps {
  parishName?: string;
  dioceseName?: string;
}

export function DizimoHero({
  parishName = 'Catedral do Sagrado Coração de Jesus',
  dioceseName = 'Diocese de Colatina',
}: DizimoHeroProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#16181B] via-[#2D1215] to-[#16181B] text-white p-6 sm:p-12 border border-[#C8A463]/40 shadow-2xl">
      {/* Background Decorativo Litúrgico */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8B1E22]/25 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Badge Canônico */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--dash-surface)]/10 border border-[#FFCC36]/40 text-xs font-bold text-[#FFCC36] uppercase tracking-wider backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FFCC36]" />
          <span>Campanha Pastoral • Sou do Sagrado</span>
        </div>

        {/* Título Principal */}
        <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wide leading-tight">
          O Dízimo é <span className="text-[#FFCC36]">Amor</span>, Gratidão e <span className="text-[#FFA82A]">Partilha</span>
        </h1>

        {/* Citação Bíblica em Itálico Nobre */}
        <div className="p-4 rounded-2xl bg-[var(--dash-surface)]/10 border-l-4 border-[#FFA82A] backdrop-blur-xs">
          <p className="font-serif italic text-sm sm:text-base text-[#F5EFE7] leading-relaxed">
            "Cada um dê conforme determinou em seu coração, não com tristeza ou por obrigação, pois Deus ama quem dá com alegria."
          </p>
          <span className="block text-xs font-bold text-[#FFA82A] uppercase tracking-wider mt-2 font-sans">
            — 2 Coríntios 9, 7
          </span>
        </div>

        {/* Descrição Pastoral */}
        <p className="text-xs sm:text-sm text-[#EAE3D9]/90 leading-relaxed font-sans">
          Ser dizimista na <strong>{parishName}</strong> é assumir com alegria a corresponsabilidade pela evangelização, pelo sustento do altar sagrado e pelas obras de caridade na <strong>{dioceseName}</strong>.
        </p>

        {/* Botão de Ação Imediata (Mobile-First 44px) */}
        <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 font-sans">
          <button
            onClick={() => scrollToSection('adesao-dizimista')}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FFA82A] via-[#FFCC36] to-[#FFA82A] hover:brightness-105 text-[#2D1A16] font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-[#FFA82A]/20 transition-all cursor-pointer min-h-[44px]"
          >
            <HeartHandshake className="w-4 h-4 text-[#2D1A16]" />
            <span>Quero ser Dizimista</span>
          </button>
        </div>
      </div>
    </section>
  );
}
