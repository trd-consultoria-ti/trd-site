# TRD Consultoria e Serviços de TI LTDA

Vitrine institucional oficial da **TRD Consultoria e Serviços de TI LTDA** ([trdconsultoria.com.br](https://trdconsultoria.com.br/)), construída em **Angular 19** e **Tailwind CSS** sob o padrão oficial **TRD Liquid Glass Design System** (benchmark canônico originado no repositório `financeiro-familia` e governado no repositório `startup`).

## Identidade Visual & Tokens Liquid Glass

- **Tema Padrão (Obsidian Navy Liquid Glass):**
  - Background primário: Obsidian Navy (`#0b0f19`)
  - Superfícies e cards (`.glass-panel` / `.glass-card`): Deep Slate translúcido (`rgba(17, 24, 39, 0.75)`) com `backdrop-filter: blur(18px) saturate(210%)`
  - Bordas sutis: Border Slate (`#1e293b` / `rgba(30, 41, 59, 0.8)`) com reflexo especular interno (`inset 0 1px 0 rgba(255, 255, 255, 0.14)`)
  - Acentos: Neural Cyan (`#06b6d4`) e hover/glow Electric Cyan (`#22d3ee`)
  - Alternância nativa para **Liquid Glass Claro** (`#f8fafc` / `#ffffff` / `#0891b2`) via botão na barra superior ou atalho `Alt + T` / `Ctrl + M` (persistido em `localStorage`)
- **Logotipo TRD:** Keystone Isométrica + wordmark em SVG vetorial com fundo **100% transparente** (proibidas caixas brancas) e contraste dinâmico (`#F8FAFC` / `#CBD5E1` sobre escuro; `#080D1A` / `#334155` sobre claro).
- **Tipografia Self-Hosted (Zero CDN / Zero Cookies):** `Inter` (leitura executiva) e `JetBrains Mono` (métricas numéricas `tabular-nums`, badges, SLAs e CNPJ).
- **Posicionamento Institucional:** 100% modelo Anti-SaaS (software sob medida com transferência integral de propriedade intelectual pela Lei 9.609/98, zero preços avulsos/fracionados e zero menção a custos de nuvem/hospedagem na vitrine pública).

## Arquitetura da Aplicação

- **Framework:** Angular 19 (`standalone`, Signals, `httpResource`, `@defer (on idle)`, `OnPush`)
- **Estilização:** Tailwind CSS 3.4 + tokens CSS semânticos (`src/styles.scss` e `tailwind.config.js`)
- **Dados Institucionais:** Servidos estaticamente em `/api/institutional.json` com 4 estados reais (Loading, Empty, Error e Success)
- **Roteamento:** Vitrine principal (`/`) e Política de Privacidade e Governança LGPD (`/privacidade`)
- **Publicação:** Vercel no domínio `trdconsultoria.com.br`

## Comandos de Desenvolvimento

```bash
npm ci
npx ng serve --port 4210
npx ng build --configuration production
```
