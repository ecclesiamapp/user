# 🎨 Protocolo de Desenvolvimento UX/UI - Ecclesiam App

Este protocolo define os padrões visuais, de design e experiência do usuário (UX) obrigatórios para todas as telas do **Ecclesiam App**, tanto no **Painel Administrativo da Paróquia** quanto no **Portal Digital da Paróquia** (fiel).

---

## 01. Regras de CSS para Tema Claro/Escuro (Dark Mode)
**NUNCA utilize cores fixas do Tailwind para estrutura básica (ex: `bg-white`, `bg-black`, `text-black`, `text-white`)**. Isso quebra a inversão de temas e a personalização de cores por paróquia.

* **Fundo de Telas e Painéis Principais:** Utilize `bg-[var(--dash-bg)]` ou equivalente semântico (`bg-background`).
* **Fundo de Cards, Modais e Caixas:** Utilize `bg-[var(--dash-surface)]` ou `bg-[var(--dash-surface-secondary)]`.
* **Texto Principal (Títulos, Textos de Leitura):** Utilize `text-[var(--dash-text-primary)]` ou `text-foreground`.
* **Texto Secundário (Descrições, Labels):** Utilize `text-[var(--dash-text-secondary)]` ou `text-muted-foreground`.
* **Bordas (Dividers, Contornos de Cards):** Utilize `border-[var(--dash-border)]` ou `border-border`.

*Exceção Litúrgica/Pastoral:* Cores de destaque (ex: verde litúrgico, roxo quaresmal, vermelho pentecostal ou dourado festivo) e botões de ação utilizam a cor primária configurada da paróquia (`var(--primary)`), garantindo total flexibilidade White-Label.

---

## 02. Feedback Visual e Interações (Micro-interações)
* **Ações de Demora (Salvando, Carregando, Gerando QR Code PIX):** Todo botão de submissão de formulário ou ação assíncrona DEVE obrigatoriamente mudar seu estado para desabilitado (`disabled={true}`) e exibir um spinner/loader (ex: `<Loader2 className="animate-spin" />` do Lucide-React).
* **Feedback de Hover:** Todos os botões clicáveis devem ter transição de hover (ex: `transition-all duration-200 hover:scale-[1.02]` ou `hover:opacity-90`) para demonstrar interatividade.
* **Alertas e Notificações:** Exibir mensagens de erro sempre em caixas com contraste (fundo com tom avermelhado suave) acompanhadas de um ícone de alerta (ex: `AlertTriangle`), nunca usar texto vermelho solto e descontextualizado na tela.

---

## 03. Glassmorphism e Efeitos Premium
Para dar um aspecto moderno e sofisticado, elementos flutuantes (como Headers fixos ou modais sobrepostos) devem usar o efeito de vidro (Glassmorphism).
* Utilize classes utilitárias com `backdrop-blur-xl` e fundos semitransparentes (ex: `bg-background/80 backdrop-blur-md border-b border-border/50`).

---

## 04. Responsividade e Diagramação (Mobile-First Extremo para o Fiel)
Mais de **85% a 90%** dos acessos ao portal público da paróquia serão realizados via smartphones, incluindo uma parcela significativa de paroquianos idosos e fiéis portando aparelhos populares ou antigos (ex.: linhas de entrada Android e iPhones anteriores).

### 4.1 Regras de Diagramação e CSS
* **Arquitetura Visual 100% Mobile-First:** Todo layout, card, tabela e formulário DEVE ser projetado primeiro para larguras entre `360px` e `414px` (`flex-col`, `grid-cols-1`, `w-full`) e só expandir para `md:` e `lg:` quando estritamente necessário.
* **Alvos de Toque Acessíveis (Touch Targets):** Todo botão, link ou item clicável DEVE possuir altura e área de clique mínima de **`44px x 44px`** (classe Tailwind recomendada: `min-h-[44px]` ou `p-3`), prevenindo cliques acidentais e facilitando o toque de pessoas idosas.
* **Tipografia Adaptativa e Legibilidade Alta:**
  * O tamanho mínimo para texto de leitura contínua é **`15px-16px`** (`text-sm` a `text-base`).
  * Legendas e metadados nunca devem ser inferiores a **`12px`** (`text-xs`).
  * Textos longos devem sempre ter proteção contra estouro de linha com `break-words` e o container pai com `overflow-x-hidden`.
* **Navegação Rápida:** Drawer lateral móvel fluido com botão de fechamento evidente (`X`), fundo com desfoque moderado e atalhos diretos para WhatsApp e Dízimo.

### 4.2 Hiper-Desempenho para Celulares Populares e Antigos (Low-End Devices)
* **Zero Bloqueio de Thread de UI:** Não utilizar bibliotecas pesadas de animação em JavaScript (ex.: evitar pacotes desnecessários de física/3D). Utilize animações puramente via CSS nativo (`transition-transform`, `opacity`, `translate-y`) com aceleração por GPU.
* **Gestão Consciente de Mídia:**
  * **Imagens:** Devem ser servidas obrigatoriamente no formato moderno `.webp` ou `.avif`, com atributo `loading="lazy"` para qualquer imagem fora da primeira dobra.
  * **Vídeos e Iframes no Mobile:** Loops de vídeo pesados no topo NÃO devem sobrecarregar celulares antigos com conexões 3G/4G instáveis. No mobile, dê preferência a um poster/fotografia leve e carregue o streaming de vídeo apenas mediante clique explícito do usuário (*Tap-to-Play*).
* **DOM Leve e Rápido:** Limitar o aninhamento de `divs` a um máximo de 4 a 5 níveis para que o motor de renderização de navegadores mais antigos (ex.: Chrome 80-90 / Safari iOS antigos) processe a árvore de layout em menos de 100ms.
* **Capacidade PWA e Cache Offline:** Aproveitar o Service Worker do PWA para servir dados em cache instantâneo e garantir que a programação de missas abra mesmo na ausência de sinal.

---

## 05. Regras de Arredondamento de Cantos (Border Radius)
Seguindo o design system premium e acolhedor (Padrão Apple/Modern SaaS):

* **Cards Grandes, Painéis, Modais e Blocos de Horários:** Devem utilizar obrigatoriamente cantos bem arredondados: `rounded-2xl` (ou `rounded-[24px]`).
* **Botões Principais, Inputs de Texto, Selects e Caixas Menores:** Devem utilizar obrigatoriamente `rounded-xl` ou `rounded-lg`.
* **Badges, Tags Litúrgicas e Status:** Devem utilizar `rounded-full` ou `rounded-md` com tipografia nítida e espaçamento proporcional.
* **NUNCA** utilize cantos quadrados (`rounded-none`) ou arredondamentos ríspidos (`rounded-sm`) em componentes modernos da aplicação.

---

## 06. Regra de Padding para Menus Dropdown (Selects)
Ao criar ou modificar elementos HTML `<select>`:
* **SEMPRE** garanta um padding maior à direita para evitar que o ícone de seta nativo sobreponha o texto.
* Use a classe utilitária `.dash-select` ou `appearance-none pr-10 pl-3.5 py-2 rounded-xl`.
