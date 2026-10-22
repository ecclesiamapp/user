'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { LiturgicalColor } from '@/lib/liturgy';

export interface LiturgicalStatus {
  tempoLiturgico: string;
  corLiturgica: LiturgicalColor;
  celebracaoTitulo: string;
  dataExtensa: string;
}

interface AdminAppearanceContextType {
  liturgicalColoringEnabled: boolean;
  setLiturgicalColoringEnabled: (enabled: boolean) => void;
  liturgy: LiturgicalStatus;
  canonicalLiturgy: LiturgicalStatus;
  loadingLiturgy: boolean;
  isSimulating: boolean;
  previewColor: (color: LiturgicalColor, tempo?: string, celebracao?: string) => void;
  resetToCanonical: () => void;
  fallbackModalOpen: boolean;
  setFallbackModalOpen: (open: boolean) => void;
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
  canonicalLiturgy: DEFAULT_LITURGY,
  loadingLiturgy: false,
  isSimulating: false,
  previewColor: () => {},
  resetToCanonical: () => {},
  fallbackModalOpen: false,
  setFallbackModalOpen: () => {},
});

export function AdminAppearanceProvider({ children }: { children: React.ReactNode }) {
  const [liturgicalColoringEnabled, setLiturgicalColoringState] = useState<boolean>(true);
  const [canonicalLiturgy, setCanonicalLiturgy] = useState<LiturgicalStatus>(DEFAULT_LITURGY);
  const [activeLiturgy, setActiveLiturgy] = useState<LiturgicalStatus>(DEFAULT_LITURGY);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [loadingLiturgy, setLoadingLiturgy] = useState<boolean>(true);
  const [fallbackModalOpen, setFallbackModalOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);
  const isSimulatingRef = useRef<boolean>(false);
  isSimulatingRef.current = isSimulating;

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

          const canonicalObj: LiturgicalStatus = {
            tempoLiturgico: parsedTempo,
            corLiturgica: parsedColor,
            celebracaoTitulo: data.celebrationTitle || 'Liturgia Diária Oficial',
            dataExtensa: data.data || 'Hoje',
          };

          setCanonicalLiturgy(canonicalObj);
          if (!isSimulatingRef.current) {
            setActiveLiturgy(canonicalObj);
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar dados litúrgicos:', err);
      } finally {
        setLoadingLiturgy(false);
      }
    }

    fetchLiturgy();
  }, []);

  // 3. Monitor de Navegação: Fallback Automático ao Sair da Página /admin/aparencia
  useEffect(() => {
    if (prevPathnameRef.current === '/admin/aparencia' && pathname !== '/admin/aparencia') {
      if (isSimulatingRef.current) {
        // Reverte automaticamente para a liturgia oficial de hoje
        setIsSimulating(false);
        setActiveLiturgy(canonicalLiturgy);
        setFallbackModalOpen(true);
      }
    }
    prevPathnameRef.current = pathname;
  }, [pathname, canonicalLiturgy]);

  // 4. Limpeza de simulação ao descarregar a página (F5 ou fechar aba)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isSimulatingRef.current) {
        setIsSimulating(false);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const setLiturgicalColoringEnabled = (enabled: boolean) => {
    setLiturgicalColoringState(enabled);
    try {
      localStorage.setItem('ecclesiam_liturgical_coloring', String(enabled));
    } catch (e) {
      console.warn('Erro ao salvar preferência:', e);
    }
  };

  /**
   * Ativa a simulação de uma cor litúrgica específica
   */
  const previewColor = (
    color: LiturgicalColor, 
    tempo: string = 'Simulação Litúrgica', 
    celebracao: string = 'Modo de Demonstração Visual'
  ) => {
    setIsSimulating(true);
    setActiveLiturgy({
      tempoLiturgico: tempo,
      corLiturgica: color,
      celebracaoTitulo: celebracao,
      dataExtensa: 'Visualização Temporária',
    });
  };

  /**
   * Restaura o tema para a liturgia canônica de hoje
   */
  const resetToCanonical = () => {
    setIsSimulating(false);
    setActiveLiturgy(canonicalLiturgy);
  };

  return (
    <AdminAppearanceContext.Provider
      value={{
        liturgicalColoringEnabled,
        setLiturgicalColoringEnabled,
        liturgy: activeLiturgy,
        canonicalLiturgy,
        loadingLiturgy,
        isSimulating,
        previewColor,
        resetToCanonical,
        fallbackModalOpen,
        setFallbackModalOpen,
      }}
    >
      {children}
    </AdminAppearanceContext.Provider>
  );
}

export function useAdminAppearance() {
  return useContext(AdminAppearanceContext);
}
