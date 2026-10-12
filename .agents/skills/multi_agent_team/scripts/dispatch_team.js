#!/usr/bin/env node

/**
 * Multi-Agent Team Dispatcher (Adaptado de oh-my-claudecode para o Ecclesiam App / Antigravity)
 * Permite coordenar 19 especialistas em 4 pods dedicados.
 */

const fs = require('fs');
const path = require('path');

const SPECIALISTS = {
  // Pod 1: Análise e Estratégia
  architect: {
    pod: 'Análise e Estratégia',
    icon: '🧠',
    desc: 'Arquitetura de software, padrões de design, escalabilidade e acoplamento.'
  },
  debugger: {
    pod: 'Análise e Estratégia',
    icon: '🔍',
    desc: 'Diagnóstico de causa-raiz de bugs, exceções em runtime e gargalos.'
  },
  tracer: {
    pod: 'Análise e Estratégia',
    icon: '🗺️',
    desc: 'Mapeamento de fluxo de execução, dependências e ciclo de vida de dados.'
  },
  explore: {
    pod: 'Análise e Estratégia',
    icon: '🌐',
    desc: 'Exploração rápida do repositório, bibliotecas e integrações desconhecidas.'
  },
  'document-specialist': {
    pod: 'Análise e Estratégia',
    icon: '📄',
    desc: 'Documentação técnica, sincronização com o SSOT e manuais de implementação.'
  },
  scientist: {
    pod: 'Análise e Estratégia',
    icon: '🔬',
    desc: 'Análise quantitativa, algoritmos complexos, benchmarks e estruturas de dados.'
  },

  // Pod 2: Execução e Engenharia
  executor: {
    pod: 'Execução e Engenharia',
    icon: '⚡',
    desc: 'Implementação cirúrgica de código, resolução de issues e criação de features.'
  },
  'code-simplifier': {
    pod: 'Execução e Engenharia',
    icon: '🧹',
    desc: 'Refatoração anti-monólito, redução de complexidade ciclomática e DRY.'
  },
  'git-master': {
    pod: 'Execução e Engenharia',
    icon: '🌿',
    desc: 'Gestão de branches, commits atômicos padronizados e integridade do Git.'
  },
  designer: {
    pod: 'Execução e Engenharia',
    icon: '🎨',
    desc: 'Design de interfaces, Dark Mode, Tailwind CSS, microinterações e estética premium.'
  },
  writer: {
    pod: 'Execução e Engenharia',
    icon: '✍️',
    desc: 'Redação técnica, microcopy de interface, termos pastorais e mensagens de erro.'
  },

  // Pod 3: Qualidade, QA e Segurança
  'qa-tester': {
    pod: 'Qualidade, QA e Segurança',
    icon: '🧪',
    desc: 'Criação de cenários de teste, casos de borda e validações comportamentais.'
  },
  'code-reviewer': {
    pod: 'Qualidade, QA e Segurança',
    icon: '🔎',
    desc: 'Revisão minuciosa de diffs, code smells, convenções e boas práticas.'
  },
  'security-reviewer': {
    pod: 'Qualidade, QA e Segurança',
    icon: '🛡️',
    desc: 'Auditoria de segurança, RLS de banco, sanitização de inputs e chaves de API.'
  },
  verifier: {
    pod: 'Qualidade, QA e Segurança',
    icon: '🎯',
    desc: 'Validação de critérios de aceitação, compilação de build e integridade estrita.'
  },
  critic: {
    pod: 'Qualidade, QA e Segurança',
    icon: '🧐',
    desc: 'Crítica adversarial: procura ativamente falhas, premissas frágeis e riscos ocultos.'
  },

  // Pod 4: Produto e Orquestração
  planner: {
    pod: 'Produto e Orquestração',
    icon: '📋',
    desc: 'Decomposição de requisitos em planos de ação cronológicos e acionáveis.'
  },
  analyst: {
    pod: 'Produto e Orquestração',
    icon: '📊',
    desc: 'Avaliação de impacto de negócio, requisitos funcionais e valor para o usuário.'
  },
  autopilot: {
    pod: 'Produto e Orquestração',
    icon: '🤖',
    desc: 'Orquestrador autônomo que coordena a esteira completa: Planejar -> Executar -> Revisar -> Verificar.'
  }
};

