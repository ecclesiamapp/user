'use client';

import React, { useState, useMemo } from 'react';
import { Search, Shield, UserCheck, Edit3, Lock, Unlock, Eye, Sparkles, MapPin, Mail, Phone } from 'lucide-react';
import { UserProfile, UserRole, UserStatus, Community } from '@/types';
import { Button, Input, Card, Badge } from '@/components/ui';
import { UserRoleBadge, UserStatusBadge } from './UserRoleBadge';
import { useAdminCommunity } from '@/components/admin/context/AdminCommunityContext';

interface ActiveUsersTabProps {
  users: UserProfile[];
  communities: Community[];
  onEditUser: (user: UserProfile) => void;
  onToggleStatus: (user: UserProfile) => void;
}

export function ActiveUsersTab({
  users,
  communities,
  onEditUser,
  onToggleStatus,
}: ActiveUsersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { currentUser, switchUser } = useAdminCommunity();

  const communityMap = useMemo(() => {
    const map = new Map<string, string>();
    communities.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [communities]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Ignorar pendentes (vão para a aba de solicitações)
      if (u.status === 'pendente') return false;

      // Filtro de texto
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.community_id && communityMap.get(u.community_id)?.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro de cargo
      const matchesRole =
        roleFilter === 'all' ||
        (roleFilter === 'clero' && (u.role === 'paroco' || u.role === 'vigario')) ||
        (roleFilter === 'paroquia' && (u.role === 'secretaria' || u.role === 'pascom')) ||
        (roleFilter === 'ceb' && u.role === 'coordenador_ceb');

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter, communityMap]);

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--dash-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, e-mail ou comunidade..."
            className="pl-9 rounded-xl border-[var(--dash-border)] bg-[var(--dash-surface)] text-xs min-h-[40px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="dash-select text-xs font-medium rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          >
            <option value="all">Todos os Cargos</option>
            <option value="clero">👑 Clero (Pároco & Vigário)</option>
            <option value="paroquia">📋 Equipe Matriz (Secretaria & PASCOM)</option>
            <option value="ceb">⛪ Coordenadores de CEB</option>
          </select>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredUsers.map((user) => {
          const isCurrentUser = currentUser?.id === user.id;
          const commName = user.community_id ? communityMap.get(user.community_id) : 'Matriz Catedral';

          return (
            <Card
              key={user.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isCurrentUser
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-md shadow-[var(--primary)]/5 ring-1 ring-[var(--primary)]/30'
                  : 'border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--dash-border-hover)]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex items-center justify-center font-bold text-sm text-[var(--primary)] shrink-0">
                    {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <h4 className="text-sm font-bold text-[var(--dash-text-primary)] truncate">
                        {user.name}
                      </h4>
                      {isCurrentUser && (
                        <Badge className="bg-[var(--primary)] text-white text-[9px] font-bold px-1.5 py-0">
                          Você (Ativo)
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <UserRoleBadge role={user.role} />
                      <UserStatusBadge status={user.status} />
                    </div>

                    <div className="space-y-1 text-xs text-[var(--dash-text-muted)]">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user.community_id && (
                        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{commName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditUser(user)}
                    className="h-8 px-2.5 rounded-lg text-xs font-semibold border-[var(--dash-border)] hover:bg-[var(--dash-surface-secondary)] flex items-center gap-1"
                    title="Editar dados e permissões"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => switchUser(user.id)}
                    className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                      isCurrentUser
                        ? 'text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20'
                        : 'text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)]'
                    }`}
                    title="Simular visualização deste usuário para testar RBAC"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isCurrentUser ? 'Simulando' : 'Simular'}</span>
                  </Button>
                </div>
              </div>

              {/* Módulos Permitidos para CEB */}
              {user.role === 'coordenador_ceb' && user.allowed_modules && (
                <div className="mt-3 pt-3 border-t border-[var(--dash-border)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--dash-text-muted)] block mb-1.5">
                    Módulos Autorizados na Capela:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {user.allowed_modules.map((mod: any) => (
                      <span
                        key={mod}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] border border-[var(--dash-border)] font-medium"
                      >
                        {mod === 'lp_geral' ? 'Landing Page' :
                         mod === 'cpc' ? 'CPC' :
                         mod === 'avisos' ? 'Avisos' :
                         mod === 'pastorais' ? 'Pastorais' :
                         mod === 'horarios' ? 'Horários' :
                         mod === 'dizimo' ? 'Dízimo' :
                         mod === 'galerias' ? 'Galerias' : mod}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="col-span-full p-8 text-center rounded-2xl border border-dashed border-[var(--dash-border)] text-xs text-[var(--dash-text-muted)]">
            Nenhum colaborador encontrado com os filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
}
