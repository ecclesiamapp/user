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
          style={{ backgroundColor: '#090D16', borderColor: 'rgba(148, 163, 184, 0.14)' }}
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
                className="py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer"
                style={
                  active
                    ? {
                        backgroundColor: '#1E293B',
                        color: '#E5C158',
                        border: '1px solid rgba(200, 164, 99, 0.35)',
                      }
                    : { color: '#94A3B8' }
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {errorMsg && (
        <div
          className="p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs leading-relaxed"
          style={{
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            borderColor: 'rgba(244, 63, 94, 0.35)',
            color: '#FDA4AF',
          }}
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div
          className="p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs leading-relaxed"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            borderColor: 'rgba(16, 185, 129, 0.35)',
            color: '#6EE7B7',
          }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}
    </>
  );
}

