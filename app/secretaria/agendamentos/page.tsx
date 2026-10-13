import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { 
  ArrowLeft, 
  Calendar, 
  Heart, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  HelpCircle,
  Phone
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Badge, Card } from '@/components/ui';
import { Clergy, Parish, Community } from '@/types';
import { PastoralAppointmentBooking } from '@/components/secretaria/PastoralAppointmentBooking';

export const metadata = {
  title: 'Agendamento Pastoral On-line | Secretaria Paroquial',
  description: 'Agende seu horário de confissão individual, direção espiritual ou atendimento pastoral com os sacerdotes da paróquia.',
};

export default async function AgendamentosSecretariaPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Buscar Paróquia
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const parish: Parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    slug: 'catedral-colatina',
    city: 'Colatina',
    state: 'ES',
    address: 'Praça Frei José, Nº 26, Centro - Edifício João Paulo II (1º Andar)',
    whatsapp_number: '552721025010',
    pix_key: 'secretaria@catedraldecolatina.org.br',
    pix_key_type: 'email',
    primary_color: '#8B1E22',
    created_at: new Date().toISOString(),
  };

  // 2. Buscar Clero
  const { data: clergyData } = await supabase
    .from('clergy')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  const defaultClergyList: Clergy[] = [
    {
      id: '904c8dbf-16c3-4eae-a6e0-cb04b4411b42',
      parish_id: parish.id,
      name: 'Padre Irineu Claudino Sales',
      role: 'paroco',
      title: 'Pároco e Cura da Catedral',
      office_hours: 'Terça e Quinta-feira: 14:30h às 16:30h',
      order_index: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'c0000000-0000-0000-0000-000000000004',
      parish_id: parish.id,
      name: 'Padre Adilson Ramos de Melo',
      role: 'vigario',
      title: 'Vigário Paroquial',
      office_hours: 'Quarta e Sexta-feira: 14:00h às 16:30h',
      order_index: 2,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'efe3cd65-c7d5-4820-a85d-f34960cac5b0',
      parish_id: parish.id,
      name: 'Padre Deivid José Langa Lopes',
      role: 'vigario',
      title: 'Vigário Paroquial',
      office_hours: 'Conforme agendamento na secretaria',
      order_index: 3,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '0b4e63fc-dfc4-487e-8816-47d4ac35d2c5',
      parish_id: parish.id,
      name: 'Padre Ernandes Samuel Fantin',
      role: 'vigario',
      title: 'Vigário Paroquial',
      office_hours: 'Conforme agendamento na secretaria',
      order_index: 4,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ];

  const clergyList: Clergy[] = clergyData && clergyData.length > 0 ? clergyData : defaultClergyList;

  // 3. Buscar Comunidades (CEBs)
  const { data: communitiesData } = await supabase
    .from('communities')
    .select('*')
    .eq('is_active', true)
    .order('is_headquarters', { ascending: false })
    .order('name');

  const communities: Community[] = communitiesData || [];

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between overflow-x-hidden">
      {/* Topo com Glassmorphism */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/80 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/secretaria" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Secretaria</span>
          </Link>

          <Badge variant="matriz" className="text-xs">
            Atendimento Pastoral
          </Badge>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 w-full">
        {/* Cabeçalho da Página */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Balcão Digital do Fiel</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Agendamento Pastoral On-line
          </h1>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-2xl leading-relaxed">
            Reserve seu momento de confissão individual, direção espiritual ou conversa fraterna com nossos sacerdotes com comodidade e confirmação imediata.
          </p>
        </div>

        {/* Componente Interativo de Agendamento */}
        <PastoralAppointmentBooking
          parish={parish}
          clergyList={clergyList}
          communities={communities}
        />

        {/* Orientações Pastorais e FAQ */}
        <div className="pt-4 space-y-4 border-t border-[var(--dash-border)]">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--dash-text-primary)]">
            <HelpCircle className="w-4 h-4 text-[var(--primary)]" />
            <span>Dúvidas Frequentes & Orientações Pastorais</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <Card className="p-4 space-y-2">
              <h3 className="font-bold text-[var(--dash-text-primary)] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Sigilo Sacramental Absoluto
              </h3>
              <p className="text-[var(--dash-text-secondary)] leading-relaxed">
                O Sacramento da Reconciliação (Confissão) é protegido pelo sigilo sacramental inviolável da Santa Igreja. Nenhum dado de sua confissão fica registrado.
              </p>
            </Card>

            <Card className="p-4 space-y-2">
              <h3 className="font-bold text-[var(--dash-text-primary)] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" /> Pontualidade e Antecedência
              </h3>
              <p className="text-[var(--dash-text-secondary)] leading-relaxed">
                Chegue à secretaria com 10 minutos de antecedência. Em caso de imprevisto ou necessidade de desmarcar, avise pelo WhatsApp para liberar o horário para outro irmão.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Rodapé White-Label */}
      <footer className="mt-12 border-t border-[var(--dash-border)] bg-[var(--dash-surface)] py-6 text-center text-xs text-[var(--dash-text-secondary)]">
        <p className="font-semibold text-[var(--dash-text-primary)]">
          © {new Date().getFullYear()} {parish.name}
        </p>
        <p className="mt-0.5">Todos os direitos reservados. {parish.diocese}.</p>
      </footer>
    </div>
  );
}
