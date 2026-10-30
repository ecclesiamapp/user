'use client';

import React from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Loader2,
  Tag,
  Star,
} from 'lucide-react';
import { Community, EventType, EventStatus, EventColorPreset } from '@/types';
import { ImageUploaderField } from '@/components/admin/shared/ImageUploaderField';
import { EVENT_TYPES, EVENT_STATUSES } from './eventConstants';
import { EventColorThemeSelector } from './EventColorThemeSelector';

interface EventFormFieldsProps {
  title: string;
  onTitleChange: (val: string) => void;
  slug: string;
  onManualSlugChange: (val: string) => void;
  eventType: EventType;
  onEventTypeChange: (val: EventType) => void;
  communityId: string;
  onCommunityIdChange: (val: string) => void;
  communities: Community[];
  theme: string;
  onThemeChange: (val: string) => void;
  motto: string;
  onMottoChange: (val: string) => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  colorPreset: EventColorPreset;
  onSelectPreset: (preset: EventColorPreset) => void;
  primaryColor: string;
  onChangePrimary: (color: string) => void;
  secondaryColor: string;
  onChangeSecondary: (color: string) => void;
  accentColor: string;
  onChangeAccent: (color: string) => void;
  bannerUrl: string;
  onBannerUrlChange: (url: string) => void;
  status: EventStatus;
  onStatusChange: (val: EventStatus) => void;
  isFeaturedHome: boolean;
  onIsFeaturedHomeChange: (val: boolean) => void;
  saving: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EventFormFields({
  title,
  onTitleChange,
  slug,
  onManualSlugChange,
  eventType,
  onEventTypeChange,
  communityId,
  onCommunityIdChange,
  communities,
  theme,
  onThemeChange,
  motto,
  onMottoChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  description,
  onDescriptionChange,
  colorPreset,
  onSelectPreset,
  primaryColor,
  onChangePrimary,
  secondaryColor,
  onChangeSecondary,
  accentColor,
  onChangeAccent,
  bannerUrl,
  onBannerUrlChange,
  status,
  onStatusChange,
  isFeaturedHome,
  onIsFeaturedHomeChange,
  saving,
  isEditing,
  onCancel,
  onSubmit,
}: EventFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      {/* Título & Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider mb-1.5">
            Título da Celebração *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Ex: Festa da Co-Padroeira 2026"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#FFA82A]" />
            <span>Slug da URL *</span>
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => onManualSlugChange(e.target.value)}
            placeholder="festa-copadroeira-2026"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs font-mono text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
          />
          <span className="text-[10px] text-[var(--dash-text-muted)] mt-1 block">
            Link público: /programacao/{slug || '...'}
          </span>
        </div>
      </div>

      {/* Tipo de Evento & Comunidade Vinculada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider mb-1.5">
            Tipo da Festividade
          </label>
          <select
            value={eventType}
            onChange={(e) => onEventTypeChange(e.target.value as EventType)}
            className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Comunidade / Local</span>
          </label>
          <select
            value={communityId}
            onChange={(e) => onCommunityIdChange(e.target.value)}
            className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
          >
            <option value="">Catedral Sagrado Coração de Jesus (Sede)</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tema e Lema */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider mb-1.5">
            Tema Pastoral (opcional)
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
            placeholder="Ex: Com Maria, peregrinos da oração e da esperança"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider mb-1.5">
            Lema Bíblico (opcional)
          </label>
          <input
            type="text"
            value={motto}
            onChange={(e) => onMottoChange(e.target.value)}
            placeholder="Ex: Fazei tudo o que Ele vos disser (Jo 2,5)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
          />
        </div>
      </div>

      {/* Datas de Início e Término */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#FFA82A]" />
            <span>Data de Início *</span>
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#FFA82A]" />
            <span>Data de Término *</span>
          </label>
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
          />
        </div>
      </div>

      {/* Descrição Pastoral */}
      <div>
        <label className="block text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider mb-1.5">
          Mensagem Pastoral de Apresentação (opcional)
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Apresente aos fiéis o espírito da festividade, motivações e convite oficial dos padres..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50 resize-none"
        />
      </div>

      {/* Sistema de Cores e Temas Litúrgicos da Festa */}
      <EventColorThemeSelector
        selectedPreset={colorPreset}
        onSelectPreset={onSelectPreset}
        primaryColor={primaryColor}
        onChangePrimary={onChangePrimary}
        secondaryColor={secondaryColor}
        onChangeSecondary={onChangeSecondary}
        accentColor={accentColor}
        onChangeAccent={onChangeAccent}
      />

      {/* Upload de Arte Panorâmica 16:9 com Crop & Compress */}
      <div className="pt-2">
        <ImageUploaderField
          label="Arte Panorâmica do Topo (16:9 WebP)"
          value={bannerUrl}
          onChange={(url) => onBannerUrlChange(url)}
          folder="cartazes"
          bucket="event_assets"
          aspectRatio={16 / 9}
          placeholder="/images/festas/copadroeira-nossa-senhora-das-gracas.webp"
          presets={[
            {
              label: 'Nossa Senhora das Graças (16:9)',
              url: '/images/festas/copadroeira-nossa-senhora-das-gracas.webp',
            },
          ]}
        />
      </div>

      {/* Status & Destaque na Home */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider mb-1.5">
            Status da Publicação
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as EventStatus)}
            className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
          >
            {EVENT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label} ({s.description})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] cursor-pointer hover:border-[#FFA82A]/40 transition-colors">
            <input
              type="checkbox"
              checked={isFeaturedHome}
              onChange={(e) => onIsFeaturedHomeChange(e.target.checked)}
              className="w-4 h-4 rounded text-[#8B1E22] focus:ring-[#8B1E22] cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-[var(--dash-text-primary)] flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Destaque na Página Inicial (Home)</span>
              </span>
              <span className="text-[11px] text-[var(--dash-text-muted)] block">
                Exibe banner hero e contagem regressiva
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Rodapé do Modal */}
      <div className="pt-4 border-t border-[var(--dash-border)] flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2.5 rounded-xl border border-[var(--dash-border)] text-xs font-bold text-[var(--dash-text-secondary)] hover:bg-[var(--dash-surface-hover)] transition-colors min-h-[44px] cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 min-h-[44px] cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{isEditing ? 'Atualizar Festa' : 'Criar Festa'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
