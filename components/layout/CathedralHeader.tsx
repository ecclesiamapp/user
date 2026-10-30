'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Heart,
  User,
  Sparkles,
  BookOpen,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useAdminSession } from '@/lib/hooks/useAdminSession';
import { ResolvedEventTheme } from '@/lib/events';
import { CathedralMobileDrawer } from './CathedralMobileDrawer';

interface CathedralHeaderProps {
  parishName?: string;
  dioceseName?: string;
  whatsappNumber?: string;
  onOpenLiveVideo?: () => void;
  themeOverride?: ResolvedEventTheme;
}

export function CathedralHeader({
  parishName = 'Catedral de Colatina',
  dioceseName = 'Diocese de Colatina',
  whatsappNumber = '552737221234',
  onOpenLiveVideo,
  themeOverride,
}: CathedralHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cathedralMenuOpen, setCathedralMenuOpen] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'md' | 'lg'>('md');
  const { hasAdminSession } = useAdminSession();

  const handleFontSizeChange = (level: 'sm' | 'md' | 'lg') => {
    setFontSizeLevel(level);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (level === 'sm') root.style.fontSize = '14px';
      else if (level === 'md') root.style.fontSize = '16px';
      else if (level === 'lg') root.style.fontSize = '18px';
    }
  };

  const t = themeOverride;
  const headerVars = {
    '--hdr-bg': t ? `rgba(${t.pageBgRgb}, 0.95)` : 'rgba(22, 24, 27, 0.95)',
    '--hdr-border': t ? `${t.secondary}40` : 'rgba(200, 164, 99, 0.25)',
    '--hdr-emblem-bg': t
      ? `linear-gradient(135deg, ${t.primary}, ${t.surfaceBg}, ${t.pageBg})`
      : 'linear-gradient(135deg, #8B1E22, #5E1417, #2D1A16)',
    '--hdr-emblem-border': t ? `${t.secondary}70` : 'rgba(200, 164, 99, 0.40)',
    '--hdr-accent': t ? t.secondary : '#FFCC36',
    '--hdr-gold-muted': t ? `${t.secondary}CC` : '#C8A463',
    '--hdr-nav-text': t ? t.textSecondary : '#EAE3D9',
    '--hdr-dropdown-bg': t ? `rgba(${t.pageBgRgb}, 0.98)` : 'rgba(22, 24, 27, 0.98)',
    '--hdr-item-hover': t ? `${t.primary}55` : 'rgba(139, 30, 34, 0.30)',
    '--hdr-live-bg': t ? `${t.primary}55` : 'rgba(139, 30, 34, 0.30)',
    '--hdr-live-border': t ? `${t.secondary}66` : 'rgba(211, 47, 47, 0.60)',
    '--hdr-live-dot': t ? t.secondary : '#D32F2F',
    '--hdr-admin-bg': t ? `${t.secondary}20` : 'rgba(245, 158, 11, 0.20)',
    '--hdr-admin-border': t ? `${t.secondary}65` : 'rgba(245, 158, 11, 0.50)',
    '--hdr-admin-text': t ? t.secondary : '#FCD34D',
    '--hdr-cta-bg': t
      ? `linear-gradient(90deg, ${t.secondary}, #FFE2B8, ${t.secondary})`
      : 'linear-gradient(90deg, #FFA82A, #FFCC36, #FFA82A)',
    '--hdr-cta-text': t ? t.ctaTextOnSecondary : '#2D1A16',
  } as React.CSSProperties;

  return (
    <>
      <header
        style={{
          ...headerVars,
          backgroundColor: 'var(--hdr-bg)',
          borderColor: 'var(--hdr-border)',
        }}
        className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-all"
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* 1. Identidade e Brasão da Catedral */}
          <Link href="/" className="flex items-center gap-3 group text-decoration-none shrink-0">
            <div
              style={{
                background: 'var(--hdr-emblem-bg)',
                borderColor: 'var(--hdr-emblem-border)',
                color: 'var(--hdr-accent)',
              }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border flex items-center justify-center shadow-md shadow-black/40 group-hover:brightness-110 transition-all shrink-0"
            >
              <span className="font-serif text-xl sm:text-2xl font-bold leading-none select-none">✝</span>
            </div>
            <div className="shrink-0">
              <span className="block font-cinzel text-sm sm:text-base xl:text-lg font-bold tracking-[0.04em] text-[#FAF6F0] uppercase leading-tight group-hover:text-[var(--hdr-accent)] transition-colors whitespace-nowrap">
                {parishName}
              </span>
              <span
                style={{ color: 'var(--hdr-gold-muted)' }}
                className="hidden sm:block text-[10px] xl:text-[11px] font-medium tracking-wide whitespace-nowrap"
              >
                Paróquia Sagrado Coração de Jesus • {dioceseName}
              </span>
            </div>
          </Link>

          {/* 2. Menu Central Desktop */}
          <nav
            style={{ color: 'var(--hdr-nav-text)' }}
            className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs font-bold tracking-[0.05em] uppercase font-sans"
          >
            <Link
              href="/agenda-liturgica"
              className="whitespace-nowrap hover:text-[var(--hdr-accent)] transition-colors py-2"
            >
              Horários & Missas
            </Link>

            <Link
              href="/comunidades"
              className="whitespace-nowrap hover:text-[var(--hdr-accent)] transition-colors py-2"
            >
              Comunidades
            </Link>

            <Link
              href="/noticias"
              className="whitespace-nowrap hover:text-[var(--hdr-accent)] transition-colors py-2"
            >
              Notícias
            </Link>

            <Link
              href="/secretaria"
              className="whitespace-nowrap hover:text-[var(--hdr-accent)] transition-colors py-2"
            >
              Secretaria
            </Link>

            {/* Dropdown Institucional: A Catedral */}
            <div
              className="relative"
              onMouseEnter={() => setCathedralMenuOpen(true)}
              onMouseLeave={() => setCathedralMenuOpen(false)}
            >
              <button
                onClick={() => setCathedralMenuOpen(!cathedralMenuOpen)}
                type="button"
                className="whitespace-nowrap hover:text-[var(--hdr-accent)] transition-colors py-2 flex items-center gap-1 cursor-pointer uppercase text-xs font-bold"
                aria-expanded={cathedralMenuOpen}
              >
                <span>A Catedral</span>
                <ChevronDown
                  style={{ color: cathedralMenuOpen ? 'var(--hdr-accent)' : 'var(--hdr-gold-muted)' }}
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${cathedralMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {cathedralMenuOpen && (
                <div
                  style={{
                    backgroundColor: 'var(--hdr-dropdown-bg)',
                    borderColor: 'var(--hdr-border)',
                  }}
                  className="absolute top-full right-0 mt-1 w-64 rounded-2xl backdrop-blur-xl border shadow-2xl shadow-black/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div
                    style={{ borderColor: 'var(--hdr-border)' }}
                    className="px-3 py-2 border-b mb-1"
                  >
                    <span
                      style={{ color: 'var(--hdr-gold-muted)' }}
                      className="text-[10px] uppercase tracking-wider font-bold block"
                    >
                      Institucional & Memória
                    </span>
                    <span className="text-xs text-[#FAF6F0]/85 font-serif">
                      Catedral Sagrado Coração de Jesus
                    </span>
                  </div>

                  {[
                    { href: '/historia', icon: BookOpen, title: 'História & Fé', sub: 'Linha do tempo centenária' },
                    { href: '/historia#parocos', icon: User, title: 'Pároco & Bispos', sub: 'Pe. Irineu e sucessão pastoral' },
                    { href: '/historia#patrimonio', icon: Sparkles, title: 'Patrimônio Sacro', sub: 'Vitrais Casa Conrado e Sinos' },
                    { href: '/dizimo', icon: Heart, title: 'Dízimo & Ofertas', sub: 'Sou do Sagrado benfeitores' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setCathedralMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[var(--hdr-item-hover)] text-[#FAF6F0]/90 hover:text-[var(--hdr-accent)] transition-colors group"
                      >
                        <Icon
                          style={{ color: 'var(--hdr-accent)' }}
                          className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0"
                        />
                        <div>
                          <span className="block text-xs font-bold normal-case">{item.title}</span>
                          <span className="block text-[10px] opacity-70 normal-case">{item.sub}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* 3. Ações Rápidas à Direita */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenLiveVideo}
              type="button"
              style={{
                backgroundColor: 'var(--hdr-live-bg)',
                borderColor: 'var(--hdr-live-border)',
              }}
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl hover:brightness-115 border text-[#FAF6F0] text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-sm cursor-pointer min-h-[40px]"
              title="Assistir Transmissão ao Vivo Oficial"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span
                  style={{ backgroundColor: 'var(--hdr-live-dot)' }}
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                />
                <span
                  style={{ backgroundColor: 'var(--hdr-live-dot)' }}
                  className="relative inline-flex rounded-full h-2 w-2"
                />
              </span>
              <span className="whitespace-nowrap">
                <span className="hidden xl:inline">Missa </span>Ao Vivo
              </span>
            </button>

            {hasAdminSession && (
              <Link
                href="/admin"
                style={{
                  backgroundColor: 'var(--hdr-admin-bg)',
                  borderColor: 'var(--hdr-admin-border)',
                  color: 'var(--hdr-admin-text)',
                }}
                className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:brightness-115 border text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-sm cursor-pointer min-h-[40px]"
                title="Voltar ao Painel Administrativo"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="hidden xl:inline">Painel </span>Admin
              </Link>
            )}

            <Link
              href="/dizimo"
              style={{
                background: 'var(--hdr-cta-bg)',
                color: 'var(--hdr-cta-text)',
              }}
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl hover:brightness-105 text-xs font-extrabold uppercase tracking-wider font-sans transition-all shadow-md cursor-pointer min-h-[40px]"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Sou do Sagrado</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              style={{ color: 'var(--hdr-nav-text)' }}
              className="lg:hidden p-2 rounded-xl hover:text-[var(--hdr-accent)] hover:bg-[var(--dash-surface)]/10 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <CathedralMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        parishName={parishName}
        whatsappNumber={whatsappNumber}
        hasAdminSession={hasAdminSession}
        fontSizeLevel={fontSizeLevel}
        onFontSizeChange={handleFontSizeChange}
        onOpenLiveVideo={onOpenLiveVideo}
        themeOverride={themeOverride}
      />
    </>
  );
}
