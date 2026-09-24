# 🧱 Protocolo de Refatoração de Monolitos - Ecclesiam App

## 1. Objetivo
O objetivo deste protocolo é garantir que processos de refatoração de arquivos grandes ("monolíticos") sejam executados de forma totalmente segura, sem gerar **nenhum retrabalho** na parte de Design, Layout (UI) e UX do **Ecclesiam App**.

---

## 2. A Trava Absoluta (Recortar e Colar)
Toda e qualquer extração de componentes deve seguir a regra da **Trava Absoluta**:
- O código JSX e as classes CSS (Tailwind) devem ser **EXATAMENTE RECORTADOS** do arquivo original e **COLADOS** no novo arquivo menor.
- É **estritamente proibido** alterar as tags HTML, reestruturar o DOM ou modificar as classes visuais durante uma refatoração estrutural.
- O componente extraído deve receber as props necessárias de forma transparente e tipada via TypeScript, garantindo que a renderização continue 100% idêntica à versão anterior.

---

## 3. Gatilhos de Detecção
- Qualquer arquivo que ultrapasse **350 linhas** deve disparar um sinal de atenção.
- Ao ultrapassar **500 linhas**, a refatoração/quebra em sub-componentes especializados torna-se fortemente recomendada antes de acrescentar novas lógicas pesadas.
- Padrão recomendado: dividir em sub-componentes (ex: `MassScheduleForm.tsx`, `NewsCard.tsx`, `PixQrCodeViewer.tsx`).

---

## 4. Passos para Execução Segura
1. **Verificação Prévia:** Executar compilação ou checagem de tipos (`npx tsc --noEmit` ou `npm run build`) antes de iniciar.
2. **Ponto de Restauração:** Criar um commit de backup de segurança (`git commit -m "chore: checkpoint pre-refactoring"`).
3. **Extração Cirúrgica:** Aplicar a regra da Trava Absoluta ao mover os blocos JSX para novos componentes.
4. **Validação:** Rodar o build novamente para validar a integridade da quebra antes de retomar a implementação da feature principal.
