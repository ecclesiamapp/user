'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, Badge, Button, Modal } from '@/components/ui';
import { sampleMissalBooklets, MissalBooklet } from '@/lib/liturgy';
import { createClient } from '@/utils/supabase/client';
import { LiturgicalBooklet } from '@/types';

export function MissalBookletsSection() {
  const [booklets, setBooklets] = useState<MissalBooklet[]>(sampleMissalBooklets);
  const [selectedBooklet, setSelectedBooklet] = useState<MissalBooklet | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooklets() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('liturgical_booklets')
          .select('*')
          .eq('is_active', true)
          .order('celebration_date', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: MissalBooklet[] = (data as LiturgicalBooklet[]).map((item) => ({
            id: item.id,
            title: item.title,
            celebrationDate: new Date(item.celebration_date + 'T12:00:00').toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }),
            sundayLabel: item.sunday_label,
            theme: item.theme || 'Celebração da Palavra e Santo Sacrifício',
            pdfUrl: item.pdf_url || '#',
            downloadCount: item.download_count,
          }));
          setBooklets(mapped);
        }
      } catch (err) {
        console.warn('Usando folhetos de contingência local:', err);
      }
    }

    loadBooklets();
  }, []);

  const handleDownload = (booklet: MissalBooklet) => {
    setDownloadSuccessId(booklet.id);
    if (booklet.pdfUrl && booklet.pdfUrl !== '#') {
      window.open(booklet.pdfUrl, '_blank', 'noopener,noreferrer');
      // Incrementa download_count silenciosamente
      try {
        const supabase = createClient();
        supabase.rpc('increment_booklet_downloads', { booklet_id: booklet.id }).then(() => {});
      } catch {
        // Ignora silenciosamente se a RPC não existir
      }
    }
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  return (
    <>
      <section id="folhetos" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold">Folhetos das Santas Missas («Sou do Sagrado Missa»)</h3>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Baixe e acompanhe as celebrações da Catedral e das CEBs em seu celular ou impresso
              </p>
            </div>
          </div>
          <Badge variant="matriz">Edições Oficiais</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {booklets.map((booklet, idx) => (
            <Card
              key={booklet.id}
              className={`flex flex-col justify-between space-y-4 ${
                idx === 0
                  ? 'border-amber-500/50 bg-gradient-to-b from-amber-500/5 to-transparent ring-1 ring-amber-500/20'
                  : 'hover:border-[var(--primary)]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={idx === 0 ? 'active' : 'default'}>
                    {booklet.sundayLabel}
                  </Badge>
                  <span className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {booklet.celebrationDate}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm leading-snug line-clamp-2 text-[var(--dash-text-primary)]">
                    {booklet.title}
                  </h4>
                  <p className="text-xs text-[var(--dash-text-secondary)] italic mt-1 line-clamp-2">
                    Tema: {booklet.theme}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--dash-border)] flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooklet(booklet)}
                  className="text-xs flex-1"
                  icon={<Eye className="w-3.5 h-3.5" />}
                >
                  Visualizar
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(booklet)}
                  className="text-xs flex-1"
                  icon={
                    downloadSuccessId === booklet.id ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {downloadSuccessId === booklet.id ? 'Abrindo...' : 'Baixar PDF'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Modal de Pré-visualização do Folheto */}
      {selectedBooklet && (
        <Modal
          isOpen={!!selectedBooklet}
          onClose={() => setSelectedBooklet(null)}
          title={selectedBooklet.title}
          description={`Celebração de ${selectedBooklet.celebrationDate}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs sm:text-sm text-[var(--dash-text-secondary)]">
            <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2 text-center">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
                {selectedBooklet.theme}
              </h4>
              <p className="text-xs">
                Arquivo diagramado no padrão oficial da Catedral do Sagrado Coração de Jesus. Pronto para leitura móvel ou impressão paroquial.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-[var(--dash-text-primary)]">Conteúdo do Folheto:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Ritos Iniciais e Antífona de Entrada</li>
                <li>Leituras Bíblicas da CNBB e Salmo Responsorial</li>
                <li>Oração da Comunidade e Intenções Paroquiais</li>
                <li>Rito da Comunhão e Bênção Final</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-[var(--dash-border)] flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedBooklet(null)}>
                Fechar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleDownload(selectedBooklet);
                  setSelectedBooklet(null);
                }}
                icon={<Download className="w-4 h-4" />}
              >
                Confirmar Download (PDF)
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
