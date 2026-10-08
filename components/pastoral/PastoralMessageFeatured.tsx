import React from 'react';
import Link from 'next/link';
import { Quote, BookOpen, ChevronRight, Sparkles, UserCheck } from 'lucide-react';
import { PastoralMessage } from '@/types';
import { Card, Badge, Button } from '@/components/ui';

interface PastoralMessageFeaturedProps {
  message?: PastoralMessage | null;
}

export const fallbackFeaturedMessage: PastoralMessage = {
  id: 'a0000000-0000-0000-0000-000000000001',
  parish_id: 'c0000000-0000-0000-0000-000000000001',
  author_type: 'paroco',
  author_name: 'Padre Irineu Claudino Sales',
  author_title: 'Pároco e Cura da Catedral de Colatina',
  author_photo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop',
  title: 'Uma Igreja em Saída nos Meios Digitais: Bem-vindos ao Novo Portal da Catedral!',
  slug: 'palavra-do-paroco-uma-igreja-em-saida-digital',
  subtitle: '«A beleza de nossa fé precisa resplandecer onde o povo está — e hoje, nossos lares e corações também se conectam pela tela do celular.»',
  content: 'Queridos paroquianos da Catedral do Sagrado Coração de Jesus e irmãos de todas as nossas 12 comunidades e núcleos de oração! É com imensa alegria pastoral e coração repleto de esperança que apresentamos este novo portal digital da nossa paróquia. O Papa Francisco constantemente nos convida a sermos uma "Igreja de Portas Abertas", acolhedora e próxima de cada família, enfermo e jovem.',
  liturgical_season: 'Solenidade de Todos os Santos',
  is_featured_home: true,
  is_active: true,
  published_at: new Date().toISOString(),
};

export function PastoralMessageFeatured({ message }: PastoralMessageFeaturedProps) {
  const current = message || fallbackFeaturedMessage;
  const isBispo = current.author_type === 'bispo';

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              {isBispo ? 'A Palavra do Nosso Bispo' : 'A Palavra do Nosso Pároco'}
            </h3>
            <p className="text-xs text-[var(--dash-text-secondary)]">
              Reflexão espiritual e orientação pastoral para a nossa comunidade
            </p>
          </div>
        </div>

        <Link href="/mensagens">
          <Badge variant="default" className="cursor-pointer hover:bg-[var(--dash-border)] flex items-center gap-1">
            <span>Ver Colunas</span>
            <ChevronRight className="w-3 h-3" />
          </Badge>
        </Link>
      </div>

      <Card className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-[var(--dash-surface)] via-[var(--dash-surface)] to-[var(--dash-surface-secondary)] border border-[var(--dash-border)] hover:border-[var(--primary)]/40 transition-all shadow-md">
        {/* Ícone de Aspas decorativo no fundo */}
        <Quote className="absolute right-4 bottom-4 w-32 h-32 text-[var(--primary)]/5 pointer-events-none -rotate-12" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar com identificação do autor */}
          <div className="flex sm:flex-col items-center sm:items-start gap-4 shrink-0">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-3 ring-[var(--primary)]/20 shadow-lg bg-[var(--dash-surface-secondary)] flex items-center justify-center">
                {current.author_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.author_photo_url}
                    alt={current.author_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCheck className="w-10 h-10 text-[var(--primary)]" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs">
                {isBispo ? 'Episcopal' : 'Pároco'}
              </div>
            </div>

            <div className="sm:mt-2 space-y-0.5">
              <h4 className="font-bold text-sm sm:text-base text-[var(--dash-text-primary)] leading-tight">
                {current.author_name}
              </h4>
              <p className="text-xs text-[var(--dash-text-secondary)] font-medium">
                {current.author_title}
              </p>
            </div>
          </div>

          {/* Conteúdo da Mensagem */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Sparkles className="w-3 h-3" />
                Destaque Pastoral
              </span>
              {current.liturgical_season && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] border border-[var(--dash-border)]">
                  {current.liturgical_season}
                </span>
              )}
            </div>

            <h4 className="text-lg sm:text-xl font-extrabold text-[var(--dash-text-primary)] leading-snug">
              {current.title}
            </h4>

            {current.subtitle && (
              <p className="text-xs sm:text-sm italic text-amber-400/90 font-medium leading-relaxed bg-[var(--dash-surface-secondary)]/50 p-3 rounded-xl border-l-4 border-amber-500">
                {current.subtitle}
              </p>
            )}

            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed line-clamp-3">
              {current.content}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href={`/mensagens/${current.slug}`}>
                <Button variant="primary" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
                  Ler Mensagem Completa
                </Button>
              </Link>

              <Link href="/mensagens">
                <Button variant="outline" size="sm" icon={<ChevronRight className="w-3.5 h-3.5" />}>
                  Todas as Mensagens Pastorais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
