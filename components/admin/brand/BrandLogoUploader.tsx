'use client';

import React, { useState } from 'react';
import { Shield, Upload, Link as LinkIcon, Eye, Check, Loader2, X } from 'lucide-react';
import { BrandLogos, CATEDRAL_PARISH_ID } from '@/lib/brand';
import { createClient } from '@supabase/supabase-js';

interface BrandLogoUploaderProps {
  logos: BrandLogos;
  onChangeLogo: (key: keyof BrandLogos, url: string) => void;
  parishId?: string;
}

interface LogoSlotMeta {
  key: keyof BrandLogos;
  title: string;
  subtitle: string;
  recommendation: string;
  idealDimensions: string;
  aspectRatio: 'square' | 'wide';
}

const LOGO_SLOTS: LogoSlotMeta[] = [
  {
    key: 'main_url',
    title: 'Brasão Oficial Principal',
    subtitle: 'Aplicação policromática padrão',
    recommendation: 'Utilizado no topo do portal, cabeçalho e páginas oficiais da catedral.',
    idealDimensions: 'PNG transparente ou SVG, mín. 512x512px',
    aspectRatio: 'square',
  },
  {
    key: 'negative_url',
    title: 'Versão Negativa / Monocromática',
    subtitle: 'Brasão branco com transparência',
    recommendation: 'Utilizado sobre fundos escuros, rodapé solene e telões de transmissão.',
    idealDimensions: 'PNG branco transparente ou SVG',
    aspectRatio: 'square',
  },
  {
    key: 'favicon_url',
    title: 'Ícone PWA & Favicon',
    subtitle: 'Ícone compacto de aplicativo',
    recommendation: 'Aparece na aba do navegador e na tela inicial de celulares dos fiéis.',
    idealDimensions: 'Ícone quadrado 512x512px, PNG',
    aspectRatio: 'square',
  },
];

export function BrandLogoUploader({
  logos,
  onChangeLogo,
  parishId = CATEDRAL_PARISH_ID,
}: BrandLogoUploaderProps) {
  const [uploadingKey, setUploadingKey] = useState<keyof BrandLogos | null>(null);
  const [showManualUrl, setShowManualUrl] = useState<Record<string, boolean>>({});
  const [previewBg, setPreviewBg] = useState<'light' | 'dark' | 'checker'>('checker');

  const handleFileUpload = async (key: keyof BrandLogos, file: File) => {
    try {
      setUploadingKey(key);
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const ext = file.name.split('.').pop() || 'png';
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const filePath = `${parishId}/logos/${Date.now()}_${key}_${cleanName}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('brand_assets')
        .upload(filePath, file, {
          contentType: file.type || 'image/png',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('brand_assets')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        onChangeLogo(key, publicUrlData.publicUrl);
      }
    } catch (err: any) {
      console.error('[BrandLogoUploader Error]:', err);
      alert('Erro ao enviar imagem do brasão. Verifique sua conexão.');
    } finally {
      setUploadingKey(null);
    }
  };

  const toggleManualUrl = (slotKey: string) => {
    setShowManualUrl((prev) => ({ ...prev, [slotKey]: !prev[slotKey] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dash-text-primary)] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FFA82A]" />
            <span>Brasões e Variações de Logotipo</span>
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Cadastre as variações do brasão oficial. O portal adapta a versão automaticamente de acordo com o fundo.
          </p>
        </div>

        {/* Alternador de Fundo de Inspeção */}
        <div className="flex items-center gap-1 bg-[var(--dash-surface-hover)] p-1 rounded-xl border border-[var(--dash-border)] self-start sm:self-auto">
          <span className="text-[10px] text-[var(--dash-text-muted)] font-semibold px-2">
            Fundo do Preview:
          </span>
          <button
            type="button"
            onClick={() => setPreviewBg('checker')}
            className={`px-2 py-1 text-[10px] rounded-lg font-medium transition-all cursor-pointer ${
              previewBg === 'checker' ? 'bg-[#FFA82A] text-[var(--dash-text-primary)] font-bold' : 'text-[var(--dash-text-secondary)]'
            }`}
          >
            Xadrez
          </button>
          <button
            type="button"
            onClick={() => setPreviewBg('light')}
            className={`px-2 py-1 text-[10px] rounded-lg font-medium transition-all cursor-pointer ${
              previewBg === 'light' ? 'bg-[#FFA82A] text-[var(--dash-text-primary)] font-bold' : 'text-[var(--dash-text-secondary)]'
            }`}
          >
            Claro
          </button>
          <button
            type="button"
            onClick={() => setPreviewBg('dark')}
            className={`px-2 py-1 text-[10px] rounded-lg font-medium transition-all cursor-pointer ${
              previewBg === 'dark' ? 'bg-[#FFA82A] text-[var(--dash-text-primary)] font-bold' : 'text-[var(--dash-text-secondary)]'
            }`}
          >
            Escuro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {LOGO_SLOTS.map((slot) => {
          const currentUrl = logos[slot.key];
          const isUploading = uploadingKey === slot.key;
          const isManualVisible = showManualUrl[slot.key];

          return (
            <div
              key={slot.key}
              className="p-3.5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--dash-border-hover)] transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold text-[var(--dash-text-primary)]">
                    {slot.title}
                  </h4>
                  <button
                    type="button"
                    onClick={() => toggleManualUrl(slot.key)}
                    className="text-[10px] text-[#FFA82A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>{isManualVisible ? 'Ocultar' : 'URL'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[var(--dash-text-secondary)]">
                  {slot.subtitle}
                </p>
              </div>

              {/* Área de Preview da Imagem */}
              <div
                className={`relative w-full h-36 rounded-xl overflow-hidden border border-[var(--dash-border)] flex items-center justify-center p-3 transition-colors ${
                  previewBg === 'dark'
                    ? 'bg-neutral-900'
                    : previewBg === 'light'
                    ? 'bg-neutral-100'
                    : 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px] bg-[var(--dash-surface)]'
                }`}
              >
                {currentUrl ? (
                  <div className="relative group w-full h-full flex items-center justify-center">
                    <img
                      src={currentUrl}
                      alt={slot.title}
                      className="max-h-full max-w-full object-contain drop-shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => onChangeLogo(slot.key, '')}
                      className="absolute top-1 right-1 p-1 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                      title="Remover imagem"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-2 text-neutral-400 space-y-1">
                    <Shield className="w-8 h-8 mx-auto opacity-40" />
                    <p className="text-[10px] font-medium">Nenhum brasão carregado</p>
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-1">
                    <Loader2 className="w-5 h-5 animate-spin text-[#FFA82A]" />
                    <span className="text-[10px] font-bold">Enviando...</span>
                  </div>
                )}
              </div>

              {/* Campo Manual de URL se expandido */}
              {isManualVisible && (
                <div className="space-y-1">
                  <input
                    type="url"
                    value={currentUrl || ''}
                    placeholder="https://.../brasao.png"
                    onChange={(e) => onChangeLogo(slot.key, e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-hover)]/40 text-[var(--dash-text-primary)] focus:outline-none focus:border-[#FFA82A]"
                  />
                </div>
              )}

              {/* Botão de Upload Nativo */}
              <label className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-hover)] text-xs font-semibold text-[var(--dash-text-primary)] hover:border-[#FFA82A] hover:text-[#FFA82A] transition-all cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Substituir Brasão</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(slot.key, f);
                  }}
                />
              </label>

              {/* Rodapé de Instrução */}
              <p className="text-[10px] text-[var(--dash-text-muted)] leading-tight pt-1 border-t border-[var(--dash-border)]/50">
                {slot.idealDimensions}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
