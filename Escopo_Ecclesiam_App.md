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
* Módulo de Doações: Acompanhamento e relatórios de Dízimo/Intenções de Missa gerados via PIX.
* Personalização: Alteração da identidade visual do Site/App.

### 3.2 O Site da Paróquia
* Interface web amigável e responsiva baseada no template escolhido.
* Exibição clara de horários, notícias e links de transmissão ao vivo.
* Central de Atendimento (redirecionamento rápido para o WhatsApp da Secretaria).
* Página de Dízimo e Intenções de Missa (Check-out de Pagamento).

### 3.3 O Aplicativo Exclusivo (White-label)
* Espelhamento do conteúdo do site em formato nativo.
* Envio de Notificações Push (avisos urgentes, lembrete de eventos).
* (Opcional Futuro) Integração com Liturgia Diária e área logada do paroquiano.

## 4. Stack Tecnológica Definida
* **Frontend e Painel Admin:** Next.js (React)
* **Banco de Dados, Autenticação e Storage:** Supabase (PostgreSQL)
* **App Mobile:** React Native (provavelmente usando Expo) para facilitar a automação de compilação dos múltiplos apps white-label.
