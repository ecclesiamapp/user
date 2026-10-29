'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Church, MapPin, Menu, X, ArrowLeft, Navigation, Sparkles, Phone, ShieldCheck } from 'lucide-react';
import { Community } from '@/types';
import { AccessibilityFontScaleControl } from './AccessibilityFontScaleControl';
import { useAdminSession } from '@/lib/hooks/useAdminSession';

interface CommunityHeaderProps {
  community: Community;
  googleMapsUrl?: string;
}

export function CommunityHeader({ community, googleMapsUrl }: CommunityHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { hasAdminSession } = useAdminSession();

  const navLinks = [
    { label: 'Horários', href: '#horarios' },
    { label: 'Avisos', href: '#avisos' },
    { label: 'Calendário', href: '#calendario' },
    { label: 'Liderança CPC', href: '#cpc' },
    { label: 'Como Chegar', href: '#localizacao' },
    { label: 'Doações', href: '#doacoes' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* 1. Top Utility Bar Discreta de Afiliação à Catedral com Controle de Acessibilidade */}
      <div className="w-full bg-[#161210] border-b border-[#C8A463]/20 py-1.5 px-3 sm:px-6">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-2 text-[11px] text-[#C8A463]">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <span className="text-[#FFA82A]">✝</span>
            <span className="truncate">Paróquia Catedral do Sagrado Coração de Jesus • Diocese de Colatina</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Controle de Redimensionamento de Fonte (TASK-41B) */}
            <AccessibilityFontScaleControl />

            {/* Atalho ao Painel da Comunidade para Usuário Logado */}
            {hasAdminSession && (
              <Link
                href="/admin/comunidades"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-[10px] font-bold transition-colors"
                title="Voltar ao Painel da Comunidade"
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Painel Admin</span>
              </Link>
            )}

            <Link
              href="/comunidades"
              className="hidden sm:inline-flex items-center gap-1 text-[#EAE3D9]/70 hover:text-white transition-colors py-0.5"
            >
              <ArrowLeft className="w-3 h-3 text-[#FFA82A]" />
              <span>Todas as Comunidades</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Floating Navbar Minimalista e Elegante da Comunidade */}
      <div className="max-w-[1240px] mx-auto px-3 sm:px-6 py-2.5">
        <div className="rounded-2xl bg-[var(--dash-surface)]/95 backdrop-blur-md border border-[#DDD3C4] shadow-md shadow-black/5 px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / Insígnia da Comunidade */}
          <Link
            href={`/comunidades/${community.slug || ''}`}
            className="flex items-center gap-3 min-w-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#5E1417] border border-[#FFA82A]/40 text-[#FFA82A] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <Church className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider block">
                {community.is_headquarters ? 'Igreja Matriz' : 'Comunidade Eclesial'}
              </span>
              <p className="text-sm font-bold text-[#2D1A16] truncate font-serif">
                {community.name}
              </p>
            </div>
          </Link>

          {/* Links de Âncora Centrais (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#5A483E] hover:text-[#2D1A16] hover:bg-[#F3EFE7] transition-all min-h-[38px] flex items-center"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Ações à Direita */}
          <div className="flex items-center gap-2">
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#2D1A16] font-bold text-xs transition-all shadow-xs min-h-[44px]"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Como Chegar</span>
              </a>
            )}

            {/* Botão Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#F3EFE7] text-[#2D1A16] hover:bg-[#EAE4D7] border border-[#DDD3C4] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Abrir Menu de Navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Dropdown Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-3 rounded-2xl bg-[var(--dash-surface)]/98 backdrop-blur-md border border-[#DDD3C4] shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#2D1A16] hover:bg-[#F3EFE7] transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-2 border-t border-[var(--dash-border)] flex flex-col gap-2">
              <div className="flex items-center justify-between px-3 py-2 bg-[var(--dash-surface-secondary)]/60 rounded-xl">
                <span className="text-xs font-semibold text-[#2D1A16]">Acessibilidade:</span>
                <AccessibilityFontScaleControl />
              </div>

              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-[#2D1A16] font-bold text-xs min-h-[44px]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Traçar Rota no Google Maps</span>
                </a>
              )}
              {hasAdminSession && (
                <Link
                  href="/admin/comunidades"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold text-xs min-h-[44px]"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Voltar ao Painel da Comunidade</span>
                </Link>
              )}

              <Link
                href="/comunidades"
                className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--dash-surface-secondary)] text-xs text-[var(--dash-text-secondary)] min-h-[40px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Portal da Paróquia</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
