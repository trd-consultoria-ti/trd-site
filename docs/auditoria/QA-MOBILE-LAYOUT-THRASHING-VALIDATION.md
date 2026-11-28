# Laudo de Validação — Saneamento de CPU/GPU e Eliminação de Layout Thrashing Mobile

**Repositório:** `E:\projetos\TRD CONSULTORIA E SERVICOES DE TI\trd-site`  
**Branch:** `feat/motion-emil-gsap`  
**Commit Auditado:** `cf317f8` (`perf(mobile): desativar motor optico Liquid Glass em cards e simplificar backdrop no mobile`)  
**Auditor:** QA Gate (`agent-3bd10b57-45eb-420a-b97f-fffb862a89d5`)  
**Data:** 2026-11-28  

---

## 1. Veredito

🟢 **APROVADO (PASS)** — A blindagem `window.innerWidth < 768` eliminou o loop síncrono de layout thrashing nos cards durante as animações GSAP de scroll reveal em viewport mobile.

---

## 2. Evidências de Código (Commit `cf317f8`)

1. **`TrdLiquidGlassDirective` (`src/app/core/liquid-glass/liquid-glass.directive.ts`):**
   - Método `isMobileCard(kind)` retorna `true` quando `typeof window !== 'undefined' && window.innerWidth < 768 && kind === 'card'`.
   - Em `ngAfterViewInit()`, o retorno antecipado impede tanto a chamada a `this.engine.registerSurface(node, currentKind)` quanto a criação e observação do `ResizeObserver` nos 6 elementos `trdLiquidGlass="card"` de `home.component.ts`.
   - Em `constructor()` (`effect()`), qualquer transição para `isMobileCard(currentKind)` desregistra a superfície ativa.

2. **`LiquidGlassEngineService` (`src/app/core/liquid-glass/liquid-glass-engine.service.ts`):**
   - `registerSurface()`: ao detectar `this.isMobileViewport() && kind === 'card'`, atribui `data-lg-engine="layer0"` e retorna no-op sem adicionar ao mapa `surfaces` nem chamar `syncAllSurfaces()`.
   - `applySurfaceState()`: possui guarda redundante para `entry.kind === 'card'` em viewport mobile, removendo `--lg-filter`, `--lg-rim` e `data-lg-rim` antes de `isVisible(element)` (evitando `offsetWidth`, `offsetHeight` e `getComputedStyle`), `paintCalibratedRim()` e `fitBlinkBackdropFilter()`.

3. **`src/styles.scss` (`@media (max-width: 767px)`):**
   - `--ambient-layer` reduzida de 4 gradientes radiais sobrepostos para 1 gradiente radial único (`radial-gradient(100vw 42vh at 50% 0%, ...)`), diminuindo o custo de rasterização/fillrate em GPU mobile.

---

## 3. Evidência de Build de Produção

Comando executado:
```powershell
npm --prefix "E:\projetos\TRD CONSULTORIA E SERVICOES DE TI\trd-site" run build
```
Resultado:
- **Exit Code:** `0`
- **Tempo:** `1.853 seconds`
- **Initial total:** `358.50 kB` (`99.45 kB` estimated transfer size)

---

## 4. Observações Não-Bloqueantes

- Superfícies `chrome` (navbar) e `overlay` (painel hero, simulador, CTA e drawer) permanecem com `ResizeObserver` ativo no mobile, porém não participam da animação GSAP de scroll reveal dos cards.
- A checagem `window.innerWidth < 768` ocorre na inicialização da diretiva (em dispositivos móveis reais o viewport já inicia `< 768px`).
