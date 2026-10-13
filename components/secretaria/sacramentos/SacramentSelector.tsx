'use client';

import React from 'react';
import { SacramentType } from '@/types';
import { SACRAMENTS_CONFIG } from './types';
import { Card, Badge } from '@/components/ui';
import { Check } from 'lucide-react';

interface SacramentSelectorProps {
  selectedType: SacramentType;
  onSelect: (type: SacramentType) => void;
}

export function SacramentSelector({
  selectedType,
  onSelect,
}: SacramentSelectorProps) {
  const options = Object.values(SACRAMENTS_CONFIG);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
          Selecione o Sacramento ou Curso
        </label>
        <span className="text-[11px] text-[var(--primary)] font-semibold">
          {options.length} opções disponíveis
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((item) => {
          const isSelected = selectedType === item.type;
          const Icon = item.icon;

          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onSelect(item.type)}
              className="text-left w-full focus:outline-hidden group"
            >
              <Card
                className={`p-4 h-full flex flex-col justify-between rounded-2xl transition-all duration-200 border cursor-pointer min-h-[110px] ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-md ring-1 ring-[var(--primary)]'
                    : 'border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--dash-border-hover)] hover:bg-[var(--dash-surface-hover)]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${item.accentColor}18`,
                        color: item.accentColor,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] border border-[var(--dash-border)]">
                        {item.badge}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3
                      className={`text-sm font-bold transition-colors ${
                        isSelected
                          ? 'text-[var(--primary)]'
                          : 'text-[var(--dash-text-primary)] group-hover:text-[var(--primary)]'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--dash-text-secondary)] line-clamp-2 mt-0.5 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
