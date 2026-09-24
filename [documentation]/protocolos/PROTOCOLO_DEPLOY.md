# 🚀 Protocolo de Deploy e Lançamento (Go-Live Seguro) - Ecclesiam App

Este documento estabelece as regras obrigatórias para publicação do **Ecclesiam App** em produção ("no ar").

**Gatilhos de Execução Automática:** Este protocolo é acionado quando o usuário envia comandos ou mensagens como:
- *"Protocolo Deploy"*
- *"Vamos colocar no ar"*
- *"Vamos migrar para o local online definitivo"*
- *"Subir para produção / Deploy oficial"*

---

## 🛡️ Trava de Segurança Pré-Lançamento (Obrigatória)

Nenhum deploy para produção é autorizado sem que a IA/desenvolvedor execute a seguinte checklist de validação:

### 1. Varredura de Banco de Dados (Supabase RLS)
- Validar se todas as tabelas paroquiais possuem Row Level Security ativado e políticas configuradas.
- *Critério de Aprovação:* 0 tabelas desprotegidas.

### 2. Auditoria de Dependências
Executar a varredura de segurança das bibliotecas instaladas:
```bash
npm audit
```
*Critério de Aprovação:* Nenhuma vulnerabilidade crítica ou de alta severidade nas dependências em uso.

### 3. Validação de Variáveis de Ambiente em Produção (Vercel)
Verificar se todas as chaves de produção estão configuradas nas variáveis do projeto:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Chaves dos Gateways de Pagamento PIX

### 4. Ativação do Escudo Cloudflare (WAF / Anti-DDoS)
1. Apontar o DNS do domínio oficial ou subdomínios paroquiais para a Cloudflare.
2. Ativar o Proxy da Cloudflare (Nuvem Laranja) para os registros CNAME/A apontando para a Vercel.
3. Configurar SSL/TLS no modo **Full (Strict)**.
4. Habilitar o *Bot Fight Mode* no WAF da Cloudflare.

### 5. Compilação Limpa (Zero Type Errors)
Executar compilação local prévia:
```bash
npm run build
```
*Critério de Aprovação:* Build concluído com sucesso (`✓ Compiled successfully`).

---

## 🔄 Fluxo de Trabalho (Step-by-Step)

### Fase 1: Desenvolvimento e Validação Local
1. Desenvolver as features e testar localmente em `http://localhost:3000`.
2. Registrar migrações de banco em arquivos SQL estruturados.
3. Garantir compilação com zero erros de TypeScript.

### Fase 2: Ponto de Verificação e Commit
4. Executar `git status` e `git diff` para revisar as alterações.
5. Fazer o commit com mensagem semântica clara (ex: `feat(cms): adicionar gestor de horarios de missa`).

### Fase 3: Publicação em Produção (Go-Live)
6. Enviar alterações para a branch `main` (`git push origin main`).
7. Acompanhar o deploy na Vercel e verificar se o portal público e o painel administrativo responderam com status 200.
