import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  Renderer2,
  inject,
  input,
} from '@angular/core';

/**
 * TrdPressMotionDirective
 *
 * Implementa a física tátil de Emil Kowalski / Apple Human Interface Guidelines:
 * - Resposta tátil imediata com escala calibrada (padrão 0.94)
 * - Respeita integralmente `prefers-reduced-motion: reduce` (SSR-safe)
 * - Preserva as transições declarativas do CSS (`@layer components`) sem sobrescrever `transition` inline
 * - GPU-accelerated com will-change dinâmico durante a interação e limpeza determinística
 */
@Directive({
  selector: '[trdPressMotion]',
  standalone: true,
  host: {
    '[class.is-pressed]': 'isPressed',
  },
})
export class TrdPressMotionDirective {
  readonly pressScale = input<number, number | string | ''>(0.94, {
    alias: 'trdPressMotion',
    transform: (val) => {
      if (typeof val === 'number') return val;
      if (val === '' || val === null || val === undefined) return 0.94;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0.94 : parsed;
    },
  });

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly doc = inject(DOCUMENT);

  isPressed = false;
  private willChangeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearTimer();
    });
  }

  private prefersReducedMotion(): boolean {
    if (!isPlatformBrowser(this.platformId)) return true;
    return this.doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0 || this.prefersReducedMotion()) return;

    this.clearTimer();
    const node = this.el.nativeElement;

    this.renderer.setStyle(node, 'will-change', 'transform');
    this.renderer.setStyle(
      node,
      'transform',
      `translate3d(var(--mag-x, 0px), var(--mag-y, 0px), 0) scale(${this.pressScale() || 0.94})`
    );
    this.isPressed = true;
  }

  @HostListener('pointerup')
  @HostListener('pointerleave')
  @HostListener('pointercancel')
  onPointerRelease(): void {
    if (!this.isPressed) return;
    this.isPressed = false;

    const node = this.el.nativeElement;
    this.renderer.setStyle(
      node,
      'transform',
      'translate3d(var(--mag-x, 0px), var(--mag-y, 0px), 0) scale(1)'
    );

    this.clearTimer();
    this.willChangeTimer = setTimeout(() => {
      this.renderer.removeStyle(node, 'transform');
      this.renderer.setStyle(node, 'will-change', 'auto');
      this.willChangeTimer = null;
    }, 200);
  }

  private clearTimer(): void {
    if (this.willChangeTimer !== null) {
      clearTimeout(this.willChangeTimer);
      this.willChangeTimer = null;
    }
  }
}
