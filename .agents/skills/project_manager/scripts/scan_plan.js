/**
 * Scanner Automatizado do Plano de Ação — Gerente de Projeto
 * Ecclesiam App & Catedral de Colatina
 * Fonte de Leitura: [documentation]/planejamento/PLANO_DE_ACAO_DETALHADO.md
 */

const fs = require('fs');
const path = require('path');

// Localização segura da raiz do projeto
function getProjectRoot() {
  let curr = __dirname;
  while (curr !== path.parse(curr).root) {
    if (fs.existsSync(path.join(curr, 'package.json'))) {
      return curr;
    }
    curr = path.dirname(curr);
  }
  return path.resolve(__dirname, '../../../..');
}

const ROOT_DIR = getProjectRoot();
const PLAN_PATH_PRIMARY = path.join(ROOT_DIR, '[documentation]/planejamento/PLANO_DE_ACAO_DETALHADO.md');
const PLAN_PATH_SECONDARY = path.join(ROOT_DIR, '[documentation]/PLANO_DE_ACAO_DETALHADO.md');


// Metadados técnicos enriquecidos por tarefa para apoiar o Card Executivo
const TASK_METADATA = {
  'TASK-09': {
    phase: 'Fase 1 (Solenidade de Todos os Santos)',
    category: 'Capacitação / Documentação',
    estimated_time: '30 a 45 minutos',
    files: [
      '[documentation]/planejamento/ROTEIRO_TREINAMENTO_SECRETARIA.md',
      '[documentation]/ROTEIRO_TREINAMENTO_SECRETARIA.md'
    ],
    objective: 'Criar a apostila/roteiro oficial de treinamento da secretária paroquial (4h presenciais) para uso prático das telas /admin (horários, avisos, folhetos e mensagens).'
  },
  'TASK-10': {
    phase: 'Fase 1 (Solenidade de Todos os Santos)',
    category: 'Segurança & Banco de Dados (Supabase)',
    estimated_time: '30 minutos',
    files: [
      'supabase/migrations/',
      'utils/supabase/'
    ],
    objective: 'Auditar políticas de Row Level Security (RLS) garantindo isolamento estrito por parish_id em todas as tabelas (pastoral_messages, liturgical_booklets, communities, etc.).'
  },
  'TASK-11': {
    phase: 'Fase 1 (Solenidade de Todos os Santos)',
    category: 'Infraestrutura & Dependências',
    estimated_time: '20 minutos',
    files: [
      'package.json',
      '.env.example'
    ],
    objective: 'Executar npm audit para checagem de vulnerabilidades e validar checklist de variáveis de ambiente de produção na Vercel.'
  },
  'TASK-12': {
    phase: 'Fase 1 (Solenidade de Todos os Santos)',
    category: 'DevOps & Domínio',
    estimated_time: '25 minutos',
    files: [
      '[documentation]/planejamento/ROTEIRO_DEPLOY_DOMINIO_PORTAL_CATEDRAL.md'
    ],
    objective: 'Apontamento de DNS e configuração da zona Cloudflare (Proxy Nuvem Laranja + SSL Full Strict) para catedraldecolatina.org.br.',
    is_blocked: true,
    block_reason: 'Aguardando credenciais de acesso ao DNS pela paróquia.'
  },
  'TASK-15': {
    phase: 'Fase 2 (Solenidade de Cristo Rei)',
    category: 'Back-end & Front-end Admin',
    estimated_time: '45 minutos',
    files: [
      'app/admin/comunidades/page.tsx',
      'components/admin/comunidades/'
    ],
    objective: 'Criar modal e formulário no /admin/comunidades para edição de histórico, fundadores e contatos das 12 CEBs com persistência no Supabase.'
  },
  'TASK-16': {
    phase: 'Fase 2 (Solenidade de Cristo Rei)',
    category: 'Admin & Filtro de Missas',
    estimated_time: '40 minutos',
    files: [
      'app/admin/horarios/page.tsx'
    ],
    objective: 'Refinar o gerenciamento de horários no /admin/horarios permitindo filtrar e cadastrar missas e celebrações da palavra específicas para cada uma das 12 capelas.'
  },
  'TASK-20': {
    phase: 'Fase 3 (2º Domingo do Advento)',
    category: 'Modelagem Supabase & Agendamentos',
    estimated_time: '1 hora',
    files: [
      'supabase/migrations/20261101_create_pastoral_appointments.sql',
      'types/index.ts'
    ],
    objective: 'Criar tabela pastoral_appointments com suporte a horários e slots dos 4 sacerdotes (Pe. Irineu, Pe. Adilson, Pe. Deivid, Pe. Ernandes).'
  }
};

