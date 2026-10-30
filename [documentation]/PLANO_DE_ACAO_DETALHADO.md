# 🗺️ Plano de Ação Detalhado — Ecclesiam App & Catedral de Colatina

> **Documento Vivo de Controle de Tarefas e Próximos Passos**  
> **Fonte Oficial de Verdade:** [`[documentation]/planejamento/PLANO_DESENVOLVIMENTO_NATAL_2026.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/PLANO_DESENVOLVIMENTO_NATAL_2026.md)  
> **Atualização Contínua:** Mantido e escaneado pela skill `project_manager`

---

## 🟢 FASE 1: Go-Live do Portal Oficial da Catedral
* **Data Limite:** 29 de Novembro de 2026 (1º Domingo do Advento — Início do Novo Ano Litúrgico C)
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
* **Objetivo:** Ativação plena das 12 comunidades/comunidades com rotas GPS, histórico de fundadores e envolvimento dos coordenadores de CEBs.

### Tarefas Técnicas & Entregas:
- [x] **TASK-13:** Cadastro inicial das 12 comunidades e Grupos de Reflexão no banco Supabase e fallback em `lib/communities.ts`.
- [x] **TASK-14:** Mini-sites dinâmicos `/comunidades/[slug]` com botões de rota direta no Google Maps e Waze.
- [x] **TASK-15:** Painel de Gestão de Conteúdo das CEBs no `/admin/comunidades` (edição de história, fundadores e contatos dos coordenadores).
- [x] **TASK-16:** Gestão de Horários por Comunidade no `/admin/horarios` (filtro e cadastro de missas e celebrações da palavra específicas por comunidade).
- [x] **TASK-17:** Coleta e inserção de fotos oficiais das fachadas das 14 comunidades (CEBs) com a PASCOM e lideranças locais.
- [x] **TASK-18:** Galeria de Fotos das Comunidades (`public.galleries` conectada ao Supabase Storage para álbuns de padroeiros).
- [x] **TASK-19:** Roteiro da Capacitação 2: Lideranças das 12 CEBs e Equipe Litúrgica/PASCOM (4 horas presenciais na Catedral).

---

## 🔵 FASE 3: Secretaria On-line & Agendamentos com Padres
* **Data Limite:** 06 de Dezembro de 2026 (2º Domingo do Advento)
* **Objetivo:** Automatização de agendamentos de confissões sacramentais e formulários de inscrições de sacramentos sob arquitetura `/secretaria/...`.

### Tarefas Técnicas & Entregas:
- [x] **TASK-20:** Modelagem de Dados Supabase: criação da tabela `pastoral_appointments` (vínculo aos 4 padres, horários, slots e status).
- [x] **TASK-21:** Modelagem de Dados Supabase: criação da tabela `sacramental_registrations` (Batismo, Catequese, Noivos e Gestantes) com RLS e status.
- [x] **TASK-22:** Subpágina `/secretaria/agendamentos`: interface pública do fiel para seleção de sacerdote (4 padres), tipo de atendimento (confissão/escuta) e slots de horários.
- [x] **TASK-23:** Subpágina `/secretaria/sacramentos`: guia e formulários guiados de inscrição sacramental (Batismo, Crisma, Casamento) com checklist de documentos.
- [x] **TASK-24:** Painel Administrativo da Secretaria: rotas `/admin/secretaria` (sub-abas `/admin/agendamentos` e `/admin/inscricoes`) com aprovação rápida em 1 clique.
- [x] **TASK-25:** Notificações Transacionais: integração de e-mails (Resend) e WhatsApp para avisar a secretária e confirmar o fiel.

---

## 🌟 FASE 4: Subpáginas Institucionais, Solenidade do Natal & Consolidação Plena
* **Data Limite:** 25 de Dezembro de 2026 (Natividade do Senhor)
* **Objetivo:** Implantação das subpáginas institucionais (/agenda-liturgica, /dizimo, /historia, /noticias, /comunidades), grade de fim de ano, PWA e mensalidade SaaS.

### Tarefas Técnicas & Entregas:
- [x] **TASK-26A:** Subpágina `/agenda-liturgica`: Agenda Litúrgica da Catedral estilo Google Agenda (missas, celebrações da palavra, confissões, adoração) com calendário mensal, lista semanal e modal de sincronização. Redirecionamento 307 ativo a partir de `/horarios`.
- [x] **TASK-26B:** Subpágina `/dizimo`: Portal «Sou do Sagrado» com cadastro de novo dizimista, transparência de obras da Catedral e QR Code PIX dinâmico.
- [x] **TASK-26C:** Subpágina `/historia`: Linha do tempo histórica da Catedral de Colatina e Galeria dos Párocos da Sucessão Apostólica.
- [x] **TASK-26C-AUDIT:** Auditoria & Refinamento da História & Memória:
  1. *Correção de Responsividade Mobile:* Garantir exibição impecável de todos os cards no smartphone (360px–414px) sem cortes ou overflow.
  2. *Galeria Fotográfica dos Bispos:* Obtenção e inserção das fotos históricas de Dom Geraldo Lyrio, Dom Décio Zandonade, Dom Joaquim Wladimir e Dom Lauro Versiani.
  3. *Badge Canônico "In Memoriam":* Campo no Supabase e destaque visual solene com cruz e ano de falecimento para sacerdotes e bispos falecidos.
  4. *Censo Histórico Profundo de Párocos:* Pesquisa arquivística para listar integralmente todos os párocos, curas e vigários que a Catedral já teve desde 1928.
- [x] **TASK-26D:** Subpágina `/noticias`: Portal completo de notícias e avisos da PASCOM com leitor individual `/noticias/[slug]` e filtros por categoria.
- [x] **TASK-26E:** Subpágina `/comunidades`: Diretório geral e mapa das 14 comunidades (CEBs) com endereços, padroeiros e rotas GPS (Google Maps e Waze).
- [x] **TASK-27:** Módulo Litúrgico de Fim de Ano: destaque da Novena de Natal, Missa da Vigília (Missa do Galo) e celebrações de Ano Novo na Home.
- [x] **TASK-28:** Cartas Pastorais de Natal do Pároco Pe. Irineu e do Bispo Dom Lauro em destaque na Coluna Pastoral.
- [x] **TASK-29:** Campanha de Instalação do PWA: QR Code impresso nos bancos da Catedral para os fiéis salvarem o ícone no celular.
- [x] **TASK-30:** Auditoria Final de Performance e Segurança (Lighthouse, logs do Supabase e Cloudflare).
- [x] **TASK-31:** Emissão do Termo de Homologação Piloto e início do ciclo de mensalidade SaaS (R$ 390 - 490/mês).

---

## 🟣 FASE 5: Inteligência Paroquial & Assistente IA (RAG Interno)
* **Data Limite:** Janeiro de 2027 (Pós-Go Live de Natal / Consolidação Tecnológica 2027)
* **Objetivo:** Assistente IA interno restrito aos dados da paróquia no `/admin` (tabelas do banco + PDFs de diretrizes e normas) via Google Gemini e Supabase pgvector.
* **Documento de Especificação Técnica:** [`[documentation]/planejamento/ESPECIFICACAO_TECNICA_ASSISTENTE_IA_RAG.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/ESPECIFICACAO_TECNICA_ASSISTENTE_IA_RAG.md)

