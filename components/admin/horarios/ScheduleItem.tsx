'use client';

import React from 'react';
import {
  Clock,
  MapPin,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Sparkles,
  Church,
  Calendar
} from 'lucide-react';
import { MassSchedule } from '@/types';
import { Badge } from '@/components/ui';

interface ScheduleItemProps {
  schedule: MassSchedule;
  onEdit: (schedule: MassSchedule) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  isActionLoading?: boolean;
}

export function ScheduleItem({
  schedule,
  onEdit,
  onDelete,
  onToggleActive,
  isActionLoading = false,
}: ScheduleItemProps) {
  // Helper de badges para o tipo de celebração
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'missa':
        return <Badge variant="matriz">Santa Missa</Badge>;
      case 'celebracao_palavra':
        return <Badge variant="ceb">Celebração da Palavra</Badge>;
      case 'adoracao':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Adoração
          </span>
        );
      case 'confissao':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Confissões
          </span>
        );
      default:
        return <Badge variant="default">{type}</Badge>;
    }
  };

  return (
    <div
      className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:bg-[var(--dash-surface-secondary)]/50 ${
        !schedule.is_active ? 'opacity-60 bg-[var(--dash-surface-secondary)]/30' : ''
      }`}
    >
      <div className="space-y-1.5 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-sm sm:text-base text-[var(--dash-text-primary)]">
            {schedule.day_of_week}
          </span>
          <Badge variant="active" icon={<Clock className="w-3 h-3" />}>
            {schedule.time}
          </Badge>
          {getTypeBadge(schedule.type)}
          <Badge variant={schedule.is_active ? 'active' : 'inactive'}>
            {schedule.is_active ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        <p className="text-sm font-medium text-[var(--dash-text-primary)]">
          {schedule.description || `${schedule.day_of_week} às ${schedule.time}`}
        </p>

        <p className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
          <span className="font-semibold text-[var(--dash-text-primary)]">
            {schedule.community?.name || schedule.location_name || 'Comunidade Paroquial'}
          </span>
          {schedule.community?.is_headquarters && (
            <span className="text-[11px] text-amber-400 font-semibold">(Sede)</span>
          )}
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center gap-1.5 self-end sm:self-center">
        <button
          onClick={() => onToggleActive(schedule.id, schedule.is_active)}
          disabled={isActionLoading}
          title={schedule.is_active ? 'Desativar Horário' : 'Ativar Horário'}
          className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-border)] transition-colors cursor-pointer"
        >
          {schedule.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onEdit(schedule)}
          disabled={isActionLoading}
          title="Editar Horário"
          className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(schedule.id)}
          disabled={isActionLoading}
          title="Excluir Horário"
          className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
        </button>
      </div>
    </div>
  );
}
