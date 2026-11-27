import { ChangeDetectionStrategy, Component, input } from '@angular/core';

let nextLogoInstanceId = 0;

@Component({
  selector: 'trd-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'trd-logo-root',
  },
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 0.7rem;
        background: transparent !important;
        user-select: none;
      }

      .logo-mark {
        flex-shrink: 0;
        background: transparent !important;
        display: block;
      }

      .logo-wordmark {
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: transparent !important;
        line-height: 1.08;
      }

      .logo-brand {
        font-size: 1.15rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--trd-logo-primary);
        background: transparent !important;
      }

      .logo-sub {
        margin-top: 0.14rem;
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: var(--trd-logo-subtitle);
        background: transparent !important;
        white-space: nowrap;
      }

      @media (max-width: 430px) {
        :host {
          gap: 0.5rem;
        }
        .logo-brand {
          font-size: 1.05rem;
        }
        .logo-sub {
          font-size: 0.53rem;
          letter-spacing: 0.015em;
        }
      }

      @media (max-width: 374px) {
        .logo-sub {
          display: none;
        }
      }

      :host(.is-compact) .logo-sub {
        display: none;
      }
    `,
  ],
  template: `
    <svg
      class="logo-mark"
      [attr.width]="size()"
      [attr.height]="heightPx()"
      viewBox="0 0 200 231"
      role="img"
      aria-label="Símbolo oficial TRD Consultoria"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask [attr.id]="maskId">
          <polygon points="100,0 200,57.75 200,173.25 100,231 0,173.25 0,57.75" fill="#ffffff" />
          <path
            d="M100 115.5V0 M100 115.5L0 173.25 M100 115.5L200 173.25"
            stroke="#000000"
            stroke-width="13"
            fill="none"
          />
        </mask>
      </defs>
      <g [attr.mask]="'url(#' + maskId + ')'" fill="var(--trd-logo-primary)">
        <polygon points="100,115.5 0,173.25 0,57.75 100,0" />
        <polygon points="100,115.5 200,173.25 200,57.75 100,0" />
        <polygon points="100,115.5 0,173.25 100,231 200,173.25" />
      </g>
    </svg>
    <span class="logo-wordmark">
      <strong class="logo-brand">TRD</strong>
      @if (!compact()) {
        <span class="logo-sub">CONSULTORIA &amp; SERVIÇOS DE TI</span>
      }
    </span>
  `,
})
export class TrdLogoComponent {
  readonly compact = input<boolean>(false);
  readonly size = input<number>(34);
  readonly maskId = `trd-ks-mask-${++nextLogoInstanceId}`;

  heightPx(): number {
    return Math.round((this.size() * 231) / 200);
  }
}
