'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Bookmark,
  Calendar,
  Layers,
  Heart,
  ChevronRight,
  Radio,
  ScrollText
} from 'lucide-react';
import { Modal, Button, Badge } from '@/components/ui';
import {
  NormalizedLiturgicalData,
  getLiturgicalColorTheme,
  LiturgicalColorTheme,
} from '@/lib/liturgy';

const initialLiturgicalData: NormalizedLiturgicalData = {
  isLive: false,
  data: new Date().toLocaleDateString('pt-BR'),
  celebrationTitle: 'Tempo Comum • 27ª Semana da Vida da Igreja',
  colorName: 'Verde',
  dia: 'Deus eterno e todo-poderoso, que no vosso imenso amor de Pai nos concedeis mais do que merecemos e pedimos, infundi em nós vossa misericórdia.',
  primeiraLeitura: {
    referencia: 'Gl 3, 7-14',
    titulo: 'Leitura da Carta de São Paulo aos Gálatas',
    texto:
      'Irmãos: Ficai cientes que os que creem é que são verdadeiros filhos de Abraão. Pela fé recebemos a promessa do Espírito Santo em Cristo Jesus.',
  },
  salmo: {
    referencia: 'Sl 110(111)',
    refrao: 'O Senhor se lembra sempre da Aliança!',
    texto:
      '– Eu agradeço a Deus, de todo o coração, junto com todos os seus justos reunidos!\n– Que grandiosas são as obras do Senhor, elas merecem todo o amor e admiração!',
  },
  segundaLeitura: null,
  evangelho: {
    referencia: 'Lc 11, 15-26',
    titulo: 'Proclamação do Evangelho de Jesus Cristo segundo Lucas',
    texto:
      'Naquele tempo, Jesus estava expulsando um demônio. Se é pelo dedo de Deus que eu expulso os demônios, então chegou para vós o Reino de Deus.',
  },
};

