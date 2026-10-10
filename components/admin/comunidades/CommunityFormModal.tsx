'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Church,
  BookOpen,
  MapPin,
  User,
  Sparkles,
  Loader2,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Community } from '@/types';
import { Button, Input } from '@/components/ui';

interface CommunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  communityToEdit?: Community | null;
  parishId: string;
}

export function CommunityFormModal({
  isOpen,
  onClose,
  onSuccess,
  communityToEdit,
  parishId,
}: CommunityFormModalProps) {
  // Aba ativa: 'geral' | 'historia' | 'localizacao'
  const [activeTab, setActiveTab] = useState<'geral' | 'historia' | 'localizacao'>('geral');

  // Campos do formulário
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [patronSaint, setPatronSaint] = useState('');
  const [isHeadquarters, setIsHeadquarters] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

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

  // Estados de controle
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  // Helper para gerar slug automático
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
      setHistory(communityToEdit.history || '');
      setFoundationYear(communityToEdit.foundation_year || '');
      setFeastDay(communityToEdit.feast_day || '');
      setAddress(communityToEdit.address || '');
      setNeighborhood(communityToEdit.neighborhood || '');
      setCity(communityToEdit.city || 'Colatina');
      setState(communityToEdit.state || 'ES');
      setContactName(communityToEdit.contact_name || '');
      setContactPhone(communityToEdit.contact_phone || '');
    } else {
      setName('');
      setSlug('');
      setPatronSaint('');
      setIsHeadquarters(false);
      setIsActive(true);
      setImageUrl('');
      setHistory('');
      setFoundationYear('');
      setFeastDay('');
      setAddress('');
      setNeighborhood('');
      setCity('Colatina');
      setState('ES');
      setContactName('');
      setContactPhone('');
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
        history: history.trim() || null,
        foundation_year: foundationYear.trim() || null,
        feast_day: feastDay.trim() || null,
        address: address.trim() || null,
        neighborhood: neighborhood.trim() || null,
        city: city.trim() || 'Colatina',
        state: state.trim() || 'ES',
        contact_name: contactName.trim() || null,
        contact_phone: contactPhone.trim() || null,
      };

      if (communityToEdit) {
        const { error } = await supabase
          .from('communities')
          .update(payload)
          .eq('id', communityToEdit.id);

        if (error) throw error;
        onSuccess('Comunidade atualizada com sucesso!');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--dash-text-primary)]">
                {communityToEdit ? 'Editar Comunidade (CEB)' : 'Nova Comunidade (CEB)'}
              </h2>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                {communityToEdit
                  ? `Gerenciando dados e vocação pastoral de ${communityToEdit.name}`
                  : 'Integre uma nova capela ou setor à rede paroquial.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-border)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-[var(--dash-border)] px-6 pt-2 bg-[var(--dash-surface)] text-xs font-semibold gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('geral')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'geral'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            <Church className="w-3.5 h-3.5" />
            <span>Dados Gerais</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('historia')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'historia'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>História & Vocação</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('localizacao')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'localizacao'
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Localização & Contato</span>
          </button>
        </div>

        {/* Corpo do Formulário com Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ABA 1: DADOS GERAIS */}
          {activeTab === 'geral' && (
            <div className="space-y-4">
              <Input
                label="Nome da Comunidade / Capela *"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Comunidade São José Operário"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Santo(a) Padroeiro(a)"
                  value={patronSaint}
                  onChange={(e) => setPatronSaint(e.target.value)}
                  placeholder="Ex: São José"
                />

                <Input
                  label="Identificador do Minisite (Slug URL)"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex: sao-jose-operario"
                />
              </div>

              <Input
                label="URL da Imagem da Fachada / Capela"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/fotos/capela.jpg"
              />

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
                    Esta comunidade é a Igreja Matriz (Sede Paroquial)?
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
          )}

          {/* ABA 2: HISTÓRIA & VOCAÇÃO */}
          {activeTab === 'historia' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Ano de Fundação"
                  value={foundationYear}
                  onChange={(e) => setFoundationYear(e.target.value)}
                  placeholder="Ex: 1982 ou Década de 80"
                />

                <Input
                  label="Data da Festa do Padroeiro"
                  value={feastDay}
                  onChange={(e) => setFeastDay(e.target.value)}
                  placeholder="Ex: 19 de Março ou Último Domingo de Outubro"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
                  História, Pioneiros & Vocação Pastoral da CEB
                </label>
                <textarea
                  rows={6}
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  placeholder="Conte a história da comunidade, como foi construída a capela, os fundadores, os grupos de oração e as tradições locais..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] transition-all resize-y"
                />
                <p className="text-[11px] text-[var(--dash-text-secondary)]">
                  Este texto será exibido na página dedicada da comunidade (`/comunidades/{slug || '...'}`) e no portal do fiel.
                </p>
              </div>
            </div>
          )}

          {/* ABA 3: LOCALIZAÇÃO & CONTATO */}
          {activeTab === 'localizacao' && (
            <div className="space-y-4">
              <Input
                label="Endereço Completo (Rua, Número)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Rua São Pedro, 120"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Bairro ou Setor Rural"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Bairro Carlos Germano Naumann"
                />

                <Input
                  label="Cidade"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Colatina"
                />

                <Input
                  label="Estado (UF)"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="ES"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--dash-border)]">
                <Input
                  label="Nome do Coordenador(a) da CEB"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ex: Maria Auxiliadora"
                />

                <Input
                  label="WhatsApp / Telefone de Contato"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(27) 99999-0000"
                />
              </div>
            </div>
          )}

          {/* Barra de Ações do Rodapé */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--dash-border)]">
            <span className="text-[11px] text-[var(--dash-text-secondary)]">
              {activeTab === 'geral' && 'Passo 1 de 3: Identificação'}
              {activeTab === 'historia' && 'Passo 2 de 3: Conteúdo pastoral'}
              {activeTab === 'localizacao' && 'Passo 3 de 3: Localização e contatos'}
            </span>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={saving}>
                {communityToEdit ? 'Salvar Alterações' : 'Cadastrar Comunidade'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
