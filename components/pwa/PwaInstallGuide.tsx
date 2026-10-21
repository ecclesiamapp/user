'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Download, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Laptop,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui';
import { PwaBenefitGrid } from './PwaBenefitGrid';
import { IosInstallGuideCard } from './IosInstallGuideCard';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallGuide() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [appUrl, setAppUrl] = useState('https://catedraldecolatina.org.br/instalar');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.origin + '/instalar');

      // Detectar modo standalone (já instalado)
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);

      // Detectar dispositivo
      const ua = window.navigator.userAgent.toLowerCase();
      const iosDevice = /iphone|ipad|ipod/.test(ua);
      const androidDevice = /android/.test(ua);

      setIsIOS(iosDevice);
      setIsAndroid(androidDevice);
      setIsDesktop(!iosDevice && !androidDevice);

      // Ouvir evento nativo de instalação
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsStandalone(true);
    }
    setDeferredPrompt(null);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(appUrl)}&margin=6&format=svg`;

  return (
    <div className="space-y-10">
      {/* Estado: Aplicativo Já Instalado */}
      {isStandalone && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-[var(--dash-text-primary)]">
            O aplicativo da Catedral já está instalado no seu celular!
          </h3>
          <p className="text-sm text-[var(--dash-text-secondary)] max-w-md mx-auto">
            Você já tem acesso instantâneo na sua tela inicial para acompanhar as Santas Missas, folhetos litúrgicos e notícias da Catedral.
          </p>
          <div className="pt-2">
            <Link href="/">
              <Button variant="primary" size="md" className="min-h-[44px]">
                Acessar Portal da Catedral
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Card Principal de Ação por Dispositivo */}
      {!isStandalone && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-xl relative overflow-hidden">
          {/* Brilho de Fundo Sutil */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-red-800/10 rounded-full blur-3xl pointer-events-none" />

          {/* CASO 1: IPHONE / IPAD (iOS Safari) */}
          {isIOS && <IosInstallGuideCard />}

          {/* CASO 2: ANDROID (Google Chrome / Edge / Samsung Internet) */}
          {isAndroid && (
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B1E22] via-[#651518] to-[#2D1A16] border-2 border-[#C8A463]/50 flex items-center justify-center text-[#FFCC36] shadow-md shrink-0">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                    Dispositivo Android Detectado
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--dash-text-primary)] font-cinzel tracking-[0.04em] uppercase pt-1">
                    Instalar Aplicativo Oficial no seu Celular
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[var(--dash-text-secondary)] leading-relaxed">
                Você pode instalar o ícone da Catedral com apenas 1 clique no seu telefone. Não precisa de Play Store e não ocupa a memória do aparelho.
              </p>

              {/* Botão de Instalação Nativo (se suportado pelo navegador) */}
              {deferredPrompt ? (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-red-900/10 to-amber-500/5 border-2 border-amber-500/40 space-y-3 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:space-y-0">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
                      Pronto para instalar agora
                    </h4>
                    <p className="text-xs text-[var(--dash-text-secondary)]">
                      Clique no botão para adicionar o ícone à sua tela inicial.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleInstallClick}
                    className="min-h-[48px] px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold shadow-lg shadow-amber-500/20 text-sm w-full sm:w-auto"
                    icon={<Download className="w-4 h-4" />}
                  >
                    Instalar Aplicativo
                  </Button>
                </div>
              ) : (
                /* Passo a Passo Alternativo se o prompt automático não disparou */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-black">
                          1
                        </span>
                        Menu do Navegador
                      </div>
                      <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
                        Toque nos <strong>três pontinhos verticais (⋮)</strong> no canto superior direito do Chrome.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-black">
                          2
                        </span>
                        Instalar ou Adicionar
                      </div>
                      <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
                        Escolha <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong> e confirme.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CASO 3: DESKTOP / COMPUTADOR */}
          {isDesktop && (
            <div className="space-y-6 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      Acesso pelo Computador
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-[var(--dash-text-primary)] font-cinzel tracking-[0.04em] uppercase">
                    Instale no celular apontando a câmera
                  </h3>
                  <p className="text-sm text-[var(--dash-text-secondary)] leading-relaxed">
                    Você está acessando pelo computador. Para ter o aplicativo oficial da Catedral do Sagrado Coração de Jesus no seu smartphone, <strong>aponte a câmera do seu celular para o QR Code ao lado</strong>.
                  </p>
                  
                  {/* Se o navegador de desktop suportar instalação PWA */}
                  {deferredPrompt && (
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleInstallClick}
                        className="text-xs min-h-[44px]"
                        icon={<Download className="w-3.5 h-3.5" />}
                      >
                        Instalar atalho neste computador
                      </Button>
                    </div>
                  )}
                </div>

                {/* Container do QR Code */}
                <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] shadow-md shrink-0 self-center">
                  <div className="p-3 bg-[var(--dash-surface)] rounded-xl shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrCodeUrl}
                      alt="QR Code para instalar o aplicativo da Catedral"
                      className="w-44 h-44 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[var(--dash-text-secondary)] pt-2.5 text-center">
                    Aponte a câmera do celular
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Ação de Compartilhar Link */}
          <div className="pt-6 mt-6 border-t border-[var(--dash-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--dash-text-secondary)]">
            <span className="flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              Compartilhe com paroquianos, idosos e grupos de oração:
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--dash-surface-secondary)] hover:bg-[var(--dash-border)] text-[var(--dash-text-primary)] font-semibold transition-colors cursor-pointer min-h-[44px]"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copiar Link de Instalação</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Grid de Benefícios e Navegação */}
      <PwaBenefitGrid />
    </div>
  );
}
