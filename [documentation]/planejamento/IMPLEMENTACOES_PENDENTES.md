# 📋 Documento de Implementações Pendentes (Backlog Futuro)

> **Documento Oficial de Registro de Recursos Futuros**  
> **Status:** Registrado para Implementação Futura  
> **Data de Atualização:** Setembro de 2026  
> **Referência:** Decisões Arquiteturais alinhadas via `/grill-me`  

Este documento reúne todas as funcionalidades e estruturas aprovadas conceitualmente que serão implementadas em etapas subsequentes, após a validação e consolidação do núcleo principal da Catedral de Colatina.

---

## 📌 1. [MainAdmin] — Console Global do Proprietário / SaaS

* **Quando implementar:** Logo após a entrega, homologação e go-live do ambiente completo (front-end e back-end) da Catedral de Colatina.
* **Rota Prevista:** `/superadmin` (no mesmo projeto Next.js, com isolamento estrito de middleware).
* **Escopo Funcional:**
  * Gestão de Tenants (todas as paróquias clientes da plataforma Ecclesiam).
  * Provisionamento e onboarding automatizado de novas paróquias (geração de slugs, configuração de domínios customizados).
  * Gestão de planos, assinaturas e status de pagamentos SaaS.
  * Métricas agregadas de uso, transações de dízimo e integridade da infraestrutura.
  * Autenticação com permissão `superadmin` no Supabase Auth.

---

## 📌 2. Mini-Sites Exclusivos das CEBs (`/comunidades/[slug]`)

* **Quando implementar:** Após a consolidação do cadastro de CEBs no painel administrativo.
* **Rota Prevista:** `/comunidades/[slug]` (ex: `/comunidades/perpetuo-socorro`, `/comunidades/santa-luzia`).
* **Escopo Funcional:**
  * **Página individual dinâmica** para cada uma das 11 comunidades da paróquia.
  * **Identificação e Padroeiro:** Foto de Fachada da Comunidade, histórico da comunidade, padroeiro e rota GPS integrada (Google Maps).
  * **Horários Exclusivos:** Grade apenas com as missas e celebrações da palavra daquela comunidade específica.
  * **Calendário Mensal da Comunidade:** Missas, novenas, tríduos de padroeiro e encontros de movimentos locais (EAC, ECC, Terço).
  * **História da CEB:** Ano de fundação (ex: 1956, 1962, 1986), pioneiros e trajetória pastoral.
  * **Galeria de Fotos Própria:** Álbuns de festividades daquela comunidade.
  * **Gestão Híbrida:** Edição total pela Secretaria da Catedral, com permissão futura para os coordenadores de comunidade alimentarem suas páginas.

---

## 📌 3. Agendamento Online: Confissões e Atendimentos Paroquiais

* **Quando implementar:** Na fase de automação de processos da secretaria paroquial.
* **Escopo Funcional:**
  * **Visão Multissacerdotal:** Exibição clara na tela dos horários e dias de disponibilidade de **todos os padres** (Pe. Irineu, Pe. Deivid, Pe. Ernandes).
  * **Controle de Calendário pela Secretaria:** A secretaria paroquial libera ou bloqueia datas e slots no painel `/admin/agendamentos` conforme a demanda e a escala dos padres.
  * **Fluxo de Solicitação:**
    1. O paroquiano escolhe o sacerdote, o tipo de atendimento (confissão ou conversa pastoral) e o horário vago.
    2. Informa seu Nome completo e WhatsApp.
    3. A solicitação entra com status `pendente` no painel.
    4. A secretaria aprova e o sistema envia a confirmação diretamente no WhatsApp do fiel.

---

## 📌 4. Repositório de Folhetos "Sou do Sagrado Missa" com Calendário

* **Quando implementar:** Na fase de acervo editorial litúrgico.
* **Escopo Funcional:**
  * Ambiente organizado e limpo para download dos folhetos impressos semanais em formato PDF.
  * Busca por calendário e domingos litúrgicos (histórico de semanas anteriores e próxima celebração).
  * Painel administrativo para upload rápido dos arquivos PDF pela equipe litúrgica.

