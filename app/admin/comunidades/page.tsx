'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw, Search, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Community } from '@/types';
import { Button, Card, Badge, Input } from '@/components/ui';
import { CommunityCard, CommunityFormModal } from '@/components/admin/comunidades';

export default function ComunidadesAdminPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityToEdit, setCommunityToEdit] = useState<Community | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [parishId, setParishId] = useState<string>('c0000000-0000-0000-0000-000000000001');

  const supabase = createClient();

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      // Buscar ID da paróquia ativa
      const { data: parishes } = await supabase.from('parishes').select('id').limit(1);
      if (parishes?.[0]?.id) {
        setParishId(parishes[0].id);
      }

      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('is_headquarters', { ascending: false })
        .order('name');

      if (error) {
        console.warn('Erro ao carregar comunidades:', error.message);
      } else if (data) {
        setCommunities(data as Community[]);
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleEdit = (community: Community) => {
    setCommunityToEdit(community);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setCommunityToEdit(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setActionLoadingId(id);
    try {
      const nextStatus = !currentStatus;
      const { error } = await supabase
        .from('communities')
        .update({ is_active: nextStatus })
        .eq('id', id);

      if (error) throw error;

      setCommunities((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: nextStatus } : c))
      );
      setFeedbackMsg(`Status da comunidade atualizado com sucesso.`);
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao alterar status';
      alert('Erro: ' + msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSuccess = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
    fetchCommunities();
  };

  const filteredCommunities = useMemo(() => {
    if (!searchTerm.trim()) return communities;
    const term = searchTerm.toLowerCase();
    return communities.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.patron_saint && c.patron_saint.toLowerCase().includes(term)) ||
        (c.neighborhood && c.neighborhood.toLowerCase().includes(term)) ||
        (c.contact_name && c.contact_name.toLowerCase().includes(term))
    );
  }, [communities, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--dash-text-primary)]">
              Comunidades Eclesiais de Base (CEBs)
            </h1>
            <Badge variant="active">{communities.length} Comunidades</Badge>
          </div>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Gestão da rede paroquial: histórico, pioneiros, vocação pastoral e contatos das capelas.
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
          <Button variant="primary" onClick={handleNew} icon={<Plus className="w-4 h-4" />}>
            Nova Comunidade
          </Button>
        </div>
      </div>

      {/* Alerta de Feedback Temporário */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Barra de Filtro e Busca */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dash-text-secondary)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, padroeiro, bairro ou coordenador..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] transition-all"
          />
        </div>
      </div>

      {/* Grid de Cards de Comunidades */}
      {loading ? (
        <Card className="flex flex-col items-center justify-center p-12 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--dash-text-secondary)]">Carregando comunidades eclesiais...</p>
        </Card>
      ) : filteredCommunities.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 space-y-2 text-center">
          <p className="text-sm font-semibold text-[var(--dash-text-primary)]">
            Nenhuma comunidade encontrada
          </p>
          <p className="text-xs text-[var(--dash-text-secondary)]">
            Tente outro termo na busca ou cadastre uma nova comunidade.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCommunities.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              isActionLoading={actionLoadingId === community.id}
            />
          ))}
        </div>
      )}

      {/* Modal de Formulário (Criação e Edição Completa) */}
      <CommunityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        communityToEdit={communityToEdit}
        parishId={parishId}
      />
    </div>
  );
}
