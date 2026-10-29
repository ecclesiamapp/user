'use client';

import React from 'react';
import { Church, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui';
import { ImageUploaderField } from '@/components/admin/shared/ImageUploaderField';

interface CommunityGeneralTabProps {
  name: string;
  setName: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  patronSaint: string;
  setPatronSaint: (val: string) => void;
  isHeadquarters: boolean;
  setIsHeadquarters: (val: boolean) => void;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  bannerUrl: string;
  setBannerUrl: (val: string) => void;
  patronImageUrl: string;
  setPatronImageUrl: (val: string) => void;
  onNameChange: (val: string) => void;
}

export function CommunityGeneralTab({
  name,
  slug,
  setSlug,
  patronSaint,
  setPatronSaint,
  isHeadquarters,
  setIsHeadquarters,
  isActive,
  setIsActive,
  imageUrl,
  setImageUrl,
  bannerUrl,
  setBannerUrl,
  patronImageUrl,
  setPatronImageUrl,
  onNameChange,
}: CommunityGeneralTabProps) {
  return (
    <div className="space-y-5">
      <Input
        label="Nome da Comunidade *"
        required
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Ex: Comunidade São José Operário"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Santo(a) Padroeiro(a)"
          value={patronSaint}
          onChange={(e) => setPatronSaint(e.target.value)}
          placeholder="Ex: São José Operário"
        />

        <Input
          label="Slug da URL (Minisite Público)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="ex: sao-jose-operario"
        />
      </div>

      {/* Grid de Upload & Recorte de Fotos no Storage */}
      <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)]/50 border border-[var(--dash-border)] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--dash-border)]">
          <ImageIcon className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-primary)]">
            Mídias Oficiais & Fotos do Templo (Storage)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Foto da Fachada */}
          <ImageUploaderField
            label="Foto da Fachada da Comunidade"
            value={imageUrl}
            onChange={setImageUrl}
            folder="comunidades"
            aspectRatio={16 / 9}
            placeholder="Foto frontal ou externa da igreja"
          />

          {/* Foto do Altar / Presbitério */}
          <ImageUploaderField
            label="Foto do Altar / Presbitério (Capa Hero)"
            value={bannerUrl}
            onChange={setBannerUrl}
            folder="comunidades"
            aspectRatio={16 / 9}
            placeholder="Visão panorâmica do altar interno"
          />
        </div>

        {/* Foto ou Estampa do Padroeiro */}
        <div className="pt-2 border-t border-[var(--dash-border)]/60">
          <ImageUploaderField
            label="Imagem do Santo Padroeiro (Ícone / Imagem Sacra)"
            value={patronImageUrl}
            onChange={setPatronImageUrl}
            folder="comunidades"
            aspectRatio={1}
            placeholder="Foto da imagem sacra ou pintura oficial do padroeiro"
          />
        </div>
      </div>

      {/* Configurações de Status */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="is_headquarters"
            checked={isHeadquarters}
            onChange={(e) => setIsHeadquarters(e.target.checked)}
            className="w-4 h-4 rounded-md text-[var(--primary)] border-[var(--dash-border)] focus:ring-[var(--primary)] cursor-pointer"
          />
          <label
            htmlFor="is_headquarters"
            className="text-xs font-semibold text-[var(--dash-text-primary)] cursor-pointer select-none"
          >
            Esta comunidade é a Catedral (Sede Paroquial)?
          </label>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded-md text-[var(--primary)] border-[var(--dash-border)] focus:ring-[var(--primary)] cursor-pointer"
          />
          <label
            htmlFor="is_active"
            className="text-xs font-semibold text-[var(--dash-text-primary)] cursor-pointer select-none"
          >
            Comunidade Ativa
          </label>
        </div>
      </div>
    </div>
  );
}
