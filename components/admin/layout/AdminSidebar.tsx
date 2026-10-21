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
  Inbox,
  Palette,
  Scroll,
  QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminAppearance } from '@/components/admin/context/AdminAppearanceContext';

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
    category: 'Principal',
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
      { href: '/admin/historia', label: 'História & Memória', icon: Scroll, badge: 'Novo' },
      { href: '/admin/dizimo', label: 'Dízimo & Doações PIX', icon: HeartHandshake },
      { href: '/admin/materiais-impressao', label: 'Cartazes & Bancos', icon: QrCode, badge: 'PWA' },
    ],
  },
  {
    category: 'Administração',
    items: [
      { href: '/admin/configuracoes', label: 'Identidade & Contato', icon: Settings },
      { href: '/admin/aparencia', label: 'Aparência & Tema', icon: Palette },
    ],
  },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { liturgicalColoringEnabled, liturgy } = useAdminAppearance();

  // Define a estilização do item ativo: litúrgico dinâmico ou bordeaux clássico
  const getActiveStyle = () => {
    if (!liturgicalColoringEnabled) {
      return {
        container: 'bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white font-bold border border-[#FFA82A]/40 shadow-md shadow-black/40',
        icon: 'text-[#FFCC36]',
      };
    }

    switch (liturgy.corLiturgica) {
      case 'verde':
        return {
          container: 'bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-bold border border-emerald-400/50 shadow-md shadow-emerald-950/40',
          icon: 'text-emerald-200',
        };
      case 'roxo':
        return {
          container: 'bg-gradient-to-r from-purple-800 to-purple-950 text-white font-bold border border-purple-400/50 shadow-md shadow-purple-950/40',
          icon: 'text-purple-200',
        };
      case 'vermelho':
        return {
          container: 'bg-gradient-to-r from-rose-800 to-rose-950 text-white font-bold border border-rose-400/50 shadow-md shadow-rose-950/40',
          icon: 'text-rose-200',
        };
      case 'rosa':
        return {
          container: 'bg-gradient-to-r from-pink-700 to-pink-900 text-white font-bold border border-pink-400/50 shadow-md shadow-pink-950/40',
          icon: 'text-pink-200',
        };
      case 'branco':
      default:
        return {
          container: 'bg-gradient-to-r from-amber-600 to-amber-850 text-white font-bold border border-amber-300/50 shadow-md shadow-amber-950/40',
          icon: 'text-amber-100',
        };
    }
  };

  const activeStyle = getActiveStyle();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between overflow-y-auto bg-[#16181B] text-[#EAE3D9] select-none">
      {/* Topo: Identidade Visual da Catedral (Estilo St. Patrick's Cathedral) */}
      <div>
        <div className="p-4 sm:p-5 border-b border-[#262A30] flex items-center justify-between bg-[#131417]">
          <Link href="/admin" className="flex items-center gap-3 group text-decoration-none overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B1E22] via-[#5E1417] to-[#2D1A16] border border-[#C8A463]/50 flex items-center justify-center text-[#FFCC36] shadow-md shadow-black/50 group-hover:border-[#FFCC36] transition-colors shrink-0">
              <span className="font-serif text-xl font-bold leading-none select-none">✝</span>
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold truncate text-white tracking-wide group-hover:text-[#FFCC36] transition-colors font-display">
                Catedral de Colatina
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-[#A39E98]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[#C8A463] font-medium">Painel da Secretaria</span>
              </div>
            </div>
          </Link>

          {/* Botão fechar (apenas no mobile) */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-xl text-[#7E838B] hover:text-white hover:bg-[var(--dash-surface)]/10 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegação por Categorias com Alto Contraste */}
        <nav className="p-3 space-y-4 text-xs font-medium">
          {NAV_GROUPS.map((group) => (
            <div key={group.category} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#C8A463]/90 block">
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
                        'flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all min-h-[42px] group',
                        isActive
                          ? activeStyle.container
                          : 'text-[#D2CBC1] hover:text-white hover:bg-[var(--dash-surface)]/10'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive ? activeStyle.icon : 'text-[#9E988F] group-hover:text-[#FFCC36]'
                        )} />
                        <span className="text-xs">{item.label}</span>
                      </div>

                      {item.badge && !isActive && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#FFA82A]/20 text-[#FFCC36] border border-[#FFA82A]/30">
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

      {/* Rodapé: Atalho Portal do Fiel + Perfil da Secretária */}
      <div className="p-3 border-t border-[#262A30] space-y-2 bg-[#131417]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-[var(--dash-surface)]/5 hover:bg-[var(--dash-surface)]/10 text-xs font-semibold text-[#EAE3D9] hover:text-white border border-white/10 hover:border-[#C8A463]/40 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Church className="w-3.5 h-3.5 text-[#FFCC36]" />
            <span>Ver Portal do Fiel</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#7E838B] group-hover:text-white transition-colors" />
        </Link>

        <div className="px-3.5 py-2.5 rounded-xl bg-[#1A1C20] border border-white/5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#8B1E22] text-[#FFCC36] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C8A463]/30 shadow-xs">
            SP
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">
              Secretária Paroquial
            </p>
            <p className="text-[10px] text-[#A39E98] truncate">
              Matriz da Catedral
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Sidebar Fixa no Desktop (sticky top-0 h-screen com fundo nobre escuro) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 shrink-0 bg-[#16181B] border-r border-[#262A30] z-40 shadow-xl shadow-black/20">
        {sidebarContent}
      </aside>

      {/* 2. Gaveta Lateral Móvel no Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          {/* Backdrop Escuro Translúcido */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Conteúdo da Gaveta */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-[#16181B] border-r border-[#262A30] shadow-2xl flex flex-col z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
