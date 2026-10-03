'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já dispensou nos últimos 7 dias
    const dismissedAt = localStorage.getItem('catedral_pwa_dismissed');
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    // Verificar se já está rodando em modo standalone (PWA instalado)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // No iOS, se não for standalone, exibir sugestão após 3 segundos
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('catedral_pwa_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 rounded-2xl bg-[var(--dash-surface)] border border-amber-500/40 shadow-2xl backdrop-blur-md space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-800 to-red-950 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
                Atalho da Catedral no Celular
              </h4>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Acesse horários, avisos e missas direto da sua tela inicial
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Dispensar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {showIOSInstructions ? (
          <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-xs text-[var(--dash-text-secondary)] space-y-1.5 animate-in fade-in">
            <p className="font-bold text-[var(--dash-text-primary)]">Como instalar no iPhone:</p>
            <p className="flex items-center gap-1.5">
              1. Toque no ícone de <Share2 className="w-3.5 h-3.5 text-blue-400 inline" /> Compartilhar no Safari.
            </p>
            <p className="flex items-center gap-1.5">
              2. Escolha <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" /> "Adicionar à Tela de Início".
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="text-xs flex-1"
            >
              Agora Não
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleInstallClick}
              className="text-xs flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-amber-500"
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Instalar Atalho
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
