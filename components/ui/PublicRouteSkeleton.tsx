import React from 'react';

export interface PublicRouteSkeletonProps {
  variant?: 'list' | 'detail' | 'calendar';
}

/**
 * [TASK-58] Skeleton leve e modular para navegação SSR nas rotas públicas (3G/4G).
 */
export function PublicRouteSkeleton({ variant = 'list' }: PublicRouteSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando conteúdo paroquial"
      className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col"
    >
      {/* Topo Header Placeholder */}
      <div className="h-20 w-full border-b border-[var(--dash-border)] bg-[var(--dash-surface)]/80 px-4 sm:px-6 flex items-center justify-between">
        <div className="max-w-[1240px] w-full mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--dash-surface-secondary)] animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-36 rounded-lg bg-[var(--dash-surface-secondary)] animate-pulse" />
              <div className="h-2.5 w-24 rounded-lg bg-[var(--dash-surface-secondary)] animate-pulse" />
            </div>
          </div>
          <div className="h-9 w-24 rounded-xl bg-[var(--dash-surface-secondary)] animate-pulse" />
        </div>
      </div>

      {/* Hero Banner Placeholder */}
      <div className="w-full py-12 sm:py-16 px-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/50">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3 text-center">
          <div className="h-5 w-44 rounded-full bg-[var(--dash-surface)] animate-pulse" />
          <div className="h-9 w-72 sm:w-96 rounded-2xl bg-[var(--dash-surface)] animate-pulse" />
          <div className="h-4 w-64 sm:w-80 rounded-xl bg-[var(--dash-surface)] animate-pulse" />
        </div>
      </div>

      {/* Corpo Principal */}
      <main className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-10 space-y-8 flex-1">
        {variant === 'detail' ? (
          <div className="space-y-6">
            <div className="h-64 sm:h-80 w-full rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="h-44 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] p-5 space-y-3 animate-pulse"
                >
                  <div className="h-5 w-32 rounded-lg bg-[var(--dash-surface-secondary)]" />
                  <div className="h-3.5 w-full rounded-lg bg-[var(--dash-surface-secondary)]" />
                  <div className="h-3.5 w-2/3 rounded-lg bg-[var(--dash-surface-secondary)]" />
                </div>
              ))}
            </div>
          </div>
        ) : variant === 'calendar' ? (
          <div className="space-y-6">
            <div className="h-14 w-full rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 h-72 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] animate-pulse" />
              <div className="lg:col-span-7 h-72 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="h-60 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] p-5 space-y-4 animate-pulse"
              >
                <div className="h-28 w-full rounded-xl bg-[var(--dash-surface-secondary)]" />
                <div className="h-4 w-3/4 rounded-lg bg-[var(--dash-surface-secondary)]" />
                <div className="h-3 w-1/2 rounded-lg bg-[var(--dash-surface-secondary)]" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
