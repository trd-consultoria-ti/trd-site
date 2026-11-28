import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme.service';
import { FooterComponent } from './shared/footer.component';
import { NavbarComponent } from './shared/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main">Pular para o conteúdo principal</a>
    <div class="trd-ambient-backdrop" aria-hidden="true"></div>
    <div class="relative z-[1] flex min-h-[100dvh] w-full flex-col">
      <app-navbar />
      <main id="main" class="flex flex-1 flex-col min-h-[100dvh] w-full">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);

  @HostListener('window:keydown', ['$event'])
  handleGlobalShortcut(event: KeyboardEvent): void {
    const isAltT = event.altKey && (event.key === 't' || event.key === 'T');
    const isCtrlM = event.ctrlKey && (event.key === 'm' || event.key === 'M');
    if (isAltT || isCtrlM) {
      event.preventDefault();
      this.themeService.toggleTheme();
    }
  }
}
