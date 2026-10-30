# 📋 Documento de Implementações Pendentes & Backlog Futuro

> **Documento Oficial de Governança de Escopo e Evolução (SSOT)**  
> **Status:** Atualizado e Auditado pelo Gerente de Projeto  
> **Última Atualização:** 29 de Outubro de 2026  
> **Referência:** Alinhado com [`PLANO_DE_ACAO_DETALHADO.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/PLANO_DE_ACAO_DETALHADO.md) e [`DIRETRIZ_PASTORAL_E_FINANCEIRA_DIZIMO.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/DIRETRIZ_PASTORAL_E_FINANCEIRA_DIZIMO.md)

Este documento distingue claramente os **novos módulos do Backlog Futuro (Pós-Fase 8 / Ciclo 2027)** dos itens que **já foram 100% implementados e homologados** ao longo das Fases 1 a 8 da Catedral do Sagrado Coração de Jesus.

---

## 🚀 PARTE I — BACKLOG ATIVO PARA IMPLEMENTAÇÃO FUTURA (PÓS-FASE 8)

### 📌 1. `[MainAdmin]` — Console Global do Proprietário / SaaS (`/superadmin`)

* **Status:** ⏳ **Pendente (Backlog Pós-Go-Live da Catedral)**
* **⏱️ Tempo Estimado de Execução:** `~1h30 a 2h` (dividido em 3 entregas modulares de `~35 min`).
* **Rota Prevista:** `/superadmin` (no mesmo projeto Next.js, com isolamento estrito de middleware e RBAC `superadmin`).
* **Escopo Funcional:**
  * Gestão de Tenants (todas as paróquias clientes da plataforma Ecclesiam).
  * Provisionamento e onboarding automatizado de novas paróquias (geração de slugs, identidade visual inicial e mapeamento de domínios customizados).
  * Gestão de planos, assinaturas e status de faturamento SaaS da plataforma.
  * Métricas agregadas de saúde de infraestrutura, volume de atendimentos pastorais e engajamento das comunidades (respeitando a neutralidade financeira perante o Theòs).

---

### 📌 2. Módulo Dedicado de Movimentos Paroquiais (ECC, EAC e EJC)

* **Status:** ⏳ **Pendente (Backlog Estrutural Pastoral)**
* **⏱️ Tempo Estimado de Execução:** `~1h30 a 2h` (Modelagem Supabase `~30 min` + Mini-sites públicos `~40 min` + Painel Admin `~40 min`).
* **Movimentos Contemplados:**
  * **ECC** (Encontro de Casais com Cristo)
  * **EAC** (Encontro de Adolescentes com Cristo)
  * **EJC** (Encontro de Jovens com Cristo)
* **Escopo no Portal Público (`/movimentos/[slug]`):**
  * Identificação, brasão/identidade, carisma espiritual e patrono de cada movimento.
  * Equipe Dirigente atual (Casal Coordenador / Jovens Coordenadores e Diretor Espiritual) com contato WhatsApp.
  * Calendário anual condensado (Encontros de 1ª, 2ª e 3ª etapas, pós-encontros, círculos e Santas Missas de entrega).
  * Ficha digital de pré-inscrição / manifestação de interesse com consentimento LGPD.
  * Galeria fotográfica dos encontros conectada ao Supabase Storage.
* **Escopo no Painel Administrativo (`/admin/movimentos`):**
  * Gestão das equipes dirigentes e mandatos, cronograma anual, fila de fichas de interesse (`Nova`, `Em Contato`, `Confirmada`) e publicação de comunicados.

---

### 📌 3. Área Privada do Fiel ("Meu Espaço Paroquial" — `/meu-espaco`)

* **Status:** ⏳ **Pendente (Backlog Fase 2027)**
* **Documento Detalhado:** [`ESCOPO_AREA_DO_FIEL.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/ESCOPO_AREA_DO_FIEL.md)
* **⏱️ Tempo Estimado de Execução:** `~2h` (dividido em 3 etapas de `~40 min`).
* **Escopo Funcional (Alinhado à Diretriz Canônica Theòs):**
  1. **Autenticação sem Senha (Passwordless):** Acesso simples via Código OTP de 6 dígitos ou Magic Link (ideal para fiéis idosos).
  2. **Meus Agendamentos & Protocolos da Secretaria:** Acompanhamento em tempo real de confissões/atendimentos com os 4 sacerdotes, solicitações de certidões e protocolos unificados de **Intenções de Missa (Púlpito A4)**.
  3. **Minha Comunidade (CEB Favorita):** Feed priorizado com horários de Santas Missas, Celebrações da Palavra, tríduos e mural de avisos da comunidade escolhida pelo fiel.
  4. **Vínculo Informativo com a Pastoral do Dízimo:** Exibição do status de acolhimento pastoral ("Sou do Sagrado") e atalho rápido para a chave PIX oficial da Mitra Diocesana *(sem intermediação financeira nem controle contábil de carnês, que permanecem exclusivos do sistema **Theòs**)*.

---

### 📌 4. Curadoria Externa em Estúdio/Alta Resolução dos Retratos dos Bispos Diocesanos

* **Status:** ⏳ **Aguardando Acervo Oficial da PASCOM / Chancelaria Diocesana**
* **⏱️ Tempo Estimado de Execução:** `~30 minutos` (após recebimento dos arquivos originais da Cúria).
* **Arquivos Envolvidos:** `public/images/pastores/*.webp`, [`BishopsAndPastorsGallery.tsx`](file:///c:/Users/Start/ecclesiam-app/components/historia/BishopsAndPastorsGallery.tsx) e tabela `public.parish_pastors_succession`.
* **Objetivo:** Substituir os retratos atuais (já funcionais em `.webp`) pelos retratos canônicos de estúdio em alta definição fornecidos pela Chancelaria Diocesana para Dom Geraldo Lyrio Rocha (✝ 2023), Dom Décio Sossai Zandonade, Dom Joaquim Wladimir Lopes Dias e Dom Lauro Sérgio Versiani Barbosa, com padronização 4:5 (`<= 70KB`).

---

### 📌 5. Blindagem Final de RLS Pré-Go-Live & Apontamento DNS (`TASK-12`)

* **Status:** ⏳ **Pré-Lançamento Oficial (Novembro de 2026)**
* **⏱️ Tempo Estimado de Execução:**
  * Hardening de RLS (transição de políticas `anon` de homologação para `authenticated` + RBAC estrito por `parish_id`): `~30 a 45 minutos`.
  * Apontamento DNS & Escudo Cloudflare (`catedraldecolatina.org.br` — Proxy Nuvem Laranja + SSL Full Strict): `~25 minutos` *(aguardando credenciais DNS da paróquia)*.

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
