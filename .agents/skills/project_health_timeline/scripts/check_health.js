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
    id: 'fase_natal',
    name: 'Solenidade do Natal & Go-Live Pleno',
    liturgical_event: 'Natividade de Nosso Senhor Jesus Cristo',
    target_date: '2026-12-25',
    is_primary: true,
    deliverables: [
      'Grade especial da Novena de Natal, Missa da Vigília (Missa do Galo) e Ano Novo',
      'Cartas Pastorais de Natal do Pároco Pe. Irineu e do Bispo Dom Lauro em destaque',
      'Campanha de instalação do PWA com cartazes e displays nos bancos (/instalar/imprimir)',
      'Apontamento definitivo de DNS catedraldecolatina.org.br e Escudo Cloudflare',
      'Hardening de banco Supabase Pro e início do ciclo de mensalidade SaaS'
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

  // Sugestões de trilhas por tempo disponível (Foco: Solenidade do Natal 2026)
  const tracks = {
    min_30: {
      time: '30 minutos',
      title: 'Homologação de Materiais de Impressão PWA para os Bancos (/instalar/imprimir)',
      tasks: [
        'Revisar e imprimir em tela os 3 formatos de QR Code (Cartaz A4, Displays de Banco e Cartões de Bolso) em /instalar/imprimir',
        'Validar layout responsivo mobile e contraste no modo P&B para impressão na paróquia'
      ]
    },
    min_60: {
      time: '1 hora',
      title: 'Programação Litúrgica Especial de Natal 2026 (/programacao)',
      tasks: [
        'Cadastrar ou ajustar no construtor de festas (/admin/programacao) a grade da Novena de Natal, Missa do Galo e Missas de Natal e Ano Novo',
        'Ativar o banner oficial de contagem regressiva da Solenidade do Natal na Home'
      ]
    },
    min_120: {
      time: '2 horas',
      title: 'Sprint de Natal: Mensagens Pastorais & Hardening Supabase',
      tasks: [
        'Ativar as Cartas Pastorais solenes de Natal de Pe. Irineu e Dom Lauro na Home e em /mensagens (seed 20261027_seed_advent_christmas_pastoral_messages.sql)',
        'Configurar a chave SUPABASE_SERVICE_ROLE_KEY e avançar no fechamento de RLS/banco sem pressa'
      ]
    },
    livre: {
      time: 'Livre / Maratona',
      title: 'Consolidação Plena de Natal',
      tasks: [
        'Concluir 100% do ecossistema de Natal (Grade Especial, PWA nos bancos, DNS Cloudflare e homologação geral para 25/12)'
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
