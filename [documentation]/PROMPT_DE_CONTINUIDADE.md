# 🧭 PROMPT DE CONTINUIDADE (ECCLESIAM APP — CATEDRAL DE COLATINA)

> **Data de Atualização:** 24 de Novembro de 2026 (22:00)  
> **Último Commit:** `6a36739` (`main`) — *feat(povoacao): onda 2 concluida com acervo fotografico claudio costa em webp e 3 albuns oficiais*  
> **Horizonte Oficial:** Solenidade do Natal do Senhor 2026 (25/12/2026 — **Faltam 31 dias** 🟢)  
> **Status Geral do Projeto:** 🟢 **Excelente & Pronto para Escala** (0 dívidas técnicas bloqueantes, Onda 1 e Onda 2 do Povoamento 100% implantadas)

---

## 🎯 Contexto Imediato para a Próxima Sessão

Você está assumindo o projeto **Ecclesiam App**, operando no piloto da **Catedral do Sagrado Coração de Jesus (Colatina/ES)**.

Na sessão de 24/11/2026, concluímos com perfeição:
1. **Onda 1 da Povoação (Liturgia & Dados Mestre - commit `f3006da`):**
   - População de `public.mass_schedules` (25 horários canônicos ativos).
   - Cadastro e ativação da `Solenidade do Natal do Senhor 2026` (`natal-2026`) com contagem regressiva e 4 blocos litúrgicos.
   - Teste de carga e resiliência com k6 (500 usuários simultâneos, 0.00% de erro).
   - Laudo técnico executivo emitido em PDF e HTML com gráficos SVG (`LAUDO_TESTE_DE_CARGA_E_RESILIENCIA_CATEDRAL_2026.pdf`).
2. **Onda 2 da Povoação (Visual & Fotografia Autoral - commit `6a36739`):**
   - Extração e download de 16 fotos em alta resolução dos 2 álbuns do Google Fotos de autoria de **Cláudio Costa**.
   - Processamento em lote com a biblioteca `sharp` para formato `.webp` de ultra-performance com orçamentos rigorosos (`<= 120KB` para 16:9 e `<= 55KB` para 4:5).
   - Inserção de **3 álbuns oficiais** em `public.galleries` com o crédito canônico `Foto: Cláudio Costa`:
     - *Arquitetura e Fachadas da Catedral Diocesana* (6 fotos)
     - *Os Vitrais do Sagrado Coração e Arte Sacra* (3 fotos)
     - *Interior, Presbitério e Batistério da Catedral* (6 fotos)
   - Atualização do patrimônio sacro em `public.parish_sacred_heritage` e substituição de referências antigas na Home, `/historia`, `/noticias` e banner natalino.
   - Build de produção Next.js 100% estático/SSG (`68/68` páginas geradas) e deploy realizado na branch `main`.

---

## 📋 Próximos Passos Prioritários (Ondas 3 e 4 da Povoação)

1. **Onda 3: Coleta Dirigida com a Paróquia (PASCOM / Pe. Irineu / Secretária):**
   - Enviar checklist formatado no WhatsApp para coleta dos dados que ainda dependem da paróquia:
     - [ ] 1 foto horizontal de fachada das 11 Comunidades (CEBs) externas + Grupo de Reflexão Santa Rita.
     - [ ] 3 fotos reais por Movimento (ECC, EAC, EJC).
     - [ ] Confirmação de balcão: Chave PIX oficial da Mitra/Catedral, WhatsApp oficial da secretaria, horários confirmados das confissões e da Missa da Vigília do Natal (24/12).
     - [ ] Liberação do acesso DNS ao domínio `catedraldecolatina.org.br` (`TASK-12`) para apontar os nameservers na Cloudflare Free.
2. **Onda 4: Validação & Go-Live Litúrgico (15/12 a 23/12/2026):**
   - Conferencia de ponta a ponta com a secretária paroquial no `/admin`.
   - Impressão dos displays de acrílico e cartões de bolso via [`/instalar/imprimir`](http://localhost:3000/instalar/imprimir) para posicionar nos bancos antes da Missa do Galo.

---

## 🏛️ Diretrizes Críticas Inegociáveis (Relembre a cada turno)
- **Regra de Ouro do White-Label:** A marca "Ecclesiam" NUNCA aparece para o fiel.
- **Nomenclatura Litúrgica:** NUNCA usar "culto" (usar "Santa Missa" ou "Celebração da Palavra"). NUNCA usar "no Altar" para folhas de intenções (usar "Folha do Púlpito A4" ou "Intenções de Missa"). Usar "Comunidade" no lugar de "Capela", e "Catedral" no lugar de "Matriz".
- **Delimitação THEOS:** O app NÃO faz captação contábil nem relatórios de dízimo cadastrado (papel exclusivo do ERP Theòs).
- **Regra de Exibição de Código SQL:** Toda migração SQL DEVE ser exibida na íntegra no chat.
- **Estimativa de Tempo:** Toda tarefa sugerida DEVE vir com `⏱️ Tempo Estimado: ~X minutos` e pergunta expressa de validação.
- **Sincronização Local:** Manter `[documentation]/` local e Google Drive 100% espelhados.