const args = process.argv.slice(2);

function printList() {
  console.log('\n======================================================');
  console.log('🤖 MULTI-AGENT SPECIALIST SQUAD (OH-MY-CLAUDENATIVE)');
  console.log('Total: 19 Agentes Especialistas Ativos');
  console.log('======================================================\n');

  const pods = {};
  for (const [key, data] of Object.entries(SPECIALISTS)) {
    if (!pods[data.pod]) pods[data.pod] = [];
    pods[data.pod].push({ id: key, ...data });
  }

  for (const [podName, members] of Object.entries(pods)) {
    console.log(`\n📌 POD: ${podName.toUpperCase()}`);
    console.log('------------------------------------------------------');
    for (const m of members) {
      console.log(` ${m.icon} ${m.id.padEnd(20)} : ${m.desc}`);
    }
  }
  console.log('\n======================================================');
  console.log('Exemplos de uso:');
  console.log('  node dispatch_team.js --team architect,executor,verifier "Implementar autenticação"');
  console.log('  node dispatch_team.js --autopilot "Corrigir bugs de CSS e validar no build"');
  console.log('======================================================\n');
}

function dispatchSquad(rolesString, taskDesc) {
  const roles = rolesString.split(',').map(r => r.trim().toLowerCase());
  const validRoles = [];
  const unknownRoles = [];

  for (const r of roles) {
    if (SPECIALISTS[r]) {
      validRoles.push({ id: r, ...SPECIALISTS[r] });
    } else {
      unknownRoles.push(r);
    }
  }

  if (unknownRoles.length > 0) {
    console.error(`⚠️ Especialistas desconhecidos: ${unknownRoles.join(', ')}`);
  }

  if (validRoles.length === 0) {
    console.error('❌ Nenhum especialista válido especificado.');
    process.exit(1);
  }

  console.log('\n🚀 [SQUAD CONVOCADA COM SUCESSO]');
  console.log(`📋 Missão: "${taskDesc}"`);
  console.log(`👥 Membros Atribuídos (${validRoles.length}):`);
  validRoles.forEach((role, idx) => {
    console.log(`  ${idx + 1}. ${role.icon} [${role.id.toUpperCase()}] - ${role.desc}`);
  });
  console.log('\n⚡ Protocolo de Operação: Integrado com as regras do Ecclesiam App & Antigravity.');
  console.log('------------------------------------------------------');
}

function autopilot(taskDesc) {
  console.log('\n🤖 [MODO AUTOPILOT ATIVADO]');
  console.log(`🎯 Demanda: "${taskDesc}"`);
  console.log('\n🔍 Analisando os 19 especialistas e montando o time ideal...');

  const lower = taskDesc.toLowerCase();
  let squad = ['planner', 'executor', 'verifier'];

  if (lower.includes('bug') || lower.includes('erro') || lower.includes('fix')) {
    squad = ['debugger', 'executor', 'verifier'];
  } else if (lower.includes('css') || lower.includes('ui') || lower.includes('design') || lower.includes('layout')) {
    squad = ['designer', 'executor', 'critic'];
  } else if (lower.includes('banco') || lower.includes('sql') || lower.includes('rls') || lower.includes('segurança')) {
    squad = ['architect', 'security-reviewer', 'executor'];
  } else if (lower.includes('refator') || lower.includes('monolito') || lower.includes('limpar')) {
    squad = ['code-simplifier', 'executor', 'verifier'];
  }

  dispatchSquad(squad.join(','), taskDesc);
}

// Roteamento
if (args.length === 0 || args.includes('--list') || args.includes('-l')) {
  printList();
  process.exit(0);
}

if (args.includes('--autopilot')) {
  const taskIdx = args.indexOf('--autopilot') + 1;
  const task = args.slice(taskIdx).join(' ') || 'Execução autônoma geral';
  autopilot(task);
  process.exit(0);
}

if (args.includes('--team')) {
  const teamIdx = args.indexOf('--team') + 1;
  const roles = args[teamIdx] || 'executor';
  const task = args.slice(teamIdx + 1).join(' ') || 'Tarefa do time';
  dispatchSquad(roles, task);
  process.exit(0);
}

// Fallback
printList();
