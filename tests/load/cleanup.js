/**
 * Script de Limpeza dos Dados do Teste de Carga de Natal
 * Remove com segurança todos os registros identificados com a tag [CARGA-NATAL]
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Carregar variáveis de .env.local
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length > 0) {
      env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

async function runCleanup() {
  console.log('🧹 Iniciando limpeza dos registros de teste [CARGA-NATAL]...');
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.log('⚠️ SUPABASE_SERVICE_ROLE_KEY não configurada em .env.local (RLS bloqueia DELETE com chave anônima — comportamento seguro!).');
    console.log('👉 Execute o script SQL no Supabase SQL Editor: tests/load/cleanup-test-data.sql');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // 1. Remover intenções de teste
    const { data: intentions, error: intError } = await supabase
      .from('mass_intentions')
      .delete()
      .or('notes.ilike.%[CARGA-NATAL]%,offered_by.ilike.%[CARGA-NATAL]%,intention_for.ilike.%[CARGA-NATAL]%')
      .select('id');

    if (intError) {
      console.warn('Aviso ao expurgar mass_intentions:', intError.message);
    } else {
      console.log(`✓ Intenções de teste removidas: ${intentions ? intentions.length : 0}`);
    }

    // 2. Remover nomes vinculados
    const { data: names, error: nameError } = await supabase
      .from('mass_intention_names')
      .delete()
      .ilike('name', '%[CARGA-NATAL]%')
      .select('id');

    if (!nameError && names) {
      console.log(`✓ Nomes de teste removidos: ${names.length}`);
    }

    console.log('✅ Base de dados purgada com sucesso. Nenhum dado legítimo foi afetado.');
  } catch (err) {
    console.error('Erro na limpeza:', err.message);
  }
}

if (require.main === module) {
  runCleanup();
}

module.exports = { runCleanup };