function parsePlan(content) {
  const lines = content.split('\n');
  const tasks = [];
  let currentPhase = 'Geral';

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentPhase = line.replace('## ', '').trim();
    }

    const taskMatch = line.match(/- \[(x| )\] \*\*([A-Z0-9-]+):\*\* (.*)/);
    if (taskMatch) {
      const isCompleted = taskMatch[1] === 'x';
      const taskId = taskMatch[2];
      const taskDesc = taskMatch[3];

      tasks.push({
        id: taskId,
        phase: currentPhase,
        description: taskDesc,
        completed: isCompleted,
        metadata: TASK_METADATA[taskId] || {
          phase: currentPhase,
          category: 'Desenvolvimento',
          estimated_time: '30 a 60 minutos',
          files: [],
          objective: taskDesc
        }
      });
    }
  }

  return tasks;
}

function scanPlan() {
  if (!fs.existsSync(PLAN_PATH_PRIMARY)) {
    throw new Error(`Plano de ação não encontrado em: ${PLAN_PATH_PRIMARY}`);
  }

  const content = fs.readFileSync(PLAN_PATH_PRIMARY, 'utf-8');
  const tasks = parsePlan(content);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Agrupamento por fase
  const phaseMap = {};
  for (const t of tasks) {
    if (!phaseMap[t.phase]) {
      phaseMap[t.phase] = { total: 0, completed: 0, pending: 0, tasks: [] };
    }
    phaseMap[t.phase].total++;
    if (t.completed) phaseMap[t.phase].completed++;
    else phaseMap[t.phase].pending++;
    phaseMap[t.phase].tasks.push(t);
  }

  // Encontra o próximo passo desbloqueado
  const nextUnblocked = tasks.find((t) => !t.completed && !t.metadata.is_blocked);
  const nextTask = nextUnblocked || tasks.find((t) => !t.completed) || null;

  return {
    total,
    completed,
    pending,
    progress_pct: progressPct,
    phases: Object.keys(phaseMap).map((k) => ({
      name: k,
      total: phaseMap[k].total,
      completed: phaseMap[k].completed,
      pending: phaseMap[k].pending,
      pct: Math.round((phaseMap[k].completed / phaseMap[k].total) * 100)
    })),
    next_task: nextTask
  };
}

function completeTask(taskId) {
  if (!fs.existsSync(PLAN_PATH_PRIMARY)) return false;

  const regex = new RegExp(`- \\[ \\] \\*\\*${taskId}:\\*\\*`, 'g');
  let content = fs.readFileSync(PLAN_PATH_PRIMARY, 'utf-8');
  if (regex.test(content)) {
    content = content.replace(regex, `- [x] **${taskId}:**`);
    fs.writeFileSync(PLAN_PATH_PRIMARY, content, 'utf-8');
    if (fs.existsSync(PLAN_PATH_SECONDARY)) {
      fs.writeFileSync(PLAN_PATH_SECONDARY, content, 'utf-8');
    }
    return true;
  }
  return false;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args[0] === '--complete' && args[1]) {
    const success = completeTask(args[1]);
    console.log(JSON.stringify({ task_id: args[1], completed: success }));
  } else {
    const result = scanPlan();
    console.log(JSON.stringify(result, null, 2));
  }
}

module.exports = { scanPlan, completeTask };
