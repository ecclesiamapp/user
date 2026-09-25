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
     * Seleção da capela que o fiel frequenta (Matriz, Perpétuo Socorro, Santa Luzia, etc.).
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
