'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Smartphone, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  HeartHandshake, 
  PartyPopper, 
  User, 
  Users, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ParishSpecialEvent, ParishEventDay } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { getEventTypeBadge } from './eventConstants';
import { getEventTheme } from '@/lib/events';

interface EventMobilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ParishSpecialEvent | null;
}

export function EventMobilePreviewModal({
  isOpen,
  onClose,
  event,
}: EventMobilePreviewModalProps) {
  const [days, setDays] = useState<ParishEventDay[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [loadingDays, setLoadingDays] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (!isOpen || !event) return;

    async function fetchDays() {
      setLoadingDays(true);
      try {
        const { data } = await supabase
          .from('parish_event_days')
          .select('*')
          .eq('event_id', event!.id)
          .order('order_index', { ascending: true })
          .order('event_date', { ascending: true });

        const loaded = (data as ParishEventDay[]) || [];
        setDays(loaded);
        setActiveDayIndex(0);
      } catch (err) {
        console.error('Erro ao buscar dias para prévia:', err);
      } finally {
        setLoadingDays(false);
      }
    }

    fetchDays();
  }, [isOpen, event]);

  if (!isOpen || !event) return null;
  const activeDay = days[activeDayIndex];
  const typeBadge = getEventTypeBadge(event.event_type);
  const eventTheme = getEventTheme(event);

  const formatDateShort = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return dateStr;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-3xl shadow-2xl p-4 sm:p-6 text-[var(--dash-text-primary)] my-6 flex flex-col items-center">
        {/* Topo do Modal de Prévia */}
        <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[var(--dash-border)]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#8B1E22]/15 text-[#FFCC36] border border-[#C8A463]/30">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--dash-text-primary)]">
                Simulador Live Preview Mobile
              </h3>
              <p className="text-[11px] text-[var(--dash-text-secondary)]">
                Visualização fiel da tela do smartphone de um paroquiano
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/programacao/${event.slug}`}
              target="_blank"
              className="p-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)] hover:text-white transition-colors"
              title="Abrir página no navegador"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-white hover:bg-[var(--dash-surface-hover)] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Moldura do Smartphone (Mock 360-390px) */}
        <div className="w-full max-w-[375px] rounded-2xl border-4 border-slate-700 bg-[#0F1115] shadow-2xl overflow-hidden flex flex-col relative select-none">
          {/* Dynamic Island / Notch Fake */}
          <div className="w-full h-6 bg-black flex items-center justify-center shrink-0">
            <div className="w-24 h-3.5 bg-zinc-900 rounded-full" />
          </div>

          {/* Conteúdo com Scroll Interno do Celular */}
          <div className="h-[540px] overflow-y-auto text-white divide-y divide-white/10 text-xs">
            {/* Banner da Festa */}
            <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
              {event.banner_url ? (
                <img
                  src={event.banner_url}
                  alt={event.title}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  <Sparkles className="w-8 h-8 text-[#FFCC36] mb-1" />
                  <span className="text-[10px] text-zinc-400">Cartaz Oficial</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border backdrop-blur-md ${typeBadge.bg}`}>
                  {typeBadge.label}
                </span>
              </div>

              <div className="absolute bottom-2 left-3 right-3">
                <h4 className="text-sm font-extrabold text-white leading-tight drop-shadow-md">
                  {event.title}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-amber-300 font-medium mt-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatDateShort(event.start_date)} a {formatDateShort(event.end_date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tema e Mensagem com Degradê Temático */}
            <div 
              className="p-3 space-y-1.5 border-b border-white/5"
              style={{
                background: `linear-gradient(180deg, ${eventTheme.primary}44 0%, #16181D 100%)`
              }}
            >
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <MapPin className="w-3 h-3 text-[#FFA82A]" />
                <span className="truncate">{event.community_name || 'Catedral Sagrado Coração'}</span>
              </div>

              {event.theme && (
                <p className="text-[11px] text-amber-100 italic">
                  &ldquo;{event.theme}&rdquo;
                </p>
              )}

              {/* Botão de Ação Rápida WhatsApp com Cor do Tema */}
              <div className="pt-1">
                <div 
                  className="w-full py-2 px-3 rounded-xl text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm border border-white/10"
                  style={{
                    background: `linear-gradient(135deg, ${eventTheme.primary}, ${eventTheme.secondary})`
                  }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar no WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Seletor de Abas de Dias */}
            <div className="bg-[#121418] p-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#C8A463] block mb-1.5 px-1">
                Escolha o Dia da Festa:
              </span>

              {days.length === 0 ? (
                <div className="p-3 text-center text-zinc-500 text-[10px]">
                  Nenhum dia cadastrado ainda.
                </div>
              ) : (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {days.map((d, idx) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setActiveDayIndex(idx)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                        activeDayIndex === idx
                          ? 'shadow-xs border'
                          : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                      }`}
                      style={
                        activeDayIndex === idx
                          ? {
                              backgroundColor: eventTheme.primary,
                              color: eventTheme.accent,
                              borderColor: eventTheme.secondary,
                            }
                          : undefined
                      }
                    >
                      Dia {idx + 1} ({formatDateShort(d.event_date)})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Detalhes do Dia Selecionado */}
            {activeDay ? (
              <div className="p-3 bg-[#14161C] space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">
                    Programação de {formatDateShort(activeDay.event_date)}
                  </span>
                  <h5 className="text-xs font-bold text-white">
                    {activeDay.day_title}
                  </h5>
                  {activeDay.day_subtitle && (
                    <p className="text-[10px] text-zinc-400">
                      {activeDay.day_subtitle}
                    </p>
                  )}
                </div>

                {/* Celebrante & Pastoral */}
                <div className="space-y-1 text-[10px] bg-zinc-900/60 p-2.5 rounded-xl border border-white/5">
                  {activeDay.celebrant_name && (
                    <div className="flex items-center gap-1.5 text-amber-200">
                      <User className="w-3 h-3 text-[#FFA82A] shrink-0" />
                      <span className="font-semibold">{activeDay.celebrant_name}</span>
                    </div>
                  )}

                  {activeDay.responsible_group && (
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Users className="w-3 h-3 text-rose-400 shrink-0" />
                      <span>{activeDay.responsible_group}</span>
                    </div>
                  )}
                </div>

                {/* Gesto de Caridade */}
                {activeDay.gesture_of_charity && (
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-[10px] flex items-center gap-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <div>
                      <strong className="block text-[9px] uppercase tracking-wider text-rose-400 font-bold">
                        Gesto Concreto:
                      </strong>
                      <span>{activeDay.gesture_of_charity}</span>
                    </div>
                  </div>
                )}

                {/* Grade Horária */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Grade de Celebrações:
                  </span>
                  {activeDay.schedule_items && activeDay.schedule_items.length > 0 ? (
                    activeDay.schedule_items.map((item, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-zinc-900/90 border border-white/5 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded-md bg-[#FFA82A]/20 text-[#FFCC36] text-[10px] font-mono font-bold">
                            {item.time}
                          </span>
                          <div>
                            <span className="font-bold text-[11px] text-white block">
                              {item.title}
                            </span>
                            {item.location && (
                              <span className="text-[9px] text-zinc-400 flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" />
                                {item.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-zinc-500 italic">
                      Nenhum horário cadastrado para este dia.
                    </p>
                  )}
                </div>

                {/* Atrações Sociais */}
                {activeDay.social_attractions && (
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[10px] flex items-center gap-2">
                    <PartyPopper className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <div>
                      <strong className="block text-[9px] uppercase tracking-wider text-amber-400 font-bold">
                        Quermesse & Festividades:
                      </strong>
                      <span>{activeDay.social_attractions}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Barra Inferior Fake do Smartphone */}
          <div className="w-full h-5 bg-black flex items-center justify-center shrink-0">
            <div className="w-28 h-1 bg-zinc-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
