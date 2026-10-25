'use client';

import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Check, 
  Loader2, 
  MessageCircle, 
  User, 
  Phone, 
  Calendar, 
  BookOpen, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';
import { CertificateRequest, CertificateStatus } from '@/types';
import { Card, Button, Input, Badge } from '@/components/ui';
import { createClient } from '@/utils/supabase/client';

interface CertificateDetailModalProps {
  request: CertificateRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: CertificateRequest) => void;
}

export function CertificateDetailModal({
  request,
  isOpen,
  onClose,
  onUpdate,
}: CertificateDetailModalProps) {
  if (!isOpen || !request) return null;

  const supabase = createClient();

  const [status, setStatus] = useState<CertificateStatus>(request.status);
  const [bookNumber, setBookNumber] = useState<string>(request.book_number || '');
  const [pageNumber, setPageNumber] = useState<string>(request.page_number || '');
  const [entryNumber, setEntryNumber] = useState<string>(request.entry_number || '');
  const [internalNotes, setInternalNotes] = useState<string>(request.internal_notes || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        status,
        book_number: bookNumber.trim() || null,
        page_number: pageNumber.trim() || null,
        entry_number: entryNumber.trim() || null,
        internal_notes: internalNotes.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('certificate_requests')
        .update(payload)
        .eq('id', request.id);

      if (!error) {
        onUpdate({
          ...request,
          ...payload,
        });
        onClose();
      }
    } catch (err) {
      console.error('Erro ao salvar certidão:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendWhatsAppNotification = () => {
    const cleanPhone = request.applicant_phone.replace(/\D/g, '');
    const certTypeLabel = request.certificate_type.toUpperCase();
    
    let text = `Paz e Bem, ${request.applicant_name}! 🕊️\n\n`;
    if (status === 'pronto_para_retirada' || status === 'emitido') {
      text += `Informamos que a sua *Certidão de ${certTypeLabel}* (Titular: *${request.holder_name}*) já foi lavrada e está pronta para retirada na Secretaria da Catedral de Colatina.\n\n`;
      if (bookNumber && entryNumber) {
        text += `• Livro: ${bookNumber} | Termo: ${entryNumber}\n\n`;
      }
      text += `📍 Endereço: Praça Frei José, Nº 26 - Edifício João Paulo II (1º Andar)\n`;
      text += `⏰ Atendimento: Seg a Sex das 08h às 18h | Sáb das 08h às 12h.\n\n`;
    } else if (status === 'em_busca') {
      text += `Sua solicitação de *Certidão de ${certTypeLabel}* está sendo localizada em nossos livros de tombo paroquiais. Avisaremos assim que for concluída.\n\n`;
    } else {
      text += `Atualização sobre sua solicitação de certidão: status atualizado para *${status}*.\n\n`;
    }
    text += `_Secretaria da Catedral de Colatina_`;

    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Topo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <h3 className="text-sm font-bold text-[var(--dash-text-primary)]">
                Ficha de Certidão Paroquial
              </h3>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Protocolo: CERT-2026-{request.id.slice(0, 6).toUpperCase()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Dados do Titular e Sacramento */}
          <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-[var(--dash-text-muted)] text-[10px] block">
              Dados do Titular
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[var(--dash-text-secondary)] block">Nome do Titular:</span>
                <span className="font-bold text-[var(--dash-text-primary)] text-sm">{request.holder_name}</span>
              </div>
              <div>
                <span className="text-[var(--dash-text-secondary)] block">Tipo de Documento:</span>
                <Badge variant="matriz" className="uppercase font-bold text-[10px]">
                  {request.certificate_type}
                </Badge>
              </div>
              {request.parents_names && (
                <div className="sm:col-span-2">
                  <span className="text-[var(--dash-text-secondary)] block">Filiação (Pais):</span>
                  <span className="font-semibold text-[var(--dash-text-primary)]">{request.parents_names}</span>
                </div>
              )}
              {request.godparents_names && (
                <div>
                  <span className="text-[var(--dash-text-secondary)] block">Padrinhos / Cônjuge:</span>
                  <span className="font-semibold text-[var(--dash-text-primary)]">{request.godparents_names}</span>
                </div>
              )}
              {request.approximate_year && (
                <div>
                  <span className="text-[var(--dash-text-secondary)] block">Ano Estimado:</span>
                  <span className="font-semibold text-[var(--dash-text-primary)]">{request.approximate_year}</span>
                </div>
              )}
              {request.purpose && (
                <div className="sm:col-span-2">
                  <span className="text-[var(--dash-text-secondary)] block">Finalidade:</span>
                  <span className="font-semibold text-[var(--dash-text-primary)]">{request.purpose}</span>
                </div>
              )}
            </div>
          </div>

          {/* Dados do Solicitante */}
          <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-[var(--dash-text-muted)] text-[10px] block">
              Dados do Solicitante
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[var(--dash-text-secondary)] block">Solicitante:</span>
                <span className="font-bold text-[var(--dash-text-primary)]">{request.applicant_name}</span>
              </div>
              <div>
                <span className="text-[var(--dash-text-secondary)] block">WhatsApp:</span>
                <span className="font-bold text-[var(--dash-text-primary)]">{request.applicant_phone}</span>
              </div>
              <div>
                <span className="text-[var(--dash-text-secondary)] block">Preferência de Entrega:</span>
                <span className="font-semibold text-[var(--dash-text-primary)]">{request.delivery_preference}</span>
              </div>
            </div>
          </div>

          {/* Registro nos Livros de Tombo da Paróquia */}
          <div className="p-4 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 space-y-3">
            <span className="font-bold uppercase tracking-wider text-[var(--primary)] text-[10px] block">
              Registro Eclesiástico (Arquivo de Tombo)
            </span>
            <p className="text-[11px] text-[var(--dash-text-secondary)]">
              Preencha os números encontrados nos livros físicos da Catedral para documentação e arquivamento:
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--dash-text-primary)] mb-1">
                  Livro Nº
                </label>
                <Input
                  type="text"
                  placeholder="Ex: 14-B"
                  value={bookNumber}
                  onChange={(e) => setBookNumber(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--dash-text-primary)] mb-1">
                  Folha Nº
                </label>
                <Input
                  type="text"
                  placeholder="Ex: 88"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--dash-text-primary)] mb-1">
                  Termo Nº
                </label>
                <Input
                  type="text"
                  placeholder="Ex: 241"
                  value={entryNumber}
                  onChange={(e) => setEntryNumber(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--dash-text-primary)] mb-1">
                Anotações Internas da Secretaria
              </label>
              <Input
                type="text"
                placeholder="Ex: Conferido pelo padre, via original arquivada, retirado pela mãe"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          {/* Status do Pedido */}
          <div>
            <label className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
              Atualizar Status da Certidão:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CertificateStatus)}
              className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] cursor-pointer"
            >
              <option value="pendente">Pendente de Análise</option>
              <option value="em_busca">Em Busca nos Livros</option>
              <option value="localizado">Registro Localizado</option>
              <option value="emitido">Certidão Emitida</option>
              <option value="pronto_para_retirada">Pronta para Retirada</option>
              <option value="entregue">Entregue ao Fiel</option>
              <option value="nao_localizado">Não Localizado no Arquivo</option>
            </select>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSendWhatsAppNotification}
            className="gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:border-emerald-500/50 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notificar no WhatsApp</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs cursor-pointer"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              size="sm"
              disabled={isSaving}
              onClick={handleSave}
              className="gap-1.5 text-xs bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Salvar Alterações</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
