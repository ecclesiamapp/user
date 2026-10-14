# 🏛️ Diretriz Pastoral & Arquitetura do Dízimo: Ecclesiam App

> **Status:** Homologado como Diretriz Oficial de Produto, Arquitetura e Conformidade Canônica  
> **Referência Técnica:** Subpágina [`/dizimo`](file:///c:/Users/Start/ecclesiam-app/app/dizimo/page.tsx) e Componente [`DizimoPixDynamic.tsx`](file:///c:/Users/Start/ecclesiam-app/components/dizimo/DizimoPixDynamic.tsx)  
> **Data de Homologação:** Outubro de 2026

---

## 1. Princípio Fundamental de Operação Financeira

Por determinação expressa da diretoria de produto e conformidade canônica:

> **O Ecclesiam App NÃO é e NÃO está habilitado a ser canal de recebimento, custódia, subadquirente ou intermediador financeiro de Dízimo.**

Toda a infraestrutura do Ecclesiam App opera sob o princípio de **neutralidade financeira**:
1. **Sem Gateway Intermediário:** O Ecclesiam App não retém valores, não realiza splits de pagamento e não cobra taxas percentuais sobre as doações ou ofertas dos fiéis.
2. **Transferência Direta Mitra-Fiel:** Toda e qualquer contribuição realizada via PIX pelos fiéis é executada **diretamente entre o aplicativo bancário do fiel e a conta bancária canônica da Mitra Diocesana de Colatina** (Paróquia Sagrado Coração de Jesus).
3. **Sistemas Eclesiais Oficiais (Theòs):** O controle contábil canônico, gestão de carnês, envelopes, emissão de relatórios para a Cúria Diocesana e registros contábeis oficiais continuam sob responsabilidade exclusiva da **Secretaria Paroquial através do software Theòs Sistemas Eclesiais**.

---

## 2. Finalidades Oficiais da Página do Dízimo (`/dizimo`)

A subpágina pública `/dizimo` da Catedral e das CEBs existe para atender a **dois propósitos essenciais**:

### A. Finalidade Estritamente Pastoral & Catequética
* **Conscientização das 4 Dimensões (CNBB Doc. 106):** Instruir os fiéis sobre a Dimensão Religiosa (gratidão), Eclesial (sustento do templo e clero), Missionária (evangelização e apoio às 12 CEBs) e Caritativa (pastoral dos pobres e assistência a mais de 80 famílias).
* **Desmistificação Bíblica:** Esclarecer que o dízimo na Igreja Católica não é taxa mercantil nem imposto obrigatório, mas partilha livre e generosa conforme o coração de cada família (2 Cor 9,7).
* **Adesão Pastoral ("Sou do Sagrado"):** Canal acolhedor para que novos fiéis manifestem seu desejo de se tornarem dizimistas, enviando seus dados à Secretaria Paroquial para retirada dos envelopes no plantão das Santas Missas.

### B. Canal Informativo para Captação de Ofertas Espontâneas
* Exibição clara e segura da chave PIX oficial (E-mail/CNPJ) e QR Code estático do Banco Central vinculado à Mitra Diocesana.
* Campo opcional para que o fiel possa deixar uma mensagem fraterna ou intenção de oração para a comunidade.
* Transparência ativa sobre as obras de conservação da Catedral Matriz e projetos caritativos da paróquia.

---

## 3. Resumo de Responsabilidades Técnicas

| Módulo / Recurso | Papel do Ecclesiam App | Papel da Mitra / Theòs / Secretaria |
| :--- | :--- | :--- |
| **Adesão de Novo Dizimista** | Formulário digital de acolhimento e protocolo pastoral | Registro formal no Theòs e entrega física do kit de envelopes |
| **Ofertas via PIX** | Exibição visual da chave PIX e QR Code direto da Mitra | Conciliação bancária direta na conta paroquial da Mitra |
| **Recibos do Dízimo** | N/A (Ecclesiam não processa pagamentos) | Secretaria Paroquial / Sistema Theòs |
| **Prestação de Contas** | Exibição pública e visual das realizações e obras | Auditoria do Conselho Econômico Paroquial (CAEP) |
