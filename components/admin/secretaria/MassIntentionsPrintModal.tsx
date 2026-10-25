'use client';

import React from 'react';
import { Printer, X, Sparkles, Church, Calendar, Clock, Flame } from 'lucide-react';
import { Button } from '@/components/ui';
import { MassIntention } from '@/types';

interface MassIntentionsPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  celebrationDate: string;
  celebrationTime: string;
  communityName: string;
  intentions: MassIntention[];
}

export function MassIntentionsPrintModal({
  isOpen,
  onClose,
  celebrationDate,
  celebrationTime,
  communityName,
  intentions,
}: MassIntentionsPrintModalProps) {
  if (!isOpen) return null;

  // Filtrar apenas aprovadas ou pendentes desta data e horário
  const filtered = intentions.filter(
    (i) => i.celebration_date === celebrationDate && i.celebration_time === celebrationTime
  );

  // Agrupamentos litúrgicos
  const fallecidos = filtered.filter((i) =>
    ['falecimento', 'setimo_dia', 'trigesimo_dia'].includes(i.intention_type)
  );
  const acaoGracas = filtered.filter((i) => i.intention_type === 'acao_gracas');
  const saude = filtered.filter((i) => i.intention_type === 'saude');
  const aniversariosEOutros = filtered.filter((i) =>
    ['aniversario_vida', 'aniversario_matrimonio', 'outros'].includes(i.intention_type)
  );

  const formattedDate = celebrationDate
    ? new Date(celebrationDate + 'T12:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const isAnonymousIntention = (item: MassIntention) => {
    if (item.is_anonymous) return true;
    if (!item.offered_by) return true;
    const lower = item.offered_by.trim().toLowerCase();
    return lower === 'anônimo' || lower === 'anonimo' || lower === 'fiel da comunidade';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)] shadow-2xl overflow-hidden">
        {/* Barra Superior (não impressa) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <h3 className="text-sm font-bold text-[var(--dash-text-primary)]">
                Folha Litúrgica de Intenções para o Púlpito (A4)
              </h3>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                {formattedDate} às {celebrationTime}h • {communityName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handlePrint}
              className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Folha A4</span>
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)] transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Área do Documento de Impressão (Estilo A4) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[var(--dash-surface)] text-neutral-900 font-serif print:p-0 print:m-0 print:overflow-visible">
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-pulpito-area, .print-pulpito-area * {
                visibility: visible;
              }
              .print-pulpito-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 20mm;
                background: white !important;
                color: black !important;
              }
            }
          `}</style>

          <div className="print-pulpito-area max-w-3xl mx-auto space-y-6 text-[var(--dash-text-primary)]">
            {/* Cabeçalho Solene da Paróquia */}
            <div className="text-center border-b-2 border-neutral-800 pb-4 space-y-1">
              <span className="text-xs uppercase tracking-widest font-sans font-bold text-neutral-700">
                Diocese de Colatina • Paróquia do Sagrado Coração de Jesus
              </span>
              <h1 className="text-2xl font-bold uppercase tracking-tight text-neutral-900">
                Catedral Diocesana
              </h1>
              <h2 className="text-base font-semibold italic text-neutral-800">
                Intenções da Santa Missa
              </h2>

              <div className="flex items-center justify-center gap-4 text-xs font-sans font-medium text-neutral-700 pt-2 border-t border-neutral-300 mt-2">
                <span><strong>Data:</strong> {formattedDate}</span>
                <span>•</span>
                <span><strong>Horário:</strong> {celebrationTime}h</span>
                <span>•</span>
                <span><strong>Local:</strong> {communityName}</span>
              </div>
            </div>

            {/* Aviso se não houver intenções */}
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 font-sans text-sm">
                Nenhuma intenção cadastrada para esta data e horário.
              </div>
            ) : (
              <div className="space-y-6 text-sm">
                {/* 1. Sufrágio dos Fiéis Defuntos */}
                {fallecidos.length > 0 && (
                  <div className="space-y-2">
                    <div className="bg-neutral-100 p-1.5 px-3 border-l-4 border-neutral-900 font-sans font-bold text-xs uppercase tracking-wider text-neutral-800 flex justify-between items-center">
                      <span>🕊️ Pela(s) Alma(s) de:</span>
                      <span className="text-[11px] font-normal">({fallecidos.length})</span>
                    </div>
                    <ul className="divide-y divide-neutral-200 pl-3">
                      {fallecidos.map((item) => (
                        <li key={item.id} className="py-1.5 flex items-baseline justify-between gap-4">
                          <span className="font-semibold text-neutral-900">
                            {item.intention_for}
                            {item.intention_type === 'setimo_dia' && (
                              <span className="ml-2 text-xs font-sans font-bold text-neutral-600">(7º Dia)</span>
                            )}
                            {item.intention_type === 'trigesimo_dia' && (
                              <span className="ml-2 text-xs font-sans font-bold text-neutral-600">(30º Dia)</span>
                            )}
                          </span>
                          {!isAnonymousIntention(item) && (
                            <span className="text-xs font-sans text-neutral-600 shrink-0">
                              (Oferece: {item.offered_by})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 2. Em Ação de Graças */}
                {acaoGracas.length > 0 && (
                  <div className="space-y-2">
                    <div className="bg-neutral-100 p-1.5 px-3 border-l-4 border-neutral-900 font-sans font-bold text-xs uppercase tracking-wider text-neutral-800 flex justify-between items-center">
                      <span>🌸 Em Ação de Graças</span>
                      <span className="text-[11px] font-normal">({acaoGracas.length})</span>
                    </div>
                    <ul className="divide-y divide-neutral-200 pl-3">
                      {acaoGracas.map((item) => (
                        <li key={item.id} className="py-1.5 flex items-baseline justify-between gap-4">
                          <span className="font-semibold text-neutral-900">{item.intention_for}</span>
                          {!isAnonymousIntention(item) && (
                            <span className="text-xs font-sans text-neutral-600 shrink-0">
                              (Oferece: {item.offered_by})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 3. Pela Saúde dos Enfermos */}
                {saude.length > 0 && (
                  <div className="space-y-2">
                    <div className="bg-neutral-100 p-1.5 px-3 border-l-4 border-neutral-900 font-sans font-bold text-xs uppercase tracking-wider text-neutral-800 flex justify-between items-center">
                      <span>🌿 Pela Saúde e Restauração dos Enfermos</span>
                      <span className="text-[11px] font-normal">({saude.length})</span>
                    </div>
                    <ul className="divide-y divide-neutral-200 pl-3">
                      {saude.map((item) => (
                        <li key={item.id} className="py-1.5 flex items-baseline justify-between gap-4">
                          <span className="font-semibold text-neutral-900">{item.intention_for}</span>
                          {!isAnonymousIntention(item) && (
                            <span className="text-xs font-sans text-neutral-600 shrink-0">
                              (Oferece: {item.offered_by})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 4. Aniversários e Bênçãos Especiais */}
                {aniversariosEOutros.length > 0 && (
                  <div className="space-y-2">
                    <div className="bg-neutral-100 p-1.5 px-3 border-l-4 border-neutral-900 font-sans font-bold text-xs uppercase tracking-wider text-neutral-800 flex justify-between items-center">
                      <span>✨ Aniversários e Bênçãos Especiais</span>
                      <span className="text-[11px] font-normal">({aniversariosEOutros.length})</span>
                    </div>
                    <ul className="divide-y divide-neutral-200 pl-3">
                      {aniversariosEOutros.map((item) => (
                        <li key={item.id} className="py-1.5 flex items-baseline justify-between gap-4">
                          <span className="font-semibold text-neutral-900">
                            {item.intention_for}
                            {item.intention_type === 'aniversario_vida' && (
                              <span className="ml-2 text-xs font-sans text-neutral-600">(Aniversário Natalício)</span>
                            )}
                            {item.intention_type === 'aniversario_matrimonio' && (
                              <span className="ml-2 text-xs font-sans text-neutral-600">(Aniv. de Casamento)</span>
                            )}
                          </span>
                          {!isAnonymousIntention(item) && (
                            <span className="text-xs font-sans text-neutral-600 shrink-0">
                              (Oferece: {item.offered_by})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Espaço para Rubrica de Proclamação no Púlpito */}
            <div className="pt-10 mt-8 border-t border-neutral-300 flex justify-between items-end font-sans text-xs text-neutral-700">
              <div>
                <p>Total de Intenções: <strong>{filtered.length}</strong></p>
                <p className="text-[10px] text-neutral-500">Documento gerado pela Secretaria Paroquial</p>
              </div>

              <div className="text-center w-64">
                <div className="border-b border-neutral-900 pb-1 mb-1"></div>
                <p className="font-semibold text-neutral-900">Leitor / Celebrante</p>
                <p className="text-[10px] text-neutral-500">Rubrica de Proclamação no Púlpito</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
