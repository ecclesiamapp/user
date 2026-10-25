'use client';

import React, { useState, useCallback, useRef } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { 
  X, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  Loader2, 
  Sparkles, 
  Image as ImageIcon,
  Crop as CropIcon,
  RefreshCw
} from 'lucide-react';
import { getCroppedImg, compressImage, CompressionResult } from '@/lib/image-utils';

interface ImageCropCompressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (url: string) => void;
  folder?: string;
  bucket?: string;
  title?: string;
  initialAspectRatio?: number | undefined;
}

export function ImageCropCompressModal({
  isOpen,
  onClose,
  onUploadSuccess,
  folder = 'historia',
  bucket = 'parish-media',
  title = 'Upload & Otimização de Imagem',
  initialAspectRatio = undefined,
}: ImageCropCompressModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(initialAspectRatio);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_croppedArea: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
      return;
    }

    setError(null);
    setCompressionStats(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmAndUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      setError(null);

      // 1. Recortar imagem via Canvas
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error('Falha ao recortar a imagem.');

      // 2. Compactar para WebP com metadados de economia
      const fileName = `foto-${Date.now()}.webp`;
      const result = await compressImage(croppedBlob, fileName, 0.5, 1200);
      setCompressionStats(result);

      // 3. Enviar para a API de Upload
      const formData = new FormData();
      formData.append('file', result.file);
      formData.append('folder', folder);
      formData.append('bucket', bucket);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || data.error || !data.publicUrl) {
        throw new Error(data.error || 'Erro ao enviar a imagem.');
      }

      onUploadSuccess(data.publicUrl);
      resetAndClose();
    } catch (err: any) {
      console.error('Erro no upload e compressão:', err);
      setError(err?.message || 'Falha ao processar e enviar a imagem.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAndClose = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCompressionStats(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl shadow-2xl p-6 sm:p-7 text-[var(--dash-text-primary)] my-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--dash-border)]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold">{title}</h3>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Recorte, compacte para WebP e envie imagens otimizadas para o portal.
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 rounded-xl hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Passo 1: Selecionar Imagem */}
        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 border-2 border-dashed border-[var(--dash-border)] hover:border-[#FFA82A]/60 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-[var(--dash-surface-hover)]/30 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <p className="mt-4 text-sm font-bold text-[var(--dash-text-primary)]">
              Clique para selecionar ou arraste uma foto aqui
            </p>
            <p className="text-xs text-[var(--dash-text-secondary)] mt-1">
              Formatos aceitos: JPG, PNG, WEBP. A imagem será automaticamente otimizada.
            </p>
          </div>
        ) : (
          /* Passo 2: Recorte e Configuração */
          <div className="mt-6 space-y-4">
            <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-black/90 border border-[var(--dash-border)]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Seletores de Proporção (Aspect Ratio) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[11px] font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider mr-1">
                  Enquadramento:
                </span>
                <button
                  type="button"
                  onClick={() => setAspect(undefined)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                    aspect === undefined
                      ? 'bg-[#8B1E22] text-white shadow-xs'
                      : 'bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)]'
                  }`}
                >
                  Livre
                </button>
                <button
                  type="button"
                  onClick={() => setAspect(16 / 9)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                    aspect === 16 / 9
                      ? 'bg-[#8B1E22] text-white shadow-xs'
                      : 'bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)]'
                  }`}
                >
                  16:9 (Paisagem)
                </button>
                <button
                  type="button"
                  onClick={() => setAspect(4 / 3)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                    aspect === 4 / 3
                      ? 'bg-[#8B1E22] text-white shadow-xs'
                      : 'bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)]'
                  }`}
                >
                  4:3 (Templo)
                </button>
                <button
                  type="button"
                  onClick={() => setAspect(1)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                    aspect === 1
                      ? 'bg-[#8B1E22] text-white shadow-xs'
                      : 'bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)]'
                  }`}
                >
                  1:1 (Quadrado)
                </button>
                <button
                  type="button"
                  onClick={() => setAspect(3 / 4)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                    aspect === 3 / 4
                      ? 'bg-[#8B1E22] text-white shadow-xs'
                      : 'bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)]'
                  }`}
                >
                  3:4 (Retrato / Bispo)
                </button>
              </div>

              {/* Botão de Trocar Imagem */}
              <button
                type="button"
                onClick={() => setImageSrc(null)}
                className="text-xs text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] flex items-center gap-1 min-h-[36px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Escolher outra</span>
              </button>
            </div>

            {/* Controle de Zoom */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--dash-surface-hover)]/40 border border-[var(--dash-border)]">
              <ZoomOut className="w-4 h-4 text-[var(--dash-text-secondary)]" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom da Imagem"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#8B1E22] cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-[var(--dash-text-secondary)]" />
              <span className="text-xs font-mono font-semibold text-[var(--dash-text-secondary)] min-w-[36px] text-right">
                {zoom.toFixed(1)}x
              </span>
            </div>

            {/* Rodapé e Ação de Envio */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--dash-border)]">
              <div className="text-[11px] text-[var(--dash-text-secondary)]">
                🚀 A foto será convertida para <strong className="text-[#FFA82A]">WebP</strong> com compressão inteligente.
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={resetAndClose}
                  disabled={isProcessing}
                  className="px-4 py-2.5 rounded-xl border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)] text-xs font-semibold transition-colors min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndUpload}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] hover:brightness-110 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 min-h-[44px]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Otimizando & Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Recortar, Compactar & Salvar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
