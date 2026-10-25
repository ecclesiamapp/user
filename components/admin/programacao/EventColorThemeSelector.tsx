'use client';

import React from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { EventColorPreset } from '@/types';
import { EVENT_COLOR_PRESETS } from '@/lib/events';

interface EventColorThemeSelectorProps {
  selectedPreset: EventColorPreset;
  onSelectPreset: (preset: EventColorPreset) => void;
  primaryColor: string;
  onChangePrimary: (color: string) => void;
  secondaryColor: string;
  onChangeSecondary: (color: string) => void;
  accentColor: string;
  onChangeAccent: (color: string) => void;
}

export function EventColorThemeSelector({
  selectedPreset,
  onSelectPreset,
  primaryColor,
  onChangePrimary,
  secondaryColor,
  onChangeSecondary,
  accentColor,
  onChangeAccent,
}: EventColorThemeSelectorProps) {
  const presetsList = Object.values(EVENT_COLOR_PRESETS);

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#FFA82A]" />
            <span>Identidade Cromática da Festividade</span>
          </label>
          <span className="text-[11px] text-[var(--dash-text-muted)]">
            Define as cores sagradas do Hero, linha do tempo e botões da página pública do fiel.
          </span>
        </div>
      </div>

      {/* Grid de Presets em Cards Interativos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {presetsList.map((preset) => {
          const isSelected = selectedPreset === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 min-h-[68px] cursor-pointer ${
                isSelected
                  ? 'bg-[var(--dash-surface-hover)] border-[#FFA82A] shadow-md ring-2 ring-[#FFA82A]/30'
                  : 'bg-[var(--dash-surface-input)] border-[var(--dash-border)] hover:border-[var(--dash-border-hover)] hover:bg-[var(--dash-surface-hover)]/40'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-[var(--dash-text-primary)] truncate">
                  {preset.name}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#FFA82A] shrink-0" />
                )}
              </div>

              {/* Bolinhas de Cores da Paleta */}
              <div className="flex items-center gap-1.5">
                <span
                  className="w-4 h-4 rounded-full border border-black/20 shadow-xs shrink-0"
                  style={{ backgroundColor: preset.primary }}
                  title="Cor Primária"
                />
                <span
                  className="w-4 h-4 rounded-full border border-black/20 shadow-xs shrink-0"
                  style={{ backgroundColor: preset.secondary }}
                  title="Cor Secundária"
                />
                <span
                  className="w-4 h-4 rounded-full border border-black/20 shadow-xs shrink-0"
                  style={{ backgroundColor: preset.accent }}
                  title="Cor de Acento"
                />
                <span className="text-[10px] text-[var(--dash-text-muted)] truncate ml-1 font-mono">
                  {preset.subtitle.split('(')[1]?.replace(')', '') || ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modo Personalizado: Seletores Livres de Cor */}
      {selectedPreset === 'custom' && (
        <div className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/40 space-y-3 animate-in fade-in duration-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFA82A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Configuração de Cores Personalizadas (Hex)</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1">
                Cor Primária
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => onChangePrimary(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-[var(--dash-border)] bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => onChangePrimary(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs font-mono text-[var(--dash-text-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1">
                Cor Secundária
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => onChangeSecondary(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-[var(--dash-border)] bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => onChangeSecondary(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs font-mono text-[var(--dash-text-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1">
                Cor de Acento / Texto
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => onChangeAccent(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-[var(--dash-border)] bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => onChangeAccent(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs font-mono text-[var(--dash-text-primary)]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini Faixa de Prévia do Gradiente */}
      <div className="p-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium text-[var(--dash-text-muted)]">
          Prévia da atmosfera do Hero:
        </span>
        <div
          className="h-5 flex-1 max-w-[200px] rounded-lg border border-black/20 shadow-inner"
          style={{
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
          }}
        />
      </div>
    </div>
  );
}
