'use client';

import React, { useState } from 'react';
import { CathedralHeader } from '@/components/layout/CathedralHeader';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { CathedralLiveBroadcastSection } from '@/components/home/CathedralLiveBroadcastSection';

interface CathedralHeroPortalProps {
  parishName?: string;
  dioceseName?: string;
  whatsappNumber?: string;
}

export function CathedralHeroPortal({
  parishName = 'Catedral do Sagrado Coração de Jesus',
  dioceseName = 'Diocese de Colatina',
  whatsappNumber = '552737221234',
}: CathedralHeroPortalProps) {
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);

  return (
    <>
      {/* 1. Header Translúcido St. Patrick's com Gatilho Conectado */}
      <CathedralHeader
        parishName={parishName}
        dioceseName={dioceseName}
        whatsappNumber={whatsappNumber}
        onOpenLiveVideo={() => setIsLiveModalOpen(true)}
      />

      {/* 2. Hero Monumental com Vídeo Ambiente e Floating Schedule Card */}
      <HomeHeroSection
        parishName={parishName}
        dioceseName={dioceseName}
        isLiveModalOpen={isLiveModalOpen}
        setIsLiveModalOpen={setIsLiveModalOpen}
      />

      {/* 3. Seção em Destaque da Transmissão Oficial de St. Patrick's Cathedral NYC */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 w-full">
        <CathedralLiveBroadcastSection
          onOpenTheaterModal={() => setIsLiveModalOpen(true)}
        />
      </div>
    </>
  );
}

