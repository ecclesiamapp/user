# 🚀 Prompt de Continuidade — Ecclesiam App & Catedral de Colatina

Copie e cole o bloco abaixo no início da sua próxima sessão para restaurar instantaneamente todo o contexto, regras inquebráveis, arquitetura e o estado exato da aplicação.

---

```markdown
Olá! Sou o desenvolvedor do **Ecclesiam App** (SaaS Multi-Paróquia) e da **Catedral de Colatina** (paróquia piloto oficial aprovada pelo Pe. Irineu Claudino Sales). Estou dando continuidade ao desenvolvimento do projeto.

Por favor, adote e siga rigorosamente as seguintes DIRETRIZES E REGRAS MANDATÓRIAS DO PROJETO:

1. **Regra de Ouro do White-Label:** No portal público (`/` e rotas do fiel), a marca "Ecclesiam" NUNCA deve aparecer em destaque. Toda a identidade pertence unicamente à Catedral do Sagrado Coração de Jesus (brasão, cores, monograma e padroeiro). A marca Ecclesiam opera exclusivamente nos bastidores da infraestrutura SaaS.
2. **Sincronização de Documentação (SSOT):** Toda documentação técnica, especificação, roteiro ou planejamento DEVE residir em `[documentation]/` e `[documentation]/planejamento/`.
3. **Regra de Menus Dropdown (<select>):** Sempre utilizar a classe `.dash-select` (definida em `globals.css`) que aplica `appearance-none`, seta SVG e padding adequado (`pl-3.5 pr-10 py-2`).
4. **Exibição Obrigatória de Código SQL:** Toda migração SQL (`.sql`) gerada ou necessária DEVE ser exibida na íntegra em bloco markdown diretamente no chat sem que o usuário precise pedir.
5. **Auditoria Anti-Monolito:** Arquivos devem ser mantidos com menos de 350-500 linhas; componentes pesados devem ser divididos em sub-componentes (UI-as-a-Service).
6. **Auditoria UX/UI (Design System Pe. Alex Nogueira):** Paleta pergaminho (`#F5EFE7`), areia (`#EEE3D4`), vermelho Sagrado Coração (`#8B1E22`), ouro âmbar (`#FFA82A`) e marrom ébano (`#2D1A16`). Tipografia `Sora` e display `Suez One`. NUNCA utilizar `bg-white`, `bg-black`, `text-white`, `text-black` puros em estrutura (utilizar as variáveis CSS `--dash-*` / `--cat-*`). Cantos arredondados generosos (`rounded-2xl` containers, `rounded-xl` botões/inputs).
7. **Protocolo Deploy:** Antes de qualquer commit/push ou subida para produção, OBRIGATÓRIO validar localmente para garantir 0 erros de compilação.
8. **Skills Ativas Mandatórias:**
   - `project_health_timeline`: Acionada por "relatorio situacional", "pendencias", etc., avaliando os dias restantes para os 4 marcos dominicais e timeboxing da sessão.
   - `project_manager`: Integrada ao Protocolo Start (Etapa 4) e acionada a cada etapa concluída para escanear `PLANO_DE_ACAO_DETALHADO.md` via `scan_plan.js`.

---

### STACK TÉCNICA:
- **Framework:** Next.js 16 (App Router) + TypeScript + React 19.
- **Estilização:** Tailwind CSS v4 + Design System customizado (`--dash-*`, `--cat-*`).
- **Backend & Auth:** Supabase (PostgreSQL com RLS multi-tenant por `parish_id`, Auth via SSR `@supabase/ssr`, Storage com buckets públicos `booklets` e `galleries`).
- **MCP:** Supabase MCP Server conectado diretamente ao projeto `rlcaapydcozsshafyvxx` (ecclesiamapp), executando SQL e verificações em tempo real.
- **PWA:** Web App Manifest dinâmico (`app/manifest.ts`), ícones adaptativos e prompt customizado de instalação.

---

### ESTADO ATUAL DO PROJETO (10/10/2026):
1. **Progresso Global do Roadmap:** **53% concluído (16 de 30 tarefas entregues)**.
   - 🟢 **Fase 1 (01/11/2026 - Solenidade de Todos os Santos):** **92% concluída** (11/12 tarefas). Resta apenas o apontamento DNS da Catedral.
   - 🟡 **Fase 2 (22/11/2026 - Solenidade de Cristo Rei):** **71% adiantada** (5/7 tarefas entregues).
2. **Módulo de Galerias Fotográficas & Storage ([TASK-18]):** Rota `/admin/galerias` com `GalleryCard` e `GalleryFormModal`, upload direto para bucket `galleries` do Supabase e renderização nos minisites `/comunidades/[slug]`.
3. **Gestão de Horários por CEB ([TASK-16]):** Rota `/admin/horarios` com suporte a query params (`?community_id=...`), filtros por tipo de celebração e componentes modulares `ScheduleItem` e `ScheduleFormModal`.
4. **Gestão de Conteúdo e História das CEBs ([TASK-15]):** Rota `/admin/comunidades` com `CommunityCard` e `CommunityFormModal` (edição de história, fundadores, ano de fundação e contatos).
5. **Auditoria de RLS & Dependências ([TASK-10] & [TASK-11]):** RLS ativo em 100% das 13 tabelas públicas, RPC `increment_booklet_downloads` criada e `npm audit` executado.
6. **Roteiro de Treinamento da Secretária ([TASK-09]):** Documento completo em `[documentation]/planejamento/ROTEIRO_TREINAMENTO_SECRETARIA.md`.
7. **Saúde Técnica e Build:** **19 rotas** geradas no Next.js 16 (0 erros de tipagem TypeScript e 0 warnings de compilação).

---

### PRÓXIMAS AÇÕES IMEDIATAS:
1. **[TASK-19]:** Elaborar o Guia & Roteiro da Capacitação 2: Lideranças das 12 CEBs e Equipe PASCOM (4 horas presenciais na Catedral Diocesana) em `[documentation]/planejamento/ROTEIRO_TREINAMENTO_LIDERANCAS_CEBS.md`.
2. **Fase 3 (Secretaria On-line):** Iniciar modelagem das tabelas `pastoral_appointments` (agendamento com sacerdotes) e `sacramental_registrations` (inscrições de batismo, catequese e noivos).

Por favor, confirme que você compreendeu o contexto, a stack e as regras do projeto, execute o Protocolo Start (com a Etapa 4 do Gerente de Projeto) e me informe o status para darmos continuidade.
```
