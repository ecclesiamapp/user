# Avaliação de Operador: Vercel Inc. (Art. 39 LGPD)

**Documento de Due Diligence Técnica e Jurídica**  
**Marco Legal**: Artigos 33, 39, 42 e 46 da Lei nº 13.709/2018 (LGPD)  

---

## 1. Ficha do Operador

* **Razão Social / Identificação**: Vercel Inc.
* **Sede / Jurisdição**: San Francisco, Califórnia, Estados Unidos
* **País de Tratamento**: Estados Unidos e Edge Network Global (pontos de presença CDN em São Paulo e internacional)
* **Finalidade**: Hospedagem Serverless, renderização estática e dinâmica SSR do Next.js, roteamento e distribuição de conteúdo CDN do portal paroquial.
* **Dados Compartilhados**:
  * Metadados de tráfego de rede (endereços IP, user-agent, cabeçalhos HTTP, timestamps).
  * Payloads de dados em trânsito (requisições de formulários públicos enviadas para as rotas Serverless do Next.js antes do envio ao Supabase).
* **Dados Sensíveis em Repouso**: Nenhum (a Vercel atua em infraestrutura efêmera/stateless; não há banco de dados de fiéis hospedado nos servidores da Vercel).
* **Tier de Risco**: 🟠 **ALTO** (Canal principal de tráfego de rede de todos os fiéis e administração da plataforma).
* **Owner Interno**: Equipe de Infraestrutura e DevOps.
* **Última Revisão**: 23/10/2026.
* **Próxima Revisão**: 23/04/2027 (Semestral).

---

## 2. Checklist de Due Diligence

### A. Contrato e Base Legal
- [x] Papel definido como **Operador** de processamento de borda e entrega de conteúdo.
- [x] Finalidade estritamente técnica de execução de código e entrega da aplicação web.
- [ ] ⚠️ **DPA (Data Processing Addendum)**: A Vercel possui DPA executável via dashboard online. **Ação necessária**: Baixar e arquivar a via referenciando a conta da paróquia/Ecclesiam.

### B. Segurança da Informação (Art. 46)
- [x] **Criptografia em Trânsito**: Conexões com terminação TLS 1.3 obrigatória e certificados SSL/TLS gerenciados com renovação automática.
- [x] **Proteção de Borda**: Firewall de aplicação web (WAF) contra ataques DDoS, mitigação de invasões e rate limiting em APIs.
- [x] **Certificações Vigentes**: SOC 2 Tipo II, ISO 27001, alinhamento com NIST.
- [x] **Logs Efêmeros**: Logs de execução Serverless transitórios com retenção reduzida (sem persistência permanente de corpos de requisição).

### C. Transferência Internacional (Art. 33)
- [x] Pontos de presença (PoP) de borda no Brasil (GRU - São Paulo), com computação serverless distribuída nos EUA.
- [x] Cobertura sob Data Privacy Framework e Standard Contractual Clauses (SCC).

---

## 3. Veredito & Plano de Ação

* **Status**: 🟡 **APROVADO COM RESSALVAS**
* **Ação Corretiva**: Arquivar a via oficial do DPA da Vercel assinado/aceito pela equipe gestora do Ecclesiam App.
