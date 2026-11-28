import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TrdLogoComponent } from './trd-logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TrdLogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer
      class="glass-footer mt-20"
      style="padding-bottom: env(safe-area-inset-bottom, 0px);"
    >
      <div class="mx-auto max-w-[1240px] px-5 py-14 sm:px-8">
        <div class="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div class="md:col-span-5">
            <a
              routerLink="/"
              class="inline-flex min-h-[44px] items-center"
              style="background: transparent;"
              aria-label="TRD Consultoria, início"
            >
              <trd-logo [size]="34" />
            </a>
            <p class="mt-4 max-w-md text-[0.95rem] leading-relaxed text-secondary">
              Engenharia de sistemas corporativos sob medida com transferência integral de propriedade intelectual e sustentação de aplicações críticas com acordo de nível de serviço em contrato.
            </p>
            <div class="mt-5 flex flex-wrap gap-2.5">
              <span class="glass-chip inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-ink">
                <span class="h-2 w-2 rounded-full bg-[var(--status-emerald)]" aria-hidden="true"></span>
                Brasília, Distrito Federal
              </span>
              <span class="glass-chip inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-ink">
                CNPJ&nbsp;<span class="metric-mono">43.065.207/0001-57</span>
              </span>
            </div>
          </div>

          <div class="md:col-span-3">
            <h3 class="text-base font-semibold text-ink">Navegação</h3>
            <ul class="mt-3 flex flex-col gap-1.5">
              <li>
                <a
                  href="/#beneficios"
                  (click)="goToFragment($event, 'beneficios')"
                  class="inline-flex min-h-[44px] items-center text-[0.925rem] text-secondary transition-colors hover:text-ink"
                >
                  Benefícios estratégicos
                </a>
              </li>
              <li>
                <a
                  href="/#experiencia"
                  (click)="goToFragment($event, 'experiencia')"
                  class="inline-flex min-h-[44px] items-center text-[0.925rem] text-secondary transition-colors hover:text-ink"
                >
                  Experiência e casos reais
                </a>
              </li>
              <li>
                <a
                  href="/#como-funciona"
                  (click)="goToFragment($event, 'como-funciona')"
                  class="inline-flex min-h-[44px] items-center text-[0.925rem] text-secondary transition-colors hover:text-ink"
                >
                  Método em quatro etapas
                </a>
              </li>
              <li>
                <a
                  href="/#arquitetura"
                  (click)="goToFragment($event, 'arquitetura')"
                  class="inline-flex min-h-[44px] items-center text-[0.925rem] text-secondary transition-colors hover:text-ink"
                >
                  Simulador de arquitetura
                </a>
              </li>
              <li>
                <a
                  routerLink="/privacidade"
                  class="inline-flex min-h-[44px] items-center text-[0.925rem] text-secondary transition-colors hover:text-ink"
                >
                  Privacidade e governança LGPD
                </a>
              </li>
            </ul>
          </div>

          <div class="md:col-span-4">
            <h3 class="text-base font-semibold text-ink">Atendimento executivo</h3>
            <dl class="mt-3 space-y-3 text-[0.925rem]">
              <div>
                <dt class="text-xs font-medium text-muted">Razão social</dt>
                <dd class="mt-0.5 font-medium text-ink">
                  THIAGO ROCHA DUARTE - CONSULTORIA E SERVICOS DE TI LTDA
                </dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted">WhatsApp corporativo</dt>
                <dd class="mt-0.5">
                  <a
                    href="https://wa.me/5561999526374?text=Ol%C3%A1%20Thiago%2C%20vim%20pelo%20site%20institucional%20da%20TRD%20Consultoria%20e%20gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20t%C3%A9cnico."
                    target="_blank"
                    rel="noopener"
                    class="inline-flex min-h-[44px] items-center font-semibold text-[var(--accent-cyan)] hover:underline"
                  >
                    <span class="metric-mono">(61) 99952-6374</span>
                  </a>
                </dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted">E-mail institucional</dt>
                <dd class="mt-0.5">
                  <a
                    href="mailto:contato@trdconsultoria.com.br"
                    class="inline-flex min-h-[44px] items-center font-semibold text-[var(--accent-cyan)] hover:underline"
                  >
                    contato&#64;trdconsultoria.com.br
                  </a>
                </dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted">Janela de atendimento</dt>
                <dd class="mt-0.5 text-secondary">Segunda a sexta, das 08h às 19h (horário de Brasília)</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[var(--glass-outline)] pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>&copy; 2026 TRD Consultoria e Serviços de TI LTDA. Todos os direitos reservados.</p>
          <div class="flex flex-wrap items-center gap-5">
            <a routerLink="/privacidade" class="inline-flex min-h-[44px] items-center font-medium text-secondary hover:text-ink">
              Política de Privacidade
            </a>
            <span class="inline-flex items-center gap-2 text-secondary">
              <span class="status-beacon-green shrink-0" aria-hidden="true"></span>
              Disponibilidade assistida <span class="metric-mono font-semibold text-ink">99.9% Uptime</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  goToFragment(event: MouseEvent, fragment: string): void {
    event.preventDefault();
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
