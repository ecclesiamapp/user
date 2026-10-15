'use client';

import React, { useState } from 'react';
import { Plus, Newspaper, AlertCircle, Calendar, Edit3, Image as ImageIcon } from 'lucide-react';
import { Announcement } from '@/types';
import { AnnouncementModal } from '@/components/admin/conteudo/AnnouncementModal';

const initialSampleNews: Announcement[] = [
  {
    id: '1',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    title: 'Inscrições Abertas para a Catequese de Primeira Eucaristia 2027',
    content: 'A Pastoral Catequética da Catedral convida todas as famílias para a inscrição dos seus filhos nas turmas do próximo ano.',
    category: 'pastoral',
    published_at: '22 de Setembro, 2026',
    is_urgent: false,
    is_active: true,
  },
  {
    id: '2',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    title: 'Aviso Urgente: Horário Especial para a Festa da Padroeira neste Sábado',
    content: 'Informamos a toda a diocese que neste sábado a Santa Missa solene será celebrada às 19h com transmissão ao vivo.',
    category: 'aviso',
    published_at: '20 de Setembro, 2026',
    is_urgent: true,
    is_active: true,
  },
  {
    id: '3',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    title: 'Campanha de Arrecadação de Alimentos para os Vicentinos',
    content: 'Traga alimentos não perecíveis na secretaria paroquial ou no ofertório das celebrações do domingo.',
    category: 'evento',
    published_at: '18 de Setembro, 2026',
    is_urgent: false,
    is_active: true,
  },
];

export default function ConteudoAdminPage() {
  const [newsList, setNewsList] = useState<Announcement[]>(initialSampleNews);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = async (data: Partial<Announcement>) => {
    if (editingItem) {
      setNewsList((prev) =>
        prev.map((n) => (n.id === editingItem.id ? ({ ...n, ...data } as Announcement) : n))
      );
    } else {
      const newItem: Announcement = {
        id: String(Date.now()),
        parish_id: 'c0000000-0000-0000-0000-000000000001',
        title: data.title || '',
        content: data.content || '',
        category: data.category || 'aviso',
        image_url: data.image_url,
        is_urgent: !!data.is_urgent,
        published_at: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
        is_active: true,
      };
      setNewsList((prev) => [newItem, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--dash-border)] pb-5">
        <div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)]">
            Avisos & Notícias Pastorais
          </h1>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] mt-1 font-sans">
            Publique comunicados, notas urgentes e fotos de capa com compressão WebP integrada.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white font-bold text-xs shadow-md hover:brightness-110 transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Publicação</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {newsList.map((news) => (
          <div
            key={news.id}
            className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#FFA82A]/40 transition-all"
          >
            <div className="space-y-3">
              {news.image_url && (
                <div className="relative h-36 w-full rounded-xl overflow-hidden bg-black/30">
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FFA82A]/10 text-[#FFA82A] border border-[#FFA82A]/20">
                  {news.category}
                </span>
                {news.is_urgent && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                    <AlertCircle className="w-3 h-3" />
                    Urgente
                  </span>
                )}
              </div>

              <h2 className="font-cinzel text-base font-bold text-[var(--dash-text-primary)] line-clamp-2">
                {news.title}
              </h2>

              <p className="text-xs text-[var(--dash-text-secondary)] line-clamp-3 font-sans">
                {news.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--dash-border)] text-xs text-[var(--dash-text-secondary)]">
              <span className="flex items-center gap-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-[#FFA82A]" />
                {news.published_at}
              </span>
              <button
                onClick={() => handleOpenEdit(news)}
                className="text-[#8B1E22] dark:text-[#FFA82A] font-bold hover:underline flex items-center gap-1 min-h-[36px]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnnouncementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        announcement={editingItem}
      />
    </div>
  );
}
