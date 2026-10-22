'use client';

import React, { useState } from 'react';
import { Smartphone, Monitor, Clock, Heart, Sparkles, MapPin, ChevronRight, Cross } from 'lucide-react';
import { BrandColors, BrandFonts, BrandLogos } from '@/lib/brand';

interface BrandLivePreviewMockupProps {
  colors: BrandColors;
  fonts: BrandFonts;
  logos: BrandLogos;
  parishName?: string;
  tagline?: string;
}

export function BrandLivePreviewMockup({
  colors,
  fonts,
  logos,
  parishName = 'Catedral Sagrado Coração de Jesus',
  tagline = 'Diocese de Colatina • Espírito Santo',
}: BrandLivePreviewMockupProps) {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <div className="space-y-4">
      {/* Header do Simulador com seletor de tela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dash-text-primary)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFA82A]" />
            <span>Simulador do Portal Público (Live Preview)</span>
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Visualize em tempo real como o fiel verá a Catedral no smartphone ou computador antes de publicar.
          </p>
        </div>

        {/* Toggle Mobile / Desktop */}
        <div className="flex items-center gap-1 bg-[var(--dash-surface-hover)] p-1 rounded-xl border border-[var(--dash-border)] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-[#FFA82A] text-[var(--dash-text-primary)] font-bold shadow-xs'
                : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Smartphone (375px)</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-[#FFA82A] text-[var(--dash-text-primary)] font-bold shadow-xs'
                : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* Caixa de Apresentação do Mockup */}
      <div className="w-full rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface-hover)]/30 p-4 sm:p-6 flex items-center justify-center overflow-x-auto min-h-[460px]">
        <div
          className={`transition-all duration-300 rounded-3xl overflow-hidden border border-neutral-300 dark:border-neutral-700 shadow-xl ${
            deviceMode === 'mobile' ? 'w-[360px] max-w-full' : 'w-full max-w-[720px]'
          }`}
          style={{
            backgroundColor: colors.background,
            color: colors.text_primary,
            fontFamily: fonts.body ? `'${fonts.body}', sans-serif` : 'sans-serif',
          }}
        >
          {/* Barra Superior / Status do Celular no Mobile */}
          {deviceMode === 'mobile' && (
            <div className="bg-black/90 text-white text-[10px] px-5 py-1.5 flex items-center justify-between select-none">
              <span>09:41</span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>5G</span>
              </div>
            </div>
          )}

          {/* Topo Oficial da Paróquia (Header Estilizado) */}
          <header
            className="px-4 py-3.5 flex items-center justify-between border-b shadow-xs transition-colors"
            style={{
              backgroundColor: colors.surface,
              borderColor: `${colors.primary}20`,
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {logos.main_url ? (
                <img
                  src={logos.main_url}
                  alt="Brasão"
                  className="w-9 h-9 object-contain shrink-0"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.secondary,
                  }}
                >
                  <Cross className="w-5 h-5" />
                </div>
              )}

              <div className="min-w-0">
                <h1
                  className="text-xs font-bold leading-tight truncate"
                  style={{
                    color: colors.primary,
                    fontFamily: fonts.heading ? `'${fonts.heading}', serif` : 'serif',
                  }}
                >
                  {parishName}
                </h1>
                <p className="text-[10px] text-[var(--dash-text-muted)] truncate opacity-80">
                  {tagline}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="text-[11px] font-bold px-3 py-1.5 rounded-xl text-white shadow-xs transition-transform active:scale-95 shrink-0"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              Menu
            </button>
          </header>

          {/* Corpo do Portal */}
          <div className="p-4 space-y-3.5">
            {/* Banner de Boas-Vindas */}
            <div
              className="p-4 rounded-2xl text-white shadow-sm relative overflow-hidden"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              <div className="relative z-10 space-y-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block"
                  style={{
                    backgroundColor: colors.secondary,
                    color: '#000000',
                  }}
                >
                  Solenidade Litúrgica
                </span>
                <h2
                  className="text-base font-extrabold leading-snug"
                  style={{
                    fontFamily: fonts.heading ? `'${fonts.heading}', serif` : 'serif',
                  }}
                >
                  Bem-vindo à Casa da Mãe e do Senhor
                </h2>
                <p className="text-xs text-white/90">
                  Portal de comunhão, oração e transparência das 12 CEBs.
                </p>
              </div>
            </div>

            {/* Card "Missas de Hoje" */}
            <div
              className="p-3.5 rounded-2xl border shadow-xs space-y-2.5 transition-colors"
              style={{
                backgroundColor: colors.surface,
                borderColor: `${colors.primary}25`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <h3
                    className="text-xs font-bold"
                    style={{
                      fontFamily: fonts.heading ? `'${fonts.heading}', serif` : 'serif',
                    }}
                  >
                    Missas de Hoje na Matriz
                  </h3>
                </div>

                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${colors.secondary}30`,
                    color: colors.primary,
                  }}
                >
                  Ao Vivo
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className="p-2.5 rounded-xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: `${colors.primary}15`,
                  }}
                >
                  <span className="text-[10px] opacity-75 font-medium">Manhã</span>
                  <span className="text-sm font-bold font-mono">07:00</span>
                  <span className="text-[10px] opacity-70 truncate">Pe. Irineu</span>
                </div>
                <div
                  className="p-2.5 rounded-xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: `${colors.primary}15`,
                  }}
                >
                  <span className="text-[10px] opacity-75 font-medium">Noite</span>
                  <span className="text-sm font-bold font-mono">19:00</span>
                  <span className="text-[10px] opacity-70 truncate">Missa Solene</span>
                </div>
              </div>
            </div>

            {/* Botão de Dízimo & PIX */}
            <div
              className="p-3.5 rounded-2xl flex items-center justify-between text-[var(--dash-text-primary)] font-bold text-xs shadow-xs cursor-pointer hover:opacity-95 transition-all"
              style={{
                backgroundColor: colors.action_pix,
              }}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 fill-current" />
                <span>Devolver o Dízimo & Ofertas (PIX)</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>

            {/* Mini Footer White-Label */}
            <div className="text-center pt-2 pb-1 text-[10px] opacity-60">
              <p>© 2026 {parishName} • Diocese de Colatina</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
