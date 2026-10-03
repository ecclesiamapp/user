# Design System & Benchmarks: Ecclesiam App
*Plataforma SaaS White-Label para Paróquias e Santuários Católicos*

---

## 1. Pesquisa de Benchmarks e Referências

### 1.1 Plataformas SaaS Especializadas

| Plataforma | Origem | Pontos Fortes | Oportunidade / Diferencial Ecclesiam |
| :--- | :--- | :--- | :--- |
| **eCatholic** ([ecatholic.com](https://www.ecatholic.com)) | EUA | • Padrão-ouro visual católico e solene.<br>• Módulo de Missas/Confissões sempre visível na dobra superior.<br>• Integração litúrgica diária. | É focado no mercado norte-americano. Não possui integração com o ecossistema brasileiro (PIX instantâneo, WhatsApp paroquial, nem gestão de múltiplas capelas/comunidades rurais e urbanas). |
| **Subsplash** ([subsplash.com](https://www.subsplash.com)) | Global | • Aplicativos móveis white-label de alto padrão.<br>• Notificações push por grupos/pastorais.<br>• Transmissões com player contínuo. | Foco primário protestante/evangélico com custo elevado em dólar; falta a sensibilidade dos ritos, sacramentos e solenidade católica. |
| **ParóquiaNet / Theòs** ([paroquianet.com.br](https://www.paroquianet.com.br)) | Brasil | • Grande presença em dioceses brasileiras.<br>• Sistema de cadastro e controle de dízimo. | Interfaces antigas, visual web corporativo/legado, sem foco em experiência do fiel, baixa usabilidade para idosos e sem identidade visual personalizada para cada paróquia. |
| **Tithe.ly** ([tithe.ly](https://get.tithe.ly)) | Global | • Doação ágil e transparente em poucos toques.<br>• Relatórios claros para a comunidade. | Excelente referência de checkout rápido e sem atrito, que no Ecclesiam é adaptada para PIX e linguagem pastoral de gratidão/partilha. |

---

### 1.2 Referências Visuais e Eclesiais

* **St. Patrick's Cathedral (NY)** ([saintpatrickscathedral.org](https://saintpatrickscathedral.org)): Tipografia romana serifada majestosa, contraste rigoroso, cartões de horários de celebrações em destaque no topo.
* **Santuário Nacional de Aparecida (Portal A12)** ([a12.com](https://www.a12.com)): Uso equilibrado do Azul Mariano e Dourado Sacro, mural de orações, transmissões ao vivo da Basílica e linguagem afetiva com a "Família dos Devotos".
* **Vatican News / Santa Sé** ([vaticannews.va](https://www.vaticannews.va)): Hierarquia tipográfica que une o Bordô Cardinalício com texto altamente legível em diferentes dispositivos.
* **Padre Paulo Ricardo** ([padrepauloricardo.org](https://padrepauloricardo.org)): Tom pergaminho/sépia de fundo com alto contraste, fontes humanistas e solenidade visual tradicional.

---

## 2. Princípios de Design do Ecclesiam App

1. **Solenidade & Fraternidade:** Interface que transmite reverência, paz e beleza litúrgica, sem parecer fria ou burocrática.
2. **Acessibilidade Geriátrica Nativa (WCAG AAA):** Mais de 40% do público frequente de paróquias é composto por idosos. Textos com alto contraste, alvos de clique amplos (mínimo 48px) e seletor rápido de escala de texto `[ A- | Padrão | A+ ]`.
3. **Linguagem Humana e Litúrgica:** O módulo de arrecadação substitui termos comerciais ("fatura", "cobrança", "boleto") por expressões fraternas: *"Devolução do Dízimo"*, *"Gesto Concreto"*, *"Oferta da Santa Missa"*.
4. **Arquitetura 100% White-Label:** A infraestrutura técnica do Ecclesiam é invisível ao fiel; o foco é total no brasão, nome, cores e comunidade da paróquia.

---

## 3. Temas Litúrgicos Customizáveis (White-Label)

O design system utiliza variáveis CSS estruturadas para que cada paróquia escolha seu tema patronal no painel administrativo:

### Tema 1: Mariano (Padrão sugerido)
* **Primária (Azul Mariano):** `#1B365D` (Profundo, digno, sereno)
* **Secundária / Destaque (Dourado Sacro):** `#C5A059` (Ouro eclesial refinado)
* **Fundo / Superfície Base:** `#F9F8F5` (Off-white pergaminho suave, menor fadiga visual)
* **Cards / Superfície Elevada:** `#FFFFFF`
* **Texto Principal:** `#1A1D20` (Contraste 12:1 com o fundo)

### Tema 2: Romano / Cardinalício (Cristocêntrico / Sagrado Coração / Mártires)
* **Primária (Bordô Cardinalício):** `#721C24` ou `#800020`
* **Secundária (Ouro Envelhecido):** `#D4AF37`
* **Fundo:** `#FAFAF7`
* **Texto Principal:** `#1E1B18`

### Tema 3: Pastoral / Esperança (São Francisco / São José / Tempo Comum)
* **Primária (Verde Litúrgico Nobre):** `#214D37`
* **Secundária (Trigo / Bege Suave):** `#D8C3A5`
* **Fundo:** `#F7F8F5`

### Cores de Ação Universais
* **Botão WhatsApp da Secretaria:** `#25D366`
* **Badge "Ao Vivo Agora":** `#D32F2F` (Pulsante litúrgico)
* **Card de Destaque "Hoje na Matriz":** `#EBF3FB` (Borda na cor primária do tema)

---

## 4. Tipografia do Sistema

* **Títulos Litúrgicos, Brasão e Nomes de Comunidades:**
  * Primária: `Cinzel` (Google Fonts) — inspirada em epigrafias romanas e frontispícios de catedrais.
  * Secundária / Subtítulos: `EB Garamond` ou `Cormorant Garamond` — elegância humanista e solene.
* **Corpo de Texto, Horários, Tabelas e Botões:**
  * `Plus Jakarta Sans` ou `Inter` — excelente legibilidade em telas pequenas, abertura clara de caracteres e suporte a numerais tabulares (`tabular-nums`) para horários (ex.: `07:00`, `19:30`).

---

## 5. Estrutura de Informação & Componentes Estruturais

```
┌────────────────────────────────────────────────────────────────────────┐
│ TOPO: Brasão | Seletor de Capela | Controle de Fonte [A-] [A+] | Whats │
├────────────────────────────────────────────────────────────────────────┤
│ HERO LITÚRGICO & PRÓXIMA CELEBRAÇÃO                                    │
│ • Foto de capa / Padroeiro                                             │
│ • Card flutuante: "HOJE NA MATRIZ: Próxima Missa às 19:30"             │
├────────────────────────────────────────────────────────────────────────┤
│ MURAL DE AVISOS & TRANSMISSÃO                                          │
│ • Player de Vídeo (se houver transmissão ao vivo acontecendo)          │
│ • Carrossel de Avisos Semanais e Notícias                              │
├────────────────────────────────────────────────────────────────────────┤
│ PASTORAL DO DÍZIMO & OFERTAS                                           │
│ • "Cada um dê conforme determinou em seu coração..." (2 Cor 9,7)       │
│ • Abas: [ Dízimo ] [ Oferta da Missa ] [ Obras Sociais ]               │
│ • PIX Copia e Cola / QR Code em 1 clique com mensagem explicativa      │
├────────────────────────────────────────────────────────────────────────┤
│ CENTRAL DE SACRAMENTOS & SECRETARIA                                    │
│ • Batismo | Casamento | Confissão | Intenções de Missa                 │
│ • Botões com mensagens pré-formatadas para o WhatsApp da secretaria    │
├────────────────────────────────────────────────────────────────────────┤
│ CAPELAS & COMUNIDADES VINCULADAS                                       │
│ • Grade com localização, padroeiro e horários de cada capela           │
├────────────────────────────────────────────────────────────────────────┤
│ RODAPÉ PASTORAL                                                        │
│ • Endereço, expediente da secretaria, redes sociais e telefone         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Tokens de UI Recomendados (Tailwind / Next.js)

```javascript
// tailwind.config.js / tokens
module.exports = {
  theme: {
    extend: {
      colors: {
        ecclesiam: {
          primary: 'var(--ecclesiam-primary, #1B365D)',
          secondary: 'var(--ecclesiam-secondary, #C5A059)',
          bg: 'var(--ecclesiam-bg, #F9F8F5)',
          surface: 'var(--ecclesiam-surface, #FFFFFF)',
          surfaceElevated: '#F4F2EB',
          border: '#E2DDD3',
          textMain: '#1A1D20',
          textMuted: '#5A5D63',
          whatsapp: '#25D366',
          live: '#D32F2F',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'EB Garamond', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(27, 54, 93, 0.06)',
        cardHover: '0 6px 18px rgba(27, 54, 93, 0.12)',
      }
    }
  }
}
```
