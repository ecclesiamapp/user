'use client';

import React from 'react';
import { Plus, Trash2, X, Sparkles } from 'lucide-react';
import { Button, Input, Badge } from '@/components/ui';
import { MassIntentionType } from '@/types';

interface CategoryNamesBoxProps {
  type: MassIntentionType;
  label: string;
  icon: string;
  desc: string;
  names: string[];
  onChangeNames: (newNames: string[]) => void;
  onRemoveCategory: () => void;
  canRemove: boolean;
}

const MAX_NAMES_PER_CATEGORY = 5;

export function CategoryNamesBox({
  label,
  icon,
  desc,
  names,
  onChangeNames,
  onRemoveCategory,
  canRemove,
}: CategoryNamesBoxProps) {
  const handleNameChange = (index: number, value: string) => {
    const updated = [...names];
    updated[index] = value;
    onChangeNames(updated);
  };

  const handleAddName = () => {
    if (names.length < MAX_NAMES_PER_CATEGORY) {
      onChangeNames([...names, '']);
    }
  };

  const handleRemoveName = (index: number) => {
    if (names.length > 1) {
      const updated = names.filter((_, i) => i !== index);
      onChangeNames(updated);
    } else {
      // Se tiver só 1 nome e remover, limpa o campo
      onChangeNames(['']);
    }
  };

  const filledCount = names.filter((n) => n.trim().length > 0).length;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/60 shadow-xs space-y-3.5 transition-all">
      {/* Cabeçalho da Categoria */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--dash-border)]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">{icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-[var(--dash-text-primary)] truncate">
                {label}
              </h4>
              <Badge
                variant="outline"
                className="text-[10px] font-semibold text-[var(--primary)] border-[var(--primary)]/30 bg-[var(--primary)]/5"
              >
                {filledCount}/{MAX_NAMES_PER_CATEGORY} {filledCount === 1 ? 'nome preenchido' : 'nomes preenchidos'}
              </Badge>
            </div>
            <p className="text-[11px] text-[var(--dash-text-muted)] line-clamp-1">
              {desc}
            </p>
          </div>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemoveCategory}
            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            title="Remover esta categoria do pedido"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-medium">Remover categoria</span>
          </button>
        )}
      </div>

      {/* Lista de Inputs de Nomes */}
      <div className="space-y-2.5">
        {names.map((name, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-5 text-center text-xs font-bold text-[var(--dash-text-muted)] shrink-0">
              {index + 1}º
            </span>

            <div className="flex-1">
              <Input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Nome da pessoa por quem se oferece a intenção`}
                className="w-full text-xs sm:text-sm min-h-[44px]"
                required={index === 0}
              />
            </div>

            {names.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveName(index)}
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[var(--dash-text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                title="Excluir este nome"
                aria-label="Excluir este nome"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Botão de Adicionar Mais Nomes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        {names.length < MAX_NAMES_PER_CATEGORY ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddName}
            className="min-h-[44px] sm:min-h-[36px] w-full sm:w-auto text-xs font-semibold gap-1.5 border-dashed border-[var(--primary)]/40 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar outro nome ({names.length}/{MAX_NAMES_PER_CATEGORY})</span>
          </Button>
        ) : (
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Limite máximo de {MAX_NAMES_PER_CATEGORY} nomes atingido nesta categoria.
          </span>
        )}

        <span className="text-[10px] text-[var(--dash-text-muted)]">
          Máx. {MAX_NAMES_PER_CATEGORY} nomes por categoria
        </span>
      </div>
    </div>
  );
}
