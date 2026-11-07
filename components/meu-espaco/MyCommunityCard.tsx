'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Church, MapPin, Calendar, ExternalLink, Navigation, Check } from 'lucide-react';
import { fallbackCommunities } from '@/lib/communities';
import { updateFavoriteCommunity } from '@/lib/parishioner-auth';

interface MyCommunityCardProps {
  currentCommunityId?: string | null;
  onCommunityChange?: (communityId: string, communityName: string) => void;
}

export function MyCommunityCard({
  currentCommunityId = 'c0000000-0000-0000-0000-000000000001',
  onCommunityChange,
}: MyCommunityCardProps) {
  const [selectedId, setSelectedId] = useState(
    currentCommunityId || 'c0000000-0000-0000-0000-000000000001'
  );
  const [savedFeedback, setSavedFeedback] = useState(false);

  const communitiesList = Object.values(fallbackCommunities);
  const activeCommunity =
    communitiesList.find((c) => c.id === selectedId) || communitiesList[0];

  const handleSelectChange = (newId: string) => {
    setSelectedId(newId);
    const comm = communitiesList.find((c) => c.id === newId);
    if (comm) {
      updateFavoriteCommunity(comm.id, comm.name);
      onCommunityChange?.(comm.id, comm.name);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2500);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#1B1E22] border border-[#C8A463]/25 shadow-xl space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C8A463]/20 border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shrink-0">
              <Church className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] block">
                Comunidade de Pertença
              </span>
              <h3 className="text-base font-serif font-bold text-[#FAF6F0]">
                Minha Comunidade (CEB)
              </h3>
            </div>
          </div>

          {savedFeedback && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <Check className="w-3 h-3" />
              Salvo
            </span>
          )}
        </div>

        {/* Community Selector */}
        <div>
          <label className="block text-[11px] text-[#FAF6F0]/70 mb-1">
            Escolha sua comunidade habitual entre as 14 CEBs da Catedral:
          </label>
          <select
            value={selectedId}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="dash-select w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] pl-3.5 pr-10 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[40px]"
          >
            {communitiesList.map((comm) => (
              <option key={comm.id} value={comm.id}>
                {comm.name} ({comm.neighborhood})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Community Info */}
        <div className="p-3.5 rounded-2xl bg-[#16181B] border border-[#C8A463]/15 space-y-2 text-xs">
          <div className="flex items-start gap-2 text-[#FAF6F0]/90">
            <MapPin className="w-3.5 h-3.5 text-[#C8A463] shrink-0 mt-0.5" />
            <span>
              {activeCommunity.address || 'Praça Frei José, 26'}, {activeCommunity.neighborhood}
            </span>
          </div>

          {activeCommunity.patron_saint && (
            <p className="text-[11px] text-[#FFCC36] pl-5">
              Padroeiro(a): {activeCommunity.patron_saint}
            </p>
          )}
        </div>
      </div>

      {/* Action Links */}
      <div className="pt-2 border-t border-[#C8A463]/15 flex items-center justify-between gap-2">
        <Link
          href={`/comunidades/${activeCommunity.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#FFCC36] hover:underline font-bold"
        >
          <span>Ver Horários & Avisos da CEB</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {activeCommunity.latitude && activeCommunity.longitude && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${activeCommunity.latitude},${activeCommunity.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-[#FAF6F0]/70 hover:text-[#FAF6F0]"
          >
            <Navigation className="w-3 h-3 text-[#C8A463]" />
            <span>Como Chegar</span>
          </a>
        )}
      </div>
    </div>
  );
}

