'use client';

import React from 'react';
import {
  X,
  Church,
  Clock,
  Calendar as CalendarIcon,
  MapPin,
  User,
  Share2,
  ExternalLink,
  Flame,
  HeartHandshake,
  BookOpen,
  Check
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { MassSchedule } from '@/types';

export interface CalendarEventInstance {
  schedule: MassSchedule;
  date: Date;
  dateFormatted: string; // Ex: "Domingo, 19 de Outubro de 2026"
  dateShort: string; // Ex: "19/10/2026"
}

interface CelebrationDetailsModalProps {
  event: CalendarEventInstance | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CelebrationDetailsModal({
  event,
  isOpen,
  onClose,
}: CelebrationDetailsModalProps) {
  if (!isOpen || !event) return null;

  const { schedule, date, dateFormatted } = event;

  // Mapeamento visual por tipo de celebração
  const typeConfig: Record<string, { label: string; icon: React.ElementType; colorClass: string; internalLocation: string }> = {
    missa: {
      label: 'Santa Missa',
      icon: Church,
      colorClass: 'text-[#8B1E22] dark:text-[#FFA82A] bg-[#8B1E22]/10 border-[#8B1E22]/30',
      internalLocation: 'Altar Principal da Catedral',
    },
    celebracao_palavra: {
      label: 'Celebração da Palavra',
      icon: BookOpen,
      colorClass: 'text-sky-700 dark:text-sky-300 bg-sky-500/10 border-sky-500/30',
      internalLocation: 'Nave Central da Catedral',
    },
    confissao: {
      label: 'Sacramento da Confissão',
      icon: HeartHandshake,
      colorClass: 'text-purple-700 dark:text-purple-300 bg-purple-500/10 border-purple-500/30',
      internalLocation: 'Confessionário da Secretaria Paroquial',
    },
    adoracao: {
      label: 'Adoração ao Santíssimo',
      icon: Flame,
      colorClass: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30',
      internalLocation: 'Comunidade do Santíssimo Sacramento',
    },
    expediente: {
      label: 'Expediente Paroquial',
      icon: Clock,
      colorClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
      internalLocation: 'Secretaria Paroquial (Edifício João Paulo II)',
    },
  };

  const currentType = typeConfig[schedule.type] || typeConfig.missa;
  const TypeIcon = currentType.icon;

  // Geração do Link do Google Agenda
  const eventTitle = `${currentType.label}: ${schedule.description || 'Catedral de Colatina'}`;
  const [hours, minutes] = schedule.time.split(':').map(Number);
  
  const startDateTime = new Date(date);
  startDateTime.setHours(hours || 19, minutes || 30, 0);

  const endDateTime = new Date(startDateTime);
  endDateTime.setMinutes(startDateTime.getMinutes() + 60);

  const formatGoogleDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const googleDates = `${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}`;
  const googleDetails = `${schedule.description || currentType.label}\nLocal: Catedral do Sagrado Coração de Jesus\nDiocese de Colatina - ES`;
  const googleLocation = 'Catedral do Sagrado Coração de Jesus, Praça Frei José, 26, Centro, Colatina - ES';

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=${googleDates}&details=${encodeURIComponent(googleDetails)}&location=${encodeURIComponent(
    googleLocation
  )}`;

  // Link de Compartilhamento no WhatsApp
  const whatsappMessage = encodeURIComponent(
    `✝️ *Paz e Bem! Convite para a Catedral de Colatina*\n\n` +
    `🙏 *${currentType.label}*\n` +
    `📅 *Data:* ${dateFormatted}\n` +
    `⏰ *Horário:* às ${schedule.time}\n` +
    `🏛️ *Local:* ${currentType.internalLocation}\n` +
    (schedule.description ? `📖 *Detalhes:* ${schedule.description}\n\n` : '\n') +
    `Vamos celebrar juntos? Venha com sua família!`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-[var(--dash-surface)] rounded-2xl border border-[#C8A463]/50 shadow-2xl overflow-hidden animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabeçalho do Modal com degrade solene */}
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
            <TypeIcon className="w-6 h-6 text-[#FFCC36]" />
          </div>

          <Badge variant="matriz" className="text-[11px] font-bold uppercase tracking-wider mb-2">
            Catedral do Sagrado Coração de Jesus
          </Badge>

          <h2 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wide">
            {currentType.label}
          </h2>

          <div className="font-mono text-2xl sm:text-3xl font-black text-[#FFCC36] mt-1">
            {schedule.time}
          </div>
        </div>

        {/* Informações da Celebração */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
          {/* Box de Data e Dia */}
          <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-[#8B1E22] dark:text-[#FFA82A] shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--dash-text-muted)] block">
                Data Canônica
              </span>
              <span className="font-bold text-[var(--dash-text-primary)] text-sm">
                {dateFormatted}
              </span>
            </div>
          </div>

          {/* Local Interno na Catedral */}
          <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#8B1E22] dark:text-[#FFA82A] shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--dash-text-muted)] block">
                Localização no Templo
              </span>
              <span className="font-semibold text-[var(--dash-text-primary)]">
                {currentType.internalLocation}
              </span>
            </div>
          </div>

          {/* Celebrante / Escala Presidencial */}
          <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex items-center gap-3">
            <User className="w-5 h-5 text-[#8B1E22] dark:text-[#FFA82A] shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--dash-text-muted)] block">
                Presidência / Celebrante
              </span>
              <span className="font-semibold text-[var(--dash-text-primary)]">
                {schedule.type === 'missa'
                  ? 'Sacerdote da Paróquia (Pe. Irineu Sales / Vigários)'
                  : schedule.type === 'confissao'
                  ? 'Plantão Sacerdotal no Confessionário'
                  : 'Ministros da Eucaristia e Fiéis da Catedral'}
              </span>
            </div>
          </div>

          {/* Descrição Pastoral */}
          {schedule.description && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-[var(--dash-text-secondary)] leading-relaxed">
              <strong className="text-amber-800 dark:text-amber-300 block mb-1">
                Finalidade Pastoral:
              </strong>
              {schedule.description}
            </div>
          )}

          {/* Botões de Ação: Google Calendar + WhatsApp */}
          <div className="pt-2 space-y-2.5">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#03637A] hover:bg-[#02495A] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md min-h-[44px]"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Adicionar ao meu Google Agenda</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md min-h-[44px]"
            >
              <Share2 className="w-4 h-4" />
              <span>Convidar / Compartilhar no WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Rodapé */}
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
