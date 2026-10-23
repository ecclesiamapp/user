'use client';

import React, { useEffect, useState } from 'react';
import { X, MessageCircle, Mail, Phone, ShieldCheck, Copy, Check, HeartHandshake } from 'lucide-react';
import { CommunityLeader } from '@/types';

interface CommunityLeaderContactModalProps {
  leader: CommunityLeader | null;
  communityName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommunityLeaderContactModal({
  leader,
  communityName,
  isOpen,
  onClose,
}: CommunityLeaderContactModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !leader) return null;

  const rawPhone = leader.phone || '(27) 3722-1234';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const email = leader.email || 'secretaria@catedraldecolatina.org.br';

  const waMessage = `Olá, ${leader.name}! Sou paroquiano da ${communityName} e gostaria de conversar com a coordenação comunitária.`;
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(rawPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#2A1E1A] via-[#1E1614] to-[#15100E] border border-[#C8A463]/40 shadow-2xl shadow-black/80 p-6 sm:p-8 overflow-hidden text-[#FFF3E3] space-y-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-leader-title"
      >
        {/* Glow de Fundo Sutil */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#FFA82A]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#EAE3D9]/70 hover:text-white hover:bg-[var(--dash-surface)]/10 transition-colors cursor-pointer"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho do Conselheiro */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left pt-2">
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#FFA82A]/60 shadow-xl shadow-black/50 bg-[#1D1614]">
              <img
                src={leader.image || leader.photo_url || '/images/pastores/pe-irineu-claudino-sales.webp'}
                alt={leader.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <span className="absolute bottom-1 right-1 p-1.5 rounded-full bg-emerald-600 border border-white text-white shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#FFCC36] text-[11px] font-bold uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{leader.role}</span>
            </span>
            <h3 id="modal-leader-title" className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {leader.name}
            </h3>
            <p className="text-xs text-[#EAE3D9]/70">
              Conselho Pastoral Comunitário (CPC) • {communityName}
            </p>
          </div>
        </div>

        {/* Biografia / Missão Pastoral */}
        {leader.bio && (
          <div className="p-3.5 rounded-2xl bg-[var(--dash-surface)]/5 border border-white/10 text-xs text-[#EAE3D9]/80 leading-relaxed">
            «{leader.bio}»
          </div>
        )}

        {/* Ação Primária: Conversar no WhatsApp */}
        <div className="space-y-3 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 transition-all min-h-[48px] group"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Conversar no WhatsApp</span>
          </a>

          {/* Linhas de Contato Secundárias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Telefone */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--dash-surface)]/5 border border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="w-4 h-4 text-[#FFA82A] shrink-0" />
                <span className="text-xs font-mono text-[#EAE3D9] truncate">{rawPhone}</span>
              </div>
              <button
                onClick={handleCopyPhone}
                className="p-1.5 rounded-lg hover:bg-[var(--dash-surface)]/10 text-[#FFA82A] transition-colors cursor-pointer"
                title="Copiar telefone"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* E-mail */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--dash-surface)]/5 border border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-[#FFA82A] shrink-0" />
                <span className="text-xs font-mono text-[#EAE3D9] truncate">{email}</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg hover:bg-[var(--dash-surface)]/10 text-[#FFA82A] transition-colors cursor-pointer"
                title="Copiar e-mail"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal com Aviso Pastoral */}
        <p className="text-[11px] text-center text-[#EAE3D9]/60 border-t border-white/10 pt-4">
          Canal fraterno de acolhimento paroquial para dúvidas, intenções de oração e informações pastorais.
        </p>
      </div>
    </div>
  );
}
