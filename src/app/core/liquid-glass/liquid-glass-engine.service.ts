import { DestroyRef, Injectable, computed, signal } from '@angular/core';
import {
  fitBlinkBackdropFilter,
  GLASS_BEZEL_OPTIONS,
  isWebKitEngine,
  paintCalibratedRim,
  supportsBlinkBackdropSvg,
} from './liquid-glass-optics';

export type LiquidGlassSurfaceKind = 'chrome' | 'overlay' | 'card';

interface RegisteredSurface {
  id: number;
  kind: LiquidGlassSurfaceKind;
  priority: number;
  element: HTMLElement;
}

const MAX_ACTIVE_BLINK_FILTERS = 3;

const SURFACE_PRIORITY: Record<LiquidGlassSurfaceKind, number> = {
  chrome: 3,
  overlay: 2,
  card: 1,
};

@Injectable({ providedIn: 'root' })
export class LiquidGlassEngineService {
  private readonly _reducedTransparency = signal<boolean>(
    this.readMedia('(prefers-reduced-transparency: reduce)')
  );
  private readonly _moreContrast = signal<boolean>(this.readMedia('(prefers-contrast: more)'));
  private readonly _themeTick = signal<number>(0);

  readonly isOpaqueAccessibilityMode = computed(
    () => this._reducedTransparency() || this._moreContrast()
  );
  readonly isBlinkSupported = supportsBlinkBackdropSvg();
  readonly isWebKit = isWebKitEngine();

  private readonly surfaces = new Map<number, RegisteredSurface>();
  private nextId = 0;

  constructor(destroyRef: DestroyRef) {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const watchMedia = (query: string, setter: (v: boolean) => void) => {
        if (typeof window.matchMedia !== 'function') return;
        const mq = window.matchMedia(query);
        const listener = (ev: MediaQueryListEvent) => {
          setter(ev.matches);
          this.syncAllSurfaces();
        };
        mq.addEventListener?.('change', listener);
        destroyRef.onDestroy(() => mq.removeEventListener?.('change', listener));
      };

      watchMedia('(prefers-reduced-transparency: reduce)', (v) =>
        this._reducedTransparency.set(v)
      );
      watchMedia('(prefers-contrast: more)', (v) => this._moreContrast.set(v));

      const themeObserver = new MutationObserver(() => {
        this._themeTick.update((n) => n + 1);
        this.syncAllSurfaces();
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'class'],
      });
      destroyRef.onDestroy(() => themeObserver.disconnect());
    }
  }

  registerSurface(element: HTMLElement, kind: LiquidGlassSurfaceKind): () => void {
    const id = ++this.nextId;
    this.surfaces.set(id, {
      id,
      kind,
      priority: SURFACE_PRIORITY[kind],
      element,
    });
    this.syncAllSurfaces();

    return () => {
      this.surfaces.delete(id);
      this.cleanupElement(element);
      this.syncAllSurfaces();
    };
  }

  refitSurface(element: HTMLElement): void {
    for (const entry of this.surfaces.values()) {
      if (entry.element === element) {
        this.syncAllSurfaces();
        break;
      }
    }
  }

  private syncAllSurfaces(): void {
    const ranked = Array.from(this.surfaces.values())
      .filter((s) => s.kind !== 'card' && this.isVisible(s.element))
      .sort((a, b) => b.priority - a.priority || a.id - b.id);

    const blinkAllowed = new Set<number>();
    for (let i = 0; i < Math.min(MAX_ACTIVE_BLINK_FILTERS, ranked.length); i++) {
      blinkAllowed.add(ranked[i].id);
    }

    for (const entry of this.surfaces.values()) {
      this.applySurfaceState(entry, blinkAllowed.has(entry.id));
    }
  }

  private applySurfaceState(entry: RegisteredSurface, allowBlinkRefraction: boolean): void {
    const { element } = entry;
    void this._themeTick();

    if (!this.isVisible(element)) {
      element.setAttribute('data-lg-engine', 'hidden');
      element.removeAttribute('data-lg-rim');
      element.style.removeProperty('--lg-filter');
      element.style.removeProperty('--lg-rim');
      return;
    }

    if (this.isOpaqueAccessibilityMode()) {
      element.setAttribute('data-lg-engine', 'reduced');
      element.removeAttribute('data-lg-rim');
      element.style.removeProperty('--lg-filter');
      element.style.removeProperty('--lg-rim');
      return;
    }

    paintCalibratedRim(element);

    if (this.isBlinkSupported && allowBlinkRefraction) {
      element.setAttribute('data-lg-engine', 'blink');
      fitBlinkBackdropFilter(element, GLASS_BEZEL_OPTIONS);
      return;
    }

    element.setAttribute('data-lg-engine', 'layer0');
    element.style.removeProperty('--lg-filter');
  }

  private cleanupElement(element: HTMLElement): void {
    element.removeAttribute('data-lg-engine');
    element.removeAttribute('data-lg-rim');
    element.style.removeProperty('--lg-filter');
    element.style.removeProperty('--lg-rim');
  }

  private isVisible(el: HTMLElement): boolean {
    if (!el.isConnected) return false;
    if (el.offsetWidth <= 0 || el.offsetHeight <= 0) return false;
    if (typeof getComputedStyle === 'function' && getComputedStyle(el).visibility === 'hidden') {
      return false;
    }
    return true;
  }

  private readMedia(query: string): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(query).matches;
  }
}
