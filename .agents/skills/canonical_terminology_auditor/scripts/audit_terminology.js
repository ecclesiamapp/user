/**
 * Auditor de Terminologia Canônica (Ecclesiam App)
 *
 * Padroniza a nomenclatura católica oficial em toda a interface e documentação:
 * - {Capela} / {Capelas} ➔ Comunidade / Comunidades (CEBs)
 * - {Matriz} / {Igreja Matriz} ➔ Catedral / Catedral Diocesana
 *
 * Preserva:
 * - Marcos históricos de fundação (1928-1934, primeira/antiga capela de tábuas).
 * - Identificadores técnicos (variant="matriz", is_headquarters, matriz_geral, sch-matriz).
 *
 * Modos de Execução:
 * - node audit_terminology.js --check   (Apenas audita e gera relatório)
 * - node audit_terminology.js --fix     (Aplica substituições automáticas em disco)
 */

const fs = require('fs');
const path = require('path');

const ARGS = process.argv.slice(2);
const IS_FIX = ARGS.includes('--fix');
const IS_VERBOSE = ARGS.includes('--verbose');

const TARGET_DIRS = [
  'app',
  'components',
  '[documentation]',
  'lib'
];

const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.md'];

const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  '.gemini',
  'mcp',
  'public',
  'canonical_terminology_auditor',
  'dist'
];

// Padrões de linhas que devem ser PRESERVADOS (Marcos históricos sagrados de fundação/construção)
const HISTORICAL_EXCLUSION_PATTERNS = [
  /primeira capela/i,
  /primitiva capela/i,
  /antiga capela/i,
  /capela de tábuas/i,
  /capela missionária/i,
  /capela histórica/i,
  /primeira (?:igreja )?matriz/i,
  /antiga matriz/i,
  /nova matriz por benedito calixto/i,
  /desabamento da antiga matriz/i,
  /elevação da matriz/i,
  /elevada à dignidade de catedral/i,
  /ex munere caritatis/i,
  /benedito calixto/i,
  /1928.*(?:capela|matriz)/i,
  /(?:capela|matriz).*1928/i,
  /1934.*(?:capela|matriz)/i,
  /(?:capela|matriz).*1934/i,
  /1952.*matriz/i,
  /matriz.*1952/i,
  /1990.*matriz/i,
  /matriz.*1990/i
];

