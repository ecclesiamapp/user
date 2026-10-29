'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  CalendarDays, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Check, 
  AlertCircle, 
  Sparkles,
  HeartHandshake,
  Users,
  PartyPopper,
  Palette,
  Calendar
} from 'lucide-react';
import { ParishSpecialEvent, ParishEventDay, EventScheduleItem } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { LITURGICAL_COLORS } from './eventConstants';
import { DayScheduleItemEditor } from './DayScheduleItemEditor';

interface DayScheduleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ParishSpecialEvent | null;
  onDaysUpdated: (eventId: string, days: ParishEventDay[]) => void;
}

export function DayScheduleBuilderModal({
  isOpen,
  onClose,
  event,
  onDaysUpdated,
}: DayScheduleBuilderModalProps) {
  const [days, setDays] = useState<ParishEventDay[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Campos do dia selecionado
  const [dayDate, setDayDate] = useState('');
  const [dayTitle, setDayTitle] = useState('');
  const [daySubtitle, setDaySubtitle] = useState('');
  const [liturgicalColor, setLiturgicalColor] = useState('branco');
  const [celebrantName, setCelebrantName] = useState('');
  const [responsibleGroup, setResponsibleGroup] = useState('');
  const [gestureOfCharity, setGestureOfCharity] = useState('');
  const [socialAttractions, setSocialAttractions] = useState('');
  const [scheduleItems, setScheduleItems] = useState<EventScheduleItem[]>([]);

  const supabase = createClient();

  // Carregar os dias existentes do Supabase ao abrir
  useEffect(() => {
    if (!isOpen || !event) return;

    async function loadDays() {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      try {
        const { data, error } = await supabase
          .from('parish_event_days')
          .select('*')
          .eq('event_id', event!.id)
          .order('order_index', { ascending: true })
          .order('event_date', { ascending: true });

        if (error) throw error;

        const loadedDays = (data as ParishEventDay[]) || [];
        setDays(loadedDays);
        if (loadedDays.length > 0) {
          selectDay(loadedDays[0], 0);
        } else {
          // Criar dia inicial em branco baseado na data do evento
          initFirstDay();
        }
      } catch (err: any) {
        console.error('Erro ao carregar dias da festividade:', err);
        setErrorMsg('Falha ao carregar a programação do evento.');
      } finally {
        setLoading(false);
      }
    }

    loadDays();
  }, [isOpen, event]);

  const initFirstDay = () => {
    const initialDate = event?.start_date || new Date().toISOString().split('T')[0];
    setDayDate(initialDate);
    setDayTitle('1º Dia • Abertura Solene');
    setDaySubtitle('');
    setLiturgicalColor('branco');
    setCelebrantName('Pe. Irineu Valmorbida (Pároco)');
    setResponsibleGroup('');
    setGestureOfCharity('');
    setSocialAttractions('');
    setScheduleItems([
      {
        time: '19:30',
        title: 'Santa Missa Solene de Abertura',
        location: 'Catedral Diocesana',
        celebrant: 'Pe. Irineu Valmorbida',
      },
    ]);
    setSelectedDayIndex(0);
  };

  const selectDay = (day: ParishEventDay, index: number) => {
    setSelectedDayIndex(index);
    setDayDate(day.event_date);
    setDayTitle(day.day_title);
    setDaySubtitle(day.day_subtitle || '');
    setLiturgicalColor(day.liturgical_color || 'branco');
    setCelebrantName(day.celebrant_name || '');
    setResponsibleGroup(day.responsible_group || '');
    setGestureOfCharity(day.gesture_of_charity || '');
    setSocialAttractions(day.social_attractions || '');
    setScheduleItems(Array.isArray(day.schedule_items) ? day.schedule_items : []);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleAddNewDay = () => {
    // Calcular a próxima data (+1 dia em relação ao último cadastrado)
    let nextDate = event?.start_date || new Date().toISOString().split('T')[0];
    if (days.length > 0) {
      const lastDate = new Date(days[days.length - 1].event_date);
      lastDate.setDate(lastDate.getDate() + 1);
      nextDate = lastDate.toISOString().split('T')[0];
    }

    const nextIndex = days.length + 1;
    const tempDay: ParishEventDay = {
      id: `temp-${Date.now()}`,
      event_id: event!.id,
      event_date: nextDate,
      day_title: `${nextIndex}º Dia da Programação`,
      day_subtitle: '',
      liturgical_color: 'branco',
      celebrant_name: '',
      responsible_group: '',
      gesture_of_charity: '',
      social_attractions: '',
      schedule_items: [{ time: '19:30', title: 'Santa Missa Solene', location: 'Catedral Diocesana' }],
      order_index: nextIndex,
    };

    const newDaysList = [...days, tempDay];
    setDays(newDaysList);
    selectDay(tempDay, newDaysList.length - 1);
  };

  const handleDeleteCurrentDay = async () => {
    if (days.length === 0) return;
    const currentDay = days[selectedDayIndex];

    if (!confirm(`Tem certeza que deseja excluir "${currentDay.day_title}"?`)) {
      return;
    }

    try {
      setSaving(true);
      if (!currentDay.id.startsWith('temp-')) {
        const { error } = await supabase
          .from('parish_event_days')
          .delete()
          .eq('id', currentDay.id);
        if (error) throw error;
      }

      const updated = days.filter((_, idx) => idx !== selectedDayIndex);
      setDays(updated);
      onDaysUpdated(event!.id, updated);

      if (updated.length > 0) {
        selectDay(updated[0], 0);
      } else {
        initFirstDay();
      }
      setSuccessMsg('Dia removido com sucesso!');
    } catch (err: any) {
      console.error('Erro ao excluir dia:', err);
      setErrorMsg(err?.message || 'Falha ao remover o dia.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCurrentDay = async () => {
    if (!dayTitle.trim()) {
      setErrorMsg('Informe o título do dia.');
      return;
    }
    if (!dayDate) {
      setErrorMsg('Informe a data do dia.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const currentDay = days[selectedDayIndex];
      const isNew = !currentDay || currentDay.id.startsWith('temp-');

      const payload = {
        event_id: event!.id,
        event_date: dayDate,
        day_title: dayTitle.trim(),
        day_subtitle: daySubtitle.trim() || null,
        liturgical_color: liturgicalColor,
        celebrant_name: celebrantName.trim() || null,
        responsible_group: responsibleGroup.trim() || null,
        gesture_of_charity: gestureOfCharity.trim() || null,
        social_attractions: socialAttractions.trim() || null,
        schedule_items: scheduleItems,
        order_index: selectedDayIndex + 1,
        updated_at: new Date().toISOString(),
      };

      let savedDay: ParishEventDay;

      if (isNew) {
        const { data, error } = await supabase
          .from('parish_event_days')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        savedDay = data as ParishEventDay;
      } else {
        const { data, error } = await supabase
          .from('parish_event_days')
          .update(payload)
          .eq('id', currentDay.id)
          .select()
          .single();
        if (error) throw error;
        savedDay = data as ParishEventDay;
      }

      const updatedDays = [...days];
      updatedDays[selectedDayIndex] = savedDay;
      setDays(updatedDays);
      onDaysUpdated(event!.id, updatedDays);

      setSuccessMsg('Programação do dia salva com sucesso!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('Erro ao salvar dia:', err);
      setErrorMsg(err?.message || 'Falha ao salvar a programação do dia.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl shadow-2xl p-5 sm:p-7 text-[var(--dash-text-primary)] my-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--dash-border)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30">
              <CalendarDays className="w-5 h-5 text-[#FFA82A]" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-[var(--dash-text-primary)]">
                Construtor Visual Dia a Dia • {event.title}
              </h3>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Estruture a programação de cada dia: celebrações, celebrante, gesto de caridade e atrações sociais.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Mensagens */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-[var(--dash-text-secondary)]">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFA82A]" />
            <span className="text-xs font-semibold">Carregando dias da festividade...</span>
          </div>
        ) : (
          <div className="mt-5 space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            {/* Seletor Horizontal de Dias (com botão de adicionar) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--dash-border)]">
              {days.map((d, idx) => (
                <button
                  key={d.id || idx}
                  type="button"
                  onClick={() => selectDay(d, idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    selectedDayIndex === idx
                      ? 'bg-[var(--primary)] text-white shadow-md border border-[#FFA82A]/40'
                      : 'bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)] border border-[var(--dash-border)]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-200" />
                  <span>
                    Dia {idx + 1}
                    {d.event_date ? ` (${d.event_date.split('-').reverse().slice(0, 2).join('/')})` : ''}
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={handleAddNewDay}
                className="px-3 py-2 rounded-xl border border-dashed border-[#FFA82A]/50 bg-[#FFA82A]/10 hover:bg-[#FFA82A]/20 text-[#FFA82A] text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer min-h-[38px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Adicionar Dia</span>
              </button>
            </div>

            {/* Painel de Edição do Dia Selecionado */}
            <div className="p-4 sm:p-5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFA82A] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Configuração do Dia #{selectedDayIndex + 1}</span>
                </span>

                {days.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteCurrentDay}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer min-h-[36px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir este dia</span>
                  </button>
                )}
              </div>

              {/* Data e Título do Dia */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--dash-text-secondary)] mb-1">
                    Data do Dia *
                  </label>
                  <input
                    type="date"
                    required
                    value={dayDate}
                    onChange={(e) => setDayDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--dash-text-secondary)] mb-1">
                    Título do Dia * (Ex: 1º Dia do Tríduo • Noite Mariana)
                  </label>
                  <input
                    type="text"
                    required
                    value={dayTitle}
                    onChange={(e) => setDayTitle(e.target.value)}
                    placeholder="Ex: 1º Dia do Tríduo • Noite Mariana"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
                  />
                </div>
              </div>

              {/* Subtítulo e Cor Litúrgica */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--dash-text-secondary)] mb-1">
                    Subtítulo / Intenção Geral do Dia (opcional)
                  </label>
                  <input
                    type="text"
                    value={daySubtitle}
                    onChange={(e) => setDaySubtitle(e.target.value)}
                    placeholder="Ex: Oração pelas vocações e santificação das famílias"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--dash-text-secondary)] mb-1 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#FFA82A]" />
                    <span>Cor Litúrgica</span>
                  </label>
                  <select
                    value={liturgicalColor}
                    onChange={(e) => setLiturgicalColor(e.target.value)}
                    className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] pl-3.5 pr-10 py-2 text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
                  >
                    {LITURGICAL_COLORS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Celebrante Principal e Pastoral Responsável */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--dash-text-secondary)] mb-1">
                    Padre / Bispo Celebrante do Dia
                  </label>
                  <input
                    type="text"
                    value={celebrantName}
                    onChange={(e) => setCelebrantName(e.target.value)}
                    placeholder="Ex: Dom Lauro Sérgio ou Pe. Irineu Valmorbida"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--dash-text-secondary)] mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Pastoral / Comunidade Encarregada</span>
                  </label>
                  <input
                    type="text"
                    value={responsibleGroup}
                    onChange={(e) => setResponsibleGroup(e.target.value)}
                    placeholder="Ex: Pastoral Familiar, ECC e Terço dos Homens"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
                  />
                </div>
              </div>

              {/* Gesto Concreto de Caridade e Atrações Sociais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--dash-text-secondary)] mb-1 flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                    <span>Gesto Concreto / Arrecadação de Caridade</span>
                  </label>
                  <input
                    type="text"
                    value={gestureOfCharity}
                    onChange={(e) => setGestureOfCharity(e.target.value)}
                    placeholder="Ex: 1kg de alimento não perecível para os Vicentinos"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--dash-text-secondary)] mb-1 flex items-center gap-1.5">
                    <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
                    <span>Atrações Sociais & Quermesse</span>
                  </label>
                  <input
                    type="text"
                    value={socialAttractions}
                    onChange={(e) => setSocialAttractions(e.target.value)}
                    placeholder="Ex: Pastelada, barracas de doces e leilão beneficente"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
                  />
                </div>
              </div>

              {/* Grade de Horários Dinâmica */}
              <div className="pt-3 border-t border-[var(--dash-border)]">
                <DayScheduleItemEditor
                  items={scheduleItems}
                  onChange={setScheduleItems}
                />
              </div>

              {/* Botão Salvar o Dia */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveCurrentDay}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 min-h-[42px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando Dia...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-200" />
                      <span>Salvar Alterações deste Dia</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rodapé Geral */}
        <div className="pt-4 border-t border-[var(--dash-border)] flex items-center justify-between">
          <span className="text-xs text-[var(--dash-text-muted)]">
            Total de dias configurados: <strong>{days.length}</strong>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--dash-surface-hover)] text-xs font-bold text-[var(--dash-text-primary)] border border-[var(--dash-border)] hover:border-[#FFA82A]/40 transition-colors min-h-[40px] cursor-pointer"
          >
            Concluir & Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
