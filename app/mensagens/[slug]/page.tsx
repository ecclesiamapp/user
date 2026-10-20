import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { 
  ArrowLeft, 
  Calendar, 
  Share2, 
  UserCheck, 
  Sparkles, 
  MessageCircle,
  BookOpen
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Card, Badge, Button } from '@/components/ui';
import { PastoralMessage } from '@/types';
import { OFFICIAL_CHRISTMAS_MESSAGES } from '@/lib/pastoral-messages';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const fallbackMessages: PastoralMessage[] = OFFICIAL_CHRISTMAS_MESSAGES;

export default async function MensagemDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Buscar mensagem correspondente
  const { data: messageData } = await supabase
    .from('pastoral_messages')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  const message: PastoralMessage = messageData || fallbackMessages.find((m) => m.slug === slug) || fallbackMessages[0];

  if (!message) {
    notFound();
  }

  const isBispo = message.author_type === 'bispo';
  const paragraphs = message.content.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between">
      {/* Header com Navegação */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/80 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/mensagens" className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Colunas Pastorais</span>
          </Link>

          <Badge variant={isBispo ? 'matriz' : 'active'}>
            {isBispo ? 'Palavra do Bispo' : 'Palavra do Pároco'}
          </Badge>
        </div>
      </header>

      {/* Conteúdo do Artigo */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        {/* Identificação do Autor e Metadados */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag-gold text-xs gap-1">
              <Sparkles className="w-3 h-3 text-[var(--brand-gold-500)]" />
              {isBispo ? 'Mensagem Episcopal' : 'Mensagem Paroquial'}
            </span>
            {message.liturgical_season && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] border border-[var(--dash-border)]">
                {message.liturgical_season}
              </span>
            )}
            <span className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(message.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-bold text-[var(--dash-text-primary)] leading-tight tracking-tight">
            {message.title}
          </h1>

          {/* Card do Autor */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)]">
            <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[var(--primary)]/20 bg-[var(--dash-surface-secondary)] shrink-0 flex items-center justify-center">
              {message.author_photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={message.author_photo_url}
                  alt={message.author_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCheck className="w-6 h-6 text-[var(--primary)]" />
              )}
            </div>

            <div>
              <h2 className="font-bold text-sm sm:text-base text-[var(--dash-text-primary)] leading-snug">
                {message.author_name}
              </h2>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                {message.author_title}
              </p>
            </div>
          </div>
        </div>

        {/* Subtítulo / Citação em Destaque */}
        {message.subtitle && (
          <div className="p-5 rounded-2xl bg-[var(--dash-surface-secondary)]/80 border-l-4 border-[var(--brand-gold-500)] text-[var(--dash-text-primary)] font-medium italic text-sm sm:text-base leading-relaxed shadow-xs">
            {message.subtitle}
          </div>
        )}

        {/* Corpo do Texto */}
        <article className="prose prose-slate dark:prose-invert max-w-none space-y-5 text-sm sm:text-base text-[var(--dash-text-primary)]/90 leading-relaxed font-normal">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="leading-relaxed whitespace-pre-line">
              {p}
            </p>
          ))}
        </article>

        {/* Barra de Compartilhamento no WhatsApp */}
        <div className="pt-6 border-t border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-[var(--dash-text-secondary)]">
            Compartilhe esta mensagem com sua família e comunidade:
          </p>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`*${message.title}*\n_${message.author_name}_\n\n${message.subtitle || ''}\n\nLeia a mensagem completa: https://catedraldecolatina.org.br/mensagens/${message.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Compartilhar no WhatsApp</span>
          </a>
        </div>

        {/* Acesso a outras colunas */}
        <Card className="p-6 bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[var(--dash-text-primary)] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--primary)]" />
              Colunas Pastorais da Catedral
            </h4>
            <p className="text-xs text-[var(--dash-text-secondary)]">
              Leia todas as mensagens do Pe. Irineu e de Dom Lauro Sérgio.
            </p>
          </div>

          <Link href="/mensagens">
            <Button variant="outline" size="sm">
              Ver Todas as Mensagens
            </Button>
          </Link>
        </Card>
      </main>

      {/* Rodapé White-Label */}
      <footer className="mt-12 border-t border-[var(--dash-border)] bg-[var(--dash-surface)] py-6 text-center text-xs text-[var(--dash-text-secondary)]">
        <div className="max-w-4xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-[var(--dash-text-primary)]">
            Catedral do Sagrado Coração de Jesus
          </p>
          <p>
            Diocese de Colatina • Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
