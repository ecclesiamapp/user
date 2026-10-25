import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowLeft, Sparkles, Heart, Church, Flame } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Badge, Card } from '@/components/ui';
import { Parish, Community } from '@/types';
import { MassIntentionBooking } from '@/components/secretaria/intencoes/MassIntentionBooking';

export const metadata = {
  title: 'Intenções de Santa Missa On-line | Secretaria Paroquial',
  description: 'Envie suas intenções para a Santa Missa: Sufrágio dos fiéis falecidos, 7º dia, ação de graças, saúde dos enfermos e bênçãos.',
};

export default async function IntencoesSecretariaPage() {
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

  // 2. Buscar Comunidades
  const { data: commsData } = await supabase
    .from('communities')
    .select('*')
    .eq('is_active', true)
    .order('name');
  const communities: Community[] = commsData || [];

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between">
      {/* Header com Glassmorphism */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/80 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/secretaria"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Secretaria</span>
          </Link>

          <Badge variant="matriz" className="text-xs">
            Secretaria On-line
          </Badge>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full">
        {/* Banner Pastoral */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Oração & Liturgia</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
            Intenções de Santa Missa
          </h1>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-2xl leading-relaxed">
            Ofereça a celebração eucarística pelas almas dos fiéis falecidos, em ação de graças por bênçãos alcançadas ou pela restauração da saúde dos enfermos.
          </p>
        </div>

        {/* Card Teológico Explicativo */}
        <Card className="p-4 sm:p-5 border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-[var(--dash-text-primary)]">
              O Sentido Sagrado da Intenção Eucarística
            </h3>
            <p className="text-[var(--dash-text-secondary)] leading-relaxed">
              O sacrifício eucarístico é a mais perfeita prece da Igreja. Ao registrar sua intenção, os nomes apresentados são proclamados no púlpito antes da celebração da Santa Missa e elevados a Deus nas preces comunitárias.
            </p>
          </div>
        </Card>

        {/* Formulário Interativo */}
        <MassIntentionBooking parish={parish} communities={communities} />
      </main>

      {/* Rodapé White-Label */}
      <footer className="mt-12 border-t border-[var(--dash-border)] bg-[var(--dash-surface)] py-6 text-center text-xs text-[var(--dash-text-secondary)]">
        <p className="font-semibold text-[var(--dash-text-primary)]">© {new Date().getFullYear()} {parish.name}</p>
        <p>Todos os direitos reservados. {parish.diocese}.</p>
      </footer>
    </div>
  );
}
