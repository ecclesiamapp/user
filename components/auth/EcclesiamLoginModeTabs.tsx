'use client';

import React from 'react';
import { Lock, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export type AuthMode = 'password' | 'magic' | 'reset';

interface EcclesiamLoginModeTabsProps {
  mode: AuthMode;
  onSelectMode: (mode: AuthMode) => void;
  errorMsg: string | null;
  successMsg: string | null;
}

export function EcclesiamLoginModeTabs({
  mode,
  onSelectMode,
  errorMsg,
  successMsg,
}: EcclesiamLoginModeTabsProps) {
  return (
    <>
      {mode !== 'reset' && (
        <div
          className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl border"
          style={{
            backgroundColor: '#F5EFE7',
            borderColor: '#E8DFD3',
          }}
        >
          {[
            { key: 'password' as AuthMode, label: 'Com Senha', icon: Lock },
            { key: 'magic' as AuthMode, label: 'Link no E-mail', icon: KeyRound },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = mode === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectMode(tab.key)}
                className="py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer"
                style={
                  active
                    ? {
                        backgroundColor: '#8B1E22',
                        color: '#FCF7F1',
                        boxShadow: '0 4px 12px -2px rgba(139, 30, 34, 0.28)',
                      }
                    : { color: '#514D4B' }
                }
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: active ? '#FFCC36' : '#86898C' }}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {errorMsg && (
        <div
          className="p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs leading-relaxed font-medium"
          style={{
            backgroundColor: 'rgba(139, 30, 34, 0.08)',
            borderColor: 'rgba(139, 30, 34, 0.28)',
            color: '#8B1E22',
          }}
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div
          className="p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs leading-relaxed font-medium"
          style={{
            backgroundColor: 'rgba(53, 107, 88, 0.1)',
            borderColor: 'rgba(53, 107, 88, 0.3)',
            color: '#285445',
          }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}
    </>
  );
}
