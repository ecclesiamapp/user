'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  Smartphone, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CalendarDays,
  Star
} from 'lucide-react';
import { ParishSpecialEvent } from '@/types';
import { getEventTypeBadge, getStatusBadge } from './eventConstants';

interface EventCardProps {
  event: ParishSpecialEvent;
  onEdit: (event: ParishSpecialEvent) => void;
  onManageSchedule: (event: ParishSpecialEvent) => void;
  onPreview: (event: ParishSpecialEvent) => void;
  onDelete: (event: ParishSpecialEvent) => void;
}

export function EventCard({
  event,
  onEdit,
  onManageSchedule,
  onPreview,
  onDelete,
}: EventCardProps) {
  const typeBadge = getEventTypeBadge(event.event_type);
  const statusBadge = getStatusBadge(event.status);

  // Formatação de datas amigável
  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const daysCount = event.days?.length ?? 0;

  return (
    <div className="group rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[#FFA82A]/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden">
      {/* Banner Superior ou Fallback */}
      <div className="relative h-44 w-full bg-gradient-to-br from-[#1C1F24] via-[#141619] to-[#0D0E10] border-b border-[var(--dash-border)] overflow-hidden">
        {event.banner_url ? (
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#8B1E22]/20 border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] mb-2 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-[var(--dash-text-muted)]">
              Cartaz não enviado
            </span>
          </div>
        )}

        {/* Gradiente de sobreposição para contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Badges Flutuantes Superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${typeBadge.bg}`}>
            {typeBadge.label}
          </span>

          <div className="flex items-center gap-1.5">
            {event.is_featured_home && (
              <span 
                title="Em destaque com contagem regressiva na Home" 
                className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md flex items-center justify-center"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border backdrop-blur-md flex items-center gap-1.5 ${statusBadge.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
              <span>{statusBadge.label}</span>
            </span>
          </div>
        </div>

        {/* Informações Sobrepostas no Banner */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-200/90 drop-shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#FFCC36]" />
            <span>
              {formatDateBR(event.start_date)}
              {event.end_date && event.end_date !== event.start_date
                ? ` a ${formatDateBR(event.end_date)}`
                : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Corpo do Card */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Local / Comunidade */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--dash-text-muted)]">
            <MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
            <span className="truncate font-medium">
              {event.community_name || 'Catedral Sagrado Coração de Jesus (Sede)'}
            </span>
          </div>

          {/* Título Principal */}
          <h3 className="font-bold text-base sm:text-lg text-[var(--dash-text-primary)] leading-tight group-hover:text-[#FFA82A] transition-colors line-clamp-1">
            {event.title}
          </h3>

          {/* Tema e Lema */}
          {event.theme && (
            <p className="text-xs text-[var(--dash-text-secondary)] line-clamp-2 italic">
              &ldquo;{event.theme}&rdquo;
            </p>
          )}

          {event.motto && (
            <p className="text-[11px] text-[var(--dash-text-muted)] font-mono line-clamp-1">
              Lema: {event.motto}
            </p>
          )}
        </div>

        {/* Resumo de Programação Cadastrada */}
        <div className="pt-3 border-t border-[var(--dash-border)] flex items-center justify-between text-xs text-[var(--dash-text-secondary)]">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#FFA82A]" />
            <span className="font-semibold">
              {daysCount === 0 ? 'Nenhum dia cadastrado' : `${daysCount} ${daysCount === 1 ? 'dia na grade' : 'dias na grade'}`}
            </span>
          </div>

          <span className="text-[11px] text-[var(--dash-text-muted)] font-mono">
            /programacao/{event.slug}
          </span>
        </div>

        {/* Barra de Ações Rápidas */}
        <div className="pt-2 space-y-2">
          {/* Botão Primário: Construtor Dia a Dia */}
          <button
            type="button"
            onClick={() => onManageSchedule(event)}
            className="w-full py-2.5 px-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer min-h-[42px]"
          >
            <CalendarDays className="w-4 h-4 text-amber-200" />
            <span>Gerenciar Programação Dia a Dia</span>
          </button>

          {/* Botões Secundários */}
          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => onPreview(event)}
              title="Visualizar em moldura mobile (Live Preview)"
              className="p-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-primary)] hover:text-[#FFA82A] transition-colors flex items-center justify-center min-h-[38px] cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onEdit(event)}
              title="Editar dados gerais da festividade"
              className="p-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-primary)] hover:text-[#FFA82A] transition-colors flex items-center justify-center min-h-[38px] cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <Link
              href={`/programacao/${event.slug}`}
              target="_blank"
              title="Abrir página pública no portal"
              className="p-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-primary)] hover:text-[#FFA82A] transition-colors flex items-center justify-center min-h-[38px]"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => onDelete(event)}
              title="Excluir evento"
              className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-400 transition-colors flex items-center justify-center min-h-[38px] cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
