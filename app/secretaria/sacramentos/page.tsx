import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { 
  ArrowLeft, 
  FileText, 
  Heart, 
  ShieldCheck, 
  HelpCircle, 
  Phone, 
  MapPin, 
  Calendar,
  Sparkles,
  Building2
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { Badge, Card } from '@/components/ui';
import { Parish, Community } from '@/types';
import { SacramentRegistrationContainer } from '@/components/secretaria/sacramentos/SacramentRegistrationContainer';

export const metadata = {
  title: 'Inscrições Sacramentais & Cursos Pastorais | Secretaria On-line',
  description: 'Guia de requisitos, documentação necessária e pré-inscrição para Batismo, Catequese, Crisma, Encontro de Noivos e Gestantes.',
};

export default async function SacramentosSecretariaPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Buscar dados da Paróquia
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

  // 2. Buscar 12 Comunidades / CEBs
  const { data: communitiesData } = await supabase
    .from('communities')
    .select('*')
    .order('is_headquarters', { ascending: false })
    .order('name');

  const communities: Community[] = communitiesData || [];

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)]">
      {/* Banner / Header Topo */}
      <div className="border-b border-[var(--dash-border)] bg-[var(--dash-surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/secretaria"
              className="inline-flex items-center text-xs font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--primary)] transition-colors gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Balcão da Secretaria</span>
            </Link>

            <Link
              href="/secretaria/agendamentos"
              className="inline-flex items-center text-xs font-semibold text-[var(--primary)] hover:underline gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendamento com os Padres</span>
            </Link>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="matriz" className="text-[10px] font-bold uppercase tracking-wider">
                Secretaria Digital
              </Badge>
              <span className="text-xs text-[var(--dash-text-muted)]">
                • Diocese de Colatina
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--dash-text-primary)]">
              Inscrições Sacramentais & Cursos
            </h1>

            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-2xl leading-relaxed">
              Consulte a documentação necessária, requisitos canônicos e realize sua pré-inscrição on-line para Batismo, Catequese, Crisma, Encontro de Noivos ou Curso de Gestantes na Catedral e nas 12 Comunidades.
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Orquestrador de Sacramentos */}
        <SacramentRegistrationContainer
          parish={parish}
          communities={communities}
        />

        {/* FAQ Canônico & Dúvidas Frequentes */}
        <section className="space-y-4 pt-4 border-t border-[var(--dash-border)]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--dash-text-primary)]">
              Perguntas Frequentes sobre os Sacramentos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-1.5">
              <h3 className="font-bold text-[var(--dash-text-primary)] text-sm">
                Padrinho ou madrinha solteiro(a) pode batizar?
              </h3>
              <p className="text-[var(--dash-text-secondary)] leading-relaxed">
                Sim! Desde que tenha pelo menos 16 anos completos, seja católico(a) crismado(a) e viva em conformidade com os ensinamentos da Igreja. Pessoas que vivem em união estável sem matrimônio religioso não podem assumir o encargo de padrinhos.
              </p>
            </Card>

            <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-1.5">
              <h3 className="font-bold text-[var(--dash-text-primary)] text-sm">
                Como emitir a Certidão de Batismo para Noivos?
              </h3>
              <p className="text-[var(--dash-text-secondary)] leading-relaxed">
                A certidão para fins de casamento deve ser solicitada na paróquia onde você foi batizado, com antecedência máxima de 6 meses em relação à data da celebração. Se foi batizado na própria Catedral, a secretaria localiza seu assento no livro de batizados.
              </p>
            </Card>

            <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-1.5">
              <h3 className="font-bold text-[var(--dash-text-primary)] text-sm">
                A criança não é batizada. Pode fazer catequese?
              </h3>
              <p className="text-[var(--dash-text-secondary)] leading-relaxed">
                Sim, com muita alegria! Ela ingressará na turma da Primeira Eucaristia e, ao longo do itinerário catequético, será preparada junto à família para receber solenemente o Sacramento do Batismo antes da Primeira Comunhão.
              </p>
            </Card>

            <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-1.5">
              <h3 className="font-bold text-[var(--dash-text-primary)] text-sm">
                Moro em outro bairro ou cidade. Posso batizar aqui?
              </h3>
              <p className="text-[var(--dash-text-secondary)] leading-relaxed">
                Sim. Paroquianos residentes fora do território paroquial da Catedral devem solicitar uma <em>Autorização de Transferência de Batismo</em> na paróquia mais próxima de sua residência e apresentá-la na secretaria da Catedral.
              </p>
            </Card>
          </div>
        </section>

        {/* Rodapé de Atendimento Presencial */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--dash-text-primary)]">
                Dúvidas Especiais ou Casos Particulares?
              </h4>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Fale diretamente com nossa equipe de atendimento presencial na secretaria da Catedral.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${(parish.whatsapp_number || '552721025010').replace(/\D/g, '')}?text=${encodeURIComponent('Paz e Bem! Gostaria de tirar uma dúvida sobre inscrições sacramentais na Catedral.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <div className="px-4 py-2.5 rounded-xl bg-[var(--dash-surface-secondary)] hover:bg-[var(--dash-surface-hover)] border border-[var(--dash-border)] text-xs font-bold text-[var(--dash-text-primary)] flex items-center justify-center gap-2 transition-colors">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span>Chamar no WhatsApp</span>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
