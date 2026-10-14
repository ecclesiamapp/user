import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, HeartHandshake } from 'lucide-react';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { DizimoHero } from '@/components/dizimo/DizimoHero';
import { DizimoDimensions } from '@/components/dizimo/DizimoDimensions';
import { DizimoPixDynamic } from '@/components/dizimo/DizimoPixDynamic';
import { DizimoRegistrationForm } from '@/components/dizimo/DizimoRegistrationForm';
import { DizimoTransparency } from '@/components/dizimo/DizimoTransparency';
import { DizimoFaq } from '@/components/dizimo/DizimoFaq';
import { Parish, Community, TitheTransparencyItem, TitheFaq } from '@/types';
import { fallbackCommunitiesList } from '@/lib/communities';

export const metadata: Metadata = {
  title: 'Dízimo Pastoral • Sou do Sagrado • Catedral de Colatina',
  description:
    'Participe da Campanha Sou do Sagrado da Catedral do Sagrado Coração de Jesus. Conheça as 4 dimensões do dízimo, torne-se um dizimista e contribua com amor e fidelidade.',
};

export default async function DizimoPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Buscar dados da paróquia e comunidades
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const { data: communitiesData } = await supabase
    .from('communities')
    .select('*')
    .eq('is_active', true)
    .order('is_headquarters', { ascending: false })
    .order('name');

  // 2. Buscar itens de transparência ativos gerenciados pela secretaria
  let transparencyItems: TitheTransparencyItem[] = [];
  try {
    const { data } = await supabase
      .from('tithe_transparency_items')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (data && data.length > 0) {
      transparencyItems = data as TitheTransparencyItem[];
    }
  } catch (err) {
    console.warn('Alerta busca pública tithe_transparency_items:', err);
  }

  // 3. Buscar FAQs ativos gerenciados pela secretaria
  let faqs: TitheFaq[] = [];
  try {
    const { data } = await supabase
      .from('tithe_faqs')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (data && data.length > 0) {
      faqs = data as TitheFaq[];
    }
  } catch (err) {
    console.warn('Alerta busca pública tithe_faqs:', err);
  }

  const parish: Parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    slug: 'catedral-colatina',
    city: 'Colatina',
    state: 'ES',
    address: 'Praça da Catedral, s/n - Centro, Colatina/ES',
    whatsapp_number: '552737221234',
    pix_key: 'secretaria@catedraldecolatina.org.br',
    pix_key_type: 'email',
    primary_color: '#8B1E22',
    created_at: new Date().toISOString(),
  };

  const communities: Community[] =
    communitiesData && communitiesData.length > 0
      ? (communitiesData as Community[])
      : fallbackCommunitiesList;

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between">
      {/* 1. Marquee Litúrgico Fino no Topo */}
      <MarqueeAvisos />

      {/* 2. Top Header Limpo */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/90 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors py-2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A]" />
            <span>Voltar ao Portal</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8B1E22] dark:text-[#FFA82A] uppercase tracking-wider bg-[#8B1E22]/10 px-3 py-1 rounded-full border border-[#8B1E22]/20">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Sou do Sagrado</span>
          </span>
        </div>
      </header>

      {/* 3. Conteúdo Principal */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full font-sans flex-1 space-y-12 sm:space-y-16">
        {/* Bloco 1: Hero Monumental */}
        <DizimoHero parishName={parish.name} dioceseName={parish.diocese} />

        {/* Bloco 2: As Quatro Dimensões do Dízimo (CNBB) */}
        <DizimoDimensions />

        {/* Bloco 3: Onde seu Dízimo Atua na Catedral (Transparência & Obras) */}
        <DizimoTransparency items={transparencyItems} />

        {/* Bloco 4: Cadastro de Novo Dizimista (Sou do Sagrado) */}
        <DizimoRegistrationForm parish={parish} communities={communities} />

        {/* Bloco 5: Perguntas Frequentes sobre o Dízimo (FAQ) */}
        <DizimoFaq faqs={faqs} />

        {/* Bloco 6: Doações & Ofertas via PIX (Seletor Dinâmico) */}
        <DizimoPixDynamic parish={parish} />
      </main>

      {/* 4. Rodapé Institucional */}
      <footer className="mt-16 bg-[#16181B] text-[#D2CBC1] border-t border-[#C8A463]/30 py-10 px-4 sm:px-6">
        <div className="max-w-[1240px] mx-auto text-center space-y-3">
          <p className="font-cinzel text-sm sm:text-base font-bold text-white uppercase tracking-wider">
            Catedral do Sagrado Coração de Jesus • Diocese de Colatina
          </p>
          <p className="text-xs text-[#7E838B]">
            Praça Frei José, Nº 26 — Centro, Colatina - ES • Telefone: (27) 2102-5010
          </p>
          <p className="text-[11px] text-[#7E838B]/80 font-serif italic">
            "Deus ama quem dá com alegria. Agradecemos a fidelidade de cada dizimista!"
          </p>
        </div>
      </footer>
    </div>
  );
}
