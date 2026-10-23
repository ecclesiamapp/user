import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { Community, CommunityActivity } from '@/types';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';

interface CommunityCalendarCardProps {
  community: Community;
  activities?: CommunityActivity[];
  liturgicalTheme?: LiturgicalColorTheme;
}

export function CommunityCalendarCard({
  community,
  activities = [],
  liturgicalTheme,
}: CommunityCalendarCardProps) {
  const activeTheme = liturgicalTheme || getLiturgicalColorTheme('verde');

  const defaultActivitiesList: CommunityActivity[] = [
    {
      id: 'act-padrao-1',
      title: 'Santo Terço dos Homens',
      date_label: '27 OUT',
      day_of_week: 'Segunda-feira',
      time: '19:30',
      category: 'oracao',
      location: 'Capela da Comunidade',
      responsible_group: 'Terço dos Homens',
      description: 'Oração contemplativa do terço pelas famílias.',
    },
    {
      id: 'act-padrao-2',
      title: 'Círculo Bíblico nos Lares',
      date_label: '29 OUT',
      day_of_week: 'Quarta-feira',
      time: '19:00',
      category: 'pastoral',
      location: 'Famílias do Bairro',
      responsible_group: 'Pastoral Familiar',
      description: 'Reflexão e partilha da Palavra de Deus.',
    },
    {
      id: 'act-padrao-3',
      title: 'Reunião Mensal do CPC',
      date_label: '03 NOV',
      day_of_week: 'Terça-feira',
      time: '20:00',
      category: 'pastoral',
      location: 'Salão Comunitário',
      responsible_group: 'Conselho Comunitário',
      description: 'Alinhamento pastoral e prestação de contas.',
    },
  ];

  // Fallback para 3 a 4 atividades modelo se a comunidade não tiver cadastradas
  const displayActivities: CommunityActivity[] =
    activities.length >= 3
      ? activities.slice(0, 4)
      : [...(activities || []), ...defaultActivitiesList].slice(0, 3);

  return (
    <div
      className={`relative h-full flex-1 rounded-3xl bg-gradient-to-b from-[#251B18]/95 via-[#1D1614]/95 to-[#161210]/95 border ${activeTheme.cardBorderClass} p-6 sm:p-7 shadow-xl shadow-black/40 overflow-hidden flex flex-col justify-between transition-colors duration-300`}
    >
      {/* Badge Numérico no Topo Direito (Card 3 com Acento Litúrgico Cirúrgico) */}
      <div
        className={`absolute top-0 right-0 w-10 h-10 rounded-bl-2xl rounded-tr-3xl ${activeTheme.numberBadgeClass} flex items-center justify-center font-serif font-bold text-sm shadow-sm transition-all duration-300`}
      >
        3
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-between">
        {/* Cabeçalho Nivelado com o Card 4 (CPC) */}
        <div className="min-h-[64px] flex flex-col justify-start">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFF3E3] tracking-tight">
            Atividades & Calendário
          </h2>
          <p className="text-xs text-[#EAE3D9]/70 mt-1 line-clamp-1">
            Próximos encontros de oração, círculos bíblicos e pastorais da {community.name}
          </p>
        </div>

        {/* Linha do Tempo de Atividades em Lista Compacta e Elegante */}
        <div className="space-y-2.5 my-auto py-1">
          {displayActivities.map((act) => {
            const [diaNum, mesSigla] = act.date_label.split(' ');

            return (
              <div
                key={act.id}
                className="group flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-[#2D211D]/70 hover:bg-[#382621]/90 border border-[#C8A463]/25 hover:border-[#FFA82A]/50 transition-all shadow-xs"
              >
                {/* Bloco de Data Marcante */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1C1513] to-[#2B1D19] border border-[#FFA82A]/40 flex flex-col items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <span className="font-serif font-bold text-sm text-[#FFCC36] leading-none">
                    {diaNum || '25'}
                  </span>
                  <span className="text-[9px] font-bold text-[#EAE3D9]/70 uppercase tracking-wider mt-0.5 leading-none">
                    {mesSigla || 'OUT'}
                  </span>
                </div>

                {/* Detalhes do Evento */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif font-bold text-xs sm:text-sm text-white truncate group-hover:text-amber-200 transition-colors">
                      {act.title}
                    </h3>
                    {act.responsible_group && (
                      <span className="hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--dash-surface)]/5 border border-white/10 text-amber-300/90 shrink-0">
                        {act.responsible_group}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#EAE3D9]/70">
                    <span className="inline-flex items-center gap-1 text-[#FFA82A]">
                      <Clock className="w-3 h-3" />
                      <span>{act.time}</span>
                    </span>
                    {act.day_of_week && (
                      <span className="text-[#EAE3D9]/60 truncate">• {act.day_of_week}</span>
                    )}
                    {act.location && (
                      <span className="hidden md:inline-flex items-center gap-1 text-[#EAE3D9]/60 truncate">
                        • {act.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rodapé do Card Nivelado com o Card 4 (CPC) */}
      <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-xs text-[#EAE3D9]/60 min-h-[46px]">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#FFA82A]" />
          <span>Agenda Comunitária Ativa</span>
        </div>
        <span className="text-[#FFA82A] font-serif italic text-[11px]">
          {displayActivities.length} encontros agendados
        </span>
      </div>
    </div>
  );
}
