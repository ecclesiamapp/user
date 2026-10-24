'use client';

import React, { useMemo } from 'react';
import { Clock, CheckCircle2, XCircle, Mail, Phone, MapPin, UserCheck } from 'lucide-react';
import { UserProfile, Community } from '@/types';
import { Button, Card, Badge } from '@/components/ui';
import { UserRoleBadge } from './UserRoleBadge';

interface PendingRequestsTabProps {
  users: UserProfile[];
  communities: Community[];
  onApprove: (user: UserProfile) => void;
  onReject: (user: UserProfile) => void;
}

export function PendingRequestsTab({
  users,
  communities,
  onApprove,
  onReject,
}: PendingRequestsTabProps) {
  const pendingUsers = useMemo(() => {
    return users.filter((u) => u.status === 'pendente');
  }, [users]);

  const communityMap = useMemo(() => {
    const map = new Map<string, string>();
    communities.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [communities]);

  if (pendingUsers.length === 0) {
    return (
      <Card className="p-8 text-center rounded-2xl border border-dashed border-[var(--dash-border)] bg-[var(--dash-surface)]">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-[var(--dash-text-primary)]">
          Nenhuma solicitação pendente no momento
        </h4>
        <p className="text-xs text-[var(--dash-text-muted)] mt-1 max-w-sm mx-auto">
          Todas as solicitações de lideranças e coordenadores de CEB foram avaliadas pela secretaria paroquial.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
        <Clock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          Existem <strong>{pendingUsers.length}</strong> solicitação(ões) de lideranças comunitárias aguardando aprovação da Paróquia.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {pendingUsers.map((user) => {
          const commName = user.community_id ? communityMap.get(user.community_id) : 'Não vinculada';

          return (
            <Card
              key={user.id}
              className="p-5 rounded-2xl border border-amber-500/30 bg-[var(--dash-surface)] shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--dash-text-primary)]">
                      {user.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <UserRoleBadge role={user.role} />
                      <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30">
                        Aguardando Avaliação
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[var(--dash-text-muted)] bg-[var(--dash-surface-secondary)]/50 p-3 rounded-xl border border-[var(--dash-border)]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-[var(--dash-text-muted)]" />
                  <span className="text-[var(--dash-text-primary)] font-medium">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-[var(--dash-text-muted)]" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.community_id && (
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>Comunidade Solicitada: {commName}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--dash-border)]">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReject(user)}
                  className="rounded-xl text-xs font-semibold h-9 px-3 text-rose-600 border-rose-500/30 hover:bg-rose-500/10 flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Recusar</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => onApprove(user)}
                  className="rounded-xl text-xs font-semibold h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Aprovar & Liberar Acesso</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
