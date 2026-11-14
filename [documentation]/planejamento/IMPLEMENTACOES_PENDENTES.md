# 📋 Documento de Implementações Pendentes & Backlog Futuro

> **Documento Oficial de Governança de Escopo e Evolução (SSOT)**  
> **Status:** Atualizado e Auditado pelo Gerente de Projeto  
> **Última Atualização:** 14 de Novembro de 2026  
> **Referência:** Alinhado com [`PLANO_DE_ACAO_DETALHADO.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/PLANO_DE_ACAO_DETALHADO.md) e [`DIRETRIZ_PASTORAL_E_FINANCEIRA_DIZIMO.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/DIRETRIZ_PASTORAL_E_FINANCEIRA_DIZIMO.md)

Este documento distingue claramente os **novos módulos do Backlog Futuro (Pós-Fase 8 / Ciclo 2027)** dos itens que **já foram 100% implementados e homologados** ao longo das Fases 1 a 8 da Catedral do Sagrado Coração de Jesus.

---

## 🚀 PARTE I — BACKLOG ATIVO PARA IMPLEMENTAÇÃO FUTURA (PÓS-FASE 8)

### 📌 1. `[MainAdmin]` — Console Global do Proprietário / SaaS (`/admin/superadmin`)

* **Status:** ✅ **100% Concluído & Homologado (Fase 9 / TASK-49 a TASK-52)**
* **Rota Ativa:** `/admin/superadmin` e portal de entrada `/login`
* **Escopo Funcional Entregue:**
  * Gestão de Tenants (todas as paróquias clientes da plataforma Ecclesiam).
  * Provisionamento e onboarding automatizado 1-Click de novas paróquias (geração de slugs, identidade visual inicial e mapeamento de domínios customizados).
  * Gestão de planos, assinaturas e status de faturamento SaaS da plataforma com Kill-Switch ético (`ativa`, `implantacao`, `suspensa`).
  * Trilha de auditoria LGPD e segurança anti-brute-force (`security_audit_logs`).
  * Métricas agregadas de saúde de infraestrutura, volume de atendimentos pastorais e engajamento das comunidades (respeitando a neutralidade financeira perante o Theòs).

---

### 📌 2. Módulo Dedicado de Movimentos Paroquiais (ECC, EAC e EJC)

* **Status:** ✅ **100% Concluído & Homologado**
* **Rotas Ativas:** `/movimentos`, `/movimentos/[slug]`, `/admin/movimentos`
* **Movimentos Contemplados:**
  * **ECC** (Encontro de Casais com Cristo)
  * **EAC** (Encontro de Adolescentes com Cristo)
  * **EJC** (Encontro de Jovens com Cristo)
