import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  HeartHandshake, 
  Eye, 
  FileText, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { CathedralFooter } from '@/components/home/CathedralFooter';

export const metadata: Metadata = {
  title: 'Política de Privacidade & LGPD • Catedral do Sagrado Coração de Jesus',
  description:
    'Conheça nosso compromisso com a privacidade, proteção de dados dos fiéis, sigilo pastoral e conformidade com a LGPD e o ECA Digital.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--dash-bg,#0a0a0f)] text-[var(--dash-text-primary,#f3f4f6)] flex flex-col justify-between selection:bg-[#8B1E22]/30 selection:text-white">
      {/* Header Superior com Navegação */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[var(--dash-surface,#13131a)]/80 border-b border-[var(--dash-border,#262633)] px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--dash-text-secondary,#9ca3af)] hover:text-white transition-colors group py-1.5 px-3 rounded-xl hover:bg-[var(--dash-surface)]/5"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Voltar ao Portal</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Em Conformidade LGPD & ECA Digital
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 w-full space-y-12">
        {/* Hero da Página */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#8B1E22]/15 text-[#e57373] border border-[#8B1E22]/30 mb-2 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            Privacidade & Proteção de Dados
          </h1>
          <p className="text-base sm:text-lg text-[var(--dash-text-secondary,#9ca3af)] max-w-2xl mx-auto leading-relaxed">
            Na Paróquia Sagrado Coração de Jesus — Catedral de Colatina, o cuidado pastoral caminha lado a lado com a proteção, sigilo e respeito integral à sua privacidade.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-[var(--dash-text-muted,#6b7280)] pt-2">
            <span>Versão Oficial 1.0</span>
            <span>•</span>
            <span>Vigência: 23 de Outubro de 2026</span>
          </div>
        </section>

        {/* Card TL;DR - Resumo Rápido */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[var(--dash-surface,#181824)] to-[var(--dash-surface-hover,#1e1e2d)] border border-[var(--dash-border,#2a2a3c)] shadow-lg space-y-4">
          <div className="flex items-center gap-3 text-amber-400 font-semibold text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Resumo em Linguagem Simples (Nosso Compromisso com Você)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--dash-text-secondary,#9ca3af)] leading-relaxed">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Finalidade Estritamente Pastoral:</strong> Seus dados são usados apenas para agendamentos, sacramentos, catequese e dízimo comunitário.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Sigilo Sacramental Inviolável:</strong> As confissões e orientações espirituais contam com o segredo canônico absoluto (Cânon 983).</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Proteção aos Menores (ECA Digital):</strong> Inscrições de catequese exigem autorização parental sem perfilamento comercial de crianças.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Zero Comercialização:</strong> Jamais vendemos, alugamos ou repassamos listas de paroquianos ou dizimistas para fins de marketing.</span>
            </div>
          </div>
        </section>

        {/* Seções Detalhadas em Grid/Cards */}
        <div className="space-y-6">
          {/* Seção 1: Controlador e DPO */}
          <article className="p-6 rounded-2xl bg-[var(--dash-surface,#14141c)] border border-[var(--dash-border,#222230)] space-y-3">
            <div className="flex items-center gap-3 text-white font-semibold text-base sm:text-lg">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2>1. Quem é o Controlador dos seus Dados?</h2>
            </div>
            <p className="text-sm text-[var(--dash-text-secondary,#9ca3af)] leading-relaxed">
              O controlador dos dados pessoais tratados neste portal é a <strong>Paróquia Sagrado Coração de Jesus — Catedral de Colatina</strong>, pessoa jurídica de direito canônico vinculada à Mitra Diocesana de Colatina.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-[var(--dash-text-secondary,#9ca3af)]">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#e57373]" />
                Encarregado de Dados (DPO): <strong className="text-white">privacidade@catedraldecolatina.org.br</strong>
              </span>
            </div>
          </article>

          {/* Seção 2: Dados Coletados */}
          <article className="p-6 rounded-2xl bg-[var(--dash-surface,#14141c)] border border-[var(--dash-border,#222230)] space-y-4">
            <div className="flex items-center gap-3 text-white font-semibold text-base sm:text-lg">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <h2>2. Quais Dados Tratamos e Para Que Finalidade?</h2>
            </div>
            <ul className="space-y-3 text-sm text-[var(--dash-text-secondary,#9ca3af)]">
              <li className="p-3.5 rounded-xl bg-[var(--dash-surface)]/[0.02] border border-white/5 space-y-1">
                <span className="font-semibold text-white block">A. Agendamentos com Padres & Confissões</span>
                <span>Nome, telefone celular/WhatsApp, e-mail e data. Relatos subjetivos de orientação espiritual são expurgados automaticamente do banco após 90 dias.</span>
              </li>
              <li className="p-3.5 rounded-xl bg-[var(--dash-surface)]/[0.02] border border-white/5 space-y-1">
                <span className="font-semibold text-white block">B. Inscrições Sacramentais (Batismo, Catequese, Crisma, Noivos)</span>
                <span>Nome do responsável legal, dados da criança/adolescente, data de nascimento e certidões anexadas. Os arquivos digitais são eliminados do servidor em até 180 dias após o sacramento, permanecendo o registro perpétuo nos Livros de Tombo Físicos da Igreja (Cânon 535).</span>
              </li>
              <li className="p-3.5 rounded-xl bg-[var(--dash-surface)]/[0.02] border border-white/5 space-y-1">
                <span className="font-semibold text-white block">C. Pastoral do Dízimo ("Sou do Sagrado")</span>
                <span>Nome, endereço, data de nascimento e modalidade de contribuição. Destina-se exclusivamente à sustentação do templo, caridade e evangelização das 12 comunidades.</span>
              </li>
            </ul>
          </article>

          {/* Seção 3: ECA Digital */}
          <article className="p-6 rounded-2xl bg-[var(--dash-surface,#14141c)] border border-[var(--dash-border,#222230)] space-y-3">
            <div className="flex items-center gap-3 text-white font-semibold text-base sm:text-lg">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h2>3. Proteção Especial à Infância & ECA Digital (Lei 15.211/2025)</h2>
            </div>
            <p className="text-sm text-[var(--dash-text-secondary,#9ca3af)] leading-relaxed">
              Em total harmonia com o Artigo 14 da LGPD e a Lei nº 15.211/2025 (ECA Digital), a inscrição de crianças e adolescentes na catequese ou batismo requer o consentimento expresso de ao menos um dos pais ou responsável legal. A paróquia proíbe terminantemente qualquer perfilamento comercial ou uso secundário de dados de menores.
            </p>
          </article>

          {/* Seção 4: Operadores de Nuvem */}
          <article className="p-6 rounded-2xl bg-[var(--dash-surface,#14141c)] border border-[var(--dash-border,#222230)] space-y-3">
            <div className="flex items-center gap-3 text-white font-semibold text-base sm:text-lg">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <h2>4. Com Quem Seus Dados São Compartilhados?</h2>
            </div>
            <p className="text-sm text-[var(--dash-text-secondary,#9ca3af)] leading-relaxed">
              Seus dados pessoais trafegam exclusivamente por infraestruturas de nuvem sob estritos Acordos de Tratamento de Dados (DPA):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-[var(--dash-surface)]/[0.02] border border-white/5">
                <strong className="text-white block mb-0.5">Supabase Inc. (AWS)</strong>
                <span className="text-[var(--dash-text-muted,#6b7280)]">Banco de dados e armazenamento criptografado sob AES-256 e TLS 1.3.</span>
              </div>
              <div className="grid p-3 rounded-xl bg-[var(--dash-surface)]/[0.02] border border-white/5">
                <strong className="text-white block mb-0.5">Vercel Inc.</strong>
                <span className="text-[var(--dash-text-muted,#6b7280)]">Rede de entrega rápida e servidores seguros de aplicação web.</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--dash-surface)]/[0.02] border border-white/5">
                <strong className="text-white block mb-0.5">Resend Inc.</strong>
                <span className="text-[var(--dash-text-muted,#6b7280)]">Disparo transacional de e-mails de confirmação de agendamentos.</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--dash-surface)]/[0.02] border border-white/5">
                <strong className="text-white block mb-0.5">Theos Sistemas</strong>
                <span className="text-[var(--dash-text-muted,#6b7280)]">Sistema contábil diocesano para emissão de carnês e recibos de dízimo.</span>
              </div>
            </div>
          </article>

          {/* Seção 5: Seus Direitos */}
          <article className="p-6 rounded-2xl bg-[var(--dash-surface,#14141c)] border border-[var(--dash-border,#222230)] space-y-4">
            <div className="flex items-center gap-3 text-white font-semibold text-base sm:text-lg">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Eye className="w-5 h-5" />
              </div>
              <h2>5. Seus Direitos como Titular (Art. 18 da LGPD)</h2>
            </div>
            <p className="text-sm text-[var(--dash-text-secondary,#9ca3af)] leading-relaxed">
              Você tem direito de nos solicitar, a qualquer momento e gratuitamente:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--dash-text-secondary,#9ca3af)]">
              <span className="flex items-center gap-2">• Confirmação da existência de tratamento</span>
              <span className="flex items-center gap-2">• Acesso transparente aos seus dados</span>
              <span className="flex items-center gap-2">• Correção de dados inexatos ou desatualizados</span>
              <span className="flex items-center gap-2">• Eliminação de dados tratados com consentimento</span>
              <span className="flex items-center gap-2">• Portabilidade em formato aberto (JSON/CSV)</span>
              <span className="flex items-center gap-2">• Revogação de consentimento e opt-out</span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-[#8B1E22]/10 border border-[#8B1E22]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-sm font-semibold text-white block">Deseja exercer algum desses direitos?</span>
                <span className="text-xs text-[var(--dash-text-secondary,#9ca3af)]">Entre em contato direto com o nosso Encarregado pelo canal exclusivo:</span>
              </div>
              <a
                href="mailto:privacidade@catedraldecolatina.org.br?subject=Solicita%C3%A7%C3%A3o%20LGPD%20-%20Catedral%20de%20Colatina"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#8B1E22] hover:bg-[#a62429] text-white text-xs font-semibold shadow-md transition-colors shrink-0"
              >
                <Mail className="w-4 h-4" />
                <span>Contatar DPO</span>
              </a>
            </div>
          </article>
        </div>
      </main>

      {/* Footer da Catedral */}
      <CathedralFooter />
    </div>
  );
}
