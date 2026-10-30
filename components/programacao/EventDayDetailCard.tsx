'use client';

import React from 'react';
import {
  Clock,
  MapPin,
  User,
  Users,
  HeartHandshake,
  PartyPopper,
} from 'lucide-react';
import { ParishEventDay } from '@/types';
import { ResolvedEventTheme } from '@/lib/events';

interface EventDayDetailCardProps {
  activeDay: ParishEventDay;
  activeDayIndex: number;
  totalDays: number;
  eventTheme: ResolvedEventTheme;
}

export function EventDayDetailCard({
  activeDay,
  activeDayIndex,
  totalDays,
  eventTheme,
}: EventDayDetailCardProps) {
  const getLiturgicalBadge = (color?: string) => {
    switch (color) {
      case 'vermelho':
        return { label: 'Vermelho Solene', dot: 'bg-rose-600' };
      case 'verde':
        return { label: 'Verde (Tempo Comum)', dot: 'bg-emerald-600' };
      case 'roxo':
        return { label: 'Roxo (Penitencial)', dot: 'bg-purple-600' };
      case 'rosa':
        return { label: 'Rosa (Alegria)', dot: 'bg-pink-600' };
      case 'branco':
      default:
        return { label: 'Branco / Dourado', dot: 'bg-amber-500' };
    }
  };

  const liturgicalBadge = getLiturgicalBadge(activeDay.liturgical_color);

  return (
    <div
      className="rounded-3xl border overflow-hidden animate-in fade-in duration-300"
      style={{
        backgroundColor: eventTheme.cardBg,
        borderColor: eventTheme.cardBorder,
        boxShadow: `0 18px 42px -12px ${eventTheme.primary}18`,
      }}
    >
      {/* Topo do Card do Dia sobre Fundo Branco/Alabastro */}
      <div
        className="p-5 sm:p-7 border-b"
        style={{
          borderColor: eventTheme.cardBorder,
          background: `linear-gradient(90deg, ${eventTheme.cardSubtleBg} 0%, ${eventTheme.cardBg} 55%, ${eventTheme.cardHighlightBg} 100%)`,
        }}
      >
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider border"
              style={{
                backgroundColor: eventTheme.cardHighlightBg,
                color: eventTheme.accentOnLight,
                borderColor: eventTheme.cardHighlightBorder,
              }}
            >
              <span className={`w-2 h-2 rounded-full ${liturgicalBadge.dot} shrink-0`} />
              <span>Cor: {liturgicalBadge.label}</span>
            </span>
            <span
              className="text-xs font-semibold font-mono"
              style={{ color: eventTheme.bodyTextMuted }}
            >
              Dia {activeDayIndex + 1} de {totalDays}
            </span>
          </div>

          <h3
            className="font-cinzel text-lg sm:text-2xl font-bold leading-tight"
            style={{ color: eventTheme.bodyTextPrimary }}
          >
            {activeDay.day_title}
          </h3>

          {activeDay.day_subtitle && (
            <p
              className="text-xs sm:text-sm italic"
              style={{ color: eventTheme.bodyTextSecondary }}
            >
              {activeDay.day_subtitle}
            </p>
          )}
        </div>

        {/* Painel de Celebrante, Pastoral e Gesto de Caridade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
          {activeDay.celebrant_name && (
            <div
              className="p-3.5 rounded-2xl border flex items-start gap-3"
              style={{
                backgroundColor: eventTheme.cardBg,
                borderColor: eventTheme.cardBorder,
              }}
            >
              <div
                className="p-2 rounded-xl shrink-0"
                style={{
                  backgroundColor: `${eventTheme.primary}14`,
                  color: eventTheme.primary,
                }}
              >
                <User className="w-4 h-4" />
              </div>
              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider block"
                  style={{ color: eventTheme.bodyTextMuted }}
                >
                  Sacerdote Celebrante
                </span>
                <span
                  className="text-xs sm:text-sm font-bold block mt-0.5"
                  style={{ color: eventTheme.bodyTextPrimary }}
                >
                  {activeDay.celebrant_name}
                </span>
              </div>
            </div>
          )}

          {activeDay.responsible_group && (
            <div
              className="p-3.5 rounded-2xl border flex items-start gap-3"
              style={{
                backgroundColor: eventTheme.cardBg,
                borderColor: eventTheme.cardBorder,
              }}
            >
              <div
                className="p-2 rounded-xl shrink-0"
                style={{
                  backgroundColor: `${eventTheme.primary}14`,
                  color: eventTheme.primary,
                }}
              >
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider block"
                  style={{ color: eventTheme.bodyTextMuted }}
                >
                  Liturgia & Acolhida
                </span>
                <span
                  className="text-xs sm:text-sm font-semibold block mt-0.5"
                  style={{ color: eventTheme.bodyTextPrimary }}
                >
                  {activeDay.responsible_group}
                </span>
              </div>
            </div>
          )}

          {activeDay.gesture_of_charity && (
            <div
              className="p-3.5 rounded-2xl border flex items-start gap-3"
              style={{
                backgroundColor: eventTheme.cardHighlightBg,
                borderColor: eventTheme.cardHighlightBorder,
              }}
            >
              <div
                className="p-2 rounded-xl shrink-0"
                style={{
                  backgroundColor: `${eventTheme.secondary}45`,
                  color: eventTheme.accentOnLight,
                }}
              >
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider block"
                  style={{ color: eventTheme.accentOnLight }}
                >
                  Gesto Concreto / Caridade
                </span>
                <span
                  className="text-xs sm:text-sm font-semibold block mt-0.5"
                  style={{ color: eventTheme.bodyTextPrimary }}
                >
                  {activeDay.gesture_of_charity}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grade Horária do Dia */}
      <div className="p-5 sm:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: eventTheme.primary }} />
          <h4
            className="text-xs sm:text-sm font-bold uppercase tracking-wider"
            style={{ color: eventTheme.bodyTextPrimary }}
          >
            Horários das Santas Missas & Celebrações
          </h4>
        </div>

        {activeDay.schedule_items && activeDay.schedule_items.length > 0 ? (
          <div className="space-y-3">
            {activeDay.schedule_items.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{
                  backgroundColor: eventTheme.cardSubtleBg,
                  borderColor: eventTheme.cardBorder,
                }}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className="px-3 py-1.5 rounded-xl font-mono text-sm sm:text-base font-extrabold shrink-0 border shadow-xs"
                    style={{
                      backgroundColor: eventTheme.primary,
                      color: eventTheme.accent,
                      borderColor: `${eventTheme.primary}`,
                    }}
                  >
                    {item.time}
                  </div>

                  <div className="space-y-0.5">
                    <h5
                      className="font-bold text-sm sm:text-base"
                      style={{ color: eventTheme.bodyTextPrimary }}
                    >
                      {item.title}
                    </h5>

                    <div
                      className="flex flex-wrap items-center gap-3 text-xs"
                      style={{ color: eventTheme.bodyTextSecondary }}
                    >
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: eventTheme.primary }}
                          />
                          <span>{item.location}</span>
                        </span>
                      )}

                      {item.celebrant && (
                        <span
                          className="flex items-center gap-1"
                          style={{ color: eventTheme.bodyTextMuted }}
                        >
                          <User
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: eventTheme.accentOnLight }}
                          />
                          <span>{item.celebrant}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs italic" style={{ color: eventTheme.bodyTextMuted }}>
            Nenhum horário específico cadastrado para este dia.
          </p>
        )}

        {/* Quermesse e Atrações Sociais do Dia */}
        {activeDay.social_attractions && (
          <div
            className="mt-6 p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5"
            style={{
              backgroundColor: eventTheme.cardHighlightBg,
              borderColor: eventTheme.cardHighlightBorder,
            }}
          >
            <div
              className="p-2.5 rounded-xl shrink-0"
              style={{
                backgroundColor: `${eventTheme.secondary}45`,
                color: eventTheme.accentOnLight,
              }}
            >
              <PartyPopper className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5
                className="text-xs sm:text-sm font-bold flex items-center gap-1.5"
                style={{ color: eventTheme.accentOnLight }}
              >
                <span>Quermesse & Atrações Sociais da Noite</span>
              </h5>
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: eventTheme.bodyTextSecondary }}
              >
                {activeDay.social_attractions}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
