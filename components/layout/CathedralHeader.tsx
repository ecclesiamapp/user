'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  Radio, 
  Heart, 
  Calendar, 
  Church, 
  User, 
  FileText, 
  MessageCircle, 
  Sparkles,
  ExternalLink,
  BookOpen,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useAdminSession } from '@/lib/hooks/useAdminSession';

interface CathedralHeaderProps {
  parishName?: string;
  dioceseName?: string;
  whatsappNumber?: string;
  onOpenLiveVideo?: () => void;
}

export function CathedralHeader({
  parishName = 'Catedral de Colatina',
  dioceseName = 'Diocese de Colatina',
  whatsappNumber = '552737221234',
  onOpenLiveVideo,
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

  return (
    <>
      {/* HEADER TRANSLÚCIDO NOBRE (Estilo St. Patrick's Cathedral NY) */}
      <header className="sticky top-0 z-40 w-full bg-[#16181B]/95 backdrop-blur-md border-b border-[#C8A463]/25 transition-all">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* 1. Identidade e Brasão da Catedral */}
          <Link href="/" className="flex items-center gap-3 group text-decoration-none shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#8B1E22] via-[#5E1417] to-[#2D1A16] border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shadow-md shadow-black/40 group-hover:border-[#FFCC36] transition-colors shrink-0">
              <span className="font-serif text-xl sm:text-2xl font-bold leading-none select-none">✝</span>
            </div>
            <div className="shrink-0">
              <span className="block font-cinzel text-sm sm:text-base xl:text-lg font-bold tracking-[0.04em] text-white uppercase leading-tight group-hover:text-[#FFCC36] transition-colors whitespace-nowrap">
                {parishName}
              </span>
              <span className="hidden sm:block text-[10px] xl:text-[11px] font-medium text-[#C8A463] tracking-wide whitespace-nowrap">
                Paróquia Sagrado Coração de Jesus • {dioceseName}
              </span>
            </div>
          </Link>

          {/* 2. Menu Central Desktop: Limpo, Nobre & Sem Quebra de Linhas */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs font-bold tracking-[0.05em] text-[#EAE3D9] uppercase font-sans">
            <Link 
              href="/agenda-liturgica" 
              className="whitespace-nowrap hover:text-[#FFCC36] transition-colors py-2"
            >
              Horários & Missas
            </Link>
            
            <a 
              href="#comunidades" 
              className="whitespace-nowrap hover:text-[#FFCC36] transition-colors py-2"
            >
              Comunidades
            </a>
            
            <Link 
              href="/noticias" 
              className="whitespace-nowrap hover:text-[#FFCC36] transition-colors py-2"
            >
              Notícias
            </Link>
            
            <a 
              href="#secretaria" 
              className="whitespace-nowrap hover:text-[#FFCC36] transition-colors py-2"
            >
              Secretaria
            </a>

            {/* Dropdown Institucional: A Catedral */}
            <div 
              className="relative"
              onMouseEnter={() => setCathedralMenuOpen(true)}
              onMouseLeave={() => setCathedralMenuOpen(false)}
            >
              <button
                onClick={() => setCathedralMenuOpen(!cathedralMenuOpen)}
                type="button"
                className="whitespace-nowrap hover:text-[#FFCC36] transition-colors py-2 flex items-center gap-1 cursor-pointer uppercase text-xs font-bold"
                aria-expanded={cathedralMenuOpen}
              >
                <span>A Catedral</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${cathedralMenuOpen ? 'rotate-180 text-[#FFCC36]' : 'text-[#C8A463]'}`} />
              </button>

              {/* Dropdown Menu Flutuante */}
              {cathedralMenuOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 rounded-2xl bg-[#16181B]/98 backdrop-blur-xl border border-[#C8A463]/30 shadow-2xl shadow-black/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-[#C8A463]/15 mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#C8A463] font-bold block">
                      Institucional & Memória
                    </span>
                    <span className="text-xs text-white/80 font-serif">
                      Catedral Sagrado Coração de Jesus
                    </span>
                  </div>

                  <Link
                    href="/historia"
                    onClick={() => setCathedralMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#8B1E22]/30 text-white/90 hover:text-[#FFCC36] transition-colors group"
                  >
                    <BookOpen className="w-4 h-4 text-[#C8A463] group-hover:scale-110 transition-transform shrink-0" />
                    <div>
                      <span className="block text-xs font-bold normal-case">História & Fé</span>
                      <span className="block text-[10px] text-[#A39E98] normal-case">Linha do tempo centenária</span>
                    </div>
                  </Link>

                  <Link
                    href="/historia#parocos"
                    onClick={() => setCathedralMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#8B1E22]/30 text-white/90 hover:text-[#FFCC36] transition-colors group"
                  >
                    <User className="w-4 h-4 text-[#C8A463] group-hover:scale-110 transition-transform shrink-0" />
                    <div>
                      <span className="block text-xs font-bold normal-case">Pároco & Bispos</span>
                      <span className="block text-[10px] text-[#A39E98] normal-case">Pe. Irineu e sucessão pastoral</span>
                    </div>
                  </Link>

                  <Link
                    href="/historia#patrimonio"
                    onClick={() => setCathedralMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#8B1E22]/30 text-white/90 hover:text-[#FFCC36] transition-colors group"
                  >
                    <Sparkles className="w-4 h-4 text-[#C8A463] group-hover:scale-110 transition-transform shrink-0" />
                    <div>
                      <span className="block text-xs font-bold normal-case">Patrimônio Sacro</span>
                      <span className="block text-[10px] text-[#A39E98] normal-case">Vitrais Casa Conrado e Sinos</span>
                    </div>
                  </Link>

                  <Link
                    href="/dizimo"
                    onClick={() => setCathedralMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#8B1E22]/30 text-white/90 hover:text-[#FFCC36] transition-colors group"
                  >
                    <Heart className="w-4 h-4 text-[#FFA82A] group-hover:scale-110 transition-transform shrink-0" />
                    <div>
                      <span className="block text-xs font-bold normal-case">Dízimo & Ofertas</span>
                      <span className="block text-[10px] text-[#A39E98] normal-case">Sou do Sagrado benfeitores</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* 3. Ações Rápidas à Direita: Ao Vivo + Dízimo + Hambúrguer */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Botão de Transmissão Ao Vivo com Indicador Pulsante St. Patrick's */}
            <button
              onClick={onOpenLiveVideo}
              type="button"
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-[#8B1E22]/30 hover:bg-[#8B1E22]/50 border border-[#D32F2F]/60 text-white text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-sm cursor-pointer"
              title="Assistir Transmissão ao Vivo Oficial"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D32F2F] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D32F2F]" />
              </span>
              <span className="whitespace-nowrap">
                <span className="hidden xl:inline">Missa </span>Ao Vivo
              </span>
            </button>

            {/* Botão de Retorno ao Painel Administrativo para Usuário Logado */}
            {hasAdminSession && (
              <Link
                href="/admin"
                className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 hover:text-amber-200 text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-sm cursor-pointer min-h-[40px]"
                title="Voltar ao Painel Administrativo"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden xl:inline">Painel </span>Admin
              </Link>
            )}

            {/* Botão Dourado de Dízimo / Sou do Sagrado */}
            <Link
              href="/dizimo"
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFA82A] via-[#FFCC36] to-[#FFA82A] hover:brightness-105 text-[#2D1A16] text-xs font-extrabold uppercase tracking-wider font-sans transition-all shadow-md shadow-[#FFA82A]/20 cursor-pointer min-h-[40px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2D1A16] shrink-0" />
              <span className="whitespace-nowrap">Sou do Sagrado</span>
            </Link>

            {/* Botão Hambúrguer Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              className="lg:hidden p-2 rounded-xl text-[#EAE3D9] hover:text-white hover:bg-[var(--dash-surface)]/10 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER: Estilo "Beneditino Digital" (Padre Paulo Ricardo / St. Patrick's) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          {/* Backdrop Blur Escuro */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Painel Lateral que Desliza da Esquerda */}
          <aside className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#0E1012] border-r border-[#C8A463]/25 shadow-2xl flex flex-col justify-between p-6 z-50 overflow-y-auto">
            <div className="space-y-6">
              {/* Topo do Drawer com Brasão e Fechar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#22262B]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#2D1A16] border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36]">
                    <span className="font-serif text-xl font-bold">✝</span>
                  </div>
                  <div>
                    <span className="block font-display text-base font-bold text-white leading-tight">
                      {parishName}
                    </span>
                    <span className="block text-[10px] text-[#C8A463]">
                      Catedral Diocesana
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  type="button"
                  className="p-1.5 rounded-lg text-[#7E838B] hover:text-white hover:bg-[var(--dash-surface)]/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Card de Retorno ao Painel Administrativo para Usuário Logado */}
              {hasAdminSession && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider shadow-sm min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Painel Administrativo</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-normal">Voltar ➔</span>
                </Link>
              )}

              {/* Seletor de Acessibilidade (Fiéis Idosos) */}
              <div className="bg-[#1B1E22] rounded-xl p-3 border border-[#22262B] flex items-center justify-between text-xs">
                <span className="text-[#A39E98] font-medium">Tamanho da Letra:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleFontSizeChange('sm')}
                    className={`px-2.5 py-1 rounded-lg font-bold ${fontSizeLevel === 'sm' ? 'bg-[#C8A463] text-[#121314]' : 'bg-[#22262B] text-[#A39E98]'}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => handleFontSizeChange('md')}
                    className={`px-2.5 py-1 rounded-lg font-bold ${fontSizeLevel === 'md' ? 'bg-[#C8A463] text-[#121314]' : 'bg-[#22262B] text-[#A39E98]'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => handleFontSizeChange('lg')}
                    className={`px-2.5 py-1 rounded-lg font-bold ${fontSizeLevel === 'lg' ? 'bg-[#C8A463] text-[#121314]' : 'bg-[#22262B] text-[#A39E98]'}`}
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Links de Navegação Agrupados */}
              <div className="space-y-5">
                <div>
                  <span className="block text-[11px] font-bold text-[#7E838B] uppercase tracking-wider mb-2">
                    Liturgia & Vida
                  </span>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="/agenda-liturgica"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F3EF] hover:bg-[#1B1E22] hover:text-[#FFCC36] transition-colors text-sm font-medium"
                      >
                        <Calendar className="w-4 h-4 text-[#C8A463]" />
                        <span>Agenda Litúrgica</span>
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#comunidades"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F3EF] hover:bg-[#1B1E22] hover:text-[#FFCC36] transition-colors text-sm font-medium"
                      >
                        <Church className="w-4 h-4 text-[#C8A463]" />
                        <span>12 Comunidades (CEBs)</span>
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/historia"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F3EF] hover:bg-[#1B1E22] hover:text-[#FFCC36] transition-colors text-sm font-medium"
                      >
                        <BookOpen className="w-4 h-4 text-[#C8A463]" />
                        <span>Nossa História & Catedral</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <span className="block text-[11px] font-bold text-[#7E838B] uppercase tracking-wider mb-2">
                    Secretaria & Pastorais
                  </span>
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="#secretaria"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F3EF] hover:bg-[#1B1E22] hover:text-[#FFCC36] transition-colors text-sm font-medium"
                      >
                        <User className="w-4 h-4 text-[#C8A463]" />
                        <span>Sacramentos & Atendimento</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#paroco"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F3EF] hover:bg-[#1B1E22] hover:text-[#FFCC36] transition-colors text-sm font-medium"
                      >
                        <Sparkles className="w-4 h-4 text-[#C8A463]" />
                        <span>O Pároco (Pe. Irineu)</span>
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/noticias"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F3EF] hover:bg-[#1B1E22] hover:text-[#FFCC36] transition-colors text-sm font-medium"
                      >
                        <FileText className="w-4 h-4 text-[#C8A463]" />
                        <span>Notícias & Avisos</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Rodapé do Drawer com Ações Rápidas */}
            <div className="pt-4 border-t border-[#22262B] space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLiveVideo?.();
                }}
                type="button"
                className="w-full py-2.5 px-4 rounded-xl bg-[#8B1E22] hover:bg-[#721C24] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Radio className="w-4 h-4 text-[#FFCC36] animate-pulse" />
                <span>Assistir Missa Ao Vivo</span>
              </button>

              <Link
                href="/dizimo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFA82A] to-[#FFCC36] text-[#2D1A16] text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
              >
                <Heart className="w-4 h-4 text-[#8B1E22]" />
                <span>Sou do Sagrado (Dízimo & PIX)</span>
              </Link>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Olá,%20gostaria%20de%20informações%20da%20secretaria%20da%20Catedral.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 rounded-xl bg-[#1B1E22] hover:bg-[#22262B] text-[#25D366] text-xs font-semibold flex items-center justify-center gap-2 border border-[#22262B]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp da Secretaria</span>
              </a>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-[var(--dash-surface)]/5 text-[#A39E98] hover:text-[#C8A463] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Acesso Administrativo (Clero & Secretaria)</span>
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
