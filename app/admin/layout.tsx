import React from 'react';
import Link from 'next/link';
import { 
  Church, 
  Calendar, 
  Newspaper, 
  HeartHandshake, 
  Settings, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col md:flex-row">
      {/* Sidebar de Navegação Administrativa */}
      <aside className="w-full md:w-64 bg-[var(--dash-surface)] border-r border-[var(--dash-border)] flex flex-col justify-between shrink-0">
        <div>
          {/* Cabeçalho da Paróquia */}
          <div className="p-5 border-b border-[var(--dash-border)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-lg shadow-sm">
              <Church className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold truncate">Catedral Diocesana</h2>
              <p className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Painel Paroquial
              </p>
            </div>
          </div>

          {/* Menus Principais */}
          <nav className="p-3 space-y-1 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] transition-colors"
            >
              <Church className="w-4 h-4 text-[var(--dash-text-secondary)]" />
              Visão Geral
            </Link>
            <Link
              href="/admin/horarios"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] transition-colors"
            >
              <Calendar className="w-4 h-4 text-[var(--dash-text-secondary)]" />
              Horários de Missa
            </Link>
            <Link
              href="/admin/conteudo"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] transition-colors"
            >
              <Newspaper className="w-4 h-4 text-[var(--dash-text-secondary)]" />
              Avisos e Notícias
            </Link>
            <Link
              href="/admin/dizimo"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] transition-colors"
            >
              <HeartHandshake className="w-4 h-4 text-[var(--dash-text-secondary)]" />
              Dízimo e Doações PIX
            </Link>
            <Link
              href="/admin/configuracoes"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] transition-colors"
            >
              <Settings className="w-4 h-4 text-[var(--dash-text-secondary)]" />
              Identidade Visual & Contato
            </Link>
          </nav>
        </div>

        {/* Rodapé da Sidebar - Link para o Portal do Fiel */}
        <div className="p-4 border-t border-[var(--dash-border)]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-[var(--dash-surface-secondary)] hover:opacity-90 text-xs font-semibold text-[var(--dash-text-secondary)] transition-all"
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
