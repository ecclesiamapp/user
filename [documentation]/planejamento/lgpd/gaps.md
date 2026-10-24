# Gap Analysis e Plano de Remediação LGPD — Ecclesiam App

**Data**: 23/10/2026  
**Ambiente**: Ecclesiam App (Produção / Homologação)  
**Marco Normativo**: Lei nº 13.709/2018 (LGPD), Lei nº 15.211/2025 (ECA Digital) e Resoluções ANPD nº 2/2022, 15/2024, 18/2024 e 19/2024  

---

## 📊 1. Matriz Sistemática de Gaps (Diagnóstico de Conformidade)

| Item Avaliado | Status | Evidência no Código / Projeto | Severidade | Esforço | Prioridade |
| :--- | :---: | :--- | :---: | :---: | :---: |
| **1. Conformidade com ECA Digital & Menores (Art. 14 LGPD + Lei 15.211/2025)** | 🔴 **RED** | Inscrições de catequese e batismo (`sacramental_registrations`) sem consentimento parental destacado nem trava etária. | **Crítica** | Baixo | **URGENTE (Sprint 1)** |
| **2. Base Legal Documentada (Art. 7º e 11 LGPD)** | 🔴 **RED** | Inexistência de enquadramento formal das bases legais de confissão, dízimo e sacramentos. | **Crítica** | Baixo | **URGENTE (Sprint 1)** |
| **3. Política de Privacidade & Termos (Art. 9º LGPD)** | 🔴 **RED** | Ausência completa de página `/privacidade` e de links nos rodapés públicos. | **Alta** | Baixo | **URGENTE (Sprint 1)** |
| **4. Encarregado (DPO) Designado (Art. 41 + Res. 18/2024)** | 🔴 **RED** | Nenhum canal de contato de DPO informado publicamente no portal. | **Alta** | Baixo | **URGENTE (Sprint 1)** |
| **5. Runbook de Resposta a Incidentes (Res. 15/2024)** | 🔴 **RED** | Sem procedimento documentado para notificação da ANPD e fiéis em até **3 dias úteis**. | **Crítica** | Médio | **Semana 2** |
| **6. Canal de Atendimento ao Titular - DSAR (Art. 18 LGPD)** | 🔴 **RED** | Inexistência de formulário ou fluxo para o fiel solicitar acesso, correção ou eliminação de seus dados. | **Alta** | Médio | **Semana 2** |
| **7. ROPA - Registro de Operações (Art. 37 LGPD)** | 🔴 **RED** | Falta do mapa e registro documental de operações exigido em fiscalizações da ANPD. | **Crítica** | Médio | **Semana 3** |
| **8. Tabela de Retenção & Descarte (Art. 15-16 LGPD)** | 🔴 **RED** | Dados pastorais e sacramentais armazenados indefinidamente no Supabase sem rotina de purga. | **Alta** | Médio | **Semana 3** |
| **9. DPA & Cláusulas Internacionais (Res. 19/2024)** | 🔴 **RED** | Falta de anexo de DPA e salvaguardas para dados hospedados nos EUA (Supabase, Vercel, Resend). | **Alta** | Médio | **Mês 2** |
| **10. Minimização de Dados (Art. 6º, III LGPD)** | 🟡 **YELLOW** | Campos de texto livre em notas de confissão/atendimentos (`notes`) sem sanitização. | **Média** | Baixo | **Mês 2** |
| **11. Trilha de Auditoria com Hash Chain (Art. 6º, X LGPD)** | 🟡 **YELLOW** | Logs básicos de autenticação no Supabase, mas sem hash-chaining imutável para acesso a PII. | **Média** | Alto | **Mês 3** |
| **12. Criptografia em Repouso** | 🟢 **GREEN** | Banco de dados Supabase Postgres sob AES-256 (KMS da AWS). | — | — | Conforme ✅ |
| **13. Criptografia em Trânsito** | 🟢 **GREEN** | Conexões HTTPS forçadas com TLS 1.3 no Vercel Edge Network e API Supabase. | — | — | Conforme ✅ |
| **14. Isolamento Multi-Tenant por Paróquia** | 🟢 **GREEN** | Políticas RLS ativas em 100% das tabelas vinculadas a `parish_id`. | — | — | Conforme ✅ |

---

## 🎯 2. Resumo Quantitativo
* **Gaps Críticos**: 3
* **Gaps Altos**: 5
* **Gaps Médios**: 2
* **Conformes (Green)**: 3

---

## 🚀 3. Plano de Remediação Priorizado

### ⚡ Fase 1: Ações Imediatas (Sprint 1 — Próxima Semana)
1. **Conformidade ECA Digital na Catequese & Batismo** (`lgpd-eca-digital-minors`):
   * Adicionar checkbox mandatório de autorização do responsável legal no formulário de inscrição de sacramentos.
   * Travar a coleta de documentos apenas aos estritamente necessários para a certidão eclesial.
2. **Publicação da Política de Privacidade v1.0** (`lgpd-privacy-policy`):
   * Criar a página pública `/privacidade` no Next.js (`app/privacidade/page.tsx`).
   * Adicionar link direto no rodapé do portal (`components/comunidades/CommunityFooter.tsx` e footer principal).
3. **Designação e Divulgação do Encarregado / DPO** (`lgpd-dpo-encarregado`):
   * Criar seção pública com identificação e e-mail de contato do Encarregado (ex: `privacidade@catedraldecolatina.org.br` ou canal da cúria diocesana).
4. **Enquadramento das Bases Legais** (`lgpd-legal-basis`):
   * Formalizar em `.lgpd/legal-basis.md` o enquadramento:
     * Dízimo: Cumprimento de obrigação associativa/religiosa e Legítimo Interesse (Art. 7º, IX).
     * Sacramentos e Catequese: Consentimento do responsável (Art. 14) e Legitimação Canônica / Convicção Religiosa (Art. 11, II, "d").
     * Atendimentos e Confissões: Tutela pastoral estrita (Art. 11, II, "d") com sigilo sacramental absoluto.

### 🛡️ Fase 2: Governança, Titulares & Resposta a Incidentes (Semanas 2 a 4)
5. **Canal DSAR (Direitos dos Titulares - Art. 18)** (`lgpd-dsar`):
   * Criar formulário simples para o fiel requisitar: confirmação de dados, retificação cadastral ou revogação de envio de mensagens pastorais.
6. **Runbook de Incidentes de Segurança** (`lgpd-incident-response`):
   * Estruturar o protocolo de comunicação em 3 dias úteis para a ANPD (Res. 15/2024), com checklist de contenção técnica no Supabase.
7. **Consolidação do ROPA Oficial** (`lgpd-ropa`):
   * Gerar o documento de Registro de Operações em formato aceito pela ANPD.

### 🏛️ Fase 3: Infraestrutura, Retenção & Terceiros (Mês 2)
8. **Política de Retenção & Expiração** (`lgpd-retention-erasure`):
   * Criar trigger ou rotina que arquiva/anonimiza notas confidenciais de atendimentos pastorais concluídos há mais de 12 meses.
9. **DPA com Provedores de Nuvem** (`lgpd-dpa` e `lgpd-international-transfer`):
   * Arquivar declarações de conformidade e cláusulas-padrão de proteção para Supabase, Vercel e Resend.
