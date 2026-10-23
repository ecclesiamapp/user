import React from 'react';
import { Church, Calendar, Clock, BookOpen, HeartHandshake } from 'lucide-react';
import { Card } from '@/components/ui';
import { CommunityPastoralGroup } from '@/types';

interface CommunityPastoralGroupsSectionProps {
  communityName: string;
  groups?: CommunityPastoralGroup[];
}

export function CommunityPastoralGroupsSection({
  communityName,
  groups = [],
}: CommunityPastoralGroupsSectionProps) {
  if (!groups || groups.length === 0) {
    return null;
  }

  return (
    <Card className="space-y-4 border border-[var(--dash-border)] bg-[var(--dash-surface)]">
      <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--dash-border)]">
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-base text-[var(--dash-text-primary)]">Grupos & Pastorais da Comunidade</h3>
          <p className="text-[11px] text-[var(--dash-text-secondary)]">Momentos de oração, estudo bíblico e missão</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {groups.map((group, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] hover:border-purple-500/30 transition-all space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-[var(--dash-text-primary)]">
                {group.name}
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-medium">
                <Clock className="w-3 h-3" />
                <span>{group.meeting_day_and_time}</span>
              </span>
            </div>

            {group.description && (
              <p className="text-[11px] text-[var(--dash-text-secondary)] leading-relaxed">
                {group.description}
              </p>
            )}

            {group.coordinator_name && (
              <p className="text-[10px] text-[var(--dash-text-muted)] pt-1">
                Coordenação: <span className="font-semibold text-[var(--dash-text-secondary)]">{group.coordinator_name}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
