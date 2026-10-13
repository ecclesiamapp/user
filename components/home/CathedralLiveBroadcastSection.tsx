'use client';

import React, { useState } from 'react';
import { Radio, ShieldCheck, ExternalLink, Maximize2, FileText, Sparkles, Volume2 } from 'lucide-react';

interface CathedralLiveBroadcastSectionProps {
  onOpenTheaterModal?: () => void;
}

export function CathedralLiveBroadcastSection({
  onOpenTheaterModal,
}: CathedralLiveBroadcastSectionProps) {
  // Vídeo oficial verificado: Santa Missa Dominical no Altar-Mor de St. Patrick's Cathedral NYC
  const [activeVideoId, setActiveVideoId] = useState('e6Fl-vDe5mk');

  const videoOptions = [
    {
      id: 'e6Fl-vDe5mk',
      title: 'Missa Dominical Solene',
      subtitle: 'Altar-Mor • St. Patrick\'s Cathedral NYC',
      badge: 'Principal',
    },
    {
      id: 'ddIKG-pHDlQ',
      title: 'Missa Solene Especial',
      subtitle: 'Celebração Festiva • St. Patrick\'s Cathedral NYC',
      badge: 'Solene',
    },
    {
      id: 'UGX9gkbjnM0',
      title: 'Missa Diária Matutina',
      subtitle: 'Capela do Santíssimo • St. Patrick\'s Cathedral NYC',
      badge: 'Diária',
    },
  ];

  return (
    <section id="transmissao" className="w-full">
      <div className="bg-[#16181B] rounded-3xl border border-[#C8A463]/40 shadow-2xl overflow-hidden p-6 sm:p-8 text-white relative">
        {/* Detalhe de fundo dourado sutil */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFA82A]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B1E22]/30 border border-[#D32F2F]/60 text-xs font-bold text-white uppercase tracking-wider mb-2 font-sans">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D32F2F] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D32F2F]" />
              </span>
              <span>Transmissão Oficial Ao Vivo</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-[0.06em] text-white">
              Santa Missa no <span className="text-[#FFCC36]">Altar-Mor</span>
            </h2>
            <p className="font-serif italic text-sm text-[#C8A463] mt-1">
              Feed Litúrgico Oficial: St. Patrick's Cathedral (NYC) • Experiência Imersiva em Alta Definição
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTheaterModal && (
              <button
                onClick={onOpenTheaterModal}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#8B1E22] hover:bg-[#721C24] text-white text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-md cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Modo Teatro</span>
              </button>
            )}
            <a
              href="https://www.youtube.com/@SaintPatricksCathedralNYC"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/15 text-[#EAE3D9] text-xs font-bold uppercase tracking-wider font-sans transition-all border border-white/10"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Canal St. Patrick's</span>
            </a>
          </div>
        </div>

        {/* Player de Vídeo em Destaque 16:9 */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#C8A463]/30 shadow-2xl bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
            title="Transmissão Litúrgica St. Patrick's Cathedral NYC"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Barra de Seleção de Transmissões e Informações Litúrgicas */}
        <div className="mt-6 pt-5 border-t border-[#2A2927] flex flex-col lg:flex-row items-center justify-between gap-4 relative z-10 text-xs">
          {/* Seletor de Transmissões */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <span className="text-[#A39E98] font-bold uppercase tracking-wider font-sans mr-1">
              Celebrações:
            </span>
            {videoOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActiveVideoId(opt.id)}
                type="button"
                className={`px-3.5 py-2 rounded-xl font-bold font-sans transition-all cursor-pointer flex items-center gap-2 ${
                  activeVideoId === opt.id
                    ? 'bg-[#C8A463] text-[#16181B] shadow-md shadow-[#C8A463]/20'
                    : 'bg-[#22252A] text-[#CFCAC4] hover:bg-[#2B2F35] border border-[#343840]'
                }`}
              >
                <span>{opt.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase ${
                  activeVideoId === opt.id
                    ? 'bg-[#16181B]/20 text-[#16181B]'
                    : 'bg-[#16181B] text-[#FFCC36]'
                }`}>
                  {opt.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Selo Pastoral de Respeito Litúrgico */}
          <div className="flex items-center gap-2 text-[#A39E98] font-sans">
            <ShieldCheck className="w-4 h-4 text-[#FFA82A]" />
            <span>Transmissão sagrada em 1080p sem interrupções comerciais</span>
          </div>
        </div>
      </div>
    </section>
  );
}
