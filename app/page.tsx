import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { 
  Church, 
  Clock, 
  QrCode, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  ChevronRight,
  ExternalLink,
  Heart,
  Navigation,
  User
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Card, Badge, Button } from '@/components/ui';
import { Community, Parish } from '@/types';

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
    primary_color: '#1e3a8a',
    created_at: new Date().toISOString(),
  };

  const communities: Community[] = communitiesData || [];

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
      {/* Header com Glassmorphism (PROTOCOLO_DEV_UX_UI) */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/80 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shadow-xs">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight text-[var(--dash-text-primary)]">
                {parish.name}
              </h1>
              <p className="text-xs text-[var(--dash-text-secondary)]">{parish.diocese}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/secretaria">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs">
                Secretaria & Clero
              </Button>
            </Link>

            <a
              href={`https://wa.me/${parish.whatsapp_number.replace(/\D/g, '')}?text=Olá,%20gostaria%20de%20informações%20da%20secretaria%20paroquial.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Falar no</span> WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Portal */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 w-full">
        {/* Hero Section Litúrgica */}
        <section className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[var(--primary)] to-blue-950 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--dash-surface)]/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-100">
              Seja Bem-vindo(a) à nossa Paróquia
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Uma comunidade de fé, acolhimento e oração.
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Consulte os horários das celebrações em nossa matriz e capelas, contribua com seu dízimo paroquial via PIX e acompanhe os avisos da comunidade.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a href="#horarios">
                <Button variant="secondary" size="md" icon={<Clock className="w-4 h-4 text-[var(--primary)]" />}>
                  Horários de Missa
                </Button>
              </a>
              <a href="#comunidades">
                <Button variant="outline" size="md" icon={<Church className="w-4 h-4" />} className="bg-[var(--dash-surface)]/10 text-white hover:bg-[var(--dash-surface)]/20 border-white/20">
                  Nossas CEBs & Capelas
                </Button>
              </a>
              <Link href="/secretaria">
                <Button variant="outline" size="md" icon={<User className="w-4 h-4" />} className="bg-[var(--dash-surface)]/10 text-white hover:bg-[var(--dash-surface)]/20 border-white/20">
                  Secretaria & Padres
                </Button>
              </Link>
              <a href="#dizimo">
                <Button variant="liturgical" size="md" icon={<Heart className="w-4 h-4" />}>
                  Dízimo PIX
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Seção 1: Celebrações de Hoje */}
        <section id="horarios" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-lg sm:text-xl font-bold">Celebrações e Missas de Hoje</h3>
            </div>
            <Badge variant="active">Horários Confirmados</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {todayMasses.map((item, index) => (
              <Card key={index} className="flex flex-col justify-between hover:border-[var(--primary)]/50">
                <div>
                  <span className="text-2xl font-black text-[var(--primary)]">{item.time}</span>
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

        {/* Seção 2: Nossas Comunidades & Capelas (Hierarquia CEBs) */}
        <section id="comunidades" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Church className="w-5 h-5 text-[var(--primary)]" />
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Rede de Comunidades & Capelas (CEBs)</h3>
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
                  c.is_headquarters ? 'border-amber-500/40 ring-1 ring-amber-500/20' : ''
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
                  <span className="text-[var(--dash-text-secondary)]">{c.contact_name || 'Comunidade Ativa'}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name}, ${c.city} - ${c.state}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--primary)] font-semibold hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Como Chegar</span>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Seção 3: Dízimo Paroquial e Ofertas via PIX */}
        <section id="dizimo">
          <Card className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">Ato de Fidelidade e Partilha</span>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">Dízimo e Intenções de Santa Missa via PIX</h3>
              </div>
              <Badge variant="active" icon={<QrCode className="w-4 h-4" />}>
                PIX Direto na Conta da Paróquia
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed">
              Seu dízimo sustenta as obras de caridade pastoral, a manutenção do templo e os trabalhos de evangelização em nossa comunidade.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
              <div className="p-5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-3">
                <div>
                  <span className="text-xs text-[var(--dash-text-secondary)] block">Chave PIX Oficial ({parish.pix_key_type?.toUpperCase() || 'E-MAIL'}):</span>
                  <span className="text-base font-mono font-bold select-all text-[var(--primary)]">{parish.pix_key}</span>
                </div>
                <div className="text-xs text-[var(--dash-text-secondary)] pt-2 border-t border-[var(--dash-border)]">
                  <p><strong>Favorecido:</strong> {parish.name}</p>
                  <p><strong>Cidade:</strong> {parish.city}/{parish.state}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[var(--dash-text-secondary)]">
                <p className="font-semibold text-[var(--dash-text-primary)]">Como realizar sua contribuição:</p>
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Abra o aplicativo do seu banco de preferência.</li>
                  <li>Escolha a opção de pagamento via <strong>PIX</strong>.</li>
                  <li>Copie e cole a chave paroquial ao lado.</li>
                  <li>Se desejar marcar como Dízimo ou Intenção, adicione na descrição do PIX.</li>
                </ol>
              </div>
            </div>
          </Card>
        </section>

        {/* Seção 4: Avisos e Notícias da Paróquia */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-lg sm:text-xl font-bold">Mural e Avisos Pastorais</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentAnnouncements.map((news) => (
              <Card key={news.id} className="flex flex-col justify-between space-y-3 hover:border-[var(--primary)]/50">
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

        {/* Localização e Atendimento */}
        <Card className="bg-[var(--dash-surface-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm sm:text-base flex items-center gap-2 text-[var(--dash-text-primary)]">
              <MapPin className="w-4 h-4 text-[var(--primary)]" />
              Secretaria Paroquial e Endereço
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

      {/* Rodapé 100% White-Label (NENHUMA menção ao Ecclesiam) */}
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
