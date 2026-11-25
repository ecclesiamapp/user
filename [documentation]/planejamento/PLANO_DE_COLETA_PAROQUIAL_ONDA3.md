# 📋 PLANO OPERACIONAL DE COLETA PAROQUIAL & DISPARO (ONDA 3 — NATAL 2026)
## Catedral do Sagrado Coração de Jesus — Diocese de Colatina

> **Documento Oficial de Planejamento de Coleta em Espera (Standby)**  
> **Status da Tarefa:** ⏸️ **Em Espera / Agendada para Disparo pelo Desenvolvedor**  
> **Referência:** `TASK-61` no [`PLANO_DE_ACAO_DETALHADO.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/PLANO_DE_ACAO_DETALHADO.md)  
> **Data:** 24 de Novembro de 2026  
> **Janela de Execução Recomendada:** 01/12/2026 a 10/12/2026 (15 dias antes da Solenidade do Natal)

---

### 🎯 1. Objetivo & Estratégia do Plano de Espera

Como o desenvolvedor optou por **não realizar o disparo das mensagens neste exato momento**, este plano consolida exatamente:
1. O momento oportuno e os gatilhos recomendados para envio.
2. Os pacotes de mensagens prontos para cópia rápida.
3. O protocolo de recebimento e ingestão dos arquivos assim que forem entregues pela paróquia.

---

### 🗓️ 2. Cronograma Sugerido de Disparo & Acompanhamento

| Etapa | Data Sugerida | Ação Operacional | Responsável |
| :--- | :---: | :--- | :--- |
| **1. Disparo Inicial** | **01/12/2026** *(Segunda-feira pós-Advento)* | Copiar e disparar as 3 mensagens prontas (Secretaria, CEBs e Movimentos). | Desenvolvedor / Atendimento |
| **2. Primeiro Ponto de Controle** | **05/12/2026** | Checar quem respondeu no WhatsApp e reenviar lembrete para as CEBs pendentes. | Desenvolvedor |
| **3. Fechamento de Coleta** | **12/12/2026** | Baixar as fotos recebidas, converter em lote para `.webp` e registrar no banco. | Agente IA + Desenvolvedor |
| **4. Aplicação de Fallback** | **14/12/2026** | Caso alguma CEB não envie foto a tempo, aplicar imagem padrão da Catedral Sede para não deixar buraco visual. | Agente IA |

---

### 📦 3. Pacotes de Mensagens Prontos para Disparo (WhatsApp)

#### ✉️ Pacote A: Balcão da Secretaria & Pe. Irineu
* **Alvo:** Pe. Irineu Claudino Sales (Pároco) e Secretária Paroquial
* **Gatilho de Envio:** Quando o dev desejar alinhar dados institucionais e DNS.
* **Texto:**
> *Olá, Pe. Irineu e equipe da Secretaria da Catedral! Paz e bem.*  
> *Estamos nos preparativos finais da implantação do novo portal oficial da Catedral do Sagrado Coração de Jesus rumo ao Natal 2026.*  
> *Concluímos a inclusão da curadoria fotográfica de alta resolução de Cláudio Costa (fotos noturnas, vitrais e presépio).*  
> *Para deixarmos o portal 100% fiel à realidade da paróquia, precisamos apenas de 4 confirmações rápidas de balcão:*  
> *1. Chave PIX Oficial da Catedral para doações no portal (CNPJ ou outra).*  
> *2. WhatsApp Oficial da Secretaria para dúvidas dos fiéis.*  
> *3. Escala semanal habitual de confissão dos 4 padres.*  
> *4. Horário oficial da Missa da Vigília de Natal (24/12) na Catedral Sede.*  
> *5. Liberação do Domínio (catedraldecolatina.org.br) no Registro.br para apontarmos a proteção Cloudflare.*  
> *Aguardamos o retorno de vocês. Muito obrigado! 🙏✝️*

#### ✉️ Pacote B: Fotos das 11 Comunidades (CEBs) + Santa Rita
* **Alvo:** Grupo de WhatsApp dos Coordenadores de CEBs / Equipe PASCOM
* **Texto:**
> *✝️ Atenção, Coordenadores e Lideranças das nossas 12 Comunidades (CEBs) e Grupo Santa Rita!*  
> *O novo portal da Catedral terá uma página exclusiva para cada Comunidade, com mapa GPS, história do padroeiro e horários de celebrações!*  
> *Para colocarmos a foto da sua comunidade no ar, precisamos de apenas 1 Foto Horizontal da Fachada Externa de cada comunidade (tirada de dia, com boa luz, mostrando a frente limpa).*  
> *Comunidades pendentes: Penha, Guadalupe, Perpétuo Socorro, Sagrada Família, Santa Luzia, Santo Antônio, Santo Expedito, São Bento, São Francisco, São Lucas, São Pedro e Grupo Santa Rita.*  
> *Como enviar: Envie aqui no grupo ou para a PASCOM com a legenda: "Foto Comunidade [Nome] - Bairro [Nome]". Contamos com vocês! 🌟*

#### ✉️ Pacote C: Fotos dos Movimentos Paroquiais (ECC, EAC e EJC)
* **Alvo:** Casais e Jovens Coordenadores de Movimentos
* **Texto:**
> *Paz de Cristo, lideranças do ECC, EAC e EJC da Catedral!*  
> *O portal da paróquia agora possui um espaço oficial para os nossos três grandes encontros (/movimentos/ecc, /movimentos/eac, /movimentos/ejc).*  
> *Pedimos que nos enviem: 3 Fotos de Momentos Marcantes (planos abertos de celebrações/missas) + Nome dos Coordenadores Atuais + Previsão de datas dos encontros de 2027.*  
> *Que o Sagrado Coração de Jesus continue abençoando nossas famílias e juventude! ✝️❤️*

---

### ⚙️ 4. Protocolo de Ação Quando os Arquivos Forem Recebidos

Quando você receber as fotos e dados da paróquia, basta me acionar com:
> *"Recebi as fotos das CEBs / os dados da secretaria, vamos inserir"*

O fluxo automatizado executará:
1. Conversão automática das fotos recebidas para `.webp` (`1200x675` `<= 85KB`).
2. Armazenamento em `public/images/comunidades/[slug].webp`.
3. Atualização das colunas `image_url` na tabela `public.communities` e `public.parish_movements`.
4. Atualização da chave PIX e WhatsApp em `lib/constants.ts` e nas telas públicas.
5. Execução do **Protocolo Deploy** para subir a versão final.
