import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Church, 
  ChevronRight, 
  AlertCircle, 
  BookOpen,
  Heart
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { CathedralFooter } from '@/components/home/CathedralFooter';
import { NewsShareButtons } from '@/components/noticias/NewsShareButtons';
import { NewsCard } from '@/components/noticias/NewsCard';
import { getNewsBySlug, getRelatedNews, OFFICIAL_NEWS_DATA, NewsArticle } from '@/lib/news';

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    return {
      title: 'Notícia não encontrada • Catedral de Colatina',
    };
  }

  return {
    title: `${article.title} • Catedral de Colatina`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.imageUrl],
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

export default async function CathedralNewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Buscar artigo (banco de dados ou fallback)
  let article: NewsArticle | undefined = getNewsBySlug(slug);

  try {
    const { data: dbArticle } = await supabase
      .from('announcements')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .limit(1)
      .single();

    if (dbArticle) {
      article = {
        id: dbArticle.id,
        slug: dbArticle.slug || slug,
        title: dbArticle.title,
        subtitle: dbArticle.subtitle || undefined,
        summary: dbArticle.content.substring(0, 160) + '...',
        content: dbArticle.content,
        category: dbArticle.category || 'noticia',
        categoryLabel:
          dbArticle.category === 'festa_padroeiro'
            ? 'Festa do Padroeiro'
            : dbArticle.category === 'pastoral'
            ? 'Vida Pastoral'
            : dbArticle.category === 'evento'
            ? 'Evento Paroquial'
            : dbArticle.category === 'noticia'
            ? 'Notícia'
            : 'Aviso da Semana',
        imageUrl: dbArticle.image_url || '/images/historia/catedral-interior.jpg',
        publishedAt: new Date(dbArticle.published_at || dbArticle.created_at || Date.now()).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        authorName: dbArticle.author_name || 'PASCOM Catedral',
        authorRole: 'Pastoral da Comunicação',
        isUrgent: !!dbArticle.is_urgent,
        readTimeMinutes: Math.max(2, Math.ceil(dbArticle.content.length / 500)),
        communityName: 'Matriz Catedral',
      };
    }
  } catch (err) {
    // Utiliza fallback de lib/news.ts
  }

  if (!article) {
    notFound();
  }

  const related = getRelatedNews(article.slug, 3);

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between selection:bg-[#FFA82A] selection:text-[#2D1A16] overflow-x-hidden">
      {/* 1. Marquee Litúrgico Fino no Topo */}
      <MarqueeAvisos />

      {/* 2. Top Bar Translúcido de Navegação */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/90 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors py-2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A]" />
            <span>Todas as Notícias</span>
          </Link>

          <NewsShareButtons title={article.title} slug={article.slug} />
        </div>
      </header>

      {/* 3. Conteúdo Principal da Notícia */}
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10 flex-grow w-full">
        {/* Breadcrumb Amigável */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--dash-text-secondary)] flex-wrap">
          <Link href="/" className="hover:text-[var(--dash-text-primary)] transition-colors">
            Início
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/noticias" className="hover:text-[var(--dash-text-primary)] transition-colors">
            Notícias & Avisos
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#8B1E22] dark:text-[#FFA82A] font-medium truncate max-w-[200px] sm:max-w-xs">
            {article.categoryLabel}
          </span>
        </nav>

        {/* Cabeçalho do Artigo */}
        <header className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] border border-[#8B1E22]/20">
              {article.categoryLabel}
            </span>
            {article.isUrgent && (
              <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide bg-[#D32F2F] text-white flex items-center gap-1 shadow-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Comunicado Urgente</span>
              </span>
            )}
            <span className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1 ml-auto">
              <Clock className="w-3.5 h-3.5 text-[#C8A463]" />
              <span>{article.readTimeMinutes} min de leitura</span>
            </span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--dash-text-primary)] leading-tight tracking-tight">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="font-serif italic text-base sm:text-xl text-[var(--dash-text-secondary)] leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Byline do Autor & Data */}
          <div className="pt-4 border-t border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#2D1A16] border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shadow-xs shrink-0">
                <Church className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-[var(--dash-text-primary)] block">
                  {article.authorName}
                </span>
                <span className="text-[11px] text-[var(--dash-text-secondary)]">
                  {article.authorRole} • Paróquia Sagrado Coração de Jesus
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--dash-text-secondary)] self-start sm:self-auto">
              <Calendar className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A]" />
              <span>Publicado em {article.publishedAt}</span>
            </div>
          </div>
        </header>

        {/* Imagem de Capa */}
        {article.imageUrl && (
          <figure className="rounded-2xl overflow-hidden border border-[var(--dash-border)] bg-black/40 shadow-md">
            <img
              src={article.imageUrl}
              alt={article.imageCaption || article.title}
              className="w-full h-72 sm:h-96 lg:h-[460px] object-cover object-center"
            />
            {article.imageCaption && (
              <figcaption className="p-3 bg-[var(--dash-surface-hover)] text-xs text-[var(--dash-text-secondary)] italic text-center border-t border-[var(--dash-border)]">
                📷 {article.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Corpo Editorial da Matéria */}
        <article className="prose prose-stone dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-[var(--dash-text-primary)] font-sans">
          {article.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // Renderizar títulos de seção
            if (trimmed.startsWith('### ')) {
              return (
                <h3
                  key={index}
                  className="font-cinzel text-xl sm:text-2xl font-bold text-[#8B1E22] dark:text-[#FFA82A] pt-4 border-b border-[var(--dash-border)] pb-2"
                >
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }

            // Renderizar listas com marcadores
            if (trimmed.includes('\n* ') || trimmed.startsWith('* ')) {
              const items = trimmed.split('\n* ').map((item) => item.replace('* ', ''));
              return (
                <ul key={index} className="space-y-2 pl-4 list-disc marker:text-[#8B1E22] dark:marker:text-[#FFA82A]">
                  {items.map((it, i) => (
                    <li key={i} className="text-sm sm:text-base text-[var(--dash-text-primary)]">
                      {it}
                    </li>
                  ))}
                </ul>
              );
            }

            // Renderizar parágrafos normais
            return (
              <p key={index} className="text-sm sm:text-base text-[var(--dash-text-primary)] leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </article>

        {/* Barra de Rodapé do Artigo: Compartilhamento e Voltar */}
        <div className="pt-6 border-t border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider">
              Gostou da notícia? Partilhe com sua comunidade:
            </span>
          </div>

          <NewsShareButtons title={article.title} slug={article.slug} />
        </div>

        {/* Bloco Pastoral de Convite para a Santa Missa */}
        <section className="bg-gradient-to-br from-[#8B1E22] via-[#5E1417] to-[#2D1A16] text-white rounded-3xl p-8 sm:p-10 border border-[#C8A463]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFCC36] flex items-center justify-center sm:justify-start gap-1.5">
              <Heart className="w-4 h-4 fill-current" />
              <span>Comunhão & Oração</span>
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wide">
              Venha Celebrar Conosco na Catedral
            </h3>
            <p className="text-xs sm:text-sm text-[#EAE3D9] max-w-lg leading-relaxed">
              Consulte os horários oficiais das Santas Missas, confissões com os sacerdotes e a adoração perpétua ao Santíssimo Sacramento.
            </p>
          </div>

          <Link
            href="/agenda-liturgica"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FFA82A] to-[#FFCC36] text-[#2D1A16] text-xs sm:text-sm font-extrabold uppercase tracking-wider hover:brightness-105 transition-all shadow-md min-h-[44px] shrink-0"
          >
            <Calendar className="w-4 h-4 text-[#2D1A16]" />
            <span>Ver Agenda Litúrgica</span>
          </Link>
        </section>

        {/* Notícias Relacionadas */}
        {related.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B75319]">
                  Fique Conectado
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--dash-text-primary)]">
                  Outras Notícias da <span className="text-[#8B1E22] dark:text-[#FFA82A]">Catedral</span>
                </h3>
              </div>

              <Link
                href="/noticias"
                className="text-xs font-bold text-[#8B1E22] dark:text-[#FFA82A] hover:underline flex items-center gap-1 min-h-[44px]"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <NewsCard key={item.id} article={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 4. Rodapé Nobre da Catedral */}
      <CathedralFooter />
    </div>
  );
}
