# 🗺️ Plano de Ação Detalhado — Ecclesiam App & Catedral de Colatina

> **Documento Vivo de Controle de Tarefas e Próximos Passos**  
> **Fonte Oficial de Verdade:** [`[documentation]/planejamento/PLANO_DESENVOLVIMENTO_NATAL_2026.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/PLANO_DESENVOLVIMENTO_NATAL_2026.md)  
> **Atualização Contínua:** Mantido e escaneado pela skill `project_manager`

---

## 🟢 FASE 1: Go-Live do Portal Oficial da Matriz
* **Data Limite:** 01 de Novembro de 2026 (Solenidade de Todos os Santos)
* **Objetivo:** Portal oficial no ar no domínio definitivo, clero completo, missas, doações PIX, folhetos e mensagens pastorais.

### Tarefas Técnicas & Entregas:
- [x] **TASK-01:** Design System Pe. Alex Nogueira aplicado na Home (paleta pergaminho, tipografia Sora/Suez One, banner contínuo e card de missas de hoje).
- [x] **TASK-02:** Cadastro e renderização do Clero Oficial com 4 padres (Pe. Irineu, Pe. Adilson, Pe. Deivid, Pe. Ernandes) na Secretaria e no banco.
- [x] **TASK-03:** Central de Conscientização Pastoral do Dízimo (Theòs) + QR Code de Doações e Ofertas espontâneas via PIX com cópia da chave.
- [x] **TASK-04:** Módulo de Mensagens Pastorais («Palavra do Pároco/Bispo»): tabela Supabase, rota `/mensagens`, leitor e destaque solene na Home.
- [x] **TASK-05:** Módulo de Folhetos Litúrgicos («Sou do Sagrado Missa»): painel `/admin/folhetos`, bucket Supabase Storage `booklets` e download na Home.
- [x] **TASK-06:** Gestão de Prazos: implementação da skill `project_health_timeline` com auditoria contínua dos 4 marcos dominicais.
- [x] **TASK-07:** CRUD completo de Mensagens Pastorais em `/admin/mensagens` com modal `MessageFormModal` e card `MessageCard` integrados ao Supabase.
- [x] **TASK-08:** Motor Dinâmico de Liturgia Diária Oficial (CNBB): rota `/api/liturgia` com cache resiliente e cores canônicas dinâmicas.
- [x] **TASK-09:** Guia & Roteiro de Treinamento da Secretária Paroquial (4 horas presenciais para uso do painel `/admin`).
- [x] **TASK-10:** Auditoria de Segurança RLS no Supabase (validação de isolamento multi-tenant por `parish_id` e políticas de escrita).
- [x] **TASK-11:** Auditoria de Dependências (`npm audit`) e validação de variáveis de ambiente de produção na Vercel.
- [ ] **TASK-12:** Apontamento de DNS e Escudo Cloudflare (quando acesso for liberado pela paróquia: Proxy Laranja, SSL Full Strict e registros A/CNAME).

---

## 🟡 FASE 2: 12 Comunidades & Folhetos Litúrgicos
* **Data Limite:** 22 de Novembro de 2026 (Solenidade de Cristo Rei)
* **Objetivo:** Ativação plena das 12 comunidades/capelas com rotas GPS, histórico de fundadores e envolvimento dos coordenadores de CEBs.

### Tarefas Técnicas & Entregas:
- [x] **TASK-13:** Cadastro inicial das 12 comunidades e Grupos de Reflexão no banco Supabase e fallback em `lib/communities.ts`.
- [x] **TASK-14:** Mini-sites dinâmicos `/comunidades/[slug]` com botões de rota direta no Google Maps e Waze.
- [ ] **TASK-15:** Painel de Gestão de Conteúdo das CEBs no `/admin/comunidades` (edição de história, fundadores e contatos dos coordenadores).
- [ ] **TASK-16:** Gestão de Horários por Comunidade no `/admin/horarios` (filtro e cadastro de missas e celebrações da palavra específicas por capela).
- [ ] **TASK-17:** Coleta e inserção de fotos oficiais das fachadas das 12 capelas com a PASCOM e lideranças locais.
- [ ] **TASK-18:** Galeria de Fotos das Comunidades (`public.galleries` conectada ao Supabase Storage para álbuns de padroeiros).
- [ ] **TASK-19:** Roteiro da Capacitação 2: Lideranças das 12 CEBs e Equipe Litúrgica/PASCOM (4 horas presenciais na Catedral).

---

## 🔵 FASE 3: Secretaria On-line & Agendamentos com Padres
* **Data Limite:** 06 de Dezembro de 2026 (2º Domingo do Advento)
* **Objetivo:** Automatização de agendamentos de confissões sacramentais e formulários de inscrições de sacramentos.

### Tarefas Técnicas & Entregas:
- [ ] **TASK-20:** Modelagem de Dados Supabase: criação da tabela `pastoral_appointments` (vínculo aos 4 padres, horários, slots e status).
- [ ] **TASK-21:** Modelagem de Dados Supabase: criação da tabela `sacramental_registrations` (Batismo, Catequese, Noivos e Gestantes).
- [ ] **TASK-22:** Interface Pública do Fiel: tela `/agendamentos` com seleção de sacerdote, tipo de atendimento (confissão/escuta) e WhatsApp.
- [ ] **TASK-23:** Interface Pública do Fiel: formulários guiados de inscrição sacramental com checklist de documentos obrigatórios.
- [ ] **TASK-24:** Painel Administrativo da Secretaria: rotas `/admin/agendamentos` e `/admin/inscricoes` com aprovação rápida em 1 clique.
- [ ] **TASK-25:** Integração de E-mails Transacionais (Resend) para avisar a secretária paroquial a cada nova solicitação recebida.

---

## 🌟 FASE 4: Solenidade do Natal & Consolidação Plena
* **Data Limite:** 25 de Dezembro de 2026 (Natividade do Senhor)
* **Objetivo:** Grade especial de fim de ano, promoção do PWA e formalização do plano de mensalidade SaaS.

### Tarefas Técnicas & Entregas:
- [ ] **TASK-26:** Módulo de Fim de Ano: destaque da Novena de Natal, Missa da Vigília (Missa do Galo) e celebrações de Ano Novo na Home.
- [ ] **TASK-27:** Cartas Pastorais de Natal do Pároco Pe. Irineu e do Bispo Dom Lauro em destaque na Coluna Pastoral.
- [ ] **TASK-28:** Campanha de Instalação do PWA: QR Code impresso nos bancos da Catedral para os fiéis salvarem o ícone no celular.
- [ ] **TASK-29:** Auditoria Final de Performance e Segurança (Lighthouse, logs do Supabase e Cloudflare).
- [ ] **TASK-30:** Emissão do Termo de Homologação Piloto e início do ciclo de mensalidade SaaS (R$ 390 - 490/mês).
