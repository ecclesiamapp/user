const fs = require('fs');
const path = require('path');
const https = require('https');

// Carregar variáveis do .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Erro: SUPABASE_URL ou SUPABASE_KEY não configuradas.');
  process.exit(1);
}

// Inserção em lote via REST PostgREST com headers upsert
function insertBatch(tableName, rows) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${tableName}`);
    const data = JSON.stringify(rows);

    const options = {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=ignore-duplicates, return=minimal'
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(true);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runRestore(targetBackupDir) {
  let backupDir = targetBackupDir;

  if (!backupDir) {
    const backupsRoot = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupsRoot)) {
      console.error(`❌ Diretório de backups não encontrado em: ${backupsRoot}`);
      process.exit(1);
    }
    const dirs = fs.readdirSync(backupsRoot)
      .filter(d => fs.statSync(path.join(backupsRoot, d)).isDirectory())
      .sort()
      .reverse();

    if (dirs.length === 0) {
      console.error(`❌ Nenhum backup encontrado para restauração.`);
      process.exit(1);
    }
    backupDir = path.join(backupsRoot, dirs[0]);
  }

  const jsonDir = path.join(backupDir, 'json');
  console.log(`\n======================================================`);
  console.log(`🚨 INICIANDO RESTAURAÇÃO EMERGENCIAL (DISASTER RECOVERY)`);
  console.log(`Origem do Backup: ${backupDir}`);
  console.log(`======================================================\n`);

  if (!fs.existsSync(jsonDir)) {
    console.error(`❌ Pasta JSON não encontrada em: ${jsonDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(jsonDir).filter(f => f.endsWith('.json'));
  console.log(`Identificados ${files.length} arquivos de tabelas para processamento.\n`);

  const BATCH_SIZE = 200;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const tableName = file.replace('.json', '');
    const content = fs.readFileSync(path.join(jsonDir, file), 'utf8');
    const rows = JSON.parse(content);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.log(`[${i + 1}/${files.length}] Tabela ${tableName}: 0 registros (pulando).`);
      continue;
    }

    process.stdout.write(`[${i + 1}/${files.length}] Restaurando ${tableName} (${rows.length} registros)... `);

    try {
      // Processar em lotes de 200 registros
      for (let offset = 0; offset < rows.length; offset += BATCH_SIZE) {
        const batch = rows.slice(offset, offset + BATCH_SIZE);
        await insertBatch(tableName, batch);
      }
      console.log(`✅ Sucesso!`);
    } catch (err) {
      console.log(`⚠️ Alerta: ${err.message}`);
    }
  }

  console.log(`\n======================================================`);
  console.log(`🎉 PROCESSO DE RESTAURAÇÃO FINALIZADO!`);
  console.log(`======================================================\n`);
}

const customPath = process.argv[2];
runRestore(customPath).catch(err => {
  console.error('❌ Falha fatal na restauração:', err);
  process.exit(1);
});
