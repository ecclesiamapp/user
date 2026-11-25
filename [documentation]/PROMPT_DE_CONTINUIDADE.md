# 🧭 PROMPT DE CONTINUIDADE (ECCLESIAM APP — CATEDRAL DE COLATINA)

> **Data de Atualização:** 25 de Novembro de 2026 (00:35)  
> **Último Commit:** `0cb010e` (`main`) — *feat(pwa): homologacao de materiais de impressao pwa com alinhamento geometrico e suporte a logo dinamico*  
> **Horizonte Oficial:** Solenidade do Natal do Senhor 2026 (25/12/2026 — **Faltam 30 dias** 🟢)  
> **Status Geral do Projeto:** 🟢 **Excelente, Blindado & Homologado** (Design auditado, suporte a logo dinâmico no QR Code, 100% de conformidade canônica e de UX)

---

## 🎯 Contexto Imediato para a Próxima Sessão

Você está assumindo o projeto **Ecclesiam App**, operando no piloto da **Catedral do Sagrado Coração de Jesus (Colatina/ES)**.

Nesta sessão de 24–25/11/2026, concluímos com rigor e excelência:
1. **Onda 1 da Povoação (Liturgia & Dados Mestre - commit `f3006da`):**
   - População de `public.mass_schedules` (25 horários canônicos ativos).
   - Solenidade do Natal 2026 (`natal-2026`) ativa na Home e no Supabase.
   - Teste de carga k6 (500 usuários simultâneos, 0.00% de erro) e laudo executivo emitido em PDF/HTML.
2. **Onda 2 da Povoação (Visual & Fotografia Autoral - commit `6a36739`):**
   - Extração, download e conversão de 16 fotos de **Cláudio Costa** para WebP ultra-otimizado.
   - Povoação de 3 álbuns oficiais em `public.galleries` com o crédito `Foto: Cláudio Costa`.
   - Atualização do patrimônio sacro em `public.parish_sacred_heritage`.
3. **Blindagem de Segurança, Contingência & Disaster Recovery (commits `bde41d8`, `69a9a19`):**
   - Resolução de vulnerabilidades via `npm audit fix` (**`found 0 vulnerabilities`**).
   - Mascaramento LGPD em `lib/utils.ts` (`maskSensitivePhone` e `maskSensitiveEmail`).
   - Guia de Apontamento DNS e regras WAF Cloudflare (`TASK-12`) elaborado em `[documentation]/planejamento/GUIA_APONTAMENTO_DNS_CLOUDFLARE_TASK12.md`.
   - Endpoint de monitoramento de saúde do banco: `/api/healthz`.
   - **Motor de Backup Multicamadas** (`scripts/backup_service.js`) com sincronização automática no Google Drive (`G:\Meu Drive\...\ECCLESIAN APP\BACKUPS`).
   - **Script de Restauração Emergencial em Lotes** (`scripts/emergency_restore.js`) restaurando tabelas em batch de 200 registros em menos de 3 minutos.
   - Manual executivo `[documentation]/MANUAL_DE_RESTAURACAO.md`.
4. **Onda 3 da Povoação em Espera (commit `aff80e3`):**
   - Formalização do plano de coleta e mensagens prontas para envio no WhatsApp em `[documentation]/planejamento/PLANO_DE_COLETA_PAROQUIAL_ONDA3.md` (agendado para disparo entre 01/12 e 10/12).
5. **Homologação e Refinamento de Materiais PWA para os Bancos (commit `0cb010e`):**
   - Correção do alinhamento geométrico milimétrico e eliminação do fundo escuro indesejado no container do QR Code em `/instalar/imprimir`.
   - Implementação de **suporte a logotipo dinâmico da Catedral** no centro do QR Code: lê automaticamente a `logo_url` cadastrada em `public.parishes` com fallback elegante para a Cruz Sagrada Dourada (`✝`).
   - Todos os 3 formatos (Cartaz A4, Displays de Banco 4x e Cartões de Bolso 6x) 100% homologados e validados no build.

---

## 📋 Próximos Passos Prioritários

1. **`TASK-61 (Onda 3)` — Disparo da Coleta Paroquial (Janela: 01/12 a 10/12/2026):**
   - Disparar as mensagens já formatadas para Pe. Irineu / Secretaria, CEBs e Movimentos conforme [`PLANO_DE_COLETA_PAROQUIAL_ONDA3.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/PLANO_DE_COLETA_PAROQUIAL_ONDA3.md).
   - Solicitar liberação do acesso DNS ao domínio `catedraldecolatina.org.br` (`TASK-12`).
2. **`TASK-62 (Onda 4)` — Validação Litúrgica Final & Campanha PWA de Bancada (15/12 a 23/12/2026):**
   - Conferência de ponta a ponta com a secretária paroquial no `/admin`.
   - Impressão dos displays de acrílico e cartões de bolso via [`/instalar/imprimir`](http://localhost:3000/instalar/imprimir) para posicionar nos bancos antes da Missa do Galo.

---

## 🏛️ Diretrizes Críticas Inegociáveis (Relembre a cada turno)
- **Regra de Ouro do White-Label:** A marca "Ecclesiam" NUNCA aparece para o fiel.
- **Nomenclatura Litúrgica:** NUNCA usar "culto" (usar "Santa Missa" ou "Celebração da Palavra"). NUNCA usar "no Altar" para folhas de intenções (usar "Folha do Púlpito A4" ou "Intenções de Missa"). Usar "Comunidade" no lugar de "Capela", e "Catedral" no lugar de "Matriz".
- **Delimitação THEOS:** O app NÃO faz captação contábil nem relatórios de dízimo cadastrado (papel exclusivo do ERP Theòs).
- **Regra de Exibição de Código SQL:** Toda migração SQL DEVE ser exibida na íntegra no chat.
- **Estimativa de Tempo:** Toda tarefa sugerida DEVE vir com `⏱️ Tempo Estimado: ~X minutos` e pergunta expressa de validação.
- **Sincronização Local:** Manter `[documentation]/` local e Google Drive 100% espelhados.
