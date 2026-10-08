# Escopo do Projeto: Ecclesiam App (Plataforma SaaS Multi-Paróquias)

## 1. Visão Geral do Produto e Filosofia White-Label
O objetivo é transformar o projeto que nasceu para a Catedral de Colatina em uma **Plataforma SaaS Multi-Cliente 100% White-Label**. O Ecclesiam App será uma solução invisível de infraestrutura que fornecerá sites e aplicativos móveis para diversas paróquias. 
**Regra de Ouro:** A marca "EcclesiamApp" NÃO aparecerá de modo destacado para o usuário final (o fiel). Toda a experiência (site, app, comunicações) será centrada exclusivamente na marca, cores e identidade da paróquia cliente. As paróquias acessarão um painel administrativo intuitivo para gerenciar seus canais digitais.

## 2. Decisões Arquiteturais e de Negócios
* **Arquitetura Base:** Desenvolvimento customizado do zero.
* **Criação Visual (Sites):** Uso de Templates Fixos Customizáveis (A paróquia altera cores, logotipos e conteúdos em layouts profissionais pré-aprovados).
* **Modelo de Negócios (SaaS):** Planos baseados em Funcionalidades/Tiers (Ex: Plano Básico só com Site; Plano Avançado com Dízimo online e App).
* **Distribuição do App:** Modelo *White-Label*. Cada paróquia do plano avançado terá o seu próprio aplicativo publicado individualmente nas lojas (Ex: "App da Catedral de Colatina").
* **Profundidade do Sistema (MVP):** Foco em ser um poderoso CMS (Gestor de Conteúdo) + Portal de Arrecadação via PIX. Recursos complexos de ERP/Secretaria (contabilidade pesada, certidões de batismo) não farão parte da versão inicial, agilizando o lançamento.

## 3. Funcionalidades do Produto Inicial (MVP)

### 3.1 Painel Administrativo da Paróquia (O "WordPress" católico)
* Dashboard de Gestão: Visão geral de acessos e arrecadações.
* Gestão de Conteúdo: Postagem de Avisos, Notícias e Mural.
* Gestão de Horários: Missas, Confissões e Expediente.
* Módulo de Doações e Ofertas: Central de informações da paróquia com acompanhamento de doações via PIX (QR Code dinâmico e chave Copia-e-Cola para obras, campanhas e caridade).
* Coluna Editorial Pastoral: Gestão de artigos e mensagens periódicas com seletor de destaque na Home ("A Palavra do Nosso Pároco" e "A Palavra do Nosso Bispo").
* Personalização: Alteração da identidade visual do Site/App.
* Calendário Litúrgico & Festas: Grade mensal com cores canônicas e cadastro de festas de padroeiros da Matriz, das CEBs e dos Grupos de Reflexão.

### 3.2 O Site da Paróquia
* Interface web amigável e responsiva baseada no template escolhido.
* Faixa Litúrgica Dinâmica: Adaptação cromática sutil à cor do dia (Verde, Roxo, Vermelho, Branco), com celebração e Liturgia Diária.
* Exibição clara de horários, notícias e links de transmissão ao vivo.
* Central de Atendimento (redirecionamento rápido para o WhatsApp da Secretaria).
* Destaque Solene da Palavra do Pastor: Card exclusivo e refinado na Home (Pároco ou Bispo) com frase de impacto e link para leitura completa.
* Página Dedicada de Mensagens Pastorais (`/mensagens`): Dois grandes cards solenes (Pároco e Bispo) para acesso à mensagem atual e acervo histórico de reflexões espirituais.
* Central de Conscientização Pastoral do Dízimo (Theòs) & Ofertas via PIX: Conscientização bíblica das 4 dimensões da CNBB, orientações da secretaria e exibição de QR Code visual escaneável para ofertas e doações imediatas.

### 3.3 O Aplicativo Exclusivo (White-label)
* Espelhamento do conteúdo do site em formato nativo.
* Envio de Notificações Push (avisos urgentes, lembrete de eventos e novenas).
* Integração nativa com o Calendário Litúrgico e Liturgia Diária completa.

### 3.4 Módulo Secretaria On-line (Balcão de Serviços Pastorais)
* **Agendamentos Pastorais:** Marcação de Confissões individuais, Direção Espiritual com sacerdotes, Pastoral da Escuta e atendimentos canônicos com controle de vagas e confirmação automática.
* **Inscrições & Matrículas:** Fichas digitais para Batismo, Catequese (Eucaristia e Crisma), Curso de Noivos e Curso de Gestantes, eliminando papelada na secretaria.
* **Guia de Documentação & Informações:** Checklist completo e afetuoso dos documentos exigidos para sacramentos e certidões, eliminando dúvidas repetitivas no WhatsApp e telefone.

## 4. Stack Tecnológica Definida
* **Frontend e Painel Admin:** Next.js (React)
* **Banco de Dados, Autenticação e Storage:** Supabase (PostgreSQL)
* **App Mobile:** React Native (provavelmente usando Expo) para facilitar a automação de compilação dos múltiplos apps white-label.
