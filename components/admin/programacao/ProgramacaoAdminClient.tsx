'use client';

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CalendarDays, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Layers
} from 'lucide-react';
import { ParishSpecialEvent, ParishEventDay, Community } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { EventCard } from './EventCard';
import { EventFormModal } from './EventFormModal';
import { DayScheduleBuilderModal } from './DayScheduleBuilderModal';
import { EventMobilePreviewModal } from './EventMobilePreviewModal';
import { EVENT_TYPES, EVENT_STATUSES } from './eventConstants';

interface ProgramacaoAdminClientProps {
  initialEvents: ParishSpecialEvent[];
  communities: Community[];
  parishId: string;
}

export function ProgramacaoAdminClient({
  initialEvents,
  communities,
  parishId,
}: ProgramacaoAdminClientProps) {
  const [events, setEvents] = useState<ParishSpecialEvent[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modais
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<ParishSpecialEvent | null>(null);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [eventForSchedule, setEventForSchedule] = useState<ParishSpecialEvent | null>(null);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [eventForPreview, setEventForPreview] = useState<ParishSpecialEvent | null>(null);

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Filtragem
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (filterType !== 'all' && ev.event_type !== filterType) return false;
      if (filterStatus !== 'all' && ev.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = ev.title.toLowerCase().includes(query);
        const matchesTheme = (ev.theme || '').toLowerCase().includes(query);
        const matchesMotto = (ev.motto || '').toLowerCase().includes(query);
        const matchesCommunity = (ev.community_name || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesTheme && !matchesMotto && !matchesCommunity) return false;
      }
      return true;
    });
  }, [events, filterType, filterStatus, searchQuery]);

  // Contadores estatísticos
  const stats = useMemo(() => {
    const total = events.length;
    const active = events.filter((e) => e.status === 'destaque_ativo').length;
    const drafts = events.filter((e) => e.status === 'rascunho').length;
    return { total, active, drafts };
  }, [events]);

  // Handlers dos Modais
  const handleOpenCreateModal = () => {
    setEventToEdit(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (ev: ParishSpecialEvent) => {
    setEventToEdit(ev);
    setFormModalOpen(true);
  };

  const handleOpenScheduleModal = (ev: ParishSpecialEvent) => {
    setEventForSchedule(ev);
    setScheduleModalOpen(true);
  };

  const handleOpenPreviewModal = (ev: ParishSpecialEvent) => {
    setEventForPreview(ev);
    setPreviewModalOpen(true);
  };

  const handleFormSuccess = (savedEvent: ParishSpecialEvent, msg: string) => {
    // Vincular nome da comunidade para renderização imediata
    const comm = communities.find((c) => c.id === savedEvent.community_id);
    const enriched: ParishSpecialEvent = {
      ...savedEvent,
      community_name: comm ? comm.name : 'Catedral Sagrado Coração de Jesus (Matriz)',
      days: eventToEdit?.days || [],
    };

    if (eventToEdit) {
      setEvents((prev) => prev.map((e) => (e.id === savedEvent.id ? enriched : e)));
    } else {
      setEvents((prev) => [enriched, ...prev]);
    }
    showToast(msg, 'success');
  };

  const handleDaysUpdated = (eventId: string, updatedDays: ParishEventDay[]) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, days: updatedDays } : e))
    );
  };

  const handleDeleteEvent = async (ev: ParishSpecialEvent) => {
    if (!confirm(`Deseja realmente excluir a festividade "${ev.title}"? Todos os dias de programação vinculados serão apagados permanentemente.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('parish_special_events')
        .delete()
        .eq('id', ev.id);

      if (error) throw error;

      setEvents((prev) => prev.filter((e) => e.id !== ev.id));
      showToast(`Festividade "${ev.title}" excluída com sucesso.`, 'success');
    } catch (err: any) {
      console.error('Erro ao excluir evento:', err);
      showToast(err?.message || 'Falha ao excluir a festividade.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Flutuante de Feedback */}
      {feedbackMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-bold">{feedbackMsg.text}</span>
        </div>
      )}

      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
              Módulo Litúrgico Especial
            </span>
            <span className="text-xs text-[var(--dash-text-muted)]">• Grandes Festas & Solenidades</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--dash-text-primary)] mt-1">
            Festas, Solenidades & Programações Especiais
          </h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-0.5">
            Crie landing pages ricas para a Festa da Co-Padroeira, Tríduo Pascal, Padroeiro da Matriz e festas das 12 comunidades (CEBs).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px] shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-200" />
          <span>Criar Nova Festa / Solenidade</span>
        </button>
      </div>

      {/* Cards de Métricas e Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--dash-text-secondary)] uppercase tracking-wider block">
              Total de Festividades
            </span>
            <span className="text-2xl font-extrabold text-[var(--dash-text-primary)] mt-0.5 block">
              {stats.total}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A]">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--dash-text-secondary)] uppercase tracking-wider block">
              Publicadas & Ativas
            </span>
            <span className="text-2xl font-extrabold text-emerald-500 mt-0.5 block">
              {stats.active}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--dash-text-secondary)] uppercase tracking-wider block">
              Rascunhos Internos
            </span>
            <span className="text-2xl font-extrabold text-amber-500 mt-0.5 block">
              {stats.drafts}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="p-3 sm:p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Busca */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[var(--dash-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome da festa, tema, lema ou comunidade..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
            />
          </div>

          {/* Filtro por Tipo */}
          <div className="sm:col-span-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
            >
              <option value="all">Todos os tipos</option>
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Status */}
          <div className="sm:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
            >
              <option value="all">Todos os status</option>
              {EVENT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Festas Cadastradas */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-[var(--dash-border)] bg-[var(--dash-surface)] text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#8B1E22]/10 text-[#FFCC36] flex items-center justify-center">
            <CalendarDays className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[var(--dash-text-primary)]">
              Nenhuma festa ou solenidade encontrada
            </h3>
            <p className="text-xs text-[var(--dash-text-secondary)] mt-1 max-w-md mx-auto">
              Nenhum evento corresponde aos filtros selecionados. Clique no botão abaixo para criar a primeira festividade.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4 text-amber-200" />
            <span>Criar Nova Festa</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleOpenEditModal}
              onManageSchedule={handleOpenScheduleModal}
              onPreview={handleOpenPreviewModal}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}

      {/* Modais */}
      <EventFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSuccess={handleFormSuccess}
        eventToEdit={eventToEdit}
        communities={communities}
        parishId={parishId}
      />

      <DayScheduleBuilderModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        event={eventForSchedule}
        onDaysUpdated={handleDaysUpdated}
      />

      <EventMobilePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        event={eventForPreview}
      />
    </div>
  );
}
