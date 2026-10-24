'use client';

import React, { useState } from 'react';
import { Bell, Plus, Trash2, Edit2, Check, Sparkles, Calendar, Tag, AlertCircle } from 'lucide-react';
import { CommunityNotice } from '@/types';
import { Button, Input } from '@/components/ui';

interface CommunityNoticesTabProps {
  notices: CommunityNotice[];
  onChange: (notices: CommunityNotice[]) => void;
}

export function CommunityNoticesTab({ notices = [], onChange }: CommunityNoticesTabProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Formulário do aviso
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'aviso' | 'liturgia' | 'formacao' | 'mutirao'>('aviso');
  const [priority, setPriority] = useState<'normal' | 'alta'>('normal');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleStartAdd = () => {
    setTitle('');
    setContent('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('aviso');
    setPriority('normal');
    setEditingIndex(null);
    setIsAddingNew(true);
  };

  const handleStartEdit = (idx: number) => {
    const n = notices[idx];
    if (!n) return;
    setTitle(n.title || '');
    setContent(n.content || '');
    setDate(n.date || new Date().toISOString().split('T')[0]);
    setCategory(n.category || 'aviso');
    setPriority(n.priority || 'normal');
    setEditingIndex(idx);
    setIsAddingNew(false);
  };

  const handleSaveNotice = () => {
    if (!title.trim() || !content.trim()) return;

    const newNotice: CommunityNotice = {
      id: editingIndex !== null ? notices[editingIndex].id : `aviso-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      date,
      category,
      priority,
    };

    if (editingIndex !== null) {
      const updated = [...notices];
      updated[editingIndex] = newNotice;
      onChange(updated);
      setEditingIndex(null);
    } else {
      onChange([newNotice, ...notices]);
      setIsAddingNew(false);
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingIndex(null);
  };

  const handleRemove = (idx: number) => {
    const updated = notices.filter((_, i) => i !== idx);
    onChange(updated);
    if (editingIndex === idx) {
      setEditingIndex(null);
      setIsAddingNew(false);
    }
  };

  const getCategoryLabel = (cat?: string) => {
    switch (cat) {
      case 'formacao':
        return 'Formação & Catequese';
      case 'liturgia':
        return 'Liturgia & Missa';
      case 'mutirao':
        return 'Mutirão & Caridade';
      default:
        return 'Aviso Geral';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--dash-border)]">
        <div>
          <h3 className="text-sm font-bold text-[var(--dash-text-primary)] flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Mural de Avisos da Comunidade (CEB)</span>
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Gerencie comunicados, escalas litúrgicas e convites pastorais exibidos no Card 2.
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
            Novo Comunicado
          </Button>
        )}
      </div>

      {/* Formulário de Adição/Edição de Aviso */}
      {(isAddingNew || editingIndex !== null) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{editingIndex !== null ? 'Editar Comunicado' : 'Novo Comunicado'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Título do Comunicado *"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Inscrições da Catequese 2027"
              />
            </div>

            <Input
              label="Data de Publicação *"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
                Categoria Pastoral
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2 text-xs focus:ring-2 focus:ring-[var(--primary)] outline-hidden"
              >
                <option value="aviso">Aviso Geral</option>
                <option value="liturgia">Liturgia & Missa</option>
                <option value="formacao">Formação & Catequese</option>
                <option value="mutirao">Mutirão & Caridade</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
                Destaque / Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2 text-xs focus:ring-2 focus:ring-[var(--primary)] outline-hidden"
              >
                <option value="normal">Normal (Sem urgência)</option>
                <option value="alta">Alta (Destaque urgente no mural)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
              Texto Completo do Comunicado *
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva o comunicado, datas de encontros, público-alvo e orientações para a comunidade..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:ring-2 focus:ring-[var(--primary)] outline-hidden resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--dash-border)]">
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSaveNotice}
              disabled={!title.trim() || !content.trim()}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              Salvar Comunicado
            </Button>
          </div>
        </div>
      )}

      {/* Lista de Avisos */}
      {notices.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--dash-border)] text-xs text-[var(--dash-text-secondary)] space-y-2">
          <Bell className="w-8 h-8 mx-auto text-[var(--dash-text-secondary)]/50" />
          <p className="font-semibold">Nenhum comunicado cadastrado no momento.</p>
          <p className="text-[11px]">
            Adicione comunicados para alimentar o mural de avisos público da capela.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((n, idx) => (
            <div
              key={n.id || idx}
              className="p-4 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] flex items-start justify-between gap-4 shadow-xs hover:border-[var(--dash-border-hover,rgba(255,255,255,0.2))] transition-all"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {getCategoryLabel(n.category)}
                  </span>
                  {n.priority === 'alta' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      Urgente
                    </span>
                  )}
                  <span className="text-[11px] text-[var(--dash-text-secondary)] font-mono">
                    {new Date(n.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[var(--dash-text-primary)]">
                  {n.title}
                </h4>

                <p className="text-xs text-[var(--dash-text-secondary)] line-clamp-2 leading-relaxed">
                  {n.content}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 pt-1">
                <button
                  type="button"
                  onClick={() => handleStartEdit(idx)}
                  className="p-2 rounded-lg text-[var(--dash-text-secondary)] hover:text-amber-500 hover:bg-amber-500/10 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                  title="Editar aviso"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-2 rounded-lg text-[var(--dash-text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                  title="Excluir aviso"
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