---

## 📌 5. Álbuns de Galeria de Fotos e Mídias

* **Quando implementar:** Na fase de enriquecimento de mídia pastoral.
* **Escopo Funcional:**
  * Tabela `public.galleries` conectada ao Supabase Storage.
  * Álbuns categorizados por solenidade (Festa do Sagrado Coração, Corpus Christi, Crisma, Padroeiros).
  * Visualizador em lightbox responsivo para fotos em alta resolução.

---

## 📌 6. Área Privada do Fiel ("Meu Espaço Paroquial")

* **Documento Detalhado de Especificação:** [`[documentation]/planejamento/ESCOPO_AREA_DO_FIEL.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/ESCOPO_AREA_DO_FIEL.md)
* **Quando implementar:** Na fase de engajamento do membro paroquiano.
* **Rota Prevista:** `/meu-espaco` ou `/fiel` (com layout mobile-first).
* **Escopo Funcional Detalhado:**
  1. **Autenticação sem Senha (Passwordless):**
     * Acesso rápido via **Código OTP de 6 dígitos** ou **Magic Link** enviado para o WhatsApp ou E-mail.
     * Elimina atritos de esquecimento de senhas para fiéis idosos ou com pouca intimidade tecnológica.
  2. **Carteirinha Digital do Dizimista & Histórico de Partilha:**
     * Visualização do cartão de membro com brasão paroquial e número de dizimista oficial.
     * Histórico de contribuições de Dízimo e Ofertas realizadas via PIX com comprovantes pastorais.
     * Botão de doação com 1 clique pré-vinculada ao CPF do fiel.
  3. **Meus Agendamentos com os Padres:**
     * Acompanhamento de confissões sacramentais e conversas pastorais marcadas com Pe. Irineu, Pe. Deivid ou Pe. Ernandes.
     * Status em tempo real (`Pendente`, `Confirmado`) e cancelamento com aviso prévio.
  4. **Minha Comunidade (CEB Favorita):**
     * Seleção da comunidade que o fiel frequenta (Matriz, Perpétuo Socorro, Santa Luzia, etc.).
     * Feed priorizado com horários de missas, tríduos e avisos pastorais daquela CEB.
  5. **Pedidos de Intenções de Santa Missa:**
     * Envio direto de pedidos de oração (Saúde, Falecidos, Ação de Graças) para as próximas missas do altar.
* **Estrutura Relacional no Banco de Dados:**
  * `public.parishioner_profiles`: Perfil do membro com chave estrangeira em `auth.users(id)` e `parishes(id)`.
  * `public.pastoral_appointments`: Agendamentos de confissão com `clergy_id` e status de aprovação.
  * `public.mass_intentions`: Pedidos de oração com `mass_date` e vínculo à celebração paroquial.

---

## 📌 7. Módulo Dedicado de Movimentos Paroquiais (ECC, EAC, EJC) — Mini-Sites & Gestão

* **Quando implementar:** Na fase de estruturação pastoral dos grandes movimentos da paróquia.
* **Movimentos Contemplados:**
  * **ECC** (Encontro de Casais com Cristo).
  * **EAC** (Encontro de Adolescentes com Cristo).
  * **EJC** (Encontro de Jovens com Cristo).

### 7.1 No Portal Público da Paróquia: Mini-Sites dos Movimentos (`/movimentos/[slug]`)
Assim como as CEBs, cada movimento contará com um **mini-site próprio com informações condensadas**:
* **Identificação e Carisma:** Banner próprio, brasão/identidade do movimento, explicação do carisma e objetivo espiritual (famílias, adolescentes e jovens).
* **Equipe Dirigente Atual:** Nome do Casal Coordenador Geral (no ECC) ou Jovens Coordenadores (EAC/EJC), Diretor Espiritual (Padre Orientador) e contatos WhatsApp.
* **Calendário Anual Condensado:**
  * Data do Encontro Anual principal (1ª, 2ª ou 3ª Etapa).
  * Cronograma de pós-encontros, círculos de estudo, retiros e missas da entrega.
* **Ficha de Interesse / Pré-Inscrição:** Formulário onde casais ou jovens podem manifestar interesse em vivenciar o próximo encontro.
* **Galeria de Fotos dos Encontros:** Fotos oficiais dos encerramentos, equipes de trabalho e momentos marcantes.

### 7.2 No Painel Administrativo da Paróquia (`/admin/movimentos`)
* **Área Exclusiva no Menu Lateral:** Gestão centralizada para a secretaria e casais/jovens dirigentes do movimento.
* **Gerenciamento da Equipe Dirigente:** Atualização fácil de nomes, mandatos, telefones e funções dos coordenadores de equipes.
* **Gestão de Encontros e Calendário:** Cadastro das datas do cronograma anual do movimento.
* **Fila de Inscrições:** Painel de recebimento de fichas de casais e jovens interessados, com status (`Nova`, `Em Contato`, `Confirmado`) e exportação para as equipes de visitação e recepção.
* **Galeria e Comunicados do Movimento:** Upload de fotos dos retiros e publicação de avisos direcionados aos encontristas.

---

## 📌 8. Calendário Litúrgico Inteligente & Identidade Cromática Dinâmica

* **Documento Detalhado de Especificação:** [`[documentation]/planejamento/ESCOPO_CALENDARIO_LITURGICO.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/ESCOPO_CALENDARIO_LITURGICO.md)
* **Quando implementar:** Na fase de enriquecimento da identidade litúrgica da plataforma.
* **Escopo Funcional:**
  1. **Resposta Cromática Automática e Sutil:**
     * Cores canônicas da Igreja Católica refletidas de modo refinado (sem quebrar o tema neutro escuro): Verde (Tempo Comum), Roxo (Quaresma e Advento), Vermelho (Santos Mártires, Pentecostes, Ramos) e Branco/Dourado (Solenidades e Santos do Senhor e da Virgem Maria).
  2. **No Painel Administrativo (`/admin`):**
     * **Sidebar com Acentos Elegantes:** Indicador de borda/glow com a cor litúrgica do dia e badge de identificação (ex: `Tempo Comum • 26ª Semana`).
     * **Tela de Gestão Litúrgica (`/admin/calendario`):** Visualização mensal em grade, com modal para cadastro de festas de Padroeiros, Novenas e Tríduos da Catedral e das CEBs, além de override manual de cor litúrgica para missas pontuais.
  3. **No Portal Público do Fiel (Home & CEBs):**
     * **Faixa Litúrgica Rica:** Localizada logo abaixo dos banners principais, exibindo a cor do dia, a celebração e a leitura do Evangelho com botão para expandir a Liturgia Diária completa.
     * **Integração com as CEBs:** Destaque para as festas e padroeiros de cada comunidade na Home da Catedral e nas respectivas páginas das CEBs.
  4. **Arquitetura (Motor Híbrido Resiliente):**
     * Cálculo canônico oficial do Vaticano/CNBB sincronizado em tabelas do Supabase (`liturgical_calendar`, `liturgical_readings`, `parish_liturgical_events`), garantindo 100% de disponibilidade offline/cache e alta performance.