### Tarefas Técnicas & Entregas:
- [x] **TASK-32:** Infraestrutura Supabase pgvector & Schema RAG (extensão `vector`, tabelas `parish_knowledge_documents` e `parish_knowledge_embeddings`, índice HNSW, RLS multi-tenant estrito por `parish_id` e função RPC `match_parish_knowledge`).
- [x] **TASK-33:** Pipeline de Ingestão Híbrida & Embeddings (sincronização vetorial das tabelas relacionais de horários, 12 CEBs, clero, dízimo e agendamentos + upload/parsing de PDFs diocesanos com Google `text-embedding-004`).
- [x] **TASK-34:** Rota de API Copilot & RAG com Google Gemini (endpoint `/api/admin/ai-assistant` com busca semântica, streaming com Gemini 2.5 Flash, prompts canônicos de proteção pastoral, citação de fontes e gerador de rascunhos de avisos).
- [x] **TASK-35:** Interface no Painel Administrativo (subpágina dedicada `/admin/assistente-ia` com gestão de documentos, status de vetorização e histórico + Drawer/Widget Flutuante rápido em todas as telas do `/admin`).

---

## 🎨 FASE 6: Hub de Marca, Manual com IA & Moodboard Inteligente
* **Data Limite:** Fevereiro de 2027 (Personalização Avançada & Onboarding Paroquial)
* **Objetivo:** Unificar as telas de aparência e identidade no `/admin/marca`, processar upload de manuais com extração multimodal via IA, oferecer 5 presets canônicos do Ecclesiam App, moodboard interativo e Live Theming no portal do fiel.
* **Documento de Especificação Técnica:** [`[documentation]/planejamento/ESPECIFICACAO_PAINEL_MARCA_MOODBOARD.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/ESPECIFICACAO_PAINEL_MARCA_MOODBOARD.md)

### Tarefas Técnicas & Entregas:
- [x] **TASK-36:** Modelagem Supabase & Storage de Marca: criação do bucket `brand_assets`, colunas `brand_identity` e `brand_manual_url` na tabela `public.parishes` com políticas RLS.
- [x] **TASK-37:** Endpoint de Extração Multimodal do Manual via Gemini: rota `/api/admin/brand/extract` para análise de PDF/imagens de manuais e geração do JSON estruturado de cores e tipografias.
- [x] **TASK-38:** Componentes Modulares do Moodboard & Simulador Live Preview: criação de `BrandColorPaletteEditor`, `BrandPresetsSelector`, `BrandLogoUploader` e `BrandLivePreviewMockup`.
- [x] **TASK-39:** Interface Centralizada `/admin/marca` & Navegação: unificação das antigas telas de aparência em um hub moderno com abas, salvamento reativo e atualização do menu lateral.
- [x] **TASK-40:** Live Theming no Portal Público & Ficha de Impressão da PASCOM: injeção dinâmica de CSS variables no `layout.tsx` e tela de impressão A4 em `/admin/marca/imprimir-guia`.
---

## 🏛️ FASE 7: Expansão das Comunidades, Gestão de Acessos & Secretaria On-line
* **Data Limite:** Março de 2027 (Autonomia Paroquial, Governança & Eficiência Pastoral)
* **Objetivo:** Definir e consolidar as Landing Pages completas das 12 CEBs, construir o dashboard administrativo de comunidades com upload de mídias e CPC, estruturar a gestão de usuários com RBAC e auditar/expandir os processos digitais da secretaria paroquial.
* **Documento de Especificação Técnica:** [`[documentation]/planejamento/IMPLEMENTACOES_PENDENTES.md`](file:///c:/Users/Start/ecclesiam-app/[documentation]/planejamento/IMPLEMENTACOES_PENDENTES.md)

### Tarefas Técnicas & Entregas:
- [x] **TASK-41:** Definir Escopo Completo das LPs das Comunidades (identidade visual da CEB, lideranças do CPC, mural de avisos próprio, regras de dízimo local, calendário das festas e SEO estruturado Schema.org).
- [x] **TASK-41B:** Refinamento Interativo, Acessibilidade & Liturgia das LPs das Comunidades:
  1. *Cards Bento Clicáveis:* Tornar todos os cards da grade Bento clicáveis com abertura de modais solenes de detalhamento pastoral.
  2. *Acessibilidade para Idosos:* Controle de redimensionamento de fonte (A- / A / A+) persistido no dispositivo, com layout e touch targets responsivos e sem quebra de UX.
  3. *Liturgia Limpa no Card 1:* Remoção cirúrgica do botão de WhatsApp do Card 1 (`CommunityLiturgyCard.tsx`).
  4. *Faixa Litúrgica Sutil:* Adição de faixa horizontal discreta abaixo do menu principal exibindo a cor do tempo litúrgico e a descrição oficial do dia.
- [x] **TASK-42:** Construir Dashboard da LP das Comunidades no `/admin/comunidades` (upload e recorte de fotos de fachada/altar no Storage, gestão de membros do CPC, mural de avisos da CEB e vínculo de pastorais).
- [x] **TASK-43:** Auditar Ambiente & Implementar Gestão de Usuários e Permissões (tela `/admin/usuarios`, modelagem `user_profiles`, controle de acesso RBAC por perfil paroquial: Pároco, Vigário, Secretaria, PASCOM, Coordenador de CEB, e proteção de rotas).
- [x] **TASK-44:** Auditar & Expandir Funções da Secretaria On-line (módulo de intenções de Santa Missa com geração de Folha Litúrgica para o Púlpito A4, solicitação/emissão de certidões, limites automáticos de vagas e auditoria LGPD):
  1. *Substituição Litúrgica Canônica:* Mudança do termo `Sufrágio da Alma` para **`Pela(s) Alma(s) de:`** na interface pública e na Folha Litúrgica para o Púlpito (A4).
  2. *Lógica Multi-Categorias com Limite:* Solicitante pode adicionar intenções em múltiplas categorias simultaneamente no mesmo pedido da Santa Missa, com limite de até 5 nomes por categoria e linhas individuais (`+ Adicionar outro nome`).
  3. *Privacidade & Sigilo Litúrgico:* Dados do solicitante 100% opcionais e checkbox explícito para manter Sigilo no Púlpito (não proclamar nem divulgar nome pessoal).
  4. *Protocolo Unificado:* Agrupamento de todas as categorias e nomes sob um único código `protocol_code` para conferência na secretaria e compartilhamento consolidado via WhatsApp.
---

## 🕊️ FASE 8: Grandes Festas, Solenidades & Programações Litúrgicas Especiais
* **Data Limite:** Abril de 2027 (Semana Santa, Festas de Padroeiros & Solenidades da Catedral e CEBs)
* **Objetivo:** Criar o sistema completo de Landing Pages Dinâmicas de Festas (/programacao/[slug]) alimentadas por um Construtor Visual no Painel Administrativo (/admin/programacao), com banner de contagem regressiva na Home, alertas na página de horários, compartilhamento rápido no WhatsApp e integração direta com os mini-sites das 12 CEBs.
* **Documento de Especificação Técnica:** [`[documentation]/planejamento/ESPECIFICACAO_PAGINA_FESTAS_PROGRAMACOES.md`](file:///c:/Users/Start/ecclesiam-app/[documentation]/planejamento/ESPECIFICACAO_PAGINA_FESTAS_PROGRAMACOES.md)

### Tarefas Técnicas & Entregas:
- [x] **TASK-45:** Modelagem Supabase & Storage: criação das tabelas `parish_special_events`, `parish_event_days`, bucket `event_assets` e políticas RLS seguras.
- [x] **TASK-46:** Dashboard Administrativo (`/admin/programacao`): construtor visual de programação dia a dia com upload de cartaz e prévia ao vivo.
- [x] **TASK-47:** Landing Page Pública da Festa (`/programacao/[slug]`): hero monumental, linha do tempo interativa por abas com swipe, rota GPS e download do cartaz oficial.
- [x] **TASK-48:** Integração de Banners & Divulgação: banner de contagem regressiva na Home, destaque na LP da CEB correspondente e alerta em `/horarios`.

