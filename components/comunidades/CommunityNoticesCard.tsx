import React from 'react';
import { Bell, BookOpen, Users, HeartHandshake, Tag, Calendar, Sparkles } from 'lucide-react';
import { CommunityNotice, Community } from '@/types';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';

interface CommunityNoticesCardProps {
  community: Community;
  notices?: CommunityNotice[];
  liturgicalTheme?: LiturgicalColorTheme;
}

export function CommunityNoticesCard({ community, notices = [], liturgicalTheme }: CommunityNoticesCardProps) {
  const activeTheme = liturgicalTheme || getLiturgicalColorTheme('verde');
  // Se não houver avisos dinâmicos suficientes, usamos avisos pastorais modelo
  const displayNotices =
    notices.length >= 3
      ? notices.slice(0, 3)
      : [
          ...(notices || []),
          {
            id: 'aviso-padrao-1',
            title: 'Inscrições de Catequese',
            content: 'Encontros de preparação para Primeira Eucaristia e Crisma.',
            date: '2026-10-27',
            category: 'formacao' as const,
          },
          {
            id: 'aviso-padrao-2',
            title: 'Reunião de Jovens',
            content: 'Espiritualidade, dinâmica e louvor com a juventude no salão.',
            date: '2026-10-29',
            category: 'liturgia' as const,
          },
          {
            id: 'aviso-padrao-3',
            title: 'Doações de Alimentos',
            content: 'Campanha de partilha fraterna e cestas para famílias necessitadas.',
            date: '2026-11-01',
            category: 'mutirao' as const,
          },
        ].slice(0, 3);

  const getNoticeIcon = (index: number) => {
    if (index === 0) return <BookOpen className="w-5 h-5 text-[#FFA82A]" />;
    if (index === 1) return <Users className="w-5 h-5 text-[#FFA82A]" />;
    return <HeartHandshake className="w-5 h-5 text-[#FFA82A]" />;
  };

  return (
    <div className={`relative h-full flex-1 rounded-3xl bg-gradient-to-b from-[#251B18]/95 via-[#1D1614]/95 to-[#161210]/95 border ${activeTheme.cardBorderClass} p-6 sm:p-7 shadow-xl shadow-black/40 overflow-hidden flex flex-col justify-between transition-colors duration-300`}>
      {/* Badge Numérico no Topo Direito (Acento Litúrgico Cirúrgico) */}
      <div className={`absolute top-0 right-0 w-10 h-10 rounded-bl-2xl rounded-tr-3xl ${activeTheme.numberBadgeClass} flex items-center justify-center font-serif font-bold text-sm shadow-sm transition-all duration-300`}>
        2
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="min-h-[64px] flex flex-col justify-start">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFF3E3] tracking-tight">
            Mural de Avisos da Comunidade
          </h2>
          <p className="text-xs text-[#EAE3D9]/70 mt-1 line-clamp-1">
            Comunicados, escalas e convites da comunidade {community.name}
          </p>
        </div>

        {/* Grade de 3 Cards de Avisos em Linha (Idêntico ao Mockup) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-auto py-1">
          {displayNotices.map((notice, idx) => (
            <div
              key={notice.id}
              className="rounded-2xl bg-[#2D211D]/80 border border-[#C8A463]/30 p-3.5 flex flex-col justify-between min-h-[125px] relative overflow-hidden group hover:border-[#FFA82A]/60 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-xl bg-black/40 border border-white/10">
                  {getNoticeIcon(idx)}
                </div>
                {/* Badge Notificação Vermelha no Canto (Estilo Mockup) */}
                <span className="w-5 h-5 rounded-full bg-[#E53935] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  1
                </span>
              </div>

              <div className="space-y-0.5">
                <h3 className="font-serif font-bold text-xs text-white leading-tight line-clamp-2">
                  {notice.title}
                </h3>
                <span className="block text-[10px] text-[#FFA82A]/80 font-medium">
                  {new Date(notice.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra Estilizada Inferior Alinhada com Card 1 */}
      <div className="pt-5 mt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 min-h-[46px]">
        <div className="flex items-center gap-2 text-xs text-[#EAE3D9]/70">
          <Sparkles className="w-3.5 h-3.5 text-[#FFA82A]" />
          <span className="text-[11px] font-medium font-serif italic">Mural atualizado semanalmente</span>
        </div>
        <a
          href="#avisos"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2D211D] hover:bg-[#3D2C27] border border-[#C8A463]/30 text-white font-medium text-xs transition-colors min-h-[38px]"
        >
          <Bell className="w-3.5 h-3.5 text-[#FFA82A]" />
          <span>3 Comunicados</span>
        </a>
      </div>
    </div>
  );
}
