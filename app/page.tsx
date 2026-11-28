import React from 'react';
import Link from 'next/link';
import { 
  Church, 
  MapPin, 
  ChevronRight, 
  Navigation,
  Calendar,
  FileText
} from 'lucide-react';
import { createPublicClient } from '@/utils/supabase/server';
import { Card, Badge } from '@/components/ui';
import { Community, Parish, PastoralMessage, ParishSpecialEvent } from '@/types';
import { fallbackCommunitiesList, getCommunitySlug } from '@/lib/communities';
import { OFFICIAL_NEWS_DATA } from '@/lib/news';
import { FALLBACK_SPECIAL_EVENTS } from '@/lib/events';
import { LiturgicalBanner } from '@/components/liturgy/LiturgicalBanner';
import { MissalBookletsSection } from '@/components/liturgy/MissalBookletsSection';
import { PastoralMessageFeatured } from '@/components/pastoral/PastoralMessageFeatured';
import { fallbackFeaturedMessages } from '@/lib/pastoral-messages';
import { DizimoDoacoesSection } from '@/components/dizimo/DizimoDoacoesSection';
import { CathedralHeroPortal } from '@/components/home/CathedralHeroPortal';
import { CathedralSpecialEventBanner } from '@/components/home/CathedralSpecialEventBanner';
import { SacramentsGrid } from '@/components/home/SacramentsGrid';
import { PastorSpotlight } from '@/components/home/PastorSpotlight';
import { MeuEspacoHomeBanner } from '@/components/home/MeuEspacoHomeBanner';
import { CathedralFooter } from '@/components/home/CathedralFooter';

// ISR: Pré-renderiza e serve do cache de borda por 60s
export const revalidate = 60;

export default async function ParishPublicPortalPage() {
  const supabase = createPublicClient();

  // Buscar dados públicos em paralelo
  const [parishesRes, featuredEventsRes, featuredMessagesRes] = await Promise.all([
    supabase.from('parishes').select('*').limit(1),
    supabase
      .from('parish_special_events')
      .select('*')
      .eq('is_featured_home', true)
      .eq('status', 'destaque_ativo')
      .order('start_date', { ascending: true })
      .limit(1),
    supabase
      .from('pastoral_messages')
      .select('*')
      .eq('is_featured_home', true)
      .eq('is_active', true)
      .order('published_at', { ascending: false }),
  ]);

  const parishesData = parishesRes.data;
  const featuredEventsData = featuredEventsRes.data;
  const featuredMessagesData = featuredMessagesRes.data;

  const featuredEvent: ParishSpecialEvent | undefined =
    featuredEventsData && featuredEventsData.length > 0
      ? (featuredEventsData[0] as ParishSpecialEvent)
      : FALLBACK_SPECIAL_EVENTS[0];

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

  const recentAnnouncements = OFFICIAL_NEWS_DATA.slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between selection:bg-[#FFA82A] selection:text-[#2D1A16] transition-colors duration-200">
      {/* 1. Header Translúcido & Hero Monumental com Transmissão da Live Integrada */}
      <CathedralHeroPortal
        parishName={parish.name}
        dioceseName={parish.diocese}
        whatsappNumber={parish.whatsapp_number}
      />

      {/* Conteúdo Principal do Portal com Diagramação Respiração 1240px */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 space-y-16 w-full font-sans">
        {/* 2. Folhetos das Santas Missas («Sou do Sagrado Missa») — Imediatamente Abaixo da Seção da Live */}
        <div id="folhetos" className="w-full">
          <MissalBookletsSection />
        </div>

        {/* 2.1 Banner de Destaque da Grande Festa Litúrgica (se ativo) */}
        {featuredEvent && (
          <div id="destaque-festa" className="w-full">
            <CathedralSpecialEventBanner event={featuredEvent} />
          </div>
        )}

        {/* 3. Faixa da Liturgia Diária Oficial (CNBB) */}
        <LiturgicalBanner />

        {/* 4. Portal do Paroquiano: Meu Espaço Paroquial */}
        <div id="meu-espaco" className="w-full">
          <MeuEspacoHomeBanner />
        </div>

        {/* 5. Central de Sacramentos & Secretaria (4 Cards com Ícones) */}
        <SacramentsGrid whatsappNumber={parish.whatsapp_number} />

        {/* 6. Destaque do Pároco (Pe. Irineu Claudino Sales) */}
        <PastorSpotlight whatsappNumber={parish.whatsapp_number} />

        {/* 7. Coluna Editorial: Cartas Pastorais (Bispo Dom Lauro & Pároco Pe. Irineu) */}
        {featuredMessages && featuredMessages.length > 0 && (
          <div id="pastoral">
            <PastoralMessageFeatured messages={featuredMessages} />
          </div>
        )}

        {/* 8. Módulo de Conscientização Pastoral do Dízimo & Ofertas via PIX */}
        <div id="dizimo">
          <DizimoDoacoesSection parish={parish} />
        </div>

        {/* 9. Mural de Notícias "Sou do Sagrado" */}
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

      {/* 10. Rodapé Monumental em 4 Colunas (100% White-Label) */}
      <CathedralFooter
        parishName={parish.name}
        dioceseName={parish.diocese}
        address={parish.address}
        whatsappNumber={parish.whatsapp_number}
      />
    </div>
  );
}
