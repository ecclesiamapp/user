'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  MapPin, 
  FileText, 
  Loader2, 
  AlertCircle,
  Tag,
  Star
} from 'lucide-react';
import { ParishSpecialEvent, Community, EventType, EventStatus, EventColorPreset } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { ImageUploaderField } from '@/components/admin/shared/ImageUploaderField';
import { EVENT_TYPES, EVENT_STATUSES } from './eventConstants';
import { EVENT_COLOR_PRESETS } from '@/lib/events';
import { EventColorThemeSelector } from './EventColorThemeSelector';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedEvent: ParishSpecialEvent, msg: string) => void;
  eventToEdit?: ParishSpecialEvent | null;
  communities: Community[];
  parishId: string;
}

export function EventFormModal({
  isOpen,
  onClose,
  onSuccess,
  eventToEdit,
  communities,
  parishId,
}: EventFormModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [eventType, setEventType] = useState<EventType>('copadroeira');
  const [communityId, setCommunityId] = useState<string>('');
  const [theme, setTheme] = useState('');
  const [motto, setMotto] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [posterPdfUrl, setPosterPdfUrl] = useState('');
  const [isFeaturedHome, setIsFeaturedHome] = useState(true);
  const [status, setStatus] = useState<EventStatus>('destaque_ativo');

  // Cores Temáticas da Festividade
  const [colorPreset, setColorPreset] = useState<EventColorPreset>('sagrado_coracao');
  const [primaryColor, setPrimaryColor] = useState('#8B1E22');
  const [secondaryColor, setSecondaryColor] = useState('#FFA82A');
  const [accentColor, setAccentColor] = useState('#FFFFFF');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  // Helper para gerar slug automático
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setSlug(eventToEdit.slug);
      setSlugManuallyEdited(true);
      setEventType(eventToEdit.event_type);
      setCommunityId(eventToEdit.community_id || '');
      setTheme(eventToEdit.theme || '');
      setMotto(eventToEdit.motto || '');
      setDescription(eventToEdit.description || '');
      setStartDate(eventToEdit.start_date);
      setEndDate(eventToEdit.end_date);
      setBannerUrl(eventToEdit.banner_url || '');
      setPosterPdfUrl(eventToEdit.poster_pdf_url || '');
      setIsFeaturedHome(eventToEdit.is_featured_home);
      setStatus(eventToEdit.status);
      setColorPreset(eventToEdit.color_preset || 'sagrado_coracao');
      setPrimaryColor(eventToEdit.primary_color || '#8B1E22');
      setSecondaryColor(eventToEdit.secondary_color || '#FFA82A');
      setAccentColor(eventToEdit.accent_color || '#FFFFFF');
    } else {
      setTitle('');
      setSlug('');
      setSlugManuallyEdited(false);
      setEventType('copadroeira');
      setCommunityId('');
      setTheme('');
      setMotto('');
      setDescription('');
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
      setEndDate(today);
      setBannerUrl('');
      setPosterPdfUrl('');
      setIsFeaturedHome(true);
      setStatus('destaque_ativo');
      setColorPreset('sagrado_coracao');
      setPrimaryColor('#8B1E22');
      setSecondaryColor('#FFA82A');
      setAccentColor('#FFFFFF');
    }
    setErrorMsg(null);
  }, [eventToEdit, isOpen]);

  const handleSelectPreset = (preset: EventColorPreset) => {
    setColorPreset(preset);
    if (preset !== 'custom' && EVENT_COLOR_PRESETS[preset]) {
      setPrimaryColor(EVENT_COLOR_PRESETS[preset].primary);
      setSecondaryColor(EVENT_COLOR_PRESETS[preset].secondary);
      setAccentColor(EVENT_COLOR_PRESETS[preset].accent);
    }
  };

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Informe o título da festa ou solenidade.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Informe um slug válido para a URL da festa.');
      return;
    }
    if (!startDate || !endDate) {
      setErrorMsg('Informe as datas de início e término da programação.');
      return;
    }
    if (endDate < startDate) {
      setErrorMsg('A data de término não pode ser anterior à data de início.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        parish_id: parishId,
        community_id: communityId ? communityId : null,
        title: title.trim(),
        slug: slug.trim(),
        event_type: eventType,
        theme: theme.trim() || null,
        motto: motto.trim() || null,
        description: description.trim() || null,
        start_date: startDate,
        end_date: endDate,
        banner_url: bannerUrl.trim() || null,
        poster_pdf_url: posterPdfUrl.trim() || null,
        is_featured_home: isFeaturedHome,
        status,
        color_preset: colorPreset,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
        updated_at: new Date().toISOString(),
      };

      if (eventToEdit) {
        const { data, error } = await supabase
          .from('parish_special_events')
          .update(payload)
          .eq('id', eventToEdit.id)
          .select()
          .single();

        if (error) throw error;
        onSuccess(data as ParishSpecialEvent, 'Festa atualizada com sucesso!');
      } else {
        const { data, error } = await supabase
          .from('parish_special_events')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        onSuccess(data as ParishSpecialEvent, 'Nova festa criada com sucesso!');
      }

      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar festa:', err);
      if (err?.code === '23505') {
        setErrorMsg('Já existe uma festividade cadastrada com este mesmo slug. Escolha outro slug.');
      } else {
        setErrorMsg(err?.message || 'Falha ao salvar as informações da festa.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl shadow-2xl p-5 sm:p-7 text-[var(--dash-text-primary)] my-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--dash-border)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#8B1E22]/15 text-[#8B1E22] dark:text-[#FFCC36] border border-[#C8A463]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-[var(--dash-text-primary)]">
                {eventToEdit ? 'Editar Festa / Solenidade' : 'Criar Nova Festa ou Solenidade'}
              </h3>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Configure os dados da celebração, tema, lema, cartaz e visibilidade no portal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
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
                onChange={(e) => handleTitleChange(e.target.value)}
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
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
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
                onChange={(e) => setEventType(e.target.value as EventType)}
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
                onChange={(e) => setCommunityId(e.target.value)}
                className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50"
              >
                <option value="">Catedral Sagrado Coração de Jesus (Matriz)</option>
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
                onChange={(e) => setTheme(e.target.value)}
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
                onChange={(e) => setMotto(e.target.value)}
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
                onChange={(e) => setStartDate(e.target.value)}
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
                onChange={(e) => setEndDate(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Apresente aos fiéis o espírito da festividade, motivações e convite oficial dos padres..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/50 resize-none"
            />
          </div>

          {/* Sistema de Cores e Temas Litúrgicos da Festa */}
          <EventColorThemeSelector
            selectedPreset={colorPreset}
            onSelectPreset={handleSelectPreset}
            primaryColor={primaryColor}
            onChangePrimary={setPrimaryColor}
            secondaryColor={secondaryColor}
            onChangeSecondary={setSecondaryColor}
            accentColor={accentColor}
            onChangeAccent={setAccentColor}
          />

          {/* Upload de Cartaz Oficial com Crop & Compress */}
          <div className="pt-2">
            <ImageUploaderField
              label="Cartaz Oficial da Festa (Banner WebP)"
              value={bannerUrl}
              onChange={(url) => setBannerUrl(url)}
              folder="cartazes"
              bucket="event_assets"
              placeholder="/images/festas/cartaz-oficial.webp"
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
                onChange={(e) => setStatus(e.target.value as EventStatus)}
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
                  onChange={(e) => setIsFeaturedHome(e.target.checked)}
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
              onClick={onClose}
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
                  <span>{eventToEdit ? 'Atualizar Festa' : 'Criar Festa'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
