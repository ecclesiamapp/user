import React from 'react';
import { Flame, Church, Globe2, Heart, BookOpen } from 'lucide-react';

export function DizimoDimensions() {
  const dimensions = [
    {
      number: '01',
      title: 'Dimensão Religiosa',
      subtitle: 'Gratidão a Deus Pai',
      description:
        'Expressa o reconhecimento de que tudo o que temos provém do amor e da providência divina. É um ato sagrado de profunda comunhão e louvor.',
      icon: Flame,
      color: 'text-[#FFA82A]',
      borderColor: 'border-[#FFA82A]/30',
      bgColor: 'bg-[#FFA82A]/10',
    },
    {
      number: '02',
      title: 'Dimensão Eclesial',
      subtitle: 'Sustento da Casa Mãe',
      description:
        'Garante a conservação do templo, alfaias, hóstias e vinho da Santa Missa, além dos custos de energia, manutenção e sustento digno do clero.',
      icon: Church,
      color: 'text-[#FFCC36]',
      borderColor: 'border-[#FFCC36]/30',
      bgColor: 'bg-[#FFCC36]/10',
    },
    {
      number: '03',
      title: 'Dimensão Missionária',
      subtitle: 'Evangelização & CEBs',
      description:
        'Permite à Catedral apoiar a formação bíblica, catequese infantil, juventude e o fortalecimento pastoral das nossas 12 comunidades de base e áreas rurais.',
      icon: Globe2,
      color: 'text-[#305AAD]',
      borderColor: 'border-[#305AAD]/30',
      bgColor: 'bg-[#305AAD]/10',
    },
    {
      number: '04',
      title: 'Dimensão Caritativa',
      subtitle: 'Amor aos Pobres e Enfermos',
      description:
        'Transforma a fé em caridade concreta: socorro a famílias em vulnerabilidade, cestas de alimentos, remédios e apoio à Pastoral da Esperança e Saúde.',
      icon: Heart,
      color: 'text-[#8B1E22] dark:text-[#FFA82A]',
      borderColor: 'border-[#8B1E22]/30 dark:border-[#FFA82A]/30',
      bgColor: 'bg-[#8B1E22]/10 dark:bg-[#FFA82A]/10',
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dash-border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8B1E22] dark:text-[#FFA82A] uppercase tracking-wider">
              Doutrina Católica & CNBB
            </span>
            <span className="text-xs text-[var(--dash-text-secondary)]">•</span>
            <span className="text-xs text-[var(--dash-text-secondary)] font-medium">
              Documento 106
            </span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)] mt-1">
            As Quatro Dimensões do Dízimo
          </h2>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-xs text-[var(--dash-text-secondary)] font-medium">
          <BookOpen className="w-3.5 h-3.5 text-[#FFA82A]" />
          <span>Fé Viva e Comunhão</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dimensions.map((dim) => {
          const Icon = dim.icon;
          return (
            <div
              key={dim.number}
              className={`p-5 rounded-2xl bg-[var(--dash-surface)] border ${dim.borderColor} hover:border-[#FFA82A]/60 transition-all flex flex-col justify-between shadow-xs space-y-4`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-xl ${dim.bgColor} ${dim.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="font-cinzel text-xl font-bold text-[var(--dash-text-secondary)]/40">
                    {dim.number}
                  </span>
                </div>

                <div>
                  <h3 className="font-cinzel text-base font-bold text-[var(--dash-text-primary)]">
                    {dim.title}
                  </h3>
                  <p className={`text-xs font-semibold ${dim.color} mt-0.5`}>
                    {dim.subtitle}
                  </p>
                </div>

                <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed font-sans">
                  {dim.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
