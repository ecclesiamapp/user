# 🎄 Plano Mestre de Desenvolvimento: Entrega de Natal 2026
## Catedral do Sagrado Coração de Jesus — Ecclesiam App & Start Agência Digital

> **Status:** Aprovado pelo Pároco Pe. Irineu Claudino Sales com Ajustes da Reunião de 07/10/2026  
> **Data de Início:** 07 de Outubro de 2026  
> **Data Final (Entrega Plena):** 25 de Dezembro de 2026 (Solenidade do Natal)  
> **Janela de Execução:** 11 Semanas (~78 dias)  
> **Estratégia:** Implantação Escalonada em 3 Fases com Estabilização para o Natal  
> **Responsáveis:** Start Agência Digital (Fauzer Cruz & Marcella Boeloni Cruz)  

---

## 🎯 1. Visão Geral e Diretrizes do Projeto

A reunião realizada com o Pároco Pe. Irineu Claudino Sales no dia 07/10/2026 resultou na **aprovação unânime e entusiástica** da proposta para a Catedral do Sagrado Coração de Jesus (Paróquia Piloto do Ecclesiam App), com os seguintes **ajustes práticos anotados em ata e integrados ao escopo oficial**:

### 📝 Ajustes da Reunião com o Pároco (Anotações em Ata):
1. **Inclusão do Grupo de Reflexão Santa Rita (Brisa do Vale):**
   - A paróquia passa a contar oficialmente com **12 Comunidades e Núcleos Eclesiais** cadastrados no sistema (a Igreja Matriz + 10 CEBs + Grupo de Reflexão Santa Rita no Brisa do Vale).
   - O Grupo de Reflexão ganha card na Home e mini-site próprio (`/comunidades/santa-rita-brisa-do-vale`) com localização e horários de encontros bíblicos.
2. **Central de Conscientização Pastoral do Dízimo (Theòs):**
   - O aplicativo **não fará captação direta de dízimo** neste primeiro momento, respeitando o ecossistema existente da paróquia onde o controle e cadastro de dizimistas oficiais são operados pela secretaria no sistema **Theòs**.
   - A seção do Dízimo torna-se uma **Central de Informações e Conscientização Pastoral** (explicando as 4 dimensões bíblicas da CNBB: Religiosa, Eclesial, Missionária e Caritativa, e orientando o paroquiano sobre o plantão na secretaria e carnês do Theòs).
3. **QR Code Visual para Doações e Ofertas via PIX:**
   - A seção integra um **QR Code escaneável de alta legibilidade**, destinado especificamente para **Doações e Ofertas Espontâneas**, Obras da Catedral, Campanhas e Intenções de Missa via PIX, acompanhado do botão "Copiar Chave / Copia e Cola" e dos dados bancários oficiais.
4. **Módulo de Mensagens Pastorais ("Palavra do Nosso Pároco" & "Palavra do Nosso Bispo"):**
   - Espaço editorial nobre em formato de "mini-blog" para publicação de cartas pastorais, artigos e reflexões espirituais periódicas dos pastores (Pe. Irineu Claudino Sales e Dom Lauro Sérgio Versiani Barbosa).
   - **Na Home:** Apenas **1 mensagem em destaque solene por vez** (selecionada no painel administrativo pela secretaria para evitar poluição visual e preservar o destaque nobre).
   - **Página `/mensagens`:** Apresenta **dois grandes cards nobres** (um para a coluna do Pároco e outro para o Bispo), permitindo que o fiel leia a reflexão atual e acesse todo o acervo cronológico de mensagens anteriores.
   - **No `/admin/mensagens`:** Gestão simples e intuitiva de publicações com controle da mensagem ativa na primeira página.

---

