import React from 'react';
import { Users, Shield, Phone, Sparkles } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { CommunityLeader } from '@/types';

interface CommunityCPCSectionProps {
  communityName: string;
  leaders?: CommunityLeader[];
}

export function CommunityCPCSection({ communityName, leaders = [] }: CommunityCPCSectionProps) {
  if (!leaders || leaders.length === 0) {
    return (
      <Card className="space-y-4 border border-[var(--dash-border)] bg-[var(--dash-surface)]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--dash-text-primary)]">Conselho Pastoral Comunitário (CPC)</h2>
            <p className="text-xs text-[var(--dash-text-secondary)]">Liderança pastoral e comunhão paroquial</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-xs text-[var(--dash-text-secondary)] leading-relaxed">
          <p>
            O Conselho Pastoral Comunitário (CPC) da <strong>{communityName}</strong> articula as pastorais, serviços e equipes litúrgicas em profunda comunhão com os padres da Catedral.
          </p>
          <p className="mt-2 text-[11px] text-[var(--dash-text-muted)]">
            Para entrar em contato com a coordenação, procure a secretaria da Catedral ou os ministros locais após as celebrações.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-5 border border-[var(--dash-border)] bg-[var(--dash-surface)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--dash-border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#8B1E22]/30 to-amber-500/20 border border-[#C8A463]/30 text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--dash-text-primary)]">Conselho Pastoral Comunitário (CPC)</h2>
              <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-[10px] uppercase font-bold tracking-wider">
                Liderança Local
              </Badge>
            </div>
            <p className="text-xs text-[var(--dash-text-secondary)]">
              Corresponsabilidade e serviço eclesial na {communityName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {leaders.map((leader, index) => (
          <div
            key={leader.id || index}
            className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-[#8B1E22]/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 font-bold text-xs uppercase shadow-xs">
                {leader.name
                  .split(' ')
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs font-bold text-[var(--dash-text-primary)] truncate">
                  {leader.name}
                </p>
                <p className="text-[11px] font-medium text-amber-500 dark:text-amber-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 shrink-0" />
                  <span className="truncate">{leader.role}</span>
                </p>
              </div>
            </div>

            {leader.phone && (
              <a
                href={`https://wa.me/55${leader.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[var(--dash-surface)] hover:bg-emerald-500/10 border border-[var(--dash-border)] hover:border-emerald-500/40 text-[11px] text-[var(--dash-text-secondary)] hover:text-emerald-400 transition-colors min-h-[36px]"
              >
                <Phone className="w-3 h-3 text-emerald-500" />
                <span>Contato Pastoral</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
