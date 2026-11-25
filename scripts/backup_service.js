const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

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

// 33 Tabelas públicas mapeadas no Supabase
const PUBLIC_TABLES = [
  'parishes',
  'communities',
  'clergy',
  'pastorals',
  'parish_pastors_succession',
  'parish_sacred_heritage',
  'parish_history_milestones',
  'mass_schedules',
  'liturgical_readings',
  'liturgical_calendar',
  'liturgy_booklets',
  'liturgical_booklets',
  'parish_special_events',
  'parish_event_days',
  'parish_liturgical_events',
  'pastoral_messages',
  'announcements',
  'galleries',
  'parish_movements',
  'parish_movement_events',
  'parish_movement_registrations',
  'pastoral_appointments',
  'sacramental_registrations',
  'mass_intentions',
  'certificate_requests',
  'tithe_transparency_items',
  'tithe_faqs',
  'tithe_registrations',
  'user_profiles',
  'security_audit_logs',
  'community_activity_logs',
  'parish_knowledge_documents',
  'parish_knowledge_embeddings'
];

function fetchTableData(tableName) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${tableName}?select=*`);
    const options = {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Erro ao parsear JSON de ${tableName}: ${e.message}`));
          }
        } else {
          // Se tabela vazia ou erro 404, retorna array vazio para resiliência
          console.warn(`  ⚠️ Aviso ao ler ${tableName}: HTTP ${res.statusCode}`);
          resolve([]);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupName = `backup_${timestamp}`;
  const localBackupDir = path.join(__dirname, '../backups', backupName);
  const jsonDir = path.join(localBackupDir, 'json');
  const sqlFile = path.join(localBackupDir, 'dump_inserts.sql');
  const manifestFile = path.join(localBackupDir, 'manifest.json');

  console.log(`\n======================================================`);
  console.log(`🛡️  INICIANDO MOTOR DE BACKUP MULTICAMADAS (M-ONE)`);
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Destino Local: ${localBackupDir}`);
  console.log(`======================================================\n`);

  fs.mkdirSync(jsonDir, { recursive: true });

  const manifest = {
    backup_id: backupName,
    created_at: new Date().toISOString(),
    supabase_url: SUPABASE_URL,
    tables_summary: {},
    total_records: 0
  };

  let sqlDumpContent = `-- ==============================================================================\n`;
  sqlDumpContent += `-- ECCLESIAM APP - DUMP DE RESTAURAÇÃO DE SEGURANÇA & CONTINGÊNCIA\n`;
  sqlDumpContent += `-- Gerado em: ${new Date().toISOString()}\n`;
  sqlDumpContent += `-- ==============================================================================\n\n`;

  for (let i = 0; i < PUBLIC_TABLES.length; i++) {
    const table = PUBLIC_TABLES[i];
    process.stdout.write(`[${i + 1}/${PUBLIC_TABLES.length}] Extraindo ${table}... `);

    try {
      const rows = await fetchTableData(table);
      manifest.tables_summary[table] = rows.length;
      manifest.total_records += rows.length;

      // 1. Salvar JSON individual
      fs.writeFileSync(path.join(jsonDir, `${table}.json`), JSON.stringify(rows, null, 2));

      // 2. Gerar Inserts SQL se houver registros
      if (rows.length > 0) {
        sqlDumpContent += `-- Tabela: public.${table} (${rows.length} registros)\n`;
        const columns = Object.keys(rows[0]);
        const colsFormatted = columns.map(c => `"${c}"`).join(', ');

        for (const row of rows) {
          const values = columns.map(col => escapeSqlValue(row[col])).join(', ');
          sqlDumpContent += `INSERT INTO public.${table} (${colsFormatted}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
        }
        sqlDumpContent += `\n`;
      }

      console.log(`✅ ${rows.length} registros`);
    } catch (err) {
      console.log(`❌ Erro: ${err.message}`);
      manifest.tables_summary[table] = 0;
    }
  }

  // Salvar Dump SQL e Manifesto
  fs.writeFileSync(sqlFile, sqlDumpContent, 'utf8');
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`\n📦 Compactando pacote em arquivo ZIP...`);
  const zipFileName = `${backupName}.zip`;
  const zipFilePath = path.join(__dirname, '../backups', zipFileName);

  // Comando PowerShell para zipar nativamente no Windows
  try {
    execSync(`powershell -command "Compress-Archive -Path '${localBackupDir}\\*' -DestinationPath '${zipFilePath}' -Force"`);
    console.log(`✅ Pacote ZIP gerado: ${zipFilePath} (${(fs.statSync(zipFilePath).size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`⚠️ Erro ao compactar ZIP: ${err.message}`);
  }

  // 3. Sincronização Off-Site no Google Drive
  const googleDriveDir = 'G:\\Meu Drive\\TRABALHOS\\01 - NEGÓCIOS E PROJETOS ATIVOS\\ECCLESIAN APP\\BACKUPS';
  if (fs.existsSync(googleDriveDir)) {
    console.log(`\n☁️  Sincronizando cópia off-site no Google Drive...`);
    try {
      const targetZip = path.join(googleDriveDir, zipFileName);
      fs.copyFileSync(zipFilePath, targetZip);
      console.log(`✅ Sucesso! Cópia espelhada em: ${targetZip}`);
    } catch (err) {
      console.error(`⚠️ Erro ao copiar para o Google Drive: ${err.message}`);
    }
  } else {
    console.warn(`\n⚠️ Diretório do Google Drive não encontrado em ${googleDriveDir}. Cópia mantida apenas localmente.`);
  }

  console.log(`\n======================================================`);
  console.log(`🎉 BACKUP CONCLUÍDO COM SUCESSO!`);
  console.log(`Total de Tabelas: ${PUBLIC_TABLES.length}`);
  console.log(`Total de Registros Salvos: ${manifest.total_records}`);
  console.log(`======================================================\n`);
}

runBackup().catch(err => {
  console.error('❌ Falha fatal no backup:', err);
  process.exit(1);
});
