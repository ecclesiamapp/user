# 🚀 Prompt de Continuidade - Início da Próxima Sessão (Fase 2: Folhetos Litúrgicos & Liturgia Diária)

Copie e cole a instrução abaixo no início da próxima sessão para continuar o desenvolvimento exatamente de onde paramos:

---

```markdown
Atue como Arquiteto Principal e Engenheiro Full-Stack do Ecclesiam App.
Consulte o arquivo de continuidade [documentation]/planejamento/PROMPT_DE_CONTINUIDADE.md e execute o PROTOCOLO_START.md.

Nosso objetivo para esta sessão (Fase 2 da Renovação da Catedral):
1. Implementar o módulo "Sou do Sagrado Missa" no Portal Público:
   - Repositório organizado e limpo para download dos folhetos de missa semanais impressos (PDF).
   - Calendário litúrgico e buscador por domingos/datas com identificação do tempo litúrgico.
2. Implementar a tela administrativa em /admin/folhetos:
   - Upload de novos arquivos PDF e gerenciamento do acervo da equipe de liturgia.
3. Implementar o Widget Nativo de Liturgia Diária na Home (/):
   - Exibição da Primeira Leitura, Salmo Responsorial e Evangelho do dia com indicação da cor litúrgica.
4. Integrar o filtro dinâmico de celebrações por CEB/Matriz na seção de Horários do Portal do Fiel.
```

---

## 📌 Estado Atual do Projeto ao Encerrar esta Sessão

1. **Supabase PostgreSQL & Carga Real da Catedral (100% Ativa):**
   * **Clero Oficial:** 3 padres ativos (`clergy`): Pároco Pe. Irineu Claudino Sales, Vigários Pe. Deivid José e Pe. Ernandes Samuel.
   * **Rede Paroquial:** As 11 CEBs reais da Catedral migradas (`communities`) com endereços, bairros e fundações.
   * **Pastorais e Movimentos:** 10 pastorais reais cadastradas (`pastorals`): EAC, ECC, PASCOM, Catequese, Liturgia, Escuta, Criança, etc.
   * **Tabelas Prontas:** `liturgy_booklets` e `galleries` criadas com RLS e índices.
2. **Telas e Rotas em Produção Local:**
   * `/` (Portal do Fiel): Hero litúrgico, horários, grade de CEBs reais com botão de rotas GPS e dízimo PIX.
   * `/secretaria`: Página pública institucional com perfil canônico dos sacerdotes, expediente, ramais setorizados e Linha do Tempo desde 1927.
   * `/admin`: Dashboard com métricas consolidadas (incluindo Rede Paroquial de CEBs) e sidebar ativa.
   * `/admin/secretaria`: Gestão do clero e horários de atendimento.
   * `/admin/comunidades`: Gestão interativa das CEBs conectada ao Supabase Live.
   * `/admin/horarios`: Filtro de horários por CEB e modal de cadastro.
3. **Design System & Engenharia:**
   * Biblioteca centralizada em `components/ui/` (`Button`, `Card`, `Badge`, `Input`, `Select`, `Modal`).
   * 0 arquivos violando o limite anti-monolito (todos abaixo de 320 linhas).
   * Auditoria UX/UI: 18 arquivos verificados com 0 avisos pendentes.
   * Compilação Next.js 16 (Turbopack) com 100% de sucesso.
4. **Documentos Oficiais de Referência:**
   * [`[documentation]/planejamento/IMPLEMENTACOES_PENDENTES.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/IMPLEMENTACOES_PENDENTES.md): Backlog futuro detalhado ([MainAdmin], Mini-Sites das CEBs, Agendamento de Confissões, Área do Fiel e Movimentos ECC/EAC/EJC).
   * [`[documentation]/planejamento/CUSTOS_INFRAESTRUTURA.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/CUSTOS_INFRAESTRUTURA.md): Análise financeira completa em Reais (R$), guia de operação a custo R$ 0,00 e escalabilidade SaaS.
5. **Repositório GitHub:**
   * URL: `https://github.com/ecclesiamapp/user.git` (Branch `main` limpa e 100% sincronizada).
