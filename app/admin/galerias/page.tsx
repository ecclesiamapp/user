'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw, Image as ImageIcon, CheckCircle2, Church } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Community, Gallery } from '@/types';
import { Button, Card, Badge, Select } from '@/components/ui';
import { GalleryCard, GalleryFormModal } from '@/components/admin/galerias';

export default function GaleriasAdminPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryToEdit, setGalleryToEdit] = useState<Gallery | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [parishId, setParishId] = useState<string>('c0000000-0000-0000-0000-000000000001');

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Carregar Paróquia
      const { data: parishes } = await supabase.from('parishes').select('id').limit(1);
      if (parishes?.[0]?.id) {
        setParishId(parishes[0].id);
      }

      // 2. Carregar Comunidades
      const { data: comms } = await supabase
        .from('communities')
        .select('*')
        .order('is_headquarters', { ascending: false })
        .order('name');

      if (comms) {
        setCommunities(comms as Community[]);
      }

      // 3. Carregar Galerias
      const { data: galls, error } = await supabase
        .from('galleries')
        .select('*, community:communities(*)')
        .order('event_date', { ascending: false });

      if (!error && galls) {
        setGalleries(galls as Gallery[]);
      }
    } catch (err) {
      console.warn('Erro ao carregar galerias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (gallery: Gallery) => {
    setGalleryToEdit(gallery);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setGalleryToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza de que deseja excluir este álbum fotográfico?')) return;

    setActionLoadingId(id);
    try {
      const { error } = await supabase.from('galleries').delete().eq('id', id);
      if (error) throw error;

      setGalleries((prev) => prev.filter((g) => g.id !== id));
      setFeedbackMsg('Álbum excluído com sucesso.');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao excluir';
      alert('Erro ao excluir álbum: ' + msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setActionLoadingId(id);
    try {
      const nextStatus = !currentStatus;
      const { error } = await supabase
        .from('galleries')
        .update({ is_active: nextStatus })
        .eq('id', id);

      if (error) throw error;

      setGalleries((prev) =>
        prev.map((g) => (g.id === id ? { ...g, is_active: nextStatus } : g))
      );
      setFeedbackMsg('Visibilidade do álbum atualizada com sucesso.');
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
    loadData();
  };

  const filteredGalleries = useMemo(() => {
    if (selectedCommunityId === 'all') return galleries;
    if (selectedCommunityId === 'matriz_geral') {
      return galleries.filter((g) => !g.community_id || g.community?.is_headquarters);
    }
    return galleries.filter((g) => g.community_id === selectedCommunityId);
  }, [galleries, selectedCommunityId]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--dash-text-primary)]">
              Galerias & Momentos Pastorais
            </h1>
            <Badge variant="active">{filteredGalleries.length} Álbuns</Badge>
          </div>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Álbuns fotográficos das festas de padroeiros, ordenações e celebrações das 12 CEBs e Catedral.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            title="Recarregar"
            icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          />
          <Button variant="primary" onClick={handleNew} icon={<Plus className="w-4 h-4" />}>
            Novo Álbum
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

      {/* Filtro por Comunidade */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Church className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--dash-text-secondary)]">
            Filtrar Álbuns por Comunidade:
          </span>
        </div>

        <div className="w-full sm:w-72">
          <Select
            value={selectedCommunityId}
            onChange={(e) => setSelectedCommunityId(e.target.value)}
          >
            <option value="all">Todas as Comunidades & Matriz</option>
            <option value="matriz_geral">⭐ Apenas Catedral Matriz (Geral)</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Grid de Álbuns */}
      {loading ? (
        <Card className="flex flex-col items-center justify-center p-12 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--dash-text-secondary)]">Carregando galerias pastorais...</p>
        </Card>
      ) : filteredGalleries.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 space-y-2 text-center">
          <ImageIcon className="w-10 h-10 text-[var(--dash-text-secondary)] opacity-40" />
          <p className="text-sm font-semibold text-[var(--dash-text-primary)]">
            Nenhum álbum encontrado para esta seleção
          </p>
          <p className="text-xs text-[var(--dash-text-secondary)]">
            Crie um novo álbum ou faça upload de fotos da celebração.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery) => (
            <GalleryCard
              key={gallery.id}
              gallery={gallery}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              isActionLoading={actionLoadingId === gallery.id}
            />
          ))}
        </div>
      )}

      {/* Modal de Formulário (Criação e Edição) */}
      <GalleryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        galleryToEdit={galleryToEdit}
        communities={communities}
        parishId={parishId}
      />
    </div>
  );
}
