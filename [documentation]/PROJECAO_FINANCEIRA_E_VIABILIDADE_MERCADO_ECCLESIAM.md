# 📈 Estudo de Viabilidade Econômica, Análise Competitiva & Projeção Financeira
## Plataforma Ecclesiam App (2026 – 2029)

> **Documento Estratégico & Modelo de Negócios SaaS (Versão Atualizada: Arquitetura Zero-Cost / Free Tier)**  
> **Data:** Outubro de 2026  
> **Finalidade:** Avaliação realista de retorno sobre investimento, tempo de mercado e projeção financeira com base na arquitetura Jamstack / Free Tier real.  
> **Autoria:** Start Agência Digital & Ecclesiam App  

---

## 🎯 1. Respostas Diretas e Francas às Suas Dúvidas Centrais

### Pergunta 01: "Em quanto tempo posso começar a vender?"
**Resposta Realista:** **Em 45 a 60 dias após a entrada da Catedral no ar (NÃO espere 1 ano).**

* **A grande armadilha:** Achar que "oferecer 1 ano de gratuidade para a Catedral" significa que você precisa ficar 12 meses de braços cruzados esperando o ano acabar para bater na porta da segunda paróquia. Isso mataria o projeto pelo custo de oportunidade e exaustão financeira.
* **O propósito real do contrato de 1 ano da Catedral:** A gratuidade é a moeda de troca pela **chancela institucional**. A Catedral é a sua "Paróquia Vitrine" (Flagship). Ela aceitou ser cobaia dos seus testes e calibragens em troca de custo zero.
* **O gatilho exato de venda:** O momento de vender **NÃO** é quando o app estiver 100% perfeito (software nunca fica 100% pronto). O momento de vender é quando:
  1. O portal da Catedral estiver no ar há pelo menos **30 a 45 dias** sem quedas graves.
  2. O Pe. Irineu e a secretária tiverem dado o primeiro feedback positivo público.
  3. Você tiver **dados reais** para mostrar em uma tela de celular para outro padre: *"Olha, Padre, no último mês a Catedral teve 3.400 acessos, 180 intenções de missa enviadas pelo app e R$ 4.200 arrecadados via PIX sem fila na secretaria."*
* **Cronograma recomendado de abertura comercial:**
  * **Mês 1 (Dias 1 a 30):** Go-live da Catedral, correção de bugs da vida real, adaptação da secretária.
  * **Mês 2 (Dias 31 a 60):** Coleta de métricas, gravação de um depoimento curto (em vídeo ou áudio de WhatsApp) do Pe. Irineu e da secretária. Criação do folheto de apresentação comercial de 2 páginas.
  * **Mês 3 (Dia 60 em diante):** **Início oficial das vendas ativas** nas paróquias da mesma Forania e da Diocese de Colatina.

---

### Pergunta 02: "É possível prosperar nesse ramo levando em conta a concorrência atual?"
**Resposta Realista:** **SIM, com uma condição inegociável: você NUNCA deve tentar concorrer diretamente com o Theòs no ERP contábil/fiscal.**

Vamos dissecar a concorrência sem ilusões:

#### 1. O "Gorila de 800 kg": Theòs Sistemas Eclesiais (SGCP)
* **O que eles dominam:** Mais de 60% a 70% das cúrias diocesanas do Brasil usam o Theòs para consolidar balanços contábeis, livros de tombo, registros canônicos de batismo e tributação diocesana (eSocial).
* **Por que você NÃO pode bater de frente:** O ecônomo da diocese e o Bispo não vão trocar o sistema contábil que usam há 15 anos. Vender contra o Theòs é uma venda política de ciclo de 18 a 24 meses.
* **O Calcanhar de Aquiles do Theòs (Sua mina de ouro):** O aplicativo deles para fiéis (**ParóquiaNet**) é **péssimo**. Foi desenhado com mentalidade de TI dos anos 2000. É burocrático, cinza, exige código de dizimista e senha que ninguém lembra, ignora às comunidades/comunidades periféricas e tem avaliações horríveis nas lojas.
* **O seu posicionamento vencedor:** **"Simbiótico e Complementar"**.
  > *"Padre, o Theòs é excelente para a parte contábil da Cúria e o senhor deve mantê-lo. O Ecclesiam App é para o fiel, para a acolhida, para às comunidades que se sentem esquecidas e para as escalas pastorais. Nós cuidamos do rebanho; o Theòs cuida da nota fiscal."*

#### 2. Players de Apps White-Label e Igrejas Evangélicas (InPeace, Faithful)
* Cobram fortunas (R$ 800 a R$ 1.500/mês + R$ 3.000 de setup).
* Ignoram a eclesiologia católica: não entendem o que é CEB, comunidade com padroeiro próprio, pastoral de batismo, coroinhas ou calendário litúrgico romano. Fracassaram sistematicamente no meio católico.

#### 3. O Mercado Católico é "Imune a Crise" e Muito Fiel:
* Paróquias católicas **não fecham as portas**. Não entram em falência como startups ou comércio varejista.
* Uma vez que a paróquia adota o Ecclesiam e a comunidade se acostuma a olhar o horário da missa e pagar o dízimo por ali, **a taxa de cancelamento (Churn) é baixíssima (< 1% a 1.5% ao mês)**, a menos que haja troca de pároco muito hostil.

---

## 🛠️ 2. Realidade da Infraestrutura: Arquitetura Zero-Cost (Free Tier)

A arquitetura do Ecclesiam foi desenhada com a moderna stack Jamstack serverless, o que permite **custo de infraestrutura inicial de R$ 0,00 (Zero)**:

1. **Vercel (Hobby Tier):**
   * Hospedagem de front-end Next.js com build automático, CDN global em borda, SSL gratuito e 100 GB de tráfego mensal incluído.
   * **Custo inicial:** **R$ 0,00 / mês**.
