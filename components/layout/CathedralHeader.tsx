'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Heart,
  User,
  Users,
  Sparkles,
  BookOpen,
  ChevronDown,
  ShieldCheck,
  Calendar,
  Church,
  FileText,
  Radio,
} from 'lucide-react';
import { useAdminSession } from '@/lib/hooks/useAdminSession';
import { ResolvedEventTheme } from '@/lib/events';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
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
  const [liturgiaMenuOpen, setLiturgiaMenuOpen] = useState(false);
  const [secretariaMenuOpen, setSecretariaMenuOpen] = useState(false);
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

  const closeAllMenus = () => {
    setLiturgiaMenuOpen(false);
    setSecretariaMenuOpen(false);
    setCathedralMenuOpen(false);
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

  // Itens dos 3 Submenus Estruturados
  const LITURGIA_ITEMS = [
    { href: '/agenda-liturgica', icon: Calendar, title: 'Agenda Litúrgica & Missas', sub: 'Horários da Catedral, adorações e confissões' },
    { href: '/comunidades', icon: Church, title: '12 Comunidades (CEBs)', sub: 'Localização GPS, padroeiros e celebrações' },
    { href: '/#folhetos', icon: FileText, title: 'Folhetos das Santas Missas', sub: 'Download oficial («Sou do Sagrado Missa»)' },
  ];

  const SECRETARIA_ITEMS = [
    { href: '/secretaria', icon: Church, title: 'Sacramentos & Atendimento', sub: 'Batismos, matrimônios, certidões e agendamentos' },
    { href: '/noticias', icon: FileText, title: 'Notícias & Avisos Oficiais', sub: 'Comunicados semanais da PASCOM Catedral' },
    { href: '/movimentos', icon: Users, title: 'Movimentos (ECC, EAC, EJC)', sub: 'Famílias, adolescentes e jovens da paróquia' },
  ];

  const CATEDRAL_ITEMS = [
    { href: '/historia', icon: BookOpen, title: 'História & Fé Centenária', sub: 'Linha do tempo histórica da fundação até hoje' },
    { href: '/historia#parocos', icon: User, title: 'Pároco & Bispos Diocesanos', sub: 'Pe. Irineu Sales e sucessão apostólica' },
    { href: '/historia#patrimonio', icon: Sparkles, title: 'Patrimônio Sacro & Vitrais', sub: 'Vitrais Casa Conrado de 1957 e sinos históricos' },
    { href: '/dizimo', icon: Heart, title: 'Dízimo Sou do Sagrado', sub: 'Dimensões do dízimo e transparência pastoral' },
  ];

  return (
    <>
      <header
        style={{
          ...headerVars,
          backgroundColor: 'var(--hdr-bg)',
          borderColor: 'var(--hdr-border)',
        }}
        className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-all select-none"
      >
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4">
          
          {/* 1. Identidade e Brasão da Catedral (Coluna Esquerda: 1fr alinhado à esquerda) */}
          <Link href="/" onClick={closeAllMenus} className="flex items-center gap-2.5 sm:gap-3 group text-decoration-none shrink-0 lg:justify-self-start">
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
            <div className="shrink-0 flex flex-col justify-center">
              <span className="block font-cinzel text-xs sm:text-sm xl:text-base font-bold tracking-[0.04em] text-[#FAF6F0] uppercase leading-tight group-hover:text-[var(--hdr-accent)] transition-colors whitespace-nowrap">
                Catedral
              </span>
              <span className="block font-serif italic text-[11px] sm:text-xs text-[#FFCC36] tracking-wide leading-tight mt-0.5 whitespace-nowrap">
                Sagrado Coração de Jesus
              </span>
            </div>
          </Link>

          {/* 2. Menu Central Desktop: 3 SUBMENUS INTELIGENTES + MEU ESPAÇO (Coluna Central 100% Centralizada a 50%) */}
          <nav
            style={{ color: 'var(--hdr-nav-text)' }}
            className="hidden lg:flex items-center justify-center lg:justify-self-center gap-2 xl:gap-4 text-xs font-bold tracking-[0.04em] uppercase font-sans"
          >
            {/* SUBMENU 1: Liturgia */}
            <div
              className="relative"
              onMouseEnter={() => {
                setLiturgiaMenuOpen(true);
                setSecretariaMenuOpen(false);
                setCathedralMenuOpen(false);
              }}
              onMouseLeave={() => setLiturgiaMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setLiturgiaMenuOpen(!liturgiaMenuOpen)}
                className="whitespace-nowrap hover:text-[var(--hdr-accent)] transition-colors py-2 px-2 flex items-center gap-1 cursor-pointer uppercase text-xs font-bold"
                aria-expanded={liturgiaMenuOpen}
              >
                <span>Liturgia</span>
                <ChevronDown
                  style={{ color: liturgiaMenuOpen ? 'var(--hdr-accent)' : 'var(--hdr-gold-muted)' }}
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${liturgiaMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {liturgiaMenuOpen && (
                <div
                  style={{
                    backgroundColor: 'var(--hdr-dropdown-bg)',
                    borderColor: 'var(--hdr-border)',
                  }}
                  className="absolute top-full left-0 mt-1 w-72 rounded-2xl backdrop-blur-xl border shadow-2xl shadow-black/80 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div style={{ borderColor: 'var(--hdr-border)' }} className="px-3 py-2 border-b mb-1">
                    <span style={{ color: 'var(--hdr-gold-muted)' }} className="text-[10px] uppercase tracking-wider font-bold block">
                      Vida Comunitária & Oração
                    </span>
                    <span className="text-xs text-[#FAF6F0]/85 font-serif">
                      Santas Missas & Sacramentos
                    </span>
                  </div>

                  {LITURGIA_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeAllMenus}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[var(--hdr-item-hover)] text-[#FAF6F0]/90 hover:text-[var(--hdr-accent)] transition-colors group"
                      >
                        <Icon style={{ color: 'var(--hdr-accent)' }} className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
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

            {/* SUBMENU 2: Secretaria & Pastorais */}
            <div
              className="relative"
              onMouseEnter={() => {
                setSecretariaMenuOpen(true);
                setLiturgiaMenuOpen(false);
                setCathedralMenuOpen(false);
              }}
              onMouseLeave={() => setSecretariaMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setSecretariaMenuOpen(!secretariaMenuOpen)}
                className="whitespace-nowrap hover:text-[var(--hdr-accent)] transition-colors py-2 px-2.5 flex items-center gap-1 cursor-pointer uppercase text-xs font-bold"
                aria-expanded={secretariaMenuOpen}
              >
                <span>Secretaria</span>
                <ChevronDown
                  style={{ color: secretariaMenuOpen ? 'var(--hdr-accent)' : 'var(--hdr-gold-muted)' }}
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${secretariaMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {secretariaMenuOpen && (
                <div
                  style={{
                    backgroundColor: 'var(--hdr-dropdown-bg)',
                    borderColor: 'var(--hdr-border)',
                  }}
                  className="absolute top-full left-0 mt-1 w-72 rounded-2xl backdrop-blur-xl border shadow-2xl shadow-black/80 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div style={{ borderColor: 'var(--hdr-border)' }} className="px-3 py-2 border-b mb-1">
                    <span style={{ color: 'var(--hdr-gold-muted)' }} className="text-[10px] uppercase tracking-wider font-bold block">
                      Atendimento & Comunicação
                    </span>
                    <span className="text-xs text-[#FAF6F0]/85 font-serif">
                      Secretaria Paroquial
                    </span>
                  </div>

                  {SECRETARIA_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeAllMenus}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[var(--hdr-item-hover)] text-[#FAF6F0]/90 hover:text-[var(--hdr-accent)] transition-colors group"
                      >
                        <Icon style={{ color: 'var(--hdr-accent)' }} className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
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

            {/* SUBMENU 3: A Catedral */}
            <div
              className="relative"
              onMouseEnter={() => {
                setCathedralMenuOpen(true);
                setLiturgiaMenuOpen(false);
                setSecretariaMenuOpen(false);
              }}
              onMouseLeave={() => setCathedralMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCathedralMenuOpen(!cathedralMenuOpen)}
                className="whitespace-nowrap hover:text-[var(--hdr-accent)] transition-colors py-2 px-2.5 flex items-center gap-1 cursor-pointer uppercase text-xs font-bold"
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
                  className="absolute top-full left-0 mt-1 w-72 rounded-2xl backdrop-blur-xl border shadow-2xl shadow-black/80 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div style={{ borderColor: 'var(--hdr-border)' }} className="px-3 py-2 border-b mb-1">
                    <span style={{ color: 'var(--hdr-gold-muted)' }} className="text-[10px] uppercase tracking-wider font-bold block">
                      Institucional & Memória
                    </span>
                    <span className="text-xs text-[#FAF6F0]/85 font-serif">
                      Catedral Sagrado Coração de Jesus
                    </span>
                  </div>

                  {CATEDRAL_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeAllMenus}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[var(--hdr-item-hover)] text-[#FAF6F0]/90 hover:text-[var(--hdr-accent)] transition-colors group"
                      >
                        <Icon style={{ color: 'var(--hdr-accent)' }} className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
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

            {/* LINK DESTAQUE: Meu Espaço */}
            <Link
              href="/meu-espaco"
              onClick={closeAllMenus}
              className="whitespace-nowrap hover:text-[var(--hdr-accent)] transition-colors py-2 px-2.5 flex items-center gap-1.5 text-[#FFCC36]"
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>Meu Espaço</span>
            </Link>
          </nav>

          {/* 3. Ações Rápidas à Direita (Coluna Direita 1fr) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 lg:justify-self-end">
            {/* ☀️ / 🌙 Alternador de Tema Claro / Escuro (40x40px Fixo e Visível) */}
            <ThemeToggle />

            {/* Botão Missa Ao Vivo */}
            <button
              onClick={onOpenLiveVideo}
              type="button"
              style={{
                backgroundColor: 'var(--hdr-live-bg)',
                borderColor: 'var(--hdr-live-border)',
              }}
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl hover:brightness-115 border text-[#FAF6F0] text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-sm cursor-pointer min-h-[40px]"
              title="Assistir Transmissão Oficial ao Vivo"
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
              <span className="whitespace-nowrap">Ao Vivo</span>
            </button>

            {/* Painel Admin (quando logado) */}
            {hasAdminSession && (
              <Link
                href="/admin"
                style={{
                  backgroundColor: 'var(--hdr-admin-bg)',
                  borderColor: 'var(--hdr-admin-border)',
                  color: 'var(--hdr-admin-text)',
                }}
                className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl hover:brightness-115 border text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-sm cursor-pointer min-h-[40px]"
                title="Voltar ao Painel Administrativo"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Admin</span>
              </Link>
            )}

            {/* CTA Sou do Sagrado */}
            <Link
              href="/dizimo"
              onClick={closeAllMenus}
              style={{
                background: 'var(--hdr-cta-bg)',
                color: 'var(--hdr-cta-text)',
              }}
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl hover:brightness-105 text-xs font-extrabold uppercase tracking-wider font-sans transition-all shadow-md cursor-pointer min-h-[40px]"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Sou do Sagrado</span>
              <span className="sm:hidden whitespace-nowrap">Dízimo</span>
            </Link>

            {/* Botão Menu Hamburger para Telas Pequenas */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              style={{ color: 'var(--hdr-nav-text)' }}
              className="lg:hidden p-2 rounded-xl hover:text-[var(--hdr-accent)] hover:bg-[var(--dash-surface)]/10 transition-colors cursor-pointer"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Gaveta Mobile */}
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
