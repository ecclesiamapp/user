import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { 
  Church, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  User, 
  Heart, 
  ArrowLeft,
  History,
  Sparkles
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Card, Badge, Button } from '@/components/ui';
import { Clergy, Parish } from '@/types';

export default async function SecretariaInstitucionalPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Buscar dados da Paróquia e Clero
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const { data: clergyData } = await supabase
    .from('clergy')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  const parish: Parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    slug: 'catedral-colatina',
    city: 'Colatina',
    state: 'ES',
    address: 'Praça Frei José, Nº 26, Centro - Edifício João Paulo II (1º Andar)',
    whatsapp_number: '5527999990000',
    pix_key: 'secretaria@catedraldecolatina.org.br',
    pix_key_type: 'email',
    primary_color: '#1e3a8a',
    created_at: new Date().toISOString(),
  };

  const clergyList: Clergy[] = clergyData || [];

  const contactsSectorized = [
    { label: 'Secretaria Paroquial', phone: '(27) 2102-5010', email: 'secretaria@catedraldecolatina.org.br', desc: 'Certidões, intenções de missa e informações gerais' },
    { label: 'Administrativo & Financeiro', phone: '(27) 2102-5009', email: 'pscj-secretaria@catedraldecolatina.org.br', desc: 'Dízimo, doações e fornecedores paroquiais' },
    { label: 'Setor Pastoral', phone: '(27) 2102-5012', email: 'pastoral@catedraldecolatina.org.br', desc: 'Coordenação das pastorais, movimentos e catequese' },
    { label: 'Pastoral da Escuta', phone: '(27) 2102-5010', email: null, desc: 'Atendimento fraterno: Segunda a Quinta-feira a partir das 19h' },
  ];

  const historicalMilestones = [
    { year: '1927', title: 'Fundação da Paróquia', desc: 'Em 24 de dezembro de 1927 é criada a Paróquia do Sagrado Coração de Jesus sob bênção episcopal.' },
    { year: '1956', title: 'Expansão Comunitária', desc: 'Início da criação das primeiras CEBs nos bairros urbanos de Colatina.' },
    { year: '1990', title: 'Criação da Diocese de Colatina', desc: 'A Matriz é solenemente elevada à dignidade de Catedral Diocesana.' },
    { year: '2026', title: 'Acolhimento Digital Ecclesiam', desc: 'Modernização digital de atendimento pastoral, folhetos litúrgicos e transparência.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between">
      {/* Header com Glassmorphism */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/80 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portal</span>
          </Link>

          <div className="flex items-center gap-2">
            <Badge variant="matriz">Catedral Diocesana</Badge>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 w-full">
        {/* Banner Institucional */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Acolhimento e Governo Pastoral
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Secretaria Paroquial & Clero
          </h1>
          <p className="text-sm sm:text-base text-[var(--dash-text-secondary)] max-w-2xl leading-relaxed">
            Conheça os sacerdotes responsáveis pelo pastoreio da Catedral, nossos expedientes de atendimento e a história de nossa paróquia.
          </p>
        </div>

        {/* Seção 1: O Clero (Pároco e Vigários) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-xl font-bold">Nossos Sacerdotes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {clergyList.map((priest) => (
              <Card key={priest.id} className="flex flex-col justify-between space-y-4 hover:border-[var(--primary)]/50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={priest.role === 'paroco' ? 'matriz' : 'ceb'}>
                      {priest.role === 'paroco' ? 'Pároco e Cura' : 'Vigário Paroquial'}
                    </Badge>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>

                  <div>
                    <h3 className="font-bold text-base leading-snug">{priest.name}</h3>
                    <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">{priest.title}</p>
                  </div>

                  <div className="pt-2 border-t border-[var(--dash-border)] space-y-1.5 text-xs text-[var(--dash-text-secondary)]">
                    {priest.birthday && (
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                        <span>Aniversário: <strong>{priest.birthday}</strong></span>
                      </p>
                    )}
                    {priest.ordination_date && (
                      <p className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Ordenação: <strong>{priest.ordination_date}</strong></span>
                      </p>
                    )}
                  </div>
                </div>

                {priest.office_hours && (
                  <div className="p-2.5 rounded-xl bg-[var(--dash-surface-secondary)] text-xs border border-[var(--dash-border)]">
                    <p className="font-semibold text-[var(--dash-text-primary)]">Atendimento Pastoral:</p>
                    <p className="text-[var(--dash-text-secondary)] mt-0.5">{priest.office_hours}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Seção 2: Expediente e Canais de Atendimento Setorizados */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-xl font-bold">Expediente da Secretaria</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Horários de Funcionamento */}
            <Card className="space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--primary)]" />
                Localização & Funcionamento
              </h3>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Praça Frei José, Nº 26, Centro - Colatina/ES<br />
                Edifício João Paulo II - 1º Andar (CEP: 29700-200)
              </p>

              <div className="pt-2 border-t border-[var(--dash-border)] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold">Segunda a Sexta-feira:</span>
                  <span className="text-[var(--dash-text-secondary)]">08:00h às 18:00h</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Sábados:</span>
                  <span className="text-[var(--dash-text-secondary)]">08:00h às 12:00h</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Atendimento dos Padres:</span>
                  <span className="text-[var(--primary)] font-semibold">Terça e Quinta (14:30h às 16:30h)</span>
                </div>
              </div>
            </Card>

            {/* Ramais e Telefones Setorizados */}
            <Card className="space-y-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--primary)]" />
                Contatos & Ramais Setorizados
              </h3>

              <div className="space-y-2.5">
                {contactsSectorized.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-xs flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[var(--dash-text-primary)] block">{item.label}</span>
                      <span className="text-[var(--dash-text-secondary)] text-[11px]">{item.desc}</span>
                    </div>
                    <a href={`tel:${item.phone.replace(/\D/g, '')}`} className="shrink-0 font-bold text-[var(--primary)] hover:underline">
                      {item.phone}
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Seção 3: Linha do Tempo e Arquivo Histórico */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-xl font-bold">Arquivo Histórico & Memória</h2>
          </div>

          <Card className="p-6">
            <div className="relative border-l-2 border-[var(--primary)]/30 ml-3 space-y-6 py-2">
              {historicalMilestones.map((mile, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-[var(--dash-surface)]" />
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-black bg-[var(--primary)]/10 text-[var(--primary)]">
                    {mile.year}
                  </span>
                  <h4 className="font-bold text-sm mt-1">{mile.title}</h4>
                  <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5 leading-relaxed">{mile.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>

      {/* Rodapé White-Label */}
      <footer className="mt-12 border-t border-[var(--dash-border)] bg-[var(--dash-surface)] py-6 text-center text-xs text-[var(--dash-text-secondary)]">
        <p className="font-semibold text-[var(--dash-text-primary)]">© {new Date().getFullYear()} {parish.name}</p>
        <p>Todos os direitos reservados. {parish.diocese}.</p>
      </footer>
    </div>
  );
}
