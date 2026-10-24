'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Church,
  Users,
  Bell,
  HeartHandshake,
  BookOpen,
  MapPin,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Community, CommunityLeader, CommunityNotice, CommunityPastoralGroup } from '@/types';
import { Button } from '@/components/ui';

import { CommunityGeneralTab } from './CommunityGeneralTab';
import { CommunityCpcTab } from './CommunityCpcTab';
import { CommunityNoticesTab } from './CommunityNoticesTab';
import { CommunityPastoralsTab } from './CommunityPastoralsTab';
import { CommunityHistoryTab } from './CommunityHistoryTab';
import { CommunityLocationTab } from './CommunityLocationTab';

interface CommunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  communityToEdit?: Community | null;
  parishId: string;
}

type TabType = 'geral' | 'cpc' | 'avisos' | 'pastorais' | 'historia' | 'localizacao';

export function CommunityFormModal({
  isOpen,
  onClose,
  onSuccess,
  communityToEdit,
  parishId,
}: CommunityFormModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('geral');

  // Estados dos campos
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [patronSaint, setPatronSaint] = useState('');
  const [isHeadquarters, setIsHeadquarters] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [patronImageUrl, setPatronImageUrl] = useState('');

  // Coleções estruturadas
  const [cpcLeaders, setCpcLeaders] = useState<CommunityLeader[]>([]);
  const [notices, setNotices] = useState<CommunityNotice[]>([]);
  const [pastoralGroups, setPastoralGroups] = useState<CommunityPastoralGroup[]>([]);

  // História & Vocação
  const [history, setHistory] = useState('');
  const [foundationYear, setFoundationYear] = useState('');
  const [feastDay, setFeastDay] = useState('');

  // Localização & Contato
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('Colatina');
  const [state, setState] = useState('ES');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Dízimo & PIX
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState('cnpj');
  const [dizimoInfo, setDizimoInfo] = useState('');

  // Estados de controle
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (communityToEdit) {
      setName(communityToEdit.name || '');
      setSlug(communityToEdit.slug || generateSlug(communityToEdit.name || ''));
      setPatronSaint(communityToEdit.patron_saint || '');
      setIsHeadquarters(Boolean(communityToEdit.is_headquarters));
      setIsActive(communityToEdit.is_active ?? true);
      setImageUrl(communityToEdit.image_url || '');
      setBannerUrl(communityToEdit.banner_url || '');
      setPatronImageUrl(communityToEdit.patron_image_url || '');

      setCpcLeaders(Array.isArray(communityToEdit.cpc_leaders) ? communityToEdit.cpc_leaders : []);
      setNotices(Array.isArray(communityToEdit.notices) ? communityToEdit.notices : []);
      setPastoralGroups(Array.isArray(communityToEdit.pastoral_groups) ? communityToEdit.pastoral_groups : []);

      setHistory(communityToEdit.history || '');
      setFoundationYear(communityToEdit.foundation_year || '');
      setFeastDay(communityToEdit.feast_day || '');

      setAddress(communityToEdit.address || '');
      setNeighborhood(communityToEdit.neighborhood || '');
      setCity(communityToEdit.city || 'Colatina');
      setState(communityToEdit.state || 'ES');
      setContactName(communityToEdit.contact_name || '');
      setContactPhone(communityToEdit.contact_phone || '');

      setPixKey(communityToEdit.pix_key || '');
      setPixKeyType(communityToEdit.pix_key_type || 'cnpj');
      setDizimoInfo(communityToEdit.dizimo_info || '');
    } else {
      setName('');
      setSlug('');
      setPatronSaint('');
      setIsHeadquarters(false);
      setIsActive(true);
      setImageUrl('');
      setBannerUrl('');
      setPatronImageUrl('');

      setCpcLeaders([]);
      setNotices([]);
      setPastoralGroups([]);

      setHistory('');
      setFoundationYear('');
      setFeastDay('');

      setAddress('');
      setNeighborhood('');
      setCity('Colatina');
      setState('ES');
      setContactName('');
      setContactPhone('');

      setPixKey('');
      setPixKeyType('cnpj');
      setDizimoInfo('');
    }
    setErrorMsg(null);
    setActiveTab('geral');
  }, [communityToEdit, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!communityToEdit) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('O nome da comunidade é obrigatório.');
      setActiveTab('geral');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        parish_id: parishId,
        name: name.trim(),
        slug: slug.trim() || generateSlug(name),
        patron_saint: patronSaint.trim() || null,
        is_headquarters: isHeadquarters,
        is_active: isActive,
        image_url: imageUrl.trim() || null,
        banner_url: bannerUrl.trim() || null,
        patron_image_url: patronImageUrl.trim() || null,
        cpc_leaders: cpcLeaders,
        notices: notices,
        pastoral_groups: pastoralGroups,
        history: history.trim() || null,
        foundation_year: foundationYear.trim() || null,
        feast_day: feastDay.trim() || null,
        address: address.trim() || null,
        neighborhood: neighborhood.trim() || null,
        city: city.trim() || 'Colatina',
        state: state.trim() || 'ES',
        contact_name: contactName.trim() || null,
        contact_phone: contactPhone.trim() || null,
        pix_key: pixKey.trim() || null,
        pix_key_type: pixKeyType,
        dizimo_info: dizimoInfo.trim() || null,
      };

      if (communityToEdit) {
        const { error } = await supabase
          .from('communities')
          .update(payload)
          .eq('id', communityToEdit.id);

        if (error) throw error;
        onSuccess('Comunidade e landing page atualizadas com sucesso!');
      } else {
        const { error } = await supabase.from('communities').insert([payload]);
        if (error) throw error;
        onSuccess('Nova comunidade cadastrada com sucesso!');
      }

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar comunidade';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'geral', label: 'Geral & Fotos', icon: <Church className="w-3.5 h-3.5" /> },
    { id: 'cpc', label: 'Líderes CPC', icon: <Users className="w-3.5 h-3.5" />, badge: cpcLeaders.length },
    { id: 'avisos', label: 'Mural de Avisos', icon: <Bell className="w-3.5 h-3.5" />, badge: notices.length },
    { id: 'pastorais', label: 'Pastorais & Grupos', icon: <HeartHandshake className="w-3.5 h-3.5" />, badge: pastoralGroups.length },
    { id: 'historia', label: 'História & Padroeiro', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'localizacao', label: 'Localização & Dízimo', icon: <MapPin className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[var(--dash-text-primary)]">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--dash-text-primary)]">
                {communityToEdit ? `Editar LP: ${communityToEdit.name}` : 'Nova Comunidade (CEB)'}
              </h2>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Dashboard de gestão da landing page pública e vida comunitária.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-border)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação (Scroll horizontal no mobile) */}
        <div className="flex overflow-x-auto border-b border-[var(--dash-border)] px-4 sm:px-6 pt-2 bg-[var(--dash-surface)] text-xs font-semibold gap-1 shrink-0 no-scrollbar">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap min-h-[42px] ${
                  isActive
                    ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
                    : 'border-transparent text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
                {typeof t.badge === 'number' && t.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-500 text-[10px] font-bold">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Corpo do Formulário com Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'geral' && (
            <CommunityGeneralTab
              name={name}
              setName={setName}
              slug={slug}
              setSlug={setSlug}
              patronSaint={patronSaint}
              setPatronSaint={setPatronSaint}
              isHeadquarters={isHeadquarters}
              setIsHeadquarters={setIsHeadquarters}
              isActive={isActive}
              setIsActive={setIsActive}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              bannerUrl={bannerUrl}
              setBannerUrl={setBannerUrl}
              patronImageUrl={patronImageUrl}
              setPatronImageUrl={setPatronImageUrl}
              onNameChange={handleNameChange}
            />
          )}

          {activeTab === 'cpc' && (
            <CommunityCpcTab leaders={cpcLeaders} onChange={setCpcLeaders} />
          )}

          {activeTab === 'avisos' && (
            <CommunityNoticesTab notices={notices} onChange={setNotices} />
          )}

          {activeTab === 'pastorais' && (
            <CommunityPastoralsTab pastoralGroups={pastoralGroups} onChange={setPastoralGroups} />
          )}

          {activeTab === 'historia' && (
            <CommunityHistoryTab
              foundationYear={foundationYear}
              setFoundationYear={setFoundationYear}
              feastDay={feastDay}
              setFeastDay={setFeastDay}
              history={history}
              setHistory={setHistory}
              slug={slug}
            />
          )}

          {activeTab === 'localizacao' && (
            <CommunityLocationTab
              address={address}
              setAddress={setAddress}
              neighborhood={neighborhood}
              setNeighborhood={setNeighborhood}
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
              contactName={contactName}
              setContactName={setContactName}
              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
              pixKey={pixKey}
              setPixKey={setPixKey}
              pixKeyType={pixKeyType}
              setPixKeyType={setPixKeyType}
              dizimoInfo={dizimoInfo}
              setDizimoInfo={setDizimoInfo}
            />
          )}

          {/* Barra de Ações do Rodapé */}
          <div className="flex items-center justify-between pt-5 border-t border-[var(--dash-border)]">
            <span className="text-[11px] text-[var(--dash-text-secondary)]">
              Alterações são refletidas automaticamente no minisite público da comunidade.
            </span>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={saving}>
                {communityToEdit ? 'Salvar Comunidade' : 'Cadastrar Comunidade'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
