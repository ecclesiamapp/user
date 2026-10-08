import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { 
  Church, 
  ArrowLeft, 
  BookOpen, 
  Quote, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  UserCheck
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Card, Badge, Button } from '@/components/ui';
import { PastoralMessage } from '@/types';

// Mensagens padrão caso o banco esteja carregando ou offline
const fallbackMessages: PastoralMessage[] = [
  {
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
    published_at: '2026-10-07T10:00:00Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    author_type: 'bispo',
    author_name: 'Dom Lauro Sérgio Versiani Barbosa',
    author_title: 'Bispo Diocesano de Colatina',
    author_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    title: 'Comunhão, Participação e Missão: A Catedral como Mãe e Referência Pastoral',
    slug: 'palavra-do-bispo-catedral-mae-e-referencia-pastoral',
    subtitle: '«A Catedral é a cátedra de onde emana a unidade da Diocese de Colatina; que a comunicação eclesial seja reflexo do amor misericordioso de Cristo.»',
    content: 'Irmãos e irmãs da amada Diocese de Colatina e da Paróquia Catedral do Sagrado Coração de Jesus, paz e bem! A Igreja Diocesana se alegra com cada passo que damos rumo à sinodalidade e à comunhão. A Catedral, sede da nossa cátedra episcopal, possui a sublime missão de ser luz orientadora e abraço acolhedor para todas as paróquias do Vale do Rio Doce.',
    liturgical_season: 'Tempo Comum',
    is_featured_home: false,
    is_active: true,
    published_at: '2026-10-05T09:00:00Z',
  },
];

