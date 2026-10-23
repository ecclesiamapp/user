'use client';

import React, { useState } from 'react';
import { Users, Shield, Sparkles, MessageCircle } from 'lucide-react';
import { CommunityLeader, Community } from '@/types';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';
import { CommunityLeaderContactModal } from '@/components/comunidades/CommunityLeaderContactModal';

interface CommunityCPCCardProps {
  community: Community;
  leaders?: CommunityLeader[];
  liturgicalTheme?: LiturgicalColorTheme;
}

export function CommunityCPCCard({ community, leaders = [], liturgicalTheme }: CommunityCPCCardProps) {
  const activeTheme = liturgicalTheme || getLiturgicalColorTheme('verde');
  const [selectedLeader, setSelectedLeader] = useState<CommunityLeader | null>(null);

  // Lista padrão de 4 lideranças para a grade 2x2 do mockup
  const defaultLeaders: CommunityLeader[] = [
    leaders.find((l) => l.role.toLowerCase().includes('pároco') || l.role.toLowerCase().includes('padre')) || {
      name: 'Pe. Irineu Claudino Sales',
      role: 'Pároco Orientador',
      phone: '(27) 3722-1234',
      email: 'secretaria@catedraldecolatina.org.br',
      image: '/images/pastores/pe-irineu-claudino-sales.webp',
      bio: 'Pároco da Catedral do Sagrado Coração de Jesus e guia espiritual de todas as comunidades da rede paroquial.',
    },
    leaders.find((l) => l.role.toLowerCase().includes('coordenador do cpc') || l.role.toLowerCase().includes('coordenador geral')) || {
      name: leaders[0]?.name || 'Marcos Antônio Vieira',
      role: 'Coordenador do CPC',
      phone: leaders[0]?.phone || '(27) 99876-5432',
      email: leaders[0]?.email || 'marcos.cpc@catedraldecolatina.org.br',
      image: leaders[0]?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Membro atuante há mais de 15 anos na comunidade, animador de círculos bíblicos e zelador das atividades pastorais locais.',
    },
    leaders.find((l) => l.role.toLowerCase().includes('tesoureir')) || {
      name: leaders[1]?.name || 'Maria Helena Gomes',
      role: 'Tesoureira do CPC',
      phone: leaders[1]?.phone || '(27) 99765-4321',
      email: leaders[1]?.email || 'helena.tesouraria@catedraldecolatina.org.br',
      image: leaders[1]?.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Coordenadora de acolhida, zela com amor e transparência pelas doações e manutenção material do templo.',
    },
    leaders.find((l) => l.role.toLowerCase().includes('secretár') || l.role.toLowerCase().includes('liturgia')) || {
      name: leaders[2]?.name || 'Lúcia Silveira Rocha',
      role: 'Secretária do CPC',
      phone: leaders[2]?.phone || '(27) 99654-3210',
      email: leaders[2]?.email || 'lucia.secretaria@catedraldecolatina.org.br',
      image: leaders[2]?.image || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      bio: 'Responsável pelos livros de atas, avisos comunitários, escalas litúrgicas e acolhimento aos noivos e batizandos.',
    },
  ];

  return (
    <>
      <div className={`relative h-full flex-1 rounded-3xl bg-gradient-to-b from-[#251B18]/95 via-[#1D1614]/95 to-[#161210]/95 border ${activeTheme.cardBorderClass} p-6 sm:p-7 shadow-xl shadow-black/40 overflow-hidden flex flex-col justify-between transition-colors duration-300`}>
        {/* Badge Numérico no Topo Direito (Card 4 com Acento Litúrgico Cirúrgico) */}
        <div className={`absolute top-0 right-0 w-10 h-10 rounded-bl-2xl rounded-tr-3xl ${activeTheme.numberBadgeClass} flex items-center justify-center font-serif font-bold text-sm shadow-sm transition-all duration-300`}>
          4
        </div>

        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="min-h-[64px] flex flex-col justify-start">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFF3E3] tracking-tight">
              Conselho Comunitário (CPC)
            </h2>
            <p className="text-xs text-[#EAE3D9]/70 mt-1 line-clamp-1">
              Lideranças leigas da {community.name} • Toque para falar via WhatsApp
            </p>
          </div>

          {/* Grade 2x2 com Avatares Circulares Clicáveis */}
          <div className="grid grid-cols-2 gap-3 my-auto py-1">
            {defaultLeaders.map((leader, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedLeader(leader)}
                className="group rounded-2xl bg-[#2D211D]/80 hover:bg-[#3D2923] border border-[#C8A463]/30 hover:border-[#FFA82A] p-3 text-center flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer shadow-xs hover:shadow-lg hover:shadow-black/50 hover:scale-[1.02] min-h-[120px]"
                title={`Clique para falar com ${leader.name}`}
              >
                {/* Avatar Circular com Borda Dourada Nobre */}
                <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-[#FFA82A] via-[#C8A463] to-[#8B1E22] shadow-md group-hover:scale-105 transition-transform">
                  <img
                    src={leader.image || leader.photo_url || '/images/pastores/pe-irineu-claudino-sales.webp'}
                    alt={leader.name}
                    className="w-full h-full rounded-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <MessageCircle className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div className="space-y-0.5 w-full">
                  <p className="font-serif font-bold text-xs text-white leading-tight truncate">
                    {leader.role}
                  </p>
                  <p className="text-[11px] text-[#EAE3D9]/70 group-hover:text-amber-300 transition-colors truncate max-w-[130px] mx-auto">
                    {leader.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-xs text-[#EAE3D9]/60 min-h-[46px]">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#FFA82A]" />
            <span>Conselho Pastoral Eleito</span>
          </div>
          <span className="text-[#FFA82A] font-serif italic text-[11px] flex items-center gap-1">
            <span>Toque para contato</span>
          </span>
        </div>
      </div>

      {/* Modal de Contato Solene */}
      <CommunityLeaderContactModal
        leader={selectedLeader}
        communityName={community.name}
        isOpen={selectedLeader !== null}
        onClose={() => setSelectedLeader(null)}
      />
    </>
  );
}