// Identificadores técnicos que NÃO devem ser alterados em arquivos de código
const TECHNICAL_CODE_PATTERNS = [
  /variant\s*[:=]\s*['"]matriz['"]/,
  /variant\s*===?\s*['"]matriz['"]/,
  /['"]matriz['"]\s*\|/,
  /\|\s*['"]matriz['"]/,
  /['"]matriz['"]\s*:/,
  /['"]matriz_geral['"]/,
  /['"]sch-matriz['"]/,
  /is_headquarters/,
  /is_matriz/,
  /isMatrizPrefix/,
  /includes\(['"]matriz['"]\)/,
  /matrix\(/
];

// Regras de substituição ordenadas por especificidade (das frases mais longas para as menores)
const REPLACEMENT_RULES = [
  // --- Nível 1: Frases Compostas Específicas de Matriz ---
  {
    regex: /\bIgreja\s+Matriz\s*\((?:Sede\s+Paroquial|Sede)\)/gi,
    replacement: 'Catedral (Sede Paroquial)',
    desc: 'Igreja Matriz (Sede) ➔ Catedral (Sede Paroquial)'
  },
  {
    regex: /\bIgreja\s+Matriz\s*\((?:Geral)\)/gi,
    replacement: 'Catedral Diocesana (Geral)',
    desc: 'Igreja Matriz (Geral) ➔ Catedral Diocesana (Geral)'
  },
  {
    regex: /\bIgreja\s+Matriz\s*[•\-]\s*Catedral\b/gi,
    replacement: 'Catedral Diocesana (Sede)',
    desc: 'Igreja Matriz • Catedral ➔ Catedral Diocesana (Sede)'
  },
  {
    regex: /\bIgreja\s+Matriz\s*\/\s*Paróquia\s+Geral\b/gi,
    replacement: 'Catedral / Paróquia Geral',
    desc: 'Igreja Matriz / Paróquia Geral ➔ Catedral / Paróquia Geral'
  },
  {
    regex: /\bCatedral\s+Sagrado\s+Cora[çc][ãa]o\s+de\s+Jesus\s*\((?:Matriz)\)/gi,
    replacement: 'Catedral Sagrado Coração de Jesus (Sede)',
    desc: 'Catedral ... (Matriz) ➔ Catedral ... (Sede)'
  },
  {
    regex: /\b(?:Catedral\s+Matriz|Matriz\s+Catedral)\b/gi,
    replacement: 'Catedral Diocesana',
    desc: 'Catedral Matriz / Matriz Catedral ➔ Catedral Diocesana'
  },
  {
    regex: /\bAltar-Mor\s+da\s+Matriz\b/gi,
    replacement: 'Presbitério Central da Catedral',
    desc: 'Altar-Mor da Matriz ➔ Presbitério Central da Catedral'
  },
  {
    regex: /\bConfession[áa]rio\s+da\s+Matriz\b/gi,
    replacement: 'Confessionário da Catedral',
    desc: 'Confessionário da Matriz ➔ Confessionário da Catedral'
  },
  {
    regex: /\bSecretaria\s+da\s+Matriz\b/gi,
    replacement: 'Secretaria da Catedral',
    desc: 'Secretaria da Matriz ➔ Secretaria da Catedral'
  },
  {
    regex: /\bPadroeiro\s+da\s+Matriz\b/gi,
    replacement: 'Padroeiro da Catedral',
    desc: 'Padroeiro da Matriz ➔ Padroeiro da Catedral'
  },
  {
    regex: /\bNotas?\s+Pastorais?\s+da\s+Matriz\b/gi,
    replacement: 'Nota Pastoral da Catedral',
    desc: 'Nota(s) Pastoral da Matriz ➔ Nota Pastoral da Catedral'
  },
  {
    regex: /\bSanta\s+Missa\s+Matriz\b/gi,
    replacement: 'Santa Missa na Catedral',
    desc: 'Santa Missa Matriz ➔ Santa Missa na Catedral'
  },
  {
    regex: /\bSanta\s+Missa\s+na\s+Matriz\b/gi,
    replacement: 'Santa Missa na Catedral',
    desc: 'Santa Missa na Matriz ➔ Santa Missa na Catedral'
  },
  {
    regex: /\bMissas\s+de\s+Hoje\s+na\s+Matriz\b/gi,
    replacement: 'Missas de Hoje na Catedral',
    desc: 'Missas de Hoje na Matriz ➔ Missas de Hoje na Catedral'
  },
  {
    regex: /\b(?:Hor[áa]rios?)\s+da\s+Matriz\b/gi,
    replacement: 'Horários da Catedral',
    desc: 'Horários da Matriz ➔ Horários da Catedral'
  },
  {
    regex: /\bComunidades\s*([&e])\s*Matriz\b/gi,
    replacement: 'Comunidades $1 Catedral',
    desc: 'Comunidades & Matriz ➔ Comunidades & Catedral'
  },
  {
    regex: /\bMatriz\s*([&e])\s*(?:CEBs|Comunidades)\b/gi,
    replacement: 'Catedral $1 CEBs',
    desc: 'Matriz & CEBs ➔ Catedral & CEBs'
  },
  {
    regex: /\bIgreja\s+Matriz\b/g,
    replacement: 'Catedral',
    desc: 'Igreja Matriz ➔ Catedral'
  },
  {
    regex: /\bigreja\s+matriz\b/g,
    replacement: 'catedral',
    desc: 'igreja matriz ➔ catedral'
  },

  // --- Nível 2: Frases Compostas Específicas de Capela ---
  {
    regex: /\b12\s+Comunidades\s*&\s*Capelas\s*\(CEBs\)/gi,
    replacement: '14 Comunidades Eclesiais de Base (CEBs)',
    desc: '12 Comunidades & Capelas (CEBs) ➔ 14 Comunidades Eclesiais de Base (CEBs)'
  },
  {
    regex: /\bComunidades\s*(?:&|e)\s*Capelas\s*\(CEBs\)/gi,
    replacement: 'Comunidades Eclesiais de Base (CEBs)',
    desc: 'Comunidades e Capelas (CEBs) ➔ Comunidades Eclesiais de Base (CEBs)'
  },
  {
    regex: /\bComunidades\s*(?:&|e)\s*Capelas\b/gi,
    replacement: 'Comunidades (CEBs)',
    desc: 'Comunidades & Capelas ➔ Comunidades (CEBs)'
  },
  {
    regex: /\bComunidade\s*\/\s*Capela\s+Vinculada\b/gi,
    replacement: 'Comunidade Vinculada (CEB)',
    desc: 'Comunidade / Capela Vinculada ➔ Comunidade Vinculada (CEB)'
  },
  {
    regex: /\bComunidade\s*\/\s*Capela\s+de\s+Destino\b/gi,
    replacement: 'Comunidade de Destino (CEB)',
    desc: 'Comunidade / Capela de Destino ➔ Comunidade de Destino (CEB)'
  },
  {
    regex: /\bComunidade\s*\/\s*Capela\b/gi,
    replacement: 'Comunidade (CEB)',
    desc: 'Comunidade / Capela ➔ Comunidade (CEB)'
  },
  {
    regex: /\bcapela\s*\/\s*comunidade\b/gi,
    replacement: 'comunidade (CEB)',
    desc: 'capela/comunidade ➔ comunidade (CEB)'
  },
  {
    regex: /\bPainel\s+(?:Exclusivo\s+)?da\s+Capela\b/gi,
    replacement: 'Painel da Comunidade',
    desc: 'Painel da Capela ➔ Painel da Comunidade'
  },
  {
    regex: /\bFoto\s+da\s+Fachada\s+da\s+Capela\b/gi,
    replacement: 'Foto da Fachada da Comunidade',
    desc: 'Foto da Fachada da Capela ➔ Foto da Fachada da Comunidade'
  },
  {
    regex: /\b(?:Fotos?|Fachadas?)\s+da\s+Capela\b/gi,
    replacement: 'Fachada da Comunidade',
    desc: 'Foto/Fachada da Capela ➔ Fachada da Comunidade'
  },
  {
    regex: /\bHor[áa]rios\s+da\s+Capela\b/gi,
    replacement: 'Horários da Comunidade',
    desc: 'Horários da Capela ➔ Horários da Comunidade'
  },
  {
    regex: /\bAvisos\s+da\s+Capela\b/gi,
    replacement: 'Avisos da Comunidade',
    desc: 'Avisos da Capela ➔ Avisos da Comunidade'
  },
  {
    regex: /\bLideran[çc]as\s+da\s+Capela\b/gi,
    replacement: 'Lideranças da Comunidade',
    desc: 'Lideranças da Capela ➔ Lideranças da Comunidade'
  },
  {
    regex: /\bM[óo]dulos\s+Autorizados\s+(?:para|na)\s+a\s+Capela\b/gi,
    replacement: 'Módulos Autorizados na Comunidade',
    desc: 'Módulos Autorizados na Capela ➔ Módulos Autorizados na Comunidade'
  },
  {
    regex: /\bMural\s+de\s+[Aa]visos\s+da\s+Capela\b/gi,
    replacement: 'Mural de Avisos da Comunidade',
    desc: 'Mural de Avisos da Capela ➔ Mural de Avisos da Comunidade'
  },
  {
    regex: /\bFesta\s+Lit[úu]rgica\s+da\s+Nossa\s+Capela\b/gi,
    replacement: 'Festa Litúrgica da Nossa Comunidade',
    desc: 'Festa Litúrgica da Nossa Capela ➔ Festa Litúrgica da Nossa Comunidade'
  },
  {
    regex: /\bCapela\s+da\s+Comunidade\b/gi,
    replacement: 'Comunidade Eclesial',
    desc: 'Capela da Comunidade ➔ Comunidade Eclesial'
  },
  {
    regex: /\bSelecione\s+a\s+capela\b/gi,
    replacement: 'Selecione a comunidade',
    desc: 'Selecione a capela ➔ Selecione a comunidade'
  },
  {
    regex: /\bTodas\s+as\s+(?:12\s+)?Capelas\b/gi,
    replacement: 'Todas as 14 Comunidades (CEBs)',
    desc: 'Todas as 12 Capelas ➔ Todas as 14 Comunidades (CEBs)'
  },
  {
    regex: /\btodas\s+as\s+(?:12\s+)?capelas\b/gi,
    replacement: 'todas as 14 comunidades (CEBs)',
    desc: 'todas as 12 capelas ➔ todas as 14 comunidades (CEBs)'
  },
  {
    regex: /\b12\s+Capelas\b/g,
    replacement: '14 Comunidades (CEBs)',
    desc: '12 Capelas ➔ 14 Comunidades (CEBs)'
  },
  {
    regex: /\b12\s+capelas\b/g,
    replacement: '14 comunidades (CEBs)',
    desc: '12 capelas ➔ 14 comunidades (CEBs)'
  },

  // --- Nível 3: Concordâncias Preposicionais (Capela ➔ Comunidade) ---
  { regex: /\bda\s+capela\b/g, replacement: 'da comunidade', desc: 'da capela ➔ da comunidade' },
  { regex: /\bDa\s+Capela\b/g, replacement: 'Da Comunidade', desc: 'Da Capela ➔ Da Comunidade' },
  { regex: /\bna\s+capela\b/g, replacement: 'na comunidade', desc: 'na capela ➔ na comunidade' },
  { regex: /\bNa\s+Capela\b/g, replacement: 'Na Comunidade', desc: 'Na Capela ➔ Na Comunidade' },
  { regex: /\bpara\s+a\s+capela\b/g, replacement: 'para a comunidade', desc: 'para a capela ➔ para a comunidade' },
  { regex: /\bPara\s+a\s+Capela\b/g, replacement: 'Para a Comunidade', desc: 'Para a Capela ➔ Para a Comunidade' },
  { regex: /\bpela\s+capela\b/g, replacement: 'pela comunidade', desc: 'pela capela ➔ pela comunidade' },
  { regex: /\bPela\s+Capela\b/g, replacement: 'Pela Comunidade', desc: 'Pela Capela ➔ Pela Comunidade' },
  { regex: /\b[àa]\s+capela\b/g, replacement: 'à comunidade', desc: 'à capela ➔ à comunidade' },
  { regex: /\b[ÀA]\s+Capela\b/g, replacement: 'À Comunidade', desc: 'À Capela ➔ À Comunidade' },
  { regex: /\bdesta\s+capela\b/g, replacement: 'desta comunidade', desc: 'desta capela ➔ desta comunidade' },
  { regex: /\bDesta\s+Capela\b/g, replacement: 'Desta Comunidade', desc: 'Desta Capela ➔ Desta Comunidade' },
  { regex: /\bnesta\s+capela\b/g, replacement: 'nesta comunidade', desc: 'nesta capela ➔ nesta comunidade' },
  { regex: /\bNesta\s+Capela\b/g, replacement: 'Nesta Comunidade', desc: 'Nesta Capela ➔ Nesta Comunidade' },

  { regex: /\bdas\s+capelas\b/g, replacement: 'das comunidades', desc: 'das capelas ➔ das comunidades' },
  { regex: /\bDas\s+Capelas\b/g, replacement: 'Das Comunidades', desc: 'Das Capelas ➔ Das Comunidades' },
  { regex: /\bnas\s+capelas\b/g, replacement: 'nas comunidades', desc: 'nas comunidades ➔ nas comunidades' },
  { regex: /\bNas\s+Capelas\b/g, replacement: 'Nas Comunidades', desc: 'Nas Capelas ➔ Nas Comunidades' },
  { regex: /\bpelas\s+capelas\b/g, replacement: 'pelas comunidades', desc: 'pelas capelas ➔ pelas comunidades' },
  { regex: /\bPelas\s+Capelas\b/g, replacement: 'Pelas Comunidades', desc: 'Pelas Capelas ➔ Pelas Comunidades' },
  { regex: /\b[àa]s\s+capelas\b/g, replacement: 'às comunidades', desc: 'às capelas ➔ às comunidades' },
  { regex: /\b[ÀA]s\s+Capelas\b/g, replacement: 'Às Comunidades', desc: 'Às Capelas ➔ Às Comunidades' },

  // --- Nível 4: Concordâncias Preposicionais (Matriz ➔ Catedral) ---
  { regex: /\bda\s+Matriz\b/g, replacement: 'da Catedral', desc: 'da Matriz ➔ da Catedral' },
  { regex: /\bDa\s+Matriz\b/g, replacement: 'Da Catedral', desc: 'Da Matriz ➔ Da Catedral' },
  { regex: /\bna\s+Matriz\b/g, replacement: 'na Catedral', desc: 'na Matriz ➔ na Catedral' },
  { regex: /\bNa\s+Matriz\b/g, replacement: 'Na Catedral', desc: 'Na Matriz ➔ Na Catedral' },
  { regex: /\bpela\s+Matriz\b/g, replacement: 'pela Catedral', desc: 'pela Matriz ➔ pela Catedral' },
  { regex: /\bPela\s+Matriz\b/g, replacement: 'Pela Catedral', desc: 'Pela Matriz ➔ Pela Catedral' },
  { regex: /\b[àa]\s+Matriz\b/g, replacement: 'à Catedral', desc: 'à Matriz ➔ à Catedral' },
  { regex: /\b[ÀA]\s+Matriz\b/g, replacement: 'À Catedral', desc: 'À Matriz ➔ À Catedral' },
  { regex: /\bdesta\s+Matriz\b/g, replacement: 'desta Catedral', desc: 'desta Matriz ➔ desta Catedral' },
  { regex: /\bnesta\s+Matriz\b/g, replacement: 'nesta Catedral', desc: 'nesta Matriz ➔ nesta Catedral' },
  { regex: /\bpara\s+a\s+Matriz\b/g, replacement: 'para a Catedral', desc: 'para a Matriz ➔ para a Catedral' },
  { regex: /\bda\s+matriz\b/g, replacement: 'da catedral', desc: 'da matriz ➔ da catedral' },
  { regex: /\bna\s+matriz\b/g, replacement: 'na catedral', desc: 'na matriz ➔ na catedral' },
  { regex: /\bpela\s+matriz\b/g, replacement: 'pela catedral', desc: 'pela matriz ➔ pela catedral' },
  { regex: /\b[àa]\s+matriz\b/g, replacement: 'à catedral', desc: 'à matriz ➔ à catedral' },

  // --- Nível 5: Termos Isolados Seguros (Contexto de UI/Texto) ---
  { regex: /\bCapelas\b/g, replacement: 'Comunidades', desc: 'Capelas ➔ Comunidades' },
  { regex: /\bcapelas\b/g, replacement: 'comunidades', desc: 'capelas ➔ comunidades' },
  { regex: /\bCapela\b/g, replacement: 'Comunidade', desc: 'Capela ➔ Comunidade' },
  { regex: /\bcapela\b/g, replacement: 'comunidade', desc: 'capela ➔ comunidade' }
];

// Função de caminhada recursiva
function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.some(ex => fullPath.includes(ex))) {
        walkDir(fullPath, callback);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        callback(fullPath);
      }
    }
  }
}

// Verifica se a linha contém termos que devem ser preservados
function shouldPreserveLine(line, isCodeFile) {
  // 1. Preservar marcos históricos
  for (const pattern of HISTORICAL_EXCLUSION_PATTERNS) {
    if (pattern.test(line)) {
      return true;
    }
  }

  // 2. Em arquivos de código, preservar tokens técnicos
  if (isCodeFile) {
    for (const pattern of TECHNICAL_CODE_PATTERNS) {
      if (pattern.test(line)) {
        return true;
      }
    }
  }

  return false;
}

async function runAudit() {
  console.log('===============================================================');
  console.log('⛪  AUDITORIA DE TERMINOLOGIA CANÔNICA (Ecclesiam App)');
  console.log(`Modo: ${IS_FIX ? '🛠️  AUTO-FIX (Substituição Ativa)' : '🔍  CHECK (Apenas Verificação)'}`);
  console.log('===============================================================\n');

  let totalFilesScanned = 0;
  let filesModified = 0;
  let totalViolations = 0;
  const violationsReport = [];

  for (const targetDir of TARGET_DIRS) {
    const rootPath = path.join(process.cwd(), targetDir);
    if (!fs.existsSync(rootPath)) continue;

    walkDir(rootPath, (filePath) => {
      totalFilesScanned++;
      const isCodeFile = /\.(tsx|ts|jsx|js)$/.test(filePath);
      const originalContent = fs.readFileSync(filePath, 'utf-8');
      const lines = originalContent.split('\n');

      let fileHasChanges = false;
      const modifiedLines = [];
      const fileViolations = [];

      lines.forEach((line, index) => {
        const lineNum = index + 1;

        if (shouldPreserveLine(line, isCodeFile)) {
          modifiedLines.push(line);
          return;
        }

        let updatedLine = line;

        for (const rule of REPLACEMENT_RULES) {
          if (rule.regex.test(updatedLine)) {
            const matches = updatedLine.match(rule.regex);
            const count = matches ? matches.length : 1;
            totalViolations += count;

            fileViolations.push({
              lineNum,
              original: line.trim(),
              desc: rule.desc,
              count
            });

            updatedLine = updatedLine.replace(rule.regex, rule.replacement);
            fileHasChanges = true;
          }
        }

        modifiedLines.push(updatedLine);
      });

      if (fileHasChanges) {
        filesModified++;
        violationsReport.push({
          filePath: path.relative(process.cwd(), filePath),
          violations: fileViolations
        });

        if (IS_FIX) {
          fs.writeFileSync(filePath, modifiedLines.join('\n'), 'utf-8');
        }
      }
    });
  }

  // Exibir Relatório
  console.log(`📊 Total de arquivos auditados: ${totalFilesScanned}`);
  console.log(`⚠️  Arquivos com desvios terminológicos: ${filesModified}`);
  console.log(`🎯 Total de ocorrências identificadas: ${totalViolations}\n`);

  if (violationsReport.length > 0) {
    console.log('---------------------------------------------------------------');
    console.log(IS_FIX ? '✅ ALTERAÇÕES APLICADAS EM DISCO:' : '🚨 DESVIOS ENCONTRADOS:');
    console.log('---------------------------------------------------------------');

    violationsReport.forEach(({ filePath, violations }) => {
      console.log(`\n📄 ${filePath} (${violations.length} ocorrências)`);
      if (IS_VERBOSE || violations.length <= 5) {
        violations.slice(0, 5).forEach(v => {
          console.log(`   L${v.lineNum}: [${v.desc}]`);
          console.log(`      "${v.original.substring(0, 80)}${v.original.length > 80 ? '...' : ''}"`);
        });
        if (violations.length > 5) {
          console.log(`   ... e mais ${violations.length - 5} ocorrência(s).`);
        }
      }
    });
  }

  console.log('\n===============================================================');
  if (IS_FIX) {
    console.log(`🎉 Sucesso! ${totalViolations} termos canônicos atualizados em ${filesModified} arquivos.`);
    console.log('===============================================================\n');
    process.exit(0);
  } else {
    if (totalViolations > 0) {
      console.log(`⚠️  Atenção: ${totalViolations} desvios terminológicos detectados.`);
      console.log('👉 Execute `node .agents/skills/canonical_terminology_auditor/scripts/audit_terminology.js --fix` para corrigir automaticamente.');
      console.log('===============================================================\n');
      process.exit(1);
    } else {
      console.log('🌟 Parabéns! 100% de conformidade com a terminologia canônica católica.');
      console.log('===============================================================\n');
      process.exit(0);
    }
  }
}

runAudit();
