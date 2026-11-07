'use client';

import React, { useState, useEffect } from 'react';
import { CathedralHeader } from '@/components/layout/CathedralHeader';
import { CathedralFooter } from '@/components/home/CathedralFooter';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { ParishionerAccessCard } from '@/components/meu-espaco/ParishionerAccessCard';
import { MyParishDashboard } from '@/components/meu-espaco/MyParishDashboard';
import { ParishionerSession } from '@/types/parishioner';
import { getStoredParishionerSession } from '@/lib/parishioner-auth';

export default function MeuEspacoPage() {
  const [session, setSession] = useState<ParishionerSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncSession = () => {
      const saved = getStoredParishionerSession();
      setSession(saved);
      setLoading(false);
    };

    syncSession();

    window.addEventListener('storage', syncSession);
    return () => window.removeEventListener('storage', syncSession);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0E1012] text-[#FAF6F0]">
      <CathedralHeader />
      <MarqueeAvisos />

      <main className="flex-1 py-10 sm:py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          {loading ? (
            <div className="py-20 text-center text-xs text-[#FAF6F0]/60">
              Carregando seu espaço paroquial...
            </div>
          ) : session ? (
            <MyParishDashboard session={session} onLogout={() => setSession(null)} />
          ) : (
            <ParishionerAccessCard onSuccess={(newSession) => setSession(newSession)} />
          )}
        </div>
      </main>

      <CathedralFooter />
    </div>
  );
}

