import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowLeft, Church, Heart, Calendar, Sparkles } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { CathedralFooter } from '@/components/home/CathedralFooter';
import { ApostolicSuccessionTimeline } from '@/components/historia/ApostolicSuccessionTimeline';
import { BishopsAndPastorsGallery } from '@/components/historia/BishopsAndPastorsGallery';
import { HistoryHeritageGallery } from '@/components/historia/HistoryHeritageGallery';
import { 
  HistoricalMilestone, 
  BishopSuccession, 
  PastorSuccession, 
  SacredHeritageItem 
} from '@/lib/history';
import { 
  Parish, 
  ParishHistoryMilestone, 
  ParishPastorSuccession, 
  ParishSacredHeritage 
} from '@/types';

export const metadata: Metadata = {
  title: 'Nossa História & Fé • Catedral do Sagrado Coração de Jesus • Colatina/ES',
  description:
    'Conheça a história quase centenária da Catedral de Colatina, os marcos da sua construção, seus vitrais sagrados e a linha da Sucessão Apostólica e Párocos.',
};

export default async function CathedralHistoryPage() {
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
    address: 'Praça da Catedral, s/n - Centro, Colatina/ES',
    whatsapp_number: '552737221234',
    pix_key: 'secretaria@catedraldecolatina.org.br',
    pix_key_type: 'email',
    primary_color: '#8B1E22',
    created_at: new Date().toISOString(),
  };

  // 2. Buscar Marcos Históricos Ativos
  let initialMilestones: HistoricalMilestone[] | undefined = undefined;
  try {
    const { data: dbMilestones } = await supabase
      .from('parish_history_milestones')
      .select('*')
      .eq('parish_id', parish.id)
      .eq('is_active', true)
      .order('year_order', { ascending: true });

    if (dbMilestones && dbMilestones.length > 0) {
      initialMilestones = (dbMilestones as ParishHistoryMilestone[]).map((m) => ({
        id: m.id,
        year: m.year,
        era: m.era,
        title: m.title,
        subtitle: m.subtitle || '',
        description: m.description,
        iconName: (m.icon_name || 'church') as any,
        highlight: m.highlight || undefined,
        imageUrl: m.image_url || undefined,
        imageCaption: m.image_caption || undefined,
      }));
    }
  } catch (err) {
    console.warn('Fallback ativado para linha do tempo:', err);
  }

  // 3. Buscar Sucessão Pastoral Ativa
  let initialBishops: BishopSuccession[] | undefined = undefined;
  let initialPastors: PastorSuccession[] | undefined = undefined;
  try {
    const { data: dbPastors } = await supabase
      .from('parish_pastors_succession')
      .select('*')
      .eq('parish_id', parish.id)
      .eq('is_active', true)
      .order('order_number', { ascending: true });

    if (dbPastors && dbPastors.length > 0) {
      const typedPastors = dbPastors as ParishPastorSuccession[];
      
      const bishopsFromDb = typedPastors.filter((p) => p.category === 'bishop');
      if (bishopsFromDb.length > 0) {
        initialBishops = bishopsFromDb.map((b) => ({
          id: b.id,
          orderNumber: b.order_number,
          orderLabel: b.order_label || 'Bispo Diocesano',
          name: b.name,
          title: b.title || 'Bispo Diocesano',
          period: b.period,
          motto: b.motto || '',
          mottoTranslation: b.motto_translation || '',
          summary: b.summary,
          achievements: Array.isArray(b.achievements) ? b.achievements : [],
          isCurrent: b.is_current,
        }));
      }

      const pastorsFromDb = typedPastors.filter((p) => p.category === 'pastor');
      if (pastorsFromDb.length > 0) {
        initialPastors = pastorsFromDb.map((p) => ({
          id: p.id,
          name: p.name,
          role: p.order_label || p.title || 'Pároco',
          period: p.period,
          description: p.summary,
          isCurrent: p.is_current,
        }));
      }
    }
  } catch (err) {
    console.warn('Fallback ativado para galeria de pastores:', err);
  }

  // 4. Buscar Patrimônio Sacro Ativo
  let initialHeritage: SacredHeritageItem[] | undefined = undefined;
  try {
    const { data: dbHeritage } = await supabase
      .from('parish_sacred_heritage')
      .select('*')
      .eq('parish_id', parish.id)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (dbHeritage && dbHeritage.length > 0) {
      initialHeritage = (dbHeritage as ParishSacredHeritage[]).map((h) => ({
        id: h.id,
        title: h.title,
        category: h.category,
        description: h.description,
        theologicalMeaning: h.theological_meaning,
        icon: (h.icon || 'sparkles') as any,
        imageUrl: h.image_url || undefined,
        imageCaption: h.image_caption || undefined,
      }));
    }
  } catch (err) {
    console.warn('Fallback ativado para patrimônio sacro:', err);
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
            <span className="hidden sm:inline">Igreja-Mãe da Diocese de Colatina</span>
          </div>
        </div>
      </header>

      {/* 3. Hero Monumental de História & Identidade com Fundo Fotográfico Real */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C1614] via-[#2A1D1A] to-[#1C1614] text-white py-16 sm:py-24 border-b border-[#C8A463]/30">
        {/* Fotografia Real da Catedral em Marca d'Água Nobre */}
        <img
          src="/images/historia/catedral-interior.jpg"
          alt="Interior da Catedral de Colatina"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1614]/85 via-[#2A1D1A]/90 to-[#1C1614] pointer-events-none" />

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Brasão Nobre */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B1E22] via-[#5E1417] to-[#2D1A16] border-2 border-[#FFA82A] text-[#FFCC36] shadow-xl shadow-black/40">
            <Church className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B1E22]/40 border border-[#C8A463]/40 text-[#FFCC36] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Memória & Tradição Eclesial</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight uppercase text-white leading-tight">
              Nossa História & <span className="text-[#FFA82A]">Fé</span>
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#EAE3D9] max-w-2xl mx-auto leading-relaxed">
              Quase um século de evangelização, comunhão e caridade. Da primeira capela missionária erguida às margens do Rio Doce à imponência solene da Catedral Diocesana.
            </p>
          </div>

          {/* Badges de Fatos Históricos */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="px-4 py-2 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs sm:text-sm font-semibold text-[#FFA82A] backdrop-blur-xs">
              🏛️ Paróquia Criada em 1928
            </span>
            <span className="px-4 py-2 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs sm:text-sm font-semibold text-[#FFA82A] backdrop-blur-xs">
              👑 Catedral Diocesana desde 1990
            </span>
            <span className="px-4 py-2 rounded-xl bg-[var(--dash-surface)]/10 border border-white/10 text-xs sm:text-sm font-semibold text-[#FFA82A] backdrop-blur-xs">
              🤝 12 Comunidades Vivas
            </span>
          </div>

          <p className="font-serif italic text-xs sm:text-sm text-[#C8A463]/90 pt-2">
            "Tu és Pedro, e sobre esta pedra edificarei a minha Igreja." (Mt 16, 18)
          </p>
        </div>
      </section>

      {/* 4. Corpo Principal com as Seções Históricas */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16 flex-grow w-full">
        {/* Bloco 1: Linha do Tempo Centenária (1928 - 2026) */}
        <ApostolicSuccessionTimeline initialMilestones={initialMilestones} />

        {/* Bloco 2: Galeria dos Bispos & Párocos da Sucessão Apostólica */}
        <BishopsAndPastorsGallery initialBishops={initialBishops} initialPastors={initialPastors} />

        {/* Bloco 3: Arquitetura & Patrimônio Sacro da Catedral */}
        <HistoryHeritageGallery initialItems={initialHeritage} />

        {/* Bloco 4: Convite Pastoral para Visitação e Celebração */}
        <section className="bg-gradient-to-br from-[#8B1E22] via-[#5E1417] to-[#2D1A16] text-white rounded-2xl p-8 sm:p-10 border border-[#C8A463]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFCC36] flex items-center justify-center md:justify-start gap-1.5">
              <Heart className="w-4 h-4 fill-current" />
              <span>Visite a Nossa Catedral</span>
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wide">
              Venha Rezar no Coração de Colatina
            </h3>
            <p className="text-xs sm:text-sm text-[#EAE3D9] max-w-xl">
              As portas da Catedral do Sagrado Coração de Jesus estão diariamente abertas para você e sua família. Participe das Santas Missas e venha contemplar a beleza da nossa Casa de Oração.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/agenda-liturgica"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FFA82A] to-[#FFCC36] text-[#2D1A16] text-xs sm:text-sm font-extrabold uppercase tracking-wider hover:brightness-105 transition-all shadow-md min-h-[44px]"
            >
              <Calendar className="w-4 h-4 text-[#2D1A16]" />
              <span>Horários de Missa</span>
            </Link>
            <Link
              href="/dizimo"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/20 border border-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all min-h-[44px]"
            >
              <span>Apoiar a Restauração</span>
            </Link>
          </div>
        </section>
      </main>

      {/* 5. Rodapé Nobre da Catedral */}
      <CathedralFooter />
    </div>
  );
}
