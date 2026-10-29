import React from 'react';
import { Building2, Heart, Church, Sparkles, CheckCircle2, ShieldCheck, Globe2 } from 'lucide-react';
import { TitheTransparencyItem } from '@/types';

interface DizimoTransparencyProps {
  items?: TitheTransparencyItem[];
}

const DEFAULT_PILLARS = [
  {
    id: 'tr-1',
    title: 'Restauro & Conservação da Catedral',
    tag: 'Patrimônio Sagrado',
    icon_name: 'Building2',
    description:
      'Cuidado contínuo com os vitrais históricos alemães, sistema de som litúrgico, climatização da nave central e conservação da torre monumental.',
    highlight: '100% conservada',
  },
  {
    id: 'tr-2',
    title: 'Pastoral da Caridade & Pobres',
    tag: 'Ação Social Concreta',
    icon_name: 'Heart',
    description:
      'Socorro imediato a famílias em vulnerabilidade em Colatina: distribuição regular de cestas básicas, medicamentos de urgência e apoio aos enfermos.',
    highlight: '+80 famílias assistidas/mês',
  },
  {
    id: 'tr-3',
    title: 'Comunhão com as 12 Comunidades (CEBs)',
    tag: 'Igreja em Saída',
    icon_name: 'Church',
    description:
      'Ajuda fraterna da Catedral Diocesana para que as comunidades menores do interior e periferia mantenham seus templos e comunidades dignas para as Santas Missas.',
    highlight: '12 CEBs fortalecidas',
  },
  {
    id: 'tr-4',
    title: 'Liturgia, Catequese & Vocacionados',
    tag: 'Evangelização Viva',
    icon_name: 'Sparkles',
    description:
      'Sustento da formação dos nossos seminaristas diocesanos, folhetos litúrgicos semanais, hóstias e vinho consagrados para as celebrações.',
    highlight: 'Vida Eclesial Plena',
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Building2,
  Heart,
  Church,
  Sparkles,
  Globe2,
};

export function DizimoTransparency({ items }: DizimoTransparencyProps) {
  const displayItems = items && items.length > 0 ? items : DEFAULT_PILLARS;

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dash-border)] pb-4">
        <div>
          <span className="text-xs font-bold text-[#8B1E22] dark:text-[#FFA82A] uppercase tracking-wider">
            Transparência Pastoral & Fidelidade
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)] mt-1">
            Onde o seu Dízimo Atua na Catedral?
          </h2>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-xs text-[var(--dash-text-secondary)] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FFA82A]" />
          <span>Conselho Paroquial de Assuntos Econômicos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayItems.map((pillar) => {
          const Icon = (pillar.icon_name && ICON_MAP[pillar.icon_name]) || Building2;
          return (
            <div
              key={pillar.id || pillar.title}
              className="p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] hover:border-[#FFA82A]/40 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#8B1E22]/10 dark:bg-[#FFA82A]/10 text-[#8B1E22] dark:text-[#FFA82A] text-xs font-bold uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pillar.tag}</span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    {pillar.highlight}
                  </span>
                </div>

                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--dash-text-primary)]">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed font-sans">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs text-[#FFA82A] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fruto do amor e generosidade dos nossos dizimistas</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
