import { AfterViewInit, DestroyRef, Directive, ElementRef, effect, inject, input } from '@angular/core';
import {
  LiquidGlassEngineService,
  type LiquidGlassSurfaceKind,
} from './liquid-glass-engine.service';

@Directive({
  selector: '[trdLiquidGlass]',
  standalone: true,
  host: {
    class: 'lg-surface',
    '[attr.data-lg-kind]': 'kind()',
  },
})
export class TrdLiquidGlassDirective implements AfterViewInit {
  readonly kind = input<LiquidGlassSurfaceKind>('chrome', { alias: 'trdLiquidGlass' });

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly engine = inject(LiquidGlassEngineService);
  private readonly destroyRef = inject(DestroyRef);

  private unregister: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      const currentKind = this.kind();
      if (this.unregister) {
        this.unregister();
        this.unregister = this.engine.registerSurface(this.el.nativeElement, currentKind);
      }
    });
  }

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    this.unregister = this.engine.registerSurface(node, this.kind());

    if (typeof ResizeObserver !== 'undefined') {
      let raf = 0;
      this.resizeObserver = new ResizeObserver(() => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          raf = 0;
          this.engine.refitSurface(node);
        });
      });
      this.resizeObserver.observe(node);
      this.destroyRef.onDestroy(() => {
        if (raf) cancelAnimationFrame(raf);
        this.resizeObserver?.disconnect();
      });
    }

    this.destroyRef.onDestroy(() => {
      this.unregister?.();
      this.unregister = null;
    });
  }
}
