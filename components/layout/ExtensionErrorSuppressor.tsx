'use client';

import { useEffect } from 'react';

/**
 * Suprime erros e rejeições de promises causadas por extensões de navegador
 * (Chrome Extensions / Firefox Add-ons) que tentam manipular o DOM ou injetar
 * scripts antes da hidratação do React 19, sem renderizar tags <script> na árvore DOM.
 */
export function ExtensionErrorSuppressor() {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const text = event?.reason
        ? event.reason.stack || event.reason.message || String(event.reason)
        : '';
      if (
        text.includes('chrome-extension://') ||
        text.includes('chrome:') ||
        text.includes('moz-extension://')
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    };

    const handleError = (event: ErrorEvent) => {
      const file = event?.filename || '';
      if (
        file.includes('chrome-extension://') ||
        file.includes('moz-extension://')
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
