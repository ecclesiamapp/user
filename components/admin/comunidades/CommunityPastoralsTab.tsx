'use client';

import React, { useState } from 'react';
import { HeartHandshake, Plus, Trash2, Edit2, Check, Sparkles, Clock, User, BookOpen } from 'lucide-react';
import { CommunityPastoralGroup } from '@/types';
import { Button, Input } from '@/components/ui';

interface CommunityPastoralsTabProps {
  pastoralGroups: CommunityPastoralGroup[];
  onChange: (groups: CommunityPastoralGroup[]) => void;
}

export function CommunityPastoralsTab({ pastoralGroups = [], onChange }: CommunityPastoralsTabProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Formulário do grupo
  const [name, setName] = useState('');
  const [meetingDayAndTime, setMeetingDayAndTime] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [description, setDescription] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const pastoralPresets = [
    'Pastoral Familiar',
    'Círculo Bíblico nos Lares',
    'Terço dos Homens',
    'Pastoral da Catequese',
    'Pastoral da Juventude',
    'Pastoral da Criança',
    'Apostolado da Oração',
    'Pastoral do Dízimo',
    'Ministério de Música & Liturgia',
    'Pastoral da Esperança (Acolhida)',
  ];

  const handleStartAdd = () => {
    setName('Pastoral Familiar');
    setMeetingDayAndTime('Quartas-feiras às 19:30');
    setCoordinatorName('');
    setDescription('');
    setEditingIndex(null);
    setIsAddingNew(true);
  };

  const handleStartEdit = (idx: number) => {
    const group = pastoralGroups[idx];
    if (!group) return;
    setName(group.name || '');
    setMeetingDayAndTime(group.meeting_day_and_time || '');
    setCoordinatorName(group.coordinator_name || '');
    setDescription(group.description || '');
    setEditingIndex(idx);
    setIsAddingNew(false);
  };

  const handleSaveGroup = () => {
    if (!name.trim() || !meetingDayAndTime.trim()) return;

    const newGroup: CommunityPastoralGroup = {
      name: name.trim(),
      meeting_day_and_time: meetingDayAndTime.trim(),
      coordinator_name: coordinatorName.trim() || undefined,
      description: description.trim() || undefined,
    };

    if (editingIndex !== null) {
      const updated = [...pastoralGroups];
      updated[editingIndex] = newGroup;
      onChange(updated);
      setEditingIndex(null);
    } else {
      onChange([...pastoralGroups, newGroup]);
      setIsAddingNew(false);
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingIndex(null);
  };

  const handleRemove = (idx: number) => {
    const updated = pastoralGroups.filter((_, i) => i !== idx);
    onChange(updated);
    if (editingIndex === idx) {
      setEditingIndex(null);
      setIsAddingNew(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--dash-border)]">
        <div>
          <h3 className="text-sm font-bold text-[var(--dash-text-primary)] flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-500" />
            <span>Pastorais, Movimentos & Círculos Bíblicos</span>
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Vincule os grupos de oração, círculos nos lares e pastorais ativas nesta comunidade.
          </p>
        </div>

        {!isAddingNew && editingIndex === null && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleStartAdd}
            icon={<Plus className="w-4 h-4 text-amber-500" />}
          >
            Vincular Pastoral
          </Button>
        )}
      </div>

      {/* Formulário de Adição/Edição de Pastoral */}
      {(isAddingNew || editingIndex !== null) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{editingIndex !== null ? 'Editar Pastoral' : 'Vincular Nova Pastoral'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
                Nome da Pastoral ou Movimento *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Círculo Bíblico nos Lares"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:ring-2 focus:ring-[var(--primary)] outline-hidden"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {pastoralPresets.slice(0, 5).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setName(p)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--dash-surface)] border border-[var(--dash-border)] hover:border-amber-500/50 text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-all cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Dia e Horário dos Encontros *"
              required
              value={meetingDayAndTime}
              onChange={(e) => setMeetingDayAndTime(e.target.value)}
              placeholder="Ex: Terças-feiras às 19:30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Coordenador(a) da Pastoral"
              value={coordinatorName}
              onChange={(e) => setCoordinatorName(e.target.value)}
              placeholder="Ex: Diácono José ou Lúcia Rocha"
            />

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
                Finalidade / Atividades Principais
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Encontros orantes nos lares e leitura do Evangelho."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:ring-2 focus:ring-[var(--primary)] outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--dash-border)]">
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSaveGroup}
              disabled={!name.trim() || !meetingDayAndTime.trim()}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              Salvar Pastoral
            </Button>
          </div>
        </div>
      )}

      {/* Lista de Pastorais Vinculadas */}
      {pastoralGroups.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--dash-border)] text-xs text-[var(--dash-text-secondary)] space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-[var(--dash-text-secondary)]/50" />
          <p className="font-semibold">Nenhuma pastoral ou movimento vinculado no momento.</p>
          <p className="text-[11px]">
            Vincule os círculos bíblicos e pastorais para enriquecer a landing page pública da CEB.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pastoralGroups.map((g, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] flex items-start justify-between gap-3 shadow-xs hover:border-[var(--dash-border-hover,rgba(255,255,255,0.2))] transition-all"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[var(--dash-text-primary)] truncate">
                  {g.name}
                </h4>

                <div className="flex items-center gap-1.5 text-[11px] text-amber-500 font-medium">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span className="truncate">{g.meeting_day_and_time}</span>
                </div>

                {g.coordinator_name && (
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--dash-text-secondary)]">
                    <User className="w-3 h-3 shrink-0" />
                    <span className="truncate">Coord.: {g.coordinator_name}</span>
                  </div>
                )}

                {g.description && (
                  <p className="text-[10px] text-[var(--dash-text-secondary)] line-clamp-1 italic">
                    «{g.description}»
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleStartEdit(idx)}
                  className="p-2 rounded-lg text-[var(--dash-text-secondary)] hover:text-amber-500 hover:bg-amber-500/10 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                  title="Editar pastoral"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-2 rounded-lg text-[var(--dash-text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                  title="Desvincular pastoral"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
