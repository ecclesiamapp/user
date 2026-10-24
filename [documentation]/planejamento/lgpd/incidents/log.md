# Registro de Incidentes de Segurança da Informação — Ecclesiam App

**Documento**: Livro de Registro Permanente de Incidentes de Segurança  
**Marco Normativo**: Artigo 10 da Resolução CD/ANPD nº 15/2024 (Regulamento de Comunicação de Incidentes)  
**Obrigatoriedade**: O controlador deve manter o registro histórico de **TODOS** os incidentes de segurança por no mínimo **5 anos**, mesmo aqueles que não tenham resultado em notificação obrigatória à ANPD.  

---

## 📖 Histórico de Ocorrências

### INC-2026-000 (Marco Zero / Baseline de Auditoria)
* **Data de Abertura**: 23/10/2026
* **Tipo**: Auditoria e Hardening Preventivo de Segurança
* **Descrição**: Conclusão da auditoria de vulnerabilidades, ativação do RLS em 100% das tabelas e implementação da esteira de compliance LGPD e ECA Digital.
* **Afetação a Dados Pessoais**: **ZERO** (Nenhuma quebra de confidencialidade, integridade ou disponibilidade detectada).
* **Classificação de Risco**: Inexistente.
* **Notificação ANPD / Titulares**: Não aplicável.
* **Medidas Adotadas**: Criptografia AES-256 no Supabase, TLS 1.3 forçado no tráfego Edge e isolamento multi-tenant por paróquia.
* **Status**: Encerrado / Conforme ✅.
* **Retenção do Registro**: Até 23/10/2031 (5 anos).

---

## 📝 Template para Novos Incidentes

```markdown
### INC-YYYY-NNN
* **Data e Hora da Detecção**: YYYY-MM-DDTHH:MM:SS-03:00
* **Data e Hora do Conhecimento da Afetação**: YYYY-MM-DDTHH:MM:SS-03:00
* **Vetor / Causa Principal**: {ex: falha de autenticação, vazamento de chave, phishing, bug de software}
* **Categorias de Dados Afetadas**: {comuns / sensíveis / menores / financeiros}
* **Número Estimado de Titulares**: {N} (sendo {X} crianças, {Y} idosos)
* **Avaliação de Risco (Art. 5º Res. 15/2024)**: {Risco relevante? SIM/NÃO — Justificativa}
* **Decisão sobre Notificação**: {Notificar ANPD e Titulares? SIM/NÃO}
* **Data da Notificação ANPD (3 dias úteis)**: {Data e número do protocolo gov.br}
* **Data da Notificação aos Titulares**: {Data e canal utilizado}
* **Medidas de Contenção Adotadas**: {rotação de credenciais, patch no código, revogação de acessos}
* **Causa Raiz & Plano de Remediação Definitivo**: {análise post-mortem e correções}
* **Responsável pelo Encerramento**: {Nome do DPO / Pároco}
* **Prazo de Retenção Legal deste Registro**: {Data de encerramento + 5 anos}
```
