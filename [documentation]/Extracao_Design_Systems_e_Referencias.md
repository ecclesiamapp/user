# Documentação Oficial de Extrações de Design Systems & Referências Eclesiais
**Projeto:** Ecclesiam App (Plataforma SaaS White-Label para Paróquias)  
**Data:** 29 de Setembro de 2026  
**Status:** Aprovado para Modelagem e Engenharia de UI/UX  

---

## Sumário Executivo
Este documento consolida as extrações técnicas, tokens de estilo, estruturas de navegação e padrões arquiteturais derivados de quatro referências digitais católicas de padrão internacional e nacional:
1. **[St. Patrick's Cathedral (Nova York)](https://saintpatrickscathedral.org/):** Design System monumental, "Regra dos 4 Segundos", cartões flutuantes de horários e arrecadação nobre.
2. **[Padre Alex Nogueira (padrealexnogueira.com)](https://www.padrealexnogueira.com/):** Tokens extraídos diretamente do CSS de produção, tipografia (`Suez One` + `Sora`), paleta quente/acolhedora, marquee de avisos e componentes responsivos.
3. **[Padre Paulo Ricardo (padrepauloricardo.org)](https://padrepauloricardo.org/):** Estilo solene escuro (*"Beneditino Digital"*), arquitetura do Sidebar/Drawer lateral para dispositivos móveis e painel administrativo (backend).
4. **[Santa Sé / Vaticano (vatican.va)](https://www.vatican.va/content/vatican/pt.html):** Seção da Sucessão Apostólica modelada tecnicamente para a "Galeria Histórica de Párocos da Paróquia", incluindo schema SQL para Supabase.

---

## 1. Design System: St. Patrick's Cathedral (NY)
*Referência:* [saintpatrickscathedral.org](https://saintpatrickscathedral.org/)  
*Pilar Conceitual:* **Hospitalidade Digital, Solenidade Litúrgica e Monumentalidade.**

### 1.1 A "Regra dos 4 Segundos" (Dobra Superior / Above the Fold)
Ao entrar na Home, o visitante deve encontrar sem rolagem:
1. **Próxima Celebração Hoje:** Missas, Confissões e Adoração com horário em destaque.
2. **Status de Transmissão:** Indicador em tempo real se a paróquia está transmitindo ao vivo agora.
3. **Endereço e Visitação:** Localização física e horários de portas abertas do templo.

### 1.2 Paleta de Cores e Tokens
| Token | Cor Hexadecimal | Nome Eclesial | Aplicação no Sistema |
| :--- | :--- | :--- | :--- |
| `catedral-dark` | `#16181B` | Basalto / Ébano Catedral | Fundo solene do hero, header imersivo e rodapé |
| `catedral-surface` | `#1F2226` | Ardósia Escura | Superfície de cards sobrepostos em fundo escuro |
| `catedral-light` | `#F8F7F4` | Mármore Alabastro | Fundo geral da página para leitura confortável |
| `catedral-gold` | `#C8A463` | Ouro Sacro / Champagne | Acento nobre, bordas, ícones sacros e botões outline |
| `catedral-gold-hover`| `#D4AF37` | Ouro Polido | Estado de hover e itens ativos |
| `catedral-live` | `#D32F2F` | Carmesim Litúrgico | Badge pulsante "AO VIVO AGORA" |
| `catedral-text-main` | `#121314` | Grafite Profundo | Texto principal em superfície clara |
| `catedral-text-muted`| `#5E6268` | Pedra Média | Subtítulos e dados secundários |

### 1.3 Tipografia Eclesial
* **Display / Títulos Solenes (Serif):** `Cinzel` ou `Cormorant Garamond`
  * Caixa alta (*UPPERCASE*), `letter-spacing: 0.12em` a `0.18em`, peso 600/700.
* **Corpo de Texto, Horários e Formulários (Sans-Serif):** `Plus Jakarta Sans` ou `Inter`
  * Aplicação mandatória da propriedade `font-variant-numeric: tabular-nums` para que números de relógio (ex.: `07:00`, `12:00`, `19:30`) mantenham largura idêntica e alinhamento vertical perfeito.

### 1.4 Componentes Específicos Modelados
* **Floating Schedule Card:** Card flutuante posicionado entre a imagem hero e a primeira seção, exibindo:
  * `"Hoje na Matriz: Missa às 19h30 • Confissões das 17h às 19h"`.
  * Botão de 1 clique: `[ Ver grade completa da semana e capelas ]`.
* **Módulo "Preserve o Nosso Templo" (Giving Digno):** Doação não mercantilizada, apresentada como dever fraterno de conservação e sustento pastoral:
  * Valores pré-sugeridos: R$ 30, R$ 50, R$ 100 ou Outro valor.
  * Checkout direto via PIX Copia e Cola / QR Code com mensagem pastoral de gratidão.

---

## 2. Extração Real do Design System: Padre Alex Nogueira
*Referência:* [padrealexnogueira.com](https://www.padrealexnogueira.com/)  
*Pilar Conceitual:* **Acolhimento Quente, Conexão Popular, Legibilidade Geriátrica e Dinamismo.**

### 2.1 Tipografia Oficial Identificada
* **Títulos & Headlines:** `Suez One` (Google Fonts) — Serifada display encorpada, calorosa e com traços acolhedores.
* **Corpo de Texto, Menus e Botões:** `Sora` (Google Fonts: 300, 400, 500, 600, 700) — Geométrica moderna com excelente abertura de caracteres, altamente recomendada para idosos.

### 2.2 Dicionário de Cores & Tokens Extraídos do CSS `:root`
```css
:root {
  /* Fundos Acolhedores */
  --background--50: #F5EFE7;           /* Fundo pergaminho quente */
  --background--100: #EEE3D4;          /* Fundo areia acolhedor */
  --background--900: #211A14;          /* Fundo café escuro */
  --background--950: #131313;          /* Fundo grafite profundo */

  /* Textos */
  --text--primary: #2D1A16;            /* Marrom ébano de alta legibilidade */
  --text--secondary: #514D4B;          /* Sépia médio */
  --text--light: #FCF7F1;              /* Off-white quente para fundos escuros */

  /* Acentos de Marca e Pastorais */
  --brand--gold-500: #FFA82A;          /* Ouro vivo / âmbar */
  --brand--gold-400: #FFCC36;          /* Ouro suave */
  --brand--gold-700: #B75319;          /* Ouro queimado / terracota */
  --brand--twilight-600: #03637A;      /* Azul petróleo (Orações / Formação) */
  --brand--como-500: #356B58;          /* Verde pastoral litúrgico */
  --brand--blue-700: #305AAD;          /* Azul Mariano tradicional */

  /* Bordas e Divisões */
  --border--neutral: #DBE1E6;
  --border--dark: #303030;
}
```

### 2.3 Componentes e Padrões Funcionais Extraídos
1. **Marquee de Avisos Urgentes (`banner_horizontal`):**
   * Faixa superior horizontal com texto contínuo em rolagem infinita linear (CSS `animation: banner_horizontal 120s linear infinite`), ideal para: avisos de festas patronais, mutirão de confissões e inscrições de catequese.
2. **Pill Badges (`.tag-gold`):**
   * Badges de cantos 100% arredondados (`border-radius: 99rem; padding: 0.25rem 0.625rem; font-size: 0.9rem`) em fundo bege claro com texto marrom escuro para rotular categorias de artigos, pastorais e avisos.
3. **Hero Slider com Recorte Duplo Responsivo:**
   * Uso de imagens em formato `.webp` separadas para Desktop (panorâmico) e Mobile (quadrado/vertical), eliminando deformação em smartphones.
4. **Alinhamento e Truncamento de Cards:**
   * Utilização padronizada de `.text-style-2lines` e `.text-style-3lines` via `-webkit-line-clamp` para assegurar que títulos e resumos mantenham a grade simétrica.

---

## 3. Sidebar System: Padre Paulo Ricardo (Mobile & Backend)
*Referência:* [padrepauloricardo.org](https://padrepauloricardo.org/)  
*Pilar Conceitual:* **Filosofia "Beneditina Digital" (*Ora et Labora*) — Escuro, Solene, Monástico e Focado em Conteúdo.**

### 3.1 Atmosfera Visual do Sidebar
* **Background:** `#0E1012` ou `#121417` (Grafite monástico escuro)
* **Item em Hover:** `#1B1E22`
* **Item Ativo:** Borda lateral à esquerda de 3px em Ouro `#C5A059` e fundo sutilmente iluminado
* **Texto Primário:** `#F4F3EF`
* **Rótulo de Seções (Categorias):** `#7E838B` (Caixa alta, 11px, `letter-spacing: 0.08em`)

### 3.2 Implementação Mobile (Drawer de Navegação do Fiel)
* **Comportamento UX:**
  * Desliza suavemente a partir da lateral esquerda (*Slide from Left*) ao tocar no ícone de hambúrguer `≡ MENU`.
  * Largura: 82% da viewport (máximo de 320px).
  * Fundo com desfoque (*Backdrop blur* de 8px e opacidade preta de 65%).
  * Fechamento por gesto de arrastar para a esquerda (*swipe-to-close*) ou toque no botão de fechar.
* **Hierarquia de Conteúdo:**
  * **Cabeçalho:** Brasão da Paróquia + Diocese + Botão de Login/Perfil do Fiel `[ Entrar / Meu Dízimo ]`.
  * **Grupo 1 — Liturgia & Oração:** Missas de Hoje, Confissões, Leituras Bíblicas do Dia, Transmissão Ao Vivo.
  * **Grupo 2 — Comunidade & Notícias:** Avisos da Semana, Mural Paroquial, Folheto Dominical em PDF.
  * **Grupo 3 — Secretaria & Atendimento:** Batismo, Casamento, Agendamento com o Padre, Botão de WhatsApp Direto.
  * **Grupo 4 — Partilha Fraterna:** Devolução do Dízimo via PIX, Campanhas de Reforma do Templo.
  * **Rodapé do Menu:** Botões de Acessibilidade Geriátrica `[ A- | Normal | A+ ]` e ícones das redes sociais oficiais.

### 3.3 Implementação Backend (Painel Administrativo da Paróquia)
* **Comportamento UX:**
  * Sidebar fixa no Desktop com largura de **260px** no modo expandido e **72px** no modo colapsado (apenas ícones).
* **Módulos de Gestão:**
  1. **Dashboard Geral:** Visão de acessos ao site/app, audiência da transmissão e doações PIX do mês.
  2. **Liturgia & Celebrações:** Cadastro de horários normais e festivos, escala litúrgica e intenções de missa.
  3. **Comunicação:**
     * *Avisos e Marquee* (Criar aviso, definir data de expiração automática).
     * *Notícias e Artigos* (Editor de texto amigável).
     * *Transmissão Ao Vivo* (Vincular link/ID do YouTube com ativação em 1 clique).
  4. **Dízimo & Financeiro:** Extrato simplificado de PIX recebidos e relatórios de arrecadação por campanha.
  5. **Secretaria:** Caixa de entrada de pedidos de sacramentos e intenções para impressão da folha do padre.
  6. **Personalização White-Label:** Upload de brasão, seleção de capelas e escolha do tema de cores litúrgicas.

---

## 4. Galeria de Párocos: Inspirada na Sucessão Apostólica do Vaticano
*Referência:* [vatican.va](https://www.vatican.va/content/vatican/pt.html) — *Os Sumos Pontífices*  
*Aplicação no Ecclesiam App:* **Memorial / Galeria Histórica de Párocos e Fundadores da Paróquia.**

### 4.1 Conceito Eclesial
Assim como a Santa Sé preserva a linhagem apostólica desde São Pedro, as paróquias católicas possuem uma rica história sacerdotal. Este módulo digitaliza e eterniza a memória dos sacerdotes que serviram à comunidade, fortalecendo o vínculo afetivo e a tradição dos fiéis.

### 4.2 Schema do Banco de Dados (PostgreSQL / Supabase)
```sql
-- Tabela de Histórico de Párocos e Administradores Paroquiais
create table parish_pastors (
  id uuid primary key default gen_random_uuid(),
  parish_id uuid not null references parishes(id) on delete cascade,
  priest_name text not null,               -- Ex: "Côn. José Maria dos Santos"
  secular_name text,                       -- Nome civil de batismo
  origin_city text,                        -- Cidade e país de origem
  order_number int not null,               -- 1º Pároco, 2º Pároco...
  start_date date not null,                -- Data de posse / provisão canônica
  end_date date,                           -- Data de transferência ou falecimento (null se atual)
  is_current boolean default false,        -- Indicador de Pároco Atual
  motto text,                              -- Lema sacerdotal (ex: "In Cruce Salus")
  biography text,                          -- Resumo da trajetória sacerdotal
  legacy_highlights jsonb default '[]',    -- Conquistas: ["Construção da torre", "Criação do salão paroquial"]
  portrait_url text,                       -- Retrato oficial
  created_at timestamptz default now()
);

-- Índice para ordenação histórica rápida
create index idx_parish_pastors_order on parish_pastors(parish_id, order_number asc);
```

### 4.3 Componente de UI: Linha do Tempo Eclesial
1. **Destaque de Honra do Pároco Atual:**
   * Card solene no topo da página: Retrato oficial em alta definição, nome completo, data de posse canônica, lema sacerdotal e carta de saudação pastoral aos paroquianos.
2. **Timeline Vertical Dourada (Antecessores):**
   * Linha vertical fina dourada conectando cada sacerdote em ordem cronológica reversa.
   * Nós litúrgicos com retrato em tom sépia/P&B com borda dourada suave.
   * Badges de status: `"Pároco Fundador"`, `"Pároco Emérito"` ou `"In Memoriam"`.
   * *Accordion Expansível:* Ao clicar no nome do padre, expandem-se suas obras e realizações históricas na comunidade.

---

## 5. Configuração Unificada de Tokens (Tailwind CSS)

```javascript
// tailwind.config.js — Ecclesiam Design System Multi-Theme
module.exports = {
  theme: {
    extend: {
      colors: {
        ecclesiam: {
          // Tokens dinâmicos baseados no tema selecionado pela Paróquia
          primary: 'var(--ecclesiam-primary, #1B365D)',
          secondary: 'var(--ecclesiam-secondary, #C5A059)',
          bg: 'var(--ecclesiam-bg, #F9F8F5)',
          surface: 'var(--ecclesiam-surface, #FFFFFF)',
          surfaceElevated: 'var(--ecclesiam-surface-elevated, #F5EFE7)',
          border: 'var(--ecclesiam-border, #DBE1E6)',
          textMain: 'var(--ecclesiam-text-main, #1A1D20)',
          textMuted: 'var(--ecclesiam-text-muted, #5A5D63)',
          
          // Cores funcionais litúrgicas universais
          whatsapp: '#25D366',
          live: '#D32F2F',
          goldAccent: '#FFA82A',
          bordeaux: '#721C24'
        }
      },
      fontFamily: {
        // Títulos solenes
        serif: ['Cinzel', 'Suez One', 'Cormorant Garamond', 'serif'],
        // Corpo e interface funcional
        sans: ['Plus Jakarta Sans', 'Sora', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        pill: '99rem',
        card: '12px',
        btn: '8px',
      },
      boxShadow: {
        liturgical: '0 4px 20px -2px rgba(22, 24, 27, 0.08)',
        liturgicalHover: '0 8px 30px -4px rgba(22, 24, 27, 0.16)'
      }
    }
  }
}
```
