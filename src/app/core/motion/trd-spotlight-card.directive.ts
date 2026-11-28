import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  inject,
} from '@angular/core';

/**
 * TrdSpotlightCardDirective
 *
 * Ilumina suavemente as bordas e o halo especular de `.arch-service-card`
 * usando CSS Custom Properties (`--mouse-x`, `--mouse-y`).
 * - Estritamente restrito a `@media (hover: hover) and (pointer: fine)`
 * - Zero `getBoundingClientRect` durante `pointermove` (origem cacheada apenas no `pointerenter`)
 * - Listener `pointermove` 100% `{ passive: true }` + `requestAnimationFrame`
 */
@Directive({
  selector: '[trdSpotlightCard]',
  standalone: true,
})
export class TrdSpotlightCardDirective implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private cleanupListeners: (() => void) | null = null;
  private mediaCleanup: (() => void) | null = null;
  private rafId = 0;
  private originPageX = 0;
  private originPageY = 0;
  private hasOrigin = false;

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
      this.originPageX = rect.left + win.scrollX;
      this.originPageY = rect.top + win.scrollY;
      this.hasOrigin = true;
    };

    const onMove = (event: PointerEvent) => {
      if (!this.hasOrigin || (event.pointerType && event.pointerType !== 'mouse')) return;
      const pageX = event.pageX;
      const pageY = event.pageY;

      if (this.rafId) return;
      this.rafId = win.requestAnimationFrame(() => {
        this.rafId = 0;
        const localX = Math.round(pageX - this.originPageX);
        const localY = Math.round(pageY - this.originPageY);
        node.style.setProperty('--mouse-x', `${localX}px`);
        node.style.setProperty('--mouse-y', `${localY}px`);
      });
    };

    const onLeave = () => {
      this.hasOrigin = false;
      if (this.rafId) {
        win.cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
      node.style.setProperty('--mouse-x', '-999px');
      node.style.setProperty('--mouse-y', '-999px');
    };

    node.addEventListener('pointerenter', onEnter, { passive: true });
    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave, { passive: true });

    this.cleanupListeners = () => {
      node.removeEventListener('pointerenter', onEnter);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
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
    this.hasOrigin = false;

    const node = this.el.nativeElement;
    node.style.removeProperty('--mouse-x');
    node.style.removeProperty('--mouse-y');
  }
}