export function LiturgicalBanner() {
  const [liturgy, setLiturgy] = useState<NormalizedLiturgicalData>(initialLiturgicalData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<LiturgicalColorTheme>(getLiturgicalColorTheme('Verde'));

  useEffect(() => {
    async function fetchLiturgy() {
      try {
        const res = await fetch('/api/liturgia');
        if (res.ok) {
          const data: NormalizedLiturgicalData = await res.json();
          setLiturgy(data);
          setTheme(getLiturgicalColorTheme(data.colorName));
        }
      } catch (err) {
        console.warn('Usando liturgia canônica de contingência local:', err);
      }
    }

    fetchLiturgy();
  }, []);

  const evangelhoSnippet = liturgy.evangelho?.texto
    ? liturgy.evangelho.texto.slice(0, 160) + '...'
    : '«Quem acolhe a Palavra de Deus em bom coração, produz frutos de vida eterna.»';

  return (
    <>
      {/* 1. Faixa Litúrgica Dinâmica com Identidade Cromática Canônica */}
      <section
        id="liturgia-diaria"
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 shadow-md ${theme.borderClass} ${theme.bgGradientClass} p-5 sm:p-6`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            {/* Badges de Tempo Litúrgico e Cor Canônica */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${theme.badgeClass}`}
              >
                <span className={`w-2 h-2 rounded-full ${theme.pulseClass} animate-pulse`} />
                <span>{theme.colorLabel}</span>
              </span>

              <span className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 opacity-70" />
                {liturgy.data}
              </span>

              {liturgy.isLive && (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  CNBB Oficial
                </span>
              )}
            </div>

            {/* Título da Celebração do Dia */}
            <h3 className="text-base sm:text-lg font-bold text-[var(--dash-text-primary)] leading-snug">
              {liturgy.celebrationTitle}
            </h3>

            {/* Trecho Breve do Evangelho do Dia */}
            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] italic border-l-2 border-amber-500/40 pl-3 leading-relaxed">
              &ldquo;{evangelhoSnippet}&rdquo;
            </p>
          </div>

          {/* Botão para Abrir Leituras Completas */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-xs transition-all cursor-pointer ${theme.buttonClass}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Leituras da Missa de Hoje</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Modal Completo com Todas as Leituras da Missa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Liturgia Diária Oficial (CNBB)"
        description={`${liturgy.celebrationTitle} • ${liturgy.data}`}
        maxWidth="lg"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 text-sm leading-relaxed text-[var(--dash-text-primary)]">
          {/* Oração da Coleta / Coleta do Dia */}
          {liturgy.dia && (
            <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Oração do Dia (Coleta)
              </span>
              <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed italic">
                {liturgy.dia}
              </p>
            </div>
          )}

          {/* 1ª Leitura */}
          {liturgy.primeiraLeitura && (
            <div className="space-y-2 p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${theme.accentClass}`}>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>1ª Leitura • {liturgy.primeiraLeitura.referencia}</span>
                </div>
                {liturgy.primeiraLeitura.titulo && (
                  <span className="text-[11px] font-semibold text-[var(--dash-text-secondary)]">
                    {liturgy.primeiraLeitura.titulo}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed whitespace-pre-line">
                {liturgy.primeiraLeitura.texto}
              </p>
              <p className="text-[11px] font-bold text-[var(--dash-text-primary)] mt-1">
                — Palavra do Senhor. Graças a Deus.
              </p>
            </div>
          )}

          {/* Salmo Responsorial */}
          {liturgy.salmo && (
            <div className="space-y-2 p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Salmo Responsorial • {liturgy.salmo.referencia}</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-xs sm:text-sm italic">
                — {liturgy.salmo.refrao}
              </div>
              <div className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed whitespace-pre-line pt-1">
                {liturgy.salmo.texto}
              </div>
            </div>
          )}

          {/* 2ª Leitura (se houver, especialmente nos domingos e solenidades) */}
          {liturgy.segundaLeitura && (
            <div className="space-y-2 p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${theme.accentClass}`}>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>2ª Leitura • {liturgy.segundaLeitura.referencia}</span>
                </div>
                {liturgy.segundaLeitura.titulo && (
                  <span className="text-[11px] font-semibold text-[var(--dash-text-secondary)]">
                    {liturgy.segundaLeitura.titulo}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed whitespace-pre-line">
                {liturgy.segundaLeitura.texto}
              </p>
              <p className="text-[11px] font-bold text-[var(--dash-text-primary)] mt-1">
                — Palavra do Senhor. Graças a Deus.
              </p>
            </div>
          )}

          {/* Santo Evangelho */}
          {liturgy.evangelho && (
            <div
              className={`space-y-2.5 p-4 rounded-xl border ${theme.borderClass} ${theme.bgGradientClass}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${theme.accentClass}`}>
                  <BookOpen className="w-4 h-4" />
                  <span>Santo Evangelho • {liturgy.evangelho.referencia}</span>
                </div>
                {liturgy.evangelho.titulo && (
                  <span className="text-[11px] font-bold text-[var(--dash-text-primary)]">
                    {liturgy.evangelho.titulo}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[var(--dash-text-primary)] leading-relaxed whitespace-pre-line font-normal">
                {liturgy.evangelho.texto}
              </p>
              <p className={`text-xs font-bold mt-2 ${theme.accentClass}`}>
                — Palavra da Salvação. Glória a vós, Senhor.
              </p>
            </div>
          )}

          {/* Antífonas da Celebração */}
          {liturgy.antifonas && (liturgy.antifonas.entrada || liturgy.antifonas.comunhao) && (
            <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)]/50 border border-[var(--dash-border)] space-y-2 text-xs text-[var(--dash-text-secondary)]">
              {liturgy.antifonas.entrada && (
                <p>
                  <strong className="text-[var(--dash-text-primary)]">Antífona de Entrada:</strong>{' '}
                  {liturgy.antifonas.entrada}
                </p>
              )}
              {liturgy.antifonas.comunhao && (
                <p>
                  <strong className="text-[var(--dash-text-primary)]">Antífona da Comunhão:</strong>{' '}
                  {liturgy.antifonas.comunhao}
                </p>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
