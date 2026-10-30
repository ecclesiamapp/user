'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { ParishSpecialEvent, Community, EventType, EventStatus, EventColorPreset } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { EVENT_COLOR_PRESETS } from '@/lib/events';
import { EventFormFields } from './EventFormFields';

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

  const handleManualSlugChange = (val: string) => {
    setSlug(val);
    setSlugManuallyEdited(true);
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
                Configure os dados da celebração, tema, lema, arte panorâmica e visibilidade no portal.
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

        <EventFormFields
          title={title}
          onTitleChange={handleTitleChange}
          slug={slug}
          onManualSlugChange={handleManualSlugChange}
          eventType={eventType}
          onEventTypeChange={setEventType}
          communityId={communityId}
          onCommunityIdChange={setCommunityId}
          communities={communities}
          theme={theme}
          onThemeChange={setTheme}
          motto={motto}
          onMottoChange={setMotto}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          description={description}
          onDescriptionChange={setDescription}
          colorPreset={colorPreset}
          onSelectPreset={handleSelectPreset}
          primaryColor={primaryColor}
          onChangePrimary={setPrimaryColor}
          secondaryColor={secondaryColor}
          onChangeSecondary={setSecondaryColor}
          accentColor={accentColor}
          onChangeAccent={setAccentColor}
          bannerUrl={bannerUrl}
          onBannerUrlChange={setBannerUrl}
          status={status}
          onStatusChange={setStatus}
          isFeaturedHome={isFeaturedHome}
          onIsFeaturedHomeChange={setIsFeaturedHome}
          saving={saving}
          isEditing={Boolean(eventToEdit)}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
