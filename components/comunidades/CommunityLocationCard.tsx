import React from 'react';
import { MapPin, Navigation, ExternalLink, Compass } from 'lucide-react';
import { Community } from '@/types';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';

interface CommunityLocationCardProps {
  community: Community;
  googleMapsUrl?: string;
  wazeUrl?: string;
  liturgicalTheme?: LiturgicalColorTheme;
}

export function CommunityLocationCard({
  community,
  googleMapsUrl,
  wazeUrl,
  liturgicalTheme,
}: CommunityLocationCardProps) {
  const activeTheme = liturgicalTheme || getLiturgicalColorTheme('verde');

  return (
    <div className={`relative rounded-3xl bg-gradient-to-b from-[#251B18]/95 via-[#1D1614]/95 to-[#161210]/95 border ${activeTheme.cardBorderClass} p-6 sm:p-8 shadow-xl shadow-black/40 overflow-hidden transition-colors duration-300`}>
      {/* Badge Numérico no Topo Direito (Acento Litúrgico Cirúrgico) */}
      <div className={`absolute top-0 right-0 w-10 h-10 rounded-bl-2xl rounded-tr-3xl ${activeTheme.numberBadgeClass} flex items-center justify-center font-serif font-bold text-sm shadow-sm transition-all duration-300`}>
        5
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFF3E3] tracking-tight">
            Como Chegar
          </h2>
          <p className="text-xs text-[#EAE3D9]/70 mt-1">
            Localização e rotas de acesso à comunidade no {community.neighborhood || community.city}
          </p>
        </div>

        {/* Grade de 2 Colunas: Mapa à Esquerda e Foto/Ações à Direita (Idêntico ao Mockup) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Lado Esquerdo: Miniatura de Mapa Estilizado Escuro com Pin Vermelho */}
          <div className="lg:col-span-6">
            <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#C8A463]/30 bg-[#161A22] shadow-inner flex items-center justify-center">
              {/* SVG / Representação Gráfica de Malha Urbana Estilo Mockup */}
              <svg
                className="absolute inset-0 w-full h-full opacity-35"
                xmlns="http://www.w3.org/2000/svg"
              >
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#FFA82A" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Ruas simuladas */}
                <path d="M0 60 Q 150 120 350 40 T 600 180" fill="none" stroke="#C8A463" strokeWidth="3" opacity="0.6" />
                <path d="M120 0 L 160 250" fill="none" stroke="#C8A463" strokeWidth="2.5" opacity="0.6" />
                <path d="M0 160 L 500 160" fill="none" stroke="#C8A463" strokeWidth="2" opacity="0.4" />
              </svg>

              {/* Pin Vermelho no Centro (Idêntico ao Mockup) */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#E53935] border-2 border-white text-white flex items-center justify-center shadow-lg shadow-black/60 animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="mt-2 px-3 py-1 rounded-lg bg-black/80 border border-white/20 text-[11px] font-bold text-white shadow-md backdrop-blur-xs">
                  {community.name}
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Foto da Fachada com Degradê + Endereço + Botões */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#C8A463]/30 min-h-[224px] sm:min-h-[256px] flex flex-col justify-end p-6">
            {/* Foto de Fundo da Fachada */}
            <img
              src={community.image_url || '/images/historia/catedral-vitrais.jpg'}
              alt={community.name}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161210] via-[#1C1614]/80 to-transparent" />

            <div className="relative z-10 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFA82A]">
                  Templo da Comunidade
                </span>
                <p className="font-serif font-bold text-lg sm:text-xl text-white">
                  {community.address || 'Consultar secretaria da Catedral'}
                </p>
                <p className="text-xs text-[#EAE3D9]/80">
                  {community.neighborhood || 'Centro'} • {community.city} - {community.state}
                </p>
              </div>

              {/* Botões Idênticos ao Mockup: Dourado + Escuro */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFA82A] hover:bg-[#FFB74D] text-[#2D1A16] font-bold text-xs uppercase tracking-wide transition-all shadow-md min-h-[44px]"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Ver no Google Maps</span>
                  </a>
                )}

                {wazeUrl && (
                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D211D]/90 hover:bg-[#3D2C27] border border-[#C8A463]/40 text-white font-semibold text-xs transition-all shadow-md min-h-[44px]"
                  >
                    <ExternalLink className="w-4 h-4 text-[#FFA82A]" />
                    <span>Rotas (GPS)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
