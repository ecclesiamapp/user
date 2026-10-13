'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Church, 
  Calendar, 
  Newspaper, 
  HeartHandshake, 
  Settings, 
  ExternalLink,
  ShieldCheck, 
  MapPin, 
  User, 
  BookOpen, 
  FileText, 
  Image as ImageIcon,
  X,
  Sparkles,
  Inbox
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavGroup {
  category: string;
  items: {
    href: string;
    label: string;
    icon: React.ElementType;
    exact?: boolean;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    category: 'Geral',
    items: [
      { href: '/admin', label: 'Visão Geral', icon: Church, exact: true },
    ],
  },
  {
    category: 'Secretaria & Atendimento',
    items: [
      { href: '/admin/secretaria', label: 'Secretaria & Inscrições', icon: Inbox, badge: 'Ativo' },
    ],
  },
  {
    category: 'Liturgia & Comunidades',
    items: [
      { href: '/admin/horarios', label: 'Horários de Missa', icon: Calendar },
      { href: '/admin/comunidades', label: '12 Comunidades (CEBs)', icon: MapPin },
      { href: '/admin/folhetos', label: 'Folhetos Litúrgicos', icon: FileText },
    ],
  },
  {
    category: 'Comunicação Pastoral',
    items: [
      { href: '/admin/conteudo', label: 'Avisos & Notícias', icon: Newspaper },
      { href: '/admin/mensagens', label: 'Palavra do Pároco/Bispo', icon: BookOpen },
      { href: '/admin/galerias', label: 'Galerias & Fotos', icon: ImageIcon },
      { href: '/admin/dizimo', label: 'Dízimo & Doações PIX', icon: HeartHandshake },
    ],
  },
  {
    category: 'Configurações',
    items: [
      { href: '/admin/configuracoes', label: 'Identidade & Contato', icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between overflow-y-auto">
      {/* Topo: Identidade da Catedral */}
      <div>
        <div className="p-4 sm:p-5 border-b border-[var(--dash-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              <Church className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold truncate text-[var(--dash-text-primary)]">
                Catedral de Colatina
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--dash-text-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Painel Paroquial</span>
              </div>
            </div>
          </div>

          {/* Botão fechar (apenas no mobile) */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-xl text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)]"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegação por Categorias */}
        <nav className="p-3 space-y-4 text-xs font-medium">
          {NAV_GROUPS.map((group) => (
            <div key={group.category} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] block">
                {group.category}
              </span>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={cn(
                        'flex items-center justify-between px-3 py-2.5 rounded-xl transition-all min-h-[40px]',
                        isActive
                          ? 'bg-[var(--primary)] text-white font-bold shadow-xs'
                          : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)]'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-[var(--dash-text-secondary)]')} />
                        <span className="text-xs">{item.label}</span>
                      </div>

                      {item.badge && !isActive && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Rodapé: Atalho Portal do Fiel + Perfil */}
      <div className="p-3 border-t border-[var(--dash-border)] space-y-2 bg-[var(--dash-surface)]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[var(--dash-surface-secondary)] hover:bg-[var(--dash-surface-hover)] text-xs font-semibold text-[var(--dash-text-primary)] border border-[var(--dash-border)] transition-all"
        >
          <div className="flex items-center gap-2">
            <Church className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Ver Portal do Fiel</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[var(--dash-text-muted)]" />
        </Link>

        <div className="px-3 py-2 rounded-xl bg-[var(--dash-surface-secondary)]/50 border border-[var(--dash-border)]/50 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-xs shrink-0">
            SP
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-[var(--dash-text-primary)] truncate">
              Secretária Paroquial
            </p>
            <p className="text-[10px] text-[var(--dash-text-muted)] truncate">
              Matriz da Catedral
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Sidebar Fixa no Desktop (sticky top-0 h-screen) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 shrink-0 bg-[var(--dash-surface)] border-r border-[var(--dash-border)] z-40">
        {sidebarContent}
      </aside>

      {/* 2. Gaveta Lateral Móvel no Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          {/* Backdrop Escuro */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Conteúdo da Gaveta */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-[var(--dash-surface)] border-r border-[var(--dash-border)] shadow-2xl flex flex-col z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
