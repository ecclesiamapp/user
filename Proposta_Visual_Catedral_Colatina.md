# Proposta Visual Moderna: Catedral de Colatina (Paróquia Sagrado Coração de Jesus)
**Base de Design System:** Estilo & Tokens de [Padre Alex Nogueira](https://www.padrealexnogueira.com/)  
**Referência do Site Legado:** [catedraldecolatina.org.br/v1/](https://catedraldecolatina.org.br/v1/)  
**Pároco Atual:** Pe. Irineu Claudino Sales  
**Diocese:** Diocese de Colatina / ES  

---

## 1. Diagnóstico do Site Legado (v1) vs. Nova Proposta Moderna

| Aspecto | Site Atual (v1) | Nova Proposta Moderna (Estilo Pe. Alex) |
| :--- | :--- | :--- |
| **Primeira Impressão & Hero** | Lista de links azuis e ícones genéricos sem impacto visual acolhedor. | Banner Hero solene e acolhedor com foto da Catedral, tipografia `Suez One` e botão direto para transmissão ao vivo. |
| **Horários de Missa & Confissão** | Escondidos em submenu ou página de agenda (`?p=agenda`). | **Floating Schedule Card** (card flutuante com horário da missa de hoje em tamanho grande `19:30` e confissões logo na dobra superior). |
| **Mural de Avisos** | Texto corrido com ícones `[add]` de material design. | **Marquee Contínuo Superior** com avisos urgentes + Grade de cards com fotos e tags em pílula (`.tag-gold`). |
| **Dízimo & Ofertas** | Sem botão de destaque ou canal de PIX simples. | **Módulo "Sou do Sagrado, Sou Dizimista"** com chave PIX em 1 clique (copia e cola) e mensagem pastoral de gratidão. |
| **Secretaria & Atendimento** | Formulário frio ou número de telefone em texto simples. | **Cards de 1 Clique:** Batismo, Casamento e Fale com o Pároco com abertura de mensagem automática no WhatsApp. |
| **Acessibilidade para Idosos** | Letras pequenas e fontes padrão de sistema sem controle de escala. | Tipografia `Sora` com alta legibilidade e seletor `[ A- | Normal | A+ ]` fixo no cabeçalho. |

---

## 2. Aplicação dos Tokens do Design System Pe. Alex Nogueira

### 2.1 Paleta de Cores Adaptada ao Sagrado Coração de Jesus
* **Fundo Pergaminho Quente (`--background--50`):** `#F5EFE7` — Fundo principal que transmite acolhimento e calor humano, substituindo o branco hospitalar.
* **Vermelho Sagrado Coração:** `#8B1E22` / `#721C24` — Cor eclesial e patronal da Catedral, usada no marquee, detalhes litúrgicos e botões de destaque.
* **Ouro Âmbar / Sacro (`--brand--gold-500` / `--brand--gold-400`):** `#FFA82A` e `#FFCC36` — Usado em títulos de destaque, coroas e detalhes nobres.
* **Marrom Ébano de Leitura (`--text--primary`):** `#2D1A16` — Substitui o preto puro (`#000`), proporcionando leitura muito mais suave e contrastante (WCAG AAA).
* **Fundo Café Escuro / Banner de Dízimo (`--background--900`):** `#211A14` — Elegância e destaque para a seção de contribuição fraterna.

### 2.2 Tipografia Oficial
* **Títulos e Chamadas Principais:** `Suez One` (Google Fonts) — Presença solene, acolhedora e calorosa.
* **Corpo de Texto, Menus e Horários:** `Sora` (Google Fonts: 300, 400, 500, 600, 700) — Numerais claros para horários e formas abertas que facilitam a leitura em telas de smartphones.

---

## 3. Estrutura de Informação Mapeada da v1

1. **Faixa Superior de Rolagem (Marquee `banner_horizontal`):**
   * Avisos dinâmicos: *Festa do Sagrado Coração de Jesus 2026*, *Missa de Hoje às 19h30*, *Confissões na quinta-feira*, *Plantão da Secretaria*.
2. **Header Fixo:**
   * Brasão da Catedral + Diocese de Colatina.
   * Seletor de tamanho de fonte para fiéis idosos.
   * Botão de WhatsApp e Acesso ao Dízimo.
3. **Hero Monumental:**
   * "Bem-vindo à Casa do Sagrado Coração" + Botão de Missa Ao Vivo (com indicador pulsante vermelho).
4. **Card Flutuante de Horários de Hoje:**
   * Missa de Hoje na Matriz: `19:30` (Pe. Irineu Sales).
   * Confissões: `16:00 às 18:00`.
   * Expediente da Secretaria.
5. **Mural "Sou do Sagrado" (Notícias e Formação):**
   * Migração das notícias da v1 (*Ação Solidária*, *Programação Novena*, *Artigos do Sou do Sagrado Missa*).
6. **Pastoral do Dízimo ("Sou do Sagrado, Sou Dizimista"):**
   * Box de contribuição com chave PIX e botão de cópia com feedback instantâneo.
7. **Central de Sacramentos e Atendimento:**
   * Botões rápidos com abertura direta no WhatsApp da secretaria para: Batismo, Casamento, Intenções de Missa e Fale com o Pároco.
8. **Destaque do Pároco:**
   * Foto e mensagem pastoral do Pe. Irineu Claudino Sales, com link para o Memorial dos Párocos Anteriores.
9. **Rodapé Pastoral:**
   * Comunidades filiadas (São José, Santa Luzia, Santo Antônio, etc.), canais da Diocese e transmissão.

---

## 4. Arquivos do Protótipo Gerado

* **Protótipo Interativo em HTML:** [Proposta_Visual_Catedral_Colatina.html](file:///g:/Meu%20Drive/TRABALHOS/01%20-%20NEG%C3%93CIOS%20E%20PROJETOS%20ATIVOS/ECCLESIAN%20APP/AGENTE%20DE%20IA%20-%20ECCLESIAM/Proposta_Visual_Catedral_Colatina.html)
* **Cópia no Repositório do App:** [C:\Users\Start\ecclesiam-app\[documentation]\Proposta_Visual_Catedral_Colatina.html](file:///C:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/Proposta_Visual_Catedral_Colatina.html)
