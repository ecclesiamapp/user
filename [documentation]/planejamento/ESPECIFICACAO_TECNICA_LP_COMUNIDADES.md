# 🏛️ Especificação Técnica: Landing Pages das Comunidades (CEBs) — Ecclesiam App

> **Documento Oficial de Engenharia, Produto e Arquitetura Canônica**  
> **Módulo:** Fase 7 — Expansão das Comunidades, Gestão de Acessos & Secretaria On-line  
> **Status:** Aprovado para Implementação (Fevereiro/Março 2027)  
> **Paróquia Piloto:** Catedral do Sagrado Coração de Jesus — Diocese de Colatina / ES  
> **Rotas Relacionadas:**  
> * Portal Público: `/comunidades` e `/comunidades/[slug]`  
> * Painel Administrativo: `/admin/comunidades`

---

## 1. 🎯 Visão Geral & Propósito Pastoral

No modelo eclesial católico e nas diretrizes pastorais da **Diocese de Colatina** e da **CNBB**, a paróquia é uma **"Rede de Comunidades"** (*Doc. 100 da CNBB*). As 11 Comunidades Eclesiais de Base (CEBs) e o Grupo de Reflexão que compõem a Catedral Sagrado Coração de Jesus não são meras filiais burocráticas, mas núcleos vivos onde as famílias vivenciam a Palavra, a Eucaristia, a partilha e a fraternidade em seus próprios bairros.

### O Problema Atual:
Anteriormente, o portal exibia apenas um resumo simples (histórico curto, endereço e horários de missas). O paroquiano do bairro não encontrava:
1. Quem são os coordenadores locais do seu **Conselho Pastoral Comunitário (CPC)**.
2. Os avisos internos semanais da sua comunidade (ensaios, reuniões da catequese, mutirões comunitários).
3. Como funciona a partilha do Dízimo e ofertas na própria comunidade (mensageiros dos setores e plantão).
4. O calendário de celebrações comunitárias e festas do padroeiro local.
5. Dados estruturados para indexação no Google Maps e busca orgânica local por bairro.

### A Solução Ecclesiam:
Transformar cada rota `/comunidades/[slug]` em uma **Landing Page Completa e Dinâmica**, mantendo a identidade visual elegante da Catedral, com navegação fluida em dispositivos móveis (Mobile-First) e total autonomia de dados.

---

## 2. 🏛️ Arquitetura das 6 Seções Canônicas da LP

Cada Landing Page de comunidade é estruturada em 6 módulos integrados:

