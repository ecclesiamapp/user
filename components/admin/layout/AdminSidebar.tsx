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
  ShieldCheck,
  MapPin,
  BookOpen,
  FileText,
  Image as ImageIcon,
  X,
  Sparkles,
  Inbox,
  Palette,
  Scroll,
  QrCode,
  CalendarDays,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminAppearance } from '@/components/admin/context/AdminAppearanceContext';
import { useAdminCommunity } from '@/components/admin/context/AdminCommunityContext';
import { AdminSidebarFooter } from './AdminSidebarFooter';

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
    items: [{ href: '/admin', label: 'Visão Geral', icon: Church, exact: true }],
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
      { href: '/admin/programacao', label: 'Festas & Solenidades', icon: CalendarDays, badge: 'Novo' },
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
      { href: '/admin/dizimo', label: 'Pastoral do Dízimo', icon: HeartHandshake },
      { href: '/admin/materiais-impressao', label: 'Cartazes & Bancos', icon: QrCode, badge: 'PWA' },
    ],
  },
  {
    category: 'Inteligência Paroquial',
    items: [
      { href: '/admin/assistente-ia', label: 'Assistente IA & RAG', icon: Sparkles, badge: 'IA' },
    ],
  },
  {
    category: 'Identidade & Administração',
    items: [
      { href: '/admin/usuarios', label: 'Gestão de Usuários', icon: ShieldCheck, badge: 'RBAC' },
      { href: '/admin/marca', label: 'Hub de Marca & Moodboard', icon: Palette, badge: 'Novo' },
      { href: '/admin/configuracoes', label: 'Dados da Paróquia', icon: Settings },
      { href: '/admin/aparencia', label: 'Tema Litúrgico', icon: Sparkles },
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
  const {
    parishes,
    activeParish,
    setActiveParishId,
    currentUser,
    hasModulePermission,
    selectedCommunity,
    logout,
  } = useAdminCommunity();

  const activeNavGroups = React.useMemo<NavGroup[]>(() => {
    if (currentUser?.role === 'coordenador_ceb') {
      const cebItems: NavGroup['items'] = [
        { href: '/admin/comunidades', label: 'Minha Comunidade & LP', icon: MapPin, exact: true, badge: 'CEB' },
      ];
      if (hasModulePermission('horarios')) cebItems.push({ href: '/admin/horarios', label: 'Horários de Missa', icon: Calendar });
      if (hasModulePermission('avisos')) cebItems.push({ href: '/admin/conteudo', label: 'Avisos da Comunidade', icon: Newspaper });
      if (hasModulePermission('galerias')) cebItems.push({ href: '/admin/galerias', label: 'Fotos & Galerias', icon: ImageIcon });
      if (hasModulePermission('dizimo')) cebItems.push({ href: '/admin/dizimo', label: 'Pastoral do Dízimo', icon: HeartHandshake });
      return [{ category: selectedCommunity?.name || 'Painel da Comunidade', items: cebItems }];
    }

    if (currentUser?.role === 'pascom') {
      return [
        {
          category: 'Comunicação & PASCOM',
          items: [
            { href: '/admin', label: 'Visão Geral', icon: Church, exact: true },
            { href: '/admin/conteudo', label: 'Avisos & Notícias', icon: Newspaper },
            { href: '/admin/programacao', label: 'Festas & Solenidades', icon: CalendarDays, badge: 'Festas' },
            { href: '/admin/galerias', label: 'Galerias & Fotos', icon: ImageIcon },
            { href: '/admin/mensagens', label: 'Palavra do Pároco/Bispo', icon: BookOpen },
            { href: '/admin/historia', label: 'História & Memória', icon: Scroll },
            { href: '/admin/materiais-impressao', label: 'Cartazes & Bancos', icon: QrCode, badge: 'PWA' },
            { href: '/admin/marca', label: 'Hub de Marca & Moodboard', icon: Palette },
            { href: '/admin/assistente-ia', label: 'Assistente IA & RAG', icon: Sparkles, badge: 'IA' },
          ],
        },
      ];
    }

    if (currentUser?.role === 'secretaria') {
      return NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.href !== '/admin/usuarios'),
      }));
    }

    if (currentUser?.role === 'superadmin') {
      return [
        {
          category: 'Governança SaaS',
          items: [
            {
              href: '/admin/superadmin',
              label: 'Hub SaaS Master',
              icon: Building2,
              badge: 'Master',
            },
          ],
        },
        ...NAV_GROUPS,
      ];
    }

    return NAV_GROUPS;
  }, [currentUser, hasModulePermission, selectedCommunity]);

  const getActiveStyle = () => {
    if (!liturgicalColoringEnabled) {
      return {
        container: 'bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-[#FAF6F0] font-bold border border-[#FFA82A]/40 shadow-md',
        icon: 'text-[#FFCC36]',
        text: 'text-[#FAF6F0] font-bold',
      };
    }

    const colorMap: Record<string, { container: string; icon: string; text: string }> = {
      verde: { container: 'bg-gradient-to-r from-emerald-700 to-emerald-900 text-[#FAF6F0] font-bold border border-emerald-400/50 shadow-md', icon: 'text-emerald-200', text: 'text-[#FAF6F0] font-bold' },
      roxo: { container: 'bg-gradient-to-r from-purple-800 to-purple-950 text-[#FAF6F0] font-bold border border-purple-400/50 shadow-md', icon: 'text-purple-200', text: 'text-[#FAF6F0] font-bold' },
      vermelho: { container: 'bg-gradient-to-r from-rose-800 to-rose-950 text-[#FAF6F0] font-bold border border-rose-400/50 shadow-md', icon: 'text-rose-200', text: 'text-[#FAF6F0] font-bold' },
      rosa: { container: 'bg-gradient-to-r from-pink-700 to-pink-900 text-[#FAF6F0] font-bold border border-pink-400/50 shadow-md', icon: 'text-pink-200', text: 'text-[#FAF6F0] font-bold' },
    };

    return (
      colorMap[liturgy.corLiturgica] || {
        container: 'bg-[#FFFFFF] text-slate-800 font-extrabold border-2 border-[#FFA82A] shadow-md',
        icon: 'text-[#FFA82A]',
        text: 'text-slate-800 font-extrabold',
      }
    );
  };

  const activeStyle = getActiveStyle();
  const parishDisplayTitle = activeParish?.name || 'Painel Paroquial';

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between overflow-y-auto bg-[#16181B] text-[#EAE3D9] select-none">
      <div>
        <div className="p-4 sm:p-5 border-b border-[#262A30] flex items-center justify-between bg-[#131417]">
          <Link href="/admin" className="flex items-center gap-3 group text-decoration-none overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B1E22] via-[#5E1417] to-[#2D1A16] border border-[#C8A463]/50 flex items-center justify-center text-[#FFCC36] shadow-md group-hover:border-[#FFCC36] transition-colors shrink-0">
              <span className="font-serif text-xl font-bold leading-none select-none">✝</span>
            </div>
            <div className="overflow-hidden">
              <h2
                title={parishDisplayTitle}
                className="text-sm font-bold truncate text-[#FAF6F0] tracking-wide group-hover:text-[#FFCC36] transition-colors font-display"
              >
                {parishDisplayTitle}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-[#A39E98] max-w-[175px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[#C8A463] font-medium truncate">
                  {selectedCommunity
                    ? selectedCommunity.name
                    : currentUser?.role === 'pascom'
                    ? 'Painel da PASCOM'
                    : 'Painel da Paróquia'}
                </span>
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-xl text-[#7E838B] hover:text-[#FAF6F0] hover:bg-[var(--dash-surface)]/10 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-4 text-xs font-medium">
          {activeNavGroups.map((group) => (
            <div key={group.category} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#C8A463]/90 block">
                {group.category}
              </span>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={cn(
                        'flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all min-h-[42px] group',
                        isActive ? activeStyle.container : 'text-[#D2CBC1] hover:text-[#FAF6F0] hover:bg-[var(--dash-surface)]/10'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn('w-4 h-4 shrink-0 transition-colors', isActive ? activeStyle.icon : 'text-[#9E988F] group-hover:text-[#FFCC36]')} />
                        <span className={cn('text-xs', isActive && activeStyle.text ? activeStyle.text : '')}>{item.label}</span>
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

      <AdminSidebarFooter
        currentUser={currentUser}
        selectedCommunity={selectedCommunity}
        parishes={parishes}
        activeParish={activeParish}
        onSelectParish={setActiveParishId}
        onLogout={logout}
      />
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 shrink-0 bg-[#16181B] border-r border-[#262A30] z-40 shadow-xl">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          <div className="fixed inset-0 bg-[#07090E]/80 backdrop-blur-xs transition-opacity" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-[#16181B] border-r border-[#262A30] shadow-2xl flex flex-col z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
