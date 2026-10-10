# 🚀 Prompt de Continuidade — Ecclesiam App & Catedral de Colatina

Copie e cole o bloco abaixo no início da sua próxima sessão para restaurar instantaneamente todo o contexto, regras inquebráveis, arquitetura e o estado exato da aplicação.

---

```markdown
Olá! Sou o desenvolvedor do **Ecclesiam App** (SaaS Multi-Paróquia) e da **Catedral de Colatina** (paróquia piloto oficial aprovada pelo Pe. Irineu Claudino Sales). Estou dando continuidade ao desenvolvimento do projeto.

Por favor, adote e siga rigorosamente as seguintes DIRETRIZES E REGRAS MANDATÓRIAS DO PROJETO:

1. **Regra de Ouro do White-Label:** No portal público (`/` e rotas do fiel), a marca "Ecclesiam" NUNCA deve aparecer em destaque. Toda a identidade pertence unicamente à Catedral do Sagrado Coração de Jesus (brasão, cores, monograma e padroeiro). A marca Ecclesiam opera exclusivamente nos bastidores da infraestrutura SaaS.
2. **Sincronização de Documentação (SSOT):** Toda documentação técnica, especificação, roteiro ou planejamento DEVE residir em `[documentation]/` e `[documentation]/planejamento/`.
3. **Regra de Menus Dropdown (<select>):** Sempre utilizar a classe `.dash-select` (definida em `globals.css`) que aplica `appearance-none`, seta SVG e padding adequado (`pl-3.5 pr-10 py-2`).
4. **Exibição Obrigatória de Código SQL:** Toda migração SQL (`.sql`) gerada ou necessária DEVE ser exibida na íntegra em bloco markdown diretamente no chat sem que o usuário precise pedir.
5. **Auditoria Anti-Monolito:** Arquivos devem ser mantidos com menos de 350-500 linhas; componentes grandes devem ser modularizados (UI-as-a-Service).
6. **Auditoria UX/UI (Design System Pe. Alex Nogueira):** Paleta pergaminho (`#F5EFE7`), areia (`#EEE3D4`), vermelho Sagrado Coração (`#8B1E22`), ouro âmbar (`#FFA82A`) e marrom ébano (`#2D1A16`). Tipografia `Sora` e display `Suez One`. NUNCA utilizar `bg-white`, `bg-black`, `text-white`, `text-black` puros em estrutura (utilizar as variáveis CSS `--dash-*` / `--cat-*`). Cantos arredondados generosos (`rounded-2xl` containers, `rounded-xl` botões/inputs).
7. **Protocolo Deploy:** Antes de qualquer commit/push ou subida para produção, OBRIGATÓRIO validar localmente para garantir 0 erros de compilação.

---

### STACK TÉCNICA:
- **Framework:** Next.js 16 (App Router) + TypeScript + React 19.
- **Estilização:** Tailwind CSS v4 + Design System customizado (`--dash-*`, `--cat-*`).
- **Backend & Auth:** Supabase (PostgreSQL com RLS multi-tenant por `parish_id`, Auth via SSR `@supabase/ssr`, Storage para PDFs no bucket `booklets`).
- **MCP:** Supabase MCP Server configurado em `mcp_config.json` e `.mcp.json` (`https://mcp.supabase.com/mcp`).
- **PWA:** Web App Manifest dinâmico (`app/manifest.ts`), ícones adaptativos e prompt customizado de instalação.

---

### ESTADO ATUAL DO PROJETO (09/10/2026):
1. **Design System & Home:** Paleta pergaminho, Marquee contínuo de avisos, Floating schedule card de missas de hoje, Destaque da Palavra do Pároco/Bispo e Central de Conscientização do Dízimo + QR Code de Doações PIX 100% integrados.
2. **Coluna Editorial Pastoral:** Rota `/mensagens` com leitor de artigos na íntegra (`/mensagens/[slug]`) e painel de controle `/admin/mensagens`.
3. **Coluna Editorial Pastoral & CRUD:** Rota pública `/mensagens` com leitor de artigos na íntegra (`/mensagens/[slug]`) e painel de controle `/admin/mensagens` 100% integrado ao Supabase com modal `MessageFormModal` e `MessageCard`.
4. **Clero Atualizado:** 4 Padres ativos integrados em `/secretaria` e `/admin/secretaria` (Pe. Irineu, Pe. Adilson, Pe. Deivid, Pe. Ernandes).
5. **12 Comunidades & Grupos de Reflexão:** Mapeadas com mini-sites dinâmicos `/comunidades/[slug]` com mapas GPS (Google Maps e Waze), incluindo o recém-integrado Grupo de Reflexão Santa Rita (Brisa do Vale).
6. **Módulo de Folhetos Litúrgicos («Sou do Sagrado Missa»):** Painel administrativo completo em `/admin/folhetos` com upload para o Supabase Storage (`booklets`), vinculação na sidebar (`app/admin/layout.tsx`) e sincronização dinâmica na Home (`MissalBookletsSection.tsx`).
7. **Nova Skill de Gestão («project_health_timeline»):** Monitoramento contínuo de prazo (23 dias para 01/11), cálculo automatizado de saúde e timeboxing interativo por sessão.
8. **Compilação e Saúde:** 17 rotas estáticas e dinâmicas compilando perfeitamente com 0 erros no build de produção.

---

### PRÓXIMAS AÇÕES IMEDIATAS:
1. Checklist de Go-Live da Fase 1 (Cloudflare, DNS, Vercel, Variáveis de Produção).
2. Protocolo Deploy para envio das alterações ao repositório remoto.



Por favor, confirme que você compreendeu o contexto, a stack e as regras do projeto, e me informe o status para darmos continuidade.
```
