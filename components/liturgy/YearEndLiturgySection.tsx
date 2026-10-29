'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Share2,
  Check,
  ChevronRight,
  Church,
  Star,
  Users,
  MessageCircle,
  Flame
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import {
  YEAR_END_CATEGORIES,
  YEAR_END_EVENTS,
  YearEndEvent
} from '@/lib/year-end-liturgy';

export function YearEndLiturgySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterHeadquarters, setFilterHeadquarters] = useState<'all' | 'matriz' | 'cebs'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return YEAR_END_EVENTS.filter((ev) => {
      // Filtro de categoria
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false;
      }
      // Filtro de localidade
      if (filterHeadquarters === 'matriz' && !ev.isHeadquarters) {
        return false;
      }
      if (filterHeadquarters === 'cebs' && ev.isHeadquarters) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, filterHeadquarters]);

  const handleShareWhatsApp = (ev: YearEndEvent) => {
    const text = encodeURIComponent(
      `✨ *Celebrações de Fim de Ano • Catedral de Colatina*\n\n` +
      `🕊️ *${ev.title}*\n` +
      `📅 *Data:* ${ev.dateLabel}\n` +
      `⏰ *Horário:* ${ev.time}\n` +
      `📍 *Local:* ${ev.location}\n` +
      (ev.celebrant ? `👤 *Presidência:* ${ev.celebrant}\n` : '') +
      `\nConvide sua família e venha celebrar conosco! Saiba mais em: https://catedraldecolatina.org.br`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopy = (ev: YearEndEvent) => {
    const text = `${ev.title} • ${ev.dateLabel} às ${ev.time} na ${ev.location}`;
    navigator.clipboard.writeText(text);
    setCopiedId(ev.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="programacao-fim-de-ano" className="space-y-8 scroll-mt-24">
      {/* Banner Monumental Noturno de Natal com Inspiração Solene */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1614] via-[#2A1D1A] to-[#120E0D] text-white p-6 sm:p-10 border border-[#C8A463]/30 shadow-xl">
        <img
          src="/images/historia/catedral-vitrais.jpg"
          alt="Vitrais da Catedral"
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1614]/95 via-[#2A1D1A]/90 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B1E22]/60 border border-[#C8A463]/50 text-[#FFCC36] text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FFA82A]" />
            <span>Tempo do Advento & Solenidade do Natal</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-tight uppercase text-white leading-tight">
            Programação Especial de <span className="text-[#FFA82A]">Natal & Fim de Ano</span>
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#EAE3D9] leading-relaxed">
            <em>«O povo que andava nas trevas viu uma grande luz (Is 9, 1)».</em> Participe com sua família dos momentos centrais da nossa fé: a Novena de Natal, a Solene Missa da Vigília (Missa do Galo), o Dia da Natividade e a Ação de Graças de Ano Novo na Catedral Diocesana e nas 12 Comunidades.
          </p>

          {/* Filtros de Categoria em Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {YEAR_END_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[40px] cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#FFA82A] text-[#2D1A16] shadow-sm font-bold'
                    : 'bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/15 text-[#EAE3D9] border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Barra de Filtro de Localidade (Matriz vs CEBs) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--dash-surface)] p-3 sm:p-4 rounded-2xl border border-[var(--dash-border)] shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider">
          <Church className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A]" />
          <span>Localização das Celebrações:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[var(--dash-bg)] p-1 rounded-xl border border-[var(--dash-border)]">
          <button
            onClick={() => setFilterHeadquarters('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
              filterHeadquarters === 'all'
                ? 'bg-[#8B1E22] text-white shadow-2xs'
                : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            Todas ({YEAR_END_EVENTS.length})
          </button>
          <button
            onClick={() => setFilterHeadquarters('matriz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
              filterHeadquarters === 'matriz'
                ? 'bg-[#8B1E22] text-white shadow-2xs'
                : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            Catedral Diocesana
          </button>
          <button
            onClick={() => setFilterHeadquarters('cebs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
              filterHeadquarters === 'cebs'
                ? 'bg-[#8B1E22] text-white shadow-2xs'
                : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            12 CEBs
          </button>
        </div>
      </div>

      {/* Grade de Cards de Celebrações de Natal e Fim de Ano */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map((ev) => (
          <Card
            key={ev.id}
            className={`rounded-2xl border transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${
              ev.isHighlight
                ? 'bg-[var(--dash-surface)] border-[#FFA82A] ring-2 ring-[#FFA82A]/30'
                : 'bg-[var(--dash-surface)] border-[var(--dash-border)] hover:border-[#8B1E22]/40'
            }`}
          >
            <div className="space-y-3">
              {/* Badges do Evento */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      ev.isHighlight
                        ? 'bg-[#FFA82A]/20 text-amber-700 dark:text-[#FFA82A] border border-[#FFA82A]/40'
                        : 'bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] border border-[#8B1E22]/20'
                    }`}
                  >
                    {ev.isHighlight && <Star className="w-3 h-3 fill-current" />}
                    {ev.categoryLabel}
                  </span>
                  {ev.isHeadquarters ? (
                    <Badge variant="matriz" className="text-[11px]">Catedral Matriz</Badge>
                  ) : (
                    <Badge variant="ceb" className="text-[11px]">CEB / Comunidade</Badge>
                  )}
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-bold text-[#8B1E22] dark:text-[#FFA82A] bg-[var(--dash-bg)] px-2.5 py-1 rounded-lg border border-[var(--dash-border)] shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{ev.time}</span>
                </div>
              </div>

              {/* Título da Celebração */}
              <div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--dash-text-primary)] leading-snug">
                  {ev.title}
                </h3>
                <p className="text-xs font-semibold text-[#8B1E22] dark:text-[#FFA82A] flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{ev.dateLabel}</span>
                </p>
              </div>

              {/* Local & Presidência */}
              <div className="space-y-1 bg-[var(--dash-bg)]/60 p-3 rounded-xl border border-[var(--dash-border)] text-xs text-[var(--dash-text-secondary)]">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8B1E22] dark:text-[#FFA82A] shrink-0 mt-0.5" />
                  <span className="font-medium text-[var(--dash-text-primary)]">{ev.location}</span>
                </div>
                {ev.celebrant && (
                  <div className="flex items-start gap-1.5 text-[11px] text-[var(--dash-text-muted)] pt-0.5">
                    <Users className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Presidência: {ev.celebrant}</span>
                  </div>
                )}
              </div>

              {/* Descrição Pastoral */}
              <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
                {ev.description}
              </p>
            </div>

            {/* Ações: Compartilhar no WhatsApp & Copiar */}
            <div className="pt-3 border-t border-[var(--dash-border)] flex items-center justify-between gap-2">
              <button
                onClick={() => handleShareWhatsApp(ev)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-2xs min-h-[44px] cursor-pointer"
                title="Compartilhar horário no WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Convidar Família</span>
              </button>

              <button
                onClick={() => handleCopy(ev)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[var(--dash-surface)] hover:bg-[var(--dash-bg)] border border-[var(--dash-border)] text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-all min-h-[44px] cursor-pointer"
                title="Copiar informações"
                aria-label="Copiar detalhes da celebração"
              >
                {copiedId === ev.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 font-semibold">Copiado</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Chamada para a Agenda Litúrgica Completa */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h4 className="font-cinzel text-sm sm:text-base font-bold text-[var(--dash-text-primary)]">
            Deseja consultar a escala regular de todo o ano?
          </h4>
          <p className="text-xs text-[var(--dash-text-muted)]">
            Acesse a grade perpétua de missas, confissões e adoração ao Santíssimo.
          </p>
        </div>
        <Link
          href="/agenda-liturgica"
          className="inline-flex items-center justify-center gap-1 text-xs font-bold bg-[#8B1E22] hover:bg-[#721C24] text-white px-4 py-2.5 rounded-xl transition-colors shadow-2xs min-h-[44px] shrink-0"
        >
          <span>Ver Agenda Litúrgica Completa</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
