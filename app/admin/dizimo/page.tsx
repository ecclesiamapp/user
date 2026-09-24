import React from 'react';
import { QrCode, Download, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DizimoAdminPage() {
  const sampleTransactions = [
    { id: '1', donor: 'Dizimista Anônimo', type: 'Dízimo Mensal', amount: 150.00, date: '23/09/2026 18:42', status: 'Concluído' },
    { id: '2', donor: 'Maria das Graças Silva', type: 'Intenção de Missa (7º Dia)', amount: 50.00, date: '23/09/2026 14:15', status: 'Concluído' },
    { id: '3', donor: 'João Paulo de Oliveira', type: 'Dízimo Mensal', amount: 300.00, date: '22/09/2026 09:10', status: 'Concluído' },
    { id: '4', donor: 'Antônio Ferreira', type: 'Oferta do Altar', amount: 30.00, date: '21/09/2026 20:05', status: 'Concluído' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dízimo e Arrecadações PIX</h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Acompanhe em tempo real as contribuições e intenções recebidas via PIX.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-sm font-semibold hover:bg-[var(--dash-surface-secondary)] transition-all shadow-sm">
          <Download className="w-4 h-4" />
          Exportar Relatório
        </button>
      </div>

      {/* Card de Configuração de Chave PIX */}
      <div className="p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[var(--dash-text-secondary)] uppercase tracking-wider">Chave PIX da Paróquia</span>
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[var(--primary)]" />
            <span className="text-lg font-mono font-bold">secretaria@catedral.org.br</span>
          </div>
          <p className="text-xs text-[var(--dash-text-secondary)]">Banco: Sicoob Diocesano | Paróquia Catedral do Sagrado Coração de Jesus</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            PIX Ativo e Validado
          </span>
        </div>
      </div>

      {/* Tabela de Doações */}
      <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-xs font-semibold text-[var(--dash-text-secondary)] uppercase tracking-wider flex justify-between items-center">
          <span>Últimas Contribuições</span>
          <span>Atualizado em tempo real</span>
        </div>

        <div className="divide-y divide-[var(--dash-border)]">
          {sampleTransactions.map((tx) => (
            <div key={tx.id} className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--dash-surface-secondary)]/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{tx.donor}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)]">
                    {tx.type}
                  </span>
                </div>
                <p className="text-xs text-[var(--dash-text-secondary)]">{tx.date}</p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <span className="font-bold text-base text-emerald-600 flex items-center gap-1">
                    <ArrowDownRight className="w-4 h-4" />
                    {formatCurrency(tx.amount)}
                  </span>
                  <span className="text-[11px] text-[var(--dash-text-secondary)]">{tx.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
