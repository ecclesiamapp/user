import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { 
  ArrowLeft, 
  Newspaper, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Send 
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { CathedralFooter } from '@/components/home/CathedralFooter';
import { NewsFilters } from '@/components/noticias/NewsFilters';
import { getAllNews, getFeaturedNews, NewsArticle } from '@/lib/news';
import { Parish, Announcement } from '@/types';

export const metadata: Metadata = {
  title: 'Notícias & Avisos • Catedral do Sagrado Coração de Jesus • Colatina/ES',
  description:
    'Acompanhe as notícias oficiais, avisos litúrgicos da semana, eventos e comunicados da PASCOM da Catedral de Colatina e suas 12 comunidades.',
};

export default async function CathedralNewsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Obter dados da Paróquia
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const parish: Parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    slug: 'catedral-colatina',
    city: 'Colatina',
    state: 'ES',
    address: 'Praça da Catedral, s/n - Centro, Colatina/ES',
    whatsapp_number: '552737221234',
    pix_key: 'secretaria@catedraldecolatina.org.br',
    pix_key_type: 'email',
    primary_color: '#8B1E22',
    created_at: new Date().toISOString(),
  };

  // 2. Buscar Notícias/Avisos do Supabase com fallback resiliente
  let articles: NewsArticle[] = getAllNews();
  try {
    const { data: dbAnnouncements } = await supabase
      .from('announcements')
      .select('*')
      .eq('parish_id', parish.id)
      .eq('is_active', true)
      .order('published_at', { ascending: false });

    if (dbAnnouncements && dbAnnouncements.length > 0) {
      // Mesclar dados do banco com o fallback
      const mappedDb: NewsArticle[] = (dbAnnouncements as any[]).map((a, idx) => ({
        id: a.id,
        slug: a.slug || `noticia-${a.id.substring(0, 8)}`,
        title: a.title,
        subtitle: a.subtitle || undefined,
        summary: a.content.substring(0, 160) + '...',
        content: a.content,
        category: a.category || 'aviso',
        categoryLabel:
          a.category === 'festa_padroeiro'
            ? 'Festa do Padroeiro'
            : a.category === 'pastoral'
            ? 'Vida Pastoral'
            : a.category === 'evento'
            ? 'Evento Paroquial'
            : a.category === 'noticia'
            ? 'Notícia'
            : 'Aviso da Semana',
        imageUrl: a.image_url || '/images/historia/catedral-interior.jpg',
        publishedAt: new Date(a.published_at || a.created_at || Date.now()).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        authorName: a.author_name || 'PASCOM Catedral',
        authorRole: 'Pastoral da Comunicação',
        isUrgent: !!a.is_urgent,
        isFeatured: idx === 0,
        readTimeMinutes: Math.max(2, Math.ceil(a.content.length / 500)),
        communityName: 'Matriz Catedral',
      }));

      articles = mappedDb;
    }
  } catch (err) {
    console.warn('Fallback ativado para notícias:', err);
  }

  const featured = articles.find((a) => a.isFeatured) || articles[0];
  const listWithoutFeatured = articles;

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between selection:bg-[#FFA82A] selection:text-[#2D1A16] overflow-x-hidden">
      {/* 1. Marquee Litúrgico Fino no Topo */}
      <MarqueeAvisos />

      {/* 2. Top Bar Translúcido de Navegação */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/90 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors py-2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A]" />
            <span>Voltar ao Portal da Catedral</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-[#C8A463] font-serif font-bold uppercase tracking-wider">
            <span>✝</span>
            <span className="hidden sm:inline">Comunicação Oficial • PASCOM</span>
          </div>
        </div>
      </header>

      {/* 3. Hero Monumental de Notícias & Comunicação */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C1614] via-[#2A1D1A] to-[#1C1614] text-white py-14 sm:py-20 border-b border-[#C8A463]/30">
        <img
          src="/images/historia/catedral-vitrais.jpg"
          alt="Vitrais da Catedral de Colatina"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-15 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1614]/90 via-[#2A1D1A]/90 to-[#1C1614] pointer-events-none" />

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B1E22] via-[#5E1417] to-[#2D1A16] border-2 border-[#FFA82A] text-[#FFCC36] shadow-xl shadow-black/40">
            <Newspaper className="w-7 h-7" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B1E22]/40 border border-[#C8A463]/40 text-[#FFCC36] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pastoral da Comunicação • PASCOM</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight uppercase text-white leading-tight">
              Mural de Notícias & <span className="text-[#FFA82A]">Avisos</span>
            </h1>

            <p className="font-sans text-xs sm:text-base text-[#EAE3D9] max-w-2xl mx-auto leading-relaxed">
              Fique por dentro das novidades, eventos, celebrações das 12 comunidades e comunicados oficiais da Paróquia Sagrado Coração de Jesus.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs font-semibold text-[#FFA82A] backdrop-blur-xs">
              📰 Atualização Semanal
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs font-semibold text-[#FFA82A] backdrop-blur-xs">
              🤝 12 Comunidades Vivas
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs font-semibold text-[#FFA82A] backdrop-blur-xs">
              ⛪ Diócese de Colatina
            </span>
          </div>
        </div>
      </section>

      {/* 4. Corpo Principal com Destaque e Filtros */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12 flex-grow w-full">
        {/* Destaque Editorial Principal */}
        {featured && (
          <section className="bg-gradient-to-br from-[#8B1E22]/10 via-[var(--dash-surface)] to-[var(--dash-surface)] rounded-3xl border border-[#C8A463]/40 overflow-hidden shadow-md hover:shadow-xl transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Foto Nobre */}
              <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[360px] bg-black/40 overflow-hidden">
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8B1E22] to-[#5E1417] text-[#FFCC36] text-xs font-extrabold uppercase tracking-wider border border-[#FFA82A]/40 shadow-sm">
                    ★ Destaque Pastoral
                  </span>
                </div>
              </div>

              {/* Informações da Matéria */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[var(--dash-text-secondary)]">
                    <span className="text-[#8B1E22] dark:text-[#FFA82A] font-bold uppercase tracking-wider">
                      {featured.categoryLabel}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featured.readTimeMinutes} min de leitura</span>
                    </span>
                  </div>

                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--dash-text-primary)] leading-snug">
                    <Link href={`/noticias/${featured.slug}`} className="hover:text-[#8B1E22] dark:hover:text-[#FFA82A] transition-colors">
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed font-sans line-clamp-3">
                    {featured.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-[var(--dash-text-secondary)]">
                    <span className="block font-semibold text-[var(--dash-text-primary)]">{featured.authorName}</span>
                    <span>{featured.publishedAt}</span>
                  </div>

                  <Link
                    href={`/noticias/${featured.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] hover:brightness-110 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all min-h-[44px]"
                  >
                    <span>Ler Matéria Completa</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mural de Notícias Filtrável */}
        <NewsFilters articles={listWithoutFeatured} />

        {/* Bloco Pastoral: Envie sua Notícia das CEBs */}
        <section className="bg-gradient-to-br from-[#8B1E22] via-[#5E1417] to-[#2D1A16] text-white rounded-3xl p-8 sm:p-10 border border-[#C8A463]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFCC36] flex items-center justify-center md:justify-start gap-1.5">
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Comunicação das 12 CEBs</span>
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wide">
              Sua Comunidade tem um Evento ou Aviso?
            </h3>
            <p className="text-xs sm:text-sm text-[#EAE3D9] max-w-xl leading-relaxed">
              Os coordenadores das 12 comunidades e movimentos pastorais podem enviar fotos, testemunhos e avisos para publicação no mural da PASCOM.
            </p>
          </div>

          <a
            href={`https://wa.me/${parish.whatsapp_number}?text=${encodeURIComponent(
              'Olá, PASCOM da Catedral! Gostaria de enviar um aviso/notícia da minha comunidade para publicação no portal.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FFA82A] to-[#FFCC36] text-[#2D1A16] text-xs sm:text-sm font-extrabold uppercase tracking-wider hover:brightness-105 transition-all shadow-md min-h-[44px] shrink-0"
          >
            <Send className="w-4 h-4 text-[#2D1A16]" />
            <span>Enviar Notícia para a PASCOM</span>
          </a>
        </section>
      </main>

      {/* 5. Rodapé Nobre da Catedral */}
      <CathedralFooter />
    </div>
  );
}
