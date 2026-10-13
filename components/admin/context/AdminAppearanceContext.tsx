'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LiturgicalColor } from '@/lib/liturgy';

interface LiturgicalStatus {
  tempoLiturgico: string;
  corLiturgica: LiturgicalColor;
  celebracaoTitulo: string;
  dataExtensa: string;
}

interface AdminAppearanceContextType {
  liturgicalColoringEnabled: boolean;
  setLiturgicalColoringEnabled: (enabled: boolean) => void;
  liturgy: LiturgicalStatus;
  loadingLiturgy: boolean;
}

const DEFAULT_LITURGY: LiturgicalStatus = {
  tempoLiturgico: 'Tempo Comum',
  corLiturgica: 'verde',
  celebracaoTitulo: '28ª Semana do Tempo Comum',
  dataExtensa: 'Tempo Comum da Igreja Católica',
};

const AdminAppearanceContext = createContext<AdminAppearanceContextType>({
  liturgicalColoringEnabled: true,
  setLiturgicalColoringEnabled: () => {},
  liturgy: DEFAULT_LITURGY,
  loadingLiturgy: false,
});

export function AdminAppearanceProvider({ children }: { children: React.ReactNode }) {
  const [liturgicalColoringEnabled, setLiturgicalColoringState] = useState<boolean>(true);
  const [liturgy, setLiturgy] = useState<LiturgicalStatus>(DEFAULT_LITURGY);
  const [loadingLiturgy, setLoadingLiturgy] = useState<boolean>(true);

  // 1. Carregar preferência salva no LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ecclesiam_liturgical_coloring');
      if (saved !== null) {
        setLiturgicalColoringState(saved === 'true');
      }
    } catch (e) {
      console.warn('Erro ao ler preferência de aparência:', e);
    }
  }, []);

  // 2. Carregar liturgia do dia via /api/liturgia
  useEffect(() => {
    async function fetchLiturgy() {
      try {
        setLoadingLiturgy(true);
        const res = await fetch('/api/liturgia');
        if (res.ok) {
          const data = await res.json();
          const colorRaw = (data.colorName || 'verde').toLowerCase();
          
          let parsedColor: LiturgicalColor = 'verde';
          if (colorRaw.includes('verm') || colorRaw.includes('red')) parsedColor = 'vermelho';
          else if (colorRaw.includes('rox') || colorRaw.includes('purple')) parsedColor = 'roxo';
          else if (colorRaw.includes('bran') || colorRaw.includes('dour') || colorRaw.includes('white')) parsedColor = 'branco';
          else if (colorRaw.includes('ros') || colorRaw.includes('pink')) parsedColor = 'rosa';

          let parsedTempo = 'Tempo Comum';
          const titleLower = (data.celebrationTitle || '').toLowerCase();
          if (titleLower.includes('advento')) parsedTempo = 'Tempo do Advento';
          else if (titleLower.includes('quaresma')) parsedTempo = 'Tempo da Quaresma';
          else if (titleLower.includes('páscoa') || titleLower.includes('pascal')) parsedTempo = 'Tempo Pascal';
          else if (titleLower.includes('natal')) parsedTempo = 'Tempo do Natal';
          else if (titleLower.includes('comum')) parsedTempo = 'Tempo Comum';

          setLiturgy({
            tempoLiturgico: parsedTempo,
            corLiturgica: parsedColor,
            celebracaoTitulo: data.celebrationTitle || 'Liturgia Diária Oficial',
            dataExtensa: data.data || 'Hoje',
          });
        }
      } catch (err) {
        console.warn('Erro ao carregar dados litúrgicos para o sticker:', err);
      } finally {
        setLoadingLiturgy(false);
      }
    }

    fetchLiturgy();
  }, []);

  const setLiturgicalColoringEnabled = (enabled: boolean) => {
    setLiturgicalColoringState(enabled);
    try {
      localStorage.setItem('ecclesiam_liturgical_coloring', String(enabled));
    } catch (e) {
      console.warn('Erro ao salvar preferência:', e);
    }
  };

  return (
    <AdminAppearanceContext.Provider
      value={{
        liturgicalColoringEnabled,
        setLiturgicalColoringEnabled,
        liturgy,
        loadingLiturgy,
      }}
    >
      {children}
    </AdminAppearanceContext.Provider>
  );
}

export function useAdminAppearance() {
  return useContext(AdminAppearanceContext);
}
