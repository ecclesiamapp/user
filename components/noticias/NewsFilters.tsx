'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Filter, Newspaper, Sparkles } from 'lucide-react';
import { NewsArticle, NEWS_CATEGORIES } from '@/lib/news';
import { NewsCard } from './NewsCard';

interface NewsFiltersProps {
  articles: NewsArticle[];
}

export function NewsFilters({ articles }: NewsFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' || article.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        (article.categoryLabel && article.categoryLabel.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Barra de Filtros e Busca Responsiva */}
      <div className="bg-[var(--dash-surface)] p-4 sm:p-6 rounded-2xl border border-[var(--dash-border)] shadow-xs space-y-4">
        {/* Campo de Busca */}
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--dash-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, palavra-chave ou tema da matéria..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs sm:text-sm text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:outline-hidden focus:ring-2 focus:ring-[#8B1E22]/40 transition-all min-h-[44px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Pílulas de Categoria (Scroll Horizontal no Mobile com Proteção Anti-Overflow) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none -mx-1 px-1">
          {NEWS_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? articles.length
                : articles.filter((a) => a.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                type="button"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#8B1E22] to-[#5E1417] text-[#FFCC36] shadow-xs'
                    : 'bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-border)]/50'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected
                      ? 'bg-black/30 text-[#FFCC36]'
                      : 'bg-[var(--dash-border)] text-[var(--dash-text-secondary)]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resultados da Filtragem */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[var(--dash-border)] mb-6 text-xs text-[var(--dash-text-secondary)]">
          <span>
            Exibindo <strong>{filteredArticles.length}</strong> {filteredArticles.length === 1 ? 'notícia' : 'notícias'}
            {searchQuery && ` para "${searchQuery}"`}
          </span>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-[#8B1E22] dark:text-[#FFA82A] font-bold hover:underline cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)] p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] flex items-center justify-center mx-auto">
              <Newspaper className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-cinzel text-lg font-bold text-[var(--dash-text-primary)]">
                Nenhuma notícia encontrada
              </h3>
              <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-md mx-auto">
                Não localizamos publicações com os termos informados. Tente buscar por outros termos ou selecione outra categoria.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-[var(--dash-surface-hover)] border border-[var(--dash-border)] text-xs font-bold uppercase tracking-wider text-[var(--dash-text-primary)] hover:border-[#8B1E22] transition-colors min-h-[44px] cursor-pointer"
            >
              Ver todas as notícias
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
