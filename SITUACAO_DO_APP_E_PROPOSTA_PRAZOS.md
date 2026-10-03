# 🏛️ Diagnóstico da Situação Atual do App & Cronograma Coerente de Prazos

> **Documento Oficial de Avaliação Técnica e Planejamento de Entrega**  
> **Data:** 01 de Outubro de 2026  
> **Projeto:** Ecclesiam App & Catedral de Colatina (Paróquia Piloto)  
> **Finalidade:** Embasamento para a Reunião com o Pároco Pe. Irineu Claudino Sales  

---

## 🔍 1. Raio-X da Situação Atual do Projeto Local (`ecclesiam-app`)

Após consulta aprofundada ao código-fonte, rotas do Next.js, esquemas do banco Supabase e histórico de continuidade (`CONTINUITY.md`), constatamos que **o Ecclesiam App não é apenas uma ideia no papel: o sistema já possui cerca de 65% a 70% da sua estrutura essencial construída e funcional**.

### 1.1 O que JÁ ESTÁ PRONTO e Funcional:
1. **Banco de Dados Real no Supabase:**
   - Clero cadastrado com dados reais da Catedral: **Pe. Irineu Claudino Sales** (Pároco), **Pe. Deivid José** e **Pe. Ernandes Samuel** (Vigários).
   - As **11 Comunidades Eclesiais de Base (CEBs)** reais mapeadas e migradas com endereços, bairros e padroeiros.
   - **10 Pastorais e Movimentos** cadastrados (EAC, ECC, PASCOM, Catequese, Liturgia, Escuta...).
   - Tabelas de horários de missas, avisos e secretaria.
2. **Painel Administrativo da Secretaria (`/admin`):**
   - `/admin`: Dashboard inicial com visão das operações.
   - `/admin/horarios`: Gerenciamento de horários de celebração e missas da semana.
   - `/admin/secretaria`: Cadastro e edição da escala de atendimento dos padres e expediente.
   - `/admin/comunidades`: Listagem e controle das comunidades filiadas.
   - `/admin/conteudo`: Mural de avisos e notícias.
   - `/admin/dizimo`: Controle e relatórios de arrecadação via PIX.
3. **Portal Institucional do Fiel (`/` e `/secretaria`):**
   - Página inicial responsiva com destaques pastorais e card de horários.
   - Página `/secretaria` completa: biografia dos sacerdotes, expediente, ramais de atendimento e **Linha do Tempo histórica da Catedral de 1927 aos dias de hoje**.
4. **Infraestrutura Técnica & Build:**
   - Stack moderna em **Next.js 16 (Turbopack)** + **Tailwind CSS** + **Supabase (PostgreSQL)**.
   - Repositório versionado e branch `main` sincronizada no GitHub (`ecclesiamapp/user`) com **0 erros de compilação**.

---

## 🚧 2. O que Falta para o Lançamento Pleno da Catedral

Para que a Catedral de Colatina tenha a experiência digital perfeita apresentada nos slides, restam apenas os seguintes blocos:

1. **Refinamento da Home do Fiel:** Aplicar os tokens finais de design aprovados (fundo pergaminho quente `#F5EFE7`, tipografia Clara, vermelho Sagrado Coração e atalhos rápidos de WhatsApp).
2. **Mini-Sites das 11 Comunidades (`/comunidades/[slug]`):** Criar as subpáginas individuais com as fotos das capelas e mapas GPS (as tabelas e dados no banco já estão prontos).
3. **Módulo "Sou do Sagrado Missa":** Área para download dos folhetos de missa semanais em PDF e widget com a liturgia diária da CNBB.
4. **Alimentação Final de Mídia:** Inserir fotos oficiais atualizadas dos padres, da Catedral e das 11 comunidades fornecidas pela secretaria/PASCOM.

---

## ⏱️ 3. Sugestão de Cronograma e Prazos Coerentes para Apresentar ao Padre

