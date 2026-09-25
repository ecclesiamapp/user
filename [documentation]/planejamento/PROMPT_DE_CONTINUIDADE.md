# 🚀 Prompt de Continuidade - Próxima Sessão (Fase 2: Folhetos Litúrgicos & Liturgia Diária)

Copie e cole a instrução abaixo no início da próxima sessão para continuar o desenvolvimento exatamente de onde paramos:

---

```markdown
Atue como Arquiteto Principal e Engenheiro Full-Stack do Ecclesiam App.
Consulte o arquivo de continuidade [documentation]/planejamento/PROMPT_DE_CONTINUIDADE.md e execute o PROTOCOLO_START.md.

Nosso objetivo para esta sessão (Fase 2 da Renovação da Catedral):
1. Implementar o módulo "Sou do Sagrado Missa": repositório organizado de folhetos impressos com calendário litúrgico e busca por data dominical para download de PDFs.
2. Implementar o Widget Nativo de Liturgia Diária (Primeira Leitura, Salmo Responsorial e Evangelho) na página inicial do portal do fiel.
3. Criar a interface de upload e gestão dos folhetos semanais em /admin/folhetos.
```

---

## 📌 Estado Atual do Projeto ao Encerrar esta Sessão

1. **Supabase PostgreSQL & Carga Real da Catedral:**
   * 3 Sacerdotes (`clergy`): Pe. Irineu Claudino Sales, Pe. Deivid José e Pe. Ernandes Samuel.
   * 14 Comunidades (`communities`): Catedral Matriz + 10 CEBs urbanas e rurais reais com endereços.
   * 10 Pastorais e Movimentos (`pastorals`): EAC, ECC, PASCOM, Catequese, Liturgia, Escuta, etc.
   * Tabelas `liturgy_booklets` e `galleries` criadas e com RLS ativado.
2. **Telas e Rotas Implementadas:**
   * `/secretaria`: Página institucional pública (Padres, Expediente, Telefones Setorizados e Linha do Tempo).
   * `/admin/secretaria`: Gestão do clero e horários de atendimento.
   * `/admin/comunidades`: CRUD completo de CEBs.
   * `/admin/horarios`: Filtro de celebrações por CEB.
   * `/`: Portal do fiel com Design System, Hero litúrgico e grade de CEBs reais com GPS.
3. **Qualidade e Deploy:**
   * Next.js 16 (Turbopack) compilando com 0 erros.
   * 0 arquivos violando a regra anti-monolito (< 320 linhas).
   * Repositório GitHub 100% sincronizado na branch `main`.
