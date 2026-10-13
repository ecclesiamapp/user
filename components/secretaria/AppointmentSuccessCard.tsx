'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Share2, 
  RotateCcw,
  MessageCircle
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

interface AppointmentSuccessCardProps {
  protocol: string;
  appointmentTypeLabel: string;
  priestName: string;
  formattedDate: string;
  time: string;
  parishionerName: string;
  parishionerPhone: string;
  communityName?: string;
  whatsappSecretaryNumber: string;
  parishAddress: string;
  onNewBooking: () => void;
}

export function AppointmentSuccessCard({
  protocol,
  appointmentTypeLabel,
  priestName,
  formattedDate,
  time,
  parishionerName,
  parishionerPhone,
  communityName,
  whatsappSecretaryNumber,
  parishAddress,
  onNewBooking,
}: AppointmentSuccessCardProps) {
  const cleanPhone = whatsappSecretaryNumber.replace(/\D/g, '') || '552721025010';
  
  const whatsappMessage = encodeURIComponent(
    `Paz e Bem! Acabei de solicitar um agendamento pastoral pelo portal da paróquia.\n\n` +
    `📋 *Protocolo:* ${protocol}\n` +
    `👤 *Fiel:* ${parishionerName}\n` +
    `✝️ *Atendimento:* ${appointmentTypeLabel}\n` +
    `🙏 *Sacerdote:* ${priestName}\n` +
    `📅 *Data e Hora:* ${formattedDate} às ${time}\n` +
    (communityName ? `⛪ *Comunidade:* ${communityName}\n` : '') +
    `\nGostaria de confirmar o agendamento. Muito obrigado(a)!`
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <Card className="p-5 sm:p-7 border-emerald-500/30 bg-[var(--dash-surface)] space-y-6 animate-fade-in shadow-xl">
      {/* Topo com Ícone e Protocolo */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <Badge variant="matriz" className="text-xs font-bold tracking-wider uppercase">
          Solicitação Registrada
        </Badge>
        <h2 className="font-display text-2xl font-bold text-[var(--dash-text-primary)]">
          Agendamento Confirmado!
        </h2>
        <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-md mx-auto">
          Sua solicitação pastoral foi gravada com sucesso. Apresente o protocolo abaixo na secretaria.
        </p>
      </div>

      {/* Box do Protocolo */}
      <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-center space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
          Número de Protocolo
        </span>
        <div className="font-mono text-xl sm:text-2xl font-black text-[var(--primary)] tracking-wider">
          {protocol}
        </div>
      </div>

      {/* Resumo do Atendimento */}
      <div className="space-y-3 pt-2 text-xs sm:text-sm border-t border-[var(--dash-border)]">
        <div className="flex items-center justify-between py-1.5 border-b border-[var(--dash-border)]/60">
          <span className="text-[var(--dash-text-secondary)] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--primary)]" /> Data Marcada
          </span>
          <span className="font-bold text-[var(--dash-text-primary)]">{formattedDate}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-[var(--dash-border)]/60">
          <span className="text-[var(--dash-text-secondary)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--primary)]" /> Horário
          </span>
          <span className="font-bold text-[var(--dash-text-primary)]">{time}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-[var(--dash-border)]/60">
          <span className="text-[var(--dash-text-secondary)] flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--primary)]" /> Sacerdote
          </span>
          <span className="font-bold text-[var(--dash-text-primary)]">{priestName}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-[var(--dash-border)]/60">
          <span className="text-[var(--dash-text-secondary)]">Modalidade</span>
          <span className="font-semibold text-[var(--dash-text-primary)]">{appointmentTypeLabel}</span>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <span className="text-[var(--dash-text-secondary)]">Fiel Solicitante</span>
          <span className="font-semibold text-[var(--dash-text-primary)]">{parishionerName}</span>
        </div>
      </div>

      {/* Localização & Orientações */}
      <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1.5">
        <p className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0" /> Local do Atendimento:
        </p>
        <p className="text-[var(--dash-text-secondary)] leading-relaxed">
          {parishAddress} (Favor comparecer com 10 minutos de antecedência).
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="space-y-3 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm min-h-[48px] shadow-md transition-all active:scale-[0.99]"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Confirmar pelo WhatsApp da Secretaria</span>
        </a>

        <Button
          variant="outline"
          className="w-full min-h-[44px] text-xs font-semibold"
          onClick={onNewBooking}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-2" />
          Realizar Novo Agendamento
        </Button>
      </div>
    </Card>
  );
}