### 🏛️ Parâmetros Contratuais & Arquiteturais Consolidados:
1. **Regra de Ouro do White-Label:** A interface do fiel exibe exclusivamente o brasão, cores e identidade da Catedral do Sagrado Coração de Jesus. O Ecclesiam App opera de forma transparente nos bastidores de infraestrutura.
2. **Escopo Fechado de Natal (2026):**
   - Portal Institucional Solene da Matriz (Clero com 4 padres, Missas, Avisos, Dízimo/Ofertas PIX com QR Code, Card de Destaque da Palavra do Pastor, WhatsApp, PWA).
   - **Coluna Editorial Pastoral (`/mensagens`):** Acervo da Palavra do Pároco e Palavra do Bispo.
   - Mini-sites dinâmicos das **12 Comunidades e Grupos de Reflexão** (incluindo Santa Rita no Brisa do Vale) com rotas GPS.
   - Módulo de Folhetos Litúrgicos semanais (*"Sou do Sagrado Missa"*) com download e upload no `/admin/folhetos`.
   - Liturgia Diária CNBB oficial integrada.
   - **Secretaria On-line:** Agendamentos pastorais de Confissões/Atendimentos dos 4 padres + Inscrições de Sacramentos (Batismo, Catequese, Noivos) com checklist de documentos.
3. **Backlog Futuro (Fase 2027):**
   - Área Privada do Fiel com login OTP/Magic Link (`/meu-espaco`), carteirinha do dizimista integrada ao Theòs e histórico de doações.
   - Console Global SaaS Multi-Paróquia (`/superadmin`).
4. **Capacitação Presencial VIP (R$ 1.200 - 8 horas):**
   - **4 horas (Fim de Outubro):** Capacitação da Secretária Paroquial (horários, avisos, clero, PIX e mensagens).
   - **4 horas (Fim de Novembro):** Capacitação dos Coordenadores das Comunidades/CEBs e Equipe Litúrgica/PASCOM.
5. **Automação de Notificações:**
   - Para o Fiel: Click-to-WhatsApp pré-formatado (sem custo de API e sem atrito).
   - Para a Secretaria: Alerta em tempo real via E-mail Transacional (Resend) para novos agendamentos e fichas.

---

## 🗓️ 2. Linha do Tempo e Marcos Litúrgicos Dominicais

```
Outubro 2026                     Novembro 2026                    Dezembro 2026
┌──────────────────────┐         ┌──────────────────────┐         ┌──────────────────────┐
│  07/10: Kickoff      │         │  01/11: GO-LIVE      │         │  06/12: GO-LIVE      │
│  Sprints 1 e 2       │ ──────> │  FASE 1 (Portal)     │ ──────> │  FASE 3 (Secretaria) │ ──────> NATAL
│  Preparo Domínio DNS │         │  22/11: GO-LIVE      │         │  25/12: Solenidade   │
│  Treino Secretária   │         │  FASE 2 (12 CEBs)    │         │  Ecossistema Pleno   │
└──────────────────────┘         └──────────────────────┘         └──────────────────────┘
```

| Marco | Data Alvo | Evento / Solenidade | Entregas em Produção |
| :--- | :--- | :--- | :--- |
| **Kickoff & Planejamento** | **07/10/2026** | Quarta-feira | Alinhamento do plano com ata do Pe. Irineu (Grupo Santa Rita + Dízimo/Theòs + QR Code + Palavra do Pároco/Bispo) |
| **Treinamento 1 (Secretaria)** | **29/10 ou 30/10** | Quinta/Sexta | 4h presenciais com a secretária na Catedral (Avisos, Missas, Clero, Doações e Mensagens do Padre) |
| **🟢 GO-LIVE FASE 1** | **Domingo, 01/11/2026** | **Solenidade de Todos os Santos** | **Portal Oficial da Matriz no Ar** (Domínio próprio, Missas, 4 Padres, Central do Dízimo + QR Code de Doações, **Palavra do Pároco no ar**, WhatsApp, PWA) |
| **Treinamento 2 (CEBs & PASCOM)** | **19/11 ou 20/11** | Quinta/Sexta | 4h presenciais com as 12 Comunidades/CEBs e equipe litúrgica (Mini-sites e Folhetos) |
| **🟡 GO-LIVE FASE 2** | **Domingo, 22/11/2026** | **Solenidade de Cristo Rei** | **Mini-sites das 12 Comunidades + Folhetos de Missa** (Incluindo Santa Rita Brisa do Vale, GPS Google Maps/Waze, download de folhetos em PDF, Liturgia CNBB) |
| **🔵 GO-LIVE FASE 3** | **Domingo, 06/12/2026** | **2º Domingo do Advento** | **Secretaria On-line Completa** (Agendamentos com Pe. Irineu, Pe. Adilson, Pe. Deivid, Pe. Ernandes + Inscrições de Sacramentos) |
| **🌟 Solenidade do Natal** | **Quinta/Sexta, 24-25/12** | **Natividade do Senhor** | **Consolidação Plena:** Missa da Vigília/Galo, Horários Especiais de Fim de Ano, PWA instalado nos celulares |

