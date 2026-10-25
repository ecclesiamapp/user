import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { 
  Church, 
  MapPin, 
  ChevronRight, 
  Navigation,
  Calendar,
  FileText
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Card, Badge } from '@/components/ui';
import { Community, Parish, PastoralMessage, ParishSpecialEvent } from '@/types';
import { fallbackCommunitiesList, getCommunitySlug } from '@/lib/communities';
import { OFFICIAL_NEWS_DATA } from '@/lib/news';
import { FALLBACK_SPECIAL_EVENTS } from '@/lib/events';
import { LiturgicalBanner } from '@/components/liturgy/LiturgicalBanner';
import { YearEndLiturgySection } from '@/components/liturgy/YearEndLiturgySection';
import { MissalBookletsSection } from '@/components/liturgy/MissalBookletsSection';
import { PastoralMessageFeatured } from '@/components/pastoral/PastoralMessageFeatured';
import { fallbackFeaturedMessages } from '@/lib/pastoral-messages';
import { DizimoDoacoesSection } from '@/components/dizimo/DizimoDoacoesSection';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { CathedralHeroPortal } from '@/components/home/CathedralHeroPortal';
import { CathedralSpecialEventBanner } from '@/components/home/CathedralSpecialEventBanner';
import { SacramentsGrid } from '@/components/home/SacramentsGrid';
import { PastorSpotlight } from '@/components/home/PastorSpotlight';
import { CathedralFooter } from '@/components/home/CathedralFooter';

