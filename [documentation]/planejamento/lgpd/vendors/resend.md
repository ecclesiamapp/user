# Avaliação de Operador: Resend Inc. (Art. 39 LGPD)

**Documento de Due Diligence Técnica e Jurídica**  
**Marco Legal**: Artigos 33, 39, 42 e 46 da Lei nº 13.709/2018 (LGPD)  

---

## 1. Ficha do Operador

* **Razão Social / Identificação**: Resend Inc.
* **Sede / Jurisdição**: Delaware, Estados Unidos
* **País de Tratamento**: Estados Unidos
* **Finalidade**: Serviço de API transacional de mensageria para envio de notificações paroquiais (confirmações de agendamento de atendimentos pastorais e sacramentos).
* **Dados Compartilhados**:
  * Nome do fiel destinatário (`to`).
  * Endereço de e-mail do destinatário.
  * Assunto e data/hora do compromisso pastoral.
* **Dados Sensíveis Compartilhados?**: **NÃO**. Por diretriz estrita do projeto, o corpo dos e-mails transacionais jamais contém os relatos espirituais ou pecados relatados nos formulários; apenas o título genérico do compromisso (ex: "Atendimento Pastoral Confirmado").
* **Tier de Risco**: 🟡 **MÉDIO** (Acesso limitado a dados de contato e disparo de mensagens transacionais).
* **Owner Interno**: Equipe de Desenvolvimento e Secretaria.
* **Última Revisão**: 23/10/2026.
* **Próxima Revisão**: 23/10/2027 (Anual).

---

## 2. Checklist de Due Diligence

### A. Contrato e Base Legal
- [x] Papel definido como **Operador** de mensageria e envio eletrônico.
- [x] Base legal aderente: Art. 7º, V da LGPD (procedimentos a pedido do titular).
- [ ] ⚠️ **DPA (Data Processing Addendum)**: A Resend oferece DPA online para clientes. **Ação necessária**: Baixar e arquivar a versão vigente no repositório de compliance.

### B. Segurança e Retenção
- [x] **Criptografia em Trânsito**: Envio por conexões TLS 1.3 / HTTPS autenticado via tokens de API secretas (`RESEND_API_KEY`).
- [x] **Certificações**: SOC 2 Tipo II vigente.
- [x] **Retenção de Mensagens**: Histórico de logs de entrega mantido por 30 dias na plataforma e automaticamente expurgado em seguida.
- [x] **Opt-out de E-mail**: Suporte a cabeçalhos RFC e links de descadastramento.

---

## 3. Veredito & Plano de Ação

* **Status**: 🟡 **APROVADO COM RESSALVAS**
* **Ação Corretiva**: Arquivar o DPA da Resend e manter a regra arquitetural de jamais inserir o conteúdo de confissões ou notas de aconselhamento no corpo de e-mails transacionais.
