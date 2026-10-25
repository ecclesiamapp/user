'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Church, 
  Share2, 
  Copy, 
  Check, 
  Heart,
  Sparkles,
  Lock
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import { Parish, MassIntention, MassIntentionType } from '@/types';

export interface IntentionCategorySummary {
  type: MassIntentionType;
  label: string;
  icon: string;
  names: string[];
}

interface MassIntentionSuccessCardProps {
  parish: Parish;
  protocol: string;
  celebrationDate?: string;
  celebrationTime?: string;
  communityName?: string;
  categoriesSummary?: IntentionCategorySummary[];
  offeredBy?: string | null;
  contactPhone?: string | null;
  isAnonymous?: boolean;
  notes?: string | null;
  onReset: () => void;
  intention?: Partial<MassIntention>;
}

export function MassIntentionSuccessCard({
  parish,
  protocol,
  celebrationDate,
  celebrationTime,
  communityName,
  categoriesSummary = [],
  offeredBy,
  contactPhone,
  isAnonymous,
  notes,
  onReset,
  intention,
}: MassIntentionSuccessCardProps) {
  const [copiedPix, setCopiedPix] = useState(false);

  // Normalização caso venha através do objeto legado `intention`
  const resolvedDate = celebrationDate || intention?.celebration_date || '';
  const resolvedTime = celebrationTime || intention?.celebration_time || '';
  const resolvedCommunity = communityName || intention?.community_name || 'Catedral Matriz';
  const resolvedAnonymous = isAnonymous ?? intention?.is_anonymous ?? false;
  const resolvedOfferedBy = offeredBy ?? intention?.offered_by ?? 'Fiel da Comunidade';
  const resolvedPhone = contactPhone ?? intention?.contact_phone ?? null;

  // Se categoriesSummary estiver vazio mas intention.intention_for existir, cria um resumo sintético
  const resolvedCategories: IntentionCategorySummary[] = categoriesSummary.length > 0 
    ? categoriesSummary 
    : intention?.intention_for 
      ? [{
          type: (intention.intention_type || 'falecimento') as MassIntentionType,
          label: intention.intention_type === 'falecimento' ? 'Pela(s) Alma(s) de:' : 'Intenção Litúrgica',
          icon: '🕊️',
          names: intention.intention_for.split(',').map((s) => s.trim()).filter(Boolean),
        }]
      : [];

  const totalNames = resolvedCategories.reduce((acc, cat) => acc + cat.names.length, 0);

  const handleCopyPix = () => {
    if (parish.pix_key) {
      navigator.clipboard.writeText(parish.pix_key);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    const formattedDate = resolvedDate
      ? new Date(resolvedDate + 'T12:00:00').toLocaleDateString('pt-BR')
      : '';

    const offeredText = resolvedAnonymous
      ? '*Oferecido por:* Intenção Sigilosa / Anônima\n'
      : resolvedOfferedBy && resolvedOfferedBy !== 'Anônimo'
      ? `*Oferecido por:* ${resolvedOfferedBy}\n`
      : '';

    const categoriesText = resolvedCategories
      .map((cat) => `• *${cat.label}:*\n  - ${cat.names.join('\n  - ')}`)
      .join('\n\n');

    const text = encodeURIComponent(
      `🕊️ *Comprovante de Intenções de Santa Missa*\n` +
      `*Protocolo:* ${protocol}\n` +
      `*Paróquia:* ${parish.name}\n` +
      `*Celebração:* ${formattedDate} às ${resolvedTime}h\n` +
      `*Local:* ${resolvedCommunity}\n\n` +
      `*Intenções Apresentadas (${totalNames}):*\n${categoriesText}\n\n` +
      offeredText +
      `A intenção será proclamada no púlpito e apresentada nas orações da Santa Missa.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <Card className="p-6 sm:p-8 max-w-2xl mx-auto space-y-6 text-center border-emerald-500/30 bg-emerald-500/5">
      {/* Ícone de Sucesso */}
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30 shadow-xs">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-1.5">
        <Badge variant="matriz" className="text-[11px] uppercase font-bold tracking-wider">
          Intenções Registradas com Sucesso
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--dash-text-primary)]">
          Deus abençoe suas preces
        </h2>
        <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-md mx-auto">
          Suas intenções foram acolhidas no livro litúrgico digital e serão proclamadas no púlpito antes da Santa Missa.
        </p>
      </div>

      {/* Protocolo Unificado */}
      <div className="inline-block px-5 py-2.5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-xs">
        <span className="text-[11px] font-semibold text-[var(--dash-text-muted)] block uppercase tracking-wider">
          Número do Protocolo
        </span>
        <span className="font-mono text-lg font-bold text-[var(--primary)]">{protocol}</span>
      </div>

      {/* Resumo da Celebração e Intenções */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--dash-border)]">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
            Detalhes da Celebração
          </span>
          <span className="text-xs font-semibold text-[var(--primary)] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Santa Missa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[var(--dash-text-secondary)] block">Data & Horário:</span>
            <span className="font-bold text-[var(--dash-text-primary)]">
              {resolvedDate ? new Date(resolvedDate + 'T12:00:00').toLocaleDateString('pt-BR') : ''} às {resolvedTime}h
            </span>
          </div>

          <div>
            <span className="text-[var(--dash-text-secondary)] block">Local da Missa:</span>
            <span className="font-bold text-[var(--dash-text-primary)]">
              {resolvedCommunity}
            </span>
          </div>

          <div>
            <span className="text-[var(--dash-text-secondary)] block">Oferecido por:</span>
            <span className="font-bold text-[var(--dash-text-primary)] flex items-center gap-1 mt-0.5">
              {resolvedAnonymous ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Anônimo (Sigilo no Púlpito)</span>
                </>
              ) : (
                resolvedOfferedBy || 'Fiel da Comunidade'
              )}
            </span>
          </div>

          <div>
            <span className="text-[var(--dash-text-secondary)] block">WhatsApp:</span>
            <span className="font-bold text-[var(--dash-text-primary)]">
              {resolvedPhone || 'Não informado'}
            </span>
          </div>
        </div>

        {/* Bloco das Categorias e Nomes */}
        <div className="pt-2 border-t border-[var(--dash-border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--dash-text-primary)]">
              Intenções Registradas por Categoria
            </span>
            <Badge variant="outline" className="text-[10px]">
              {totalNames} {totalNames === 1 ? 'nome' : 'nomes no total'}
            </Badge>
          </div>

          <div className="space-y-2.5">
            {resolvedCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[var(--dash-text-primary)]">
                  <span className="flex items-center gap-1.5">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                  <span className="text-[11px] text-[var(--dash-text-muted)] font-normal">
                    ({cat.names.length} {cat.names.length === 1 ? 'nome' : 'nomes'})
                  </span>
                </div>

                <ul className="pl-4 list-disc text-xs text-[var(--dash-text-secondary)] space-y-0.5">
                  {cat.names.map((name, nIdx) => (
                    <li key={nIdx} className="font-medium text-[var(--dash-text-primary)]">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Espórtula Espontânea (PIX) */}
      {parish.pix_key && (
        <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-left space-y-2.5">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[var(--primary)]" />
            <h4 className="text-xs font-bold text-[var(--dash-text-primary)]">
              Espórtula / Contribuição Espontânea (Opcional)
            </h4>
          </div>
          <p className="text-[11px] text-[var(--dash-text-secondary)] leading-relaxed">
            A oração da Santa Missa é um dom sagrado e gratuito. Caso sinta no coração o desejo fraterno de contribuir com a espórtula sacerdotal ou manutenção do templo, utilize a chave PIX paroquial:
          </p>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-xs">
            <span className="font-mono text-[var(--dash-text-primary)] font-semibold truncate mr-2">
              {parish.pix_key}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyPix}
              className="shrink-0 min-h-[36px] gap-1.5 cursor-pointer"
            >
              {copiedPix ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar PIX</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          type="button"
          onClick={handleShareWhatsApp}
          className="w-full sm:w-auto min-h-[44px] bg-[#25D366] hover:bg-[#20ba59] text-white font-bold gap-2 rounded-xl cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartilhar Comprovante</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="w-full sm:w-auto min-h-[44px] font-bold rounded-xl cursor-pointer"
        >
          <span>Enviar Nova Intenção</span>
        </Button>
      </div>
    </Card>
  );
}