2. **Supabase (Free Tier):**
   * Banco de dados PostgreSQL dedicado (500 MB de armazenamento), autenticação de usuários, API REST/GraphQL automática e 1 GB de storage de mídia.
   * 500 MB em PostgreSQL suportam mais de 500.000 linhas de registros de horários, avisos e intenções de missa. Para a Catedral e as primeiras paróquias, o banco ocupa menos de 20 MB.
   * **Custo inicial:** **R$ 0,00 / mês**.
3. **Cloudflare & GitHub:**
   * DNS com proteção contra ataques DDoS, proxy rápido e repositório Git em nuvem.
   * **Custo:** **R$ 0,00 / mês**.
4. **Registro de Domínio (.com.br):**
   * Registro.br: R$ 40,00 **POR ANO** (equivalente a **R$ 3,33 / mês**).

### 💡 Quando surge o custo de infraestrutura?
O custo de ferramentas só passa a existir quando o projeto atinge uma escala onde vale a pena pagar por **segurança e automação de backups avançados (SLA Comercial)**:
* **Supabase Pro ($25 USD ≈ R$ 145/mês):** Recomenda-se ativar apenas quando você tiver **a partir de 3 a 5 paróquias pagantes** (quando a receita mensal já for de R$ 800 a R$ 1.500/mês). O motivo do upgrade não é limite de espaço, mas sim para ter backups automáticos a cada segundo (PITR) e não ter o risco de o banco entrar em modo de pausa por inatividade.
* **Vercel Pro ($20 USD ≈ R$ 115/mês):** Apenas para ter conformidade com os termos comerciais da Vercel após tração comprovada.
* **Resumo:** **No primeiro ano e durante todo o período piloto, seu desembolso de infraestrutura do próprio bolso é R$ 0,00.** Toda eventual melhoria de servidor futura será paga pela receita que os próprios clientes gerarem.

---

## 💰 3. Modelo de Precificação & Unit Economics Atualizado

* **Plano Semente (Até 3 comunidades):** R$ 149 / mês
* **Plano Semeador (Até 8 comunidades - Carro-Chefe):** R$ 289 / mês
* **Plano Pescador (Até 20 comunidades - Catedrais/Pólos):** R$ 490 / mês
* **Ticket Médio Ponderado (ARPU):** **R$ 275,00 / mês por paróquia**
* **Taxa Média de Setup / Implantação:** **R$ 500,00 (One-off por paróquia)**
* **Custo Direto de Servidores no Início:** **R$ 0,00 / mês** (100% Free Tier sustentável).
* **Margem de Contribuição Bruta:** **~98% a 100%** no primeiro ano.

---

## 📅 4. Projeção Financeira Realista em 3 Anos (Zero-Cost Bootstrapping)

Abaixo, a tabela reflete a realidade da sua infraestrutura: **sem custo inicial de servidores no bolso do fundador**:

### 🎯 Cenário 1: Realista / Pé no Chão
*(Ritmo: 1 a 2 novas paróquias/mês no 1º ano; 2 a 3/mês no 2º ano; 4 a 5/mês no 3º ano).*

| Período | Paróquias Ativas | Receita Recorrente Mensal (MRR) | Setups Médios / Mês | Faturamento Mensal | Faturamento Anual Acumulado | Custo de Servidores | Lucro Líquido no Bolso do Fundador |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Mês 03** (Início Vendas) | 1 (Piloto Catedral) | R$ 0,00 | R$ 0,00 | R$ 0,00 | R$ 0,00 | **R$ 0,00** (Free Tier) | **R$ 0,00** (Sem prejuízo) |
| **Mês 06** | 4 paróquias | R$ 1.100,00 / mês | R$ 500,00 | R$ 1.600,00 | R$ 6.200,00 | **R$ 0,00** (Free Tier) | **+ R$ 1.600,00 / mês** (100% limpo) |
| **Mês 12** (Fim Ano 1) | **12 paróquias** | **R$ 3.300,00 / mês** | R$ 1.000,00 | R$ 4.300,00 | **R$ 31.800,00** | **R$ 145,00** (Upgrade Pro opcional pago com a receita) | **+ R$ 4.155,00 / mês** |
| **Mês 18** | 24 paróquias | R$ 6.600,00 / mês | R$ 1.500,00 | R$ 8.100,00 | R$ 69.000,00 | R$ 260,00 (Vercel Pro + Supabase Pro) | **+ R$ 7.840,00 / mês** |
| **Mês 24** (Fim Ano 2) | **42 paróquias** | **R$ 11.550,00 / mês** | R$ 2.000,00 | R$ 13.550,00 | **R$ 135.000,00** | R$ 450,00 (Instâncias expandidas) | **+ R$ 13.100,00 / mês** |
| **Mês 36** (Fim Ano 3) | **90 paróquias** | **R$ 24.750,00 / mês** | R$ 3.000,00 | R$ 27.750,00 | **R$ 295.000,00** | R$ 900,00 | **+ R$ 26.850,00 / mês** |

---

## 🧭 5. Conclusão & Veredito

1. **Risco Financeiro de Infraestrutura:** **ZERO.** Você não precisa investir dinheiro do próprio bolso em hospedagem ou banco de dados no primeiro ano. O Free Tier do Supabase e Vercel aguenta com sobra o tráfego da Catedral e das primeiras paróquias.
2. **Autossustentabilidade:** Quando você decidir fazer upgrade para o plano Pro do Supabase ($25/mês ≈ R$ 145), você já terá receita de 4 paróquias entrando (R$ 1.100/mês), ou seja, o próprio software paga seus upgrades sem tocar na sua renda pessoal.
