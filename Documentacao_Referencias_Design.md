# Documentação Técnica de Referências de Design & Componentes
*Ecclesiam App — Plataforma SaaS White-Label para Paróquias*

---

## 1. Design System: St. Patrick's Cathedral (NY)
**URL:** [saintpatrickscathedral.org](https://saintpatrickscathedral.org)  
**Conceito Central:** Monumentalidade, Solenidade Litúrgica, "Regra dos 4 Segundos" e Hospitalidade Digital.

### 1.1 Paleta de Cores & Tokens
* **Basalto / Ébano Catedral (Primária Escura):** `#16181B` (Fundo solene para hero, modais e barra superior)
* **Mármore Alabastro / Off-White (Fundo Claro):** `#F8F7F4` (Fundo respirável para leitura diária)
* **Ouro Sacro / Champagne (Destaque):** `#C8A463` / `#D4AF37` (Bordas, ícones, divisores e botões nobres)
* **Bordô Litúrgico (Acento Sacerdotal):** `#721C24`
* **Status "Ao Vivo Agora":** `#D32F2F` (Pulsante litúrgico)
* **Texto Principal:** `#121314` (em fundos claros) / `#FFFFFF` (em fundos escuros)
* **Texto Secundário / Legendas:** `#5E6268` (em claros) / `#C7C9CC` (em escuros)

### 1.2 Tipografia
* **Títulos Monumentais / Cabeçalhos (Serif):** `Cinzel` ou `Cormorant Garamond` (Google Fonts).
  * Estilo: Caixa alta (*UPPERCASE*), `letter-spacing: 0.12em` a `0.18em`, peso 500 a 700.
* **Corpo de Texto, Horários e Dados Funcionais (Sans-Serif):** `Plus Jakarta Sans` ou `Inter`.
  * Numerais com `font-variant-numeric: tabular-nums` para alinhamento perfeito de horários (ex.: `07:00`, `12:00`, `19:30`).

### 1.3 Componentes de Destaque
1. **Hero Monumental Imersivo:**
   * Fotografia em alta resolução da nave central / altar-mor com gradiente vertical escuro na base (`linear-gradient(to bottom, rgba(22,24,27,0.3) 0%, rgba(22,24,27,0.92) 100%)`).
2. **Card Flutuante "Today's Schedule" (Horários de Hoje):**
   * Card fixo ou sobreposto na dobra superior:
     * Próxima Missa: Horário + Idioma/Tipo (ex.: *Missa Solene*, *Missa dos Fiéis*).
     * Horário de Confissões do dia.
     * Botão direto com badge de Live Stream quando ativa.
3. **Módulo de Captação e Doações Digno ("Preserve the Cathedral"):**
   * Sem linguagem de "cobrança bancária" — valores pré-definidos sugeridos (R$ 30, R$ 50, R$ 100, Outro) + Opção de frequência (Única ou Mensal/Dízimo).
   * Botão de PIX instantâneo e Cartão de Crédito.
4. **Guia de Visitação & Portas Abertas:**
   * Horários de funcionamento para oração pessoal e visitação, localização e mapa acessível.

---

## 2. Estilo do Sidebar: Padre Paulo Ricardo (Mobile & Backend)
**Referência:** [padrepauloricardo.org](https://padrepauloricardo.org)  
**Conceito Central:** Filosofia "Beneditina Digital" (*Ora et Labora*) — escuro, sóbrio, monástico, com foco total no conteúdo e distinção eclesial.

### 2.1 Atmosfera & Paleta do Sidebar
* **Fundo do Sidebar:** `#0E1012` ou `#121417` (Grafite escuro quase negro)
* **Superfície Elevada / Hover de Itens:** `#1B1E22`
* **Cor de Destaque / Item Ativo:** Ouro Envelhecido `#C5A059`
* **Texto Principal:** `#F4F3EF` (Legibilidade perfeita sem agredir a visão)
* **Texto Secundário / Categorias:** `#7E838B` (Caixa alta, tamanho reduzido: 11px, `letter-spacing: 0.08em`)
* **Borda / Divisórias:** `#22262B`

### 2.2 Estrutura do Sidebar no Mobile (Drawer de Navegação)
* **Comportamento:**
  * Desliza a partir da esquerda (*Slide from Left*) cobrindo 80% a 85% da tela (largura máxima 320px).
  * *Backdrop Blur*: Fundo escuro com desfoque (`backdrop-filter: blur(8px); background: rgba(0,0,0,0.65)`).
  * Gestos: Fechamento por botão `X` superior ou arrastar para a esquerda (*swipe-to-close*).
* **Organização das Seções:**
  * **Topo do Drawer:**
    * Brasão / Logo da Paróquia com subtítulo da Diocese.
    * Card de Status do Fiel: Botão de Login `[ Entrar / Meus Cursos / Meu Dízimo ]`.
  * **Corpo do Menu (Agrupamentos):**
    * *LITURGIA & VIDA:* Horários de Missas, Confissões, Leituras de Hoje, Transmissão Ao Vivo.
    * *FORMAÇÃO & NOTÍCIAS:* Avisos da Semana, Artigos do Padre, Boletim Dominical em PDF.
    * *SECRETARIA & SACRAMENTOS:* Batismo, Casamento, Agendamento de Atendimento, WhatsApp Direto.
    * *PARTILHA:* Dízimo Online (PIX), Ofertas, Obras de Reforma.
  * **Rodapé do Drawer:**
    * Seletor de Acessibilidade: `[ A- | Normal | A+ ]`.
    * Links para Redes Sociais da Paróquia (Instagram, YouTube, WhatsApp).

### 2.3 Estrutura do Sidebar no Backend (Painel Administrativo da Paróquia)
* **Comportamento no Desktop:**
  * Barra lateral fixa persistente: 260px (expandida) / 72px (colapsada em modo ícones).
  * Transição suave com tooltip nos ícones colapsados.
* **Organização dos Módulos do Backend:**
  * **Header:** Logo da Paróquia + Dropdown para selecionar comunidade/capela (*Matriz*, *Capela São José*, etc.).
  * **Menu Administrativo:**
    1. **Dashboard:** Visão geral de acessos, visualizações da transmissão e dízimo do mês.
    2. **Liturgia & Celebrações:** Cadastro de horários fixos e especiais (semana santa, natal, festas), escala de padres e intenções de missa recebidas.
    3. **Comunicação & Conteúdo:**
       * *Avisos e Mural* (Criar novo aviso, fixar no topo, expirar em data X).
       * *Notícias e Artigos* (Editor de texto estilo Word/Markdown).
       * *Transmissão Ao Vivo* (Inserir ID da live do YouTube com ativação automática).
    4. **Dízimo & Financeiro:** Extrato de doações PIX recebidas, relatório de dizimistas ativos e comprovantes.
    5. **Secretaria & Atendimentos:** Pedidos de sacramentos recebidos, dúvidas do WhatsApp e agendamentos.
    6. **Configurações & White-Label:** Upload de brasão/fotos, seleção de cores do tema (Mariano, Romano, Pastoral, Catedral) e dados bancários/PIX.
  * **Footer do Sidebar:**
    * Perfil do Usuário logado (*Pe. João / Secretária Maria*).
    * Botão de "Ver Site da Paróquia" (abre em nova aba) e "Sair".

---

## 3. Galeria da Sucessão Apostólica (Inspirada no Vaticano)
**Referência:** [vatican.va](https://www.vatican.va/content/vatican/pt.html) — *Os Sumos Pontífices / A Sucessão Apostólica*  
**Aplicação no Ecclesiam App:** Módulo **"Histórico de Párocos & Bispos da Paróquia"** (Galeria Histórica / Memorial Paroquial).

### 3.1 O Modelo do Vaticano
No portal da Santa Sé, a Sucessão Apostólica documenta a linhagem ininterrupta de bispos de Roma desde São Pedro. Cada pontífice possui:
1. **Nome Oficial:** (ex.: *Papa Francisco*, *Papa Bento XVI*, *São João Paulo II*).
2. **Datas Canônicas:** Período exato do mandato (*Início e Fim do Pontificado*).
3. **Dados Biográficos:** Nome secular/de nascimento, local de nascimento e século/época.
4. **Símbolos Heráldicos:** Brasão de armas papal, lema pastoral e retrato oficial.
5. **Documentos e Obras:** Principais encíclicas, cartas apostólicas e legados históricos.

### 3.2 Adaptação para o Ecclesiam App: "Galeria de Párocos da Paróquia"
As paróquias católicas (especialmente as mais antigas e catedrais) têm enorme orgulho de sua história e dos sacerdotes que a construíram.

#### Modelo de Dados (Supabase / PostgreSQL)
```sql
create table parish_pastors (
  id uuid primary key default gen_random_uuid(),
  parish_id uuid references parishes(id) on delete cascade,
  priest_name text not null,          -- Nome canônico (ex.: Pe. Antônio de Pádua)
  secular_name text,                  -- Nome civil/nascimento
  order_number int not null,          -- 1º Pároco, 2º Pároco...
  start_year int not null,            -- Ano de posse
  end_year int,                       -- Ano de término (null se atual)
  is_current boolean default false,   -- Indicador de Pároco Atual
  motto text,                         -- Lema sacerdotal (ex.: "Oportet Illum Crescere")
  biography text,                     -- Histórico pastoral e vocacional
  legacy_highlights jsonb,            -- Obras realizadas (construção da torre, criação de capelas)
  portrait_url text,                  -- Retrato oficial em alta resolução
  created_at timestamptz default now()
);
```

#### Componente Visual: "Linha do Tempo Eclesial"
* **Aba no Menu "Sobre a Paróquia" $\rightarrow$ "Nossa História & Galeria de Párocos"**.
* **Destaque do Pároco Atual:**
  * Card de honra no topo: Foto oficial com batina/estola, nome, data de posse, lema sacerdotal e saudação fraterna aos paroquianos.
* **Linha do Tempo Histórica (Timeline Vertical):**
  * Marcadores verticais dourados conectando cada pároco em ordem cronológica reversa (do mais recente até o fundador da paróquia).
  * Retratos em preto e branco / sépia com tratamento visual unificado.
  * *Badge de Memória:* "In Memoriam" ou "Pároco Emérito".
  * *Sanfona Expansível (Accordion):* Ao clicar, abre as principais realizações daquele período (ex.: *"1954: Instalação dos vitrais alemães; 1962: Criação da Capela São Judas"*).

---

## 4. Design System: Padre Alex Nogueira
**URL:** [padrealexnogueira.com](https://www.padrealexnogueira.com)  
**Conceito Central:** Acolhimento Quente, Conexão Popular, Legibilidade Acessível e Dinamismo de Conteúdo.

### 4.1 Extração Fiel de Variáveis & Tokens do CSS de Produção

#### A. Tipografia
* **Headings de Destaque / Títulos:** `Suez One` (Google Fonts) — fonte display robusta, acolhedora, com serifa arredondada e presença amigável.
* **Corpo de Texto, Menus e Botões:** `Sora` (Google Fonts: 300, 400, 500, 600, 700) — fonte geométrica limpa, excelente para leitura em smartphones e para fiéis de qualquer faixa etária.

#### B. Paleta de Cores Oficial (Tokens Extraídos)
* **Fundos Acolhedores:**
  * Fundo Pergaminho Claro (`--background--50`): `#F5EFE7`
  * Fundo Areia Quente (`--background--100`): `#EEE3D4`
  * Fundo Escuro Nobre (`--background--950`): `#131313`
  * Fundo Café / Madeira (`--background--900`): `#211A14`
* **Cores de Texto:**
  * Texto Primário (`--text--primary`): `#2D1A16` (Marrom ébano profundo)
  * Texto Secundário (`--text--secondary`): `#514D4B` (Cinza sépia)
  * Texto Claro (`--text--light`): `#FCF7F1`
* **Destaques & Acentos:**
  * Ouro Vivo (`--brand--gold-500`): `#FFA82A`
  * Ouro Quente / Âmbar (`--brand--gold-400`): `#FFCC36`
  * Ouro Queimado / Terracota (`--brand--gold-700`): `#B75319`
  * Azul Petróleo / Twilight (`--brand--twilight-600`): `#03637A` (Usado para links e orações)
  * Verde Nobre Litúrgico (`--brand--como-500`): `#356B58`
  * Azul Real Litúrgico (`--brand--blue-700`): `#305AAD`

### 4.2 Componentes e Padrões de Layout
1. **Marquee / Faixa de Avisos Superior:**
   * Barra horizontal contínua com animação linear infinita (`banner_horizontal`) para avisos urgentes (ex.: *"Inscrições abertas para a Catequese"* ou *"Festa da Padroeira neste domingo"*).
2. **Slider de Destaques Responsivo:**
   * Imagens duplas servidas via `.webp` (uma versão horizontal recortada para `desktop` e uma vertical/quadrada para `mobile`), com texto sobreposto à esquerda e botão com cantos suaves.
3. **Pills e Badges (.tag-gold):**
   * Tags arredondadas estilo pílula (`border-radius: 99rem; padding: 0.25rem 0.625rem`) com fundo claro e texto de categoria (ex.: *"Novenas"*, *"Liturgia"*, *"Pastorais"*).
4. **Cards de Conteúdo com Truncamento Suave:**
   * Classes `.text-style-2lines` e `.text-style-3lines` via `-webkit-line-clamp` para manter a grade alinhada perfeitamente independentemente do tamanho do título ou resumo.
