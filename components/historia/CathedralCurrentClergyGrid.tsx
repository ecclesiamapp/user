'use client';

import React from 'react';
import { User, Calendar, Heart, Shield } from 'lucide-react';

interface ClergyMember {
  id: string;
  name: string;
  roleTitle: string;
  isParoco?: boolean;
  ordinationDate?: string;
  photoUrl?: string;
  description: string;
}

const CURRENT_CLERGY: ClergyMember[] = [
  {
    id: 'clergy-irineu',
    name: 'Padre Irineu Claudino Sales',
    roleTitle: 'Pároco e Cura da Catedral',
    isParoco: true,
    ordinationDate: '12 de agosto de 2017',
    photoUrl: '/images/pastores/pe-irineu-claudino-sales.webp',
    description: 'Responsável direto pela administração eclesial, liturgia catedralícia e governo pastoral das 14 CEBs.',
  },
  {
    id: 'clergy-adilson',
    name: 'Padre Adilson Ramos de Melo',
    roleTitle: 'Vigário Paroquial',
    isParoco: false,
    ordinationDate: '15 de dezembro de 2007',
    description: 'Atua com zelo na celebração dos sacramentos, confissões, visitas aos enfermos e direção espiritual paroquial.',
  },
  {
    id: 'clergy-deivid',
    name: 'Padre Deivid José Langa Lopes',
    roleTitle: 'Vigário Paroquial & Assistente dos Movimentos Juvenis',
    isParoco: false,
    ordinationDate: '25 de março de 2023',
    photoUrl: '/images/pastores/pe-deivid-pereira.webp',
    description: 'Acompanha a juventude, adolescentes e os movimentos da paróquia (EAC e EJC), fortalecendo as vocações.',
  },
  {
    id: 'clergy-ernandes',
    name: 'Padre Ernandes Samuel Fantin',
    roleTitle: 'Vigário Paroquial & Jubilau Sacerdotal',
    isParoco: false,
    ordinationDate: '12 de dezembro de 1971',
    photoUrl: '/images/pastores/pe-ernandes-fantin.webp',
    description: 'Mais de cinco décadas de fidelidade presbiteral e dedicação ao povo de Deus no confessionário e na oração.',
  },
];

export function CathedralCurrentClergyGrid() {
  return (
    <div className="bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)] p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] text-[10px] font-bold uppercase tracking-wider">
          <Shield className="w-3 h-3" />
          Ministério Presbiteral Ativo
        </span>
        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--dash-text-primary)] uppercase tracking-wide">
          Clero em Atividade na Catedral
        </h3>
        <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] font-sans leading-relaxed">
          Os sacerdotes designados pela Diocese de Colatina para o cuidado espiritual do rebanho da Catedral e das Comunidades Eclesiais de Base.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {CURRENT_CLERGY.map((priest) => (
          <div
            key={priest.id}
            className={`rounded-2xl border p-4 flex flex-col justify-between transition-all group ${
              priest.isParoco
                ? 'bg-[var(--dash-surface-secondary)] border-[#8B1E22]/40 shadow-sm'
                : 'bg-[var(--dash-surface)] border-[var(--dash-border)] hover:border-[#8B1E22]/30'
            }`}
          >
            <div className="space-y-3">
              {/* Retrato 4:5 */}
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-[#C8A463]/30 shadow-xs bg-stone-900 relative">
                {priest.photoUrl ? (
                  <img
                    src={priest.photoUrl}
                    alt={priest.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#8B1E22]/20 to-[#2D1A16]/30 flex flex-col items-center justify-center text-[#8B1E22] dark:text-[#FFA82A] p-3 text-center">
                    <User className="w-10 h-10 mb-2 opacity-60" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
                      Diocese de Colatina
                    </span>
                  </div>
                )}
                {priest.isParoco && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#8B1E22] text-[#FFCC36] text-[9px] font-extrabold uppercase tracking-wide shadow-xs">
                      Pároco
                    </span>
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B75319] block truncate">
                  {priest.roleTitle}
                </span>
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-[var(--dash-text-primary)] leading-tight">
                  {priest.name}
                </h4>
                {priest.ordinationDate && (
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--dash-text-secondary)] pt-0.5">
                    <Calendar className="w-3 h-3 text-[#C8A463] shrink-0" />
                    <span>Ordenação: {priest.ordinationDate}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed font-sans line-clamp-3">
                {priest.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-[var(--dash-border)] flex items-center gap-1 text-[10px] text-[var(--dash-text-muted)]">
              <Heart className="w-3 h-3 text-[#8B1E22] dark:text-[#FFA82A] shrink-0" />
              <span className="truncate">Catedral do Sagrado Coração</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
