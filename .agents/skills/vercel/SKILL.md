---
name: vercel
description: "Equivalente oficial do Vercel Plugin. Use quando for realizar qualquer tarefa envolvendo Vercel: deploy em preview ou produção, verificação de build Next.js, sincronização de variáveis de ambiente (vercel env pull), inspeção de status de deployments, logs da Vercel ou vinculação de projeto (vercel link). Triggers: 'deploy', 'vercel', 'subir na vercel', 'preview deploy', 'deploy prod', 'produção', 'ambiente vercel'."
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel & Next.js Deployment Agent

Esta skill traz para o agente todas as capacidades do **Vercel Plugin Oficial**, garantindo deploys controlados, inspeção de links de preview e publicação em produção diretamente pelo terminal e MCP.

---

## 🚀 Comandos Principais e Fluxos

### 1. Deploy em Preview (Homologação)
Gera uma URL de preview isolada sem afetar a branch principal ou o domínio de produção.
```powershell
# Execução direta via Vercel CLI
npx vercel
```

### 2. Deploy em Produção (Go-Live)
Envia o build definitivo para os domínios oficiais configurados na Vercel.
> ⚠️ **IMPORTANTE:** Conforme as regras de governança do projeto, **NUNCA** execute deploy em produção sem antes rodar a validação local (`npm run build`).

```powershell
# 1. Validar localmente primeiro
npm run build

# 2. Se o build passar com 0 erros:
npx vercel --prod
```

### 3. Sincronização de Variáveis de Ambiente
Puxa os segredos e variáveis configuradas no dashboard da Vercel para o `.env.local` de desenvolvimento.
```powershell
npx vercel env pull .env.local
```

### 4. Inspeção e Listagem de Deployments
Lista os últimos deploys e obtém detalhes de performance e erros.
```powershell
npx vercel list
npx vercel inspect <deployment-url>
```

### 5. Autenticação e Vínculo do Projeto
Se for o primeiro uso ou se a sessão expirar:
```powershell
# Autenticar no navegador
npx vercel login

# Vincular este diretório ao projeto existente na Vercel
npx vercel link
```

---

## 🛡️ Protocolo Obrigatório Pré-Deploy (Regras do Ecclesiam)

Antes de autorizar qualquer deploy de produção:
1. **Compilação Estrita:** `npm run build` sem nenhum `Type error` ou warning crítico.
2. **Auditoria de Variáveis:** Confirmar que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão apontando para o ambiente correto.
3. **Segurança de Chaves:** Nunca expor `SUPABASE_SERVICE_ROLE_KEY` no client-side.
4. **Git Sync:** Garantir commit claro com as mudanças antes de subir.
