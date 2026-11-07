'use client';

import React, { useState } from 'react';
import { ParishMovement, ParishMovementEvent } from '@/types/movements';
import { MovementHero } from './MovementHero';
import { MovementCarismaSection } from './MovementCarismaSection';
import { MovementDirectorSection } from './MovementDirectorSection';
import { MovementEventsSection } from './MovementEventsSection';
import { MovementRegistrationModal } from './MovementRegistrationModal';

interface MovementDetailViewProps {
  movement: ParishMovement;
  events: ParishMovementEvent[];
}

export function MovementDetailView({ movement, events }: MovementDetailViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleOpenModal = (eventId?: string) => {
    setSelectedEventId(eventId || null);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0E1012] text-[#FAF6F0]">
      {/* 1. Hero */}
      <MovementHero movement={movement} onOpenModal={() => handleOpenModal()} />

      {/* 2. Carisma & Espiritualidade */}
      <MovementCarismaSection movement={movement} />

      {/* 3. Diretoria & Assistência */}
      <MovementDirectorSection movement={movement} />

      {/* 4. Cronograma & Próximas Etapas */}
      <MovementEventsSection
        movement={movement}
        events={events}
        onSelectEventToRegister={(evId) => handleOpenModal(evId)}
      />

      {/* 5. Modal de Ficha Digital */}
      <MovementRegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        movement={movement}
        events={events}
        selectedEventId={selectedEventId}
      />
    </div>
  );
}

