import React from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Newspaper, 
  QrCode, 
  ArrowUpRight, 
  Sparkles,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Painel da Paróquia</h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Gestão pastoral de conteúdos, celebrações e arrecadações via PIX.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/conteudo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-95 transition-all shadow-sm"
          >
            <Newspaper className="w-4 h-4" />
            Novo Aviso
          </Link>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--dash-text-secondary)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Missas Semanais</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold mt-3">14</p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Horários sincronizados no portal
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--dash-text-secondary)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Avisos e Notícias</span>
            <Newspaper className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold mt-3">6</p>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-2">
            2 avisos urgentes em exibição
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--dash-text-secondary)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Dízimo / PIX (Mês)</span>
            <QrCode className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold mt-3">R$ 8.420,00</p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Recebido diretamente na conta da paróquia
          </p>
        </div>
      </div>

      {/* Blocos de Ação Rápida */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Celebrações Cadastradas */}
        <div className="p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--primary)]" />
              Horários de Hoje
            </h2>
            <Link href="/admin/horarios" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              Gerenciar todos
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] text-sm">
              <div>
                <span className="font-semibold">07:00</span>
                <p className="text-xs text-[var(--dash-text-secondary)]">Santa Missa Matriz</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">
                Confirmada
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] text-sm">
              <div>
                <span className="font-semibold">15:00 às 17:00</span>
                <p className="text-xs text-[var(--dash-text-secondary)]">Atendimento de Confissões</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 font-semibold">
                Secretaria / Pe. Pároco
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] text-sm">
              <div>
                <span className="font-semibold">19:30</span>
                <p className="text-xs text-[var(--dash-text-secondary)]">Santa Missa e Bênção do Santíssimo</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">
                Confirmada
              </span>
            </div>
          </div>
        </div>

        {/* Status da Identidade White-Label */}
        <div className="p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--primary)]" />
              Portal White-Label
            </h2>
            <Link href="/admin/configuracoes" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              Editar Cores
            </Link>
          </div>

          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            Seu portal digital está ativo e configurado com as cores e o brasão paroquial. Todas as informações publicadas aqui são refletidas imediatamente para os fiéis.
          </p>

          <div className="p-4 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--dash-text-secondary)]">Chave PIX Ativa:</span>
              <span className="font-mono font-bold">secretaria@catedral.org.br</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--dash-text-secondary)]">WhatsApp Pastoral:</span>
              <span className="font-semibold">(27) 99999-0000</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--dash-text-secondary)]">Transmissão ao Vivo:</span>
              <span className="text-emerald-600 font-semibold">YouTube Conectado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
