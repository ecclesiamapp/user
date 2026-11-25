# 🚀 Prompt de Continuidade — Ecclesiam App & Catedral de Colatina

Copie e cole o bloco abaixo no início da sua próxima sessão para restaurar instantaneamente todo o contexto, regras inquebráveis, arquitetura, estado real do banco e o ponto exato onde paramos.

---

```markdown
Olá! Sou o desenvolvedor do **Ecclesiam App** (SaaS Multi-Paróquia) e da **Catedral do Sagrado Coração de Jesus de Colatina** (paróquia piloto oficial aprovada pelo Pe. Irineu Claudino Sales). Estou dando continuidade ao projeto exatamente do ponto em que paramos em **24/11/2026** (commit `f3006da` em `origin/main`).

Por favor, adote e siga rigorosamente as seguintes DIRETRIZES E REGRAS MANDATÓRIAS DO PROJETO:

1. **Regra de Ouro do White-Label:** No portal público (`/` e rotas do fiel), a marca "Ecclesiam" NUNCA deve aparecer em destaque. Toda a identidade pertence unicamente à Catedral do Sagrado Coração de Jesus (brasão, cores, monograma e padroeiro). A marca Ecclesiam opera exclusivamente nos bastidores da infraestrutura SaaS (`/login` e `/admin/superadmin`).
2. **Sincronização Bidirecional de Documentação (SSOT):** Toda documentação técnica, especificação, roteiro, laudo ou planejamento DEVE residir em `[documentation]/` e `[documentation]/planejamento/`, com cópia espelhada em `g:\Meu Drive\TRABALHOS\01 - NEGÓCIOS E PROJETOS ATIVOS\ECCLESIAN APP\AGENTE DE IA - ECCLESIAM\`.
3. **Precisão Litúrgica & Terminologia Canônica (`canonical_terminology_auditor`):**
   - **Proibição de "Culto":** Usar sempre **"Santa Missa"** (ou "Missas") e **"Celebração da Palavra"**.
   - **Altar vs. Púlpito/Ambão:** NUNCA usar "Intenções no Altar" ou "Folha de Altar". Usar sempre **"Intenções de Missa (Púlpito A4)"**, **"Folha Litúrgica para o Púlpito (A4)"**, **"Proclamada no Púlpito"** e **"Sigilo no Púlpito"**.
   - **Comunidades & Catedral:** Substituir `{Capela}` por **"Comunidade"** / **"Comunidades Eclesiais de Base (CEBs)"** e `{Matriz}` por **"Catedral"** / **"Catedral Diocesana"** (preservando marcos históricos de fundação 1928–1990 e identificadores técnicos de código).
4. **Delimitação Estrita com o THEÒS (Neutralidade Financeira):** O sistema **Theòs** é o ERP contábil canônico oficial da paróquia. O Ecclesiam App NÃO faz captação nem controle contábil de dízimo e NÃO exibe cards financeiros em R$ no dashboard; opera no acolhimento pastoral ("Sou do Sagrado"), transparência visual de obras e divulgação da chave PIX direta da Mitra Diocesana.
5. **Estratégia Financeira do Piloto (Stack Free Tier):** O piloto da Catedral de Colatina (Natal 2026) opera intencionalmente nos **planos gratuitos (Vercel Hobby + Supabase Free + Cloudflare Free = R$ 0/mês)**, já validado para 500 fiéis simultâneos com 0% de erro graças ao ISR/SSG. O upgrade para Supabase Pro / Vercel Pro só será acionado na escala comercial multi-paróquia (quando a receita de clientes pagantes financiar a infra).
6. **Estimativa de Tempo Mandatória:** TODA tarefa ou próximo passo sugerido DEVE trazer `⏱️ Tempo Estimado: ~X minutos` e a pergunta expressa: *"Você aprova a execução desta tarefa com base nesta estimativa de tempo?"*.
7. **Exibição Obrigatória de Código SQL:** Toda migração SQL (`.sql`) implementada, criada ou necessária DEVE ser exibida na íntegra em bloco Markdown diretamente no chat.
8. **Mobile-First Extremo, Anti-Monolito & UX/UI:**
   - Telas projetadas para smartphones de entrada (`360px–414px`), touch targets `>= 44px`, zero overflow horizontal e imagens obrigatoriamente em `.webp` (`<= 120KB` 16:9 / `<= 55KB` 4:5).
   - Componentes mantidos abaixo de `350–500` linhas (`proactive_refactoring`).
   - Variáveis CSS (`--dash-*` / `--cat-*`), cantos `rounded-2xl` / `rounded-xl`, classe `.dash-select` em `<select>` e zero `bg-white`/`bg-black` puros em estrutura.
9. **Protocolo Deploy & Skills Ativas:**
   - Pré-push obrigatório via `node .agents/skills/vercel/scripts/check_pre_push.js`, `npm run build` (0 erros) e verificação via Supabase MCP de que **ambos** os projetos (`ecclesiamapp` e `supabase-lime-queen`) estejam em `ACTIVE_HEALTHY` antes do `git push`.

---

### STACK TÉCNICA ATUAL:
- **Framework:** Next.js `16.4.6` (App Router) + TypeScript + React 19 + Tailwind CSS v4.
- **Performance & Cache:** ISR Global (`revalidate = 60`) nas 12 rotas públicas + `createPublicClient()` stateless (`utils/supabase/server.ts`) + **SSG (`generateStaticParams`) nas 12 Comunidades (CEBs)** (`68/68` páginas estáticas/SSG/ISR no build) + `unstable_cache` (5 min) no `RootLayout` + `AbortController` (3s) na API externa de liturgia.
- **Backend, Auth & IA:** Supabase (`rlcaapydcozsshafyvxx` — `ecclesiamapp`: PostgreSQL 17, RLS multi-tenant, `pgvector` HNSW RAG com Gemini, Auth SSR `@supabase/ssr`, Storage buckets `booklets`, `galleries`, `brand_assets`, `event_assets`, `movement_assets`).
- **PWA & Carga:** `public/sw.js` (leitura pública offline, bloqueando rotas privadas/admin), central de impressão `/instalar/imprimir` (Cartaz A4, Displays de Banco 4x, Cartões de Bolso 6x) e esteira de testes de carga **Grafana k6** (`tests/load/natal-stress-test.js`).

---

### ESTADO EXATO DO PROJETO (24/11/2026 — Commit `f3006da`):
1. **Horizonte Oficial Reorientado:** A estreia prevista para 29/11 foi frustrada por fatores externos na paróquia; foco oficial **100% na Solenidade do Natal 2026 (25/12/2026 — 31 dias de janela, status 🟢 Excelente)** atualizado em `check_health.js` e `IMPLEMENTACOES_PENDENTES.md`.
2. **Progresso do Plano (`PLANO_DE_ACAO_DETALHADO.md`):** **98% concluído (`63/64` tarefas entregues — Fases 2 a 11 em 100%)**. Falta apenas `TASK-12` (credenciais DNS da paróquia para apontamento Cloudflare).
3. **Validação de Carga & Laudo PDF para o Cliente (Concluídos):**
   - Teste de carga k6 executado até **500 fiéis simultâneos** (`12.572` requisições em 55s, `296` intenções gravadas ao vivo no Supabase Free e purgadas, **`0,00%` de erros**; `20ms` médios em 100 fiéis).
   - **Laudo Executivo em PDF (3 páginas A4 com gráficos SVG)** pronto para apresentar ao Pe. Irineu: `[documentation]/planejamento/LAUDO_TESTE_DE_CARGA_E_RESILIENCIA_CATEDRAL_2026.pdf` (espelhado no Google Drive).
   - **Relatório de Benchmark:** `[documentation]/planejamento/RELATORIO_BENCHMARK_ECCLESIAM_APP.md`.
4. **Povoação — Onda 1 CONCLUÍDA & NO AR (`PLANO_DE_POVOACAO_CATEDRAL_NATAL_2026.md`):**
   - Curadoria visual concluída das **85 fotografias autorais de Cláudio Costa** (`@claudiocostaimagens` — 72 internas/vitrais/batistério/presépio + 13 fachadas externas) dos 2 álbuns do Google Fotos.
   - Migração `supabase/migrations/20261123_seed_mass_schedules_and_natal_2026.sql` já aplicada no Supabase vivo: **`public.mass_schedules` povoada (`0` ➔ `25` horários reais)** e evento **`Solenidade do Natal do Senhor 2026` (`natal-2026`) ativo na Home** com 4 blocos litúrgicos (`15/12`, `24/12`, `25/12`, `31/12–01/01`).
5. **Qualidade:** Build `68/68` ✅ | TypeScript `0` erros ✅ | ESLint `0` erros ✅ | `24/24` testes unitários ✅ | Terminologia Canônica `0` desvios (`426` arquivos) ✅ | UX/UI `0` avisos (`266` arquivos) ✅.

---

### ONDE VAMOS RETOMAR AGORA (PRÓXIMAS FRENTES):
1. **Onda 2 da Povoação (`PLANO_DE_POVOACAO_CATEDRAL_NATAL_2026.md`):** Ingestão, conversão em lote para `.webp` e aplicação das ~25 melhores fotos selecionadas de Cláudio Costa (com crédito autoral) na Home, `/historia` (`parish_sacred_heritage`), Batistério (`/secretaria/sacramentos`), Lamparina (`/agenda-liturgica`) e 3 álbuns oficiais em `public.galleries`.
2. **Onda 3 da Povoação (Coleta com a Paróquia/PASCOM):** Fotos de fachadas das 11 Comunidades (CEBs) + Grupo Santa Rita, fotos dos Movimentos (ECC/EAC/EJC), confirmação de PIX/WhatsApp/horários finais de Natal e credenciais DNS (`TASK-12`).
3. **Pendências Operacionais Registradas em `IMPLEMENTACOES_PENDENTES.md`:**
   - Configurar `SUPABASE_SERVICE_ROLE_KEY` no `.env.local` + Vercel, validar 1 login real (migração dos `8` admins para `auth.users`) e executar os 3 scripts SQL de lockdown RLS no Supabase SQL Editor (retidos contra lockout).
   - Auditoria visual humana em navegador dos formulários da Secretaria (`TASK-56`) e da central de impressão PWA (`/instalar/imprimir`).

Por favor, execute o **Protocolo Start** (observação: se a porta `3000` estiver ocupada por outro projeto local, suba o servidor na porta `3001` com `npm run dev -- -p 3001`) e me apresente o status pronto para avançarmos na **Onda 2 da Povoação**!
```
