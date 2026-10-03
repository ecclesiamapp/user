# 📅 Cronograma Realista de Lançamento: Catedral de Colatina

> **Premissa:** Trabalho executado fora do expediente (1h a 2h por noite + finais de semana)  
> **Estratégia:** Lançamento Fasiado (Site Principal primeiro para ganho de tração; Comunidades na Fase 2)  
> **Data de Referência:** 01 de Outubro de 2026 (Quinta-feira)  

---

## 🎯 1. As Duas Melhores Opções de Data para Apresentar ao Padre

Na Igreja Católica, o lançamento de qualquer projeto digital **sempre deve acontecer em um Domingo**, quando os padres anunciam no púlpito ao final das missas e os fiéis experimentam o site no celular.

| Opção | Data Sugerida | Prazo | Nível de Conforto | Recomendação |
| :--- | :--- | :--- | :--- | :--- |
| **Opção Ouro (Segunda Quinzena de Novembro)** ⭐ | **Domingo, 22/11 ou 29/11/2026** | **~50 dias** | **Excelente & Sem Pressão** | **A melhor escolha pastoral.** Coincide com a Solenidade de Cristo Rei ou o 1º Domingo do Advento (preparação de Natal e Fim de Ano). Dá folga absoluta para a sua rotina noturna. |
| **Opção Outubro (Expressa)** | **Domingo, 18/10 ou 25/10/2026** | **17 a 24 dias** | Ritmo Acelerado | Opção para quem quer resultado imediato logo nos primeiros domingos. |

---

## 🧭 2. Distribuição da Carga de Trabalho (Passo a Passo Noturno)

Como a base técnica já está ~70% pronta (banco Supabase migrado, Next.js compilando e rotas administrativas criadas), o esforço restante para o site principal é de apenas **8 a 12 horas líquidas de código**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   JORNADA DE EXECUÇÃO NOTURNA (FASE 1)                 │
├─────────────────────┬───────────────────────────┬──────────────────────┤
│ SEMANA 1 (02 a 09)  │ SEMANA 2 (10 a 16)        │ SEMANA 3 (17 e 18)   │
│ Ajustes & Front-end │ Deploy & Homologação      │ Treinamento & Go-Live│
│ • Home solene       │ • Domínio & Produção      │ • Treino secretária  │
│ • WhatsApp & PIX    │ • Testes no celular       │ • Missa de Lançamento│
│ • Fotos oficiais    │ • Feriado de 12/10        │   (Domingo, 18/10)   │
└─────────────────────┴───────────────────────────┴──────────────────────┘
```

### 🗓️ Semana a Semana:

#### Semana 1: Ajuste Fino da Home e Canais de Contato (02 a 09 de Outubro)
* **Tempo diário:** 1h a 1h30 por noite.
* **O que fazer:**
  - Aplicar o layout solene na Home (`app/page.tsx`): paleta pergaminho acolhedor, tipografia Clara e card de Missas de Hoje (07h e 19h).
  - Configurar os botões diretos de WhatsApp da Secretaria (Batismo, Casamento, Confissões).
  - Inserir o botão do **Dízimo PIX Copia e Cola** com a chave oficial da Catedral.

#### Semana 2: Deploy em Produção e Feriado de Testes (10 a 16 de Outubro)
* **Tempo:** Final de semana de 10 a 12 de Outubro (aproveitando o feriado nacional de N. Sra. Aparecida na segunda-feira, 12/10).
* **O que fazer:**
  - Realizar o deploy oficial na Vercel (ou servidor de produção).
  - Configurar o apontamento de domínio (`catedraldecolatina.org.br`).
  - Testar o atalho no celular (PWA) no Android e iPhone.
  - Validação rápida de 15 minutos com o Pe. Irineu.

#### Semana 3: Alinhamento Final & Lançamento Dominical (17 e 18 de Outubro)
* **Sexta-feira (16/10) ou Sábado (17/10):** Treinamento de 1 hora com a secretária paroquial ensinando a alterar avisos e missas no `/admin`.
* **Domingo, 18 de Outubro de 2026 — O GO-LIVE OFICIAL:**
  - Os padres anunciam nas missas das 07h e 19h.
  - A PASCOM divulga no Instagram o link oficial e o QR Code.

---

## ⛪ 3. E as 11 Comunidades (CEBs)? (Fase 2)

Lançar as comunidades na segunda etapa é a **decisão estratégica mais inteligente**, pois:
1. **Elimina o gargalo de espera:** Não ficamos travados esperando os coordenadores de bairro enviarem fotos das capelas e textos históricos.
2. **Gera expectativa positiva:** Na missa de lançamento, o Padre já anuncia:  
   > *"Neste primeiro momento estamos inaugurando o portal principal da Catedral, e nas próximas semanas cada uma das nossas 11 comunidades do interior e bairros terá sua página exclusiva no ar!"*

* **Prazo para a Fase 2 (Comunidades):** Primeira quinzena de Novembro (**Domingo, 08 de Novembro de 2026**).

---

## 🎙️ Como Falar Essa Data para o Padre Irineu na Reunião:

> *"Padre Irineu, para garantir um trabalho impecável e com respeito à rotina da secretaria, nossa proposta é fazermos o lançamento oficial em duas etapas:*
> 
> *1. **No Domingo, 18 de Outubro**, inauguramos o Portal Principal da Catedral. Já colocamos no ar as missas de hoje, o WhatsApp da secretaria e o Dízimo no PIX, além de fazermos o treinamento da secretária.*
> 
> *2. **Em seguida, durante as semanas seguintes**, vamos envolver os coordenadores de cada uma das 11 comunidades para recolher fotos e lançar os mini-sites das capelas com mapas GPS.*
> 
> *Dessa forma, o senhor já tem um resultado concreto no celular dos fiéis em menos de 3 semanas, sem atropelos."*
