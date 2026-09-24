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

## 04. Responsividade e Layout (Mobile-First para o Fiel)
* O fiel acessará a programação de missas e doações principalmente pelo smartphone. As telas públicas do portal devem ser 100% pensadas para mobile-first.
* O Painel Administrativo deve adaptar suas tabelas e formulários para telas compactas sem estourar o viewport lateral.
* **Otimização de Espaços:** Em formulários e cards de gerenciamento com poucos campos, evite vazios excessivos distribuindo os inputs em duas colunas responsivas (`grid grid-cols-1 md:grid-cols-2 gap-4`).

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