```
┌─────────────────────────────────────────────────────────────┐
│ 0. BARRA DE AFILIAÇÃO & HEADER FLUTUANTE DA CAPELA          │
│    • Faixa discreta: Paróquia Sagrado Coração de Jesus      │
│    • Header flutuante minimalista: Logo + Nome da Comunidade    │
│    • Menu de âncoras locais: Horários, Avisos, CPC, Dízimo  │
├─────────────────────────────────────────────────────────────┤
│ 1. HERO MONUMENTAL & IDENTIDADE SACRA (IMERSIVO)            │
│    • Foto da Fachada / Vitral da Comunidade com iluminação nobre│
│    • Nome Oficial + Padroeiro(a) + Solenidade + Chips       │
│    • Card Flutuante Inteligente: Próxima Celebração da CEB  │
│    • Ações Rápidas: Rota GPS (Google Maps & Waze) + WhatsApp│
├─────────────────────────────────────────────────────────────┤
│ 2. VIDA LITÚRGICA & CELEBRAÇÕES (FAIXA HORIZONTAL)          │
│    • Grade semanal de Santa Missa e Celebração da Palavra   │
│    • Botão WhatsApp para confirmação de horários            │
├─────────────────────────────────────────────────────────────┤
│ 3. MURAL DE AVISOS DINÂMICO DA CAPELA                       │
│    • Comunicados locais da semana com badges de prioridade  │
│    • Categorias: Aviso, Liturgia, Catequese, Mutirão        │
├─────────────────────────────────────────────────────────────┤
│ 4. CONSELHO PASTORAL COMUNITÁRIO (CPC) & PASTORAIS          │
│    • Coordenador(a), Vice, Liturgia, Dízimo e Catequese     │
│    • Grupos locais: Terço dos Homens, Mãe Rainha, Círculos  │
├─────────────────────────────────────────────────────────────┤
│ 5. DÍZIMO, OFERTAS & SUSTENTO PASTORAL                      │
│    • Plantão do Dízimo local (dias e horários)              │
│    • Chave e QR Code PIX Paroquial com identificador da CEB │
├─────────────────────────────────────────────────────────────┤
│ 6. COMO CHEGAR & LOCALIZAÇÃO GPS                            │
│    • Endereço no bairro, mapa e rotas Google Maps e Waze    │
├─────────────────────────────────────────────────────────────┤
│ 7. RODAPÉ EXCLUSIVO DA COMUNIDADE (COMMUNITY FOOTER)        │
│    • Dados e canais da Comunidade + Selo de pertença paroquial  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 👥 Modelo de Liderança: Conselho Pastoral Comunitário (CPC)

O CPC é o órgão de comunhão e corresponsabilidade na comunidade. A estrutura de dados contempla:

| Cargo Canônico | Responsabilidade Pastoral |
| :--- | :--- |
| **Coordenador(a) do CPC** | Articulação geral das atividades da comunidade e representação no CPP paroquial. |
| **Vice-Coordenador(a)** | Apoio executivo e coordenação operacional de eventos locais. |
| **Secretário(a)** | Registro de atas, comunicações internas e contato com a Secretaria da Catedral. |
| **Tesoureiro(a)** | Prestação de contas das ofertas locais, manutenção da comunidade e dízimo. |
| **Coordenador(a) de Liturgia** | Equipes de canto, leitores, ministros da Eucaristia e acolhida. |
| **Coordenador(a) de Catequese** | Iniciação à Vida Cristã (Crianças, Jovens e Adultos) no bairro. |
| **Coordenador(a) do Dízimo** | Conscientização pastoral e animação dos mensageiros de setor. |

---

## 4. 📢 Mural de Avisos Dinâmico da Comunidade

Para evitar o excesso de papel impresso e garantir que os avisos dados no presbitério alcancem as famílias durante a semana:
* **Entrada de Dados:** No `/admin/comunidades`, a secretária ou a liderança autorizada cadastra comunicados com título, conteúdo, data de publicação e data de expiração.
* **Categorias Litúrgicas/Pastorais:**
  * `aviso` (comunicados gerais de assembleias, horários de secretaria)
  * `liturgia` (escalas de leitores, ensaios de cantores, tríduos)
  * `formacao` (encontros de catequese, formação de ministros, círculos bíblicos)
  * `mutirao` (limpeza da comunidade, ornamentação, preparação de quermesse)
* **Status:** Avisos expirados saem automaticamente da visualização pública.

---

## 5. 💰 Dízimo & Partilha da Comunidade

De acordo com o Direito Canônico e as diretrizes do Theòs:
* A arrecadação do Dízimo é paroquial, mas o fiel do bairro realiza sua devolução prioritariamente em sua comunidade de pertença.
* **Informações Prestadas na LP:**
  * Dias e horários do **Plantão do Dízimo** na comunidade (ex: antes e após as celebrações dominicais).
  * Contato com os **Mensageiros do Dízimo** que atendem as ruas do bairro.
  * Chave PIX oficial da paróquia acompanhada da instrução canônica para inserção do nome da comunidade no campo de identificação/descrição do PIX.

---

## 6. 🌐 SEO Local & Microdados Schema.org

Para garantir que moradores de bairros como *Maria Ismênia, Operário, Tropical, Perpétuo Socorro e Vista da Serra* encontrem a sua comunidade imediatamente ao buscar no Google termos como *"Igreja católica no Bairro Operário Colatina"* ou *"Horário de missa Perpétuo Socorro Colatina"*:

### Marcação Schema.org Implementada:
```json
{
  "@context": "https://schema.org",
  "@type": "CatholicChurch",
  "name": "Comunidade São Francisco de Assis",
  "parentOrganization": {
    "@type": "CatholicChurch",
    "name": "Catedral Sagrado Coração de Jesus - Diocese de Colatina"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Fabiano Silvas, S/N",
    "addressLocality": "Colatina",
    "addressRegion": "ES",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -19.52410,
    "longitude": -40.64022
  },
  "publicAccess": true
}
```

---

## 7. 📱 Diretrizes Mobile-First & Acessibilidade

* Alvos de clique de navegação (Google Maps, Waze, WhatsApp) com no mínimo `min-h-[44px]`.
* Sem rolagem horizontal em telas de `360px` a `414px`.
* Alto contraste em Dark Mode utilizando os tokens oficiais:
  * Superfície: `var(--dash-surface)`
  * Texto Principal: `var(--dash-text-primary)`
  * Texto Secundário: `var(--dash-text-secondary)`
  * Acentos Litúrgicos: `#FFA82A`, `#8B1E22`, `#C8A463`.
