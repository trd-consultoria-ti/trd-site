# Laudo Pericial QA: Auditoria de Motion no trd-site (branch feat/motion-emil-gsap, commit a5d8a44)

## Contexto da Auditoria
Founder Thiago testou o site no celular e relatou imperceptibilidade das animações. Esta auditoria analisa o código entregue no commit `a5d8a44` na branch `feat/motion-emil-gsap` do repositório `trd-site`, validando a real cobertura dos efeitos Emil Kowalski/Apple HIG implementados.

## 1. Arquitetura de Motion Implementada

### 1.1 TrdPressMotionDirective (`src/app/core/motion/trd-press-motion.directive.ts`)
**Veredito:** ✅ **IMPLEMENTADO CORRETAMENTE**

- **Fator de escala:** `0.94` (padrão) - **PERCEPTÍVEL** em mobile high-DPI
  - *Anteriormente o problema era o valor 0.97, marginal e quase invisível em telas táctil*
  - `0.94` oferece contração de 6% que é claramente nota no feedback tátil de botões
- **Curva elástica:** `cubic-bezier(0.16, 1, 0.3, 1)` - **CONFORME** às Apple HIG
  - *Curva de "spring" responsável pelo efeito de "snap-back" característico*
- **GPU acceleration:** `will-change: transform, filter` com limpeza automática após 200ms
  - *Evita memory leaks e reflows desnecessários*
- **Gestão de eventos:** `pointerdown` → escala 0.94, `pointerup/leave/cancel` → escala 1.0
  - *Trata pointercancel para evitar actions fantasmas*
- **Memory leak guard:** `DestroyRef` cleanup, `clearTimeout` para willChange timer
  - *Libera will-change após amortecimento, evita stuck states*

### 1.2 Aplicação no Código
- **home.component.ts:** `trdPressMotion` em âncoras CTA (` Mapear meu sistema`, `Conhecer casos reais`), segmented control tabs, e botão LinkedIn
- **navbar.component.ts:** `trdPressMotion` em todos os links de navegação, botão de troca de tema, botão "Agendar diagnóstico"
- **styles.scss:** Classe `.emil-press` usa `scale(0.94)` consistente com a diretiva

## 2. Scroll Reveal - IntersectionObserver

### 2.1 home.component.ts - observePortfolioCards()
**Veredito:** ✅ **IMPLEMENTADO COM ALTERAÇÕES NECESSÁRIAS**

- **Observer:** `new IntersectionObserver` com `rootMargin: '0px 0px -40px 0px'`
  - *Margin negativo -40px dispara a animação quando o card está a 40px do viewport bottom*
  - *Melhoria: antecipa a revelação antes do card ficar totalmente visível*
- **threshold:** `0.12` (12% de visibilidade necessário para trigger)
  - *Valor conservador - evita animações acionadas por pequena porção do card*
- **Cards observados:** `.arch-service-card, .method-step-item, .portfolio-case-card`
  - *Cobertura: Arquitetura/Serviços, Etapas da Metodologia, Cards de Portfólio*

**Hallazgo Crítico - Valores de Scale:**
- No callback `entries.forEach`, a animação GSAP usa `scale: 0.97`:
  ```typescript
  gsap.fromTo(
    entry.target,
    { opacity: 0, y: 42, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform' }
  );
  ```
- **Recomendação:** Alterar `0.97` → `0.94` para consistência com o `TrdPressMotionDirective` e maior perceptibilidade no mobile

### 2.2 Conflito de Observers
- **CardObserver** principal: observa cards individuais via `observePortfolioCards()`
- **MutationObserver** no container `#experiencia`: re-observa cards assíncronos quando novos são inseridos dinamicamente
- **Veredito:** ✅ **SEM CONFLITOS DETECTADOS**
  - MutationObserver apenas chama `observePortfolioCards()` novamente
  - Cards já observados têm `data['motionObserved'] = 'true'` para evitar re-observation

## 3. animações GSAP em home.component.ts

### 3.1 Hero Enter (linhas ~340-348)
**Veredito:** ✅ **CORRETO**

```typescript
gsap.fromTo(
  '.hero-enter',
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', clearProps: 'transform' }
);
```
- Duration: 0.75s - adequado para carga inicial
- Ease: `power3.out` - saída suave, nada brusco
- Non-reduzido quando `prefers-reduced-motion` está ativo (retorna cedo)

### 3.2 SLA Métricas (linhas ~350-357)
**Veredito:** ✅ **CORRETO**

```typescript
gsap.fromTo(
  '.sla-metric-item',
  { opacity: 0, y: 28, scale: 0.95 },
  { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.14, delay: 0.15, ease: 'power3.out', clearProps: 'transform' }
);
```
- **Scale 0.95** - melhor que 0.97, perceptível sem ser agressivo
- Stagger 0.14s - entrada em cascata ordenada
- Delay 0.15s - pequena pausa antes do início

### 3.3 Scroll Reveal Individual Card (IntersectionObserver callback)
**Veredito:** ⚠️ **PRECISA DE ATUALIZAÇÃO** (ver item 2.1)

## 4. Responsividade Mobile & Acessibilidade

### 4.1 Reduce Motion
**Veredito:** ✅ **PROPERLY RESPEITADO**

