'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Users, Lock } from 'lucide-react';
import { useAdminCommunity } from '@/components/admin/context/AdminCommunityContext';
import { UserRole } from '@/types';
import { Button, Card, Badge } from '@/components/ui';

interface AdminRoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  moduleName?: string;
}

const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: 'Superadmin (SaaS)',
  paroco: 'Pároco',
  vigario: 'Vigário Paroquial',
  secretaria: 'Secretaria Paroquial',
  pascom: 'PASCOM Catedral',
  coordenador_ceb: 'Coordenador de CEB',
};

export function AdminRoleGuard({
  children,
  allowedRoles,
  moduleName = 'este módulo',
}: AdminRoleGuardProps) {
  const { currentUser, loading, switchUser, allUsers } = useAdminCommunity();

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-[var(--dash-text-muted)] animate-pulse">
        Carregando credenciais canônicas...
      </div>
    );
  }

  const isAllowed = currentUser && allowedRoles.includes(currentUser.role);

  if (!isAllowed) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
        <Card className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-[var(--dash-surface)] shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold uppercase">
                Acesso Restrito por RBAC
              </Badge>
            </div>
            <h3 className="text-xl font-black text-[var(--dash-text-primary)] tracking-tight">
              Permissão Insuficiente
            </h3>
            <p className="text-xs sm:text-sm text-[var(--dash-text-muted)] max-w-md mx-auto leading-relaxed">
              O seu perfil atual (<strong>{currentUser ? ROLE_LABELS[currentUser.role] : 'Não identificado'}</strong>) não possui autorização canônica para acessar {moduleName}.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-xs text-[var(--dash-text-muted)] max-w-md mx-auto">
            <span className="font-semibold text-[var(--dash-text-primary)] block mb-1">
              Perfis com permissão autorizada:
            </span>
            <div className="flex flex-wrap justify-center gap-1.5 mt-1">
              {allowedRoles.map((r) => (
                <span
                  key={r}
                  className="px-2 py-0.5 rounded-md bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[11px] font-semibold text-[var(--dash-text-primary)]"
                >
                  {ROLE_LABELS[r]}
                </span>
              ))}
            </div>
          </div>

          {/* Simulador de troca rápida para testes */}
          {allUsers.length > 0 && (
            <div className="pt-2 border-t border-[var(--dash-border)]">
              <span className="text-[11px] text-[var(--dash-text-muted)] block mb-2">
                Simulador RBAC (Ambiente de Desenvolvimento):
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {allUsers
                  .filter((u) => allowedRoles.includes(u.role))
                  .slice(0, 3)
                  .map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => switchUser(u.id)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-all border border-[var(--primary)]/20 cursor-pointer"
                    >
                      Simular como {u.name.split(' ')[0]} ({ROLE_LABELS[u.role]})
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link href="/admin">
              <Button
                variant="outline"
                className="rounded-xl text-xs font-semibold min-h-[42px] px-5 flex items-center justify-center gap-1.5 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Painel Geral</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
