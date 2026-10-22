'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, Maximize2, Bot } from 'lucide-react';
import { AdminAiChatView } from './AdminAiChatView';

export function AdminAiFloatingDrawer() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {/* 1. Botão Flutuante (Canto Inferior Direito) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-[#8B1E22] via-[#A8252B] to-[#FFA82A] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2.5 min-h-[48px] min-w-[48px] cursor-pointer border border-[#FFA82A]/30 group"
          title="Abrir IA da Paróquia"
          aria-label="Abrir Assistente IA"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
            </span>
          </div>
          <span className="text-xs font-semibold tracking-wide hidden sm:inline-block pr-1">
            IA da Paróquia
          </span>
        </button>
      )}

      {/* 2. Backdrop com Desfoque */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* 3. Gaveta Retrátil Lateral (Slide-Over Drawer) */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[460px] md:w-[500px] bg-[var(--dash-surface)] border-l border-[var(--dash-border)] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cabeçalho do Drawer */}
        <div className="p-4 border-b border-[var(--dash-border)] bg-[var(--dash-bg)]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#FFA82A] text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-[var(--dash-text-primary)]">
                  IA da Paróquia
                </h3>
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20">
                  RAG
                </span>
              </div>
              <p className="text-[11px] text-[var(--dash-text-secondary)]">
                Catedral de Colatina • Gemini 2.5 Flash
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/admin/assistente-ia"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Abrir em tela cheia"
            >
              <Maximize2 className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo do Chat Embutido */}
        <div className="flex-1 p-3 overflow-hidden">
          <AdminAiChatView compact={true} />
        </div>
      </div>
    </>
  );
}
