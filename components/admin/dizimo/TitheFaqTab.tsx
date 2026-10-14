'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Loader2,
  ChevronDown
} from 'lucide-react';
import { TitheFaq } from '@/types';
import { createClient } from '@/utils/supabase/client';

interface TitheFaqTabProps {
  initialFaqs: TitheFaq[];
  parishId: string;
}

export function TitheFaqTab({ initialFaqs, parishId }: TitheFaqTabProps) {
  const [faqs, setFaqs] = useState<TitheFaq[]>(initialFaqs);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<TitheFaq | null>(null);

  // Form fields
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [orderIndex, setOrderIndex] = useState('1');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setOrderIndex(String(faqs.length + 1));
    setModalOpen(true);
  };

  const openEditModal = (faq: TitheFaq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setOrderIndex(String(faq.order_index));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setLoading(true);
    try {
      if (editingFaq) {
        // Atualizar
        const { error } = await supabase
          .from('tithe_faqs')
          .update({
            question: question.trim(),
            answer: answer.trim(),
            order_index: Number(orderIndex),
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingFaq.id);

        if (!error) {
          setFaqs((prev) =>
            prev.map((f) =>
              f.id === editingFaq.id
                ? {
                    ...f,
                    question: question.trim(),
                    answer: answer.trim(),
                    order_index: Number(orderIndex),
                  }
                : f
            )
          );
          setModalOpen(false);
        }
      } else {
        // Inserir novo
        const newFaqPayload = {
          parish_id: parishId,
          question: question.trim(),
          answer: answer.trim(),
          order_index: Number(orderIndex),
          is_active: true,
        };

        const { data, error } = await supabase
          .from('tithe_faqs')
          .insert(newFaqPayload)
          .select('*')
          .single();

        if (!error && data) {
          setFaqs((prev) => [...prev, data as TitheFaq]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Erro ao salvar FAQ do dízimo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('tithe_faqs')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (!error) {
        setFaqs((prev) =>
          prev.map((f) => (f.id === id ? { ...f, is_active: !currentActive } : f))
        );
      }
    } catch (err) {
      console.error('Erro ao alternar status da FAQ:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover esta pergunta frequente?')) return;

    try {
      const { error } = await supabase
        .from('tithe_faqs')
        .delete()
        .eq('id', id);

      if (!error) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error('Erro ao excluir FAQ:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--dash-text-primary)]">
            Perguntas Frequentes (FAQ do Dízimo)
          </h2>
          <p className="text-xs text-[var(--dash-text-secondary)]">
            Gerencie os esclarecimentos canônicos e pastorais exibidos para os fiéis em /dizimo.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B1E22] dark:bg-[#FFA82A] text-white dark:text-[#2D1A16] font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Pergunta</span>
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className={`p-5 rounded-2xl bg-[var(--dash-surface)] border transition-all space-y-3 shadow-xs ${
              faq.is_active ? 'border-[var(--dash-border)]' : 'border-dashed border-gray-400 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#FFA82A] uppercase">
                    #{faq.order_index}
                  </span>
                  <h3 className="font-cinzel text-base font-bold text-[var(--dash-text-primary)]">
                    {faq.question}
                  </h3>
                </div>

                <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed font-sans">
                  {faq.answer}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleActive(faq.id, faq.is_active)}
                  className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]"
                  title={faq.is_active ? 'Ocultar no portal' : 'Exibir no portal'}
                >
                  {faq.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(faq)}
                  className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-[#FFA82A]"
                  title="Editar"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(faq.id)}
                  className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-rose-500"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Criação / Edição */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-[var(--dash-surface)] border border-[var(--dash-border)] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--dash-border)] pb-3">
              <h3 className="font-cinzel text-lg font-bold text-[var(--dash-text-primary)]">
                {editingFaq ? 'Editar Pergunta' : 'Nova Pergunta Frequente'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Pergunta Pastoral *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Qual a porcentagem do dízimo na Igreja Católica?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Resposta Explicativa *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escreva a orientação canônica e pastoral com clareza..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(e.target.value)}
                  className="w-24 px-3.5 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--dash-border)] text-xs font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8B1E22] dark:bg-[#FFA82A] text-white dark:text-[#2D1A16] font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Salvar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
