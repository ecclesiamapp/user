# Legitimate Interest Assessment (LIA) — Pastoral do Dízimo

**Documento de Avaliação de Legítimo Interesse (LIA)**  
**Fundamentação**: Art. 7º, IX c/c Art. 10 da Lei nº 13.709/2018 (LGPD)  

---

## Identificação

- **Atividade**: `A003 — Cadastro e Gestão de Dizimistas ("Sou do Sagrado")`
- **Controlador**: Paróquia Sagrado Coração de Jesus — Catedral de Colatina / Diocese de Colatina
- **Operador Técnico**: Start Agência Digital / Ecclesiam App
- **Data da Avaliação**: 23/10/2026
- **Versão**: 1.0
- **Próxima Revisão**: 23/10/2027 (anual)

---

## 1. Teste de Finalidade (Purpose Test)

* **Qual o interesse legítimo perseguido?**  
  A manutenção da subsistência material da comunidade paroquial, conservação do templo da Catedral e das 12 capelas comunitárias, sustento do clero e realização de obras de caridade e evangelização da Igreja Católica, conforme preceito bíblico e canônico do dízimo (Cânon 222 do Código de Direito Canônico).
* **É um interesse lícito, específico e real (não hipotético)?**  
  Sim. É um interesse real, lícito e constitucionalmente amparado (liberdade de culto e organização religiosa — Art. 5º, VI da CF/88). O tratamento visa especificamente identificar o dizimista para envio de lembretes devocionais, confirmação de recebimento de doações via Pix/envelope e prestação de contas pastoral.
* **Quem se beneficia?**  
  A comunidade paroquial como um todo (fiéis, necessitados assistidos pela caridade paroquial e o próprio titular, que expressa livremente sua pertença religiosa).
* **Sem o tratamento, qual o prejuízo concreto?**  
  Inviabilidade de gestão organizada das contribuições voluntárias, perda de comunicação com os colaboradores e impossibilidade de prestar contas transparentes das receitas comunitárias.

---

## 2. Teste de Necessidade (Necessity Test)

* **O tratamento é estritamente necessário para a finalidade? (Art. 10, II da LGPD)**  
  Sim. Para emitir carnês, registrar chave Pix e direcionar doações à capela correspondente do fiel, é indispensável saber seu nome, comunidade e forma de pagamento.
* **Há forma menos invasiva de atingir a mesma finalidade?**  
  Doações anônimas em dinheiro na cesta das Missas já ocorrem, porém a modalidade de "Dizimista Cadastrado" confere ao fiel um número de cadastro pastoral, lembretes de aniversário e prestação de contas pessoalizada, o que exige identificação cadastral mínima.
* **Os dados coletados são os mínimos para a finalidade? (Art. 6º, III — Princípio da Necessidade)**  
  Sim. Coletam-se apenas nome, telefone, e-mail opcional, endereço simplificado e preferência de contribuição. Não se coletam dados bancários de cartão de crédito nem senhas financeiras.

---

## 3. Teste de Balanceamento (Balancing Test)

| Fator de Análise | Avaliação de Risco | Justificativa |
| :--- | :---: | :--- |
| **Expectativa Razoável do Titular** | **Alta** | O fiel que voluntariamente preenche a ficha do dízimo no portal ou na Missa possui a plena e razoável expectativa de que a paróquia registrará seu nome para fins pastorais e de agradecimento. |
| **Impacto Potencial sobre Direitos** | **Leve** | Não há impacto discriminatório, creditício (sem consulta a SPC/Serasa) nem cobrança judicial coercitiva. O dízimo é estritamente voluntário. |
| **Categoria dos Dados** | **Comum / Contextual** | Dados cadastrais básicos (nome, telefone, endereço) contextualizados em ambiente religioso. |
| **Vulnerabilidade do Titular** | **Comum / Idosos** | Fiéis adultos e idosos. Não há cadastro de crianças no dízimo. |
| **Forma de Coleta** | **Transparente** | Coleta direta através de formulário público claro e inequívoco. |
| **Salvaguardas Existentes** | **Robustas** | RLS no banco de dados, criptografia em trânsito e repouso, proibição de comercialização de listas. |

**Conclusão do Balanceamento**:  
O legítimo interesse da organização religiosa **prevalece** sobre os direitos do titular, pois o tratamento está em total harmonia com as expectativas legítimas do fiel católico e não gera riscos a direitos fundamentais.

---

## 4. Salvaguardas Adotadas

- [x] **Transparência Ativa**: Informação clara na Política de Privacidade sobre a finalidade da gestão do dízimo.
- [x] **Mecanismo de Oposição (Opt-out)**: Garantia de que o fiel pode a qualquer momento pedir o cancelamento de mensagens ou desativação do cadastro na secretaria.
- [x] **Minimização**: Não coleta de CPF obrigatório no portal web.
- [x] **Segurança & RLS**: Tabela `tithe_registrations` acessível unicamente pela tesouraria paroquial logada.
- [x] **Não Compartilhamento com Fins Comerciais**: Dados jamais são repassados a terceiros para marketing ou publicidade externa.

---

## 5. Decisão Formal

- [x] **Aprovo o uso de Legítimo Interesse (Art. 7º, IX)** para a gestão cadastral da Pastoral do Dízimo.
- [ ] Rejeito.

**Responsável**: Encarregado de Proteção de Dados (DPO) / Pároco da Catedral  
**Data**: 23/10/2026  
