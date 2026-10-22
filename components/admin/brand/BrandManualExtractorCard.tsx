'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2, Download, ExternalLink } from 'lucide-react';
import { ExtractedBrandData } from '@/lib/ai/brand-extractor';
import { BrandIdentity, CATEDRAL_PARISH_ID } from '@/lib/brand';

interface BrandManualExtractorCardProps {
  currentManualUrl?: string;
  onApplyExtracted: (extracted: ExtractedBrandData, manualUrl?: string) => void;
  parishId?: string;
}

export function BrandManualExtractorCard({
  currentManualUrl,
  onApplyExtracted,
  parishId = CATEDRAL_PARISH_ID,
}: BrandManualExtractorCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [extractedResult, setExtractedResult] = useState<ExtractedBrandData | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentManualUrl || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
      setExtractedResult(null);
    }
  };

  const handleStartExtraction = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setError(null);
      setProcessingStep('Enviando manual para o servidor...');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('parish_id', parishId);

      setProcessingStep('Analisando documento com Google Gemini 2.5 Flash...');
      const response = await fetch('/api/admin/brand/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson?.error || `Falha no processamento (${response.status})`);
      }

      setProcessingStep('Estruturando paleta de cores e tipografias...');
      const data = await response.json();

      if (data.success && data.extracted) {
        setExtractedResult(data.extracted);
        if (data.file_url) {
          setUploadedUrl(data.file_url);
        }
      } else {
        throw new Error(data?.error || 'A extração não retornou dados estruturados.');
      }
    } catch (err: any) {
      console.error('[Manual Extraction Error]:', err);
      setError(err?.message || 'Erro inesperado ao processar manual.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleApplyToMoodboard = () => {
    if (extractedResult) {
      onApplyExtracted(extractedResult, uploadedUrl);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dash-text-primary)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFA82A]" />
            <span>Ingestão de Manual de Marca com IA</span>
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Envie o PDF ou imagem do manual de identidade visual. O Gemini 2.5 Flash extrai cores, fontes e regras em segundos.
          </p>
        </div>

        {uploadedUrl && (
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto text-xs text-[#FFA82A] hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#FFA82A]/30 bg-[#FFA82A]/5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Manual Ativo em PDF</span>
          </a>
        )}
      </div>

      {/* Área de Seleção de Arquivo */}
      <div className="p-4 sm:p-6 rounded-2xl border-2 border-dashed border-[var(--dash-border)] hover:border-[#FFA82A]/50 bg-[var(--dash-surface-hover)]/30 text-center transition-all">
        <UploadCloud className="w-10 h-10 mx-auto text-[#FFA82A] opacity-80 mb-2" />
        <h4 className="text-xs font-bold text-[var(--dash-text-primary)]">
          {file ? file.name : 'Selecione o Manual de Marca (PDF, PNG ou JPG)'}
        </h4>
        <p className="text-[11px] text-[var(--dash-text-muted)] mt-1">
          Tamanho máximo suportado: 50 MB
        </p>

        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
          <label className="px-4 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:bg-[var(--dash-surface-hover)] text-xs font-semibold text-[var(--dash-text-primary)] cursor-pointer transition-all">
            <span>{file ? 'Trocar Arquivo' : 'Escolher Arquivo'}</span>
            <input
              type="file"
              accept="application/pdf,image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </label>

          {file && !isProcessing && (
            <button
              type="button"
              onClick={handleStartExtraction}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white text-xs font-bold shadow-sm hover:opacity-95 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFA82A]" />
              <span>Analisar com Gemini IA</span>
            </button>
          )}
        </div>

        {isProcessing && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-[#FFA82A]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{processingStep}</span>
          </div>
        )}
      </div>

      {/* Exibição de Erro */}
      {error && (
        <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Painel com Resultado da Extração da IA */}
      {extractedResult && (
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Identidade Extraída com Sucesso! (Confiança: {Math.round(extractedResult.confidence_score * 100)}%)
              </span>
            </div>
            <button
              type="button"
              onClick={handleApplyToMoodboard}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto"
            >
              <span>Preencher Moodboard Agora</span>
            </button>
          </div>

          <p className="text-xs text-[var(--dash-text-secondary)] italic">
            "{extractedResult.summary}"
          </p>

          {/* Amostras das cores detectadas */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-500/20">
            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full border border-black/20"
                style={{ backgroundColor: extractedResult.colors.primary }}
              />
              <span className="text-[11px] font-mono text-[var(--dash-text-primary)]">
                Primária: {extractedResult.colors.primary}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full border border-black/20"
                style={{ backgroundColor: extractedResult.colors.secondary }}
              />
              <span className="text-[11px] font-mono text-[var(--dash-text-primary)]">
                Secundária: {extractedResult.colors.secondary}
              </span>
            </div>
            <div className="text-[11px] text-[var(--dash-text-muted)]">
              Fontes: <strong>{extractedResult.fonts.heading}</strong> / <strong>{extractedResult.fonts.body}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
