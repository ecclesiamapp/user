import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import {
  Church,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  Navigation,
  Share2,
  Sparkles,
  Heart,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Card, Badge, Button } from '@/components/ui';
import { Community, MassSchedule, Gallery } from '@/types';

import { fallbackCommunities } from '@/lib/communities';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { CathedralFooter } from '@/components/home/CathedralFooter';


type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CommunityDetailPage({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Tentar buscar a comunidade pelo slug no banco de dados
  const { data: dbCommunity } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .single();

  const community: Community | undefined = dbCommunity || fallbackCommunities[slug];

  if (!community) {
    notFound();
  }

  // 2. Buscar horários específicos desta comunidade
  const { data: massSchedulesData } = await supabase
    .from('mass_schedules')
    .select('*')
    .eq('community_id', community.id)
    .eq('is_active', true)
    .order('time');

  const schedules: MassSchedule[] = massSchedulesData || [];

  // 3. Buscar álbuns de fotos desta comunidade
  const { data: galleriesData } = await supabase
    .from('galleries')
    .select('*')
    .eq('community_id', community.id)
    .eq('is_active', true)
    .order('event_date', { ascending: false });

  const galleries: Gallery[] = galleriesData || [];

  // 4. Buscar paróquia para o rodapé oficial
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const parish = parishesData?.[0] || {
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    address: 'Praça Frei José, Nº 26 - Centro, Colatina/ES',
    whatsapp_number: '552737221234',
  };

  const destinationQuery = encodeURIComponent(
    `${community.name}, ${community.address || ''}, ${community.neighborhood || ''}, Colatina - ES`
  );

  const googleMapsUrl = community.latitude && community.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${community.latitude},${community.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${destinationQuery}`;

  const wazeUrl = community.latitude && community.longitude
    ? `https://waze.com/ul?ll=${community.latitude},${community.longitude}&navigate=yes`
    : `https://waze.com/ul?q=${destinationQuery}`;

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between selection:bg-[#FFA82A] selection:text-[#2D1A16]">
      {/* 1. Marquee Litúrgico Fino no Topo */}
      <MarqueeAvisos />

      {/* 2. Top Bar Translúcido de Navegação */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/90 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/comunidades"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors py-2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A]" />
            <span>Voltar para Comunidades</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-[#C8A463] font-serif font-bold uppercase tracking-wider">
            <span>✝</span>
            <span className="hidden sm:inline">
              {community.is_headquarters ? 'Igreja Matriz • Catedral' : 'Comunidade Eclesial de Base • CEB'}
            </span>
          </div>
        </div>
      </header>

      {/* 3. Hero Monumental da Capela (Padrão Oficial Catedral) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C1614] via-[#2A1D1A] to-[#1C1614] text-white py-14 sm:py-20 border-b border-[#C8A463]/30">
        <img
          src={community.image_url || '/images/historia/catedral-vitrais.jpg'}
          alt={community.name}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1614]/90 via-[#2A1D1A]/90 to-[#1C1614] pointer-events-none" />

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 text-center space-y-5">
          {/* Ícone Central Dourado em Destaque */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B1E22] via-[#5E1417] to-[#2D1A16] border-2 border-[#FFA82A] text-[#FFCC36] shadow-xl shadow-black/40">
            <Church className="w-7 h-7" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B1E22]/40 border border-[#C8A463]/40 text-[#FFCC36] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{community.is_headquarters ? 'Igreja Matriz • Catedral' : 'Comunidade Eclesial de Base • CEB'}</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight uppercase text-white leading-tight">
              {community.name}
            </h1>

            {community.patron_saint && (
              <p className="font-sans text-xs sm:text-base text-[#EAE3D9] max-w-2xl mx-auto leading-relaxed">
                Padroeiro(a): <strong className="text-[#FFA82A] font-semibold">{community.patron_saint}</strong>
                {community.feast_day && ` • Solenidade: ${community.feast_day}`}
              </p>
            )}
          </div>

          {/* Chips Inferiores Padronizados */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs font-semibold text-[#FFA82A] backdrop-blur-xs">
              📍 {community.neighborhood || community.city}
            </span>
            {community.foundation_year && (
              <span className="px-3.5 py-1.5 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs font-semibold text-[#FFA82A] backdrop-blur-xs">
                🏛️ Fundada em {community.foundation_year}
              </span>
            )}
            <span className="px-3.5 py-1.5 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs font-semibold text-[#FFA82A] backdrop-blur-xs">
              ⛪ Diocese de Colatina
            </span>
          </div>

          {/* Botões GPS em Destaque */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFA82A] hover:bg-[#FFB74D] text-[#2D1A16] font-bold text-xs uppercase tracking-wide transition-all shadow-md min-h-[44px]"
            >
              <Navigation className="w-4 h-4" />
              <span>Traçar Rota no Google Maps</span>
            </a>
            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16181B]/80 hover:bg-[#2A201C] border border-[#C8A463]/40 text-white font-semibold text-xs transition-all shadow-md min-h-[44px]"
            >
              <ExternalLink className="w-4 h-4 text-[#FFA82A]" />
              <span>Navegar com Waze</span>
            </a>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal do Mini-site da CEB */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10 w-full flex-1">
        {/* Grade de 2 Colunas: Informações & Horários */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna 1 & 2: História e Localização */}
          <div className="md:col-span-2 space-y-6">
            {/* História da Capela */}
            <Card className="space-y-4 overflow-hidden">
              {community.image_url && (
                <div className="relative h-64 -mx-6 -mt-6 mb-4 overflow-hidden border-b border-[var(--dash-border)]">
                  <img
                    src={community.image_url}
                    alt={`Fachada da ${community.name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-4">
                    <span className="text-xs font-semibold text-white/95 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-xs border border-white/10">
                      Fachada Oficial da Capela
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Church className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold">Nossa História & Vocação Pastoral</h2>
              </div>
              <p className="text-sm leading-relaxed text-[var(--dash-text-secondary)]">
                {community.history || 'Comunidade vibrante de fé e partilha cristã, em profunda comunhão com a Catedral Diocesana de Colatina.'}
              </p>
            </Card>


            {/* Localização GPS Detalhada */}
            <Card className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold">Endereço & Acesso</h2>
              </div>
              <div className="space-y-1 text-sm text-[var(--dash-text-secondary)]">
                <p><strong className="text-[var(--dash-text-primary)]">Endereço:</strong> {community.address || 'Consultar secretaria'}</p>
                <p><strong className="text-[var(--dash-text-primary)]">Bairro:</strong> {community.neighborhood || 'Centro'}</p>
                <p><strong className="text-[var(--dash-text-primary)]">Cidade:</strong> {community.city} - {community.state}</p>
              </div>
            </Card>
          </div>

          {/* Coluna 3: Horários de Missas e Celebrações */}
          <div className="space-y-6">
            <Card className="space-y-4 border-amber-500/30">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base">Celebrações da Comunidade</h3>
              </div>

              {schedules.length > 0 ? (
                <div className="space-y-3">
                  {schedules.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                        <span>{item.day_of_week}</span>
                        <span>{item.time}</span>
                      </div>
                      <p className="text-xs text-[var(--dash-text-primary)] font-medium mt-1">
                        {item.type === 'missa' ? 'Santa Missa' : 'Celebração da Palavra'}
                      </p>
                      {item.description && (
                        <p className="text-[11px] text-[var(--dash-text-secondary)] mt-0.5">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-xs text-[var(--dash-text-secondary)] space-y-2">
                  <p className="font-medium text-[var(--dash-text-primary)]">Programação Semanal Habitual:</p>
                  <p>• Domingo: Celebração da Palavra / Santa Missa conforme escala paroquial.</p>
                  <p>• Encontros de Círculo Bíblico e Terço dos Homens durante a semana.</p>
                </div>
              )}

              <div className="pt-2 border-t border-[var(--dash-border)]">
                <a
                  href={`https://wa.me/5527999990000?text=Olá,%20gostaria%20de%20saber%20os%20horários%20de%20missa%20da%20${encodeURIComponent(community.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar Horários no WhatsApp</span>
                </a>
              </div>
            </Card>

            {/* Dízimo na Capela */}
            <Card className="space-y-3 bg-gradient-to-br from-[var(--dash-surface)] to-[var(--dash-surface-secondary)]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <h3 className="font-bold text-sm">Dízimo e Partilha na CEB</h3>
              </div>
              <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
                Contribua com a manutenção desta capela através do PIX oficial da paróquia.
              </p>
              <Link href="/#dizimo" className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold hover:underline">
                <span>Ir para área do PIX Paroquial</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          </div>
        </div>

        {/* Galeria de Fotos & Momentos da Comunidade */}
        {galleries.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-[var(--dash-border)]">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-500" />
              <div>
                <h2 className="text-xl font-bold tracking-tight">Álbuns & Momentos da Comunidade</h2>
                <p className="text-xs text-[var(--dash-text-secondary)]">
                  Registros fotográficos de festas de padroeiros, sacramentos e confraternizações.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {galleries.map((album) => {
                const photos = Array.isArray(album.photos) ? album.photos : [];
                return (
                  <Card key={album.id} className="overflow-hidden p-0 flex flex-col justify-between">
                    <div>
                      {album.cover_image_url && (
                        <div className="h-44 w-full bg-[var(--dash-surface-secondary)] overflow-hidden">
                          <img
                            src={album.cover_image_url}
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                          <span>
                            {album.event_date
                              ? new Date(album.event_date + 'T12:00:00').toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Registro Pastoral'}
                          </span>
                          <span className="text-[11px] text-[var(--dash-text-secondary)]">
                            {photos.length} fotos
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[var(--dash-text-primary)]">
                          {album.title}
                        </h3>
                        {album.description && (
                          <p className="text-xs text-[var(--dash-text-secondary)] line-clamp-2">
                            {album.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {photos.length > 1 && (
                      <div className="px-4 pb-4 pt-1 flex gap-2 overflow-x-auto">
                        {photos.slice(0, 4).map((photoUrl, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded-lg bg-[var(--dash-surface-secondary)] overflow-hidden shrink-0 border border-[var(--dash-border)]"
                          >
                            <img
                              src={photoUrl}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Rodapé Oficial da Catedral */}
      <CathedralFooter
        parishName={parish?.name || 'Catedral do Sagrado Coração de Jesus'}
        dioceseName={parish?.diocese || 'Diocese de Colatina'}
        address={parish?.address}
        whatsappNumber={parish?.whatsapp_number}
      />
    </div>
  );
}
