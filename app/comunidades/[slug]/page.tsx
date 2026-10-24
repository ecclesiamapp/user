import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Card } from '@/components/ui';
import { Community, MassSchedule, Gallery } from '@/types';

import { fallbackCommunities } from '@/lib/communities';
import { getLiturgicalColorTheme } from '@/lib/liturgy';
import { CommunityJsonLd } from '@/components/comunidades/CommunityJsonLd';
import { CommunityHeader } from '@/components/comunidades/CommunityHeader';
import { CommunityLiturgicalBanner } from '@/components/comunidades/CommunityLiturgicalBanner';
import { CommunityAccessibilityProvider } from '@/components/comunidades/CommunityAccessibilityContext';
import { CommunityHero } from '@/components/comunidades/CommunityHero';
import { CommunityLiturgyCard } from '@/components/comunidades/CommunityLiturgyCard';
import { CommunityNoticesCard } from '@/components/comunidades/CommunityNoticesCard';
import { CommunityCalendarCard } from '@/components/comunidades/CommunityCalendarCard';
import { CommunityCPCCard } from '@/components/comunidades/CommunityCPCCard';
import { CommunityLocationCard } from '@/components/comunidades/CommunityLocationCard';
import { CommunityPastoralGroupsSection } from '@/components/comunidades/CommunityPastoralGroupsSection';
import { CommunityFooter } from '@/components/comunidades/CommunityFooter';

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

  const googleMapsUrl =
    community.latitude && community.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${community.latitude},${community.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${destinationQuery}`;

  const wazeUrl =
    community.latitude && community.longitude
      ? `https://waze.com/ul?ll=${community.latitude},${community.longitude}&navigate=yes`
      : `https://waze.com/ul?q=${destinationQuery}`;

  // 5. Obter Cor e Tempo Litúrgico Canônico do Dia
  let liturgicalColorName = 'Verde';
  let liturgicalTitle = '';
  let liturgicalDay = '';
  try {
    const liturgyRes = await fetch('https://liturgia.up.railway.app/', {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    if (liturgyRes.ok) {
      const liturgyData = await liturgyRes.json();
      if (liturgyData?.cor) {
        liturgicalColorName = liturgyData.cor;
      }
      if (liturgyData?.liturgia) {
        liturgicalTitle = liturgyData.liturgia;
      }
      if (liturgyData?.dia) {
        liturgicalDay = liturgyData.dia;
      }
    }
  } catch (err) {
    // Silently fallback para Verde (Tempo Comum)
  }
  const liturgicalTheme = getLiturgicalColorTheme(liturgicalColorName);

  return (
    <CommunityAccessibilityProvider>
      <div className="min-h-screen bg-[#F6F2EB] text-[#2D1A16] flex flex-col justify-between selection:bg-[#FFA82A] selection:text-[#2D1A16]">
        {/* 0. SEO Estruturado Schema.org */}
        <CommunityJsonLd community={community} parishName={parish?.name} />

        {/* 1. Header Minimalista & Exclusivo da Comunidade */}
        <CommunityHeader community={community} googleMapsUrl={googleMapsUrl} />

        {/* 1.1. Faixa Litúrgica Sutil (Cor e Comemoração do Dia - TASK-41B) */}
        <CommunityLiturgicalBanner
          liturgicalTheme={liturgicalTheme}
          celebrationTitle={liturgicalTitle}
          celebrationDay={liturgicalDay}
        />

      {/* 2. Hero Monumental com Card Flutuante da Próxima Celebração */}
      <CommunityHero
        community={community}
        schedules={schedules}
        googleMapsUrl={googleMapsUrl}
        wazeUrl={wazeUrl}
        liturgicalTheme={liturgicalTheme}
      />

      {/* 3. Grade Principal de 5 Cards Numerados (Diagramação Exata do Mockup) */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Card 1: Celebrações & Liturgia */}
          <div id="horarios" className="scroll-mt-24 flex flex-col h-full">
            <CommunityLiturgyCard community={community} schedules={schedules} liturgicalTheme={liturgicalTheme} />
          </div>

          {/* Card 2: Mural de Avisos da Comunidade */}
          <div id="avisos" className="scroll-mt-24 flex flex-col h-full">
            <CommunityNoticesCard community={community} notices={community.notices} liturgicalTheme={liturgicalTheme} />
          </div>

          {/* Card 3: Atividades & Calendário Comunitário */}
          <div id="calendario" className="scroll-mt-24 flex flex-col h-full">
            <CommunityCalendarCard community={community} activities={community.activities} liturgicalTheme={liturgicalTheme} />
          </div>

          {/* Card 4: Conselho Comunitário (CPC) */}
          <div id="cpc" className="scroll-mt-24 flex flex-col h-full">
            <CommunityCPCCard community={community} leaders={community.cpc_leaders} liturgicalTheme={liturgicalTheme} />
          </div>

          {/* Card 5: Como Chegar (Largura Total - Span 2) */}
          <div id="localizacao" className="lg:col-span-2 scroll-mt-24">
            <CommunityLocationCard
              community={community}
              googleMapsUrl={googleMapsUrl}
              wazeUrl={wazeUrl}
              liturgicalTheme={liturgicalTheme}
            />
          </div>
        </div>

        {/* Pastorais e Movimentos Vinculados à Comunidade (TASK-42) */}
        {Array.isArray(community.pastoral_groups) && community.pastoral_groups.length > 0 && (
          <section id="pastorais" className="mt-12 scroll-mt-24">
            <CommunityPastoralGroupsSection
              communityName={community.name}
              groups={community.pastoral_groups}
            />
          </section>
        )}

        {/* Galeria de Fotos da Comunidade (Se houver álbuns) */}
        {galleries.length > 0 && (
          <section id="fotos" className="mt-14 space-y-6 scroll-mt-24">
            <div className="flex items-center gap-2 pb-3 border-b border-[#C8A463]/30">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-[#2D1A16]">
                  Álbuns & Momentos da Comunidade
                </h2>
                <p className="text-xs text-[#6A5A50]">
                  Registros fotográficos de festas de padroeiros, sacramentos e confraternizações.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {galleries.map((album) => {
                const photos = Array.isArray(album.photos) ? album.photos : [];
                return (
                  <Card key={album.id} className="overflow-hidden p-0 flex flex-col justify-between rounded-2xl bg-[#1D1614] border border-[#C8A463]/30">
                    <div>
                      {album.cover_image_url && (
                        <div className="h-44 w-full bg-[#251B18] overflow-hidden">
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
                          <span className="text-[11px] text-[#EAE3D9]/60">
                            {photos.length} fotos
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-white">
                          {album.title}
                        </h3>
                        {album.description && (
                          <p className="text-xs text-[#EAE3D9]/70 line-clamp-2">
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
                            className="w-12 h-12 rounded-lg bg-[#251B18] overflow-hidden shrink-0 border border-white/10"
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

      {/* 4. Rodapé Exclusivo e Dedicado da Comunidade */}
      <CommunityFooter
        community={community}
        parishName={parish?.name}
        dioceseName={parish?.diocese}
      />
      </div>
    </CommunityAccessibilityProvider>
  );
}
