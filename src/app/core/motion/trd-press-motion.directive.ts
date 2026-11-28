import {
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
} from '@angular/core';

/**
 * TrdPressMotionDirective
 * 
 * Implementa a física tátil de Emil Kowalski / Apple Human Interface Guidelines:
 * - Resposta tátil imediata com escala calibrada (padrão 0.94 para toque claramente perceptível no mobile)
 * - Transição com curva elástica cúbica Apple: cubic-bezier(0.16, 1, 0.3, 1)
 * - GPU-accelerated com will-change dinâmico durante a interação
 * - Blindagem contra rajadas de toque (clearTimeout) e memory leak guard (DestroyRef)
 * - Erradicação total de reflow (apenas transform e opacity)
 */
@Directive({
  selector: '[trdPressMotion]',
  standalone: true,
  host: {
    '[class.is-pressed]': 'isPressed',
  },
})
export class TrdPressMotionDirective {
  /**
   * Fator de escala durante o toque (padrão 0.94). Suporta uso como atributo vazio ou valor numérico.
   */
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

  isPressed = false;
  private willChangeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearTimer();
    });
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    // Apenas responde ao botão primário (toque ou clique esquerdo)
    if (event.button !== 0) return;

    this.clearTimer();
    const node = this.el.nativeElement;
    
    // Ativa GPU will-change somente na iminência do movimento (composite-only e compatível com magnetic hover)
    this.renderer.setStyle(node, 'will-change', 'transform');
    this.renderer.setStyle(
      node,
      'transform',
      `translate3d(var(--mag-x, 0px), var(--mag-y, 0px), 0) scale(${this.pressScale() || 0.94})`
    );
    this.renderer.setStyle(
      node,
      'transition',
      'transform 100ms cubic-bezier(0.16, 1, 0.3, 1)'
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
    this.renderer.setStyle(
      node,
      'transition',
      'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)'
    );

    this.clearTimer();
    // Libera estilos inline e memória de GPU após amortecimento para preservar hover/magnetic
    this.willChangeTimer = setTimeout(() => {
      this.renderer.removeStyle(node, 'transform');
      this.renderer.removeStyle(node, 'transition');
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
