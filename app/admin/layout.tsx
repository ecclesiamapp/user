'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminTopBar } from '@/components/admin/layout/AdminTopBar';
import { AdminAppearanceProvider } from '@/components/admin/context/AdminAppearanceContext';
import { AdminCommunityProvider } from '@/components/admin/context/AdminCommunityContext';
import { AdminCommunityContextBanner } from '@/components/admin/layout/AdminCommunityContextBanner';
import { AdminSimulationBanner } from '@/components/admin/layout/AdminSimulationBanner';
import { AdminAiFloatingDrawer } from '@/components/admin/ai/AdminAiFloatingDrawer';
import { GlobalLiturgicalFallbackModal } from '@/components/admin/aparencia/GlobalLiturgicalFallbackModal';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <AdminAppearanceProvider>
      <AdminCommunityProvider>
        <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex relative">
          {/* 1. Sidebar Fixa Permanente (Desktop: sticky h-screen; Mobile: Drawer deslizante) */}
          <AdminSidebar
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
          />

          {/* 2. Área de Conteúdo com Top Bar Fixa de Apoio */}
          <div className="flex-1 flex flex-col min-w-0">
            <AdminSimulationBanner />
            <AdminTopBar onOpenMobileMenu={() => setMobileOpen(true)} />
            <AdminCommunityContextBanner />
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
              {children}
            </main>
          </div>

          {/* 3. Copilot da Secretaria: Drawer Flutuante Global */}
          <AdminAiFloatingDrawer />

          {/* 4. Salvaguarda Canônica: Modal Global de Fallback Litúrgico */}
          <GlobalLiturgicalFallbackModal />
        </div>
      </AdminCommunityProvider>
    </AdminAppearanceProvider>
  );
}

