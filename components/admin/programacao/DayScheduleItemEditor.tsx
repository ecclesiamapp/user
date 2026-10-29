'use client';

import React from 'react';
import { Plus, Trash2, Clock, MapPin, User, FileText } from 'lucide-react';
import { EventScheduleItem } from '@/types';

interface DayScheduleItemEditorProps {
  items: EventScheduleItem[];
  onChange: (items: EventScheduleItem[]) => void;
}

export function DayScheduleItemEditor({ items, onChange }: DayScheduleItemEditorProps) {
  const handleAddItem = () => {
    const newItem: EventScheduleItem = {
      time: '19:30',
      title: 'Santa Missa Solene',
      location: 'Catedral Diocesana',
      celebrant: '',
      description: '',
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof EventScheduleItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] block">
            Grade de Horários & Atividades do Dia
          </label>
          <span className="text-[11px] text-[var(--dash-text-muted)]">
            Adicione celebrações, missas, procissões, adorações e atrações com horários definidos.
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="px-3 py-1.5 rounded-xl bg-[var(--dash-surface-hover)] hover:bg-[#8B1E22]/15 text-[#8B1E22] dark:text-[#FFA82A] text-xs font-bold border border-[var(--dash-border)] hover:border-[#FFA82A]/40 transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar Horário</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-[var(--dash-border)] text-center text-xs text-[var(--dash-text-muted)] bg-[var(--dash-surface-secondary)]/40">
          Nenhum horário cadastrado para este dia. Clique no botão acima para adicionar a primeira atividade (ex: Santa Missa, Terço, Procissão).
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/50 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--dash-surface)] text-[var(--dash-text-muted)] border border-[var(--dash-border)]">
                  Horário #{index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remover horário"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FFA82A]" />
                    <span>Horário *</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={item.time}
                    onChange={(e) => handleUpdateItem(index, 'time', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-1 focus:ring-[#8B1E22]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1">
                    Título da Atividade / Celebração *
                  </label>
                  <input
                    type="text"
                    required
                    value={item.title}
                    onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                    placeholder="Ex: Santa Missa Solene com Bênção dos Carros"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-1 focus:ring-[#8B1E22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[var(--primary)]" />
                    <span>Local / Espaço (opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={item.location || ''}
                    onChange={(e) => handleUpdateItem(index, 'location', e.target.value)}
                    placeholder="Ex: Catedral Diocesana, Pátio ou Salão"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-1 focus:ring-[#8B1E22]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#FFA82A]" />
                    <span>Celebrante / Pregador Específico (opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={item.celebrant || ''}
                    onChange={(e) => handleUpdateItem(index, 'celebrant', e.target.value)}
                    placeholder="Ex: Pe. Irineu Valmorbida"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-1 focus:ring-[#8B1E22]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
