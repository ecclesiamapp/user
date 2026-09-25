# 📋 Documento de Implementações Pendentes (Backlog Futuro)

> **Documento Oficial de Registro de Recursos Futuros**  
> **Status:** Registrado para Implementação Futura  
> **Data de Criação:** Setembro de 2026  
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
  * **Identificação e Padroeiro:** Foto de fachada da capela, histórico da comunidade, padroeiro e rota GPS integrada (Google Maps).
  * **Horários Exclusivos:** Grade apenas com as celebrações e cultos daquela capela específica.
  * **Calendário Mensal da Comunidade:** Missas, novenas, tríduos de padroeiro e encontros de movimentos locais (EAC, ECC, Terço).
  * **História da CEB:** Ano de fundação (ex: 1956, 1962, 1986), pioneiros e trajetória pastoral.
  * **Galeria de Fotos Própria:** Álbuns de festividades daquela comunidade.
  * **Gestão Híbrida:** Edição total pela secretaria da Matriz, com permissão futura para os coordenadores de capela alimentarem suas páginas.

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

* **Documento de Especificação Completa:** [`[documentation]/planejamento/ESCOPO_AREA_DO_FIEL.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/ESCOPO_AREA_DO_FIEL.md)
* **Quando implementar:** Na fase de engajamento do membro.
* **Escopo Funcional:**
  * **Acesso sem senha (Passwordless):** Magic Link ou Código OTP de 6 dígitos via WhatsApp/E-mail.
  * **Carteirinha Digital do Dizimista & Histórico:** Registro de dízimos e doações PIX com 1 clique.
  * **Meus Agendamentos:** Visualização de confissões e atendimentos com os padres.
  * **Minha Comunidade (CEB):** Feed customizado da capela favorita do fiel.
  * **Intenções de Missa:** Pedidos de saúde, falecidos e graças para o altar da missa.

