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

  const mapsQuery = encodeURIComponent(`${community.name}, ${community.address || ''}, ${community.city} - ${community.state}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const wazeUrl = `https://waze.com/ul?q=${mapsQuery}`;

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between">
      {/* Top Header com Glassmorphism */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/80 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/#comunidades"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portal</span>
          </Link>

          <div className="flex items-center gap-2">
            <Badge variant={community.is_headquarters ? 'matriz' : 'ceb'}>
              {community.is_headquarters ? 'Igreja Matriz' : 'Comunidade Eclesial (CEB)'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Mini-site da CEB */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full">
        {/* Banner Hero da Comunidade */}
        <section className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-red-950 via-[var(--dash-surface)] to-[var(--dash-bg)] border border-[var(--dash-border)] shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {community.neighborhood || community.city}
              </span>
              {community.foundation_year && (
                <span className="text-xs text-[var(--dash-text-secondary)]">
                  Fundada em {community.foundation_year}
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
              {community.name}
            </h1>

            {community.patron_saint && (
              <p className="text-base sm:text-lg text-[var(--dash-text-secondary)]">
                Padroeiro(a): <strong className="text-[var(--dash-text-primary)]">{community.patron_saint}</strong>
                {community.feast_day && ` • Festa: ${community.feast_day}`}
              </p>
            )}

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--brand-gold-soft)] hover:bg-[var(--brand-gold-500)] text-[var(--brand-coffee)] font-bold text-sm transition-all shadow-md cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Como Chegar (Google Maps)</span>
              </a>

              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--dash-surface)] hover:bg-[var(--dash-border)] border border-[var(--dash-border)] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir no Waze</span>
              </a>
            </div>
          </div>
        </section>

        {/* Grade de 2 Colunas: Informações & Horários */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna 1 & 2: História e Localização */}
          <div className="md:col-span-2 space-y-6">
            {/* História da Capela */}
            <Card className="space-y-4">
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

      {/* Footer Simples */}
      <footer className="border-t border-[var(--dash-border)] bg-[var(--dash-surface)]/60 py-6 mt-12 text-center text-xs text-[var(--dash-text-secondary)]">
        <p>Catedral do Sagrado Coração de Jesus • Diocese de Colatina / ES</p>
      </footer>
    </div>
  );
}
