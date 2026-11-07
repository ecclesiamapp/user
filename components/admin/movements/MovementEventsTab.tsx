'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Users,
  Loader2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { ParishMovement, ParishMovementEvent } from '@/types/movements';
import { createClient } from '@/utils/supabase/client';

interface MovementEventsTabProps {
  movements: ParishMovement[];
  events: ParishMovementEvent[];
  onReload: () => Promise<void>;
}

export function MovementEventsTab({
  movements,
  events,
  onReload,
}: MovementEventsTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [movementId, setMovementId] = useState(movements[0]?.id || '');
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('encontro_etapa');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeInfo, setTimeInfo] = useState('');
  const [location, setLocation] = useState('Centro Pastoral São João Paulo II - Catedral');
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState('');
  const [notes, setNotes] = useState('');

  const handleToggleRegistration = async (id: string, current: boolean) => {
    try {
      setUpdatingId(id);
      const supabase = createClient();
      const { error } = await supabase
        .from('parish_movement_events')
        .update({ registration_open: !current, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        setFeedback(`Erro: ${error.message}`);
      } else {
        setFeedback(
          !current
            ? 'Inscrições abertas com sucesso no portal do fiel!'
            : 'Inscrições encerradas para este encontro.'
        );
        await onReload();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha';
      setFeedback(`Erro: ${msg}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate) {
      setFeedback('Informe o título e a data de início do encontro.');
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const selectedMov = movements.find((m) => m.id === movementId);

      const { error } = await supabase.from('parish_movement_events').insert([
        {
          parish_id: selectedMov?.parish_id || 'c0000000-0000-0000-0000-000000000001',
          movement_id: movementId,
          title: title.trim(),
          event_type: eventType,
          start_date: startDate,
          end_date: endDate || null,
          time_info: timeInfo.trim() || null,
          location: location.trim() || null,
          registration_open: registrationOpen,
          max_participants: maxParticipants ? parseInt(maxParticipants, 10) : null,
          notes: notes.trim() || null,
          status: 'agendado',
        },
      ]);

      if (error) {
        setFeedback(`Erro ao criar encontro: ${error.message}`);
      } else {
        setFeedback('Novo encontro/etapa cadastrado com sucesso!');
        setIsAdding(false);
        setTitle('');
        setStartDate('');
        setEndDate('');
        setTimeInfo('');
        setNotes('');
        await onReload();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro';
      setFeedback(`Erro: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {feedback && (
        <div className="p-3.5 rounded-xl bg-[#22262B] border border-[#C8A463]/40 text-xs text-[#FAF6F0] flex items-center justify-between">
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-[#FFCC36] hover:underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Top Bar with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#1B1E22] border border-[#C8A463]/25">
        <div>
          <h3 className="text-sm font-serif font-bold text-[#FAF6F0]">
            Cronograma de Encontros & Etapas
          </h3>
          <p className="text-xs text-[#FAF6F0]/60">
            Gerencie datas, locais e controle o status de inscrições abertas para o ECC, EAC e EJC.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E22] via-[#C8A463] to-[#8B1E22] hover:brightness-110 text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-all min-h-[40px] cursor-pointer shrink-0 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Fechar Formulário' : 'Novo Encontro / Etapa'}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateEvent}
          className="p-5 rounded-2xl bg-[#1B1E22] border border-[#C8A463]/40 space-y-4 animate-in fade-in duration-200"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFCC36]">
            Cadastrar Nova Etapa / Encontro
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                Movimento Paroquial *
              </label>
              <select
                value={movementId}
                onChange={(e) => setMovementId(e.target.value)}
                className="dash-select w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] pl-3.5 pr-10 py-2.5 focus:border-[#FFCC36] focus:outline-none"
              >
                {movements.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.acronym} — {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                Tipo do Evento
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="dash-select w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] pl-3.5 pr-10 py-2.5 focus:border-[#FFCC36] focus:outline-none"
              >
                <option value="encontro_etapa">Encontro / Etapa Principal</option>
                <option value="pos_encontro">Reunião de Pós-Encontro</option>
                <option value="circulo">Círculo nas Comunidades</option>
                <option value="missa_entrega">Santa Missa de Entrega / Envio</option>
                <option value="formacao">Formação de Lideranças</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
              Título da Atividade *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: XXXVII ECC — 1ª Etapa Paroquial"
              className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[40px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                Data de Início *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[40px]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                Data de Término
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[40px]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                Horário / Turno
              </label>
              <input
                type="text"
                value={timeInfo}
                onChange={(e) => setTimeInfo(e.target.value)}
                placeholder="Ex: Sexta a Domingo"
                className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[40px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                Local do Encontro
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Centro Pastoral São João Paulo II"
                className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[40px]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                Limite de Participantes (Vagas)
              </label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                placeholder="Ex: 35"
                className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[40px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="chkRegOpen"
              checked={registrationOpen}
              onChange={(e) => setRegistrationOpen(e.target.checked)}
              className="w-4 h-4 rounded border-[#C8A463]/50 text-[#C8A463] cursor-pointer"
            />
            <label htmlFor="chkRegOpen" className="text-xs text-[#FAF6F0]/85 cursor-pointer">
              Abrir imediatamente para manifestação de interesse na página do movimento
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#C8A463]/20">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-[var(--dash-surface)]/5 text-xs text-[#FAF6F0]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C8A463] to-[#FFCC36] text-[#2D1A16] font-bold text-xs uppercase tracking-wider min-h-[40px]"
            >
              {submitting ? 'Salvando...' : 'Salvar Encontro'}
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#1B1E22] border border-[#C8A463]/20 text-center">
            <p className="text-xs text-[#FAF6F0]/60">Nenhum encontro cadastrado ainda.</p>
          </div>
        ) : (
          events.map((ev) => {
            const mov = movements.find((m) => m.id === ev.movement_id);
            const isToggling = updatingId === ev.id;

            return (
              <div
                key={ev.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#1B1E22] border border-[#C8A463]/20 hover:border-[#C8A463]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#C8A463]/20 text-[#FFCC36] flex items-center justify-center text-[11px] font-serif font-black">
                      {mov?.acronym || 'MOV'}
                    </span>
                    <span className="text-xs text-[#FFCC36] font-bold">
                      {ev.start_date.split('-').reverse().join('/')}
                      {ev.end_date && ` a ${ev.end_date.split('-').reverse().join('/')}`}
                    </span>
                  </div>

                  <h4 className="text-sm font-serif font-bold text-[#FAF6F0]">{ev.title}</h4>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#FAF6F0]/60">
                    {ev.time_info && <span>• {ev.time_info}</span>}
                    {ev.location && <span>• {ev.location}</span>}
                    {ev.max_participants && <span>• Limite: {ev.max_participants} vagas</span>}
                  </div>
                </div>

                {/* 1-Click Toggle for Registrations */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={() => handleToggleRegistration(ev.id, ev.registration_open)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all min-h-[40px] cursor-pointer ${
                      ev.registration_open
                        ? 'bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300'
                        : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {isToggling ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : ev.registration_open ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                    <span>{ev.registration_open ? 'Inscrições Abertas' : 'Inscrições Fechadas'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