export default async function MensagensPastoraisPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Buscar todas as mensagens ativas no Supabase
  const { data: messagesData } = await supabase
    .from('pastoral_messages')
    .select('*')
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  const messages: PastoralMessage[] = messagesData && messagesData.length > 0 ? messagesData : fallbackMessages;

  // Filtrar mensagens do Pároco e do Bispo
  const parocoMessages = messages.filter((m) => m.author_type === 'paroco');
  const bispoMessages = messages.filter((m) => m.author_type === 'bispo');

  const latestParoco = parocoMessages[0] || fallbackMessages[0];
  const latestBispo = bispoMessages[0] || fallbackMessages[1];

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between">
      {/* Header com Navegação de Retorno */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/80 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portal da Catedral</span>
          </Link>

          <Badge variant="matriz" icon={<Church className="w-3.5 h-3.5" />}>
            Colunas Pastorais
          </Badge>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 w-full">
        {/* Banner de Apresentação das Colunas */}
        <section className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-200">
              <BookOpen className="w-3.5 h-3.5" />
              Magistério e Acolhimento Espiritual
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              A Palavra dos Nossos Pastores
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Mensagens, cartas pastorais e reflexões periódicas do <strong>Padre Irineu Claudino Sales</strong> (Pároco) e de <strong>Dom Lauro Sérgio Versiani Barbosa</strong> (Bispo Diocesano) para iluminar a caminhada das nossas famílias e comunidades.
            </p>
          </div>
        </section>

        {/* Os Dois Grandes Cards Nobres: Pároco e Bispo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card Nobre 1: A Palavra do Nosso Pároco */}
          <Card className="flex flex-col justify-between p-6 sm:p-8 space-y-6 bg-[var(--dash-surface)] border border-[var(--dash-border)] hover:border-amber-500/40 transition-all shadow-md">
            <div className="space-y-5">
              {/* Cabeçalho do Autor */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--dash-border)]">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-amber-500/30 shadow-md bg-[var(--dash-surface-secondary)] flex items-center justify-center">
                      {latestParoco.author_photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={latestParoco.author_photo_url}
                          alt={latestParoco.author_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCheck className="w-8 h-8 text-[var(--primary)]" />
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                      Pároco
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[var(--dash-text-primary)]">
                      {latestParoco.author_name}
                    </h2>
                    <p className="text-xs text-[var(--dash-text-secondary)]">
                      {latestParoco.author_title}
                    </p>
                  </div>
                </div>

                <Badge variant="active">Coluna Paroquial</Badge>
              </div>

              {/* Mensagem Atual do Pároco */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[var(--dash-text-secondary)]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(latestParoco.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  {latestParoco.liturgical_season && (
                    <>
                      <span>•</span>
                      <span className="text-amber-400 font-semibold">{latestParoco.liturgical_season}</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-[var(--dash-text-primary)] leading-snug">
                  {latestParoco.title}
                </h3>

                {latestParoco.subtitle && (
                  <p className="text-xs sm:text-sm italic text-amber-400/90 leading-relaxed bg-[var(--dash-surface-secondary)]/50 p-3 rounded-xl border-l-4 border-amber-500">
                    {latestParoco.subtitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed line-clamp-4">
                  {latestParoco.content}
                </p>
              </div>
            </div>

            {/* Ações e Histórico */}
            <div className="pt-4 border-t border-[var(--dash-border)] space-y-4">
              <Link href={`/mensagens/${latestParoco.slug}`} className="block">
                <Button variant="primary" size="md" className="w-full justify-center" icon={<BookOpen className="w-4 h-4" />}>
                  Ler Mensagem Atual do Pároco
                </Button>
              </Link>

              {/* Acervo de Mensagens Anteriores do Pároco */}
              {parocoMessages.length > 1 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
                    Reflexões Anteriores do Pároco:
                  </h4>
                  <div className="space-y-1.5">
                    {parocoMessages.slice(1, 4).map((prev) => (
                      <Link
                        key={prev.id}
                        href={`/mensagens/${prev.slug}`}
                        className="p-2.5 rounded-xl bg-[var(--dash-surface-secondary)] hover:bg-[var(--dash-border)] transition-colors flex items-center justify-between text-xs group"
                      >
                        <span className="font-semibold text-[var(--dash-text-primary)] group-hover:text-[var(--primary)] truncate pr-2">
                          {prev.title}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[var(--dash-text-secondary)]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Card Nobre 2: A Palavra do Nosso Bispo */}
          <Card className="flex flex-col justify-between p-6 sm:p-8 space-y-6 bg-[var(--dash-surface)] border border-[var(--dash-border)] hover:border-blue-500/40 transition-all shadow-md">
            <div className="space-y-5">
              {/* Cabeçalho do Bispo */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--dash-border)]">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-blue-500/30 shadow-md bg-[var(--dash-surface-secondary)] flex items-center justify-center">
                      {latestBispo.author_photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={latestBispo.author_photo_url}
                          alt={latestBispo.author_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Church className="w-8 h-8 text-[var(--primary)]" />
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-600 text-white shadow-xs">
                      Bispo
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[var(--dash-text-primary)]">
                      {latestBispo.author_name}
                    </h2>
                    <p className="text-xs text-[var(--dash-text-secondary)]">
                      {latestBispo.author_title}
                    </p>
                  </div>
                </div>

                <Badge variant="matriz">Voz Diocesana</Badge>
              </div>

              {/* Mensagem Atual do Bispo */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[var(--dash-text-secondary)]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(latestBispo.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  {latestBispo.liturgical_season && (
                    <>
                      <span>•</span>
                      <span className="text-blue-400 font-semibold">{latestBispo.liturgical_season}</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-[var(--dash-text-primary)] leading-snug">
                  {latestBispo.title}
                </h3>

                {latestBispo.subtitle && (
                  <p className="text-xs sm:text-sm italic text-blue-400/90 leading-relaxed bg-[var(--dash-surface-secondary)]/50 p-3 rounded-xl border-l-4 border-blue-500">
                    {latestBispo.subtitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed line-clamp-4">
                  {latestBispo.content}
                </p>
              </div>
            </div>

            {/* Ações e Histórico */}
            <div className="pt-4 border-t border-[var(--dash-border)] space-y-4">
              <Link href={`/mensagens/${latestBispo.slug}`} className="block">
                <Button variant="secondary" size="md" className="w-full justify-center" icon={<BookOpen className="w-4 h-4 text-[var(--primary)]" />}>
                  Ler Carta Pastoral do Bispo
                </Button>
              </Link>

              {/* Acervo de Mensagens Anteriores do Bispo */}
              {bispoMessages.length > 1 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
                    Cartas Anteriores de Dom Lauro:
                  </h4>
                  <div className="space-y-1.5">
                    {bispoMessages.slice(1, 4).map((prev) => (
                      <Link
                        key={prev.id}
                        href={`/mensagens/${prev.slug}`}
                        className="p-2.5 rounded-xl bg-[var(--dash-surface-secondary)] hover:bg-[var(--dash-border)] transition-colors flex items-center justify-between text-xs group"
                      >
                        <span className="font-semibold text-[var(--dash-text-primary)] group-hover:text-[var(--primary)] truncate pr-2">
                          {prev.title}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[var(--dash-text-secondary)]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Rodapé White-Label */}
      <footer className="mt-12 border-t border-[var(--dash-border)] bg-[var(--dash-surface)] py-6 text-center text-xs text-[var(--dash-text-secondary)]">
        <div className="max-w-5xl mx-auto px-4 space-y-1">
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
