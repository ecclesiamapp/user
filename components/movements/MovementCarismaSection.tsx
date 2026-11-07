'use client';

import React from 'react';
import { BookOpen, Users, Clock, HeartHandshake, Shield } from 'lucide-react';
import { ParishMovement } from '@/types/movements';

interface MovementCarismaSectionProps {
  movement: ParishMovement;
}

export function MovementCarismaSection({ movement }: MovementCarismaSectionProps) {
  return (
    <section className="py-10 border-b border-[#C8A463]/15">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        {/* Section Heading */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFCC36]">
            <BookOpen className="w-4 h-4" />
            Carisma & Espiritualidade
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6F0]">
            Missão e Vivência na Catedral de Colatina
          </h2>
        </div>

        {/* Description & Meeting info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4 text-sm sm:text-base text-[#FAF6F0]/85 font-sans leading-relaxed">
            {movement.description ? (
              <p>{movement.description}</p>
            ) : (
              <p>
                O {movement.name} é parte viva e atuante do apostolado leigo na Catedral de
                Colatina, promovendo a santificação pessoal, comunitária e familiar em sintonia com
                o magistério da Santa Igreja Católica.
              </p>
            )}

            <div className="p-4 rounded-2xl bg-[#1B1E22] border border-[#C8A463]/20 flex items-start gap-3 mt-4">
              <Clock className="w-5 h-5 text-[#FFCC36] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFCC36]">
                  Encontros & Periodicidade
                </h4>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/80 mt-1">
                  {movement.meeting_schedule ||
                    'Reuniões periódicas no Centro Pastoral São João Paulo II.'}
                </p>
              </div>
            </div>
          </div>

          {/* Pillars Bento Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#1E2228] to-[#16181B] border border-[#C8A463]/25 p-5 space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#FFCC36] uppercase tracking-wider border-b border-[#C8A463]/20 pb-2">
              Pilares Fundamentais
            </h3>

            <div className="space-y-3 text-xs text-[#FAF6F0]/85">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#C8A463]/20 text-[#FFCC36] flex items-center justify-center shrink-0 font-bold">
                  1
                </span>
                <div>
                  <strong className="block text-[#FAF6F0]">Vida de Oração</strong>
                  <span>Encontro íntimo com Cristo e frequência aos Sacramentos.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#C8A463]/20 text-[#FFCC36] flex items-center justify-center shrink-0 font-bold">
                  2
                </span>
                <div>
                  <strong className="block text-[#FAF6F0]">Fraternidade Comunitária</strong>
                  <span>Acolhimento sincero e suporte mútuo na caminhada de fé.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#C8A463]/20 text-[#FFCC36] flex items-center justify-center shrink-0 font-bold">
                  3
                </span>
                <div>
                  <strong className="block text-[#FAF6F0]">Serviço & Caridade</strong>
                  <span>Apostolado ativo nas 14 CEBs e pastorais da Catedral.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

