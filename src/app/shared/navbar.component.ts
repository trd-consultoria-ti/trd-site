import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TrdLiquidGlassDirective } from '../core/liquid-glass';
import { ThemeService } from '../core/theme.service';
import { TrdLogoComponent } from './trd-logo.component';

interface NavAnchor {
  label: string;
  fragment: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TrdLogoComponent, TrdLiquidGlassDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sticky top-0 z-50 block w-full',
  },
  template: `
    <div class="w-full px-3 pt-3 sm:px-6">
      <header trdLiquidGlass="chrome" class="glass-navbar mx-auto max-w-[1240px] rounded-full">
        <div class="flex items-center justify-between gap-2 px-4 py-2 sm:gap-4 sm:px-6">
        <a
          routerLink="/"
          (click)="handleHomeClick($event)"
          class="inline-flex min-h-[44px] min-w-0 items-center rounded-2xl pr-1 focus-visible:outline-2"
          style="background: transparent;"
          aria-label="TRD Consultoria, voltar ao início"
        >
          <trd-logo [size]="31" />
        </a>

        <nav class="hidden items-center gap-1 lg:flex" aria-label="Navegação institucional">
          @for (item of navItems; track item.fragment) {
            <a
              [href]="'/#' + item.fragment"
              (click)="navigateToSection($event, item.fragment)"
              class="inline-flex min-h-[44px] items-center rounded-full px-3.5 text-[0.925rem] font-medium text-secondary transition-colors hover:bg-black/[0.04] hover:text-ink dark:hover:bg-white/[0.07]"
            >
              {{ item.label }}
            </a>
          }
        </nav>

        <div class="flex items-center gap-2.5">
          <button
            type="button"
            (click)="themeService.toggleTheme()"
            class="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-ink transition-transform hover:-translate-y-0.5 active:scale-95"
            [attr.aria-label]="
              themeService.isDark() ? 'Alternar para modo claro' : 'Alternar para modo escuro'
            "
            [attr.title]="
              themeService.isDark()
                ? 'Alternar para Liquid Glass Claro (Atalho: Alt + T ou Ctrl + M)'
                : 'Alternar para Liquid Glass Escuro (Atalho: Alt + T ou Ctrl + M)'
            "
          >
            @if (themeService.isDark()) {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4.5"></circle>
                <path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"></path>
              </svg>
            } @else {
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path>
              </svg>
            }
          </button>

          <a
            href="/#arquitetura"
            (click)="navigateToSection($event, 'arquitetura')"
            class="btn-primary-pill hidden sm:inline-flex"
          >
            Agendar diagnóstico
          </a>

          <button
            type="button"
            (click)="toggleMobileMenu()"
            class="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-ink lg:hidden"
            [attr.aria-expanded]="mobileOpen()"
            aria-controls="mobile-glass-drawer"
            [attr.aria-label]="mobileOpen() ? 'Fechar menu de navegação' : 'Abrir menu de navegação'"
          >
            @if (mobileOpen()) {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            } @else {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16"></path>
              </svg>
            }
          </button>
        </div>
        </div>
      </header>

      @if (mobileOpen()) {
        <div
          id="mobile-glass-drawer"
          class="glass-panel-strong mx-auto mt-2.5 max-w-[1240px] px-5 pb-6 pt-4 lg:hidden"
          role="region"
          aria-label="Menu móvel institucional"
        >
          <nav class="flex flex-col gap-2.5">
            @for (item of navItems; track item.fragment) {
              <a
                [href]="'/#' + item.fragment"
                (click)="navigateToSection($event, item.fragment)"
                class="glass-subcard flex min-h-[46px] items-center justify-between px-4 text-base font-medium text-ink"
              >
                <span>{{ item.label }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M9 18l6-6-6-6"></path>
                </svg>
              </a>
            }
            <a
              href="/#arquitetura"
              (click)="navigateToSection($event, 'arquitetura')"
              class="btn-primary-pill mt-2 w-full"
            >
              Agendar diagnóstico
            </a>
          </nav>
        </div>
      }
    </div>
  `,
})
export class NavbarComponent {
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  readonly mobileOpen = signal(false);

  readonly navItems: NavAnchor[] = [
    { label: 'Benefícios', fragment: 'beneficios' },
    { label: 'Como funciona', fragment: 'como-funciona' },
    { label: 'Experiência', fragment: 'experiencia' },
    { label: 'Arquitetura', fragment: 'arquitetura' },
    { label: 'Contato', fragment: 'contato' },
  ];

  toggleMobileMenu(): void {
    this.mobileOpen.update((open) => !open);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.mobileOpen()) {
      this.mobileOpen.set(false);
    }
  }

  handleHomeClick(event: MouseEvent): void {
    this.mobileOpen.set(false);
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      event.preventDefault();
      this.doc.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  navigateToSection(event: MouseEvent, fragment: string): void {
    event.preventDefault();
    this.mobileOpen.set(false);

    const scrollTarget = () => {
      const el = this.doc.getElementById(fragment);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      scrollTarget();
    } else {
      void this.router.navigate(['/'], { fragment }).then(() => {
        setTimeout(scrollTarget, 80);
      });
    }
  }
}
