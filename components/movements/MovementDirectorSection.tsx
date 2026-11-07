'use client';

import React from 'react';
import { UserCheck, Users, MessageCircle, MapPin, Mail, ShieldCheck } from 'lucide-react';
import { ParishMovement } from '@/types/movements';

interface MovementDirectorSectionProps {
  movement: ParishMovement;
}

export function MovementDirectorSection({ movement }: MovementDirectorSectionProps) {
  const whatsappUrl = movement.contact_whatsapp
    ? `https://wa.me/${movement.contact_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Olá! Desejo falar com a coordenação do ${movement.name} (${movement.acronym}) da Catedral de Colatina.`
      )}`
    : null;

  return (
    <section className="py-10 border-b border-[#C8A463]/15 bg-[#121417]/50">
      <div className="container mx-auto px-4 max-w-5xl space-y-6">
        {/* Section Heading */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFCC36]">
            <UserCheck className="w-4 h-4" />
            Assistência Pastoral & Coordenação
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6F0]">
            Diretoria Espiritual e Equipe Dirigente
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Spiritual Director Card */}
          <div className="rounded-2xl bg-[#1B1E22] border border-[#C8A463]/25 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#8B1E22]/30 border border-[#8B1E22]/50 flex items-center justify-center text-[#FFCC36] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] block">
                  {movement.spiritual_director_role || 'Diretor Espiritual'}
                </span>
                <h3 className="text-base font-serif font-bold text-[#FAF6F0]">
                  {movement.spiritual_director_name || 'Pe. Irineu Valdereis de Castro'}
                </h3>
                <span className="text-xs text-[#FAF6F0]/60">Catedral de Colatina</span>
              </div>
            </div>

            <p className="text-xs text-[#FAF6F0]/80 leading-relaxed pt-2 border-t border-[#C8A463]/15">
              Acompanhamento espiritual contínuo garantindo a fidelidade litúrgica, sacramental e
              pastoral às diretrizes da Santa Igreja e da Diocese de Colatina.
            </p>
          </div>

          {/* Coordinating Team Card */}
          <div className="rounded-2xl bg-[#1B1E22] border border-[#C8A463]/25 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#C8A463]/20 border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] block">
                  Equipe Dirigente Atual
                </span>
                <h3 className="text-base font-serif font-bold text-[#FAF6F0]">
                  {movement.coordinating_team || 'Coordenação Geral da Catedral'}
                </h3>
                <span className="text-xs text-[#FAF6F0]/60">Mandato Paroquial Ativo</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#C8A463]/15 flex flex-wrap items-center gap-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors min-h-[36px]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Coordenação
                </a>
              )}
              {movement.contact_email && (
                <a
                  href={`mailto:${movement.contact_email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--dash-surface)]/5 hover:bg-[var(--dash-surface)]/10 border border-white/10 text-xs text-[#FAF6F0]/80 transition-colors min-h-[36px]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C8A463]" />
                  {movement.contact_email}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Meeting Center Callout */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#1B1E22] via-[#22262B] to-[#1B1E22] border border-[#C8A463]/20 flex items-center gap-3 text-xs text-[#FAF6F0]/80">
          <MapPin className="w-4 h-4 text-[#FFCC36] shrink-0" />
          <span>
            <strong>Local de Encontros e Reuniões:</strong> Centro Pastoral São João Paulo II • Praça Frei José, Nº 26, Centro — Colatina/ES.
          </span>
        </div>
      </div>
    </section>
  );
}
