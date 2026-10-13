# 🏛️ Especificação Funcional & Técnica: Módulo Secretaria On-line

> **Módulo:** Secretaria On-line (Agendamentos, Inscrições & Balcão Digital)  
> **Plataforma:** Ecclesiam App (SaaS Multi-Paróquia) & Catedral de Colatina  
> **Perfil de Usuários:** Fiel / Paroquiano (Mobile PWA & Web) e Secretaria / Clero (Painel Administrativo)  
> **Status:** Aprovado para inclusão no escopo do projeto e apresentação executiva.

---

## 🎯 1. Visão Geral e Justificativa Pastoral

A **Secretaria On-line** transforma o portal da paróquia de uma vitrine passiva de informações em um **balcão digital ativo de acolhimento e serviços paroquiais**, funcionando 24 horas por dia, 7 dias por semana.

### Dores Críticas Solucionadas:
1. **Sobrecarga de Atendimento:** Reduz drasticamente as mensagens e ligações repetitivas com dúvidas de documentação para batismo, casamento e inscrições de catequese.
2. **Organização da Agenda Sacerdotal:** Elimina agendamentos informais ou perdidos no corredor da igreja, fornecendo aos sacerdotes (**Pe. Irineu, Pe. Adilson, Pe. Deivid, Pe. Ernandes**) uma visão clara de seus atendimentos semanais.
3. **Comodidade para o Fiel:** Permite que trabalhadores e pais de família realizem inscrições e agendem sacramentos à noite ou aos finais de semana direto pelo celular.

---

## 🧭 2. Estrutura dos Três Pilares Funcionais

```
┌────────────────────────────────────────────────────────────────────────┐
│                         SECRETARIA ON-LINE                             │
├─────────────────────┬───────────────────────────┬──────────────────────┤
│  1. AGENDAMENTOS    │  2. INSCRIÇÕES            │  3. GUIA & DOCS      │
│  • Confissões       │  • Batismo                │  • O que precisa     │
│  • Direção Espirit. │  • Catequese (Euc./Crisma)│  • Prazos & Idades   │
│  • Pastoral Escuta  │  • Curso de Noivos        │  • Status da Solicit.│
│  • Atendimento Padre│  • Curso de Gestantes     │  • WhatsApp Direto   │
└─────────────────────┴───────────────────────────┴──────────────────────┘
```

### 2.1 Pilar 1 • Agendamentos Pastorais
Permite que o fiel reserve um horário com confirmação e lembrete:
* **Modalidades de Atendimento:**
  1. *Confissão Individual:* Horários reservados no confessionário da Catedral ou das capelas.
  2. *Direção Espiritual:* Atendimento pastoral prolongado na casa paroquial/secretaria.
  3. *Pastoral da Escuta:* Acolhimento fraterno e suporte pastoral por agentes preparados.
  4. *Atendimento com o Padre / Outros Assuntos:* Questões canônicas, bênçãos de residências, processos matrimoniais.
* **Fluxo do Usuário:**
  * Seleção do tipo de atendimento → Escolha do sacerdote desejado ou "Primeiro disponível" → Seleção do dia/horário na grade → Dados do fiel (Nome, WhatsApp, Comunidade) → Confirmação instantânea via WhatsApp.

### 2.2 Pilar 2 • Inscrições e Matrículas Digitais
Substitui fichas manuais de papel e formulários soltos:
* **Batismo de Crianças:**
  * Dados da criança, pais e padrinhos.
  * Escolha da data da celebração e data do Curso de Preparação para o Batismo.
  * Validação prévia dos requisitos canônicos dos padrinhos.
* **Catequese Paroquial (Infantil, Eucaristia e Crisma de Jovens/Adultos):**
  * Cadastro do catequizando e dados dos responsáveis.
  * Seleção da Comunidade de preferência (Matriz ou uma das 10 CEBs).
  * Informação de sacramentos já recebidos (Batizado: Sim/Não).
* **Curso de Noivos (Encontro de Preparação para o Matrimônio):**
  * Ficha do casal, paróquia onde residem, data e local previsto do casamento.
  * Controle de vagas com encerramento automático ao atingir o limite.
* **Curso de Gestantes (Pastoral da Criança / Familiar):**
  * Inscrição da gestante e acompanhante para acompanhamento pastoral e cursos de acolhida.

### 2.3 Pilar 3 • Guia de Requisitos e Balcão de Informações
Página organizada em formato sanfona (FAQ inteligente) com orientações claras e afetuosas:
* **Checklist de Documentos:**
  * O que os pais precisam levar (Certidão de Nascimento da criança, comprovante de residência).
  * O que os padrinhos precisam apresentar (Certidão de Crisma, certidão de matrimônio religioso se casados).
* **Processo Matrimonial:**
  * Prazos mínimos para dar entrada no processo de casamento (mínimo de 3 meses de antecedência).
  * Documentação exigida pela Cúria Diocesana de Colatina.
* **Intenções de Missa e Certidões:**
  * Regras para inclusão de intenções de 7º dia, falecimento, saúde e ação de graças.
  * Solicitação de 2ª via de lembrança de batismo ou crisma.

---

## 💻 3. Arquitetura Técnica & Banco de Dados (Supabase)

### Tabelas Principais:
1. `appointments` (Agendamentos pastorais com status: pendente, confirmado, realizado, cancelado).
2. `appointment_slots` (Grade de disponibilidade de cada sacerdote).
3. `sacrament_enrollments` (Inscrições em Batismo, Catequese, Noivos e Gestantes com campos JSONB customizados).
4. `parish_services_info` (Textos e requisitos configuráveis pela secretaria no painel admin).

### Integração Imediata (Fase MVP / Demonstração):
* Botão com ação rápida gerando mensagem formatada e estruturada direto para o **WhatsApp oficial da secretaria**, garantindo aprovação imediata do clero sem atrito técnico.