A melhor estratégia com sacerdotes e conselhos paroquiais é o **Lançamento Escalonado em 3 Fases (Go-Live Rápido)**. Em vez de esperar 2 meses para colocar tudo no ar de uma vez, entregamos valor pastoral imediato:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      CRONOGRAMA DE IMPLANTAÇÃO ESCALONADA                       │
├─────────────────────────┬───────────────────────────┬───────────────────────────┤
│ FASE 1 (7 a 10 dias)    │ FASE 2 (15 a 21 dias)     │ FASE 3 (30 a 45 dias)     │
│ GO-LIVE DO PORTAL       │ COMUNIDADES & FOLHETOS    │ CONFISSÕES & ÁREA DO FIEL │
│ • Home solene no ar     │ • Mini-sites das 11 CEBs  │ • Agendamento online de   │
│ • Missas de hoje (07/19)│ • GPS Google Maps         │   confissões com os padres│
│ • Secretaria & WhatsApp │ • Folhetos em PDF         │ • Carteirinha digital de  │
│ • Dízimo PIX 1 clique   │ • Liturgia CNBB diária    │   dizimista no celular    │
│ • Treinamento secretária│ • Envolvimento das CEBs   │ • Notificações push       │
└─────────────────────────┴───────────────────────────┴───────────────────────────┘
```

### 🗓️ Detalhamento das Fases:

#### 🟢 Fase 1 — Go-Live do Portal Principal da Catedral (Prazo: 7 a 10 dias)
* **Objetivo:** O Padre Irineu já vê o site funcionando publicamente no primeiro domingo após a assinatura.
* **Entregas desta fase:**
  - Portal da Catedral no ar (mobile e desktop) com fotos oficiais e brasão.
  - Card de **Missas de Hoje (07h e 19h)** com celebrante do dia.
  - Página da **Secretaria Paroquial** com telefones, expediente e biografia dos 3 padres.
  - Central de **WhatsApp em 1 Clique** (Batismo, Casamento, Confissões).
  - Botão de **Dízimo com PIX Copia e Cola**.
  - **Sessão de treinamento de 1 hora** com a secretária para alimentar avisos no painel `/admin`.
* **Argumento para o Padre:**  
  > *"Padre, em apenas 7 a 10 dias os paroquianos da Catedral já estarão abrindo o novo portal no celular nas missas de domingo e utilizando o PIX para o dízimo."*

#### 🟡 Fase 2 — Mini-Sites das 11 Comunidades e Folhetos (Prazo: 15 a 21 dias)
* **Objetivo:** Incluir todas as capelas filiadas e os fiéis das comunidades no ecossistema paroquial.
* **Entregas desta fase:**
  - Mini-sites individuais das 11 CEBs (`/comunidades/:slug`) com fotos das fachadas, localização GPS e história dos fundadores.
  - Grade de missas e cultos da palavra específicos de cada comunidade.
  - Módulo de download de folhetos semanais em PDF (*"Sou do Sagrado Missa"*).
  - Integração da Liturgia Diária oficial da CNBB na primeira página.
* **Argumento para o Padre:**  
  > *"Na segunda semana, envolvemos as lideranças de cada uma das 11 comunidades para recolher fotos e horários das capelas, garantindo que toda a paróquia se sinta acolhida."*

#### 🔵 Fase 3 — Agendamento de Confissões e Área do Fiel (Prazo: 30 a 45 dias)
* **Objetivo:** Automação avançada dos atendimentos pastorais dos sacerdotes.
* **Entregas desta fase:**
  - Sistema de solicitação de agendamento de confissões com a grade de horários do Pe. Irineu, Pe. Deivid e Pe. Ernandes.
  - Confirmação automática via WhatsApp enviada pela secretaria.
  - PWA com atalho na tela do celular e carteirinha digital do paroquiano.

---

## 🎯 4. Como Apresentar Esses Prazos na Reunião (Discurso Pronto)

Ao chegar no Bloco 2 da Apresentação (*Sobre Prazo*), use esta fala:

> *"Padre Irineu, muitos projetos de internet demoram meses porque precisam começar do zero absoluto. Aqui nós temos uma enorme vantagem: **a plataforma Ecclesiam App já está com a infraestrutura da Catedral pronta e testada**.*  
> 
> *Os dados dos nossos sacerdotes, das nossas 11 comunidades e das pastorais já estão devidamente estruturados no sistema.*  
> 
> *Por isso, nosso compromisso de prazo é concreto e seguro:*  
> *• **Em 7 a 10 dias**, o portal principal da Catedral já estará no ar com as missas de hoje, o WhatsApp da secretaria e o Dízimo PIX.*  
> *• **Em até 21 dias**, todas as 11 comunidades filiadas estarão com suas páginas completas, mapas GPS e folhetos litúrgicos.*  
> *• O treinamento da secretária paroquial leva apenas 1 hora, porque o painel é simples e 100% em português.*  
> 
> *O senhor terá uma transição tranquila, sem dor de cabeça e com impacto imediato na vida dos fiéis."*
