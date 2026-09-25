# 🚀 Prompt de Continuidade - Próxima Sessão (Vínculo de Horários com CEBs & Deploy)

Copie e cole a instrução abaixo no início da próxima sessão para continuar o desenvolvimento exatamente de onde paramos:

---

```markdown
Atue como Arquiteto Principal e Engenheiro Full-Stack do Ecclesiam App.
Consulte o arquivo de continuidade [documentation]/planejamento/PROMPT_DE_CONTINUIDADE.md e execute o PROTOCOLO_START.md.

Nosso objetivo para esta sessão:
1. Validar a URL pública do Deploy em Produção na Vercel gerada a partir do repositório https://github.com/ecclesiamapp/user (branch main).
2. Conectar a seleção dinâmica de CEBs/Comunidades na tela de Horários de Missas (/admin/horarios) e no Portal Público do Fiel (/).
3. Implementar o filtro por comunidade para que o fiel possa selecionar se deseja ver celebrações da "Igreja Matriz" ou de uma "CEB / Capela" específica.
```

---

## 📌 Estado Atual do Projeto ao Encerrar esta Sessão

1. **Supabase PostgreSQL & Migração de CEBs (100% Ativa):**
   * Tabelas criadas: `parishes`, `communities`, `mass_schedules`, `announcements`.
   * Row Level Security (RLS) habilitado e verificado em todas as tabelas.
   * Índices de performance criados para relacionamentos `parish_id` e `community_id`.
   * Seed inicial ativo: Catedral Sagrado Coração de Jesus + 3 comunidades de demonstração.
2. **Interface Administrativa de CEBs (`/admin/comunidades`):**
   * Modo `Supabase Live` ativo e testado com HTTP 200.
   * Criação, listagem e persistência validadas diretamente no banco de dados.
3. **Next.js 16 + Tailwind CSS v4 + TypeScript:**
   * Compilação `npm run build` testada localmente com 0 erros.
   * `npm audit` com 0 vulnerabilidades.
4. **Repositório GitHub:**
   * URL Remota: `https://github.com/ecclesiamapp/user.git`
   * Branch: `main` limpa e 100% sincronizada.
