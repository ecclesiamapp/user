'use client';

import React from 'react';
import { Sparkles, Check, Palette } from 'lucide-react';
import { 
  BrandPresetKey, 
  CANONICAL_BRAND_PRESETS, 
  BrandPreset,
  BrandColors,
  BrandFonts 
} from '@/lib/brand';

interface BrandPresetsSelectorProps {
  currentPreset: string;
  onSelectPreset: (preset: BrandPreset) => void;
}

export function BrandPresetsSelector({
  currentPreset,
  onSelectPreset,
}: BrandPresetsSelectorProps) {
  const presetsList = Object.values(CANONICAL_BRAND_PRESETS);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dash-text-primary)] flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#FFA82A]" />
            <span>Biblioteca de Presets Canônicos</span>
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Modelos cromáticos eclesiásticos prontos. Escolha um tema para preencher o moodboard instantaneamente.
          </p>
        </div>
        <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFA82A]/10 text-[#FFA82A] border border-[#FFA82A]/20">
          5 Temas Canônicos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {presetsList.map((preset) => {
          const isSelected = currentPreset === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`group relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer select-none ${
                isSelected
                  ? 'border-[#FFA82A] bg-[var(--dash-surface-hover)] shadow-md shadow-[#FFA82A]/5 ring-1 ring-[#FFA82A]'
                  : 'border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--dash-border-hover)] hover:bg-[var(--dash-surface-hover)]/40'
              }`}
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[var(--dash-text-primary)] truncate">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#FFA82A] text-[var(--dash-text-primary)]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        Ativo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--dash-text-secondary)] truncate">
                    {preset.subtitle}
                  </p>
                </div>
              </div>

              {/* Descrição Compacta */}
              <p className="text-[11px] text-[var(--dash-text-muted)] line-clamp-2 mb-3 leading-relaxed">
                {preset.description}
              </p>

              {/* Amostras de Cores (Swatches) */}
              <div className="flex items-center justify-between pt-2.5 border-t border-[var(--dash-border)]/60">
                <div className="flex items-center -space-x-1.5">
                  <span
                    className="w-5 h-5 rounded-full border-2 border-[var(--dash-surface)] shadow-xs"
                    style={{ backgroundColor: preset.colors.primary }}
                    title={`Primária: ${preset.colors.primary}`}
                  />
                  <span
                    className="w-5 h-5 rounded-full border-2 border-[var(--dash-surface)] shadow-xs"
                    style={{ backgroundColor: preset.colors.secondary }}
                    title={`Secundária: ${preset.colors.secondary}`}
                  />
                  <span
                    className="w-5 h-5 rounded-full border-2 border-[var(--dash-surface)] shadow-xs"
                    style={{ backgroundColor: preset.colors.background }}
                    title={`Fundo: ${preset.colors.background}`}
                  />
                  <span
                    className="w-5 h-5 rounded-full border-2 border-[var(--dash-surface)] shadow-xs"
                    style={{ backgroundColor: preset.colors.action_pix }}
                    title={`PIX: ${preset.colors.action_pix}`}
                  />
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-[var(--dash-text-secondary)]">
                    {preset.fonts.heading}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