```typescript
const prefersReduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) return;
```
- Early return quando reduced motion está ativado no SO
- O `@media (prefers-reduced-motion: reduce)` no styles.scss mata todas as animações CSS com `!important`
- **Total compliance** com preferência do usuário

### 4.2 Touch Targets
- ** >= 44px** em todos os botões com `trdPressMotion` (verificado no design system)
- `touch-action: manipulation` na diretiva - previne zoom acidental no mobile
- `-[webkit-]-tap-highlight-color: transparent` - elimina highlight azul após tap

### 4.3 Overflow Controle
- `overflow-x: clip` no `html` (styles.scss) - **ZERO** scroll horizontal em 375px
- `scroll-padding-top: 6rem` - considera a altura da navbar fixa

## 5. Conflitos CSS @keyframes vs GSAP

### 5.1 heroEnter Keyframes
**Veredito:** ✅ **CONFLITO ELIMINADO**

- O texto menciona: "Conflito CSS `@keyframes heroEnter` vs GSAP eliminado em `styles.scss`"
- Verificado: **NÃO HÁ** `@keyframes heroEnter` no styles.scss
- As animações hero-enter usam exclusivamente GSAP `fromTo()`, não CSS keyframes
- **Resultado:** Nenhum conflito de timeline ou override de propriedades

### 5.2 mobileDrawerEnter Keyframes
```scss
@keyframes mobileDrawerEnter {
  from { opacity: 0; transform: translateY(-12px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```
- **Escala 0.97** neste keyframe - **marginal, quase invisível** no mobile
- **Recomendação:** Alterar para `scale(0.94)` para consistência com o resto do motion system
- A animação usa `cubic-bezier(0.32, 0.72, 0, 1)` de 280ms - **conforme as specs do Founder**

## 6. Botões Ativos (btn-primary-pill, btn-glass-pill)

### 6.1 styles.scss Active States
```scss
.btn-primary-pill:active {
  transform: translateY(0) scale(0.97);
}

.btn-glass-pill:active {
  transform: translateY(0) scale(0.97);
}

.interactive-card:active {
  transform: translateY(0) scale(0.985);
}
```
- **btn-primary-pill:active** e **btn-glass-pill:active**: `scale(0.97)` - **marginal**
- **interactive-card:active**: `scale(0.985)` - **quase imperceptível** (apenas 1.5% de contração)
- **Todas essas escala devem ser 0.94** para consistência e perceptibilidade

## 7. Matriz de Conformidade e Recomendações

| # | Item | Status | Severidade | Ação Corretiva |
|---|------|--------|------------|----------------|
| 1 | TrdPressMotionDirective escala padrões | ✅ Conforme | — | Manter `0.94` |
| 2 | Scale 0.97 em IntersectionObserver callback | ⚠️ Necessita fix | Alta | Alterar `0.97` → `0.94` em home.component.ts |
| 3 | Scale 0.97 em btn-primary-pill:active | ⚠️ Necessita fix | Alta | Alterar `0.97` → `0.94` em styles.scss |
| 4 | Scale 0.97 em btn-glass-pill:active | ⚠️ Necessita fix | Alta | Alterar `0.97` → `0.94` em styles.scss |
| 5 | Scale 0.985 em interactive-card:active | ⚠️ Necessita fix | Média | Alterar `0.985` → `0.94` em styles.scss |
| 6 | mobileDrawerEnter keyframe scale | ⚠️ Necessita fix | Média | Alterar `0.97` → `0.94` em styles.scss |
| 7 | Reduced motion compliance | ✅ Conforme | — | Manter `prefers-reduced-motion` rules |
| 8 | IntersectionObserver config | ✅ Conforme | — | Manter threshold 0.12, rootMargin -40px |
| 9 | GSAP animações hero-enter/metrics | ✅ Conforme | — | Manter valores atuais |
| 10 | Observer conflicts | ✅ Conforme | — | ManterMutationObserver → observePortfolioCards() |

## 8. Veredito Final

**Status:** 🟡 **APROVADO COM ALTERAÇÕES** (Motion implementado, mas escala precisa de padronização)

**Causa da imperceptibilidade reportada pelo Founder:**
- Principal: valores de `scale: 0.97` dispersos pelo código (marginal em telas táctil high-DPI)
- Secundária: inconsistencia entre `TrdPressMotionDirective` (0.94) e CSS button states (0.97/0.985)
- Terciária: falta de padronização visual do fator de contração em estados ativos

**Recomendações Imediatas (stop-the-line para release):**
1. Alterar `scale: 0.97` → `scale: 0.94` em home.component.ts IntersectionObserver callback
2. Alterar `scale: 0.97` → `scale: 0.94` em styles.scss `.btn-primary-pill:active` e `.btn-glass-pill:active`
3. Alterar `scale: 0.985` → `scale: 0.94` em styles.scss `.interactive-card:active`
4. Alterar `scale: 0.97` → `scale: 0.94` em styles.scss `@keyframes mobileDrawerEnter`

**Após essas correções:** O motion do trd-site terá consistência total com fator `0.94` em todos os estados de interação ativa, tornando o feedback tátil claramente perceptível no mobile sem causar fadiga visual. O Founder Thiago deverá conseguir perceber claramente os movimentos refinados no celular.

**Próximos passos:** Aplicar as 4 correções de scale, validar no dispositivo mobile 375px, e emitir novo laudo de conformidade.