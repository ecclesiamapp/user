'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  ExternalLink, 
  Plus, 
  Church, 
  Calendar, 
  Inbox, 
  MapPin, 
  FileText, 
  Newspaper, 
  BookOpen, 
  ImageIcon, 
  HeartHandshake, 
  Settings,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui';

import { LiturgicalSticker } from './LiturgicalSticker';
import { AdminCommunitySwitcher } from './AdminCommunitySwitcher';

interface AdminTopBarProps {
  onOpenMobileMenu: () => void;
}


const ROUTE_TITLES: Record<string, { title: string; category: string; icon: React.ElementType }> = {
  '/admin': { title: 'Visão Geral', category: 'Painel Geral', icon: Church },
  '/admin/secretaria': { title: 'Secretaria & Inscrições', category: 'Atendimento Pastoral', icon: Inbox },
  '/admin/programacao': { title: 'Festas & Solenidades', category: 'Liturgia', icon: CalendarDays },
  '/admin/horarios': { title: 'Horários de Missa', category: 'Liturgia', icon: Calendar },
  '/admin/comunidades': { title: '12 Comunidades (CEBs)', category: 'Estrutura Paroquial', icon: MapPin },
  '/admin/folhetos': { title: 'Folhetos Litúrgicos', category: 'Liturgia', icon: FileText },
  '/admin/conteudo': { title: 'Avisos & Notícias', category: 'Comunicação', icon: Newspaper },
  '/admin/mensagens': { title: 'Palavra do Pároco/Bispo', category: 'Comunicação', icon: BookOpen },
  '/admin/galerias': { title: 'Galerias & Fotos', category: 'Mídia', icon: ImageIcon },
  '/admin/dizimo': { title: 'Pastoral do Dízimo • Sou do Sagrado', category: 'Pastoral & Evangelização', icon: HeartHandshake },
  '/admin/configuracoes': { title: 'Identidade & Contato', category: 'Configurações', icon: Settings },
};

export function AdminTopBar({ onOpenMobileMenu }: AdminTopBarProps) {
  const pathname = usePathname();

  const currentRoute = ROUTE_TITLES[pathname] || {
    title: 'Painel Administrativo',
    category: 'Catedral Diocesana',
    icon: Church,
  };
  const Icon = currentRoute.icon;

  return (
    <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/95 backdrop-blur-md border-b border-[var(--dash-border)] px-4 sm:px-8 py-3 flex items-center justify-between">
      {/* Lado Esquerdo: Botão Mobile + Breadcrumb Inteligente */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] items-center justify-center font-bold">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] hidden sm:block">
              {currentRoute.category}
            </div>
            <h1 className="text-sm sm:text-base font-bold text-[var(--dash-text-primary)] leading-tight">
              {currentRoute.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Lado Direito: Ações Rápidas & Multi-Comunidades Tenant Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Seletor de Contexto Multi-Comunidades */}
        <AdminCommunitySwitcher />

        {/* Sticker Litúrgico Solene */}
        <LiturgicalSticker />


        {/* Atalho para Simular Agendamento do Fiel */}
        <Link
          href="/secretaria/agendamentos"
          target="_blank"
          className="hidden lg:flex"
        >
          <Button
            size="sm"
            variant="outline"
            className="text-xs font-semibold rounded-xl flex items-center gap-1.5 border-[var(--dash-border)]"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Novo Agendamento</span>
          </Button>
        </Link>

        {/* Ver Portal do Fiel */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex"
        >
          <Button
            size="sm"
            className="text-xs font-semibold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white flex items-center gap-1.5"
          >
            <span>Portal do Fiel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>

        {/* Status de Conexão */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Online</span>
        </div>
      </div>
    </header>
  );
}
