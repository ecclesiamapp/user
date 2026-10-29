---
name: Auditoria de Terminologia Canônica
description: Auditor e padronizador automático de terminologia eclesial e canônica no Ecclesiam App. Substitui termos desatualizados/imprecisos ({Capela} -> Comunidade/CEB, {Matriz} -> Catedral) em strings de UI, labels e documentação, preservando marcos históricos de fundação e identificadores técnicos. Integrado ao Protocolo Deploy e acionável sob demanda.
---

# ⛪ Auditoria de Terminologia Canônica (Ecclesiam App)

Esta skill foi criada para padronizar e policiar continuamente a nomenclatura eclesial oficial da **Igreja Católica** em todo o ecossistema do **Ecclesiam App** (Catedral de Colatina e Comunidades Eclesiais de Base).

---

## 🎯 Regras Canônicas de Ouro

| Nomenclatura Desatualizada / Imprecisa | Nomenclatura Canônica Oficial Mandatória | Justificativa Canônica / Pastoral |
| :--- | :--- | :--- |
| **{Capela} / {Capelas}** | **Comunidade / Comunidades (CEBs)** | Na Diocese de Colatina e na eclesiologia conciliar latino-americana, as capelas filiadas são reconhecidas e acolhidas como **Comunidades Eclesiais de Base (CEBs)**. |
| **{Matriz} / {Igreja Matriz}** | **Catedral / Catedral Diocesana** | A paróquia-sede é a **Catedral Sagrado Coração de Jesus**, Igreja-Mãe da Diocese. O termo "Matriz" reduz a dignidade da Sé Episcopal. |
| **Intenções no Altar** | **Intenções de Missa (Púlpito A4)** | Sobre o Altar consagram-se unicamente o Corpo e Sangue de Cristo. O Púlpito/Ambão é o lugar litúrgico de proclamação das intenções. |
| **Culto / Cultos** | **Santa Missa / Celebração da Palavra** | Proibição canônica absoluta do termo "culto" no catolicismo romano. |

---

## 🛡️ Salvaguardas e Exceções Inteligentes

O script de auditoria foi programado com **proteção de contexto**:
1. **Marcos Históricos de Fundação Preservados:** Registros históricos entre 1928 e 1990 (ex: *"antiga capela de tábuas de 1928"*, *"primeira igreja matriz"*, *"elevação da Matriz a Catedral em 1990"*) são rigorosamente preservados.
2. **Tokens e Identificadores de Código Preservados:** Variáveis de banco e rotas técnicas (ex: `is_headquarters`, `variant="matriz"`, `matriz_geral`, `sch-matriz`) não são danificadas.

---

## 💻 Comandos e Modos de Uso

### 1. Auditoria (Apenas Verificação / Relatório)
Para inspecionar sem alterar arquivos:
```bash
node .agents/skills/canonical_terminology_auditor/scripts/audit_terminology.js --check
```
*(Retorna código 0 se estiver 100% limpo, ou código 1 listando as ocorrências pendentes)*.

### 2. Auto-Fix (Correção e Substituição Automática em Disco)
Para aplicar a substituição canônica imediata em todos os arquivos de UI e documentação:
```bash
node .agents/skills/canonical_terminology_auditor/scripts/audit_terminology.js --fix
```

### 3. Modo Detalhado (Verbose)
Para visualizar todas as linhas e arquivos detalhadamente:
```bash
node .agents/skills/canonical_terminology_auditor/scripts/audit_terminology.js --check --verbose
```

---

## 🚀 Integração com o Protocolo Deploy (Pré-Push)

A auditoria está integrada ao arquivo `.agents/skills/vercel/scripts/check_pre_push.js`.
A cada execução de deploy (`npm run build`, `git push`), a terminologia é validada automaticamente para garantir conformidade canônica contínua.
