import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { 
  Church, 
  Clock, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  ChevronRight,
  ExternalLink,
  Navigation
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Card, Badge, Button } from '@/components/ui';
import { Community, Parish, PastoralMessage } from '@/types';
import { fallbackCommunitiesList, getCommunitySlug } from '@/lib/communities';
import { LiturgicalBanner } from '@/components/liturgy/LiturgicalBanner';
import { MissalBookletsSection } from '@/components/liturgy/MissalBookletsSection';
import { PastoralMessageFeatured } from '@/components/pastoral/PastoralMessageFeatured';
import { DizimoDoacoesSection } from '@/components/dizimo/DizimoDoacoesSection';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';

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

  // Buscar mensagem pastoral em destaque para a Home (Palavra do Pároco / Palavra do Bispo)
  const { data: featuredMessageData } = await supabase
    .from('pastoral_messages')
    .select('*')
    .eq('is_featured_home', true)
    .eq('is_active', true)
    .limit(1);

  const featuredMessage: PastoralMessage | null = featuredMessageData?.[0] || null;

  const parish: Parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    slug: 'catedral-colatina',
    city: 'Colatina',
    state: 'ES',
    address: 'Praça da Catedral, s/n - Centro',
    whatsapp_number: '5527999990000',
    pix_key: 'secretaria@catedral.org.br',
    pix_key_type: 'email',
    primary_color: '#8B1E22',
    created_at: new Date().toISOString(),
  };

  const communities: Community[] = communitiesData && communitiesData.length > 0 ? communitiesData : fallbackCommunitiesList;

  const todayMasses = [
    { time: '07:00', label: 'Santa Missa Matriz', location: 'Catedral - Altar Principal' },
    { time: '15:00', label: 'Atendimento de Confissões', location: 'Secretaria Paroquial' },
    { time: '19:30', label: 'Santa Missa e Bênção do Santíssimo', location: 'Catedral - Altar Principal' },
  ];

  const recentAnnouncements = [
    {
      id: '1',
      title: 'Inscrições Abertas para a Catequese de Primeira Eucaristia 2027',
      category: 'Pastoral Catequética',
      date: '22 de Setembro',
    },
    {
      id: '2',
      title: 'Celebração da Palavra e Encontro de Jovens nas CEBs',
      category: 'Comunidades',
      date: '20 de Setembro',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between">
      {/* 1. Marquee Superior Contínuo Pe. Alex Nogueira (banner_horizontal) */}
      <MarqueeAvisos />

      {/* 2. Header com Estilo Limpo Pe. Alex Nogueira */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8DFD3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-gold-500)] to-[var(--brand-gold-700)] text-[#2D1A16] flex items-center justify-center shadow-xs">
              <Church className="w-5 h-5 text-[#2D1A16]" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base leading-tight text-[var(--dash-text-primary)]">
                {parish.name}
              </h1>
              <p className="text-xs text-[var(--dash-text-secondary)]">{parish.diocese}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/secretaria">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs border-[#E8DFD3] text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)]">
                Secretaria & Clero
              </Button>
            </Link>

            <a
              href={`https://wa.me/${parish.whatsapp_number.replace(/\D/g, '')}?text=Olá,%20gostaria%20de%20informações%20da%20secretaria%20paroquial.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[var(--brand-gold-500)] hover:bg-[var(--brand-gold-400)] text-[#2D1A16] text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#2D1A16]" />
              <span className="hidden sm:inline">Falar no</span> WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Portal */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 w-full">
        {/* 3. Hero Section Monumental & Acolhedora + Floating Schedule Card */}
        <HomeHeroSection
          parishName={parish.name}
          dioceseName={parish.diocese}
        />

        {/* 4. Faixa da Liturgia Diária Oficial (CNBB) & Cor Canônica */}
        <LiturgicalBanner />

        {/* 5. Celebrações e Missas de Hoje */}
        <section id="horarios" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[var(--brand-gold-700)]" />
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--dash-text-primary)]">
                <span className="text-[var(--brand-gold-500)]">Celebrações</span> de Hoje
              </h3>
            </div>
            <span className="tag-gold">Horários Confirmados</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {todayMasses.map((item, index) => (
              <Card key={index} className="flex flex-col justify-between hover:border-[var(--brand-gold-500)]/60 transition-colors">
                <div>
                  <span className="text-2xl font-black text-[var(--primary)] tabular-nums">{item.time}</span>
                  <h4 className="font-bold text-sm mt-1">{item.label}</h4>
                </div>
                <p className="text-xs text-[var(--dash-text-secondary)] mt-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                  {item.location}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* 6. A Palavra do Nosso Pároco / Bispo (Coluna Editorial Pastoral) */}
        <div id="pastoral">
          <PastoralMessageFeatured message={featuredMessage} />
        </div>

        {/* 7. Nossas Comunidades & Capelas (Hierarquia CEBs) */}
        <section id="comunidades" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Church className="w-5 h-5 text-[var(--primary)]" />
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--dash-text-primary)]">
                  <span className="text-[var(--brand-gold-500)]">Comunidades</span> & Capelas (CEBs)
                </h3>
                <p className="text-xs text-[var(--dash-text-secondary)]">Conheça todas as comunidades que formam nossa paróquia</p>
              </div>
            </div>
            <Link href="/admin/comunidades">
              <Badge variant="default" className="cursor-pointer hover:bg-[var(--dash-border)]">
                Secretaria Paroquial
              </Badge>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities.map((c) => (
              <Card
                key={c.id}
                className={`flex flex-col justify-between space-y-3 ${
                  c.is_headquarters ? 'border-[var(--brand-gold-500)]/50 ring-1 ring-[var(--brand-gold-500)]/30' : ''
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    {c.is_headquarters ? (
                      <Badge variant="matriz">Igreja Matriz</Badge>
                    ) : (
                      <Badge variant="ceb">CEB / Capela</Badge>
                    )}
                    <span className="text-xs text-[var(--dash-text-secondary)]">{c.neighborhood || c.city}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm leading-snug line-clamp-1">{c.name}</h4>
                    {c.patron_saint && (
                      <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
                        Padroeiro: <span className="font-semibold text-[var(--dash-text-primary)]">{c.patron_saint}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--dash-border)] flex items-center justify-between text-xs">
                  <Link
                    href={`/comunidades/${getCommunitySlug(c)}`}
                    className="inline-flex items-center gap-1 text-[var(--primary)] font-semibold hover:underline"
                  >
                    <span>Conhecer Capela</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name}, ${c.city} - ${c.state}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors"
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

        {/* 8. Folhetos das Santas Missas (Sou do Sagrado Missa) */}
        <MissalBookletsSection />

        {/* 9. Conscientização Pastoral do Dízimo (Theòs) & Ofertas via PIX */}
        <DizimoDoacoesSection parish={parish} />

        {/* 10. Mural e Avisos Pastorais */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[var(--brand-gold-700)]" />
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--dash-text-primary)]">
                <span className="text-[var(--brand-gold-500)]">Mural</span> de Avisos
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentAnnouncements.map((news) => (
              <Card key={news.id} className="flex flex-col justify-between space-y-3 hover:border-[var(--brand-gold-500)]/60 transition-colors">
                <div>
                  <Badge variant="default">{news.category}</Badge>
                  <h4 className="text-base font-bold mt-2 leading-snug">{news.title}</h4>
                </div>
                <div className="text-xs text-[var(--dash-text-secondary)] flex items-center justify-between pt-2 border-t border-[var(--dash-border)]">
                  <span>{news.date}</span>
                  <span className="text-[var(--primary)] font-semibold flex items-center gap-1 cursor-pointer">
                    Ler aviso <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 11. Localização e Atendimento da Secretaria */}
        <Card className="bg-[var(--dash-surface-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[var(--dash-border)]">
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base flex items-center gap-2 text-[var(--dash-text-primary)] font-extrabold">
              <MapPin className="w-4 h-4 text-[var(--brand-gold-700)]" />
              <span className="text-[var(--brand-gold-500)]">Secretaria</span> Paroquial e Endereço
            </h4>
            <p className="text-xs text-[var(--dash-text-secondary)]">{parish.address}</p>
            <p className="text-xs text-[var(--dash-text-secondary)]">Atendimento de Segunda a Sexta: 08:00 às 17:00</p>
          </div>

          <a
            href={`https://wa.me/${parish.whatsapp_number.replace(/\D/g, '')}?text=Olá,%20gostaria%20de%20informações.`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="primary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
              Secretaria Online
            </Button>
          </a>
        </Card>
      </main>

      {/* 12. Rodapé 100% White-Label (NENHUMA menção ao Ecclesiam) */}
      <footer className="mt-12 border-t border-[var(--dash-border)] bg-[var(--dash-surface)] py-6 text-center text-xs text-[var(--dash-text-secondary)]">
        <div className="max-w-5xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-[var(--dash-text-primary)]">
            © {new Date().getFullYear()} {parish.name}
          </p>
          <p>
            Todos os direitos reservados. {parish.diocese}.
          </p>
        </div>
      </footer>
    </div>
  );
}
