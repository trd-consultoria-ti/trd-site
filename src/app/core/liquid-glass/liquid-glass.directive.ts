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
  private resizeRaf = 0;
  private mobileMq: MediaQueryList | null = null;
  private initialized = false;

  constructor() {
    effect(() => {
      const currentKind = this.kind();
      if (this.initialized) {
        this.connectSurface(currentKind);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.disconnectSurface();
    });
  }

  ngAfterViewInit(): void {
    this.initialized = true;

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      this.mobileMq = window.matchMedia('(max-width: 767px)');
      const onMediaChange = () => {
        this.connectSurface(this.kind());
      };
      this.mobileMq.addEventListener?.('change', onMediaChange);
      this.destroyRef.onDestroy(() => {
        this.mobileMq?.removeEventListener?.('change', onMediaChange);
        this.mobileMq = null;
      });
    }

    this.connectSurface(this.kind());
  }

  private connectSurface(kind: LiquidGlassSurfaceKind): void {
    this.disconnectSurface();

    if (this.isMobileDisabledKind(kind)) {
      this.el.nativeElement.setAttribute('data-lg-engine', 'layer0');
      return;
    }

    const node = this.el.nativeElement;
    this.unregister = this.engine.registerSurface(node, kind);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
        this.resizeRaf = requestAnimationFrame(() => {
          this.resizeRaf = 0;
          this.engine.refitSurface(node);
        });
      });
      this.resizeObserver.observe(node);
    }
  }

  private disconnectSurface(): void {
    if (this.resizeRaf) {
      cancelAnimationFrame(this.resizeRaf);
      this.resizeRaf = 0;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.unregister) {
      this.unregister();
      this.unregister = null;
    }
  }

  private isMobileDisabledKind(kind: LiquidGlassSurfaceKind): boolean {
    if (kind !== 'card' && kind !== 'overlay') return false;
    if (this.mobileMq) return this.mobileMq.matches;
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }
}
