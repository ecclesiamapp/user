# 🎨 Especificação Técnica & Funcional: Hub de Marca, Leitor de Manual & Moodboard Inteligente

> **Módulo:** Hub de Identidade Visual, Leitor de Manual de Marca com IA e Moodboard Dinâmico  
> **Classificação:** Painel Administrativo (`/admin/marca`) com Live Theming no Portal Público  
> **Status:** Escopo Consolidado e Aprovado via Entrevista Estruturada (/grill-me)  
> **Plataforma:** Ecclesiam App & Catedral de Colatina (Multi-Tenant White-Label)  
> **Data:** Outubro de 2026  

---

## 🎯 1. Visão Geral & Problema de Negócio

No ecossistema de paróquias, santuários e catedrais, existem dois cenários de maturidade de comunicação visual:

1. **Paróquias com Manual de Marca Completo (Ex: Catedral de Colatina):**  
   Possuem livro de marca desenvolvido por agências ou designers, contendo paletas CMYK/RGB/Hex, famílias tipográficas, brasão em alta resolução e regras de aplicação. Hoje, esses manuais ficam esquecidos em pastas de computadores da secretaria ou no Google Drive, sem aplicação automatizada no portal.
2. **Paróquias sem Manual de Marca:**  
   Não possuem manual formal. Precisam de **presets canônicos pré-definidos** inspirados na tradição da Igreja Católica e facilidade para ajustar cores e enviar o brasão da paróquia de forma guiada, sem complicação técnica.

O **Hub de Marca (/admin/marca)** unifica as antigas telas de *Aparência* e *Configurações Visuais* em um centro avançado de gestão de design, permitindo **upload e extração via IA de manuais em PDF**, montagem de **Moodboard Interativo**, seleção de **Presets Oficiais do Ecclesiam App** e **Live Theming instantâneo** do portal público do fiel via variáveis CSS.

---

## 🧭 2. Fluxo de Experiência do Usuário (Arquitetura de Navegação)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PAINEL /admin/marca                                   │
├────────────────────────────────────────┬────────────────────────────────────────┤
│  CENÁRIO A: COM MANUAL DE MARCA        │  CENÁRIO B: SEM MANUAL (PRESETS)       │
│  [ Upload do Manual (PDF/Imagens) ]    │  [ Biblioteca de 5 Presets Canônicos ] │
│                   │                    │                   │                    │
│                   ▼                    │                   ▼                    │
│  [ Extração Multimodal via Gemini ]    │  [ Seleção com 1 Clique ]              │
│  - Cores hexadecimais                  │  - Aplica paleta pronta do Ecclesiam   │
│  - Famílias de fontes                  │  - Carrega fontes correspondentes      │
│  - Regras e slogan                     │                                        │
└───────────────────┬────────────────────┴───────────────────┬────────────────────┘
                    │                                        │
                    └───────────────────┬────────────────────┘
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      MOODBOARD PAROQUIAL INTERATIVO                             │
│                                                                                 │
│  1. Paleta de 6 Cores (com Color Picker nativo + Hexadecimal + Nome)           │
│  2. Galeria de Brasões (Oficial, Negativo/Monocromático, Ícone Favicon/PWA)     │
│  3. Seletor de Tipografias Google Fonts (Títulos solenes + Textos legíveis)     │
│  4. Mini-Mockup Interativo do Portal (Live Preview em tempo real)               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                  AÇÕES                                          │
│  [ 💾 Salvar & Publicar no Portal ]    [ 📄 Gerar Ficha da Marca (1 Folha) ]    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 3. Mecanismo de Ingestão e Leitura do Manual com IA

### 3.1. Upload do Arquivo
* **Formatos Suportados:** PDF (até 50 MB), PNG, JPEG ou SVG do manual de identidade ou folha de estilo (*styleguide*).
* **Armazenamento:** Salvo no bucket `brand_assets` no Supabase Storage sob a rota `{parish_id}/manuals/{filename}`.

### 3.2. Extração Multimodal via Google Gemini 2.5 Flash
Um endpoint dedicado (`POST /api/admin/brand/extract`) processa as páginas do manual:
1. Envia o buffer/imagem para o modelo multimodal do Gemini.
2. Extrai estruturadamente via JSON schema:
   * **Cores Primárias e Secundárias:** Códigos `#HEX` e nomes canônicos.
   * **Cor de Fundo / Superfície:** Detecção se o tema pede tom pergaminho suave ou branco puro.
   * **Tipografias Recomendadas:** Identificação de fontes serifadas ou sans-serif mencionadas no PDF.
   * **Conceito / Tagline:** Frase de posicionamento pastoral da comunidade.
3. Pré-preenche o Moodboard da tela em **Modo Rascunho**. O usuário vê todos os campos preenchidos e pode ajustar qualquer valor antes de salvar.

---

## 🎨 4. Estrutura do Moodboard Configurável

