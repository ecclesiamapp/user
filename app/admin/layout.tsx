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
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Visão Geral', icon: Church, exact: true },
    { href: '/admin/comunidades', label: 'Comunidades (CEBs)', icon: MapPin },
    { href: '/admin/horarios', label: 'Horários de Missa', icon: Calendar },
    { href: '/admin/conteudo', label: 'Avisos e Notícias', icon: Newspaper },
    { href: '/admin/dizimo', label: 'Dízimo e Doações PIX', icon: HeartHandshake },
    { href: '/admin/configuracoes', label: 'Identidade Visual & Contato', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col md:flex-row">
      {/* Sidebar de Navegação Administrativa */}
      <aside className="w-full md:w-64 bg-[var(--dash-surface)] border-r border-[var(--dash-border)] flex flex-col justify-between shrink-0">
        <div>
          {/* Cabeçalho da Paróquia */}
          <div className="p-5 border-b border-[var(--dash-border)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-lg shadow-xs">
              <Church className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold truncate text-[var(--dash-text-primary)]">Catedral Diocesana</h2>
              <p className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Painel Paroquial
              </p>
            </div>
          </div>

          {/* Menus Principais com Destaque de Rota Ativa */}
          <nav className="p-3 space-y-1 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all',
                    isActive
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs'
                      : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)]'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-[var(--dash-text-secondary)]')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar - Link para o Portal do Fiel */}
        <div className="p-4 border-t border-[var(--dash-border)]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-[var(--dash-surface-secondary)] hover:bg-[var(--dash-border)]/40 text-xs font-semibold text-[var(--dash-text-secondary)] transition-all"
          >
            <span>Ver Portal do Fiel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
