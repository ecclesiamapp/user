import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowLeft, FileText, BookOpen, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Badge, Card } from '@/components/ui';
import { Parish } from '@/types';
import { CertificateRequestForm } from '@/components/secretaria/certidoes/CertificateRequestForm';

export const metadata = {
  title: 'Solicitação de Certidões & Documentos Paroquiais | Secretaria Paroquial',
  description: 'Solicite 2ª via de Certidão de Batismo, Crisma, Matrimônio Religioso ou Transferência de Noivos na Catedral de Colatina.',
};

export default async function CertidoesSecretariaPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Buscar Paróquia
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const parish: Parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    slug: 'catedral-colatina',
    city: 'Colatina',
    state: 'ES',
    address: 'Praça Frei José, Nº 26, Centro - Edifício João Paulo II (1º Andar)',
    whatsapp_number: '552721025010',
    pix_key: 'secretaria@catedraldecolatina.org.br',
    pix_key_type: 'email',
    primary_color: '#8B1E22',
    created_at: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between">
      {/* Header com Glassmorphism */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/80 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/secretaria"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Secretaria</span>
          </Link>

          <Badge variant="matriz" className="text-xs">
            Arquivo Paroquial
          </Badge>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full">
        {/* Banner Pastoral */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Livros de Tombo & Arquivo</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
            Solicitação de Certidões & Documentos
          </h1>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-2xl leading-relaxed">
            Peça a 2ª via da sua Certidão de Batismo, comprovante de Crisma, Certidão de Matrimônio ou Transferência de Noivos sem filas.
          </p>
        </div>

        {/* Guia Rápido de Prazos e Retirada */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Card className="p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-0.5">
              <span className="font-bold block text-[var(--dash-text-primary)]">Prazo de Busca</span>
              <span className="text-[var(--dash-text-secondary)]">3 a 5 dias úteis para localização nos livros físicos.</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-0.5">
              <span className="font-bold block text-[var(--dash-text-primary)]">Validade Canônica</span>
              <span className="text-[var(--dash-text-secondary)]">Documento emitido com carimbo e assinatura paroquial.</span>
            </div>
          </Card>

          <Card className="p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-0.5">
              <span className="font-bold block text-[var(--dash-text-primary)]">Retirada Presencial</span>
              <span className="text-[var(--dash-text-secondary)]">Edifício João Paulo II - 1º Andar (Centro).</span>
            </div>
          </Card>
        </div>

        {/* Formulário Interativo */}
        <CertificateRequestForm parish={parish} />
      </main>

      {/* Rodapé White-Label */}
      <footer className="mt-12 border-t border-[var(--dash-border)] bg-[var(--dash-surface)] py-6 text-center text-xs text-[var(--dash-text-secondary)]">
        <p className="font-semibold text-[var(--dash-text-primary)]">© {new Date().getFullYear()} {parish.name}</p>
        <p>Todos os direitos reservados. {parish.diocese}.</p>
      </footer>
    </div>
  );
}
