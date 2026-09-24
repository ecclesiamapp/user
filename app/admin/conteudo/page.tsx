import React from 'react';
import { Plus, Newspaper, AlertCircle, Calendar } from 'lucide-react';

export default function ConteudoAdminPage() {
  const sampleNews = [
    {
      id: '1',
      title: 'Inscrições Abertas para a Catequese de Primeira Eucaristia 2027',
      category: 'Pastoral',
      published_at: '22 de Setembro, 2026',
      is_urgent: false,
    },
    {
      id: '2',
      title: 'Aviso Urgente: Horário Especial para a Festa da Padroeira neste Sábado',
      category: 'Aviso',
      published_at: '20 de Setembro, 2026',
      is_urgent: true,
    },
    {
      id: '3',
      title: 'Campanha de Arrecadação de Alimentos para os Vicentinos',
      category: 'Solidariedade',
      published_at: '18 de Setembro, 2026',
      is_urgent: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Avisos e Notícias Pastorais</h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Publique comunicados e mantenha a comunidade paroquial bem informada.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-95 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          Nova Publicação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sampleNews.map((news) => (
          <div key={news.id} className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)]">
                  {news.category}
                </span>
                {news.is_urgent && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    Urgente
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold line-clamp-2">{news.title}</h2>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--dash-border)] text-xs text-[var(--dash-text-secondary)]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {news.published_at}
              </span>
              <button className="text-[var(--primary)] font-semibold hover:underline">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
