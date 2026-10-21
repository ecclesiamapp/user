'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Printer, 
  Smartphone, 
  QrCode, 
  ExternalLink, 
  FileText, 
  Scissors, 
  Eye, 
  Church, 
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui';

export default function MateriaisImpressaoAdminPage() {
  const targetUrl = 'https://catedraldecolatina.org.br/instalar';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}&margin=4&format=svg`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--dash-border)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Campanha Pastoral de Acesso Rápido (PWA)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--dash-text-primary)] font-cinzel tracking-[0.04em] uppercase pt-1">
            Cartazes & Displays para os Bancos
          </h1>
          <p className="text-sm text-[var(--dash-text-secondary)] pt-1">
            Gere materiais impressos oficiais com QR Code para os bancos e murais da Catedral do Sagrado Coração de Jesus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/instalar/imprimir" target="_blank">
            <Button
              variant="primary"
              size="md"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold min-h-[44px] text-xs shadow-md shadow-amber-500/20"
              icon={<Printer className="w-4 h-4" />}
            >
              Abrir Central de Impressão
            </Button>
          </Link>
        </div>
      </div>

      {/* Card de Resumo Pastoral da Campanha */}
      <div className="p-6 rounded-3xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-md grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Objetivo da Campanha nos Bancos
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--dash-text-primary)] font-serif">
            Como funciona a adesão dos fiéis durante as Santas Missas?
          </h2>
          <p className="text-sm text-[var(--dash-text-secondary)] leading-relaxed">
            Ao fixar pequenos displays ou adesivos discretos nos bancos de madeira da Catedral, os fiéis podem apontar o celular antes ou depois da Santa Missa para ler o QR Code e salvar o ícone da Catedral diretamente na tela inicial do smartphone.
          </p>
          <ul className="text-xs text-[var(--dash-text-secondary)] space-y-1.5 pt-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Sem baixar nada de lojas pesadas: funciona instantaneamente no navegador.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Acesso direto ao folheto dominical («Sou do Sagrado Missa») sem custo de papel.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Grade de missas da Matriz e das 12 CEBs sempre atualizadas na palma da mão.</span>
            </li>
          </ul>
        </div>

        {/* QR Code de Demonstração */}
        <div className="p-5 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex flex-col items-center justify-center text-center space-y-2.5">
          <div className="p-2.5 bg-[var(--dash-surface)] rounded-xl shadow-xs border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl}
              alt="QR Code Oficial da Campanha"
              className="w-32 h-32 object-contain"
            />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--dash-text-primary)] block">
              Destino do QR Code:
            </span>
            <span className="text-[11px] text-amber-400 font-mono block">
              /instalar
            </span>
          </div>
        </div>
      </div>

      {/* Modelos Disponíveis para Impressão */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[var(--dash-text-primary)] font-serif">
          Modelos Prontos para Impressão (Folha A4)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Modelo 1: Cartaz A4 */}
          <div className="p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-800/20 text-red-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[var(--dash-text-primary)]">
                1. Cartaz A4 (Mural & Portas)
              </h4>
              <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
                Ideal para afixar no mural da entrada da Catedral, átrio, portas principais e secretaria paroquial.
              </p>
              <div className="text-[11px] text-amber-400/90 font-medium pt-1">
                • 1 cartaz grande por folha A4 com brasão e cores oficiais.
              </div>
            </div>

            <Link href="/instalar/imprimir?modelo=cartaz-a4" target="_blank">
              <Button variant="outline" size="sm" className="w-full text-xs min-h-[40px]" icon={<Eye className="w-3.5 h-3.5" />}>
                Visualizar & Imprimir
              </Button>
            </Link>
          </div>

          {/* Modelo 2: Displays de Bancos (4x) */}
          <div className="p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[var(--dash-text-primary)]">
                2. Displays de Banco (4 por Folha)
              </h4>
              <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
                Etiquetas retangulares para cortar e colar nos bancos de madeira ou colocar nos suportes de acrílico.
              </p>
              <div className="text-[11px] text-amber-400/90 font-medium pt-1">
                • 4 displays por folha com linhas de corte pontilhadas.
              </div>
            </div>

            <Link href="/instalar/imprimir?modelo=displays-banco" target="_blank">
              <Button variant="outline" size="sm" className="w-full text-xs min-h-[40px]" icon={<Eye className="w-3.5 h-3.5" />}>
                Visualizar & Imprimir
              </Button>
            </Link>
          </div>

          {/* Modelo 3: Cartões de Bolso (6x) */}
          <div className="p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[var(--dash-text-primary)]">
                3. Cartões de Bolso (6 por Folha)
              </h4>
              <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
                Cartões compactos para distribuição pessoal nas missas ou no balcão da secretaria paroquial.
              </p>
              <div className="text-[11px] text-amber-400/90 font-medium pt-1">
                • 6 cartões por folha prontos para recorte rápido.
              </div>
            </div>

            <Link href="/instalar/imprimir?modelo=cartoes-bolso" target="_blank">
              <Button variant="outline" size="sm" className="w-full text-xs min-h-[40px]" icon={<Eye className="w-3.5 h-3.5" />}>
                Visualizar & Imprimir
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Guia Rápido para a Secretária / PASCOM */}
      <div className="p-5 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2 text-xs text-[var(--dash-text-secondary)]">
        <h4 className="font-bold text-sm text-[var(--dash-text-primary)] flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          Orientações Práticas para Aplicação na Catedral
        </h4>
        <p>
          1. <strong>Impressão:</strong> Imprima em papel offset comum (75g ou 90g) ou papel fotográfico/adesivo para maior durabilidade nos bancos.
        </p>
        <p>
          2. <strong>Bancos:</strong> Recomenda-se afixar 1 display a cada 3 bancos da nave central da Catedral para garantir visibilidade confortável para todos os fiéis sentados.
        </p>
        <p>
          3. <strong>Avisos Paroquiais:</strong> Pe. Irineu ou os comentaristas da PASCOM podem convidar os fiéis ao final da Santa Missa: <em>«Observem o QR Code fixado no banco à frente de vocês para salvar o aplicativo da Catedral no seu telefone»</em>.
        </p>
      </div>
    </div>
  );
}
