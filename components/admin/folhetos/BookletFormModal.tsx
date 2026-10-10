'use client';

import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { Modal, Input, Select, Button } from '@/components/ui';
import { createClient } from '@/utils/supabase/client';
import { LiturgicalBooklet } from '@/types';

interface BookletFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBooklet: LiturgicalBooklet) => void;
}

const CATEDRAL_PARISH_ID = 'c0000000-0000-0000-0000-000000000001';

export function BookletFormModal({ isOpen, onClose, onSuccess }: BookletFormModalProps) {
  const [title, setTitle] = useState('');
  const [celebrationDate, setCelebrationDate] = useState('');
  const [sundayLabel, setSundayLabel] = useState('Próximo Domingo');
  const [theme, setTheme] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') {
        setErrorMsg('Apenas arquivos no formato PDF são permitidos.');
        setFile(null);
        return;
      }
      setErrorMsg(null);
      setFile(selected);

      // Sugestão automática de título se estiver vazio
      if (!title) {
        const cleanName = selected.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
        setTitle(`Folheto Sou do Sagrado Missa • ${cleanName}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !celebrationDate || !file) {
      setErrorMsg('Por favor, preencha o título, a data e selecione o arquivo PDF.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${CATEDRAL_PARISH_ID}/${timestamp}_${sanitizedFileName}`;

      // 1. Upload do PDF para o Supabase Storage (bucket booklets)
      const { error: uploadError } = await supabase.storage
        .from('booklets')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Erro no upload para o storage:', uploadError);
        throw new Error(`Falha no upload do arquivo: ${uploadError.message}`);
      }

      // 2. Obter URL pública do PDF
      const { data: urlData } = supabase.storage
        .from('booklets')
        .getPublicUrl(storagePath);

      const publicPdfUrl = urlData.publicUrl;

      // 3. Inserir registro na tabela liturgical_booklets
      const { data: insertedData, error: insertError } = await supabase
        .from('liturgical_booklets')
        .insert({
          parish_id: CATEDRAL_PARISH_ID,
          title: title.trim(),
          celebration_date: celebrationDate,
          sunday_label: sundayLabel,
          theme: theme.trim() || null,
          pdf_url: publicPdfUrl,
          is_active: true,
          download_count: 0,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao salvar no banco:', insertError);
        throw new Error(`Falha ao registrar folheto: ${insertError.message}`);
      }

      // Sucesso
      onSuccess(insertedData as LiturgicalBooklet);
      resetForm();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro inesperado durante a operação.';
      setErrorMsg(message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCelebrationDate('');
    setSundayLabel('Próximo Domingo');
    setTheme('');
    setFile(null);
    setErrorMsg(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isUploading) {
          resetForm();
          onClose();
        }
      }}
      title="Publicar Novo Folheto de Missa"
      description="Faça o upload do PDF oficial («Sou do Sagrado Missa») para o portal da paróquia."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Input
          id="booklet-title"
          label="Título Oficial do Folheto *"
          placeholder="Ex: Folheto Sou do Sagrado Missa • 28º Domingo do Tempo Comum"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="booklet-date"
            label="Data da Celebração *"
            type="date"
            value={celebrationDate}
            onChange={(e) => setCelebrationDate(e.target.value)}
            required
          />

          <Select
            id="booklet-label"
            label="Destaque / Rótulo do Domingo"
            value={sundayLabel}
            onChange={(e) => setSundayLabel(e.target.value)}
          >
            <option value="Próximo Domingo">Próximo Domingo</option>
            <option value="Domingo Atual">Domingo Atual</option>
            <option value="Domingo Anterior">Domingo Anterior</option>
            <option value="Solenidade">Solenidade</option>
            <option value="Edição Especial">Edição Especial</option>
          </Select>
        </div>

        <Input
          id="booklet-theme"
          label="Tema Litúrgico / Lema da Missa"
          placeholder="Ex: «O Filho do Homem não veio para ser servido, mas para servir»"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />

        {/* Upload do Arquivo PDF */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--dash-text-secondary)]">
            Arquivo PDF do Folheto *
          </label>
          <div className="relative border-2 border-dashed border-[var(--dash-border)] hover:border-amber-500/50 rounded-2xl p-5 text-center transition-all bg-[var(--dash-surface-secondary)]/50 group">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              {file ? (
                <>
                  <FileText className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[var(--dash-text-primary)]">
                    {file.name}
                  </span>
                  <span className="text-[11px] text-[var(--dash-text-secondary)]">
                    {(file.size / 1024).toFixed(1)} KB • Pronto para upload
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-[var(--dash-text-secondary)] group-hover:text-amber-500 transition-colors" />
                  <span className="text-xs font-bold text-[var(--dash-text-primary)]">
                    Clique ou arraste o arquivo PDF aqui
                  </span>
                  <span className="text-[11px] text-[var(--dash-text-secondary)]">
                    Tamanho máximo recomendado: 15MB
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--dash-border)] flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isUploading}
            icon={<Sparkles className="w-4 h-4" />}
          >
            {isUploading ? 'Enviando PDF...' : 'Publicar Folheto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
