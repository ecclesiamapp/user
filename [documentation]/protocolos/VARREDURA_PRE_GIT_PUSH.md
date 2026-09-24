# 🛡️ Protocolo Deploy (Varredura Pré-Git Push) - Ecclesiam App

Este protocolo DEVE ser executado integralmente antes de qualquer `git push` para garantir a resiliência do build na Vercel, a segurança de dados multi-tenant e a coesão visual do **Ecclesiam App**.

---

## 1. Auditoria de Tipagem (Build Resilience)
- [ ] **Proibição do `any`:** Realizar busca global por `as any` ou `: any` em componentes JSX e Server Actions.
- [ ] **Checks de Nulidade (Null Safety):** Garantir que objetos vindos do Supabase (`data`, `maybeSingle()`) utilizem optional chaining (`?.`) e coalescência nula (`??`).
- [ ] **Escopo de Variáveis:** Verificar se variáveis declaradas em blocos `try/catch` não estão sendo consumidas fora de seu escopo.
- [ ] **Sincronização de Interfaces:** Garantir que tipos TypeScript das tabelas (Paróquias, Horários de Missa, Avisos, Doações PIX) reflitam fielmente o schema do PostgreSQL.

## 2. Auditoria de Tema (Dark Mode & White-Label Compliance)
- [ ] **Sem Cores Rígidas:** Garantir a ausência de cores hexadecimais estáticas arbitrárias no layout.
- [ ] **Sem Classes Fixas Estruturais:** Verificar que `bg-white`, `bg-black`, `text-black` não foram utilizados na casca da interface (usar sempre variáveis de design tokens).
- [ ] **Isolamento de Identidade:** Garantir que o nome/marca "Ecclesiam" não esteja visível para o fiel nas rotas públicas.

## 3. Auditoria de UX e Navegação
- [ ] **Feedback de Ações:** Todos os botões que executam mutações (salvar horários, publicar aviso, gerar PIX) exibem estado de carregamento com `<Loader2 className="animate-spin" />`.
- [ ] **Arredondamento:** Containers com cantos arredondados generosos (`rounded-2xl` / `rounded-xl`). Proibido `rounded-none`.
- [ ] **Selects com Padding:** Dropdowns estilizados com padding direito adequado (`pr-10`).

## 4. Limpeza de Refatoração (Dead Code Scan)
- [ ] **Importações Órfãs:** Remover pacotes, funções e ícones importados que não estão em uso.
- [ ] **Arquivos Temporários de Teste:** Verificar e remover arquivos temporários de rascunho (`scratch*`, `temp*`).

## 5. Sincronização SSOT (Fonte Única de Verdade)
- [ ] **Documentação Atualizada:** Registrar novas decisões de arquitetura ou schema no arquivo `[documentation]/MANIFESTO_ECCLESIAM.md`.

## 6. Auditoria de Segurança (Security Guardrails)
- [ ] **RLS do Supabase Ativo:** Garantir que novas tabelas criadas possuam Row Level Security ativado e políticas restritas por paróquia (`parish_id`).
- [ ] **Proteção de Webhooks:** Assegurar que endpoints de webhook (confirmação de PIX) validem assinaturas criptográficas ou tokens de autenticação.
- [ ] **Segurança de Chaves:** Confirmar que chaves Service Role nunca são expostas a componentes com diretiva `'use client'`.

---

## 💡 Lições Aprendidas de Engenharia

1. **Erros de Escopo:** O bundler do Next.js falha se você define uma variável dentro de um bloco `try` e tenta usá-la no JSX fora dele. Declare sempre com `let` fora do bloco.
2. **Conflito de Tipos "Gêmeos":** Evite declarar interfaces duplicadas com o mesmo nome em arquivos diferentes. Centralize types em `@/types/`.
3. **Null Safety em Uploads de Imagens:** URLs de logotipos e fotos de notícias podem ser nulas; use sempre fallbacks visuais adequados.
4. **Isolamento de Portas:** O Next.js compartilha cookies em `localhost`. Use portas separadas para não cruzar sessões de autenticação com outros projetos.

---

## 🚀 Execução Final
Após validar todos os itens acima e garantir que o build local (`npm run build`) passou com sucesso:

```bash
git add .
git commit -m "feat/fix: descrição sucinta da entrega"
git push origin main
```
