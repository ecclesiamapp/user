'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  variant?: 'button' | 'pill' | 'segmented';
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  variant = 'button',
  className = '',
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evita hidratação descompassada renderizando um placeholder com as mesmas dimensões
  if (!mounted) {
    if (variant === 'segmented') {
      return (
        <div className={`flex items-center gap-1 p-1 rounded-xl bg-black/20 border border-white/10 ${className}`}>
          <div className="w-16 h-7 rounded-lg bg-transparent" />
          <div className="w-16 h-7 rounded-lg bg-transparent" />
        </div>
      );
    }
    return (
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/10 border border-white/10 ${className}`}
        aria-hidden="true"
      />
    );
  }

  // Variante Segmented: Seletor com 2 abas "☀️ Claro" e "🌙 Escuro"
  if (variant === 'segmented') {
    return (
      <div
        role="group"
        aria-label="Selecionar tema visual"
        className={`flex items-center gap-1 p-1 rounded-xl bg-black/30 border border-white/10 ${className}`}
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] cursor-pointer ${
            !isDark
              ? 'bg-[#FFA82A] text-[#2D1A16] shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-[var(--dash-surface)]/5'
          }`}
          aria-pressed={!isDark}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Claro</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] cursor-pointer ${
            isDark
              ? 'bg-[#FFA82A] text-[#2D1A16] shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-[var(--dash-surface)]/5'
          }`}
          aria-pressed={isDark}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Escuro</span>
        </button>
      </div>
    );
  }

  // Variante Pill: Botão estilizado com ícone e texto opcional
  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer min-h-[38px] ${
          isDark
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            : 'bg-black/5 dark:bg-[var(--dash-surface)]/10 border-black/10 dark:border-white/15 text-[var(--dash-text-primary)] hover:bg-black/10'
        } ${className}`}
        title={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        aria-label={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
            <span>Tema Claro</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 animate-in spin-in-180 duration-300" />
            <span>Tema Escuro</span>
          </>
        )}
      </button>
    );
  }

  // Variante Padrão Button: Botão de ação compacto para o Header
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer relative group ${
        isDark
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 hover:border-amber-400 shadow-sm shadow-amber-500/10'
          : 'bg-[var(--dash-surface)]/10 border-white/15 text-amber-200 hover:bg-[var(--dash-surface)]/20 hover:text-[#FFA82A] shadow-sm'
      } ${className}`}
      title={isDark ? 'Modo Escuro Ativo • Clique para deixar Claro' : 'Modo Claro Ativo • Clique para deixar Escuro'}
      aria-label={isDark ? 'Modo Escuro Ativo • Clique para deixar Claro' : 'Modo Claro Ativo • Clique para deixar Escuro'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-200 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-300" />
      )}
      {showLabel && (
        <span className="sr-only">
          {isDark ? 'Alternar para Tema Claro' : 'Alternar para Tema Escuro'}
        </span>
      )}
    </button>
  );
}
