---
name: Auditoria UX/UI Proativa
description: Um auditor automático de CSS e Tailwind para garantir layouts em Dark Mode e componentes premium. Deve ser acionado por palavras-chave (UX, UI, implementar) ou protocolo start.
---

# Auditoria UX/UI Proativa - Ecclesiam App

Esta skill foi criada para garantir a conformidade constante com o `PROTOCOLO_DEV_UX_UI.md` durante o desenvolvimento do **Ecclesiam App**.

## Como funciona?
Sempre que você (IA) receber instruções para modificar UI, ou o usuário usar palavras-chave como **implementar**, **adicionar botão**, **UX**, **UI**, ou acionar o **protocolo start**, você DEVE executar OBRIGATORIAMENTE as etapas abaixo em ordem.

---

## ⚡ PROTOCOLO START — Sequência Obrigatória

Ao receber o comando "protocolo start" (ou variações como "execute o protocolo start"), execute as seguintes etapas **sempre, em ordem, sem pular nenhuma**:

### Etapa 1 — Verificação de Sincronicidade do Repositório
Execute o comando abaixo para verificar se o repositório local está sincronizado com o remoto:

```bash
git fetch origin && git status && git log --oneline -3
```

- Se o local estiver **à frente** do remoto: informar ao usuário e perguntar se deseja fazer `git push`.
- Se o remoto estiver **à frente** do local: executar `git pull --rebase origin main` e reportar o resultado.
- Se houver **divergência**: executar `git pull --rebase origin main`, resolver eventuais conflitos e reportar.
- Se estiver **sincronizado**: apenas confirmar ao usuário.

### Etapa 2 — Iniciar o Servidor Local
Verifique se o servidor de desenvolvimento Next.js já está rodando:

```bash
npm run dev
```

Aguardar a confirmação `✓ Ready` no log antes de prosseguir.
Link de acesso: `http://localhost:3000`

### Etapa 3 — Auditoria UX/UI
Somente após concluir as etapas 1 e 2, executar o script de varredura:

```bash
node .agents/skills/ux_ui_auditor/scripts/audit_ux_ui.js
```

Após o script, verificar tamanho dos arquivos editados e acionar a Skill Anti-Monolito se algum ultrapassar 350 linhas.

---

## O que deve ser avaliado/corrigido?
1. **Cores estáticas no Dark Mode**: Classes como `bg-white`, `bg-black`, `text-black` avulsas em layouts.
2. **Arredondamento Padrão**: Cantos arredondados estilo SaaS moderno (`rounded-2xl`, `rounded-xl`). Proibido `rounded-none`.
3. **Glassmorphism**: Aplicação de `backdrop-blur-md` ou `backdrop-blur-xl`.
4. **Otimização de Espaços**: Quando formulários ou cards deixarem espaços vazios na tela, organize-os em duas colunas (`grid grid-cols-1 lg:grid-cols-2`).
5. **Regra White-Label**: Garantir ausência do termo ou logo "Ecclesiam" nas páginas públicas do portal do fiel.
