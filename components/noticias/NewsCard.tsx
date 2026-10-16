import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';
import { NewsArticle } from '@/lib/news';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'standard' | 'horizontal' | 'compact';
}

export function NewsCard({ article, variant = 'standard' }: NewsCardProps) {
  const isHorizontal = variant === 'horizontal';

  return (
    <article
      className={`group rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[#8B1E22]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
        isHorizontal ? 'md:flex-row' : ''
      }`}
    >
      {/* Imagem de Capa com Efeito Hover */}
      <div
        className={`relative overflow-hidden bg-black/40 shrink-0 ${
          isHorizontal ? 'md:w-2/5 h-56 md:h-auto' : 'h-48 sm:h-52 w-full'
        }`}
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Badges de Categoria e Urgência */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-xs text-[#FFCC36] border border-[#C8A463]/40">
            {article.categoryLabel}
          </span>
          {article.isUrgent && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-[#D32F2F] text-white flex items-center gap-1 shadow-sm">
              <AlertCircle className="w-3 h-3" />
              <span>Importante</span>
            </span>
          )}
        </div>

        {/* Tempo de Leitura sobre a Imagem */}
        <div className="absolute bottom-2.5 right-3 text-[11px] text-white/90 font-medium flex items-center gap-1 backdrop-blur-xs bg-black/50 px-2 py-0.5 rounded-md">
          <Clock className="w-3 h-3 text-[#FFCC36]" />
          <span>{article.readTimeMinutes} min de leitura</span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Data e Autor */}
          <div className="flex items-center gap-2 text-xs text-[var(--dash-text-secondary)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#8B1E22] dark:text-[#FFA82A]" />
              <span>{article.publishedAt}</span>
            </span>
            <span>•</span>
            <span className="truncate">{article.authorName}</span>
          </div>

          {/* Título */}
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--dash-text-primary)] group-hover:text-[#8B1E22] dark:group-hover:text-[#FFA82A] transition-colors leading-snug">
            <Link href={`/noticias/${article.slug}`} className="focus:outline-hidden">
              {article.title}
            </Link>
          </h3>

          {/* Resumo */}
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed font-sans line-clamp-2">
            {article.summary}
          </p>
        </div>

        {/* Botão de Rodapé para Leitura */}
        <div className="pt-3 border-t border-[var(--dash-border)] flex items-center justify-between">
          <span className="text-[11px] text-[#C8A463] font-semibold uppercase tracking-wider truncate">
            {article.communityName || 'Catedral de Colatina'}
          </span>

          <Link
            href={`/noticias/${article.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#8B1E22] dark:text-[#FFA82A] hover:underline min-h-[44px] py-2 px-1 focus:outline-hidden"
            aria-label={`Ler matéria completa: ${article.title}`}
          >
            <span>Ler Matéria</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
