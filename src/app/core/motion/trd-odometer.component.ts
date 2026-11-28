import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

interface OdometerToken {
  readonly index: number;
  readonly isDigit: boolean;
  readonly char: string;
  readonly ribbon: readonly number[];
  readonly delayMs: number;
}

/**
 * TrdOdometerComponent
 *
 * Fita vertical de dígitos em CSS Composite-Only (`transform: translate3d`)
 * sem mutação iterativa de `innerText` na Main Thread e com CLS = 0.0000:
 * - O estado de repouso (`translate3d(0, 0, 0)`) exibe o dígito final no índice 0,
 *   garantindo 100% de legibilidade imediata mesmo antes da animação ou sob fast fling scroll.
 * - `animation-fill-mode: backwards` libera 100% das camadas de textura da VRAM após o giro.
 */
@Component({
  selector: 'trd-odometer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'trd-odometer',
    '[attr.aria-label]': 'value()',
  },
  template: `
    <span class="sr-only">{{ value() }}</span>
    <span class="odometer-visual" [class.is-rolling]="isRolling()" aria-hidden="true">
      @for (token of tokens(); track token.index) {
        @if (token.isDigit) {
          <span class="odometer-digit">
            <span
              class="odometer-ribbon"
              [style.--odometer-delay]="token.delayMs + 'ms'"
            >
              @for (num of token.ribbon; track $index) {
                <span class="odometer-cell">{{ num }}</span>
              }
            </span>
          </span>
        } @else {
          <span class="odometer-static">{{ token.char }}</span>
        }
      }
    </span>
  `,
})
export class TrdOdometerComponent implements AfterViewInit {
  readonly value = input.required<string>();
  readonly eager = input<boolean>(false);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly isRolling = signal<boolean>(false);
  private observer: IntersectionObserver | null = null;

  readonly tokens = computed<OdometerToken[]>(() => {
    const raw = this.value() ?? '';
    const chars = Array.from(raw);
    let digitOrder = 0;

    return chars.map((ch, index) => {
      const code = ch.charCodeAt(0);
      if (code >= 48 && code <= 57) {
        const d = code - 48;
        const delayMs = digitOrder * 55;
        digitOrder++;
        // Índice 0 é o dígito final (repouso em 0%), índices 4 -> 0 simulam rolagem crescente (-80% -> 0%)
        const ribbon = [
          d,
          (d + 9) % 10,
          (d + 8) % 10,
          (d + 7) % 10,
          (d + 6) % 10,
        ] as const;

        return {
          index,
          isDigit: true,
          char: ch,
          ribbon,
          delayMs,
        };
      }

      return {
        index,
        isDigit: false,
        char: ch,
        ribbon: [],
        delayMs: 0,
      };
    });
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      this.observer = null;
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.eager() || typeof IntersectionObserver === 'undefined') {
      this.isRolling.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.isRolling.set(true);
            this.observer?.disconnect();
            this.observer = null;
            break;
          }
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -12px 0px',
        threshold: 0.15,
      }
    );

    this.observer.observe(this.el.nativeElement);
  }
}
