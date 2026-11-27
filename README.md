# TRD Consultoria e Serviços de TI LTDA

Vitrine institucional oficial da **TRD Consultoria e Serviços de TI LTDA** ([trdconsultoria.com.br](https://trdconsultoria.com.br/)), construída em **Angular 19** e **Tailwind CSS** sob o padrão oficial **TRD Liquid Glass Design System** (benchmark canônico originado no repositório `financeiro-familia` e governado no repositório `startup`).

## Identidade Visual & Tokens Liquid Glass

- **Tema Padrão (Obsidian Navy Liquid Glass — Paridade Óptica com `financeiro-familia`):**
  - Background primário: Obsidian Navy (`#0b0f19`) com atmosfera cromática fixa (`trd-ambient-backdrop`) atrás de todo o scroll
  - Camada funcional e superfícies translúcidas (`.glass-navbar` flutuante em pílula, `.glass-panel`, `.glass-panel-strong`, `.glass-card`, `.glass-subcard`): Deep Slate translúcido (`rgba(17, 24, 39, 0.48)` / elevado `0.56` / navbar `rgba(11, 15, 25, 0.46)`) com `backdrop-filter: blur(18px–22px) saturate(210%)`, refração SVG live Blink + rim especular calibrado (`[trdLiquidGlass]` em `src/app/core/liquid-glass/`)
  - Bordas sutis: Border Slate (`#1e293b`) + contorno especular interno (`inset 0 1px 0 rgba(255, 255, 255, 0.22)`)
  - Acentos: Neural Cyan (`#06b6d4`) e hover/glow Electric Cyan (`#22d3ee`)
  - Alternância nativa para **Liquid Glass Claro** (`#f8fafc` / vidro translúcido `rgba(255, 255, 255, 0.42–0.54)` / `#0891b2`) via botão na barra superior ou atalho `Alt + T` / `Ctrl + M` (persistido em `localStorage`)
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
