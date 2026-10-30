import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { ParishSpecialEvent, ParishEventDay, Community } from '@/types';
import { FALLBACK_SPECIAL_EVENTS, FALLBACK_EVENT_DAYS, getEventTheme } from '@/lib/events';
import { fallbackCommunities } from '@/lib/communities';

import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { CathedralHeader } from '@/components/layout/CathedralHeader';
import { CathedralFooter } from '@/components/home/CathedralFooter';
import { EventHeroSection } from '@/components/programacao/EventHeroSection';
import { EventTimelineSection } from '@/components/programacao/EventTimelineSection';
import { EventSocialQuermesseSection } from '@/components/programacao/EventSocialQuermesseSection';
import { EventShareFloatingBar } from '@/components/programacao/EventShareFloatingBar';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let event: ParishSpecialEvent | undefined;

  try {
    const { data } = await supabase
      .from('parish_special_events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data) {
      event = data as ParishSpecialEvent;
    }
  } catch (err) {
    // fallback
  }

  if (!event) {
    event = FALLBACK_SPECIAL_EVENTS.find((e) => e.slug === slug);
  }

  if (!event) {
    return {
      title: 'Programação Litúrgica • Catedral de Colatina',
      description: 'Programação de grandes festas, tríduos e solenidades paroquiais.',
    };
  }

  const title = `${event.title} • Programação Oficial • Catedral de Colatina`;
  const description = event.theme || event.description || `Confira a programação completa de ${event.title} na Catedral de Colatina.`;
  const bannerImage = event.banner_url || '/images/festas/copadroeira-nossa-senhora-das-gracas.webp';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [bannerImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [bannerImage],
    },
  };
}

export default async function ParishSpecialEventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Buscar paróquia
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    address: 'Praça Frei José, Centro - Colatina/ES',
    whatsapp_number: '(27) 3722-1234',
  };

  // 2. Buscar evento no Supabase
  let event: ParishSpecialEvent | undefined;
  try {
    const { data, error } = await supabase
      .from('parish_special_events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      event = data as ParishSpecialEvent;
    }
  } catch (err) {
    console.warn('Usando fallback para evento:', err);
  }

  if (!event) {
    event = FALLBACK_SPECIAL_EVENTS.find((e) => e.slug === slug);
  }

  if (!event) {
    notFound();
  }

  // 3. Buscar comunidade vinculada se houver
  let community: Community | undefined;
  if (event.community_id) {
    try {
      const { data: commData } = await supabase
        .from('communities')
        .select('*')
        .eq('id', event.community_id)
        .single();

      if (commData) {
        community = commData as Community;
      }
    } catch (err) {
      // fallback
    }

    if (!community) {
      community = Object.values(fallbackCommunities).find((c) => c.id === event?.community_id);
    }
  }

  const enrichedEvent: ParishSpecialEvent = {
    ...event,
    community_name: community ? community.name : 'Catedral Sagrado Coração de Jesus (Sede)',
  };

  // 4. Buscar os dias da programação
  let days: ParishEventDay[] = [];
  try {
    const { data: daysData, error: daysError } = await supabase
      .from('parish_event_days')
      .select('*')
      .eq('event_id', event.id)
      .order('order_index', { ascending: true })
      .order('event_date', { ascending: true });

    if (!daysError && daysData && daysData.length > 0) {
      days = daysData as ParishEventDay[];
    }
  } catch (err) {
    console.warn('Usando fallback para dias do evento:', err);
  }

  if (days.length === 0 && FALLBACK_EVENT_DAYS[slug]) {
    days = FALLBACK_EVENT_DAYS[slug];
  }

  // 5. Configurar rota e endereço de destino GPS e paleta exclusiva da página
  const destinationAddress = community?.address || parish.address;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
    `${enrichedEvent.community_name}, ${destinationAddress}`
  )}`;
  const eventTheme = getEventTheme(enrichedEvent);

  return (
    <div
      className="min-h-screen flex flex-col justify-between overflow-x-hidden"
      style={{
        backgroundColor: eventTheme.bodyBg,
        color: eventTheme.bodyTextPrimary,
      }}
    >
      {/* 1. Marquee Litúrgico Superior */}
      <MarqueeAvisos />

      {/* 2. Top Bar Oficial da Catedral */}
      <CathedralHeader
        parishName={parish.name}
        dioceseName={parish.diocese}
        whatsappNumber={parish.whatsapp_number}
      />

      {/* 3. Conteúdo Principal */}
      <main className="flex-1 w-full pb-16 sm:pb-0">
        {/* Seção Hero Monumental com Cartaz e Ações */}
        <EventHeroSection
          event={enrichedEvent}
          parishAddress={destinationAddress}
          mapsUrl={mapsUrl}
        />

        {/* Linha do Tempo Interativa Dia a Dia */}
        <EventTimelineSection days={days} event={enrichedEvent} />

        {/* Seção de Convivência & Quermesse Comunitária */}
        <EventSocialQuermesseSection
          event={enrichedEvent}
          mapsUrl={mapsUrl}
        />
      </main>

      {/* 4. Barra Flutuante de Compartilhamento no Mobile */}
      <EventShareFloatingBar
        event={enrichedEvent}
        mapsUrl={mapsUrl}
      />

      {/* 5. Rodapé Monumental da Catedral */}
      <CathedralFooter
        parishName={parish.name}
        dioceseName={parish.diocese}
        address={parish.address}
        whatsappNumber={parish.whatsapp_number}
      />
    </div>
  );
}
