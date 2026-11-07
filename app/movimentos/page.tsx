import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Users,
  ChevronRight,
  Sparkles,
  Calendar,
  Heart,
  Shield,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { CathedralHeader } from '@/components/layout/CathedralHeader';
import { CathedralFooter } from '@/components/home/CathedralFooter';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { getParishMovements } from '@/lib/movements';

export const metadata: Metadata = {
  title: 'Movimentos Paroquiais • ECC, EAC e EJC • Catedral de Colatina',
  description:
    'Conheça os movimentos dedicados da Catedral de Colatina: Encontro de Casais com Cristo (ECC), Encontro de Adolescentes com Cristo (EAC) e Encontro de Jovens com Cristo (EJC).',
};

export default async function MovimentosHubPage() {
  const movements = await getParishMovements();

  return (
    <div className="min-h-screen flex flex-col bg-[#0E1012] text-[#FAF6F0]">
      <CathedralHeader />
      <MarqueeAvisos />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-10 pb-14 border-b border-[#C8A463]/20 bg-gradient-to-b from-[#1E2228] via-[#16181B] to-[#0E1012]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-[#8B1E22]/20 via-[#C8A463]/10 to-transparent blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 max-w-5xl relative z-10 space-y-4">
            <nav className="flex items-center gap-1.5 text-xs text-[#FAF6F0]/60 mb-2 font-sans">
              <Link href="/" className="hover:text-[#FFCC36] transition-colors">
                Início
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#C8A463]/50" />
              <span className="text-[#FFCC36] font-semibold">Movimentos Paroquiais</span>
            </nav>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A463]/15 border border-[#C8A463]/40 text-[#FFCC36] text-xs font-bold font-serif uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Apostolado Leigo & Família
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#FAF6F0] tracking-tight">
              Movimentos Paroquiais da Catedral
            </h1>

            <p className="text-sm sm:text-base text-[#FAF6F0]/80 font-sans max-w-3xl leading-relaxed">
              O coração missionário da Paróquia Sagrado Coração de Jesus pulsa forte através dos
              movimentos de evangelização. Seja para casais, jovens ou adolescentes, há um espaço
              fraterno de oração, escuta e encontro pessoal com Cristo à sua espera.
            </p>
          </div>
        </section>

        {/* Directory Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {movements.map((mov) => (
                <div
                  key={mov.id}
                  className="rounded-2xl bg-[#1B1E22] border border-[#C8A463]/25 hover:border-[#C8A463]/50 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Tag & Acronym */}
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-xl bg-[#C8A463]/20 border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] text-xl font-serif font-black group-hover:scale-105 transition-transform">
                        {mov.acronym}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#22262B] text-[#FFCC36] border border-[#C8A463]/20">
                        Catedral
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h2 className="text-lg font-serif font-bold text-[#FAF6F0] group-hover:text-[#FFCC36] transition-colors">
                        {mov.name}
                      </h2>
                      {mov.patron_saint && (
                        <p className="text-xs text-[#C8A463] mt-0.5 font-medium">
                          Patrono: {mov.patron_saint}
                        </p>
                      )}
                    </div>

                    {/* Carisma Preview */}
                    <p className="text-xs text-[#FAF6F0]/75 line-clamp-3 leading-relaxed">
                      {mov.carisma || mov.description}
                    </p>

                    {/* Director info */}
                    {mov.spiritual_director_name && (
                      <div className="pt-3 border-t border-[#C8A463]/15 text-[11px] text-[#FAF6F0]/60">
                        <span className="block font-semibold text-[#FAF6F0]/80">
                          {mov.spiritual_director_role || 'Diretor Espiritual'}:
                        </span>
                        <span>{mov.spiritual_director_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="p-4 bg-[#16181B] border-t border-[#C8A463]/20">
                    <Link
                      href={`/movimentos/${mov.slug}`}
                      className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#22262B] hover:bg-[#C8A463] text-[#FAF6F0] hover:text-[#2D1A16] font-bold text-xs uppercase tracking-wider transition-all min-h-[44px]"
                    >
                      <span>Acessar {mov.acronym}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pastoral Banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#22262B] via-[#1B1E22] to-[#22262B] border border-[#C8A463]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#FFCC36]">
                  Deseja participar ou apoiar os Movimentos?
                </h3>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/75 max-w-xl">
                  Procure a Secretaria Paroquial da Catedral ou converse com as equipes dirigentes
                  após as Santas Missas Dominicais.
                </p>
              </div>

              <Link
                href="/secretaria"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B1E22] via-[#C8A463] to-[#8B1E22] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all min-h-[44px] shrink-0 shadow-md"
              >
                Falar com a Secretaria
              </Link>
            </div>
          </div>
        </section>
      </main>

      <CathedralFooter />
    </div>
  );
}

