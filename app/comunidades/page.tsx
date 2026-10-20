import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  ArrowLeft,
  Church,
  MapPin,
  Sparkles,
  Compass,
  Clock,
  Heart
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { CathedralFooter } from '@/components/home/CathedralFooter';
import { CommunitiesDirectory } from '@/components/comunidades/CommunitiesDirectory';
import { fallbackCommunitiesList } from '@/lib/communities';
import { fallbackSchedules } from '@/lib/schedules';
import { Parish, Community, MassSchedule } from '@/types';

export const metadata: Metadata = {
  title: 'Nossas Comunidades & Capelas • Catedral do Sagrado Coração de Jesus • Colatina/ES',
  description:
    'Conheça as 12 Comunidades Eclesiais de Base (CEBs) e Capelas da Catedral de Colatina. Consulte horários de Santa Missa, padroeiros, endereços e rotas GPS no Google Maps e Waze.',
};

export default async function ComunidadesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Obter dados da Paróquia
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const parish: Parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    slug: 'catedral-colatina',
    city: 'Colatina',
    state: 'ES',
    address: 'Praça Frei José, Nº 26 - Centro, Colatina/ES',
    whatsapp_number: '552737221234',
    pix_key: 'secretaria@catedraldecolatina.org.br',
    pix_key_type: 'email',
    primary_color: '#8B1E22',
    created_at: new Date().toISOString(),
  };

  // 2. Buscar Comunidades ativas do Supabase com fallback seguro
  let communities: Community[] = fallbackCommunitiesList;
  try {
    const { data: dbCommunities } = await supabase
      .from('communities')
      .select('*')
      .eq('is_active', true)
      .order('is_headquarters', { ascending: false })
      .order('name');

    if (dbCommunities && dbCommunities.length > 0) {
      // Mesclar dados do banco com coordenadas geográficas do fallback
      communities = dbCommunities.map((dbComm: Community) => {
        const fallback = fallbackCommunitiesList.find(
          (f) => f.slug === dbComm.slug || f.name.toLowerCase() === dbComm.name.toLowerCase()
        );
        return {
          ...dbComm,
          latitude: dbComm.latitude || fallback?.latitude,
          longitude: dbComm.longitude || fallback?.longitude,
          feast_day: dbComm.feast_day || fallback?.feast_day,
          foundation_year: dbComm.foundation_year || fallback?.foundation_year,
          patron_saint: dbComm.patron_saint || fallback?.patron_saint,
          address: dbComm.address || fallback?.address,
          neighborhood: dbComm.neighborhood || fallback?.neighborhood,
        };
      });
    }
  } catch (err) {
    console.warn('Fallback ativado para comunidades:', err);
  }

  // 3. Buscar horários de celebrações ativas
  let schedules: MassSchedule[] = fallbackSchedules;
  try {
    const { data: dbSchedules } = await supabase
      .from('mass_schedules')
      .select('*')
      .eq('is_active', true)
      .order('time');

    if (dbSchedules && dbSchedules.length > 0) {
      schedules = dbSchedules as MassSchedule[];
    }
  } catch (err) {
    console.warn('Fallback ativado para horários:', err);
  }

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between selection:bg-[#FFA82A] selection:text-[#2D1A16]">
      {/* 1. Marquee Litúrgico Fino no Topo */}
      <MarqueeAvisos />

      {/* 2. Top Bar Translúcido de Navegação */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/90 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors py-2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A]" />
            <span>Voltar ao Portal da Catedral</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-[#C8A463] font-serif font-bold uppercase tracking-wider">
            <span>✝</span>
            <span className="hidden sm:inline">12 Comunidades Eclesiais de Base • CEBs</span>
          </div>
        </div>
      </header>

      {/* 3. Hero Monumental de Comunidades & Capelas (Padrão Catedral Nobre) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C1614] via-[#2A1D1A] to-[#1C1614] text-white py-14 sm:py-20 border-b border-[#C8A463]/30">
        <img
          src="/images/historia/catedral-vitrais.jpg"
          alt="Vitrais da Catedral de Colatina"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-15 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1614]/90 via-[#2A1D1A]/90 to-[#1C1614] pointer-events-none" />

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 text-center space-y-5">
          {/* Ícone Central Dourado em Destaque */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B1E22] via-[#5E1417] to-[#2D1A16] border-2 border-[#FFA82A] text-[#FFCC36] shadow-xl shadow-black/40">
            <Church className="w-7 h-7" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B1E22]/40 border border-[#C8A463]/40 text-[#FFCC36] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rede Paroquial de Fé • 12 Comunidades</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight uppercase text-white leading-tight">
              Nossas Comunidades & <span className="text-[#FFA82A]">Capelas</span>
            </h1>

            <p className="font-sans text-xs sm:text-base text-[#EAE3D9] max-w-2xl mx-auto leading-relaxed">
              Fique por dentro da história, horários de Santa Missa e rotas GPS das 12 Comunidades Eclesiais de Base da Paróquia Sagrado Coração de Jesus.
            </p>
          </div>

          {/* Chips Inferiores Padronizados */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs font-semibold text-[#FFA82A] backdrop-blur-xs">
              ⛪ 12 Capelas & CEBs
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs font-semibold text-[#FFA82A] backdrop-blur-xs">
              🗺️ Rotas Maps & Waze
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs font-semibold text-[#FFA82A] backdrop-blur-xs">
              📍 Diocese de Colatina
            </span>
          </div>
        </div>
      </section>

      {/* 4. Conteúdo Central: Diretório Geral Interativo */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-12 w-full flex-1">
        <CommunitiesDirectory communities={communities} schedules={schedules} />

        {/* 5. Banner de Comunhão Pastoral */}
        <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#8B1E22]/10 via-[var(--dash-surface)] to-[var(--dash-surface)] border border-[var(--dash-border)] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-[#8B1E22] dark:text-[#FFA82A]">
              <Heart className="w-5 h-5" />
              <h3 className="font-cinzel text-lg sm:text-xl font-bold">
                Viva a Fé na Sua Comunidade
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed">
              As Comunidades Eclesiais de Base são espaços fraternos de oração, partilha da Palavra de Deus e missão solidária. Deseja participar das pastorais locais ou do círculo bíblico do seu bairro? Procure o pároco ou a coordenação local nas celebrações.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/secretaria"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#8B1E22] hover:bg-[#721C24] text-white transition-colors shadow-sm min-h-[44px]"
            >
              <span>Secretaria Paroquial</span>
            </Link>
            <Link
              href="/agenda-liturgica"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] hover:text-[#8B1E22] transition-colors min-h-[44px]"
            >
              <span>Agenda de Missas</span>
            </Link>
          </div>
        </section>
      </main>

      {/* 6. Rodapé Oficial */}
      <CathedralFooter
        parishName={parish.name}
        dioceseName={parish.diocese}
        address={parish.address}
        whatsappNumber={parish.whatsapp_number}
      />
    </div>
  );
}
