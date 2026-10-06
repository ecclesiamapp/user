# 🚀 Prompt de Continuidade — Ecclesiam App & Catedral de Colatina

Copie e cole este bloco de texto no início da sessão na sua nova máquina para restaurar instantaneamente todo o contexto, regras inquebráveis, arquitetura e o estado exato da aplicação.

---

```markdown
Olá! Sou o desenvolvedor do **Ecclesiam App** (SaaS Multi-Paróquia) e da **Catedral de Colatina** (paróquia piloto). Acabei de abrir o projeto nesta nova máquina.

Por favor, adote e siga rigorosamente as seguintes DIRETRIZES E REGRAS MANDATÓRIAS DO PROJETO:

1. **Regra de Ouro do White-Label:** No portal público (`/` e rotas do fiel), a marca "Ecclesiam" NUNCA deve aparecer em destaque. Toda a identidade pertence unicamente à Catedral do Sagrado Coração de Jesus (brasão, cores, monograma e padroeiro). A marca Ecclesiam existe exclusivamente nos bastidores administrativos da infraestrutura SaaS.
2. **Sincronização de Documentação (SSOT):** Toda documentação técnica, especificação, roteiro ou planejamento DEVE residir em `[documentation]/` e `[documentation]/planejamento/`.
3. **Regra de Menus Dropdown (<select>):** Sempre utilizar a classe `.dash-select` (definida em `globals.css`) que aplica `appearance-none`, seta SVG e padding adequado (`pl-3.5 pr-10 py-2`).
4. **Exibição Obrigatória de Código SQL:** Toda migração SQL (`.sql`) gerada ou necessária DEVE ser exibida na íntegra em bloco markdown diretamente na sua resposta no chat.
5. **Auditoria Anti-Monolito:** Arquivos devem ser mantidos com menos de 350-500 linhas; componentes grandes devem ser modularizados (UI-as-a-Service).
6. **Auditoria UX/UI:** NUNCA utilizar `bg-white`, `bg-black`, `text-white`, `text-black` puros em estrutura (utilizar as variáveis CSS `--dash-surface`, `--dash-text-primary`, etc.). Manter cantos arredondados generosos (`rounded-2xl` containers, `rounded-xl` botões/inputs).
7. **Protocolo Deploy:** Antes de qualquer commit/push ou subida para produção, OBRIGATÓRIO validar com `npm run build` localmente para garantir 0 erros de compilação.

---

### STACK TÉCNICA:
- **Framework:** Next.js 16 (App Router, Turbopack) + TypeScript + React 19.
- **Estilização:** Tailwind CSS v4 + Design System com tokens customizados (`--dash-*` / `--cat-*`).
- **Backend & Auth:** Supabase (PostgreSQL com RLS multi-tenant por `parish_id`, Auth via SSR `@supabase/ssr`).
- **PWA:** Web App Manifest dinâmico (`app/manifest.ts`), ícones adaptativos e prompt customizado de instalação.

---

### ESTADO ATUAL DO PROJETO (05/10/2026):
1. **Clero Atualizado:** 4 Padres ativos integrados em `/secretaria` e `/admin/secretaria`:
   - Pe. Irineu Claudino Sales (Pároco)
   - Pe. Adilson Ramos de Melo (Vigário)
   - Pe. Deivid José (Vigário)
   - Pe. Ernandes Samuel (Vigário)
2. **Mini-Sites das 11 CEBs (Comunidades):** Rota dinâmica `/comunidades/[slug]` funcional com padroeiro, história, endereço, horários de celebração e navegação GPS integrada (Google Maps e Waze).
3. **Liturgia Diária & Folhetos de Missa:** Faixa de Liturgia Diária oficial da CNBB na Home com leituras completas em modal, e seção "Sou do Sagrado Missa" para download dos folhetos semanais em PDF.
4. **Apresentação Comercial & Pastoral:** Arquivo interativo `[documentation]/apresentacao_catedral_pe_irineu.html` pronto com os 10 slides estratégicos e diagramas de infraestrutura para a reunião com o Pe. Irineu.
5. **Roteiro de Produção:** Roteiro completo de deploy de domínio e segurança documentado em `[documentation]/ROTEIRO_DEPLOY_DOMINIO_PORTAL_CATEDRAL.md`.
6. **Qualidade de Código:** Build 100% verde (`npm run build` passando sem erros de tipagem).

---

Por favor, confirme que você compreendeu o contexto, a stack e as regras do projeto. Em seguida, valide se as dependências e o ambiente local estão saudáveis e me apresente as opções de próximos passos a implementar.
```
