# 🚀 Prompt de Continuidade - Próxima Sessão (Deploy Vercel & CEBs)

Copie e cole a instrução abaixo no início da próxima sessão para continuar o desenvolvimento exatamente de onde paramos:

---

```markdown
Atue como Arquiteto Principal e Engenheiro Full-Stack do Ecclesiam App.
Consulte o arquivo de continuidade [documentation]/planejamento/PROMPT_DE_CONTINUIDADE.md e execute o PROTOCOLO_START.md.

Nosso objetivo para esta sessão:
1. Conectar e realizar o Deploy em Produção na Vercel a partir do repositório GitHub oficial: https://github.com/ecclesiamapp/user (branch main).
2. Configurar na Vercel as Variáveis de Ambiente do Supabase:
   - NEXT_PUBLIC_SUPABASE_URL=https://rlcaapydcozsshafyvxx.supabase.co
   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_4owsId5hR4yvtOgvJw2ApA_QC-qN1Iu
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_4owsId5hR4yvtOgvJw2ApA_QC-qN1Iu
3. Validar se o build em produção na Vercel subiu com 100% de sucesso.
4. Aplicar e iniciar a implementação do Módulo de CEBs (Comunidades Eclesiais de Base) conforme detalhado em [documentation]/planejamento/ESCOPO_HIERARQUIA_CEBS.md, criando a tabela no Supabase e a interface no Painel Admin (/admin/comunidades).
```

---

## 📌 Estado Atual do Projeto ao Encerrar esta Sessão

1. **Repositório GitHub Conectado e Sincronizado:**
   * URL Remota: `https://github.com/ecclesiamapp/user.git`
   * Branch: `main` (rastreando `origin/main`)
   * Status: Limpo, 0 pendências.
2. **Next.js 16 + Tailwind CSS v4 + TypeScript:**
   * Compilação local `npm run build` testada com 0 erros.
3. **Supabase SSR & Middleware:**
   * Pacotes `@supabase/supabase-js` e `@supabase/ssr` instalados.
   * `utils/supabase/server.ts`, `client.ts` e `middleware.ts` criados.
   * `middleware.ts` na raiz ativo.
   * Rota de validação `/todos` criada.
4. **Agent Skills Instaladas:**
   * `supabase` e `supabase-postgres-best-practices` em `.agents/skills/`.
5. **SSOT e Protocolos:**
   * `[documentation]/MANIFESTO_ECCLESIAM.md` (White-Label Golden Rule).
   * 9 Protocolos em `[documentation]/protocolos/`.