O Moodboard é dividido em 4 blocos visuais responsivos e configuráveis:

### 4.1. Bloco 1: Paleta Cromática Eclesial (6 Swatches)
Cada cor possui um seletor nativo (*Color Picker*), campo hexadecimal e rótulo de uso:
1. **Cor Primária Institucional:** Utilizada em barras de destaque, botões principais e cabeçalhos (ex: `#8B1E22` Vinho Catedral).
2. **Cor Secundária / Ouro Sacro:** Utilizada em badges, detalhes litúrgicos e ícones (ex: `#FFA82A` Dourado).
3. **Cor de Superfície / Card:** Fundo elevado dos cards e caixas de conteúdo (ex: `#FFFFFF` / `#1E1B18`).
4. **Cor de Fundo Base / Pergaminho:** Fundo geral da página (ex: `#FBF9F5` pergaminho suave, eliminando a frieza do branco estéril).
5. **Cor de Texto Principal:** Contraste elevado para legibilidade de idosos (ex: `#1A1D20`).
6. **Cor de Ação / PIX Dízimo:** Botão de doação espontânea e WhatsApp (ex: `#25D366` / `#FFA82A`).

### 4.2. Bloco 2: Brasão e Variações de Logotipo
Upload direto com recorte assistido (*easy-crop*):
* **Brasão Oficial:** Aplicação colorida principal da Catedral/Paróquia.
* **Versão Negativa / Monocromática:** Brasão em branco com transparência para fundos escuros e banners solenes.
* **Ícone PWA & Favicon:** Versão compacta quadrada (512x512) para tela de início de celulares.

### 4.3. Bloco 3: Tipografia Eclesial
Seletores integrados com Google Fonts:
* **Títulos & Brasão:** Seleção entre fontes romanas e solenes (`Cinzel`, `EB Garamond`, `Cormorant Garamond`, `Sora`, `Playfair Display`).
* **Corpo de Texto & Horários:** Seleção entre fontes limpas de alta legibilidade (`Plus Jakarta Sans`, `Inter`, `Roboto`, `Open Sans`).
* **Numerais Tabulares:** Garantia automática de algarismos alinhados para grades de horários de missas.

### 4.4. Bloco 4: Mini-Mockup Interativo do Portal (Live Preview)
* Um simulador dinâmico do smartphone e desktop ao lado do moodboard.
* À medida que o usuário altera um hexadecimal ou troca a fonte, o card de missas de hoje, o cabeçalho e os botões do mini-mockup mudam instantaneamente, permitindo validação visual imediata antes de publicar.

---

## 🏛️ 5. Biblioteca de Presets Nativos (Para Paróquias sem Manual)

