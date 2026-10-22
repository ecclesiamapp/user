'use client';

import React from 'react';
import { Pipette, RotateCcw, Info } from 'lucide-react';
import { BrandColors } from '@/lib/brand';

interface BrandColorPaletteEditorProps {
  colors: BrandColors;
  onChangeColor: (key: keyof BrandColors, value: string) => void;
  onResetColors?: () => void;
}

interface ColorFieldMeta {
  key: keyof BrandColors;
  label: string;
  usageDescription: string;
  examplePlacement: string;
}

const COLOR_FIELDS: ColorFieldMeta[] = [
  {
    key: 'primary',
    label: 'Cor Primária Institucional',
    usageDescription: 'Cor principal do brasão, cabeçalho, barra de destaque e botões nobres.',
    examplePlacement: 'Header, botões primários e títulos solenes',
  },
  {
    key: 'secondary',
    label: 'Cor Secundária (Ouro Sacro)',
    usageDescription: 'Acentos litúrgicos, badges sacramentais, ícones dourados e linhas de separação.',
    examplePlacement: 'Badges de solenidades e ícones de destaque',
  },
  {
    key: 'background',
    label: 'Fundo Base (Pergaminho / Marfim)',
    usageDescription: 'Fundo geral das páginas. Elimina a frieza do branco estéril com calor eclesial.',
    examplePlacement: 'Fundo geral do portal e páginas públicas',
  },
  {
    key: 'surface',
    label: 'Superfície Elevada (Cards)',
    usageDescription: 'Cor de fundo dos cartões de horários de missas, avisos e formulários.',
    examplePlacement: 'Cards de missas de hoje e caixas de avisos',
  },
  {
    key: 'text_primary',
    label: 'Texto Principal (Alto Contraste)',
    usageDescription: 'Tipografia com legibilidade máxima testada para paroquianos idosos.',
    examplePlacement: 'Títulos de leituras e parágrafos principais',
  },
  {
    key: 'action_pix',
    label: 'Cor de Ação / PIX Dízimo',
    usageDescription: 'Botão de contribuição espontânea do dízimo e canais de atendimento WhatsApp.',
    examplePlacement: 'Botão flutuante do PIX e chave de doação',
  },
];

export function BrandColorPaletteEditor({
  colors,
  onChangeColor,
  onResetColors,
}: BrandColorPaletteEditorProps) {
  const handleHexInput = (key: keyof BrandColors, rawValue: string) => {
    let clean = rawValue.trim();
    if (!clean.startsWith('#') && clean.length > 0) {
      clean = `#${clean}`;
    }
    onChangeColor(key, clean.toUpperCase());
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dash-text-primary)] flex items-center gap-2">
            <Pipette className="w-4 h-4 text-[#FFA82A]" />
            <span>Paleta Cromática Eclesial (6 Cores)</span>
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Personalize cada tom do portal do fiel. Clique no quadrado colorido para abrir o seletor ou cole o código hexadecimal.
          </p>
        </div>

        {onResetColors && (
          <button
            type="button"
            onClick={onResetColors}
            className="self-start sm:self-auto text-xs text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FFA82A]" />
            <span>Restaurar Cores do App</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {COLOR_FIELDS.map((field) => {
          const currentColor = colors[field.key] || '#000000';

          return (
            <div
              key={field.key}
              className="p-3.5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--dash-border-hover)] transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[var(--dash-text-primary)] truncate">
                  {field.label}
                </span>
                <span className="text-[10px] text-[var(--dash-text-muted)] font-mono">
                  {currentColor}
                </span>
              </div>

              {/* Controles de Cor: Color Picker + Input Hex */}
              <div className="flex items-center gap-2.5">
                <label className="relative shrink-0 w-11 h-11 rounded-xl overflow-hidden border border-[var(--dash-border)] shadow-xs cursor-pointer group">
                  <span
                    className="absolute inset-0 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: currentColor }}
                  />
                  <input
                    type="color"
                    value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#000000'}
                    onChange={(e) => onChangeColor(field.key, e.target.value.toUpperCase())}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    title={`Escolher ${field.label}`}
                  />
                </label>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={currentColor}
                    maxLength={7}
                    placeholder="#RRGGBB"
                    onChange={(e) => handleHexInput(field.key, e.target.value)}
                    className="w-full text-xs font-mono font-semibold px-3 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-hover)]/40 text-[var(--dash-text-primary)] uppercase focus:outline-none focus:border-[#FFA82A] focus:ring-1 focus:ring-[#FFA82A] transition-all"
                  />
                </div>
              </div>

              {/* Descrição Pastoral e Local de Aplicação */}
              <div className="text-[11px] text-[var(--dash-text-muted)] leading-relaxed space-y-0.5 pt-1 border-t border-[var(--dash-border)]/50">
                <p>{field.usageDescription}</p>
                <p className="text-[10px] text-[#FFA82A] flex items-center gap-1 font-medium">
                  <Info className="w-3 h-3 shrink-0" />
                  <span className="truncate">Onde atua: {field.examplePlacement}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
