import React from 'react';
import Link from 'next/link';
import { 
  Church, 
  Clock, 
  QrCode, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  ChevronRight,
  ExternalLink,
  Heart
} from 'lucide-react';

export default function ParishPublicPortalPage() {
  // Dados da Paróquia (carregados via tenant/banco de dados)
  const parish = {
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    address: 'Praça da Catedral, Centro - Colatina/ES',
    whatsapp: '5527999990000',
    pix_key: 'secretaria@catedral.org.br',
    pix_bank: 'Sicoob Diocesano',
  };

  const todayMasses = [
    { time: '07:00', label: 'Santa Missa Matriz', location: 'Altar Principal' },
    { time: '15:00', label: 'Atendimento de Confissões', location: 'Secretaria Paroquial' },
    { time: '19:30', label: 'Santa Missa e Bênção do Santíssimo', location: 'Altar Principal' },
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
      title: 'Aviso Importante: Celebração Solene da Padroeira neste Sábado',
      category: 'Liturgia',
      date: '20 de Setembro',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between">
      {/* Barra de Acolhimento e Navegação Superior */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/80 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shadow-sm">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight">{parish.name}</h1>
              <p className="text-xs text-[var(--dash-text-secondary)]">{parish.diocese}</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${parish.whatsapp}?text=Olá,%20gostaria%20de%20informações%20da%20secretaria%20paroquial.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Falar no</span> WhatsApp
          </a>
        </div>
      </header>

      {/* Conteúdo Principal do Portal */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 w-full">
        {/* Hero Section Litúrgica */}
        <section className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[var(--primary)] to-blue-900 text-white shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--dash-surface)]/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-blue-100">
              Seja Bem-vindo(a) à nossa Paróquia
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Uma comunidade de fé, acolhimento e oração.
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Consulte os horários das celebrações, contribua com seu dízimo paroquial via PIX e acompanhe os avisos da comunidade.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#horarios"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--dash-surface)] text-[var(--primary)] font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm"
              >
                <Clock className="w-4 h-4" />
                Ver Horários de Missa
              </a>
              <a
                href="#dizimo"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--dash-surface)]/15 hover:bg-[var(--dash-surface)]/25 text-white font-semibold text-sm backdrop-blur-sm transition-colors border border-white/20"
              >
                <Heart className="w-4 h-4" />
                Dízimo via PIX
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
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)]">
              Horários Confirmados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {todayMasses.map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm hover:border-[var(--primary)]/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-[var(--primary)]">{item.time}</span>
                  <h4 className="font-bold text-sm mt-1">{item.label}</h4>
                </div>
                <p className="text-xs text-[var(--dash-text-secondary)] mt-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.location}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Seção 2: Dízimo Paroquial e Ofertas via PIX */}
        <section id="dizimo" className="rounded-2xl p-6 sm:p-8 bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">Ato de Fidelidade e Partilha</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">Dízimo e Intenções de Santa Missa via PIX</h3>
            </div>
            <span className="self-start sm:self-auto text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold flex items-center gap-1.5">
              <QrCode className="w-4 h-4" />
              PIX Direto na Conta da Paróquia
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed">
            Seu dízimo sustenta as obras de caridade pastoral, a manutenção do templo e os trabalhos de evangelização em nossa comunidade.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
            <div className="p-5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-3">
              <div>
                <span className="text-xs text-[var(--dash-text-secondary)] block">Chave PIX Oficial (E-mail):</span>
                <span className="text-base font-mono font-bold select-all text-[var(--primary)]">{parish.pix_key}</span>
              </div>
              <div className="text-xs text-[var(--dash-text-secondary)] pt-2 border-t border-[var(--dash-border)]">
                <p><strong>Favorecido:</strong> {parish.name}</p>
                <p><strong>Instituição:</strong> {parish.pix_bank}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[var(--dash-text-secondary)]">
              <p className="font-semibold text-[var(--dash-text-primary)]">Como realizar sua contribuição:</p>
              <ol className="list-decimal list-inside space-y-1.5">
                <li>Abra o aplicativo do seu banco de preferência.</li>
                <li>Escolha a opção de pagamento via <strong>PIX</strong>.</li>
                <li>Copie e cole a chave paroquial acima.</li>
                <li>Se desejar marcar como Dízimo ou Intenção, adicione na descrição do PIX.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Seção 3: Avisos e Notícias da Paróquia */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-lg sm:text-xl font-bold">Mural e Avisos Pastorais</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentAnnouncements.map((news) => (
              <div
                key={news.id}
                className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm hover:border-[var(--primary)]/50 transition-colors flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)]">
                    {news.category}
                  </span>
                  <h4 className="text-base font-bold mt-2 leading-snug">{news.title}</h4>
                </div>
                <div className="text-xs text-[var(--dash-text-secondary)] flex items-center justify-between pt-2 border-t border-[var(--dash-border)]">
                  <span>{news.date}</span>
                  <span className="text-[var(--primary)] font-semibold flex items-center gap-1">
                    Ler aviso <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Localização e Atendimento */}
        <section className="p-6 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--primary)]" />
              Secretaria Paroquial e Endereço
            </h4>
            <p className="text-xs text-[var(--dash-text-secondary)]">{parish.address}</p>
            <p className="text-xs text-[var(--dash-text-secondary)]">Atendimento de Segunda a Sexta: 08:00 às 17:00</p>
          </div>

          <a
            href={`https://wa.me/${parish.whatsapp}?text=Olá,%20gostaria%20de%20informações.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold hover:opacity-95 transition-all shadow-sm shrink-0"
          >
            <span>Secretaria Online</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>
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
