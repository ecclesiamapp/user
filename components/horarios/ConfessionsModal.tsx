'use client';

import React from 'react';
import Link from 'next/link';
import { 
  X, 
  HeartHandshake, 
  Sparkles, 
  Clock, 
  MapPin, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';

interface ConfessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
}

export function ConfessionsModal({ isOpen, onClose }: ConfessionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-[var(--dash-surface)] rounded-2xl border border-[#C8A463]/50 shadow-2xl overflow-hidden animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabeçalho do Modal */}
        <div className="relative bg-gradient-to-r from-[#8B1E22] via-[#6E161A] to-[#8B1E22] p-6 text-white text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/80 hover:text-white hover:bg-[var(--dash-surface)]/10 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--dash-surface)]/10 border border-[#FFCC36]/40 flex items-center justify-center mb-3">
            <HeartHandshake className="w-6 h-6 text-[#FFCC36]" />
          </div>

          <Badge variant="matriz" className="text-[11px] font-bold uppercase tracking-wider mb-2">
            Sacramento do Perdão & Adoração
          </Badge>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wide">
            Confissões na Catedral
          </h2>
          <p className="text-xs sm:text-sm text-[#F5EFE7]/90 max-w-md mx-auto mt-1 font-serif italic">
            "A misericórdia de Deus é um oceano infinito que acolhe quem se aproxima de coração contrito."
          </p>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Card 1: Horários Regulares */}
          <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8B1E22] shrink-0" />
              <h3 className="font-bold text-sm text-[var(--dash-text-primary)]">
                Horários Fixos no Confessionário da Matriz
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-[var(--dash-surface)] border border-[var(--dash-border)]/80">
                <span className="font-bold text-[#8B1E22] block mb-0.5">Terças-feiras</span>
                <span className="text-[var(--dash-text-primary)] font-semibold text-sm">16h00 às 18h00</span>
                <span className="text-[var(--dash-text-secondary)] block text-[11px] mt-0.5">Ordem de chegada na Secretaria</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--dash-surface)] border border-[var(--dash-border)]/80">
                <span className="font-bold text-[#8B1E22] block mb-0.5">Quintas-feiras</span>
                <span className="text-[var(--dash-text-primary)] font-semibold text-sm">16h00 às 18h00</span>
                <span className="text-[var(--dash-text-secondary)] block text-[11px] mt-0.5">Ordem de chegada na Secretaria</span>
              </div>
            </div>
          </div>

          {/* Card 2: Adoração ao Santíssimo */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <h3 className="font-bold text-sm text-amber-700 dark:text-amber-300">
                Adoração ao Santíssimo Sacramento
              </h3>
            </div>
            <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
              Todas as <strong>Quintas-feiras</strong>, o Santíssimo Sacramento fica exposto na Capela do Santíssimo da Catedral das <strong>08h00 às 19h00</strong> ininterruptamente para oração silenciosa, culminando na Santa Missa e Bênção Eucarística.
            </p>
          </div>

          {/* Card 3: Agendamento Pastoral Online */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h3 className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                Prefere Agendar um Horário Exclusivo?
              </h3>
            </div>
            <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
              Caso necessite de Direção Espiritual aprofundada ou atendimento pastoral reservado, você pode agendar previamente seu horário com um dos sacerdotes da paróquia.
            </p>
            <Link
              href="/secretaria/agendamentos"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md min-h-[44px]"
            >
              <span>Agendar com Padre pelo Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Rodapé com botão de fechar */}
        <div className="p-4 bg-[var(--dash-surface-secondary)] border-t border-[var(--dash-border)] flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="min-h-[44px] px-6 text-xs font-semibold"
          >
            Fechar Janela
          </Button>
        </div>
      </div>
    </div>
  );
}
