# Avaliação de Operador: Theos Sistemas Paroquiais (Art. 39 LGPD)

**Documento de Due Diligence Técnica e Jurídica**  
**Marco Legal**: Artigos 39, 42 e 46 da Lei nº 13.709/2018 (LGPD)  

---

## 1. Ficha do Operador

* **Razão Social / Identificação**: Theos Sistemas de Informática Ltda.
* **CNPJ**: Fornecedor nacional de software de gestão eclesial
* **Sede / Jurisdição**: Brasil (Maringá - PR / abrangência nacional em dioceses e cúrias)
* **País de Tratamento**: Brasil
* **Finalidade**: Sistema ERP oficial de gestão eclesial adotado pela Diocese de Colatina para lançamento contábil de dízimo, emissão de certidões impressas e controle financeiro paroquial.
* **Dados Compartilhados**:
  * Nome do dizimista, endereço, telefone, comunidade e valor/histórico de contribuição do dízimo (Status `cadastrado_theos` na tabela `tithe_registrations`).
* **Dados Sensíveis Compartilhados?**: Convicção religiosa presumida pela pertença ao dízimo católico.
* **Tier de Risco**: 🟠 **ALTO** (Processa volume contínuo de dados cadastrais e financeiros de doações da paróquia).
* **Owner Interno**: Tesouraria Paroquial e Secretaria.
* **Última Revisão**: 23/10/2026.
* **Próxima Revisão**: 23/04/2027 (Semestral).

---

## 2. Checklist de Due Diligence

### A. Contrato e Base Legal
- [x] Papel definido como **Operador** de software e gestão contábil.
- [x] Sujeito à jurisdição brasileira e às sanções da ANPD (Art. 52 da LGPD).
- [ ] ⚠️ **Cláusulas de Proteção de Dados (DPA Nacional)**: Verificar se o contrato corporativo firmado entre a Mitra Diocesana de Colatina e a Theos Sistemas contempla expressamente as cláusulas obrigatórias de proteção de dados (Art. 39 da LGPD).

### B. Segurança e Conformidade
- [x] Hospedagem e servidores em território nacional (sem transferência internacional de dados).
- [x] Políticas de backup e confidencialidade aplicáveis à gestão eclesial.

---

## 3. Veredito & Plano de Ação

* **Status**: 🟡 **APROVADO COM RESSALVAS**
* **Ação Corretiva**: Solicitar ao setor jurídico/contábil da Mitra Diocesana a confirmação do aditivo de adequação à LGPD no contrato padrão do Theos Sistemas.
