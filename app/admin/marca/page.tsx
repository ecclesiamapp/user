'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Palette, 
  Sparkles, 
  Save, 
  Printer, 
  Eye, 
  Shield, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { 
  BrandIdentity, 
  BrandPreset, 
  DEFAULT_BRAND_IDENTITY, 
  ECCLESIAM_APP_DEFAULT,
  CATEDRAL_PARISH_ID, 
  getParishBrandIdentity,
  BrandColors,
  BrandFonts,
  BrandLogos
} from '@/lib/brand';
import { 
  BrandPresetsSelector, 
  BrandColorPaletteEditor, 
  BrandLogoUploader, 
  BrandLivePreviewMockup,
  BrandManualExtractorCard,
  BrandTypographyEditor
} from '@/components/admin/brand';
import { createClient } from '@supabase/supabase-js';

type TabKey = 'moodboard' | 'ai-manual' | 'logos' | 'preview';

export default function AdminMarcaPage() {
  const [identity, setIdentity] = useState<BrandIdentity>(DEFAULT_BRAND_IDENTITY);
  const [activeTab, setActiveTab] = useState<TabKey>('moodboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Carrega a identidade inicial da Catedral no Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getParishBrandIdentity(CATEDRAL_PARISH_ID);
        setIdentity(data);
      } catch (err) {
        console.error('[AdminMarcaPage] Erro ao carregar identidade:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Handler para troca de Preset Canônico
  const handleSelectPreset = (preset: BrandPreset) => {
    setIdentity((prev) => ({
      ...prev,
      theme_preset: preset.id,
      colors: preset.colors,
      fonts: preset.fonts,
      updated_at: new Date().toISOString(),
    }));
    setIsDirty(true);
    setSaveMessage(null);
  };

  // Handler para alteração de cor pontual
  const handleChangeColor = (key: keyof BrandColors, value: string) => {
    setIdentity((prev) => ({
      ...prev,
      theme_preset: 'custom',
      colors: {
        ...prev.colors,
        [key]: value,
      },
      updated_at: new Date().toISOString(),
    }));
    setIsDirty(true);
    setSaveMessage(null);
  };

  // Handler para alteração de fontes
  const handleChangeFonts = (fonts: BrandFonts) => {
    setIdentity((prev) => ({
      ...prev,
      fonts,
      updated_at: new Date().toISOString(),
    }));
    setIsDirty(true);
    setSaveMessage(null);
  };

  // Handler para alteração de logos
  const handleChangeLogo = (key: keyof BrandLogos, url: string) => {
    setIdentity((prev) => ({
      ...prev,
      logos: {
        ...prev.logos,
        [key]: url,
      },
      updated_at: new Date().toISOString(),
    }));
    setIsDirty(true);
    setSaveMessage(null);
  };

  // Handler ao aplicar extração do manual via IA
  const handleApplyExtracted = (extracted: any, manualUrl?: string) => {
    setIdentity((prev) => ({
      ...prev,
      theme_preset: extracted.theme_preset || 'custom',
      colors: extracted.colors,
      fonts: extracted.fonts,
      tagline: extracted.tagline || prev.tagline,
      manual_pdf_url: manualUrl || prev.manual_pdf_url,
      updated_at: new Date().toISOString(),
    }));
    setIsDirty(true);
    setActiveTab('moodboard');
    setSaveMessage('Dados do manual aplicados ao Moodboard com sucesso! Não se esqueça de salvar.');
  };

  // Handler para restaurar o Padrão Oficial do Ecclesiam App
  const handleRestoreDefaults = () => {
    setIdentity((prev) => ({
      ...prev,
      theme_preset: ECCLESIAM_APP_DEFAULT.theme_preset,
      colors: ECCLESIAM_APP_DEFAULT.colors,
      fonts: ECCLESIAM_APP_DEFAULT.fonts,
      tagline: ECCLESIAM_APP_DEFAULT.tagline,
      updated_at: new Date().toISOString(),
      logos: prev.logos, // Preserva brasões cadastrados da paróquia
      manual_pdf_url: prev.manual_pdf_url,
    }));
    setIsDirty(true);
    setSaveMessage('Cores e fontes restauradas para o Padrão Oficial do Ecclesiam App! Clique em "Salvar & Publicar Alterações" para aplicar no portal.');
  };

  // Salvar alterações no Supabase
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const payload = {
        ...identity,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('parishes')
        .update({
          brand_identity: payload,
          primary_color: identity.colors.primary,
          brand_manual_url: identity.manual_pdf_url || null,
          logo_url: identity.logos.main_url || null,
        })
        .eq('id', CATEDRAL_PARISH_ID);

      if (error) throw error;

      setIsDirty(false);
      setSaveMessage('Identidade visual e Moodboard publicados com sucesso no portal!');
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (err: any) {
      console.error('[AdminMarcaPage] Erro ao salvar:', err);
      alert('Erro ao salvar no banco de dados. Verifique a conexão.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-[var(--dash-text-muted)] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFA82A]" />
        <p className="text-xs font-semibold">Carregando Hub de Marca & Moodboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header com Título e Ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--dash-border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFA82A]/10 text-[#FFA82A] border border-[#FFA82A]/20">
              Identidade Visual & Theming
            </span>
            <span className="text-xs text-[var(--dash-text-muted)]">• White-Label Oficial</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--dash-text-primary)] mt-1 flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-[#FFA82A]" />
            <span>Hub de Marca & Moodboard Eclesial</span>
          </h1>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Personalize as cores, brasões e tipografias do portal da Catedral. Utilize IA para ler o manual oficial ou selecione presets canônicos.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-500 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Restaurar padrão oficial de cores e fontes do Ecclesiam App"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Restaurar Padrão do App</span>
          </button>

          <Link
            href="/admin/marca/imprimir-guia"
            className="px-3.5 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:bg-[var(--dash-surface-hover)] text-xs font-semibold text-[var(--dash-text-primary)] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#FFA82A]" />
            <span>Guia da PASCOM (A4)</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer ${
              isDirty
                ? 'bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white hover:opacity-95 ring-2 ring-[#FFA82A]/50'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publicando...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isDirty ? 'Salvar & Publicar Alterações' : 'Publicado no Portal'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {saveMessage && (
        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Abas de Navegação */}
      <div className="flex items-center gap-1.5 border-b border-[var(--dash-border)] overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('moodboard')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'moodboard'
              ? 'bg-[#FFA82A] text-[var(--dash-text-primary)] shadow-xs'
              : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Moodboard & Cores</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai-manual')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ai-manual'
              ? 'bg-[#FFA82A] text-[var(--dash-text-primary)] shadow-xs'
              : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Manual de Marca com IA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logos')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'logos'
              ? 'bg-[#FFA82A] text-[var(--dash-text-primary)] shadow-xs'
              : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Brasões & Ícones</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'preview'
              ? 'bg-[#FFA82A] text-[var(--dash-text-primary)] shadow-xs'
              : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Simulador Live Preview</span>
        </button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="space-y-6">
        {activeTab === 'moodboard' && (
          <div className="space-y-6">
            <BrandPresetsSelector
              currentPreset={identity.theme_preset}
              onSelectPreset={handleSelectPreset}
            />
            <BrandColorPaletteEditor
              colors={identity.colors}
              onChangeColor={handleChangeColor}
              onResetColors={handleRestoreDefaults}
            />
            <BrandTypographyEditor
              fonts={identity.fonts}
              tagline={identity.tagline}
              onChangeFonts={handleChangeFonts}
              onChangeTagline={(tagline) => {
                setIdentity((prev) => ({ ...prev, tagline }));
                setIsDirty(true);
              }}
              onResetFonts={() => {
                handleChangeFonts(ECCLESIAM_APP_DEFAULT.fonts);
                setSaveMessage('Fontes oficiais do Ecclesiam App restauradas (Sora + Plus Jakarta Sans).');
              }}
            />
          </div>
        )}

        {activeTab === 'ai-manual' && (
          <BrandManualExtractorCard
            currentManualUrl={identity.manual_pdf_url}
            onApplyExtracted={handleApplyExtracted}
            parishId={CATEDRAL_PARISH_ID}
          />
        )}

        {activeTab === 'logos' && (
          <BrandLogoUploader
            logos={identity.logos}
            onChangeLogo={handleChangeLogo}
            parishId={CATEDRAL_PARISH_ID}
          />
        )}

        {activeTab === 'preview' && (
          <BrandLivePreviewMockup
            colors={identity.colors}
            fonts={identity.fonts}
            logos={identity.logos}
            parishName="Catedral Sagrado Coração de Jesus"
            tagline={identity.tagline || 'Diocese de Colatina • Espírito Santo'}
          />
        )}
      </div>
    </div>
  );
}
