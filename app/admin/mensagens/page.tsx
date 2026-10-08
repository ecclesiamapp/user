'use client';

import React, { useState } from 'react';
import {
  Plus,
  BookOpen,
  Star,
  Calendar,
  Edit3,
  Trash2,
  UserCheck,
  Church,
  Sparkles,
  ExternalLink,
  Check
} from 'lucide-react';
import { Badge, Button } from '@/components/ui';

interface AdminMessageItem {
  id: string;
  author_type: 'paroco' | 'bispo';
  author_name: string;
  author_title: string;
  title: string;
  slug: string;
  subtitle: string;
  liturgical_season: string;
  is_featured_home: boolean;
  published_at: string;
}

const initialMessages: AdminMessageItem[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    author_type: 'paroco',
    author_name: 'Padre Irineu Claudino Sales',
    author_title: 'Pároco e Cura da Catedral',
    title: 'Uma Igreja em Saída nos Meios Digitais: Bem-vindos ao Novo Portal da Catedral!',
    slug: 'palavra-do-paroco-uma-igreja-em-saida-digital',
    subtitle: 'A beleza de nossa fé precisa resplandecer onde o povo está...',
    liturgical_season: 'Solenidade de Todos os Santos',
    is_featured_home: true,
    published_at: '07 de Outubro, 2026',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    author_type: 'bispo',
    author_name: 'Dom Lauro Sérgio Versiani Barbosa',
    author_title: 'Bispo Diocesano de Colatina',
    title: 'Comunhão, Participação e Missão: A Catedral como Mãe e Referência Pastoral',
    slug: 'palavra-do-bispo-catedral-mae-e-referencia-pastoral',
    subtitle: 'A Catedral é a cátedra de onde emana a unidade da Diocese de Colatina...',
    liturgical_season: 'Tempo Comum',
    is_featured_home: false,
    published_at: '05 de Outubro, 2026',
  },
];

export default function AdminMensagensPage() {
  const [messages, setMessages] = useState<AdminMessageItem[]>(initialMessages);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSetFeatured = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => ({
        ...m,
        is_featured_home: m.id === id,
      }))
    );
    const selected = messages.find((m) => m.id === id);
    setFeedback(`"${selected?.title}" foi definida como o destaque oficial na Home!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[var(--primary)]" />
            Palavra do Pároco & Palavra do Bispo
          </h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Gerencie colunas pastorais, reflexões de fé e selecione qual mensagem aparece em destaque na primeira página da Catedral.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-95 transition-all shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" />
          Nova Mensagem
        </button>
      </div>

      {/* Alerta de Feedback de Alteração */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 transition-all">
          <Check className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Regra de Destaque da Home */}
      <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--dash-text-secondary)]">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong>Regra Visual:</strong> Apenas <strong>1 mensagem</strong> fica ativa em destaque solene na Home por vez, preservando foco e elegância.
          </span>
        </div>

        <span className="font-semibold text-[var(--dash-text-primary)]">
          Destaque Atual: {messages.find((m) => m.is_featured_home)?.author_name}
        </span>
      </div>

      {/* Lista de Mensagens */}
      <div className="space-y-4">
        {messages.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl bg-[var(--dash-surface)] border transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 ${item.is_featured_home
                ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                : 'border-[var(--dash-border)]'
              }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${item.author_type === 'bispo'
                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                  {item.author_type === 'bispo' ? <Church className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                  {item.author_type === 'bispo' ? 'Palavra do Bispo' : 'Palavra do Pároco'}
                </span>

                {item.is_featured_home && (
                  <Badge variant="active" icon={<Star className="w-3 h-3 fill-current" />}>
                    Destaque na Home
                  </Badge>
                )}

                <span className="text-xs text-[var(--dash-text-secondary)]">
                  {item.liturgical_season}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-[var(--dash-text-primary)] leading-snug">
                {item.title}
              </h2>

              <p className="text-xs text-[var(--dash-text-secondary)] line-clamp-1 italic">
                {item.subtitle}
              </p>

              <div className="flex items-center gap-3 text-xs text-[var(--dash-text-secondary)] pt-1">
                <span>Por: <strong className="text-[var(--dash-text-primary)]">{item.author_name}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.published_at}
                </span>
              </div>
            </div>

            {/* Ações da Mensagem */}
            <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--dash-border)]">
              {!item.is_featured_home ? (
                <button
                  onClick={() => handleSetFeatured(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--dash-border)] hover:border-amber-500 text-xs font-semibold text-[var(--dash-text-secondary)] hover:text-amber-500 transition-all cursor-pointer"
                  title="Exibir esta mensagem na Home da paróquia"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Destacar na Home</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Ativo na Home
                </span>
              )}

              <a
                href={`/mensagens/${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] transition-colors"
                title="Visualizar mensagem publicada"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--dash-surface-secondary)] transition-colors cursor-pointer"
                title="Editar texto da mensagem"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Remover mensagem"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