* **Entregas Técnicas Entregues:**
  * **Passo 1 (Modelagem & RLS):** Migração [`supabase/migrations/20261107_create_parish_movements.sql`](file:///c:/Users/Start/ecclesiam-app/supabase/migrations/20261107_create_parish_movements.sql), tabelas `parish_movements`, `parish_movement_events`, `parish_movement_registrations` e bucket `movement_assets` com RLS estrito e carga canônica da Catedral.
  * **Passo 2 (Portal Público & Transparência LGPD em 2 Etapas):** Hub [`app/movimentos/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/movimentos/page.tsx), mini-sites [`app/movimentos/[slug]/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/movimentos/%5Bslug%5D/page.tsx), stepper de conformidade jurídica [`MovementLegalTermsStep.tsx`](file:///c:/Users/Start/ecclesiam-app/components/movements/MovementLegalTermsStep.tsx) (4 cards com bases legais da LGPD Art. 11/14 e ECA Digital) integrado ao modal [`MovementRegistrationModal.tsx`](file:///c:/Users/Start/ecclesiam-app/components/movements/MovementRegistrationModal.tsx).
  * **Passo 3 (Painel Administrativo & Menu):** Painel [`app/admin/movimentos/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/admin/movimentos/page.tsx) com abas de Fila de Fichas/Triagem ([`MovementRegistrationsTab.tsx`](file:///c:/Users/Start/ecclesiam-app/components/admin/movements/MovementRegistrationsTab.tsx)), Gestão de Encontros com 1-Click Toggle ([`MovementEventsTab.tsx`](file:///c:/Users/Start/ecclesiam-app/components/admin/movements/MovementEventsTab.tsx)), Edição de Dados ([`MovementInfoTab.tsx`](file:///c:/Users/Start/ecclesiam-app/components/admin/movements/MovementInfoTab.tsx)) e item oficial na [`AdminSidebar.tsx`](file:///c:/Users/Start/ecclesiam-app/components/admin/layout/AdminSidebar.tsx).
  * Identificação, brasão/identidade, carisma espiritual e patrono de cada movimento.
  * Equipe Dirigente atual (Casal Coordenador / Jovens Coordenadores e Diretor Espiritual) com contato WhatsApp.
  * Calendário anual condensado (Encontros de 1ª, 2ª e 3ª etapas, pós-encontros, círculos e Santas Missas de entrega).
  * Ficha digital de pré-inscrição / manifestação de interesse com consentimento LGPD.
  * Galeria fotográfica dos encontros conectada ao Supabase Storage.
* **Escopo no Painel Administrativo (`/admin/movimentos`):**
  * Gestão das equipes dirigentes e mandatos, cronograma anual, fila de fichas de interesse (`Nova`, `Em Contato`, `Confirmada`) e publicação de comunicados.

---

### 📌 3. Área Privada do Fiel ("Meu Espaço Paroquial" — `/meu-espaco`)

* **Status:** ✅ **100% Concluído & Homologado**
* **Rotas Ativas:** `/meu-espaco` e banner integrado na Home (`/`)
* **Documento Detalhado:** [`ESCOPO_AREA_DO_FIEL.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/ESCOPO_AREA_DO_FIEL.md)
* **Entregas Técnicas Entregues:**
  * **Etapa 1 (Arquitetura, Acesso & Hub Bento Grid):** Rota `/meu-espaco`, acesso Passwordless WhatsApp/Protocolo sem senhas, Bento Grid com as 14 CEBs, agendamentos com os 4 sacerdotes, intenções Púlpito A4 e PIX Theòs.
  * **Etapa 2 (Ações Interativas, Cancelamento & Comprovante Digital):** Cancelamento prévio de agendamentos para liberação fraterna de vagas na agenda dos sacerdotes, e modal de comprovante litúrgico [`IntentionReceiptModal.tsx`](file:///c:/Users/Start/ecclesiam-app/components/meu-espaco/IntentionReceiptModal.tsx) com atalho de compartilhamento no WhatsApp para a família e impressão em PDF da intenção para o Púlpito A4.
  * **Etapa 3 (Sincronização & Destaque na Home):** Banner monumental e acolhedor [`MeuEspacoHomeBanner.tsx`](file:///c:/Users/Start/ecclesiam-app/components/home/MeuEspacoHomeBanner.tsx) integrado na página inicial, sincronização reativa de sessão cross-tab e conformidade estrita com a LGPD e o THEOS.
* **Escopo Funcional (Alinhado à Diretriz Canônica Theòs):**
  1. **Autenticação sem Senha (Passwordless):** Acesso simples via Código OTP de 6 dígitos ou Magic Link (ideal para fiéis idosos).
  2. **Meus Agendamentos & Protocolos da Secretaria:** Acompanhamento em tempo real de confissões/atendimentos com os 4 sacerdotes, solicitações de certidões e protocolos unificados de **Intenções de Missa (Púlpito A4)**.
  3. **Minha Comunidade (CEB Favorita):** Feed priorizado com horários de Santas Missas, Celebrações da Palavra, tríduos e mural de avisos da comunidade escolhida pelo fiel.
  4. **Vínculo Informativo com a Pastoral do Dízimo:** Exibição do status de acolhimento pastoral ("Sou do Sagrado") e atalho rápido para a chave PIX oficial da Mitra Diocesana *(sem intermediação financeira nem controle contábil de carnês, que permanecem exclusivos do sistema **Theòs**)*.

---

### 📌 4. Curadoria dos Retratos dos Bispos Diocesanos & Galeria do Clero da Catedral

* **Status:** ✅ **100% Concluído & Homologado**
* **Rotas Ativas:** `/historia` (aba "Bispos" e aba "Párocos")
* **Entregas Técnicas Entregues:**
  * **Padronização Canônica 4:5:** Retratos dos 4 bispos diocesanos (Dom Geraldo, Dom Décio, Dom Wladimir e Dom Lauro) perfeitamente ajustados na proporção 4:5 (`600x750`) com compressão WebP de alta fidelidade (`<= 55KB`).
  * **Modal Solene de Ampliação:** Subcomponente [`BishopDetailModal.tsx`](file:///c:/Users/Start/ecclesiam-app/components/historia/BishopDetailModal.tsx) com visualização solene do retrato, lema episcopal oficial em latim e tradução, resumo histórico e marcos notáveis na Diocese de Colatina.
  * **Grid Nobre do Clero em Atividade:** Subcomponente [`CathedralCurrentClergyGrid.tsx`](file:///c:/Users/Start/ecclesiam-app/components/historia/CathedralCurrentClergyGrid.tsx) apresentando os 4 sacerdotes da Catedral (Pe. Irineu Claudino Sales, Pe. Adilson Ramos de Melo, Pe. Deivid José Langa Lopes e Pe. Ernandes Samuel Fantin) com datas canônicas de ordenação presbiteral e retratos otimizados em 4:5 (`pe-deivid-pereira.webp` de 21KB e `pe-ernandes-fantin.webp` de 67KB).
  * **Refatoração Anti-Monólito:** Galeria [`BishopsAndPastorsGallery.tsx`](file:///c:/Users/Start/ecclesiam-app/components/historia/BishopsAndPastorsGallery.tsx) mantida leve e modular (260 linhas).

---

### 📌 5. Blindagem Final de RLS Pré-Go-Live & Apontamento DNS (`TASK-12`)

* **Status:** 🛡️ **Hardening de RLS e Auditoria de Segurança 100% Concluídos** | ⏳ **Apontamento DNS Pré-Go-Live**
* **Entregas de Segurança Concluídas:**
  * **Auditoria Multi-Agente:** Convocação do Squad de 5 especialistas (`security-reviewer`, `architect`, `critic`, `executor`, `verifier`).
  * **Revogação de Permissões Anônimas:** Eliminação de mutação anônima (`ALL`, `UPDATE`, `DELETE`) em todas as tabelas mestras da paróquia e restrição estrita aos roles `authenticated` e `service_role`.
  * **Blindagem LGPD:** Proteção de dados de fiéis em `mass_intentions`, `certificate_requests`, `tithe_registrations` e `parish_movement_registrations` (fiel tem permissão apenas de `INSERT` com consentimento; consultas ocorrem via RPCs seguras).
  * **RPCs Blindadas para a Área do Fiel:** Implementação de `lookup_parishioner_intentions`, `lookup_parishioner_appointments` e `cancel_parishioner_appointment` com validação de telefone/protocolo e `SET search_path = ''`.
  * **Resolução de Avisos Supabase Linter:** Blindagem de `search_path` nas funções `get_booked_appointment_slots` e `increment_booklet_downloads`.
  * **Script SQL de Migração Oficial:** [`supabase/migrations/20261109_security_rls_hardening.sql`](file:///c:/Users/Start/ecclesiam-app/supabase/migrations/20261109_security_rls_hardening.sql).
* **Item Restante para o Lançamento Definitivo:**
  * Apontamento DNS & Escudo Cloudflare (`catedraldecolatina.org.br` — Proxy Nuvem Laranja + SSL Full Strict): `~25 minutos` *(aguardando credenciais DNS da paróquia)*.

---

### 🚨 6. Bloqueadores Técnicos de Go-Live (Hardening de Engenharia & Produção — Fase 10)

* **Status:** 🔴 **Bloqueadores Obrigatórios Antes de Produção Pública / Multi-Tenant SaaS**
* **Origem:** Auditoria técnica de engenharia de software realizada em 12/11/2026.

#### 🔒 Bloqueador 1 (`TASK-53`): Blindagem Real de Autenticação & APIs Administrativas
* **Status:** ✅ **Código & Migração SQL Entregues** *(pendente apenas configurar `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`/Vercel e executar [`20261114_task53_auth_rls_lockdown.sql`](file:///c:/Users/Start/ecclesiam-app/supabase/migrations/20261114_task53_auth_rls_lockdown.sql))*

#### 📦 Bloqueador 2 (`TASK-54`): Patch Crítico de Dependência (`Next.js`), Upload Real & Lint
* **Status:** ✅ **Concluído (`next@16.4.6`, `0` vulnerabilidades de produção, `0` erros ESLint e `/api/upload` exclusivamente em Storage)**

#### 🧪 Bloqueador 3 (`TASK-55`): Performance RLS, Testes Críticos & Saída da Stack Gratuita
* **Status:** ✅ **SQL & Suíte de Testes Entregues** *(aguardando apenas upgrade de assinatura Pro no momento da ativação comercial multi-paróquia)*
* **Entregas Realizadas (`TASK-55`):**
  * **Consolidação RLS & Índices ([`20261114_task55_rls_performance_and_indexes.sql`](file:///c:/Users/Start/ecclesiam-app/supabase/migrations/20261114_task55_rls_performance_and_indexes.sql)):** Criação dos 2 índices pendentes de Foreign Key (`parish_knowledge_documents.uploaded_by` e `security_audit_logs.user_profile_id`) e unificação das 20 políticas redundantes de `SELECT` (`multiple_permissive_policies`) separando leitura (`SELECT`) de escrita (`INSERT`/`UPDATE`/`DELETE`) com otimização `(SELECT ...)`.
  * **Suíte Mínima Automatizada (`npm test`):** Testes em `tests/` cobrindo bloqueio do `proxy.ts` em `/admin`, `/api/admin/**` e `/api/upload` (inclusive contra falsificação do cookie legado), rate limiter server-side, validação anti-auto-elevação de privilégio em `/api/auth/request-access`, exigência de `SUPABASE_SERVICE_ROLE_KEY` e contratos de `/api/notifications` e `/api/dizimo/register`.
* **Checklist Obrigatório de Saída da Stack Gratuita (Ativação Comercial Multi-Paróquia):**
  1. **Supabase Pro (`US$ 25/mês`):**
     * Elimina pausa automática por inatividade de 7 dias.
     * Habilita **Daily Backups + Point-in-Time Recovery (PITR)** para dados sacramentais e pastorais (LGPD).
     * Eleva cotas de egress/bandwidth, Storage e conexões simultâneas em horários de pico (Santa Missa dominical e festas do padroeiro).
  2. **Vercel Pro (`US$ 20/mês`):**
     * Licença comercial exigida pelos Termos de Serviço da Vercel para operação SaaS paga multi-paróquia.
     * Amplia timeout de Serverless Functions (essencial para rotas de IA `/api/admin/brand/extract` e `/api/admin/ai/sync-database`), logs persistentes e proteção de equipe.
  3. **Aplicação Sequencial das Migrações no Banco Vivo:**
     * Configurar `SUPABASE_SERVICE_ROLE_KEY` no `.env.local` e na Vercel.
     * Executar `supabase/migrations/20261114_task53_auth_rls_lockdown.sql` seguido de `supabase/migrations/20261114_task55_rls_performance_and_indexes.sql`.

---

### ✨ 7. Polimento UX, Acessibilidade & Resiliência Mobile (Fase 11)

* **Status:** 🔄 **Em Andamento — 1/3 Concluídas (`TASK-56` ✅)**
* **Origem:** Entrevista arquitetural (`/grill-me`) sobre o guia *Polish* (Lincoln Devine) em 14/11/2026, filtrada para o contexto Web/Next.js + PWA da Catedral (>85% mobile, fiéis idosos, 3G/4G).

#### ✅ `TASK-56`: Resiliência de Formulários, Idempotência & Erros Amigáveis (CONCLUÍDA em 14/11/2026)
* **⏱️ Tempo Estimado:** ~35 a 45 minutos
* **Escopo Fechado:**
  * ✅ Rascunho automático em `sessionStorage` via [`useSessionDraft.ts`](file:///c:/Users/Start/ecclesiam-app/lib/hooks/useSessionDraft.ts) (expira em 4h e apaga ao fechar o navegador, protegendo dados em celulares compartilhados — LGPD/ECA Digital) nos formulários [`PastoralAppointmentBooking.tsx`](file:///c:/Users/Start/ecclesiam-app/components/secretaria/PastoralAppointmentBooking.tsx), [`CertificateRequestForm.tsx`](file:///c:/Users/Start/ecclesiam-app/components/secretaria/certidoes/CertificateRequestForm.tsx), [`SacramentRegistrationContainer.tsx`](file:///c:/Users/Start/ecclesiam-app/components/secretaria/sacramentos/SacramentRegistrationContainer.tsx) e [`MovementRegistrationModal.tsx`](file:///c:/Users/Start/ecclesiam-app/components/movements/MovementRegistrationModal.tsx).
  * ✅ Tradutor central [`friendlyError.ts`](file:///c:/Users/Start/ecclesiam-app/lib/security/friendlyError.ts) substituindo exposição crua de `err?.message` / `error.message` nos arquivos de Admin, Login, Upload e Secretaria.
  * ✅ Envio e validação de `idempotency_key` no servidor ([`idempotency.ts`](file:///c:/Users/Start/ecclesiam-app/lib/security/idempotency.ts), [`/api/secretaria/appointments`](file:///c:/Users/Start/ecclesiam-app/app/api/secretaria/appointments/route.ts), [`/api/secretaria/intentions`](file:///c:/Users/Start/ecclesiam-app/app/api/secretaria/intentions/route.ts)) e migração SQL [`20261114_task56_idempotency_keys.sql`](file:///c:/Users/Start/ecclesiam-app/supabase/migrations/20261114_task56_idempotency_keys.sql) para evitar duplicidade em conexões 3G/4G instáveis.

#### 📲 `TASK-57`: PWA Offline Leve (`public/sw.js`) para Leitura Pública
* **⏱️ Tempo Estimado:** ~30 a 40 minutos
* **Escopo Fechado:**
  * Registrar Service Worker minimalista (`public/sw.js` vinculado ao [`app/manifest.ts`](file:///c:/Users/Start/ecclesiam-app/app/manifest.ts)) com estratégia *stale-while-revalidate* restrita às rotas e dados **públicos somente leitura** (`/`, `/agenda-liturgica`, `/comunidades`, `/historia` e folhetos).
  * Bloqueio explícito de cache para `/admin`, `/login`, `/meu-espaco` e `/api/admin` para evitar exibição de dados pessoais ou sessões antigas em aparelhos compartilhados.

#### 🎨 `TASK-58`: Skeletons (`loading.tsx`), Escala Tipográfica Persistida & Micro-Interações
* **⏱️ Tempo Estimado:** ~35 a 45 minutos
* **Escopo Fechado:**
  * Criar 3–4 templates compartilhados de Skeleton (`loading.tsx`) para rotas dinâmicas públicas (eliminando sensação de congelamento durante navegação SSR).
  * Persistir o seletor `A- / A / A+` de [`CathedralHeader.tsx`](file:///c:/Users/Start/ecclesiam-app/components/layout/CathedralHeader.tsx) de forma versionada no `localStorage`, adotando escala relativa (`%`) para respeitar a configuração de fonte do sistema operacional do celular do fiel.
  * Trocar emojis pictóricos em elementos de UI (nos `11` arquivos identificados) por ícones `lucide-react` (preservando o símbolo sagrado `✝` no brasão e textos pastorais) e adicionar feedback tátil leve via CSS (`:active scale`) em [`app/globals.css`](file:///c:/Users/Start/ecclesiam-app/app/globals.css).

---

### 👀 8. Auditorias Visuais Humanas Pendentes (Homologação em Navegador)

* **Status:** 🟡 **Pendente (Adiada pelo Dev para Sessão Posterior — 14/11/2026)**
* **Nota Operacional:** Caso a porta `3000` esteja ocupada localmente por outro projeto, subir com `npm run dev -- -p 3001`.
* **Checklist Pendente:**
  - [ ] **`/secretaria/agendamentos`** (`TASK-56`): Validar preenchimento parcial + `F5` (`sessionStorage`), isolamento ao fechar/abrir aba, envio duplo em *Slow 3G* com mesma `idempotency_key` e diagrama mobile em `375px`.
  - [ ] **`/secretaria/certidoes`** (`TASK-56`): Validar rascunho em `sessionStorage`, obrigatoriedade de reaceite manual do checkbox LGPD e layout em `375px`.
  - [ ] **`/secretaria/sacramentos`** (`TASK-56`): Validar alternância entre sacramentos, rascunho em `sessionStorage` e mensagens de erro amigáveis.
  - [ ] **`/secretaria/intencoes`** (`TASK-56`): Validar envio em lote com `idempotency_key` via `/api/secretaria/intentions` e simulação de rede instável.
  - [ ] **Modal de Movimentos (`/movimentos/[slug]`)** (`TASK-56`): Validar `MovementRegistrationModal` (rascunho em `sessionStorage` sem pular etapa 1 de termos LGPD).
  - [ ] **Fluxo Auth/Upload (`/login` e `/admin/*`)** (`TASK-53`, `TASK-54`, `TASK-56`): Validar redirecionamento server-side no `proxy.ts` após configurar `SUPABASE_SERVICE_ROLE_KEY` + usuários reais em `auth.users` e mensagens amigáveis em falhas de login/upload.

---

## ✅ PARTE II — HISTÓRICO DE ENTREGAS JÁ CONCLUÍDAS E HOMOLOGADAS (100%)

Para rastreabilidade arquitetural, os módulos abaixo — originalmente registrados neste documento — **já foram 100% desenvolvidos, sincronizados no Supabase e publicados em produção**:

| # | Módulo / Entrega Original | Status | Referência Técnica & Rotas Ativas |
| :-: | :--- | :---: | :--- |
| **1** | **Mini-Sites Dinâmicos das Comunidades (CEBs)** | ✅ **100%** | `/comunidades`, `/comunidades/[slug]`, Schema.org `CatholicChurch`, GPS Maps/Waze (`TASK-14`, `TASK-41`) |
| **2** | **Dashboard Administrativo das LPs das Comunidades** | ✅ **100%** | `/admin/comunidades`, upload no Storage, gestão de CPC, avisos locais, pastorais e painel dedicado (`TASK-42`) |
| **3** | **UX Bento Clicável, Acessibilidade `A-/A/A+` & Faixa Litúrgica** | ✅ **100%** | Modais nas LPs das CEBs, ajuste de fonte para idosos, limpeza do Card 1 e faixa litúrgica (`TASK-41B`) |
| **4** | **Agendamentos Multissacerdotais (4 Padres)** | ✅ **100%** | `/secretaria/agendamentos`, `/admin/secretaria` e tabela `public.pastoral_appointments` (`TASK-20`, `TASK-22`, `TASK-24`) |
| **5** | **Secretaria On-line: Sacramentos, Certidões & Intenções (Púlpito A4)** | ✅ **100%** | `/secretaria/sacramentos`, `/secretaria/certidoes`, `/secretaria/intencoes` com protocolo unificado, Sigilo no Púlpito e Folha Litúrgica para o Púlpito A4 (`TASK-44`) |
| **6** | **Repositório de Folhetos Litúrgicos ("Sou do Sagrado Missa")** | ✅ **100%** | `/admin/folhetos`, bucket Storage `booklets` e download direto na Home (`TASK-05`) |
| **7** | **Álbuns & Galerias Fotográficas das Comunidades** | ✅ **100%** | `/admin/galerias`, tabela `public.galleries` e bucket Storage `galleries` (`TASK-18`) |
| **8** | **Motor Litúrgico Dinâmico, Coroa do Advento Viva & Grandes Festas** | ✅ **100%** | `/api/liturgia`, `/agenda-liturgica`, Coroa do Advento CSS nativo e construtor `/programacao/[slug]` + `/admin/programacao` (`TASK-08`, `TASK-27`, `TASK-45`–`TASK-48`) |
| **9** | **Memória, História, Sucessão Apostólica & "In Memoriam"** | ✅ **100%** | `/historia`, `/admin/historia` e tabelas `parish_history_milestones`, `parish_pastors_succession` (com `in_memoriam`) e `parish_sacred_heritage` ativas no Supabase (`TASK-26C`, `TASK-26C-AUDIT`) |
| **10** | **Gestão de Usuários, Convites WhatsApp & RBAC Multi-Tenant** | ✅ **100%** | `/admin/usuarios`, `AdminRoleGuard`, `AdminSidebar` adaptativa e `public.user_profiles` (`TASK-43`) |
| **11** | **Pastoral do Dízimo Alinhada ao Theòs & Transparência de Obras** | ✅ **100%** | `/dizimo`, `/admin/dizimo` ("Lançar no Theòs") e tabelas `tithe_registrations`, `tithe_transparency_items` e `tithe_faqs` ativas no Supabase (`TASK-03`, `TASK-26B`) |
