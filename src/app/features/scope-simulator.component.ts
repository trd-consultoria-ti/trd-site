import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScopeModuleOption } from '../core/institutional.models';

type OperationalContext = 'expansao' | 'regulado' | 'legado';

@Component({
  selector: 'app-scope-simulator',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-panel-strong p-6 sm:p-9">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <!-- Left column: Interactive Module & Context Builder -->
        <div class="lg:col-span-7">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-xl font-semibold text-ink sm:text-2xl">
              Selecione as frentes da sua operação
            </h3>
            <span class="glass-chip px-3.5 py-1.5 text-xs font-semibold text-ink">
              <span class="metric-mono">{{ selectedIds().length }}</span>
              {{ selectedIds().length === 1 ? 'frente selecionada' : 'frentes selecionadas' }}
            </span>
          </div>
          <p class="mt-2 text-[0.95rem] text-secondary">
            Combine os módulos necessários para visualizar a arquitetura recomendada, os ganhos operacionais diretos e gerar o briefing técnico estruturado.
          </p>

          <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Frentes operacionais do sistema">
            @for (mod of modules; track mod.id; let last = $last) {
              <button
                type="button"
                (click)="toggleModule(mod.id)"
                [attr.aria-pressed]="isSelected(mod.id)"
                [class.is-selected]="isSelected(mod.id)"
                [class.sm:col-span-2]="last"
                class="interactive-card glass-subcard flex min-h-[56px] w-full flex-col items-start p-4 text-left"
              >
                <div class="flex w-full items-start justify-between gap-3">
                  <div>
                    <span class="text-xs font-medium text-[var(--accent-cyan)]">{{ mod.domain }}</span>
                    <h4 class="mt-0.5 text-base font-semibold text-ink">{{ mod.title }}</h4>
                  </div>
                  <span
                    class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors"
                    [class.border-[var(--accent-cyan)]]="isSelected(mod.id)"
                    [class.bg-[var(--accent-cyan)]]="isSelected(mod.id)"
                    [class.text-[var(--accent-ink)]]="isSelected(mod.id)"
                    [class.border-[var(--glass-outline)]]="!isSelected(mod.id)"
                    aria-hidden="true"
                  >
                    @if (isSelected(mod.id)) {
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    }
                  </span>
                </div>
                <p class="mt-2 text-sm leading-relaxed text-secondary">{{ mod.summary }}</p>
              </button>
            }
          </div>

          <!-- Context Selector -->
          <div class="mt-6">
            <span class="block text-sm font-semibold text-ink">Cenário atual da empresa</span>
            <div class="segmented-track mt-2.5 w-full sm:w-auto" role="radiogroup" aria-label="Cenário atual da empresa">
              @for (ctx of contexts; track ctx.id) {
                <button
                  type="button"
                  role="radio"
                  [attr.aria-checked]="context() === ctx.id"
                  [class.is-active]="context() === ctx.id"
                  (click)="setContext(ctx.id)"
                  class="segmented-btn flex-1 sm:flex-initial"
                >
                  {{ ctx.label }}
                </button>
              }
            </div>
          </div>

          <!-- Optional Executive Identification -->
          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="sim-exec-name" class="block text-sm font-medium text-ink">
                Seu nome e cargo (opcional)
              </label>
              <input
                id="sim-exec-name"
                type="text"
                [ngModel]="contactName()"
                (ngModelChange)="onFieldEdit('name', $event)"
                placeholder="Ex.: Mariana Alves, Diretora de Operações"
                class="mt-1.5 min-h-[46px] w-full rounded-2xl border border-[var(--glass-outline)] bg-[var(--bg-surface)] px-4 text-sm text-ink placeholder:text-muted"
              />
            </div>
            <div>
              <label for="sim-company" class="block text-sm font-medium text-ink">
                Empresa ou instituição (opcional)
              </label>
              <input
                id="sim-company"
                type="text"
                [ngModel]="companyName()"
                (ngModelChange)="onFieldEdit('company', $event)"
                placeholder="Ex.: Grupo Horizonte Logística"
                class="mt-1.5 min-h-[46px] w-full rounded-2xl border border-[var(--glass-outline)] bg-[var(--bg-surface)] px-4 text-sm text-ink placeholder:text-muted"
              />
            </div>
          </div>
        </div>

        <!-- Right column: Recommended Architecture, Operational Gains & Dispatch -->
        <div class="flex flex-col justify-between rounded-[24px] border border-[var(--glass-outline)] bg-[var(--bg-elevated)] p-5 sm:p-6 lg:col-span-5">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm font-semibold text-ink">Síntese arquitetural recomendada</span>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-[var(--status-emerald-soft)] px-3 py-1 text-xs font-semibold text-[var(--status-emerald)]">
                <span class="h-1.5 w-1.5 rounded-full bg-[var(--status-emerald)]" aria-hidden="true"></span>
                Código 100% próprio
              </span>
            </div>

            <!-- Recommended Stack Pills -->
            <div class="mt-4">
              <span class="text-xs font-medium text-muted">Stack tecnológica sugerida</span>
              <div class="mt-2 flex flex-wrap gap-2">
                @for (tech of recommendedStack(); track tech) {
                  <span class="rounded-full border border-[var(--glass-outline)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-semibold text-ink">
                    {{ tech }}
                  </span>
                }
              </div>
            </div>

            <!-- Operational Gains -->
            <div class="mt-5">
              <span class="text-xs font-medium text-muted">Ganhos operacionais diretos</span>
              <ul class="mt-2.5 space-y-2.5">
                @for (gain of operationalGains(); track gain) {
                  <li class="flex items-start gap-2.5 text-sm leading-snug text-secondary">
                    <svg class="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-emerald)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{{ gain }}</span>
                  </li>
                }
              </ul>
            </div>

            <!-- Structured Technical Briefing Preview -->
            <div class="mt-5 rounded-2xl border border-[var(--glass-outline)] bg-[var(--bg-surface)] p-3.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-semibold text-ink">Prévia do briefing técnico</span>
                <span class="text-xs text-muted">Pronto para envio sob sigilo NDA</span>
              </div>
              <pre class="metric-mono mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-secondary">{{ briefingText() }}</pre>
            </div>
          </div>

          <div class="mt-6 space-y-3">
            @if (validationWarning()) {
              <p role="alert" class="rounded-2xl bg-[var(--status-amber-soft)] px-4 py-2.5 text-xs font-medium text-[var(--status-amber)]">
                {{ validationWarning() }}
              </p>
            }

            <div class="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
              <button
                type="button"
                (click)="dispatchBriefing('whatsapp')"
                class="btn-primary-pill w-full whitespace-nowrap sm:flex-1 lg:w-full"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Enviar no WhatsApp
              </button>

              <button
                type="button"
                (click)="dispatchBriefing('email')"
                class="btn-glass-pill w-full whitespace-nowrap sm:flex-1 lg:w-full"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="3"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                Enviar por e-mail
              </button>
            </div>

            @if (confirmationChannel(); as channel) {
              <div
                role="status"
                aria-live="polite"
                class="rounded-2xl border border-[var(--status-emerald)] bg-[var(--status-emerald-soft)] p-4"
              >
                <div class="flex items-start gap-3">
                  <span class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--status-emerald)] text-white" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <div class="flex-1 text-sm">
                    <p class="font-semibold text-ink">
                      Briefing técnico preparado com sucesso para {{ channel === 'whatsapp' ? 'WhatsApp corporativo' : 'e-mail executivo' }}.
                    </p>
                    <p class="mt-1 text-xs leading-relaxed text-secondary">
                      O resumo arquitetural das <span class="metric-mono font-semibold">{{ selectedIds().length }}</span> frentes selecionadas foi copiado e direcionado ao canal oficial da engenharia TRD.
                    </p>
                    <div class="mt-3 flex flex-wrap items-center gap-2.5">
                      <a
                        [href]="channel === 'whatsapp' ? whatsappHref() : mailtoHref()"
                        [attr.target]="channel === 'whatsapp' ? '_blank' : null"
                        [attr.rel]="channel === 'whatsapp' ? 'noopener' : null"
                        class="inline-flex min-h-[44px] items-center rounded-full bg-[var(--bg-surface)] px-3.5 text-xs font-semibold text-ink border border-[var(--glass-outline)]"
                      >
                        {{ channel === 'whatsapp' ? 'Abrir conversa direta no WhatsApp' : 'Abrir cliente de e-mail padrão' }}
                      </a>
                      <button
                        type="button"
                        (click)="copyBriefing()"
                        class="inline-flex min-h-[44px] items-center rounded-full px-3 text-xs font-semibold text-ink underline"
                      >
                        {{ copiedFeedback() ? 'Resumo copiado para a área de transferência' : 'Copiar texto do briefing' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ScopeSimulatorComponent {
  private readonly doc = inject(DOCUMENT);

  readonly modules: ScopeModuleOption[] = [
    {
      id: 'crm-comercial',
      title: 'Comercial e CRM',
      domain: 'Vendas corporativas e propostas',
      summary:
        'Funil adaptado ao ciclo real da empresa, histórico unificado de negociações, geração ágil de propostas e alertas no WhatsApp.',
      recommendedStack: ['Angular 19', 'Node.js', 'PostgreSQL 16', 'API WhatsApp Corporativo'],
      operationalGain:
        'Acesso ilimitado para toda a equipe comercial sem cobrança de licenças individuais por vendedor.',
    },
    {
      id: 'ordens-servico-campo',
      title: 'Ordens de Serviço e Campo',
      domain: 'Execução operacional e logística',
      summary:
        'Fila diária inteligente, alocação de técnicos ou frotas, checklists em dispositivos móveis e comprovantes em PDF.',
      recommendedStack: ['Angular 19 PWA', 'Java 21', 'Spring Boot 3', 'PostgreSQL 16'],
      operationalGain:
        'Eliminação de planilhas paralelas com rastreabilidade completa da abertura à conclusão de cada atendimento.',
    },
    {
      id: 'paineis-executivos',
      title: 'Painéis Executivos',
      domain: 'Governança e indicadores em tempo real',
      summary:
        'Consolidação de indicadores operacionais, conciliação automatizada de eventos e leitura clara em telas móveis ou desktop.',
      recommendedStack: ['Angular 19 Signals', 'Spring Boot 3', 'Views Materializadas SQL'],
      operationalGain:
        'Tomada de decisão baseada em dados íntegros atualizados em tempo real, sem espera por relatórios manuais.',
    },
    {
      id: 'integracoes-ia',
      title: 'Integrações e IA',
      domain: 'Automação documental e barramentos',
      summary:
        'Conexão segura com ERPs, sistemas governamentais ou bancários e extração inteligente de dados em documentos e PDFs.',
      recommendedStack: ['Java 21', 'Spring AI', 'Anthropic API', 'Filas Assíncronas'],
      operationalGain:
        'Automação de triagens repetitivas sob cláusula de retenção nula de dados sensíveis e conformidade LGPD.',
    },
    {
      id: 'sustentacao-legado',
      title: 'Sustentação de Sistema Legado',
      domain: 'Confiabilidade N3 e acordo de nível de serviço',
      summary:
        'Assunção técnica documentada de software já em produção, otimização de banco SQL, correções estruturais e evolução contínua.',
      recommendedStack: ['Java 17/21', 'Spring Data JPA', 'PostgreSQL Tuning', 'Liquibase'],
      operationalGain:
        'Blindagem contra paradas críticas com primeira resposta qualificada P1 em contrato e fim da dependência de pessoa única.',
    },
  ];

  readonly contexts: { id: OperationalContext; label: string; summary: string }[] = [
    {
      id: 'expansao',
      label: 'Operação em expansão',
      summary: 'Substituição de planilhas e ferramentas fragmentadas por plataforma própria escalável.',
    },
    {
      id: 'regulado',
      label: 'Ambiente regulado ou multi-unidade',
      summary: 'Exigência de trilha de auditoria imutável, segregação de perfis e governança estrita LGPD.',
    },
    {
      id: 'legado',
      label: 'Estabilização de legado crítico',
      summary: 'Sistema vital em produção demandando diagnóstico SQL, documentação e SLA contratual.',
    },
  ];

  readonly selectedIds = signal<string[]>(['crm-comercial', 'paineis-executivos']);
  readonly context = signal<OperationalContext>('expansao');
  readonly contactName = signal<string>('');
  readonly companyName = signal<string>('');
  readonly validationWarning = signal<string | null>(null);
  readonly confirmationChannel = signal<'whatsapp' | 'email' | null>(null);
  readonly copiedFeedback = signal<boolean>(false);

  readonly selectedModules = computed(() =>
    this.modules.filter((m) => this.selectedIds().includes(m.id))
  );

  readonly recommendedStack = computed(() => {
    const set = new Set<string>();
    for (const mod of this.selectedModules()) {
      for (const tech of mod.recommendedStack) {
        set.add(tech);
      }
    }
    if (this.context() === 'regulado') {
      set.add('Hibernate Envers (Auditoria LGPD)');
    }
    return Array.from(set);
  });

  readonly operationalGains = computed(() => {
    const gains = this.selectedModules().map((m) => m.operationalGain);
    gains.push(
      'Titularidade definitiva do código-fonte (Lei 9.609/98) e contrato formal assinado com NDA.'
    );
    return gains;
  });

  readonly briefingText = computed(() => {
    const activeContext = this.contexts.find((c) => c.id === this.context());
    const moduleNames = this.selectedModules()
      .map((m) => `- ${m.title} (${m.domain})`)
      .join('\n');
    const stackLine = this.recommendedStack().join(', ');
    const identLines: string[] = [];
    if (this.contactName().trim()) {
      identLines.push(`Responsável: ${this.contactName().trim()}`);
    }
    if (this.companyName().trim()) {
      identLines.push(`Organização: ${this.companyName().trim()}`);
    }

    return [
      'Briefing Técnico Preliminar | TRD Consultoria',
      ...identLines,
      `Cenário operacional: ${activeContext?.label ?? 'Operação em expansão'}`,
      'Frentes selecionadas:',
      moduleNames || '- Definir em reunião de diagnóstico',
      `Arquitetura sugerida: ${stackLine}`,
      'Objetivo: Agendar diagnóstico técnico sênior sob confidencialidade (NDA).',
    ].join('\n');
  });

  readonly whatsappHref = computed(
    () => `https://wa.me/5561999526374?text=${encodeURIComponent(this.briefingText())}`
  );

  readonly mailtoHref = computed(() => {
    const subject = this.companyName().trim()
      ? `Diagnóstico de Arquitetura TRD | ${this.companyName().trim()}`
      : 'Diagnóstico de Arquitetura e Escopo | TRD Consultoria';
    return `mailto:contato@trdconsultoria.com.br?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(this.briefingText())}`;
  });

  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  toggleModule(id: string): void {
    this.confirmationChannel.set(null);
    this.validationWarning.set(null);
    this.selectedIds.update((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  setContext(ctx: OperationalContext): void {
    this.confirmationChannel.set(null);
    this.context.set(ctx);
  }

  onFieldEdit(field: 'name' | 'company', value: string): void {
    this.confirmationChannel.set(null);
    if (field === 'name') {
      this.contactName.set(value);
    } else {
      this.companyName.set(value);
    }
  }

  dispatchBriefing(channel: 'whatsapp' | 'email'): void {
    if (this.selectedIds().length === 0) {
      this.validationWarning.set(
        'Selecione ao menos uma frente operacional acima para compor a arquitetura recomendada.'
      );
      return;
    }

    this.validationWarning.set(null);
    this.copyBriefingSilently();
    this.confirmationChannel.set(channel);

    const win = this.doc.defaultView;
    if (!win) {
      return;
    }

    if (channel === 'whatsapp') {
      win.open(this.whatsappHref(), '_blank', 'noopener');
    } else {
      win.location.href = this.mailtoHref();
    }
  }

  copyBriefing(): void {
    this.copyBriefingSilently();
    this.copiedFeedback.set(true);
    setTimeout(() => this.copiedFeedback.set(false), 3000);
  }

  private copyBriefingSilently(): void {
    try {
      const nav = this.doc.defaultView?.navigator;
      if (nav?.clipboard?.writeText) {
        void nav.clipboard.writeText(this.briefingText());
      }
    } catch {
      // Clipboard API may be unavailable in restricted contexts
    }
  }
}
