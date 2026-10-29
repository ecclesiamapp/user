'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Church, 
  Clock, 
  MapPin, 
  BookOpen, 
  Flame, 
  HeartHandshake, 
  Navigation, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { MassSchedule, Community } from '@/types';

interface ScheduleCardProps {
  schedule: MassSchedule;
  community?: Community;
}

export function ScheduleCard({ schedule, community }: ScheduleCardProps) {
  const isHeadquarters = community?.is_headquarters || schedule.community_id === 'b1aac446-758d-4595-8724-38ce39b3a27e';
  const communityName = community?.name || schedule.location_name || 'Catedral Diocesana';
  const communitySlug = community?.slug;

  // Mapeamento visual por tipo de celebração
  const typeConfig: Record<string, { label: string; icon: React.ElementType; badgeClass: string }> = {
    missa: {
      label: 'Santa Missa',
      icon: Church,
      badgeClass: 'bg-[#8B1E22]/15 text-[#8B1E22] dark:text-[#FFA82A] border-[#8B1E22]/30',
    },
    celebracao_palavra: {
      label: 'Celebração da Palavra',
      icon: BookOpen,
      badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
    },
    confissao: {
      label: 'Sacramento da Confissão',
      icon: HeartHandshake,
      badgeClass: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    },
    adoracao: {
      label: 'Adoração ao Santíssimo',
      icon: Flame,
      badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    },
    expediente: {
      label: 'Expediente Paroquial',
      icon: Clock,
      badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    },
  };

  const currentType = typeConfig[schedule.type] || typeConfig.missa;
  const TypeIcon = currentType.icon;

  const mapsQuery = encodeURIComponent(`${communityName}, Colatina - ES`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <Card className="group relative p-5 sm:p-6 bg-[var(--dash-surface)] hover:bg-[var(--dash-surface-secondary)]/50 border-[var(--dash-border)] hover:border-[#FFA82A]/50 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md flex flex-col justify-between">
      {/* Topo do Card: Horário & Badge do Tipo */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl sm:text-4xl font-black text-[#8B1E22] dark:text-[#FFA82A] tracking-tight">
              {schedule.time}
            </span>
            <span className="text-xs font-semibold text-[var(--dash-text-secondary)]">
              {schedule.day_of_week}
            </span>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentType.badgeClass}`}>
            <TypeIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{currentType.label}</span>
          </span>
        </div>

        {/* Título da Comunidade & Localização */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={isHeadquarters ? 'matriz' : 'ceb'} className="text-[10px] font-bold uppercase tracking-wider">
              {isHeadquarters ? 'Catedral' : 'Comunidade Eclesial'}
            </Badge>
          </div>
          
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--dash-text-primary)] group-hover:text-[#8B1E22] dark:group-hover:text-[#FFA82A] transition-colors line-clamp-1">
            {communityName}
          </h3>

          {schedule.description && (
            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] mt-1 line-clamp-2 leading-relaxed">
              {schedule.description}
            </p>
          )}
        </div>
      </div>

      {/* Rodapé com Ações Rápidas */}
      <div className="pt-4 mt-4 border-t border-[var(--dash-border)]/60 flex items-center justify-between gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--dash-text-secondary)] hover:text-[#8B1E22] dark:hover:text-[#FFA82A] transition-colors py-1.5"
        >
          <Navigation className="w-3.5 h-3.5 text-[#03637A] dark:text-[#41B8D5]" />
          <span>Como Chegar</span>
        </a>

        {communitySlug ? (
          <Link
            href={`/comunidades/${communitySlug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#8B1E22] dark:text-[#FFA82A] hover:underline py-1.5"
          >
            <span>Conhecer a CEB</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="text-[11px] text-[var(--dash-text-muted)] flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Colatina - ES
          </span>
        )}
      </div>
    </Card>
  );
}