---

## 📌 9. Auditoria & Refinamento da Memória & História (`/historia` e `/admin/historia`)

* **Prioridade:** Imediata (Próxima Sessão de Desenvolvimento)
* **Origem:** Solicitação do Desenvolvedor (15/10/2026)
* **Escopo Detalhado da Auditoria:**
  1. **Auditoria de Responsividade Mobile Extrema:**
     * Investigar e solucionar o motivo de alguns cards da linha do tempo ou da galeria de pastores/bispos não estarem visíveis ou renderizando truncados em smartphones (360px a 414px).
     * Garantir touch targets >= 44px e zero rolagem horizontal acidental (`overflow-x-hidden`).
  2. **Galeria Fotográfica Oficial dos Bispos Diocesanos:**
     * Coletar e padronizar fotos oficiais para os 4 bispos diocesanos da história de Colatina:
       * Dom Geraldo Lyrio Rocha (1º Bispo Diocesano)
       * Dom Décio Sossai Zandonade, SDB (2º Bispo Diocesano)
       * Dom Joaquim Wladimir Lopes Dias (3º Bispo Diocesano)
       * Dom Lauro Sérgio Versiani Barbosa (4º Bispo Diocesano - Atual)
     * Compactar em WebP com o novo sistema de corte e associar no banco Supabase e nos fallbacks.
  3. **Sistema Canônico "In Memoriam" para Sacerdotes e Bispos Falecidos:**
     * Adicionar campos canônicos no banco (`is_deceased: boolean` e `deceased_year: text/integer`).
     * Exibição de badge solene de respeito eterno: cruz latina (`✝`), texto *"In Memoriam"* e ano de falecimento (ex: *Dom Geraldo Lyrio Rocha ✝ 2023*, *Monsenhor Rubens Duque ✝*).
     * Interface de toggle no `/admin/historia` (PastorModal) para marcar ministros falecidos.
  4. **Censo Histórico Profundo de Todos os Párocos da Catedral (1928 – 2026):**
     * Conduzir varredura detalhada na web, acervos diocesanos de Colatina e registros paroquiais para resgatar todos os párocos, vigários e curas que serviram a Matriz Sagrado Coração de Jesus desde a fundação em 1928.

