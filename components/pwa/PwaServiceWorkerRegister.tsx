'use client';

import { useEffect } from 'react';

/**
 * Registra o Service Worker leve (/sw.js) no navegador do fiel para leitura offline segura.
 */
export function PwaServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const registerSw = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      } catch {
        // Modo privado ou políticas de rede restritas não devem interromper a navegação
      }
    };

    if (document.readyState === 'complete') {
      void registerSw();
    } else {
      window.addEventListener('load', registerSw, { once: true });
      return () => window.removeEventListener('load', registerSw);
    }
  }, []);

  return null;
}
