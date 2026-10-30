# 🚀 Prompt de Continuidade — Ecclesiam App & Catedral de Colatina

Copie e cole o bloco abaixo no início da sua próxima sessão para restaurar instantaneamente todo o contexto, regras inquebráveis, arquitetura e o estado exato da aplicação.

---

```markdown
Olá! Sou o desenvolvedor do **Ecclesiam App** (SaaS Multi-Paróquia) e da **Catedral de Colatina** (paróquia piloto oficial aprovada pelo Pe. Irineu Claudino Sales). Estou dando continuidade ao desenvolvimento do projeto.

Por favor, adote e siga rigorosamente as seguintes DIRETRIZES E REGRAS MANDATÓRIAS DO PROJETO:

1. **Regra de Ouro do White-Label:** No portal público (`/` e rotas do fiel), a marca "Ecclesiam" NUNCA deve aparecer em destaque. Toda a identidade pertence unicamente à Catedral do Sagrado Coração de Jesus (brasão, cores, monograma e padroeiro). A marca Ecclesiam opera exclusivamente nos bastidores da infraestrutura SaaS.
2. **Sincronização Bidirecional de Documentação (SSOT):** Toda documentação técnica, especificação, roteiro ou planejamento DEVE residir em `[documentation]/` e `[documentation]/planejamento/`, com cópia espelhada em `g:\Meu Drive\TRABALHOS\01 - NEGÓCIOS E PROJETOS ATIVOS\ECCLESIAN APP\AGENTE DE IA - ECCLESIAM\`.
3. **Precisão Litúrgica & Terminologia Canônica (`canonical_terminology_auditor`):**
   - **Proibição de "Culto":** Usar sempre **"Santa Missa"** (ou "Missas") e **"Celebração da Palavra"**.
   - **Altar vs. Púlpito/Ambão:** NUNCA usar "Intenções no Altar" ou "Folha de Altar". Usar sempre **"Intenções de Missa (Púlpito A4)"**, **"Folha Litúrgica para o Púlpito (A4)"**, **"Proclamada no Púlpito"** e **"Sigilo no Púlpito"**.
   - **Comunidades & Catedral:** Substituir `{Capela}` por **"Comunidade"** / **"Comunidades Eclesiais de Base (CEBs)"** e `{Matriz}` por **"Catedral"** / **"Catedral Diocesana"** (preservando apenas marcos históricos de fundação 1928–1990 e identificadores técnicos de código).
4. **Delimitação Estrita com o THEÒS (Neutralidade Financeira):** O sistema **Theòs** é o ERP contábil canônico oficial da paróquia. O Ecclesiam App NÃO faz captação nem controle contábil de dízimo e NÃO exibe cards financeiros em R$ no dashboard; opera estritamente no acolhimento pastoral ("Sou do Sagrado" com triagem para lançamento no Theòs), transparência visual de obras e divulgação da chave PIX direta da Mitra Diocesana.
5. **Estimativa de Tempo Mandatória:** TODA tarefa ou próximo passo sugerido DEVE trazer `⏱️ Tempo Estimado: ~X minutos` e a pergunta expressa: *"Você aprova a execução desta tarefa com base nesta estimativa de tempo?"*.
6. **Exibição Obrigatória de Código SQL:** Toda migração SQL (`.sql`) implementada, criada ou necessária DEVE ser exibida na íntegra em bloco Markdown diretamente no chat.
7. **Mobile-First Extremo, Anti-Monolito & UX/UI:**
   - Telas projetadas para smartphones de entrada (`360px–414px`), alvos de toque `>= 44px`, zero overflow horizontal e mídia leve (`.webp`, CSS nativo).
   - Componentes mantidos abaixo de `350–500` linhas (`proactive_refactoring`).
   - Variáveis CSS (`--dash-*` / `--cat-*`), cantos `rounded-2xl` / `rounded-xl`, classe `.dash-select` em `<select>` e zero `bg-white`/`bg-black` puros em estrutura.
8. **Protocolo Deploy & Skills Ativas:**
   - Pré-push obrigatório via `node .agents/skills/vercel/scripts/check_pre_push.js`, `npm run build` com 0 erros e verificação de `ACTIVE_HEALTHY` nos projetos Supabase vinculados à Vercel (`ecclesiamapp` e `supabase-lime-queen`).
   - Skills integradas: `project_manager` (`scan_plan.js`), `project_health_timeline` (`check_health.js`), `ux_ui_auditor`, `canonical_terminology_auditor` e `multi_agent_team` (19 especialistas em 4 pods via `/team` ou `/autopilot`).

---

### STACK TÉCNICA:
- **Framework:** Next.js 16.3.6 (App Router) + TypeScript + React 19.
- **Estilização:** Tailwind CSS v4 + Design System Catedral (`--dash-*`, `--cat-*`) com Live Theming.
- **Backend, Auth & IA:** Supabase (`rlcaapydcozsshafyvxx` - `ecclesiamapp`: PostgreSQL 17 com RLS multi-tenant por `parish_id`, `pgvector` HNSW para RAG com Google Gemini, Auth SSR `@supabase/ssr`, Storage buckets `booklets`, `galleries`, `brand_assets`, `event_assets`).
- **PWA:** Web App Manifest dinâmico (`app/manifest.ts`), guia `/instalar` e cartazes A4 com QR Code para os bancos da Catedral.

---

### ESTADO ATUAL DO PROJETO (29/10/2026):
1. **Progresso Global do Plano Principal (`PLANO_DE_ACAO_DETALHADO.md`):** **98% concluído (53 de 54 tarefas entregues)**.
   - 🟢 **Fase 1 (Go-Live 1º Domingo do Advento - 29/11/2026):** **92% concluída** (`11/12` tarefas — aguarda apenas `TASK-12`: credenciais DNS da paróquia para apontamento Cloudflare).
   - 🟡 **Fase 2 (12 Comunidades & Folhetos Litúrgicos):** **100% CONCLUÍDA** (`7/7`).
   - 🔵 **Fase 3 (Secretaria On-line & Agendamentos com os 4 Padres):** **100% CONCLUÍDA** (`6/6`).
   - 🌟 **Fase 4 (Subpáginas Institucionais, Coroa do Advento Viva, Cartas de Natal & PWA):** **100% CONCLUÍDA** (`11/11`).
   - 🟣 **Fase 5 (Inteligência Paroquial & Assistente IA RAG com pgvector):** **100% CONCLUÍDA** (`4/4`).
   - 🎨 **Fase 6 (Hub de Marca `/admin/marca`, Extração Multimodal IA & Live Theming):** **100% CONCLUÍDA** (`5/5`).
   - 🏛️ **Fase 7 (LPs das Comunidades, Acessibilidade A-/A/A+, RBAC `/admin/usuarios` & Intenções de Missa Púlpito A4):** **100% CONCLUÍDA** (`5/5`).
   - 🕊️ **Fase 8 (Grandes Festas & Programações Especiais `/programacao/[slug]` e `/admin/programacao`):** **100% CONCLUÍDA** (`4/4`).
2. **Banco de Dados Supabase 100% Sincronizado (`29/29` tabelas públicas com RLS ativo):**
   - Todas as tabelas de todos os módulos (incluindo Pastoral do Dízimo / Triagem Theòs `tithe_registrations`, `tithe_transparency_items`, `tithe_faqs` e Memória & História `parish_history_milestones`, `parish_pastors_succession`, `parish_sacred_heritage`) estão criadas, populadas e verificadas em produção.
3. **Saúde Técnica e Conformidade:** **0 erros de TypeScript (`npm run build`)**, **345 arquivos validados com 0 desvios canônicos** e **217 arquivos aprovados com 0 avisos na Auditoria UX/UI**.

---

### PRÓXIMAS FRENTES PRIORITÁRIAS:
1. **[TASK-12] (Assim que liberado pela paróquia):** Apontamento de DNS e Escudo Cloudflare (Proxy Nuvem Laranja + SSL Full Strict) para `catedraldecolatina.org.br`.
2. **Blindagem de Segurança Pré-Go-Live:** Revisão final das políticas RLS provisórias de homologação (`anon` ➔ `authenticated`/RBAC por `parish_id`) antes da virada do domínio oficial em 29/11.
3. **Backlog Futuro 2027 (`IMPLEMENTACOES_PENDENTES.md`):**
   - Módulo de Movimentos Paroquiais (`ECC`, `EAC`, `EJC` — `/movimentos/[slug]` e `/admin/movimentos`).
   - Console Global SaaS Multi-Paróquia (`[MainAdmin]` — `/superadmin`).
   - Área Privada do Fiel (`Meu Espaço Paroquial` — `/meu-espaco`, respeitando a delimitação com o Theòs).

Por favor, confirme que compreendeu o contexto, execute o Protocolo Start completo (Etapas 1 a 5) e me apresente o Card Executivo para iniciarmos.
```