---

## 📌 10. Curadoria Visual & Tratamento em Alta Resolução dos Retratos dos Bispos Diocesanos

* **Prioridade:** Média / Refinamento Estético & Memória Sacra
* **Origem:** Solicitação do Desenvolvedor (19/10/2026)
* **Páginas e Componentes Afetados:**
  * [`app/historia/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/historia/page.tsx)
  * [`components/historia/BishopsAndPastorsGallery.tsx`](file:///c:/Users/Start/ecclesiam-app/components/historia/BishopsAndPastorsGallery.tsx)
  * [`lib/history.ts`](file:///c:/Users/Start/ecclesiam-app/lib/history.ts)
* **Diagnóstico Atual:**
  Os retratos atuais dos 4 Bispos Diocesanos de Colatina (`dom-geraldo-lyrio-rocha.webp`, `dom-decio-zandonade.webp`, `dom-joaquim-wladimir.webp` e `dom-lauro-versiani.webp`) foram obtidos a partir de acervos públicos e coberturas jornalísticas. Embora funcionais, apresentam diferenças perceptíveis de nitidez, ruído de compressão original e iluminação de estúdio heterogênea.
* **Escopo de Execução & Critérios de Aceitação:**
  1. **Coleta de Retratos Oficiais em Alta Definição:**
     * Obter junto à Chancelaria / PASCOM da Diocese de Colatina os arquivos originais em alta resolução dos retratos canônicos:
       * **Dom Geraldo Lyrio Rocha** (1º Bispo Diocesano: 1990–2002 ✝)
       * **Dom Décio Sossai Zandonade, SDB** (2º Bispo Diocesano: 2003–2014)
       * **Dom Joaquim Wladimir Lopes Dias** (3º Bispo Diocesano: 2015–2021)
       * **Dom Lauro Sérgio Versiani Barbosa** (4º Bispo Diocesano: 2022–atual)
  2. **Tratamento & Restauro Digital:**
     * Limpeza de ruído e artefatos, correção de temperatura de cor e nitidez facial.
     * Enquadramento simétrico unificado (escala proporcional de cabeça, solideo/barrete e cruz peitoral alinhados na mesma altura em todos os 4 quadros).
  3. **Otimização & Compressão WebP:**
     * Exportação em `.webp` de alto rendimento (dimensões recomendadas: 800x1000px, aspect-ratio 4:5, peso <= 70KB por imagem).
     * Substituição em `public/images/pastores/` e atualização no bucket de armazenamento Supabase Storage.
  4. **Atualização da Base de Dados & Fallback:**
     * Atualização dos registros na tabela `parish_pastors_succession` e sincronização no fallback de `lib/history.ts`.
     * Validação visual e de carregamento rápido em dispositivos móveis (360px a 414px) e monitores de alta densidade (Retina).
---

## 📌 11. [Pendência 01] — Definir Escopo das Landing Pages (LPs) das Comunidades

* **Status:** ✅ **Concluído (100%)** — TASK-41 Finalizada
* **Documento Oficial de Especificação:** [`[documentation]/planejamento/ESPECIFICACAO_TECNICA_LP_COMUNIDADES.md`](file:///c:/Users/Start/ecclesiam-app/[documentation]/planejamento/ESPECIFICACAO_TECNICA_LP_COMUNIDADES.md)
* **Rotas Envolvidas:**
  * Diretório Geral: [`app/comunidades/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/comunidades/page.tsx)
  * LP Dinâmica da Comunidade: [`app/comunidades/[slug]/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/comunidades/%5Bslug%5D/page.tsx)
  * Biblioteca de Dados: [`lib/communities.ts`](file:///c:/Users/Start/ecclesiam-app/lib/communities.ts)
  * Componentes Modulares:
    * [`components/comunidades/CommunityJsonLd.tsx`](file:///c:/Users/Start/ecclesiam-app/components/comunidades/CommunityJsonLd.tsx) (Schema.org CatholicChurch)
    * [`components/comunidades/CommunityCPCSection.tsx`](file:///c:/Users/Start/ecclesiam-app/components/comunidades/CommunityCPCSection.tsx) (Conselho Pastoral Comunitário)
    * [`components/comunidades/CommunityNoticesSection.tsx`](file:///c:/Users/Start/ecclesiam-app/components/comunidades/CommunityNoticesSection.tsx) (Mural de Avisos da Comunidade)
    * [`components/comunidades/CommunityDizimoSection.tsx`](file:///c:/Users/Start/ecclesiam-app/components/comunidades/CommunityDizimoSection.tsx) (Dízimo e Partilha Local)
    * [`components/comunidades/CommunityPastoralGroupsSection.tsx`](file:///c:/Users/Start/ecclesiam-app/components/comunidades/CommunityPastoralGroupsSection.tsx) (Pastorais e Círculos)
* **🔍 Entrega Consolidada:**
  1. **Especificação Técnica Canônica Aprovada:** 6 seções canônicas mapeadas com diretrizes da Diocese de Colatina e CNBB.
  2. **Estrutura de Tipos e Mock Enriquecido:** Modelagem `CommunityLeader`, `CommunityNotice` e `CommunityPastoralGroup` integrada em `types/index.ts` e alimentada nas comunidades piloto em `lib/communities.ts`.
  3. **SEO Estruturado Ativo:** Injeção de dados Schema.org JSON-LD (`CatholicChurch`) para indexação e busca nos bairros.
  4. **Conformidade Anti-Monólito e Mobile-First:** Subcomponentes desacoplados com touch targets >= 44px e layout responsivo.

---

## 📌 12. [Pendência 02] — Construir Dashboard da LP das Comunidades

* **Prioridade:** Média-Alta / Autonomia Pastoral
* **Origem:** Solicitação do Desenvolvedor (22/10/2026)
* **Dependência:** Conclusão do Escopo da LP das Comunidades (Pendência 11)
* **Rotas Envolvidas:**
  * Painel Admin: [`app/admin/comunidades/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/admin/comunidades/page.tsx)
  * Componentes: [`components/admin/comunidades/`](file:///c:/Users/Start/ecclesiam-app/components/admin/comunidades/)
* **🔍 Análise de Implementação Atual (Diagnóstico do Código):**
  * **Status Atual:** **Parcialmente Implementado (~40%)**.
  * **O que JÁ ESTÁ implementado:**
    1. **Painel Base Operacional:** Rota `/admin/comunidades` com listagem em cards, busca textual e toggle de ativação/desativação (`is_active`).
    2. **Modal de Cadastro/Edição:** `CommunityFormModal.tsx` permite editar campos básicos (nome, padroeiro, data da festa, endereço, bairro, coordenadas GPS, ano de fundação e histórico).
  * **O que FALTA / Escopo de Construção do Novo Dashboard:**
    1. **Gestor de Imagens & Banners da Comunidade:** Componente de upload e recorte com o `ImageCropCompressModal` para foto de fachada, foto do padroeiro e banner do topo, enviando para bucket Supabase Storage `community_assets`.
    2. **Módulo de Liderança (CPC):** Interface de cadastro e gestão de nomes, fotos, telefones e funções dos membros do conselho comunitário daquela CEB.
    3. **Gestor de Avisos da Comunidade:** Painel para publicar, editar e expirar avisos que serão exibidos exclusivamente no mini-site daquela comunidade.
    4. **Vínculo de Grupos & Pastorais:** Sistema para selecionar quais pastorais e movimentos estão ativos naquela comunidade e seus respectivos horários.
    5. **Perfil de Acesso Delegado (Futuro):** Criação de permissão de login restrita para coordenadores de comunidade atualizarem apenas a sua respectiva comunidade, sem acesso aos dados gerais da Catedral.

---

## 📌 13. [Pendência 03] — Auditar Ambiente para Gestão de Usuários

* **Status:** ✅ **Concluído (100%)** — TASK-43 / RBAC Consolidado
* **Prioridade:** Alta / Governança, Segurança & RLS
* **Rotas Implementadas:**
  * Gestão de Acessos: [`app/admin/usuarios/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/admin/usuarios/page.tsx)
  * Guardião Canônico de Rotas: [`components/admin/auth/AdminRoleGuard.tsx`](file:///c:/Users/Start/ecclesiam-app/components/admin/auth/AdminRoleGuard.tsx)
  * Banner de Estatísticas de Liderança: [`components/admin/usuarios/UserStatsBanner.tsx`](file:///c:/Users/Start/ecclesiam-app/components/admin/usuarios/UserStatsBanner.tsx)
  * Convite & Instruções WhatsApp: [`components/admin/usuarios/UserInviteModal.tsx`](file:///c:/Users/Start/ecclesiam-app/components/admin/usuarios/UserInviteModal.tsx)
  * Contexto Comunitário & RBAC: [`components/admin/context/AdminCommunityContext.tsx`](file:///c:/Users/Start/ecclesiam-app/components/admin/context/AdminCommunityContext.tsx)
  * Sidebar Adaptativa Canônica: [`components/admin/layout/AdminSidebar.tsx`](file:///c:/Users/Start/ecclesiam-app/components/admin/layout/AdminSidebar.tsx)
* **🔍 Entrega Consolidada:**
  1. **Modelagem Multi-Tenant Supabase:** Migração `20261028_user_profiles_rbac_enhancements.sql` aplicando `parish_id`, campos de auditoria (`last_sign_in_at`, `invitation_sent_at`), papéis canônicos (`superadmin`, `paroco`, `vigario`, `secretaria`, `pascom`, `coordenador_ceb`) e políticas RLS.
  2. **Controle de Acesso Baseado em Papéis (RBAC):** Proteção estrutural via `AdminRoleGuard` e filtragem dinâmica de menu no `AdminSidebar.tsx`. A equipe da PASCOM não visualiza nem acessa `/admin/dizimo` nem `/admin/usuarios`; a Secretaria possui acesso operacional pleno e a Gestão de Usuários permanece restrita ao Clero/Superadmin.
  3. **Convites & Comunicação Pastoral:** Modal para geração de mensagens personalizadas de boas-vindas com disparo direto no WhatsApp do colaborador e cópia de credenciais.
  4. **Painel de Controle e Auditoria:** Estatísticas de cobertura de CEBs no topo da página, alternador de status ativo/bloqueado com 1 clique e simulador de visualização de perfis para homologação ágil.

---

## 📌 14. [Pendência 04] — Auditar Funções da Secretaria On-line

* **Prioridade:** Média-Alta / Eficiência dos Processos Paroquiais
* **Origem:** Solicitação do Desenvolvedor (22/10/2026)
* **Rotas Envolvidas:**
  * Portal do Fiel: [`app/secretaria/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/secretaria/page.tsx), [`app/secretaria/agendamentos/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/secretaria/agendamentos/page.tsx), [`app/secretaria/sacramentos/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/secretaria/sacramentos/page.tsx)
  * Painel Admin: [`app/admin/secretaria/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/admin/secretaria/page.tsx)
  * Componentes: [`components/admin/secretaria/`](file:///c:/Users/Start/ecclesiam-app/components/admin/secretaria/)
* **🔍 Análise de Implementação Atual (Diagnóstico do Código):**
  * **Status Atual:** **Parcialmente Implementado (~70%)**.
  * **O que JÁ ESTÁ implementado:**
    1. **Página Institucional:** Apresentação da secretaria, expediente, contatos, clero atuante e mapa de localização.
    2. **Agendamentos Pastorais com os Padres:**
       * Formulário público de agendamento (`/secretaria/agendamentos`) com escolha de sacerdote (Pe. Irineu, Pe. Adilson, Pe. Deivid, Pe. Ernandes), motivo e data.
       * Painel administrativo (`AppointmentsManagerTab.tsx`) com filtros por status (`pendente`, `confirmado`, `cancelado`, `concluido`) e disparador de mensagem WhatsApp de confirmação.
       * Tabela `public.pastoral_appointments` no Supabase com RLS.
    3. **Inscrições Sacramentais:**
       * Formulário público (`/secretaria/sacramentos`) para Batismo, Crisma, Primeira Eucaristia e Matrimônio.
       * Painel administrativo (`SacramentsManagerTab.tsx`) para aprovar, consultar certidões e arquivar fichas.
       * Tabela `public.sacramental_registrations` no Supabase com RLS.
    4. **Equipe do Clero & Expedientes:**
       * Gestão administrativa completa dos sacerdotes (`ClergyManagerTab.tsx`), dias e turnos de expediente.
  * **O que FALTA / Escopo de Auditoria & Complementações:**
    1. **Intenções de Santa Missa On-line:**
       * Módulo para o fiel enviar intenções de Missa (Saúde, Falecimento/7º Dia, Ação de Graças) escolhendo data e horário da celebração.
       * Painel para a secretaria gerar a lista consolidada e impressa (PDF/A4) para os leitores e o altar antes de cada Missa.
    2. **Solicitação de Certidões & Documentos Paroquiais:**
       * Formulário para pedir 2ª via de lembrança de batismo, comprovante de crisma ou transferência de noivos.
    3. **Controle de Capacidade e Vagas por Sacramento:**
       * Limite de batizandos por celebração de batismo e limite de casais por encontro de noivos com travamento automático ao lotar.
    4. **Auditoria Ponta a Ponta de Validações & LGPD:**
       * Testar sanitização de inputs, validação de formato de WhatsApp, proteção de documentos sensíveis anexados e termos de consentimento LGPD.

---

## 📌 15. [Pendências de UX, Acessibilidade & LPs das Comunidades]

* **Prioridade:** Alta / Usabilidade, Inclusão de Fiéis Idosos & Refinamento Litúrgico
* **Origem:** Solicitação do Desenvolvedor (23/10/2026)
* **Rotas e Componentes Envolvidos:**
  * LPs das Comunidades: [`app/comunidades/[slug]/page.tsx`](file:///c:/Users/Start/ecclesiam-app/app/comunidades/%5Bslug%5D/page.tsx)
  * Cards da Grade Bento: [`components/comunidades/`](file:///c:/Users/Start/ecclesiam-app/components/comunidades/)
    * `CommunityLiturgyCard.tsx` (Card 1)
    * `CommunityNoticesCard.tsx` (Card 2)
    * `CommunityCalendarCard.tsx` (Card 3)
    * `CommunityCPCCard.tsx` (Card 4)
    * `CommunityLocationCard.tsx` (Card 5)
  * Acessibilidade & Layout: `app/layout.tsx`, `components/common/FontSizeAdjuster.tsx`, `styles/globals.css`
  * Header & Faixa Litúrgica: `components/comunidades/CommunityHeader.tsx`, `components/comunidades/CommunityLiturgicalBanner.tsx`

### 📋 Detalhamento dos 4 Itens Registrados:

### 15.1. Todos os Cards da Grade Bento Clicáveis com Modais de Detalhamento
* **Objetivo:** Transformar todos os 5 cards da Landing Page da comunidade em elementos tátil-interativos. Ao clicar em qualquer card (ou no seu rodapé/ação), abrir um modal solene e acolhedor com a expansão completa das informações:
  * **Card 1 (Celebrações & Liturgia):** Modal com a grade completa e detalhada de celebrações (Santas Missas dominicais e semanais, Celebrações da Palavra, adoração ao Santíssimo, terço comunitário e leituras litúrgicas do dia).
  * **Card 2 (Mural de Avisos da Comunidade):** Modal com o comunicado pastoral na íntegra, comunicados dos coordenadores, fotos anexadas e orientações sobre mutirões, festas e retiros.
  * **Card 3 (Atividades & Calendário):** Modal com cronograma completo de encontros, salas, grupos responsáveis e orientações para novos participantes.
  * **Card 4 (Conselho Comunitário - CPC):** Expansão do modal já existente para permitir ver todos os conselheiros, funções canônicas, histórico de liderança e canais de contato.
  * **Card 5 (Como Chegar):** Modal expandido com referências históricas do bairro, linhas de ônibus locais e instruções de acessibilidade/estacionamento.
* **⏱️ Tempo Estimado de Execução:** ~45 a 60 minutos.

### 15.2. Modo Leitura Confortável / Acessibilidade de Tamanho de Fonte para Idosos
* **Objetivo:** Adicionar no aplicativo e nas LPs um controle sutil e acessível de redimensionamento da fonte (A- / A / A+) para atender ao público de idosos e fiéis da melhor idade (> 65 anos), sem quebrar a harmonia visual, sem transbordar caixas (*word-wrapping safe*) e sem distorcer o layout Bento:
  * Escalas balanceadas: Normal (`100%`), Confortável (`110%`) e Ampliado (`120%`), aplicadas via CSS variable ou classes root.
  * Persistência de preferência no `localStorage` do navegador do fiel.
  * Compatibilidade total com aparelhos móveis simples (Android/iOS de entrada).
* **⏱️ Tempo Estimado de Execução:** ~30 a 40 minutos.

### 15.3. Remoção Cirúrgica do Botão de WhatsApp do Card 1
* **Objetivo:** Remover o botão verde de WhatsApp (`Confirmar Horários`) no rodapé do **Card 1** ([`CommunityLiturgyCard.tsx`](file:///c:/Users/Start/ecclesiam-app/components/comunidades/CommunityLiturgyCard.tsx)), mantendo a sobriedade canônica do card e a paridade de alinhamento com o Card 2.
* **⏱️ Tempo Estimado de Execução:** ~10 a 15 minutos.

### 15.4. Faixa Litúrgica Sutil Sub-Menu nas LPs das Comunidades
* **Objetivo:** Inserir uma faixa horizontal elegante, discreta e solene logo abaixo do menu principal (`CommunityHeader`), exibindo a cor litúrgica do dia e a descrição canônica oficial:
  * Exemplo: `🟢 Tempo Comum — 29ª Semana do Tempo Comum • Ano B / São Marcos`.
  * Gradiente fino e harmonioso com a cor canônica ativa (Verde, Roxo, Branco/Dourado, Vermelho), garantindo reverência e contextualização imediata para o fiel.
* **⏱️ Tempo Estimado de Execução:** ~25 a 35 minutos.

