import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CathedralHeader } from '@/components/layout/CathedralHeader';
import { CathedralFooter } from '@/components/home/CathedralFooter';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { MovementDetailView } from '@/components/movements/MovementDetailView';
import { getParishMovementBySlug, getMovementEvents, FALLBACK_MOVEMENTS } from '@/lib/movements';

interface MovementPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return FALLBACK_MOVEMENTS.map((m) => ({
    slug: m.slug,
  }));
}

export async function generateMetadata({ params }: MovementPageProps): Promise<Metadata> {
  const { slug } = await params;
  const movement = await getParishMovementBySlug(slug);

  if (!movement) {
    return {
      title: 'Movimento Paroquial • Catedral de Colatina',
      description: 'Movimentos e pastorais da Paróquia Sagrado Coração de Jesus.',
    };
  }

  const title = `${movement.name} (${movement.acronym}) • Catedral de Colatina`;
  const description =
    movement.carisma ||
    movement.description ||
    `Conheça o ${movement.name} na Catedral de Colatina, encontros, espiritualidade e inscrições.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
    },
  };
}

export default async function MovementSlugPage({ params }: MovementPageProps) {
  const { slug } = await params;
  const movement = await getParishMovementBySlug(slug);

  if (!movement) {
    notFound();
  }

  const events = await getMovementEvents(movement.id, movement.slug);

  return (
    <div className="min-h-screen flex flex-col bg-[#0E1012] text-[#FAF6F0]">
      <CathedralHeader />
      <MarqueeAvisos />

      <main className="flex-1">
        <MovementDetailView movement={movement} events={events} />
      </main>

      <CathedralFooter />
    </div>
  );
}

