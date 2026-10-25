import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  CalendarDays, 
  ChevronRight, 
  ArrowRight,
  Church
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { ParishSpecialEvent } from '@/types';
import { FALLBACK_SPECIAL_EVENTS, formatEventDateRange } from '@/lib/events';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { CathedralHeader } from '@/components/layout/CathedralHeader';
import { CathedralFooter } from '@/components/home/CathedralFooter';

export const metadata: Metadata = {
  title: 'Grandes Festas & Solenidades • Catedral de Colatina',
  description: 'Confira as datas, horários e programações especiais da Festa da Co-Padroeira, Tríduo Pascal e festas das 12 comunidades.',
};

export default async function ProgramacoesIndexPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Buscar paróquia
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    address: 'Praça Frei José, Centro - Colatina/ES',
    whatsapp_number: '(27) 3722-1234',
  };

  // 2. Buscar eventos
  let events: ParishSpecialEvent[] = [];
  try {
    const { data, error } = await supabase
      .from('parish_special_events')
      .select('*')
      .eq('parish_id', parish.id)
      .neq('status', 'rascunho')
      .order('start_date', { ascending: false });

    if (!error && data && data.length > 0) {
      events = data as ParishSpecialEvent[];
    }
  } catch (err) {
    console.warn('Usando fallback para lista de eventos:', err);
  }

  if (events.length === 0) {
    events = FALLBACK_SPECIAL_EVENTS;
  }

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between overflow-x-hidden selection:bg-[#FFA82A] selection:text-[#2D1A16]">
      <MarqueeAvisos />

      <CathedralHeader
        parishName={parish.name}
        dioceseName={parish.diocese}
        whatsappNumber={parish.whatsapp_number}
      />

      <main className="flex-1 w-full pb-16">
        {/* Hero do Diretório de Festas */}
        <section className="relative w-full bg-gradient-to-b from-[#131418] via-[#181B20] to-[#121417] text-[#EAE3D9] pt-8 pb-12 sm:pb-16 border-b border-[#C8A463]/30">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#A39E98]">
              <Link href="/" className="hover:text-[#FFCC36] transition-colors flex items-center gap-1">
                <Church className="w-3.5 h-3.5 text-[#C8A463]" />
                <span>Início</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#5C616C]" />
              <span className="text-white font-bold">Festas & Solenidades</span>
            </nav>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E22] text-[#FFCC36] text-[11px] font-bold uppercase tracking-wider border border-[#FFA82A]/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Calendário Festivo Paroquial</span>
              </div>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white">
                Grandes Festas, Solenidades & Tríduos
              </h1>
              <p className="text-xs sm:text-sm text-[#B8B2A9] max-w-2xl leading-relaxed">
                Celebre conosco as grandes solenidades da Igreja-Mãe, os tríduos devocionais e as festividades dos padroeiros das 12 Comunidades Eclesiais de Base.
              </p>
            </div>
          </div>
        </section>

        {/* Lista de Festas */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => {
              const formattedDates = formatEventDateRange(ev.start_date, ev.end_date);

              return (
                <div
                  key={ev.id}
                  className="group rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[#FFA82A]/50 transition-all shadow-md hover:shadow-xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                    {ev.banner_url ? (
                      <img
                        src={ev.banner_url}
                        alt={ev.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#1E2127] to-[#121417]">
                        <Sparkles className="w-8 h-8 text-[#FFCC36] mb-2" />
                        <span className="text-xs text-[#A39E98] font-bold">Catedral de Colatina</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-amber-200 font-semibold drop-shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-[#FFCC36]" />
                        <span>{formattedDates}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-xs text-[var(--dash-text-muted)]">
                        <MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                        <span className="truncate">{ev.community_name || 'Catedral Sagrado Coração de Jesus'}</span>
                      </div>

                      <h2 className="font-bold text-base sm:text-lg text-[var(--dash-text-primary)] group-hover:text-[#FFA82A] transition-colors leading-tight">
                        {ev.title}
                      </h2>

                      {ev.theme && (
                        <p className="text-xs text-[var(--dash-text-secondary)] italic line-clamp-2">
                          &ldquo;{ev.theme}&rdquo;
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/programacao/${ev.slug}`}
                      className="w-full py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <span>Ver Programação Completa</span>
                      <ArrowRight className="w-4 h-4 text-amber-200" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <CathedralFooter
        parishName={parish.name}
        dioceseName={parish.diocese}
        address={parish.address}
        whatsappNumber={parish.whatsapp_number}
      />
    </div>
  );
}
