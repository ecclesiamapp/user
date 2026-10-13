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
  ExternalLink
} from 'lucide-react';

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
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'md' | 'lg'>('md');

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
      <header className="sticky top-0 z-40 w-full bg-[#16181B]/90 backdrop-blur-md border-b border-[#C8A463]/25 transition-all">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* 1. Identidade e Brasão da Catedral */}
          <Link href="/" className="flex items-center gap-3.5 group text-decoration-none">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B1E22] via-[#5E1417] to-[#2D1A16] border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shadow-md shadow-black/40 group-hover:border-[#FFCC36] transition-colors shrink-0">
              <span className="font-serif text-2xl font-bold leading-none select-none">✝</span>
            </div>
            <div>
              <span className="block font-cinzel text-base sm:text-lg font-bold tracking-[0.06em] text-white uppercase leading-tight group-hover:text-[#FFCC36] transition-colors">
                {parishName}
              </span>
              <span className="block text-[11px] sm:text-xs font-medium text-[#C8A463] tracking-wide">
                Paróquia Sagrado Coração de Jesus • {dioceseName}
              </span>
            </div>
          </Link>

          {/* 2. Menu Central Desktop (Links Diretos Solenes com Estilo St. Patrick's) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-[0.08em] text-[#EAE3D9] uppercase font-sans">
            <a href="#horarios" className="hover:text-[#FFCC36] transition-colors">
              Missas & Horários
            </a>
            <a href="#comunidades" className="hover:text-[#FFCC36] transition-colors">
              12 Comunidades
            </a>
            <a href="#secretaria" className="hover:text-[#FFCC36] transition-colors">
              Secretaria
            </a>
            <a href="#comunicados" className="hover:text-[#FFCC36] transition-colors">
              Notícias
            </a>
            <a href="#paroco" className="hover:text-[#FFCC36] transition-colors">
              O Pároco
            </a>
          </nav>

          {/* 3. Ações Rápidas à Direita: Ao Vivo + Dízimo + Hambúrguer */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Botão de Transmissão Ao Vivo com Indicador Pulsante St. Patrick's */}
            <button
              onClick={onOpenLiveVideo}
              type="button"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#8B1E22]/30 hover:bg-[#8B1E22]/50 border border-[#D32F2F]/60 text-white text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-sm cursor-pointer"
              title="Assistir Transmissão ao Vivo Oficial"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D32F2F] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D32F2F]" />
              </span>
              <span className="hidden sm:inline">Missa</span> Ao Vivo
            </button>

            {/* Botão Dourado de Dízimo / Sou do Sagrado */}
            <a
              href="#dizimo"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFA82A] via-[#FFCC36] to-[#FFA82A] hover:brightness-105 text-[#2D1A16] text-xs font-extrabold uppercase tracking-wider font-sans transition-all shadow-md shadow-[#FFA82A]/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2D1A16]" />
              <span>Sou do Sagrado</span>
            </a>

            {/* Botão Hambúrguer Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              className="lg:hidden p-2 rounded-xl text-[#EAE3D9] hover:text-white hover:bg-white/10 transition-colors"
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
                  className="p-1.5 rounded-lg text-[#7E838B] hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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
                      <a
                        href="#horarios"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F3EF] hover:bg-[#1B1E22] hover:text-[#FFCC36] transition-colors text-sm font-medium"
                      >
                        <Calendar className="w-4 h-4 text-[#C8A463]" />
                        <span>Missas & Confissões</span>
                      </a>
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
                      <a
                        href="#comunicados"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F3EF] hover:bg-[#1B1E22] hover:text-[#FFCC36] transition-colors text-sm font-medium"
                      >
                        <FileText className="w-4 h-4 text-[#C8A463]" />
                        <span>Notícias & Avisos</span>
                      </a>
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

              <a
                href="#dizimo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFA82A] to-[#FFCC36] text-[#2D1A16] text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm"
              >
                <Heart className="w-4 h-4 text-[#8B1E22]" />
                <span>Sou do Sagrado (Dízimo & PIX)</span>
              </a>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Olá,%20gostaria%20de%20informações%20da%20secretaria%20da%20Catedral.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 rounded-xl bg-[#1B1E22] hover:bg-[#22262B] text-[#25D366] text-xs font-semibold flex items-center justify-center gap-2 border border-[#22262B]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp da Secretaria</span>
              </a>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
