# 🧭 PROMPT DE CONTINUIDADE (ECCLESIAM APP — CATEDRAL DE COLATINA)

> **Data de Atualização:** 24 de Novembro de 2026 (22:20)  
> **Último Commit:** `bde41d8` (`main`) — *feat(security): motor de backup multicamadas, script disaster recovery e endpoint healthz*  
> **Horizonte Oficial:** Solenidade do Natal do Senhor 2026 (25/12/2026 — **Faltam 31 dias** 🟢)  
> **Status Geral do Projeto:** 🟢 **Excelente & Blindado** (Zero vulnerabilidades npm, backup multicamadas off-site ativo, disaster recovery homologado)

---

## 🎯 Contexto Imediato para a Próxima Sessão

Você está assumindo o projeto **Ecclesiam App**, operando no piloto da **Catedral do Sagrado Coração de Jesus (Colatina/ES)**.

Nesta sessão de 24/11/2026, concluímos com rigor e excelência:
1. **Onda 1 da Povoação (Liturgia & Dados Mestre - commit `f3006da`):**
   - População de `public.mass_schedules` (25 horários canônicos ativos).
   - Solenidade do Natal 2026 (`natal-2026`) ativa na Home e no Supabase.
   - Teste de carga k6 (500 usuários simultâneos, 0.00% de erro) e laudo executivo emitido em PDF/HTML.
2. **Onda 2 da Povoação (Visual & Fotografia Autoral - commit `6a36739`):**
   - Extração, download e conversão de 16 fotos de **Cláudio Costa** para WebP ultra-otimizado.
   - Povoação de 3 álbuns oficiais em `public.galleries` com o crédito `Foto: Cláudio Costa`.
   - Atualização do patrimônio sacro em `public.parish_sacred_heritage`.
3. **Blindagem de Segurança, Contingência & Disaster Recovery (commit `bde41d8`):**
   - Resolução de vulnerabilidades via `npm audit fix` (**`found 0 vulnerabilities`**).
   - Implementação de mascaramento LGPD em `lib/utils.ts` (`maskSensitivePhone` e `maskSensitiveEmail`).
   - Guia de Apontamento DNS e regras WAF Cloudflare (`TASK-12`) elaborado em `[documentation]/planejamento/GUIA_APONTAMENTO_DNS_CLOUDFLARE_TASK12.md`.
   - Criação do endpoint de monitoramento de saúde do banco: `/api/healthz`.
   - Implementação do **Motor de Backup Multicamadas** (`scripts/backup_service.js`) extraindo as 33 tabelas públicas em `.sql` e `.json`, compactando em `.zip` e sincronizando automaticamente na pasta do Google Drive (`G:\Meu Drive\...\ECCLESIAN APP\BACKUPS`).
   - Implementação do **Script de Restauração Emergencial em Lotes** (`scripts/emergency_restore.js`) restaurando tabelas em batch de 200 registros em menos de 3 minutos.
   - Criação do manual executivo `[documentation]/MANUAL_DE_RESTAURACAO.md`.
   - Catalogação da tarefa seguinte no plano: `TASK-61 (Onda 3 da Povoação)`.

---

## 📋 Próximos Passos Prioritários

1. **`TASK-61 (Onda 3)` — Coleta Dirigida com a Paróquia (PASCOM / Pe. Irineu / Secretaria):**
   - Preparar e enviar o pacote de comunicação e checklist do WhatsApp para:
     - [ ] 1 foto de fachada das 11 CEBs externas + Grupo Santa Rita.
     - [ ] 3 fotos dos movimentos (ECC, EAC, EJC).
     - [ ] Confirmação de balcão: Chave PIX oficial da Mitra/Catedral, WhatsApp oficial da secretaria e horários confirmados de confissões e da Missa da Vigília do Natal (24/12).
     - [ ] Liberação do acesso DNS ao domínio `catedraldecolatina.org.br` (`TASK-12`) seguindo o [`GUIA_APONTAMENTO_DNS_CLOUDFLARE_TASK12.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/GUIA_APONTAMENTO_DNS_CLOUDFLARE_TASK12.md).
2. **`TASK-62 (Onda 4)` — Validação Litúrgica Final & Campanha PWA de Bancada (15/12 a 23/12/2026):**
   - Conferencia de ponta a ponta com a secretária paroquial no `/admin`.
   - Impressão dos displays de bancada e cartões de bolso via [`/instalar/imprimir`](http://localhost:3000/instalar/imprimir) para posicionar nos bancos antes da Missa do Galo.

---

## 🏛️ Diretrizes Críticas Inegociáveis (Relembre a cada turno)
- **Regra de Ouro do White-Label:** A marca "Ecclesiam" NUNCA aparece para o fiel.
- **Nomenclatura Litúrgica:** NUNCA usar "culto" (usar "Santa Missa" ou "Celebração da Palavra"). NUNCA usar "no Altar" para folhas de intenções (usar "Folha do Púlpito A4" ou "Intenções de Missa"). Usar "Comunidade" no lugar de "Capela", e "Catedral" no lugar de "Matriz".
- **Delimitação THEOS:** O app NÃO faz captação contábil nem relatórios de dízimo cadastrado (papel exclusivo do ERP Theòs).
- **Regra de Exibição de Código SQL:** Toda migração SQL DEVE ser exibida na íntegra no chat.
- **Estimativa de Tempo:** Toda tarefa sugerida DEVE vir com `⏱️ Tempo Estimado: ~X minutos` e pergunta expressa de validação.
- **Sincronização Local:** Manter `[documentation]/` local e Google Drive 100% espelhados.
