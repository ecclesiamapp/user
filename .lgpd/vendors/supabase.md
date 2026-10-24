# Avaliação de Operador: Supabase Inc. (Art. 39 LGPD)

**Documento de Due Diligence Técnica e Jurídica**  
**Marco Legal**: Artigos 33, 39, 42 e 46 da Lei nº 13.709/2018 (LGPD) e Resolução CD/ANPD nº 19/2024  

---

## 1. Ficha do Operador

* **Razão Social / Identificação**: Supabase Inc.
* **Sede / Jurisdição**: Delaware, Estados Unidos
* **País de Tratamento**: Estados Unidos (Datacenter AWS us-east-1 / Flórida / Virgínia)
* **Finalidade**: Hospedagem de Banco de Dados Relacional PostgreSQL, Serviço de Autenticação (`auth.users`) e Storage para upload de certidões e fotos paroquiais.
* **Dados Compartilhados**:
  * PII Comum: Nomes, telefones, e-mails, endereços, datas de nascimento de fiéis e dizimistas.
  * **Dados Sensíveis (Art. 11)**: Tipo de atendimento pastoral/confissão (`pastoral_appointments`), notas espirituais descritivas.
  * **Dados de Menores (Art. 14 + ECA Digital)**: Certidões de nascimento, documentos de identificação e fichas de catequese infantil (`sacramental_registrations`).
* **Tier de Risco**: 🔴 **CRÍTICO** (Acesso a dados de alta sensibilidade, menores de idade e toda a base de fiéis da paróquia).
* **Owner Interno**: Administrador Geral de TI / Encarregado (DPO).
* **Última Revisão**: 23/10/2026.
* **Próxima Revisão**: 23/01/2027 (Trimestral para Tier Crítico).

---

## 2. Checklist de Due Diligence

### A. Contrato e Base Legal
- [x] Papel definido como **Operador** (trata dados estritamente conforme comandos SQL emitidos pelo Ecclesiam App).
- [x] Finalidade compatível com o Mapa de Dados ([`.lgpd/data-map.md`](../data-map.md) — Atividades `A001`, `A002`, `A003`, `A007`).
- [ ] ⚠️ **DPA (Data Processing Addendum) Formalizado**: O Supabase fornece DPA padronizado online (com cláusulas contratuais da UE/EUA). **Ação necessária**: Emitir a via eletrônica assinada com anexo das Cláusulas-Padrão BR.

### B. Segurança da Informação (Art. 46)
- [x] **Criptografia em Repouso**: Banco de dados e Storage protegidos sob AES-256 via AWS KMS.
- [x] **Criptografia em Trânsito**: Todas as conexões de API e pooling de banco forçadas com TLS 1.3 / HTTPS.
- [x] **Isolamento de Dados**: Row Level Security (RLS) habilitado em 100% das tabelas por paróquia (`parish_id`).
- [x] **Certificações Vigentes**: SOC 2 Tipo II, HIPAA Compliant, ISO 27001 (infraestrutura AWS subjacente).
- [x] **Trilha de Auditoria**: Logs operacionais de conexão e comandos no dashboard Supabase.

### C. Transferência Internacional (Art. 33 c/c Resolução ANPD nº 19/2024)
- [x] País de destino mapeado: Estados Unidos da América.
- [ ] ⚠️ **Adoção de Cláusulas-Padrão Contratuais (CPC-ANPD)**: O Supabase adota Standard Contractual Clauses (SCC) europeias. Para total blindagem perante a ANPD, o projeto deve manter em arquivo a avaliação de equivalência ou anexo da Resolução 19/2024.

### D. Direitos do Titular & Exclusão (Art. 18 e 16)
- [x] **Capacidade Técnica de Exclusão (DSAR)**: Operações de exclusão lógica (`DELETE` ou anonimização) via SQL são refletidas de forma imediata nos clusters primários.
- [x] **Eliminação de Backups**: Backups rotativos automáticos com expiração programada de 7 a 30 dias.

### E. Notificação de Incidentes (Resolução ANPD nº 15/2024)
- [x] Status page pública e compromisso de reporte de falhas de segurança no portal Supabase Status.
- [x] Sem histórico de violação massiva de dados pessoais não reportada.

---

## 3. Veredito & Plano de Ação

* **Status**: 🟡 **APROVADO COM RESSALVAS**
* **Ação Corretiva**:
  1. Acessar o portal de compliance do Supabase e solicitar formalmente o DPA assinado para a organização do Ecclesiam App.
  2. Registrar o DPA assinado no repositório de governança.