---

## 🧱 3. Estrutura Detalhada das 4 Sprints de Desenvolvimento

### 🚀 SPRINT 1: Fechamento da Fase 1, Domínio e Entrada em Produção
* **Período:** 07 de Outubro a 31 de Outubro (Semanas 1, 2 e 3)
* **Objetivo:** Deixar o portal principal impecável com a Palavra do Pároco/Bispo, novo módulo de Dízimo/Doações, cadastro da 12ª comunidade, configurar infraestrutura oficial e realizar o Go-Live no domingo 01/11.

#### Tarefas Técnicas & Entregas:
1. **Módulo de Mensagens Pastorais (Palavra do Pároco & Palavra do Bispo):**
   - Criação da tabela `pastoral_messages` no Supabase via migração `20261007_add_pastoral_messages.sql`.
   - Card nobre na Home exibindo a **Mensagem Inaugural de Boas-Vindas do Pe. Irineu** com citação solene e foto do pároco.
   - Rota `/mensagens` com dois grandes cards (Pároco e Bispo) e leitor de artigos na íntegra.
   - Painel `/admin/mensagens` para publicação fácil e alternância do destaque da Home.
2. **Módulo de Dízimo & Doações (Ajuste Pe. Irineu):**
   - Transformação da seção de Dízimo na **Central de Informações e Conscientização Pastoral** (as 4 dimensões bíblicas da CNBB + orientação sobre o cadastro no Theòs).
   - Renderização do **QR Code Visual Escaneável para Doações e Ofertas** via PIX, botão "Copiar Chave Copia e Cola" e exibição dos dados da conta bancária oficial da Catedral.
3. **Cadastro do Grupo de Reflexão Santa Rita (Brisa do Vale):**
   - Aplicação da migração `20261007_add_grupo_reflexao_santa_rita.sql`.
   - Inclusão do card do Grupo de Reflexão Santa Rita na listagem de comunidades da Home e no `/admin/comunidades`.
4. **Infraestrutura e Domínio Oficial:**
   - Criação da zona Cloudflare para o domínio da Catedral (Proxy Laranja + SSL Full Strict).
   - Apontamento dos registros DNS `A` (76.76.21.21) e `CNAME` (`cname.vercel-dns.com`) para a Vercel.
   - Validação de variáveis de ambiente de produção no painel da Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. **Refinamento do Clero (4 Padres) & WhatsApp:**
   - Clero oficial renderizado: Pe. Irineu Claudino Sales, Pe. Adilson Ramos de Melo, Pe. Deivid José e Pe. Ernandes Samuel.
   - Canais de WhatsApp da secretaria com links diretos categorizados (Geral, Batismos, Casamentos).
