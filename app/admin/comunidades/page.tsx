'use client';

import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Phone, User, ChevronRight, RefreshCw, Church } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Community } from '@/types';
import { Button, Card, Badge, Input, Modal } from '@/components/ui';

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
        console.warn('Tabela communities:', error.message);
        setDbConnected(false);
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
        alert('Aviso: ' + error.message);
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
            <h1 className="text-2xl font-bold tracking-tight text-[var(--dash-text-primary)]">
              Comunidades Eclesiais de Base (CEBs)
            </h1>
            <Badge variant={dbConnected ? 'active' : 'inactive'}>
              {dbConnected ? 'Supabase Live' : 'Conectando...'}
            </Badge>
          </div>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Gerencie a rede paroquial: Igreja Matriz, capelas e comunidades urbanas e rurais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCommunities}
            title="Recarregar"
            icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          />
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Nova Comunidade (CEB)
          </Button>
        </div>
      </div>

      {/* Grid de Cards de Comunidades */}
      {loading ? (
        <Card className="flex flex-col items-center justify-center p-12 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--dash-text-secondary)]">Carregando comunidades eclesiais...</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {communities.map((community) => (
            <Card
              key={community.id}
              className={`flex flex-col justify-between space-y-4 ${
                community.is_headquarters
                  ? 'border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'hover:border-[var(--primary)]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {community.is_headquarters ? (
                    <Badge variant="matriz">Igreja Matriz (Sede)</Badge>
                  ) : (
                    <Badge variant="ceb">CEB / Capela</Badge>
                  )}
                  <Badge variant={community.is_active ? 'active' : 'inactive'}>
                    {community.is_active ? 'Ativa' : 'Inativa'}
                  </Badge>
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
                <span className="font-semibold text-[var(--primary)]">Rede Paroquial</span>
                <Link
                  href={`/admin/horarios?community_id=${community.id}`}
                  className="inline-flex items-center gap-1 text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] font-semibold transition-colors"
                >
                  <span>Horários</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Criação de Comunidade */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Nova Comunidade (CEB)"
        description="Preencha os dados da capela ou setor para integrar a rede paroquial."
      >
        <form onSubmit={handleCreateCommunity} className="space-y-4">
          <Input
            label="Nome da Comunidade / Capela *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              label="Cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Colatina"
            />
          </div>

          <Input
            label="Bairro ou Localidade Rural"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="Ex: Bairro Vila Nova ou Córrego das Flores"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome do Coordenador(a)"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Ex: Maria José"
            />
            <Input
              label="WhatsApp / Telefone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(27) 99999-0000"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_headquarters"
              checked={isHeadquarters}
              onChange={(e) => setIsHeadquarters(e.target.checked)}
              className="w-4 h-4 rounded-md text-[var(--primary)] border-[var(--dash-border)] focus:ring-[var(--primary)] cursor-pointer"
            />
            <label htmlFor="is_headquarters" className="text-xs font-semibold text-[var(--dash-text-primary)] cursor-pointer select-none">
              Esta comunidade é a Igreja Matriz (Sede Paroquial)?
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--dash-border)]">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Salvar Comunidade
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
