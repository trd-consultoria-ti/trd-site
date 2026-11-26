# TRD Consultoria e Serviços de TI LTDA

Vitrine institucional oficial da **TRD Consultoria e Serviços de TI LTDA** (`trdconsultoria.com.br`), construída em **Angular 19** e **Tailwind CSS** sob diretrizes visuais **iOS Liquid Glass** e acessibilidade WCAG AA/AAA.

## Arquitetura da Aplicação

- **Framework:** Angular 19 (Standalone Components, Signals, `httpResource`, `@defer (on idle)`, `OnPush`)
- **Estilização:** Tailwind CSS + tokens semânticos Liquid Glass (Light Mode e Dark Mode com atalho `Alt+T` e persistência em `localStorage`)
- **Dados Institucionais:** Servidos estaticamente em `/api/institutional.json` com estados completos de carregamento, busca vazia, falha de rede e sucesso
- **Roteamento:** Vitrine principal (`/`) e Política de Privacidade e Governança LGPD (`/privacidade`)
- **Publicação:** GitHub Pages via `.github/workflows/pages.yml` com fallback SPA (`404.html`), `.nojekyll` e domínio customizado (`public/CNAME`)
- **PWA:** Manifest e service worker registrados para instalação em dispositivos móveis

## Comandos de Desenvolvimento

```bash
npm ci
npx ng serve --port 4210
npx ng build --configuration production
```

## PWA & Instalação

O aplicativo suporta instalação como Progressive Web App em dispositivos compatíveis. O manifest está em `src/app/app.config.ts` e o service worker é registrado na raíz do aplicativo.

## Licença

Distribuído sob a licença **MIT**. Veja [`LICENSE`](LICENSE) para mais detalhes.