6. **Consolidação Estética & Auditoria UX/UI (Design System Padre Alex Nogueira):**
   - Adoção oficial dos tokens e componentes de [padrealexnogueira.com](https://www.padrealexnogueira.com/): tipografia solene display `Suez One` + corpo/numerais tabulares `Sora`.
   - Paleta calorosa eclesial: Fundo Pergaminho (`#F5EFE7`), Areia (`#EEE3D4`), Vermelho Sagrado Coração (`#8B1E22`), Marrom Ébano (`#2D1A16`), Ouro Âmbar (`#FFA82A`) e Café (`#211A14`).
   - Componentes oficiais: Marquee Contínuo de Avisos (`banner_horizontal`), Floating Schedule Card de missas de hoje e badges `.tag-gold`.
   - Execução do script de auditoria UX/UI (`audit_ux_ui.js`) e validação de 0 erros no `npm run build`.
7. **Capacitação da Secretária (4 horas):**
   - Treinamento presencial na secretaria da Catedral: gerenciamento de horários no `/admin/horarios`, avisos no `/admin/conteudo` e mensagens no `/admin/mensagens`.
8. **Checklist Go-Live 01/11:**
   - Anúncio oficial do Padre Irineu no púlpito das missas de 07h e 19h no dia 01/11, apontando para a sua carta pastoral de inauguração na Home.

---

### ⛪ SPRINT 2: Mini-Sites das 12 Comunidades & Módulo de Folhetos Litúrgicos
* **Período:** 01 de Novembro a 21 de Novembro (Semanas 4, 5 e 6)
* **Objetivo:** Ativar as 12 comunidades (Matriz + 10 CEBs + Santa Rita Brisa do Vale) com GPS e o repositório de folhetos em PDF para a Solenidade de Cristo Rei (22/11).

#### Tarefas Técnicas & Entregas:
1. **Páginas Individuais das 12 Comunidades (`/comunidades/[slug]`):**
   - Homologação das páginas das 12 comunidades (incluindo `/comunidades/santa-rita-brisa-do-vale`).
   - Integração com mapas GPS: botões de rota direta no **Google Maps** e **Waze**.
   - Coleta e inserção das fotos reais das fachadas das capelas (via pasta compartilhada com a PASCOM).
   - Grade específica de celebrações e encontros bíblicos de cada comunidade/grupo.
2. **Módulo de Folhetos de Missa ("Sou do Sagrado Missa"):**
   - Criação da tela administrativa `/admin/folhetos` para upload de PDF e definição do domingo litúrgico correspondente.
   - Integração com Supabase Storage (bucket seguro `booklets`).
   - Seção pública na Home e rota dedicada com visualizador em PDF responsivo e botão de download rápido.
3. **Liturgia Diária Oficial CNBB:**
   - Widget solene com o Santo do Dia, Cor Litúrgica e Leituras (1ª Leitura, Salmo e Evangelho).
4. **Capacitação das Lideranças das 12 Comunidades (4 horas):**
   - Workshop de 4 horas reunindo coordenadores das 12 comunidades e equipe de liturgia da Catedral.
5. **Checklist Go-Live 22/11:**
   - Padre Irineu anuncia a inclusão das 12 comunidades e folhetos online na Solenidade de Cristo Rei.

---

### 📋 SPRINT 3: Secretaria On-line (Agendamentos com Padres & Inscrições)
* **Período:** 22 de Novembro a 05 de Dezembro (Semanas 7 e 8)
* **Objetivo:** Implementar o atendimento pastoral automatizado e inscrições sacramentais para o 2º Domingo do Advento (06/12).

#### Tarefas Técnicas & Entregas:
1. **Modelagem de Dados Supabase (Migrações):**
   - Tabela `pastoral_appointments` (agendamentos de confissões/atendimento) com vínculo aos 4 padres (`clergy_id`), data, horário e status (`pendente`, `confirmado`, `cancelado`).
   - Tabela `sacramental_registrations` (inscrições de batismo, catequese, noivos e gestantes) com checklist de documentos.
   - RLS estrito isolado por `parish_id`.
2. **Interface Pública do Fiel:**
   - Página `/secretaria-online` ou `/agendamentos`:
     - Seleção do Sacerdote (Pe. Irineu, Pe. Adilson, Pe. Deivid, Pe. Ernandes).
     - Seleção do acolhimento (Confissão Sacramental, Conversa Pastoral, Pastoral da Escuta).
     - Grade de horários e confirmação em Click-to-WhatsApp.
   - Formulários guiados de Inscrição Sacramental com checklist claro de documentação exigida.
3. **Painel de Gestão da Secretaria:**
   - Telas `/admin/agendamentos` e `/admin/inscricoes` com aprovação rápida.
4. **Disparo de E-mails Transacionais (Resend):**
   - Notificação automática para a secretária a cada nova solicitação recebida.
5. **Checklist Go-Live 06/12:**
   - Entrada em operação oficial no 2º Domingo do Advento.

---

### 🎄 SPRINT 4: Estabilização, Grade Especial de Natal e Entrega Plena
* **Período:** 06 de Dezembro a 25 de Dezembro (Semanas 9, 10 e 11)
* **Objetivo:** Garantir estabilidade operacional máxima, promover a instalação do PWA e celebrar o Natal com o sistema consolidado.

#### Tarefas Técnicas & Entregas:
1. **Módulo de Fim de Ano & Solenidade de Natal:**
   - Destaque no topo do portal com a grade especial da **Novena de Natal**, **Missa da Vigília (Missa do Galo)** e **Missas de Natal e Ano Novo** da Catedral e das 12 comunidades.
   - Mensagem pastoral solene de Natal do Pároco Pe. Irineu e do Bispo Dom Lauro Sérgio em destaque no novo módulo de mensagens.
2. **Campanha do PWA nos Celulares:**
   - Material de apoio e QR Code nos bancos da igreja para os fiéis salvarem o ícone da Catedral na tela inicial do celular.
3. **Auditoria Geral de Segurança e Performance:**
   - Verificação de logs no Supabase, backups e monitoramento de tráfego.
4. **Fechamento e Relatório Executivo:**
   - Emissão do termo de conclusão da implantação da Catedral Piloto e início do ciclo de mensalidades (R$ 390 - 490/mês).

---

## 📊 4. Matriz de Responsabilidades (RACI)

| Atividade | Start Agência (Dev) | Secretária Paroquial | Pe. Irineu (Pároco) | Lideranças das 12 Comunidades |
| :--- | :---: | :---: | :---: | :---: |
| Desenvolvimento & Infraestrutura Next.js/Supabase | **R** / **A** | I | I | I |
| Configuração de DNS e Domínio Oficial | **R** / **A** | C | A | I |
| Fornecimento das chaves PIX e contatos | C | **R** | **A** | I |
| Redação das Cartas Pastorais (Pároco/Bispo) | I | C | **R** / **A** | I |
| Envio de fotos oficiais dos padres e capelas | C | C | A | **R** |
| Alimentação semanal de horários e avisos | S | **R** | A | C |
| Upload dos folhetos de missa em PDF | S | **R** (ou PASCOM) | I | I |
| Gestão dos agendamentos de confissões | S | **R** | **A** | I |
| Treinamento Presencial (8 horas) | **R** / **A** | **C** (4h) | I | **C** (4h) |

*Legenda: **R** = Responsável pela Execução, **A** = Aprovador Final, **C** = Consultado/Participante, **S** = Suporte, **I** = Informado.*

---

## 🛡️ 5. Protocolo de Segurança Pré-Lançamento (Checklist Mandatória)

Antes de qualquer virada de chave para produção em 01/11, 22/11 ou 06/12, a equipe executará:
1. **Auditoria de RLS (Supabase):** Nenhuma tabela poderá ser acessada anonimamente para escrita sem política estrita.
2. **Auditoria de Pacotes (`npm audit`):** Dependências limpas sem vulnerabilidades críticas.
3. **Validação de Variáveis de Ambiente:** Conferência no dashboard da Vercel.
4. **Escudo Cloudflare:** Nameservers apontados, Proxy Nuvem Laranja ativado, SSL Full (Strict) e mitigação contra ataques de negação de serviço.
5. **Build de Produção Limpo:** `npm run build` executado e aprovado com 0 erros de tipagem.

---

## 📁 6. Sincronização e Custódia do Documento
Este documento de planejamento é parte integrante da documentação oficial do Ecclesiam App e está sincronizado em:
- `c:\Users\Start\ecclesiam-app\[documentation]\planejamento\PLANO_DESENVOLVIMENTO_NATAL_2026.md`
- `c:\Users\Start\ecclesiam-app\[documentation]\PLANO_DESENVOLVIMENTO_NATAL_2026.md`
- `g:\Meu Drive\TRABALHOS\01 - NEGÓCIOS E PROJETOS ATIVOS\ECCLESIAN APP\AGENTE DE IA - ECCLESIAM\PLANO_DESENVOLVIMENTO_NATAL_2026.md`