export default async function ParishPublicPortalPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Buscar dados da paróquia e comunidades no Supabase
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const { data: communitiesData } = await supabase
    .from('communities')
    .select('*')
    .eq('is_active', true)
    .order('is_headquarters', { ascending: false })
    .order('name');

  // Buscar festividade litúrgica em destaque na Home (Festa da Co-Padroeira, Padroeiro, Natal, etc.)
  const { data: featuredEventsData } = await supabase
    .from('parish_special_events')
    .select('*')
    .eq('is_featured_home', true)
    .eq('status', 'destaque_ativo')
    .order('start_date', { ascending: true })
    .limit(1);

  const featuredEvent: ParishSpecialEvent | undefined =
    featuredEventsData && featuredEventsData.length > 0
      ? (featuredEventsData[0] as ParishSpecialEvent)
      : FALLBACK_SPECIAL_EVENTS[0];

  // Buscar mensagens pastorais em destaque (Cartas de Natal do Bispo e do Pároco)
  const { data: featuredMessagesData } = await supabase
    .from('pastoral_messages')
    .select('*')
    .eq('is_featured_home', true)
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  const featuredMessages: PastoralMessage[] =
    featuredMessagesData && featuredMessagesData.length > 0
      ? featuredMessagesData
      : fallbackFeaturedMessages;

  const parish: Parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    slug: 'catedral-colatina',
    city: 'Colatina',
    state: 'ES',
    address: 'Praça da Catedral, s/n - Centro, Colatina/ES',
    whatsapp_number: '552737221234',
    pix_key: 'secretaria@catedral.org.br',
    pix_key_type: 'email',
    primary_color: '#8B1E22',
    created_at: new Date().toISOString(),
  };

  const communities: Community[] = communitiesData && communitiesData.length > 0 ? communitiesData : fallbackCommunitiesList;

  const recentAnnouncements = OFFICIAL_NEWS_DATA.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5EFE7] text-[#2D1A16] flex flex-col justify-between selection:bg-[#FFA82A] selection:text-[#2D1A16]">
      {/* 1. Marquee Litúrgico Fino no Topo Absoluto (Vermelho Sagrado Coração #8B1E22) */}
      <MarqueeAvisos />

      {/* 2 & 3. Header Translúcido & Hero Monumental com Vídeo e Floating Schedule Card Conectados */}
      <CathedralHeroPortal
        parishName={parish.name}
        dioceseName={parish.diocese}
        whatsappNumber={parish.whatsapp_number}
      />

      {/* Conteúdo Principal do Portal com Diagramação Respiração 1240px */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 space-y-16 w-full font-sans">
        {/* 3.1 Banner de Destaque da Grande Festa Litúrgica (TASK-48) */}
        {featuredEvent && (
          <div id="destaque-festa" className="w-full">
            <CathedralSpecialEventBanner event={featuredEvent} />
          </div>
        )}

        {/* 4. Faixa da Liturgia Diária Oficial (CNBB) */}
        <LiturgicalBanner />

        {/* 4.1 Módulo Litúrgico Especial: Solenidade de Natal & Fim de Ano */}
        <YearEndLiturgySection />

        {/* 5. Central de Sacramentos & Secretaria (4 Cards com Ícones) */}
        <SacramentsGrid whatsappNumber={parish.whatsapp_number} />

        {/* 6. Destaque do Pároco (Pe. Irineu Claudino Sales) */}
        <PastorSpotlight whatsappNumber={parish.whatsapp_number} />

        {/* 7. Coluna Editorial: Cartas Pastorais de Natal (Bispo Dom Lauro & Pároco Pe. Irineu) */}
        {featuredMessages && featuredMessages.length > 0 && (
          <div id="pastoral">
            <PastoralMessageFeatured messages={featuredMessages} />
          </div>
        )}

        {/* 8. Nossas Comunidades (12 CEBs da Catedral) */}
        <section id="comunidades" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] text-xs font-bold uppercase tracking-wider">
                Vida em Comunidade
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#2D1A16] mt-1.5">
                Nossas <span className="text-[#8B1E22]">12 Comunidades</span>
              </h2>
            </div>
            <div className="flex flex-col sm:items-end gap-1.5">
              <p className="text-xs sm:text-sm text-[#514D4B]">
                Acesse a história, galeria de fotos e horários de cada comunidade
              </p>
              <Link
                href="/comunidades"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#8B1E22] hover:text-[#721C24] transition-colors group"
              >
                <span>Ver Mapa Diocesano & Diretório Completo</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {communities.map((c) => (
              <Card
                key={c.id}
                className={`bg-[var(--dash-surface)] rounded-2xl border border-[#EAE3D9] p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:border-[#FFA82A] transition-all ${
                  c.is_headquarters ? 'ring-2 ring-[#FFA82A]/50 border-[#FFA82A]' : ''
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    {c.is_headquarters ? (
                      <Badge variant="matriz">Igreja Matriz</Badge>
                    ) : (
                      <Badge variant="ceb">Comunidade Eclesial</Badge>
                    )}
                    <span className="text-xs font-medium text-[#7E838B]">{c.neighborhood || c.city}</span>
                  </div>

                  <div>
                    <h3 className="font-cinzel text-base font-bold text-[#2D1A16] line-clamp-1 uppercase tracking-wide">
                      {c.name}
                    </h3>
                    {c.patron_saint && (
                      <p className="text-xs text-[#514D4B] mt-0.5">
                        Padroeiro: <span className="font-semibold text-[#8B1E22]">{c.patron_saint}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between text-xs">
                  <Link
                    href={`/comunidades/${getCommunitySlug(c)}`}
                    className="inline-flex items-center gap-1 text-[#8B1E22] font-bold hover:text-[#721C24] transition-colors"
                  >
                    <span>Conhecer Comunidade</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name}, ${c.city} - ${c.state}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#7E838B] hover:text-[#2D1A16] transition-colors"
                    title="Abrir no Google Maps"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>GPS</span>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 9. Folhetos das Santas Missas (Sou do Sagrado Missa) */}
        <MissalBookletsSection />

        {/* 10. Módulo de Conscientização do Dízimo & Ofertas via PIX */}
        <div id="dizimo">
          <DizimoDoacoesSection parish={parish} />
        </div>

        {/* 11. Mural de Notícias "Sou do Sagrado" */}
        <section id="comunicados" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFA82A]/15 text-[#B75319] text-xs font-bold uppercase tracking-wider">
                Comunicação Paroquial
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#2D1A16] mt-1.5">
                Mural de <span className="text-[#8B1E22]">Avisos & Notícias</span>
              </h2>
            </div>
            <Link
              href="/noticias"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8B1E22] hover:text-[#FFA82A] transition-colors group"
            >
              <span>Ver Todas as Notícias</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentAnnouncements.map((news) => (
              <Link
                key={news.id}
                href={`/noticias/${news.slug}`}
                className="group bg-[var(--dash-surface)] rounded-2xl border border-[#EAE3D9] p-6 shadow-sm hover:shadow-md hover:border-[#FFA82A] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="tag-gold text-[11px] font-bold">
                      {news.categoryLabel}
                    </span>
                    {news.isUrgent && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B1E22]/10 text-[#8B1E22] uppercase tracking-wider">
                        Urgente
                      </span>
                    )}
                  </div>
                  <h3 className="font-cinzel text-base font-bold text-[#2D1A16] leading-snug uppercase tracking-wide group-hover:text-[#8B1E22] transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-xs text-[#514D4B] leading-relaxed line-clamp-3">
                    {news.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between text-xs text-[#8A8580] mt-4">
                  <span>{news.publishedAt}</span>
                  <span className="text-[#8B1E22] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Ler notícia <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* 12. Rodapé Monumental em 4 Colunas (100% White-Label) */}
      <CathedralFooter
        parishName={parish.name}
        dioceseName={parish.diocese}
        address={parish.address}
        whatsappNumber={parish.whatsapp_number}
      />
    </div>
  );
}
