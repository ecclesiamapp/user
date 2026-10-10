'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Church,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Community, MassSchedule } from '@/types';
import { Button, Input, Select } from '@/components/ui';

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  scheduleToEdit?: MassSchedule | null;
  communities: Community[];
  initialCommunityId?: string;
  parishId: string;
}

export function ScheduleFormModal({
  isOpen,
  onClose,
  onSuccess,
  scheduleToEdit,
  communities,
  initialCommunityId,
  parishId,
}: ScheduleFormModalProps) {
  const [communityId, setCommunityId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<MassSchedule['day_of_week']>('Domingo');
  const [time, setTime] = useState('07:00');
  const [type, setType] = useState<MassSchedule['type']>('missa');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (scheduleToEdit) {
      setCommunityId(scheduleToEdit.community_id);
      setDayOfWeek(scheduleToEdit.day_of_week);
      setTime(scheduleToEdit.time);
      setType(scheduleToEdit.type);
      setDescription(scheduleToEdit.description || '');
      setIsActive(scheduleToEdit.is_active ?? true);
    } else {
      setCommunityId(
        initialCommunityId && initialCommunityId !== 'all'
          ? initialCommunityId
          : communities[0]?.id || ''
      );
      setDayOfWeek('Domingo');
      setTime('07:00');
      setType('missa');
      setDescription('');
      setIsActive(true);
    }
    setErrorMsg(null);
  }, [scheduleToEdit, isOpen, initialCommunityId, communities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityId) {
      setErrorMsg('Por favor, selecione uma comunidade.');
      return;
    }
    if (!time.trim()) {
      setErrorMsg('Por favor, informe o horário.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        parish_id: parishId,
        community_id: communityId,
        day_of_week: dayOfWeek,
        time: time.trim(),
        type,
        description: description.trim() || null,
        is_active: isActive,
      };

      if (scheduleToEdit) {
        const { error } = await supabase
          .from('mass_schedules')
          .update(payload)
          .eq('id', scheduleToEdit.id);

        if (error) throw error;
        onSuccess('Horário atualizado com sucesso!');
      } else {
        const { error } = await supabase.from('mass_schedules').insert([payload]);
        if (error) throw error;
        onSuccess('Novo horário cadastrado com sucesso!');
      }

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar horário';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--dash-text-primary)]">
                {scheduleToEdit ? 'Editar Horário' : 'Novo Horário de Celebração'}
              </h2>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                {scheduleToEdit
                  ? 'Atualize o dia, hora ou modalidade litúrgica.'
                  : 'Vincule uma celebração da palavra ou Santa Missa a uma capela.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-border)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Select
            label="Comunidade / Capela *"
            required
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
          >
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.is_headquarters ? '⭐ ' : ''}{c.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Dia da Semana *"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value as MassSchedule['day_of_week'])}
            >
              <option value="Domingo">Domingo</option>
              <option value="Segunda-feira">Segunda-feira</option>
              <option value="Terça-feira">Terça-feira</option>
              <option value="Quarta-feira">Quarta-feira</option>
              <option value="Quinta-feira">Quinta-feira</option>
              <option value="Sexta-feira">Sexta-feira</option>
              <option value="Sábado">Sábado</option>
            </Select>

            <Input
              label="Horário *"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Ex: 07:00 ou 19:30"
            />
          </div>

          <Select
            label="Tipo de Celebração *"
            value={type}
            onChange={(e) => setType(e.target.value as MassSchedule['type'])}
          >
            <option value="missa">Santa Missa</option>
            <option value="celebracao_palavra">Celebração da Palavra (Culto)</option>
            <option value="adoracao">Adoração ao Santíssimo</option>
            <option value="confissao">Atendimento de Confissões</option>
            <option value="expediente">Expediente Paroquial</option>
          </Select>

          <Input
            label="Descrição / Detalhes (Opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Missa das Crianças com Catequese"
          />

          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
            <input
              type="checkbox"
              id="schedule_is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded-md text-[var(--primary)] border-[var(--dash-border)] focus:ring-[var(--primary)] cursor-pointer"
            />
            <label
              htmlFor="schedule_is_active"
              className="text-xs font-semibold text-[var(--dash-text-primary)] cursor-pointer select-none"
            >
              Horário Ativo (visível no portal do fiel e minisites)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--dash-border)]">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              {scheduleToEdit ? 'Salvar Alterações' : 'Cadastrar Horário'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
