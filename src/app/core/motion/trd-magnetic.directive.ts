import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  inject,
  input,
} from '@angular/core';

/**
 * TrdMagneticDirective
 *
 * Deslocamento magnético sutil (4px a 6px) nos botões primários sob hover desktop,
 * com restauração elástica imediata no `pointerleave`.
 * - Blindado sob `@media (hover: hover) and (pointer: fine)`
 * - Zero `getBoundingClientRect` durante `pointermove` (centro cacheado apenas no `pointerenter`)
 * - 100% Composite-Only via variáveis `--mag-x` e `--mag-y` consumidas em `translate3d`
 */
@Directive({
  selector: '[trdMagnetic]',
  standalone: true,
})
export class TrdMagneticDirective implements AfterViewInit {
  readonly maxPull = input<number, number | string | ''>(5, {
    alias: 'trdMagnetic',
    transform: (val) => {
      if (typeof val === 'number') return val;
      if (val === '' || val === null || val === undefined) return 5;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 5 : parsed;
    },
  });

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private cleanupListeners: (() => void) | null = null;
  private mediaCleanup: (() => void) | null = null;
  private rafId = 0;
  private centerPageX = 0;
  private centerPageY = 0;
  private halfWidth = 1;
  private halfHeight = 1;
  private activeHover = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.teardownPointerListeners();
      this.mediaCleanup?.();
      this.mediaCleanup = null;
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const win = this.doc.defaultView;
    if (!win || typeof win.matchMedia !== 'function') return;

    const reducedMotionQuery = win.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = win.matchMedia('(hover: hover) and (pointer: fine)');

    const syncMode = () => {
      if (pointerQuery.matches && !reducedMotionQuery.matches) {
        this.attachPointerListeners(win);
      } else {
        this.teardownPointerListeners();
      }
    };

    syncMode();

    pointerQuery.addEventListener('change', syncMode);
    reducedMotionQuery.addEventListener('change', syncMode);
    this.mediaCleanup = () => {
      pointerQuery.removeEventListener('change', syncMode);
      reducedMotionQuery.removeEventListener('change', syncMode);
    };
  }

  private attachPointerListeners(win: Window): void {
    if (this.cleanupListeners) return;
    const node = this.el.nativeElement;

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const rect = node.getBoundingClientRect();
      this.halfWidth = Math.max(rect.width / 2, 1);
      this.halfHeight = Math.max(rect.height / 2, 1);
      this.centerPageX = rect.left + win.scrollX + this.halfWidth;
      this.centerPageY = rect.top + win.scrollY + this.halfHeight;
      this.activeHover = true;
    };

    const onMove = (event: PointerEvent) => {
      if (!this.activeHover || (event.pointerType && event.pointerType !== 'mouse')) return;
      const pageX = event.pageX;
      const pageY = event.pageY;

      if (this.rafId) return;
      this.rafId = win.requestAnimationFrame(() => {
        this.rafId = 0;
        const limit = this.maxPull() || 5;
        const normX = Math.max(-1, Math.min(1, (pageX - this.centerPageX) / this.halfWidth));
        const normY = Math.max(-1, Math.min(1, (pageY - this.centerPageY) / this.halfHeight));
        const pullX = (normX * limit).toFixed(2);
        const pullY = (normY * (limit * 0.85)).toFixed(2);

        node.style.setProperty('--mag-x', `${pullX}px`);
        node.style.setProperty('--mag-y', `${pullY}px`);
      });
    };

    const onLeave = () => {
      this.activeHover = false;
      if (this.rafId) {
        win.cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
      node.style.setProperty('--mag-x', '0px');
      node.style.setProperty('--mag-y', '0px');
    };

    node.addEventListener('pointerenter', onEnter, { passive: true });
    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave, { passive: true });
    node.addEventListener('pointercancel', onLeave, { passive: true });

    this.cleanupListeners = () => {
      node.removeEventListener('pointerenter', onEnter);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      node.removeEventListener('pointercancel', onLeave);
    };
  }

  private teardownPointerListeners(): void {
    const win = this.doc.defaultView;
    if (this.rafId && win) {
      win.cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    this.cleanupListeners?.();
    this.cleanupListeners = null;
    this.activeHover = false;

    const node = this.el.nativeElement;
    node.style.removeProperty('--mag-x');
    node.style.removeProperty('--mag-y');
  }
}
