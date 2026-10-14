'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Building2, 
  MessageCircle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { SacramentConfig } from './types';

interface SacramentSuccessCardProps {
  protocol: string;
  config: SacramentConfig;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  communityName?: string;
  whatsappSecretaryNumber: string;
  parishAddress: string;
  onNewRegistration: () => void;
}

export function SacramentSuccessCard({
  protocol,
  config,
  applicantName,
  applicantPhone,
  applicantEmail,
  communityName,
  whatsappSecretaryNumber,
  parishAddress,
  onNewRegistration,
}: SacramentSuccessCardProps) {
  const cleanPhone = whatsappSecretaryNumber.replace(/\D/g, '') || '552721025010';

  const whatsappMessage = encodeURIComponent(
    `Paz e Bem! Acabei de enviar uma solicitação de inscrição sacramental pelo portal da paróquia.\n\n` +
    `📋 *Protocolo:* ${protocol}\n` +
    `👤 *Solicitante:* ${applicantName}\n` +
    `✝️ *Sacramento / Curso:* ${config.title}\n` +
    (communityName ? `⛪ *Comunidade Pretendida:* ${communityName}\n` : '') +
    `\nGostaria de confirmar o recebimento da documentação pela secretaria. Muito obrigado(a)!`
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <Card className="p-5 sm:p-7 border-emerald-500/30 bg-[var(--dash-surface)] space-y-6 animate-fade-in shadow-xl rounded-2xl">
      {/* Topo com Ícone e Protocolo */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <Badge variant="matriz" className="text-xs font-bold tracking-wider uppercase">
          Pré-Inscrição Registrada
        </Badge>
        <h2 className="font-display text-2xl font-bold text-[var(--dash-text-primary)]">
          Inscrição Enviada com Sucesso!
        </h2>
        <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-md mx-auto leading-relaxed">
          Sua solicitação para <strong className="text-[var(--dash-text-primary)]">{config.title}</strong> foi registrada no banco de dados da paróquia.
        </p>
      </div>

      {/* Box do Protocolo */}
      <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-center space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
          Número do Protocolo Canônico
        </span>
        <div className="font-mono text-xl sm:text-2xl font-black text-[var(--primary)] tracking-wider">
          {protocol}
        </div>
        <p className="text-[11px] text-[var(--dash-text-secondary)]">
          Guarde este número para acompanhamento na secretaria paroquial.
        </p>
      </div>

      {/* Aviso de Confirmação por E-mail */}
      {applicantEmail && (
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <span className="text-base">📧</span>
          <span>
            Um comprovante de inscrição foi enviado para <strong>{applicantEmail}</strong>.
          </span>
        </div>
      )}

      {/* Checklist de Documentos a Apresentar */}
      <div className="space-y-3 pt-2 text-xs sm:text-sm border-t border-[var(--dash-border)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h4 className="font-bold text-[var(--dash-text-primary)] text-xs uppercase tracking-wider">
            Próximo Passo: Documentos para Apresentar na Secretaria
          </h4>
        </div>

        <ul className="grid grid-cols-1 gap-2">
          {config.requiredDocuments.map((doc, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]/60 text-xs text-[var(--dash-text-secondary)]"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--primary)] shrink-0 mt-0.5" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Endereço e Horários da Secretaria */}
      <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)]/70 border border-[var(--dash-border)]/70 text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-[var(--dash-text-primary)] font-semibold">
          <Building2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
          <span>Secretaria Paroquial da Catedral</span>
        </div>
        <p className="text-[var(--dash-text-secondary)] pl-6">
          {parishAddress}
        </p>
        <p className="text-[var(--dash-text-muted)] pl-6 text-[11px]">
          Expediente: Segunda a Sexta das 08h às 17h | Sábados das 08h às 11h30.
        </p>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button
            type="button"
            className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirmar no WhatsApp da Secretaria</span>
          </Button>
        </a>

        <Button
          type="button"
          variant="outline"
          onClick={onNewRegistration}
          className="min-h-[48px] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Nova Inscrição</span>
        </Button>
      </div>
    </Card>
  );
}
