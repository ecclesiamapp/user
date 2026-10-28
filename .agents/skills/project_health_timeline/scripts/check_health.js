/**
 * Script de Avaliação Automatizada de Saúde do Prazo e Progresso Técnico
 * Ecclesiam App & Catedral de Colatina
 * Fonte da Verdade: [documentation]/planejamento/PLANO_DESENVOLVIMENTO_NATAL_2026.md
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const MILESTONES = [
  {
    id: 'fase_1',
    name: 'Fase 1: Go-Live Oficial do Portal da Matriz & 12 CEBs',
    liturgical_event: '1º Domingo do Advento (Início do Ano Litúrgico C)',
    target_date: '2026-11-29',
    deliverables: [
      'Portal da Matriz e Mini-sites das 12 CEBs no ar no domínio definitivo',
      'Card Missas de Hoje e Palavra do Pároco/Bispo na Home',
      'Central do Dízimo (Theòs) + QR Code PIX de Doações',
      'Clero oficial (4 padres) e WhatsApp da secretaria',
      'Configuração de DNS, Cloudflare e Vercel (Produção)',
      'Capacitação da secretária e lideranças paroquiais'
    ]
  },
  {
    id: 'fase_2',
    name: 'Fase 2: Secretaria On-line & Agendamentos com Padres',
    liturgical_event: '2º Domingo do Advento',
    target_date: '2026-12-06',
    deliverables: [
      'Agendamento de confissões sacramentais com os 4 sacerdotes',
      'Inscrições de sacramentos (Batismo, Catequese, Noivos)',
      'Painel /admin/secretaria e sub-abas de atendimento',
      'Notificações por e-mail transacional (Resend)'
    ]
  },
  {
    id: 'fase_3',
    name: 'Fase 3: Inteligência Paroquial & Assistente IA',
    liturgical_event: '3º Domingo do Advento (Gaudete)',
    target_date: '2026-12-13',
    deliverables: [
      'Assistente IA Paroquial com RAG (Gemini 2.5 Flash + Supabase pgvector)',
      'Drawer flutuante global no /admin e hub de documentos',
      'Homologação de respostas canônicas e pastorais'
    ]
  },
  {
    id: 'fase_4',
    name: 'Fase 4: Solenidade de Natal & Consolidação Plena',
    liturgical_event: 'Natividade do Senhor (Natal)',
    target_date: '2026-12-25',
    deliverables: [
      'Grade especial da Novena de Natal e Missa do Galo',
      'Campanha de instalação do PWA nos celulares dos fiéis',
      'Encerramento do setup piloto e início da assinatura mensal'
    ]
  }
];

function getGitStatus() {
  try {
    const statusOut = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
    const branchOut = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    const uncommittedLines = statusOut ? statusOut.split('\n').filter(Boolean) : [];
    
    return {
      branch: branchOut || 'main',
      isClean: uncommittedLines.length === 0,
      uncommittedCount: uncommittedLines.length,
      uncommittedFiles: uncommittedLines.map((l) => l.trim())
    };
  } catch (err) {
    return {
      branch: 'desconhecido',
      isClean: false,
      uncommittedCount: 0,
      uncommittedFiles: []
    };
  }
}

function calculateHealth() {
  const now = new Date();
  const git = getGitStatus();

  // Encontra o próximo marco ativo
  let activeMilestone = MILESTONES.find((m) => new Date(m.target_date + 'T23:59:59') >= now);
  if (!activeMilestone) {
    activeMilestone = MILESTONES[MILESTONES.length - 1];
  }

  const target = new Date(activeMilestone.target_date + 'T00:00:00');
  const diffTime = target.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  let statusBadge = '🟢';
  let statusText = 'Excelente / No Prazo';
  let statusExplanation = `Faltam ${daysRemaining} dias para o marco "${activeMilestone.name}" (${activeMilestone.liturgical_event}). Janela confortável para execução fora do expediente.`;

  if (daysRemaining <= 5) {
    statusBadge = '🔴';
    statusText = 'Crítico / Alerta de Prazo';
    statusExplanation = `Atenção máxima: restam apenas ${daysRemaining} dias até ${activeMilestone.target_date}. Foco estrito nas pendências bloqueantes.`;
  } else if (daysRemaining <= 12) {
    statusBadge = '🟡';
    statusText = 'Atenção / Ritmo Médio';
    statusExplanation = `Faltam ${daysRemaining} dias até ${activeMilestone.target_date}. Recomendado acelerar pendências imediatas.`;
  }

  // Sugestões de trilhas por tempo disponível
  const tracks = {
    min_30: {
      time: '30 minutos',
      title: 'Pequenos Ajustes & Commit de Segurança',
      tasks: git.isClean
        ? ['Testar o upload de PDF de folheto no Supabase Storage via /admin/folhetos', 'Revisar textos e meta-tags do portal']
        : ['Executar o Protocolo Deploy (git add, commit & push das alterações pendentes de folhetos e layout)', 'Rodar validação de build local']
    },
    min_60: {
      time: '1 hora',
      title: 'Implementação Funcional Focal',
      tasks: [
        'Criar modal de cadastro/edição (CRUD) de Mensagens Pastorais em /admin/mensagens com gravação real no Supabase',
        'Validar persistência e alternância de destaque na Home da paróquia'
      ]
    },
    min_120: {
      time: '2 horas',
      title: 'Sprint Técnica de Pré-Produção',
      tasks: [
        'Executar Checklist do Protocolo de Lançamento em Produção (RLS, npm audit, variáveis Vercel)',
        'Configurar zona Cloudflare (Proxy Nuvem Laranja + SSL Strict) para catedraldecolatina.org.br',
        'Finalizar o fluxo completo do módulo de mensagens pastorais'
      ]
    },
    livre: {
      time: 'Livre / Maratona',
      title: 'Avanço de Marco Completo',
      tasks: [
        'Concluir 100% das pendências técnicas da Fase 1 e preparar o ambiente de produção definitivo para o Go-Live de 01/11'
      ]
    }
  };

  const output = {
    current_date: now.toISOString().split('T')[0],
    active_milestone: {
      id: activeMilestone.id,
      name: activeMilestone.name,
      event: activeMilestone.liturgical_event,
      target_date: activeMilestone.target_date,
      days_remaining: daysRemaining,
      health_badge: statusBadge,
      health_status: statusText,
      explanation: statusExplanation
    },
    milestones_overview: MILESTONES.map((m) => {
      const d = Math.ceil((new Date(m.target_date + 'T00:00:00').getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        id: m.id,
        name: m.name,
        target_date: m.target_date,
        days_remaining: Math.max(0, d),
        is_active: m.id === activeMilestone.id
      };
    }),
    git_health: git,
    suggested_tracks: tracks
  };

  return output;
}

if (require.main === module) {
  const result = calculateHealth();
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { calculateHealth, MILESTONES };
