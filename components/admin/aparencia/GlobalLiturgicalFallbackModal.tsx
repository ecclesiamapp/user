'use client';

import React from 'react';
import { useAdminAppearance } from '@/components/admin/context/AdminAppearanceContext';
import { LiturgicalFallbackModal } from './LiturgicalFallbackModal';

export function GlobalLiturgicalFallbackModal() {
  const {
    fallbackModalOpen,
    setFallbackModalOpen,
    canonicalLiturgy,
  } = useAdminAppearance();

  return (
    <LiturgicalFallbackModal
      isOpen={fallbackModalOpen}
      onClose={() => setFallbackModalOpen(false)}
      canonicalTempo={canonicalLiturgy.tempoLiturgico}
      canonicalColor={canonicalLiturgy.corLiturgica}
      canonicalCelebration={canonicalLiturgy.celebracaoTitulo}
    />
  );
}
