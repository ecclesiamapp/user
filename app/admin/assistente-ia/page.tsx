'use client';

import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  Clock, 
  MapPin, 
  HelpCircle,
  AlertTriangle 
} from 'lucide-react';
import { AdminAiChatView } from '@/components/admin/ai/AdminAiChatView';
import { AdminAiKnowledgeStatsCard } from '@/components/admin/ai/AdminAiKnowledgeStatsCard';

export default function AdminAiAssistantPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--dash-border)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#FFA82A] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--dash-text-primary)]">
              Assistente IA Paroquial & RAG
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] mt-1">
            Assistente inteligente interno para consultas canônicas, horários, diretrizes das 12 CEBs e elaboração de avisos para a secretaria.
          </p>
        </div>

        {/* Badges de Status do Motor */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Gemini 2.5 Flash
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Blindagem Canônica
          </span>
        </div>
      </div>

      {/* 2. Layout em Grade (Chat Principal + Painel de Conhecimento) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Coluna Principal: Chat Interativo (Ocupa 2 colunas no desktop) */}
        <div className="lg:col-span-2 h-[720px] flex flex-col">
          <AdminAiChatView />
        </div>

        {/* Coluna Lateral: Status da Base Vetorial e Guia de Uso */}
        <div className="space-y-6">
          {/* Card de Estatísticas e Sincronização do Banco */}
          <AdminAiKnowledgeStatsCard />

          {/* Card de Casos de Uso Frequentes na Secretaria */}
          <div className="bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-xs text-[var(--dash-text-primary)] uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              Como a IA apoia a secretaria
            </h3>

            <div className="space-y-2.5 text-xs text-[var(--dash-text-secondary)]">
              <div className="p-2.5 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border)] space-y-1">
                <span className="font-semibold text-[var(--dash-text-primary)] block">
                  1. Plantão e Horários dos Padres
                </span>
                <p>
                  Consulte os dias de confissão e atendimento do Pe. Irineu, Pe. Adilson, Pe. Deivid e Pe. Ernandes.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border)] space-y-1">
                <span className="font-semibold text-[var(--dash-text-primary)] block">
                  2. 12 Comunidades (CEBs)
                </span>
                <p>
                  Informações sobre padroeiros, localização, coordenadores locais e celebrações de cada comunidade.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border)] space-y-1">
                <span className="font-semibold text-[var(--dash-text-primary)] block">
                  3. Rascunhos de Avisos e Murais
                </span>
                <p>
                  Solicite rascunhos de comunicados para leitura nas missas de domingo ou postagem no WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Card de Diretrizes Canônicas */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Diretrizes de Segurança Pastoral
            </span>
            <p className="text-[var(--dash-text-secondary)] leading-relaxed">
              O assistente opera em modo de leitura estrita. Ele não altera agendamentos ou doações diretamente no banco sem autorização expressa da equipe paroquial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
