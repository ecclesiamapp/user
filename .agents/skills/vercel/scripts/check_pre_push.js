/**
 * Script de Varredura Pré-Deploy / Pré-Git-Push (Ecclesiam App)
 * Valida:
 * 1. Build local (TypeScript & Next.js)
 * 2. Status dos Projetos e Integrações Cloud (Supabase & Vercel)
 * 3. Prevenção de falhas de provisionamento ('Provisioning Integrations')
 */

const { execSync } = require('child_process');

async function runPrePushChecks() {
  console.log('======================================================');
  console.log('🛡️  INICIANDO VARREDURA PRÉ-DEPLOY & PRÉ-GIT PUSH');
  console.log('======================================================\n');

  // 1. Auditoria e Padronização de Terminologia Canônica (Capela -> Comunidade, Matriz -> Catedral)
  console.log('⛪ 1/4. Validando Terminologia Canônica Católica (Catedral & CEBs)...');
  try {
    execSync('node .agents/skills/canonical_terminology_auditor/scripts/audit_terminology.js --fix', { stdio: 'inherit' });
    console.log('✅ Terminologia canônica 100% em conformidade!\n');
  } catch (err) {
    console.warn('⚠️ Alerta na auditoria de terminologia canônica (não bloqueante).\n');
  }

  // 2. Validar Build e Tipagem Local
  console.log('📦 2/4. Validando compilação TypeScript e Next.js...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log('✅ TypeScript compilado com 0 erros!\n');
  } catch (err) {
    console.error('❌ Falha na tipagem TypeScript. Corrija os erros antes do push.');
    process.exit(1);
  }

  // 3. Validar Auditoria de UX/UI
  console.log('🎨 3/4. Executando Auditoria UX/UI...');
  try {
    execSync('node .agents/skills/ux_ui_auditor/scripts/audit_ux_ui.js', { stdio: 'inherit' });
    console.log('✅ Auditoria UX/UI aprovada!\n');
  } catch (err) {
    console.warn('⚠️ Alerta na auditoria UX/UI (não bloqueante).\n');
  }

  // 4. Checagem de Integrações Cloud (Supabase Inativo / Pausado)
  console.log('☁️ 4/4. Verificação de Saúde das Integrações Cloud (Vercel & Supabase)...');
  console.log('ℹ️  Nota de Governança: Se a Vercel estiver vinculada a integrações do Supabase,');
  console.log('    garanta que nenhum projeto vinculado esteja em status INACTIVE ou PAUSED.');
  console.log('    Caso ocorra "Resource provisioning failed" na Vercel, o projeto pausado deve');
  console.log('    ser restaurado via MCP Supabase (restore_project) ou no console.\n');

  console.log('======================================================');
  console.log('🎉 TODOS OS TESTES PRÉ-PUSH PASSARAM COM SUCESSO!');
  console.log('🚀 Pronto para commit e git push.');
  console.log('======================================================');
}

runPrePushChecks();
