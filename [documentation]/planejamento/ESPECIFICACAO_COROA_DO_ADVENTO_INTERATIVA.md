# 🕯️ Especificação Técnica & Pastoral: Coroa do Advento Viva & Sistema Imersivo de Cores

> **Documento Canônico de Especificação de Produto (SSOT)**  
> **Módulo:** Tempo do Advento & Natal 2026 • Ecclesiam App  
> **Paróquia Piloto:** Catedral do Sagrado Coração de Jesus (Diocese de Colatina)  
> **Definição via Grill-Me:** 27 de Outubro de 2026  

---

## 🏛️ 1. Visão Geral & Significado Litúrgico

O tempo do **Advento** (do latim *Adventus*, "Vinda / Chegada") marca as quatro semanas que inauguram o **Ano Litúrgico da Igreja Católica** e preparam a comunidade para a celebração do Natal do Senhor.

A **Coroa do Advento** é um dos memoriais litúrgicos e catequéticos mais amados pelos fiéis:
1. **O Círculo de Ramos Verdes:** A eternidade de Deus, sem começo nem fim, e a esperança cristã que nunca fenece.
2. **A Fita Vermelha:** O amor infinito do Pai que enviou Seu Filho unigênito para nos salvar.
3. **As Quatro Velas Dominicais:** A luz de Cristo que cresce progressivamente semana após semana dissipando as trevas do mundo.
4. **A 5ª Vela Central (Noite Santa de Natal):** A **Vela Branca de Cristo** (*Christ Candle*), acesa na Vigília do Natal para proclamar que o Verbo se fez carne e habitou entre nós.

---

## 🎨 2. Tradição Catequética das Cores das Velas & Atmosfera do Portal

Em alinhamento pastoral com a catequese da Catedral, adotamos a **Tradição das 4 Cores Catequéticas**, sincronizada com o **Tema Imersivo** de cores do portal em cada domingo:

| Domingo do Advento | Período (2026) | Cor da Vela | Simbolismo Catequético & Bíblico | Atmosfera Litúrgica do Portal |
| :--- | :---: | :---: | :--- | :--- |
| **1º Domingo** | **29/11 a 05/12** | 🟣 **Roxa** | **Vigilância & Esperança:** A promessa de redenção feita a Adão e Eva e o anúncio dos profetas. | **Roxo Litúrgico** (Conversão e vigília) |
| **2º Domingo** | **06/12 a 12/12** | 🔴 **Vermelha** | **Amor de Deus & Fé dos Patriarcas:** A aliança com Abraão, Isaac e Jacó rumo à Terra Prometida. | **Vermelho Eclesial** (Amor e fé inabalável) |
| **3º Domingo (Gaudete)** | **13/12 a 19/12** | 🌸 **Rosa** | **Alegria do Rei Davi:** *"Alegrai-vos sempre no Senhor!"* — A salvação está próxima. | **Rosa Gaudete** (Alegria do Senhor) |
| **4º Domingo** | **20/12 a 24/12** | ⚪ **Branca** | **Os Profetas & Maria Santíssima:** A pureza da Virgem Mãe, o sim de Nazaré e a Paz de Deus. | **Branco / Dourado** (Pureza e Alvorada) |
| **Natividade do Senhor** | **24/12 noite e 25/12** | 🌟 **Vela Central Branca** | **A Luz do Mundo:** O nascimento do Menino Deus deitado na manjedoura. | **Ouro & Branco Solene** (Glória a Deus nas alturas) |

---

## 🖥️ 3. Arquitetura de Interface & UX/UI (Mobile-First Extremo)

### 3.1. Posicionamento
* **Local:** Banner Hero Monumental posicionado no **topo da Home da Catedral**, logo abaixo do Header e acima da grade de horários de missas de hoje.
* **Elemento:** Componente modular `AdventWreathBanner.tsx`.

### 3.2. Ilustração Vetorial & Animação das Chamas (Low-End Performance)
* **Vetor SVG Artesanal:** Ilustração da coroa circular de ramos verdes com detalhes de folhagens, fita laçada em vermelho e as velas com texturas litúrgicas.
* **Chamas em CSS Nativo:**
  * Uso estrito de transições aceleradas por GPU (`transform`, `opacity`, `filter: drop-shadow`).
  * Efeito de cintilação suave (`@keyframes flame-flicker`) que simula a chama de cera tremulando ao vento com halo de luz dourado.
  * Zero bibliotecas pesadas de terceiros (zero Framer Motion ou Three.js), peso total < 20KB, garantindo carregamento instantâneo em conexões 3G e celulares modestos.

### 3.3. Interatividade Fiel-Pastoral
* **Velas Vivas:** As velas correspondentes aos domingos já transcorridos permanecem acesas. As velas futuras permanecem com o pavio escuro.
* **Toque / Clique na Vela:** Ao tocar em qualquer uma das velas (acesa ou por acender), abre-se um modal pastoral solene com:
  1. Oração familiar de bênção daquela vela.
  2. Significado catequético profundo e versículo bíblico.
  3. Sugestão de gesto fraterno para a semana (caridade, perdão, visita a um enfermo).

---

## ⚙️ 4. Motor Lógico & Painel de Simulação Administrativo

### 4.1. Detecção Automática do Calendário (`lib/advent.ts`)
* Função que avalia a data atual e retorna:
  * `currentWeek`: 1, 2, 3, 4 ou `natal`.
  * `liturgicalColor`: 'roxo' | 'vermelho' | 'rosa' | 'branco'.
  * `candleStates`: Array com status de cada vela (`isLit`, `color`, `theme`, `prayer`).
  * `daysUntilChristmas`: Contagem regressiva de dias.

### 4.2. Simulador Administrativo no `/admin/aparencia`
* Seletor rápido para a equipe paroquial e desenvolvedores:
  * `[Modo Automático por Data (Tempo Real)]`
  * `[Simular 1º Domingo - Vela Roxa]`
  * `[Simular 2º Domingo - Vela Vermelha]`
  * `[Simular 3º Domingo - Vela Rosa Gaudete]`
  * `[Simular 4º Domingo - Vela Branca]`
  * `[Simular Noite de Natal - 5ª Vela Central]`
* Armazenamento persistido em cookie/localStorage administrativo para homologação e validação prévia.

---

## ⏱️ 5. Plano de Implementação & Estimativa de Tempo

| Etapa | Escopo de Trabalho | Arquivos Envolvidos | Tempo Estimado |
| :---: | :--- | :--- | :---: |
| **Etapa 1** | Motor Lógico do Advento (`lib/advent.ts`) e integração com `lib/liturgy.ts` | `lib/advent.ts`, `lib/liturgy.ts`, `types/index.ts` | **~25 minutos** |
| **Etapa 2** | SVG Artesanal da Coroa & Chamas Vivas em CSS Nativo | `components/advent/AdventWreathSvg.tsx`, `app/globals.css` | **~35 minutos** |
| **Etapa 3** | Banner Hero Monumental & Modal de Oração Familiar | `components/advent/AdventWreathBanner.tsx`, `components/advent/AdventCandleModal.tsx` | **~40 minutos** |
| **Etapa 4** | Painel de Simulação do Pároco em `/admin/aparencia` | `components/admin/aparencia/AdventPreviewControl.tsx`, `app/admin/aparencia/page.tsx` | **~30 minutos** |
| **Etapa 5** | Auditoria UX/UI, Validação Mobile 375px e Build (`npm run build`) | Código global e testes | **~15 minutos** |
| **TOTAL** | **Desenvolvimento Pleno da Coroa do Advento Viva** | **Ecossistema Completo** | **⏱️ ~2h25min** |
