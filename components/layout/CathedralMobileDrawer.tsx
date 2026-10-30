'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Radio,
  Heart,
  Calendar,
  Church,
  User,
  FileText,
  MessageCircle,
  Sparkles,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { ResolvedEventTheme } from '@/lib/events';

interface CathedralMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  parishName: string;
  whatsappNumber: string;
  hasAdminSession: boolean;
  fontSizeLevel: 'sm' | 'md' | 'lg';
  onFontSizeChange: (level: 'sm' | 'md' | 'lg') => void;
  onOpenLiveVideo?: () => void;
  themeOverride?: ResolvedEventTheme;
}

export function CathedralMobileDrawer({
  isOpen,
  onClose,
  parishName,
  whatsappNumber,
  hasAdminSession,
  fontSizeLevel,
  onFontSizeChange,
  onOpenLiveVideo,
  themeOverride,
}: CathedralMobileDrawerProps) {
  if (!isOpen) return null;

  const t = themeOverride;
  const drawerBg = t ? t.pageBg : '#0E1012';
  const surfaceBg = t ? t.surfaceBg : '#1B1E22';
  const borderCol = t ? t.borderSubtle : '#22262B';
  const primaryCol = t ? t.primary : '#8B1E22';
  const accentCol = t ? t.secondary : '#FFCC36';
  const goldMuted = t ? t.secondary : '#C8A463';
  const ctaText = t ? t.ctaTextOnSecondary : '#2D1A16';

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside
        style={{ backgroundColor: drawerBg, borderColor: borderCol }}
        className="fixed inset-y-0 left-0 w-80 max-w-[85vw] border-r shadow-2xl flex flex-col justify-between p-6 z-50 overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Topo do Drawer com Brasão e Fechar */}
          <div
            style={{ borderColor: borderCol }}
            className="flex items-center justify-between pb-4 border-b"
          >
            <div className="flex items-center gap-3">
              <div
                style={{
                  background: `linear-gradient(135deg, ${primaryCol}, ${drawerBg})`,
                  borderColor: `${goldMuted}66`,
                  color: accentCol,
                }}
                className="w-9 h-9 rounded-xl border flex items-center justify-center"
              >
                <span className="font-serif text-xl font-bold">✝</span>
              </div>
              <div>
                <span className="block font-display text-base font-bold text-[#FAF6F0] leading-tight">
                  {parishName}
                </span>
                <span style={{ color: goldMuted }} className="block text-[10px]">
                  Catedral Diocesana
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#FAF6F0] hover:bg-[var(--dash-surface)]/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {hasAdminSession && (
            <Link
              href="/admin"
              onClick={onClose}
              style={{
                backgroundColor: `${accentCol}20`,
                borderColor: `${accentCol}55`,
                color: accentCol,
              }}
              className="flex items-center justify-between p-3.5 rounded-xl border font-bold text-xs uppercase tracking-wider shadow-sm min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Painel Administrativo</span>
              </div>
              <span className="text-[10px] font-normal">Voltar ➔</span>
            </Link>
          )}

          {/* Seletor de Acessibilidade */}
          <div
            style={{ backgroundColor: surfaceBg, borderColor: borderCol }}
            className="rounded-xl p-3 border flex items-center justify-between text-xs"
          >
            <span className="text-[#CBD5E1] font-medium">Tamanho da Letra:</span>
            <div className="flex items-center gap-1.5">
              {(['sm', 'md', 'lg'] as const).map((lvl, idx) => {
                const label = idx === 0 ? 'A-' : idx === 1 ? 'A' : 'A+';
                const active = fontSizeLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onFontSizeChange(lvl)}
                    style={
                      active
                        ? { backgroundColor: goldMuted, color: ctaText }
                        : { backgroundColor: drawerBg, color: '#94A3B8' }
                    }
                    className="px-2.5 py-1 rounded-lg font-bold cursor-pointer"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Links de Navegação */}
          <div className="space-y-5">
            <div>
              <span className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Liturgia & Vida
              </span>
              <ul className="space-y-1">
                {[
                  { href: '/agenda-liturgica', icon: Calendar, label: 'Agenda Litúrgica' },
                  { href: '/comunidades', icon: Church, label: '12 Comunidades (CEBs)' },
                  { href: '/historia', icon: BookOpen, label: 'Nossa História & Catedral' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F3EF] hover:opacity-90 transition-opacity text-sm font-medium"
                      >
                        <Icon className="w-4 h-4" style={{ color: goldMuted }} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Secretaria & Pastorais
              </span>
              <ul className="space-y-1">
                {[
                  { href: '/secretaria', icon: User, label: 'Sacramentos & Atendimento' },
                  { href: '/historia#parocos', icon: Sparkles, label: 'O Pároco (Pe. Irineu)' },
                  { href: '/noticias', icon: FileText, label: 'Notícias & Avisos' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F3EF] hover:opacity-90 transition-opacity text-sm font-medium"
                      >
                        <Icon className="w-4 h-4" style={{ color: goldMuted }} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Rodapé do Drawer */}
        <div style={{ borderColor: borderCol }} className="pt-4 border-t space-y-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenLiveVideo?.();
            }}
            type="button"
            style={{ backgroundColor: primaryCol }}
            className="w-full py-2.5 px-4 rounded-xl hover:brightness-110 text-[#FAF6F0] text-xs font-bold flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
          >
            <Radio className="w-4 h-4 animate-pulse" style={{ color: accentCol }} />
            <span>Assistir Missa Ao Vivo</span>
          </button>

          <Link
            href="/dizimo"
            onClick={onClose}
            style={{
              backgroundColor: accentCol,
              color: ctaText,
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
          >
            <Heart className="w-4 h-4" />
            <span>Sou do Sagrado (Dízimo & PIX)</span>
          </Link>

          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Olá,%20gostaria%20de%20informações%20da%20secretaria%20da%20Catedral.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: surfaceBg, borderColor: borderCol }}
            className="w-full py-2 px-4 rounded-xl text-[#25D366] text-xs font-semibold flex items-center justify-center gap-2 border min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp da Secretaria</span>
          </a>

          <Link
            href="/admin"
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-transparent text-[#94A3B8] hover:text-[#FAF6F0] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Acesso Administrativo (Clero & Secretaria)</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
