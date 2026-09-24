---
name: Refatoração Proativa e Anti-Monolito
description: ACIONAR SEMPRE que editar, modificar ou adicionar código em arquivos muito grandes (> 350 linhas), arquivos monolíticos ou componentes pesados do Ecclesiam App.
---

# Instruções de Refatoração Proativa - Ecclesiam App

Você deve atuar ativamente no monitoramento e combate à formação de monolitos de código, garantindo que a arquitetura do Ecclesiam App se mantenha modular, limpa e manutenível.

## 1. Gatilho de Ação (PAUSA OBRIGATÓRIA)
- Se a sua tarefa principal exigir que você altere, leia ou adicione código a um arquivo com **mais de 350 linhas**, você DEVE **PAUSAR** a execução da tarefa atual imediatamente.
- Alerte o usuário de que um Monolito foi detectado e que a refatoração/quebra desse arquivo é recomendada antes de prosseguir com novas funcionalidades.
- Proponha um plano de resolução (ex: extração de quais sub-componentes especializados) e pergunte se o usuário deseja prosseguir com a refatoração agora ou se prefere prosseguir com a tarefa planejada.

## 2. Padrão de Refatoração (Após Aprovação)
Se o usuário autorizar a resolução do monolito:
1. **Checkpoint Automático:** Crie um commit de backup executando `git add .` e `git commit -m "chore: ponto de restauracao pre-refatoracao"`.
2. **Trava Absoluta:** Aplique o recorte (cut) cirúrgico. O código JSX e as classes CSS/Tailwind originais devem ser movidos EXATAMENTE como estão para o novo arquivo menor.
3. **Autovalidação:** Execute `npm run build` ou `npx tsc --noEmit` para validar a quebra.
4. Após o sucesso, retome a tarefa original que havia sido pausada.