Para comunidades que não possuem designer ou agência, o sistema entrega **5 Presets Canônicos Prontos** baseados no Design System do Ecclesiam App:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      TABELA DE PRESETS CANÔNICOS NATIVOS                        │
├────────────────────┬───────────┬───────────┬───────────┬────────────────────────┤
│ PRESET             │ PRIMÁRIA  │ OURO/SEC. │ FUNDO     │ TIPOGRAFIA (TÍTULO/TXT)│
├────────────────────┼───────────┼───────────┼───────────┼────────────────────────┤
│ 1. Catedral        │ #8B1E22   │ #FFA82A   │ #FBF9F5   │ Sora / Plus Jakarta    │
│    (Sagrado Coração)│ (Bordô)   │ (Ouro)    │ (Pergaminho│ Sans                   │
├────────────────────┼───────────┼───────────┼───────────┼────────────────────────┤
│ 2. Mariano         │ #1B365D   │ #C5A059   │ #F9F8F5   │ Cormorant Garamond /   │
│    (Nossa Senhora) │ (Azul Ult)│ (Dourado) │ (Marfim)  │ Inter                  │
├────────────────────┼───────────┼───────────┼───────────┼────────────────────────┤
│ 3. Franciscano     │ #214D37   │ #D8C3A5   │ #F7F8F5   │ EB Garamond /          │
│    (Esperança/CEBs)│ (Verde Nob)│ (Trigo)   │ (Linho)   │ Plus Jakarta Sans      │
├────────────────────┼───────────┼───────────┼───────────┼────────────────────────┤
│ 4. Solene / Rei    │ #721C24   │ #D4AF37   │ #FAFAF7   │ Cinzel /               │
│    (Mártires/Paixão│ (Rubi)    │ (Ouro Ant)│ (Sépia)   │ Inter                  │
├────────────────────┼───────────┼───────────┼───────────┼────────────────────────┤
│ 5. Basílica        │ #B8860B   │ #D4AF37   │ #FDFBF7   │ Cinzel /               │
│    (Páscoa/Natal)  │ (Ouro Imp)│ (Champagne│ (Alabastro)│ Plus Jakarta Sans      │
└────────────────────┴───────────┴───────────┴───────────┴────────────────────────┘
```

* **Comportamento:** Ao clicar em qualquer preset, todos os campos do moodboard são preenchidos na hora. O usuário pode salvar imediatamente ou customizar qualquer elemento pontual.

---

## ⚡ 6. Live Theming no Portal Público (Variáveis CSS Dinâmicas)

Ao salvar o Moodboard, os dados são salvos na tabela `public.parishes` no campo JSONB `brand_identity`:

```json
{
  "theme_preset": "catedral_sagrado_coracao",
  "colors": {
    "primary": "#8B1E22",
    "primary_hover": "#6E161A",
    "secondary": "#FFA82A",
    "background": "#FBF9F5",
    "surface": "#FFFFFF",
    "text_primary": "#1A1D20",
    "text_secondary": "#5A626A",
    "action_pix": "#FFA82A"
  },
  "fonts": {
    "heading": "Sora",
    "body": "Plus Jakarta Sans"
  },
  "logos": {
    "main_url": "https://.../brasao_catedral.png",
    "negative_url": "https://.../brasao_branco.png",
    "favicon_url": "https://.../favicon.png"
  },
  "manual_pdf_url": "https://.../manual_marca_catedral.pdf",
  "updated_at": "2026-10-21T23:20:00Z"
}
```

O componente de layout raiz (`app/layout.tsx`) injeta essas propriedades diretamente no elemento `<style>` do `:root`, garantindo que:
* Todos os botões, banners, cards de missas e menus do portal público adotem o esquema cromático da paróquia instantaneamente.
* A regra de **100% White-Label** seja cumprida: zero menção à marca Ecclesiam para o fiel.

---

## 📄 7. Ficha Resumo do Moodboard (Guia Rápido da Marca para a PASCOM)

Além da visualização em tela, o Hub de Marca oferece a ferramenta **"Exportar Guia Rápido de Aplicação (PDF / Impressão)"**:
* Rota dedicada: `/admin/marca/imprimir-guia`
* Formato otimizado em folha A4 vertical (preparado para `window.print()` e geração de PDF).
* Conteúdo da Ficha:
  * Cabeçalho solene com o Brasão e nome oficial da Paróquia e Diocese.
  * Amostras visuais das cores com códigos Hex, RGB e indicação de onde usar (ex: *"Uso em artes de redes sociais: Primária #8B1E22"*).
  * Nomes e exemplos das fontes para a equipe de transmissão e voluntários da PASCOM.
  * Regras básicas de proteção do brasão (área de não-invasão, fundos proibidos).
  * QR Code para download do Manual de Marca completo em PDF.

---

## 🗄️ 8. Modelagem de Dados no Supabase

### 8.1. Storage Bucket
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand_assets', 'brand_assets', true)
ON CONFLICT (id) DO NOTHING;
```

### 8.2. Colunas na Tabela Parishes
```sql
ALTER TABLE public.parishes
  ADD COLUMN IF NOT EXISTS brand_identity JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS brand_manual_url TEXT;
```

---

## 📅 9. Decomposição das Tarefas de Implementação

| Tarefa | Título | Estimativa | Entregas |
| :--- | :--- | :---: | :--- |
| **TASK-36** | Schema & Storage de Marca no Supabase | 30 min | Bucket `brand_assets`, colunas `brand_identity` e `brand_manual_url` na tabela `parishes` com RLS. |
| **TASK-37** | Endpoint de Extração Multimodal de Manual (Gemini) | 45 min | Rota `/api/admin/brand/extract` que lê PDF/imagens de manuais e extrai JSON de cores, fontes e regras. |
| **TASK-38** | Componentes do Moodboard & Simulador Live Preview | 60 min | Componentes modulares: `BrandColorPaletteEditor`, `BrandPresetsSelector`, `BrandLogoUploader`, `BrandLivePreviewMockup`. |
| **TASK-39** | Página Centralizada `/admin/marca` & Navegação | 45 min | Unificação das antigas telas de aparência, layout responsivo em abas, salvamento e atualização da sidebar. |
| **TASK-40** | Live Theming no Portal Público & Guia Imprimível | 45 min | Injeção dinâmica de CSS variables no `layout.tsx` e tela de impressão A4 `/admin/marca/imprimir-guia` para a PASCOM. |

---

## ✅ 10. Critérios de Aceite & Validação

1. **Upload & Extração Automática:** O envio do PDF do manual de marca da Catedral preenche automaticamente os valores do moodboard com precisão.
2. **Operação sem Manual:** Um usuário sem manual consegue escolher o preset *"Mariano"* ou *"Catedral"* com 1 clique e ajustar cores individuais via Color Picker.
3. **Live Theming:** Ao salvar as alterações, a Home do portal público reflete as novas cores imediatamente.
4. **White-Label:** A interface do fiel permanece 100% personalizada com a identidade da paróquia.
5. **Anti-Monólito & UX/UI:** Nenhum componente com mais de 300 linhas, Dark Mode nativo, e botões com alvos mínimos de 44px.
