'use client';

import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui';

interface UserInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  communityName?: string;
}

export function UserInviteModal({
  isOpen,
  onClose,
  user,
  communityName,
}: UserInviteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const roleText = 
    user.role === 'superadmin' ? 'Superadmin (SaaS)' :
    user.role === 'paroco' ? 'Pároco' :
    user.role === 'vigario' ? 'Vigário Paroquial' :
    user.role === 'secretaria' ? 'Secretaria Paroquial' :
    user.role === 'pascom' ? 'PASCOM Catedral' :
    `Coordenador da ${communityName || 'Comunidade'}`;

  const cleanPhone = (user.phone || '').replace(/\D/g, '');
  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://catedraldecolatina.org.br';
  const loginUrl = `${appOrigin}/admin`;

  const inviteMessage = `✝️ Paz e Bem, ${user.name}!\n\nVocê foi cadastrado(a) como *${roleText}* no sistema de gestão da *Catedral de Colatina*.\n\n🌐 *Painel Administrativo:*\n${loginUrl}\n\n📧 *Seu E-mail de Acesso:*\n${user.email}\n\nQualquer dúvida, entre em contato com a Secretaria Paroquial. Deus abençoe sua missão pastoral!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(inviteMessage);
    const waUrl = cleanPhone 
      ? `https://wa.me/55${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--dash-border)] flex items-center justify-between bg-[var(--dash-surface-secondary)]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--dash-text-primary)]">
                Instruções de Acesso & Convite
              </h3>
              <p className="text-xs text-[var(--dash-text-muted)]">
                Enviar dados de acesso para {user.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
              Mensagem Pastoral Pré-formatada (WhatsApp / E-mail):
            </label>
            <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-xs text-[var(--dash-text-primary)] font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {inviteMessage}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="w-full sm:flex-1 rounded-xl text-xs font-semibold min-h-[42px] flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado para Área de Transferência!' : 'Copiar Mensagem'}</span>
            </Button>

            <Button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full sm:flex-1 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white min-h-[42px] flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Enviar via WhatsApp</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
