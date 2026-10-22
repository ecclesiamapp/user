'use client';

import React from 'react';
import { Type, Sparkles, MessageSquareQuote, RotateCcw } from 'lucide-react';
import { BrandFonts } from '@/lib/brand';

interface BrandTypographyEditorProps {
  fonts: BrandFonts;
  tagline?: string;
  onChangeFonts: (fonts: BrandFonts) => void;
  onChangeTagline: (tagline: string) => void;
  onResetFonts?: () => void;
}

const HEADING_FONT_OPTIONS = [
  { value: 'Sora', label: 'Sora (Romana Moderna, Solene)' },
  { value: 'Cinzel', label: 'Cinzel (Clássica Imperial Romana)' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond (Serifada Mariana Elegante)' },
  { value: 'EB Garamond', label: 'EB Garamond (Eclesial Histórica)' },
  { value: 'Playfair Display', label: 'Playfair Display (Nobiliarquia Litúrgica)' },
];

const BODY_FONT_OPTIONS = [
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Ultra Legível para Idosos)' },
  { value: 'Inter', label: 'Inter (Neutra, Alta Clareza)' },
  { value: 'Roboto', label: 'Roboto (Padrão Android/Web)' },
  { value: 'Open Sans', label: 'Open Sans (Humanista Acolhedora)' },
];

export function BrandTypographyEditor({
  fonts,
  tagline = '',
  onChangeFonts,
  onChangeTagline,
  onResetFonts,
}: BrandTypographyEditorProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dash-text-primary)] flex items-center gap-2">
            <Type className="w-4 h-4 text-[#FFA82A]" />
            <span>Tipografia Eclesial & Lema Pastoral</span>
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Fontes oficiais homologadas com numerais tabulares para leitura confortável de horários de missas.
          </p>
        </div>

        {onResetFonts && (
          <button
            type="button"
            onClick={onResetFonts}
            className="self-start sm:self-auto text-xs text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)] transition-all cursor-pointer"
            title="Restaurar fontes oficiais do Ecclesiam App (Sora + Plus Jakarta Sans)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FFA82A]" />
            <span>Restaurar Fontes Oficiais</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Seletor Fonte de Títulos */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[var(--dash-text-primary)]">
            Fonte de Títulos & Cabeçalho (Heading)
          </label>
          <select
            value={fonts.heading}
            onChange={(e) => onChangeFonts({ ...fonts, heading: e.target.value })}
            className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-hover)]/40 text-xs font-semibold pl-3.5 pr-10 py-2.5 text-[var(--dash-text-primary)] focus:outline-none focus:border-[#FFA82A]"
          >
            {HEADING_FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-[var(--dash-text-muted)]">
            Aplicada em títulos solenes, nome da paróquia e saudações episcopais.
          </p>
        </div>

        {/* Seletor Fonte de Corpo */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[var(--dash-text-primary)]">
            Fonte de Corpo & Leituras (Body)
          </label>
          <select
            value={fonts.body}
            onChange={(e) => onChangeFonts({ ...fonts, body: e.target.value })}
            className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-hover)]/40 text-xs font-semibold pl-3.5 pr-10 py-2.5 text-[var(--dash-text-primary)] focus:outline-none focus:border-[#FFA82A]"
          >
            {BODY_FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-[var(--dash-text-muted)]">
            Garante máxima legibilidade em notícias, folhetos e tabelas de horários.
          </p>
        </div>
      </div>

      {/* Frase / Lema Pastoral */}
      <div className="space-y-1.5 pt-2 border-t border-[var(--dash-border)]/60">
        <label className="block text-xs font-bold text-[var(--dash-text-primary)] flex items-center gap-1.5">
          <MessageSquareQuote className="w-3.5 h-3.5 text-[#FFA82A]" />
          <span>Lema / Frase Pastoral da Paróquia</span>
        </label>
        <input
          type="text"
          value={tagline}
          placeholder="Ex: Um coração ardente de amor no centro da Diocese"
          onChange={(e) => onChangeTagline(e.target.value)}
          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-hover)]/40 text-[var(--dash-text-primary)] focus:outline-none focus:border-[#FFA82A]"
        />
        <p className="text-[10px] text-[var(--dash-text-muted)]">
          Frase exibida sutilmente no topo e no rodapé oficial do portal.
        </p>
      </div>
    </div>
  );
}
