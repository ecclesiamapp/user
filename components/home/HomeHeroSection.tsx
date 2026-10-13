'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  Radio, 
  HeartHandshake, 
  Sparkles, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2,
  Play,
  Volume2
} from 'lucide-react';

interface HomeHeroSectionProps {
  parishName?: string;
  dioceseName?: string;
  isLiveModalOpen?: boolean;
  setIsLiveModalOpen?: (open: boolean) => void;
}

export function HomeHeroSection({
  parishName = 'Catedral de Colatina',
  dioceseName = 'Diocese de Colatina',
  isLiveModalOpen: externalIsLiveOpen,
  setIsLiveModalOpen: externalSetIsLiveOpen,
}: HomeHeroSectionProps) {
  const [internalLiveModalOpen, setInternalLiveModalOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const isModalOpen = externalIsLiveOpen !== undefined ? externalIsLiveOpen : internalLiveModalOpen;
  const setModalOpen = externalSetIsLiveOpen !== undefined ? externalSetIsLiveOpen : setInternalLiveModalOpen;

  // Vídeo oficial de St. Patrick's Cathedral NYC (Santa Missa Dominical no Altar-Mor — Embed autêntico)
  const stPatricksVideoId = "e6Fl-vDe5mk";
  const stPatricksEmbedUrl = `https://www.youtube-nocookie.com/embed/${stPatricksVideoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="relative w-full -mt-20">
      {/* 1. HERO MONUMENTAL IMERSIVO (St. Patrick's Cathedral NYC Style) */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] pt-36 pb-28 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center overflow-hidden bg-[#16181B]">
        
        {/* Fotografia Base em Alta Resolução da Catedral */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1548625361-195fe5795df5?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />

        {/* VÍDEO AMBIENTAL DE FUNDO (St. Patrick's Cathedral NYC — Ativo a partir de telas sm: para poupar bateria e dados móveis em celulares populares) */}
        <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none select-none z-1">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${stPatricksVideoId}?autoplay=1&mute=1&loop=1&playlist=${stPatricksVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1`}
            title="St. Patrick's Cathedral NYC Ambient Footage"
            className="w-[140%] h-[140%] -translate-x-[15%] -translate-y-[15%] object-cover border-0 opacity-75"
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={() => setVideoLoaded(true)}
          />
        </div>

        {/* Gradiente Cinematográfico Translúcido (Basalto Catedral #16181B) */}
        <div 
          className="absolute inset-0 pointer-events-none z-2"
          style={{
            background: 'linear-gradient(to bottom, rgba(22, 24, 27, 0.40) 0%, rgba(22, 24, 27, 0.60) 45%, rgba(22, 24, 27, 0.95) 100%)',
          }}
        />

        {/* Conteúdo Centralizado Monumental com Tipografia Sacra Cinzel & Cormorant */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16181B]/85 backdrop-blur-md border border-[#C8A463]/50 text-xs font-bold text-[#FFCC36] tracking-[0.18em] uppercase shadow-md font-sans">
            <Sparkles className="w-3.5 h-3.5 text-[#FFA82A]" />
            <span>Casa de Fé, Oração e Acolhimento</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[0.08em] uppercase leading-[1.15] drop-shadow-xl">
            Bem-vindo à Catedral do <span className="text-[#FFCC36]">Sagrado Coração</span>
          </h1>

          <p className="font-serif italic text-base sm:text-xl text-[#F8F7F4]/90 leading-relaxed max-w-2xl mx-auto font-light drop-shadow-md">
            A Casa Mãe da Diocese de Colatina abre seus braços e seu coração para acolher você e sua família em comunidade.
          </p>

          {/* Botões de Ação na Dobra de Destaque */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-sans">
            <a
              href="#horarios"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FFA82A] via-[#FFCC36] to-[#FFA82A] hover:brightness-105 text-[#2D1A16] font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-[#FFA82A]/20 transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#2D1A16]" />
              <span>Ver Horários de Missas</span>
            </a>

            <button
              onClick={() => setModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#16181B]/90 hover:bg-[#8B1E22]/60 backdrop-blur-md text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-[#D32F2F] shadow-lg transition-all cursor-pointer group"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D32F2F] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D32F2F]" />
              </span>
              <span>Assistir Missa Ao Vivo (St. Patrick's Feed)</span>
            </button>
          </div>

          {/* Badge Informativo do Vídeo Ambiente Ativo */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#C8A463] font-sans">
            <Radio className="w-3.5 h-3.5 text-[#D32F2F] animate-pulse" />
            <span className="font-medium tracking-wide">
              Vídeo Oficial de Fundo: St. Patrick's Cathedral NYC •
            </span>
            <button
              onClick={() => setModalOpen(true)}
              className="underline hover:text-white font-bold cursor-pointer transition-colors"
            >
              Abrir Transmissão com som
            </button>
          </div>
        </div>
      </section>

      {/* 2. FLOATING SCHEDULE CARD (St. Patrick's "Today's Schedule" — 3 Colunas Alabastro) */}
      <div className="relative z-20 max-w-[1240px] mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20">
        <div className="bg-white rounded-2xl border border-[#C8A463]/40 shadow-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#EAE3D9]">
          
          {/* Coluna 1: Celebração de Hoje */}
          <div className="flex flex-col justify-between space-y-3 md:pr-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B1E22]" />
                  Celebração de Hoje
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Confirmada
                </span>
              </div>
              <h3 className="font-cinzel text-lg font-bold text-[#2D1A16] uppercase tracking-wide mt-2">
                Santa Missa na Matriz
              </h3>
              <div className="text-3xl sm:text-4xl font-black text-[#8B1E22] tabular-nums mt-1 font-sans">
                19:30
              </div>
              <p className="text-xs text-[#514D4B] mt-1 leading-snug">
                Catedral Sagrado Coração de Jesus • Presidida por Pe. Irineu Sales
              </p>
            </div>

            <a
              href="#horarios"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#03637A] hover:text-[#02495A] transition-colors pt-2"
            >
              <span>Ver grade de missas da semana</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Coluna 2: Sacramento do Perdão (Confissões) */}
          <div className="flex flex-col justify-between space-y-3 pt-6 md:pt-0 md:px-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFA82A]/15 text-[#B75319] text-[11px] font-bold uppercase tracking-wider">
                <HeartHandshake className="w-3 h-3 text-[#B75319]" />
                Sacramento do Perdão
              </span>
              <h3 className="font-cinzel text-lg font-bold text-[#2D1A16] uppercase tracking-wide mt-2">
                Confissões & Atendimento
              </h3>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2D1A16] tabular-nums mt-1 font-sans">
                16:00 às 18:00
              </div>
              <p className="text-xs text-[#514D4B] mt-1 leading-snug">
                Todas as Terças e Quintas-feiras na Secretaria Paroquial
              </p>
            </div>

            <a
              href="#secretaria"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#03637A] hover:text-[#02495A] transition-colors pt-2"
            >
              <span>Como se preparar para a confissão</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Coluna 3: Expediente Paroquial */}
          <div className="flex flex-col justify-between space-y-3 pt-6 md:pt-0 md:pl-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#356B58]/10 text-[#356B58] text-[11px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-[#356B58]" />
                Expediente Paroquial
              </span>
              <h3 className="font-cinzel text-lg font-bold text-[#2D1A16] uppercase tracking-wide mt-2">
                Secretaria Aberta
              </h3>
              <div className="text-xs text-[#514D4B] space-y-1 mt-2">
                <p><strong>Segunda a Sexta:</strong> 08:00 às 17:00 (Ininterrupto)</p>
                <p><strong>Sábado:</strong> 08:00 às 12:00</p>
              </div>
              <p className="text-xs text-[#8A8580] mt-1">
                Plantão de atendimento presencial e via WhatsApp
              </p>
            </div>

            <a
              href="#secretaria"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#03637A] hover:text-[#02495A] transition-colors pt-2"
            >
              <span>Pedir certidão ou agendamento</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>

      {/* 3. MODAL DE TRANSMISSÃO AO VIVO COM VÍDEO OFICIAL DE ST. PATRICK'S */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#16181B] rounded-2xl border border-[#C8A463]/50 shadow-2xl overflow-hidden text-white flex flex-col">
            {/* Cabeçalho do Modal */}
            <div className="p-4 sm:p-5 border-b border-[#2B2A28] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D32F2F] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D32F2F]" />
                </span>
                <div>
                  <h4 className="font-cinzel text-base sm:text-lg font-bold text-white uppercase tracking-wider leading-tight">
                    Transmissão Ao Vivo • Catedral de Colatina
                  </h4>
                  <p className="text-xs text-[#C8A463]">
                    Feed Oficial: St. Patrick's Cathedral NYC Broadcast
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-[#A39E98] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Fechar vídeo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Player do Vídeo do YouTube */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={stPatricksEmbedUrl}
                title="St. Patrick's Cathedral New York Video Broadcast"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Rodapé do Modal com Informações Pastorais */}
            <div className="p-4 bg-[#0E1012] border-t border-[#2B2A28] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A39E98]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FFA82A]" />
                <span>Transmissão litúrgica sem anúncios comerciais.</span>
              </div>
              <a
                href="https://www.youtube.com/@SaintPatricksCathedralNYC"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#FFCC36] hover:underline"
              >
                Abrir no YouTube Oficial →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
