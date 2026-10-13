'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminTopBar } from '@/components/admin/layout/AdminTopBar';
import { AdminAppearanceProvider } from '@/components/admin/context/AdminAppearanceContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <AdminAppearanceProvider>
      <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex">
        {/* 1. Sidebar Fixa Permanente (Desktop: sticky h-screen; Mobile: Drawer deslizante) */}
        <AdminSidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* 2. Área de Conteúdo com Top Bar Fixa de Apoio */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopBar onOpenMobileMenu={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminAppearanceProvider>
  );
}
