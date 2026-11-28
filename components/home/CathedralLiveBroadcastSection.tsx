'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  ShieldCheck,
  ExternalLink,
  Maximize2,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
} from 'lucide-react';
import { YouTubeLiveItem, YouTubeLiveResponse } from '@/app/api/youtube/latest-live/route';

interface CathedralLiveBroadcastSectionProps {
  onOpenTheaterModal?: () => void;
}

const DEFAULT_VIDEO: YouTubeLiveItem = {
  id: '8CYXvaIz-xM',
  title: 'Festa de Nossa Senhora das Graças',
  publishedAt: new Date().toISOString(),
  formattedDate: 'Hoje',
  badge: 'Mais Recente',
  isLive: false,
};

const DEFAULT_RECENT: YouTubeLiveItem[] = [
  DEFAULT_VIDEO,
  {
    id: 'JVcI2l7ooa0',
    title: 'Santa Missa em Seu Lar',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    formattedDate: 'Santa Missa',
    badge: 'Missa Diária',
    isLive: false,
  },
  {
    id: 'Oce2n8VPb9g',
    title: 'Santa Missa em Seu Lar',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    formattedDate: 'Santa Missa',
    badge: 'Missa',
    isLive: false,
  },
];

export function CathedralLiveBroadcastSection({
  onOpenTheaterModal,
}: CathedralLiveBroadcastSectionProps) {
  const [activeVideo, setActiveVideo] = useState<YouTubeLiveItem>(DEFAULT_VIDEO);
  const [recentVideos, setRecentVideos] = useState<YouTubeLiveItem[]>(DEFAULT_RECENT);
  const [isLiveNow, setIsLiveNow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLatestBroadcast() {
      try {
        const res = await fetch('/api/youtube/latest-live');
        if (res.ok) {
          const data: YouTubeLiveResponse = await res.json();
          if (data.activeVideo) {
            setActiveVideo(data.activeVideo);
          }
          if (data.recentVideos && data.recentVideos.length > 0) {
            setRecentVideos(data.recentVideos);
          }
          setIsLiveNow(Boolean(data.isLive));
        }
      } catch (err) {
        console.warn('Usando contingência para player da Catedral:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadLatestBroadcast();
  }, []);

  return (
    <section id="transmissao" className="w-full">
      <div className="bg-[#16181B] rounded-3xl border border-[#C8A463]/40 shadow-2xl overflow-hidden p-6 sm:p-8 text-white relative">
        {/* Detalhe de fundo dourado sutil */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFA82A]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 relative z-10">
          <div>
            {/* Badge de Status: Ao Vivo ou Última Transmissão */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 font-sans border transition-all">
              {isLiveNow ? (
                <div className="inline-flex items-center gap-2 bg-[#8B1E22]/40 border-[#D32F2F] text-white">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D32F2F] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D32F2F]" />
                  </span>
                  <span>Transmissão Oficial Ao Vivo</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-[#FFCC36] bg-[#22252A] border-[#C8A463]/40 px-2 py-0.5 rounded-full">
                  <Video className="w-3.5 h-3.5 text-[#FFA82A]" />
                  <span>Última Santa Missa Transmitida</span>
                </div>
              )}
            </div>

            <h2 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-[0.06em] text-white">
              {activeVideo.title ? activeVideo.title : 'Santa Missa no Altar-Mor'}
            </h2>
            <p className="font-serif italic text-sm text-[#C8A463] mt-1.5 flex items-center gap-2">
              <span>Feed Litúrgico Oficial • Catedral Sagrado Coração de Jesus • Diocese de Colatina</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
              href="https://www.youtube.com/@catedraldecolatina"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/20 text-[#EAE3D9] text-xs font-bold uppercase tracking-wider font-sans transition-all border border-white/10"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFA82A]" />
              <span>Canal Catedral</span>
            </a>
          </div>
        </div>

        {/* Player de Vídeo em Destaque 16:9 da Catedral de Colatina */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#C8A463]/30 shadow-2xl bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
            title={activeVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Barra de Seleção Dinâmica de Transmissões Recentes da Catedral */}
        <div className="mt-6 pt-5 border-t border-[#2A2927] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10 text-xs">
          {/* Seletor com as Celebrações Reais Detectadas */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <span className="text-[#A39E98] font-bold uppercase tracking-wider font-sans mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FFA82A]" />
              Celebrações Recentes:
            </span>
            {recentVideos.map((video) => (
              <button
                key={video.id}
                onClick={() => setActiveVideo(video)}
                type="button"
                className={`px-3.5 py-2 rounded-xl font-bold font-sans transition-all cursor-pointer flex items-center gap-2 ${
                  activeVideo.id === video.id
                    ? 'bg-[#C8A463] text-[#16181B] shadow-md shadow-[#C8A463]/20'
                    : 'bg-[#22252A] text-[#CFCAC4] hover:bg-[#2B2F35] border border-[#343840]'
                }`}
                title={video.title}
              >
                <span className="max-w-[200px] truncate">{video.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase ${
                    activeVideo.id === video.id
                      ? 'bg-[#16181B]/20 text-[#16181B]'
                      : 'bg-[#16181B] text-[#FFCC36]'
                  }`}
                >
                  {video.formattedDate}
                </span>
              </button>
            ))}
          </div>

          {/* Selo Pastoral de Respeito Litúrgico */}
          <div className="flex items-center gap-2 text-[#A39E98] font-sans shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#FFA82A]" />
            <span>Transmissão sagrada em 1080p sem interrupções comerciais</span>
          </div>
        </div>
      </div>
    </section>
  );
}
