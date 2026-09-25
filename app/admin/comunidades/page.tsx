'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Church, MapPin, Phone, User, CheckCircle2, ShieldCheck, ChevronRight, Loader2, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Community } from '@/types';

export default function ComunidadesAdminPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [patronSaint, setPatronSaint] = useState('');
  const [isHeadquarters, setIsHeadquarters] = useState(false);
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('Colatina');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const supabase = createClient();

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('is_headquarters', { ascending: false })
        .order('name');

      if (error) {
        console.warn('Tabela communities ainda não migrada no Supabase:', error.message);
        setDbConnected(false);
        // Fallback para visualização prévia
        setCommunities([
          {
            id: 'c0000000-0000-0000-0000-000000000011',
            parish_id: 'c0000000-0000-0000-0000-000000000001',
            name: 'Igreja Matriz - Catedral do Sagrado Coração de Jesus',
            patron_saint: 'Sagrado Coração de Jesus',
            is_headquarters: true,
            neighborhood: 'Centro',
            city: 'Colatina',
            state: 'ES',
            contact_name: 'Secretaria Geral',
            contact_phone: '(27) 99999-0000',
            is_active: true,
            created_at: new Date().toISOString(),
          },
          {
            id: 'c0000000-0000-0000-0000-000000000012',
            parish_id: 'c0000000-0000-0000-0000-000000000001',
            name: 'Comunidade São Pedro e São Paulo',
            patron_saint: 'São Pedro e São Paulo',
            is_headquarters: false,
            neighborhood: 'Bairro Vila Nova',
            city: 'Colatina',
            state: 'ES',
            contact_name: 'Antônio Carlos (Coordenador)',
            contact_phone: '(27) 98888-1111',
            is_active: true,
            created_at: new Date().toISOString(),
          },
        ]);
      } else if (data) {
        setCommunities(data as Community[]);
        setDbConnected(true);
      }
    } catch (err) {
      console.error('Erro ao conectar ao Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      // Obter ou usar parish_id padrão
      const { data: parishes } = await supabase.from('parishes').select('id').limit(1);
      const parishId = parishes?.[0]?.id || 'c0000000-0000-0000-0000-000000000001';

      const newCommunity = {
        parish_id: parishId,
        name: name.trim(),
        patron_saint: patronSaint.trim() || null,
        is_headquarters: isHeadquarters,
        neighborhood: neighborhood.trim() || null,
        city: city.trim() || 'Colatina',
        state: 'ES',
        contact_name: contactName.trim() || null,
        contact_phone: contactPhone.trim() || null,
        is_active: true,
      };

      const { error } = await supabase.from('communities').insert([newCommunity]);
      if (error) {
        alert('Aviso: ' + error.message + ' (Certifique-se de executar o SQL de migração no Supabase)');
      } else {
        setIsModalOpen(false);
        setName('');
        setPatronSaint('');
        setIsHeadquarters(false);
        setNeighborhood('');
        setContactName('');
        setContactPhone('');
        fetchCommunities();
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Falha ao salvar';
      alert('Erro ao criar comunidade: ' + errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Comunidades Eclesiais de Base (CEBs)</h1>
            {dbConnected ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Supabase Live
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                Demonstração Local
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Gerencie a rede paroquial: Igreja Matriz, capelas e comunidades urbanas e rurais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCommunities}
            title="Recarregar"
            className="p-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Comunidade (CEB)
          </button>
        </div>
      </div>

      {/* Grid de Cards de Comunidades */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--dash-text-secondary)]">Carregando comunidades eclesiais...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {communities.map((community) => (
            <div
              key={community.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                community.is_headquarters
                  ? 'bg-[var(--dash-surface)] border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'bg-[var(--dash-surface)] border-[var(--dash-border)] hover:border-[var(--primary)]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {community.is_headquarters ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-bold text-xs uppercase tracking-wide">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Igreja Matriz (Sede)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] font-semibold text-xs">
                      <Church className="w-3 h-3" />
                      CEB / Capela
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {community.is_active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-bold leading-snug line-clamp-1">{community.name}</h2>
                  <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
                    Padroeiro: <span className="font-semibold text-[var(--dash-text-primary)]">{community.patron_saint || 'Nenhum'}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--dash-border)] space-y-1.5 text-xs text-[var(--dash-text-secondary)]">
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--primary)]" />
                    <span>{community.neighborhood ? `${community.neighborhood}, ` : ''}{community.city}</span>
                  </p>
                  {community.contact_name && (
                    <p className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 shrink-0 text-[var(--dash-text-secondary)]" />
                      <span>{community.contact_name}</span>
                    </p>
                  )}
                  {community.contact_phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 shrink-0 text-[var(--dash-text-secondary)]" />
                      <span>{community.contact_phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--dash-border)] flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--primary)]">
                  Rede Paroquial
                </span>

                <Link
                  href={`/admin/horarios?community_id=${community.id}`}
                  className="inline-flex items-center gap-1 text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] font-semibold transition-colors"
                >
                  <span>Horários</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação de Comunidade */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--dash-border)]">
              <h2 className="text-lg font-bold">Cadastrar Nova Comunidade (CEB)</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[var(--dash-text-secondary)] hover:bg-[var(--dash-surface-secondary)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCommunity} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--dash-text-secondary)] mb-1">
                  Nome da Comunidade / Capela *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Comunidade São José Operário"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--dash-text-secondary)] mb-1">
                    Santo(a) Padroeiro(a)
                  </label>
                  <input
                    type="text"
                    value={patronSaint}
                    onChange={(e) => setPatronSaint(e.target.value)}
                    placeholder="Ex: São José"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--dash-text-secondary)] mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Colatina"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--dash-text-secondary)] mb-1">
                  Bairro ou Localidade Rural
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Bairro Vila Nova ou Córrego das Flores"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--dash-text-secondary)] mb-1">
                    Nome do Coordenador(a)
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: Maria José"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--dash-text-secondary)] mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(27) 99999-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_headquarters"
                  checked={isHeadquarters}
                  onChange={(e) => setIsHeadquarters(e.target.checked)}
                  className="w-4 h-4 rounded-md text-[var(--primary)] border-[var(--dash-border)] focus:ring-[var(--primary)]"
                />
                <label htmlFor="is_headquarters" className="text-xs font-semibold text-[var(--dash-text-primary)] cursor-pointer">
                  Esta comunidade é a Igreja Matriz (Sede Paroquial)?
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--dash-border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-[var(--dash-border)] hover:bg-[var(--dash-surface-secondary)] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-95 transition-all shadow-sm disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Salvando...' : 'Salvar Comunidade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
