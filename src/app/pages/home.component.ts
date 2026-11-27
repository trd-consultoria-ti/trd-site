import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  InstitutionalPayload,
  LogoContrastMode,
  PortfolioCase,
  PortfolioCategory,
  ProcessStep,
} from '../core/institutional.models';
import { TrdLiquidGlassDirective } from '../core/liquid-glass';
import { ThemeService } from '../core/theme.service';
import { ScopeSimulatorComponent } from '../features/scope-simulator.component';

type HeroFrameView = 'hub' | 'sla';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ScopeSimulatorComponent, TrdLiquidGlassDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- 1. HERO (1st screen, subtle load entrance, live interactive Liquid Glass app-frame) -->
    <section id="inicio" class="relative flex min-h-[calc(100svh-70px)] items-center py-10 sm:py-14 lg:py-16">
      <div class="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <!-- Hero Copy & Primary Actions -->
          <div class="hero-enter lg:col-span-6">
            <div class="glass-chip inline-flex items-center gap-2.5 px-4 py-1.5 text-xs font-semibold text-ink">
              <span class="h-2 w-2 rounded-full bg-[var(--status-emerald)]" aria-hidden="true"></span>
              <span>Engenharia sênior em Brasília com atuação nacional</span>
            </div>

            <h1 class="mt-5 text-[2.15rem] font-bold tracking-[-0.03em] text-ink sm:text-[2.85rem] lg:text-[3.15rem]">
              Sistemas corporativos sob medida e sustentação de missão crítica
            </h1>

            <p class="mt-5 max-w-xl text-base leading-relaxed text-secondary sm:text-[1.0625rem]">
              Desenvolvemos plataformas próprias sem licenças por usuário e assumimos a confiabilidade de aplicações reguladas com acordo de nível de serviço em contrato e propriedade intelectual transferida integralmente à sua empresa.
            </p>

            <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#arquitetura"
                (click)="scrollToSection($event, 'arquitetura')"
                class="btn-primary-pill w-full sm:w-auto"
              >
                Mapear meu sistema
              </a>
              <a
                href="#experiencia"
                (click)="scrollToSection($event, 'experiencia')"
                class="btn-glass-pill w-full sm:w-auto"
              >
                Conhecer casos reais
              </a>
            </div>

            <dl class="mt-9 grid grid-cols-3 gap-4 border-t border-[var(--glass-outline)] pt-6">
              <div>
                <dt class="text-xs font-medium text-muted">Resposta crítica P1</dt>
                <dd class="metric-mono mt-1 text-lg font-bold text-ink sm:text-xl">&lt; 2h</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted">Titularidade do código</dt>
                <dd class="metric-mono mt-1 text-lg font-bold text-ink sm:text-xl">100%</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted">Disponibilidade alvo</dt>
                <dd class="metric-mono mt-1 text-lg font-bold text-ink sm:text-xl">99.9%</dd>
              </div>
            </dl>
          </div>

          <!-- Live Interactive Liquid Glass App-Frame Showcase -->
          <div class="hero-enter-delayed lg:col-span-6">
            <div
              trdLiquidGlass="overlay"
              class="glass-panel-strong overflow-hidden p-4 sm:p-5"
              role="region"
              aria-label="Demonstração interativa de arquitetura TRD"
            >
              <!-- Window Header + Switcher -->
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--glass-outline)] pb-3.5">
                <div class="flex items-center gap-2">
                  <span class="h-3 w-3 rounded-full bg-[#EF4444]/80" aria-hidden="true"></span>
                  <span class="h-3 w-3 rounded-full bg-[#F59E0B]/80" aria-hidden="true"></span>
                  <span class="h-3 w-3 rounded-full bg-[#10B981]/80" aria-hidden="true"></span>
                  <span class="ml-1.5 text-xs font-semibold text-muted">Console Operacional TRD</span>
                </div>

                <div class="segmented-track w-full sm:w-auto" role="tablist" aria-label="Alternar visão do sistema">
                  <button
                    type="button"
                    role="tab"
                    [attr.aria-selected]="heroView() === 'hub'"
                    [class.is-active]="heroView() === 'hub'"
                    (click)="heroView.set('hub')"
                    class="segmented-btn flex-1 sm:flex-initial !min-h-[44px] !px-3.5 !py-1.5 !text-xs"
                  >
                    Hub Operacional Sob Medida
                  </button>
                  <button
                    type="button"
                    role="tab"
                    [attr.aria-selected]="heroView() === 'sla'"
                    [class.is-active]="heroView() === 'sla'"
                    (click)="heroView.set('sla')"
                    class="segmented-btn flex-1 sm:flex-initial !min-h-[44px] !px-3.5 !py-1.5 !text-xs"
                  >
                    Painel de Confiabilidade e SLA
                  </button>
                </div>
              </div>

              @if (heroView() === 'hub') {
                <!-- View 1: Custom Operational Hub -->
                <div class="mt-4 space-y-3.5" role="tabpanel" aria-label="Hub Operacional Sob Medida">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 class="text-base font-semibold text-ink">Esteira Corporativa Unificada</h2>
                      <p class="text-xs text-muted">Usuários internos ilimitados e banco PostgreSQL dedicado</p>
                    </div>
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-[var(--status-emerald-soft)] px-3 py-1 text-xs font-semibold text-[var(--status-emerald)]">
                      <span class="h-1.5 w-1.5 rounded-full bg-[var(--status-emerald)]" aria-hidden="true"></span>
                      Código 100% próprio
                    </span>
                  </div>

                  <div class="grid grid-cols-3 gap-2.5">
                    <div class="glass-subcard p-3">
                      <span class="text-xs text-muted">Ordens ativas</span>
                      <p class="metric-mono mt-1 text-base font-bold text-ink">148</p>
                      <span class="text-[0.7rem] font-medium text-[var(--status-emerald)]">Fluxo sincronizado</span>
                    </div>
                    <div class="glass-subcard p-3">
                      <span class="text-xs text-muted">Licenças externas</span>
                      <p class="metric-mono mt-1 text-base font-bold text-ink">0</p>
                      <span class="text-[0.7rem] font-medium text-secondary">Lei 9.609/98</span>
                    </div>
                    <div class="glass-subcard p-3">
                      <span class="text-xs text-muted">Auditoria LGPD</span>
                      <p class="metric-mono mt-1 text-base font-bold text-ink">Ativa</p>
                      <span class="text-[0.7rem] font-medium text-secondary">Trilha imutável</span>
                    </div>
                  </div>

                  <div class="space-y-2">
                    @for (flow of hubFlows; track flow.code; let idx = $index) {
                      <button
                        type="button"
                        (click)="selectedFlowIndex.set(idx)"
                        [class.is-selected]="selectedFlowIndex() === idx"
                        class="interactive-card glass-subcard flex min-h-[48px] w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left"
                      >
                        <div class="min-w-0">
                          <div class="flex items-center gap-2">
                            <span class="metric-mono text-xs font-semibold text-[var(--accent-cyan)]">{{ flow.code }}</span>
                            <span class="truncate text-sm font-semibold text-ink">{{ flow.title }}</span>
                          </div>
                          <p class="truncate text-xs text-muted">{{ flow.detail }}</p>
                        </div>
                        <span
                          class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                          [class.bg-[var(--status-emerald-soft)]]="flow.tone === 'emerald'"
                          [class.text-[var(--status-emerald)]]="flow.tone === 'emerald'"
                          [class.bg-[var(--accent-cyan-soft)]]="flow.tone === 'cyan'"
                          [class.text-[var(--accent-cyan)]]="flow.tone === 'cyan'"
                        >
                          {{ flow.status }}
                        </span>
                      </button>
                    }
                  </div>

                  <div class="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-inset-surface)] px-3.5 py-2.5 text-xs text-secondary">
                    <strong class="font-semibold text-ink">Inspeção do módulo:</strong>
                    {{ hubFlows[selectedFlowIndex()].inspection }}
                  </div>
                </div>
              } @else {
                <!-- View 2: Reliability & SLA Telemetry -->
                <div class="mt-4 space-y-3.5" role="tabpanel" aria-label="Painel de Confiabilidade e SLA">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 class="text-base font-semibold text-ink">Observabilidade e Sustentação N3</h2>
                      <p class="text-xs text-muted">Monitoramento preventivo, tuning SQL e resposta contratual</p>
                    </div>
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-cyan-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-cyan)]">
                      SLA P1 <span class="metric-mono">&lt; 2h</span>
                    </span>
                  </div>

                  <div class="grid grid-cols-3 gap-2.5">
                    <div class="glass-subcard p-3">
                      <span class="text-xs text-muted">Query crítica SQL</span>
                      <p class="metric-mono mt-1 text-base font-bold text-[var(--status-emerald)]">14 ms</p>
                      <span class="text-[0.7rem] text-muted">Antes: <span class="metric-mono">4.821 ms</span></span>
                    </div>
                    <div class="glass-subcard p-3">
                      <span class="text-xs text-muted">Locks de banco</span>
                      <p class="metric-mono mt-1 text-base font-bold text-ink">0</p>
                      <span class="text-[0.7rem] text-muted">Índice B-Tree ativo</span>
                    </div>
                    <div class="glass-subcard p-3">
                      <span class="text-xs text-muted">Sigilo e LGPD</span>
                      <p class="metric-mono mt-1 text-base font-bold text-ink">NDA</p>
                      <span class="text-[0.7rem] text-muted">Retenção zero IA</span>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-inset-surface)] p-3.5">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-semibold text-ink">Evidência de diagnóstico PostgreSQL</span>
                      <span class="metric-mono text-[var(--status-emerald)]">-99.7% I/O</span>
                    </div>
                    <pre class="metric-mono mt-2 overflow-x-auto text-[0.72rem] leading-relaxed text-secondary">Index Scan using idx_transacao_status_data
Planning Time: 0.18 ms | Execution Time: 14.02 ms
SLA P1 &lt; 2h | Hibernate Envers Audit: Verified</pre>
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-subcard-bg)] px-3.5 py-2.5 text-xs text-secondary">
                    <span>Cobertura formal com assinatura digital Gov.br e cláusula Damage Cap</span>
                    <span class="font-semibold text-ink">Prontidão ativa</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. BENEFÍCIOS (Asymmetric Bento Layout — 7/5 & 5/7) -->
    <section id="beneficios" class="py-16 sm:py-20">
      <div class="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div class="max-w-3xl">
          <h2 class="text-2xl font-bold text-ink sm:text-4xl">
            Autonomia tecnológica e retaguarda sênior para operações que não podem parar
          </h2>
          <p class="mt-4 text-base leading-relaxed text-secondary sm:text-lg">
            Por que organizações consolidadas substituem planilhas frágeis, softwares de prateleira cobrados por assento e códigos órfãos por engenharia sob medida com governança contratual.
          </p>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <!-- Bento Card 1 (Wide 7 cols): 100% IP Ownership + Architectural Hub Diagram -->
          <article trdLiquidGlass="card" class="glass-card flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
            <div>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="glass-chip px-3.5 py-1 text-xs font-semibold text-[var(--accent-cyan)]">
                  Patrimônio tecnológico definitivo
                </span>
                <span class="metric-mono text-xs font-semibold text-muted">Lei Federal 9.609/98</span>
              </div>

              <h3 class="mt-4 text-xl font-bold text-ink sm:text-2xl">
                Propriedade intelectual integral transferida para a sua empresa
              </h3>
              <p class="mt-3 text-[0.95rem] leading-relaxed text-secondary">
                No modelo sob medida da TRD, o sistema nasce aderente às regras reais do seu negócio e torna-se ativo definitivo da sua organização. Você escala equipes comerciais, filiais, operadores de campo e portais de clientes sem bloqueios de licenciamento por usuário e sem dependência tecnológica forçada.
              </p>
            </div>

            <!-- Inline Architectural Hub Diagram -->
            <div class="mt-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-inset-surface)] p-4">
              <svg
                viewBox="0 0 620 148"
                class="h-auto w-full"
                role="img"
                aria-label="Diagrama de arquitetura proprietária conectando entradas operacionais ao núcleo TRD e saídas auditáveis"
              >
                <!-- Connection lines -->
                <path d="M168 36 C210 36, 214 74, 248 74" fill="none" stroke="var(--accent-cyan)" stroke-width="1.8" stroke-dasharray="4 3" />
                <path d="M168 74 L248 74" fill="none" stroke="var(--accent-cyan)" stroke-width="1.8" />
                <path d="M168 112 C210 112, 214 74, 248 74" fill="none" stroke="var(--accent-cyan)" stroke-width="1.8" stroke-dasharray="4 3" />

                <path d="M388 74 C422 74, 426 36, 456 36" fill="none" stroke="var(--status-emerald)" stroke-width="1.8" />
                <path d="M388 74 L456 74" fill="none" stroke="var(--status-emerald)" stroke-width="1.8" />
                <path d="M388 74 C422 74, 426 112, 456 112" fill="none" stroke="var(--status-emerald)" stroke-width="1.8" />

                <!-- Input nodes -->
                <rect x="8" y="18" width="160" height="34" rx="11" fill="var(--bg-elevated)" stroke="var(--glass-outline)" />
                <text x="88" y="39" text-anchor="middle" fill="var(--ink-primary)" font-size="11.5" font-weight="600">Vendas e Atendimento</text>

                <rect x="8" y="57" width="160" height="34" rx="11" fill="var(--bg-elevated)" stroke="var(--glass-outline)" />
                <text x="88" y="78" text-anchor="middle" fill="var(--ink-primary)" font-size="11.5" font-weight="600">Operação e Campo</text>

                <rect x="8" y="96" width="160" height="34" rx="11" fill="var(--bg-elevated)" stroke="var(--glass-outline)" />
                <text x="88" y="117" text-anchor="middle" fill="var(--ink-primary)" font-size="11.5" font-weight="600">Integrações Externas</text>

                <!-- Core Hub -->
                <rect x="248" y="34" width="140" height="80" rx="18" fill="var(--accent-cyan-soft)" stroke="var(--accent-cyan)" stroke-width="1.6" />
                <text x="318" y="68" text-anchor="middle" fill="var(--ink-primary)" font-size="12.5" font-weight="700">Núcleo Próprio</text>
                <text x="318" y="88" text-anchor="middle" fill="var(--ink-secondary)" font-size="10.5" font-weight="500">Repositório 100% seu</text>

                <!-- Output nodes -->
                <rect x="456" y="18" width="156" height="34" rx="11" fill="var(--bg-elevated)" stroke="var(--glass-outline)" />
                <text x="534" y="39" text-anchor="middle" fill="var(--ink-primary)" font-size="11.5" font-weight="600">Operadores Ilimitados</text>

                <rect x="456" y="57" width="156" height="34" rx="11" fill="var(--bg-elevated)" stroke="var(--glass-outline)" />
                <text x="534" y="78" text-anchor="middle" fill="var(--ink-primary)" font-size="11.5" font-weight="600">PostgreSQL Isolado</text>

                <rect x="456" y="96" width="156" height="34" rx="11" fill="var(--bg-elevated)" stroke="var(--glass-outline)" />
                <text x="534" y="117" text-anchor="middle" fill="var(--ink-primary)" font-size="11.5" font-weight="600">Auditoria e LGPD</text>
              </svg>
            </div>
          </article>

          <!-- Bento Card 2 (Compact 5 cols): Contrast vs Spreadsheets, Per-Seat SaaS, Freelancers -->
          <article trdLiquidGlass="card" class="glass-card flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
            <div>
              <span class="glass-chip px-3.5 py-1 text-xs font-semibold text-ink">
                Comparativo estrutural
              </span>
              <h3 class="mt-4 text-xl font-bold text-ink">
                Onde os modelos convencionais travam a sua empresa
              </h3>
            </div>

            <div class="mt-5 space-y-3">
              <div class="glass-subcard p-3.5">
                <div class="flex items-center justify-between">
                  <strong class="text-sm font-semibold text-ink">Planilhas descentralizadas</strong>
                  <span class="text-xs font-semibold text-[var(--status-red)]">Alto risco</span>
                </div>
                <p class="mt-1 text-xs leading-relaxed text-secondary">
                  Versões conflitantes, perda de histórico comercial e ausência total de trilha de auditoria.
                </p>
              </div>

              <div class="glass-subcard p-3.5">
                <div class="flex items-center justify-between">
                  <strong class="text-sm font-semibold text-ink">SaaS engessado por usuário</strong>
                  <span class="text-xs font-semibold text-[var(--status-amber)]">Penaliza escala</span>
                </div>
                <p class="mt-1 text-xs leading-relaxed text-secondary">
                  Fluxos genéricos que obrigam sua operação a se adaptar à ferramenta e restringem novos acessos.
                </p>
              </div>

              <div class="glass-subcard p-3.5">
                <div class="flex items-center justify-between">
                  <strong class="text-sm font-semibold text-ink">Código freelance sem governança</strong>
                  <span class="text-xs font-semibold text-[var(--status-red)]">Dependência crítica</span>
                </div>
                <p class="mt-1 text-xs leading-relaxed text-secondary">
                  Falta de documentação, queries lentas sem índice e abandono técnico após a entrega inicial.
                </p>
              </div>

              <div class="rounded-2xl border border-[var(--accent-cyan)] bg-[var(--accent-cyan-soft)] p-3.5">
                <div class="flex items-center justify-between">
                  <strong class="text-sm font-semibold text-ink">Engenharia Sênior TRD</strong>
                  <span class="text-xs font-semibold text-[var(--status-emerald)]">Governança total</span>
                </div>
                <p class="mt-1 text-xs leading-relaxed text-secondary">
                  Arquitetura limpa, testes automatizados, código documentado em seu nome e acordo formal de SLA.
                </p>
              </div>
            </div>
          </article>

          <!-- Bento Card 3 (Compact 5 cols): Legal Safety, NDA & Damage Cap -->
          <article trdLiquidGlass="card" class="glass-card flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
            <div>
              <span class="glass-chip px-3.5 py-1 text-xs font-semibold text-ink">
                Blindagem jurídica corporativa
              </span>
              <h3 class="mt-4 text-xl font-bold text-ink">
                Contrato formal, sigilo NDA e conformidade LGPD nativa
              </h3>
              <p class="mt-3 text-[0.95rem] leading-relaxed text-secondary">
                Toda atuação de desenvolvimento ou sustentação é amparada por instrumento contratual pessoa jurídica assinado digitalmente via Gov.br, com cláusulas explícitas de confidencialidade, limite indenizatório claro (Damage Cap) e minimização de dados sensíveis.
              </p>
            </div>

            <ul class="mt-6 space-y-2.5 border-t border-[var(--glass-outline)] pt-5 text-sm text-secondary">
              <li class="flex items-center gap-2.5">
                <span class="h-2 w-2 rounded-full bg-[var(--accent-cyan)]" aria-hidden="true"></span>
                <span>Termo de confidencialidade (NDA) antes do acesso ao código</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="h-2 w-2 rounded-full bg-[var(--accent-cyan)]" aria-hidden="true"></span>
                <span>Política estrita de retenção zero em ferramentas assistivas</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="h-2 w-2 rounded-full bg-[var(--accent-cyan)]" aria-hidden="true"></span>
                <span>Runbooks operacionais e documentação viva no repositório</span>
              </li>
            </ul>
          </article>

          <!-- Bento Card 4 (Wide 7 cols): Direct Senior Execution & Principal Architect -->
          <article trdLiquidGlass="card" class="glass-card flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
            <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
              <img
                src="assets/thiago-duarte.jpg"
                alt="Thiago Rocha Duarte, Sócio-Diretor e Principal Systems Architect da TRD Consultoria"
                width="104"
                height="104"
                loading="lazy"
                class="h-24 w-24 shrink-0 rounded-2xl border border-[var(--glass-border)] object-cover shadow-sm"
              />
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="glass-chip px-3 py-1 text-xs font-semibold text-ink">
                    Execução sênior sem intermediários
                  </span>
                  <span class="rounded-full bg-[var(--status-emerald-soft)] px-3 py-1 text-xs font-semibold text-[var(--status-emerald)]">
                    Anthropic Certified Architect
                  </span>
                </div>
                <h3 class="mt-3 text-xl font-bold text-ink sm:text-2xl">
                  Liderança direta de quem já operou sistemas federais e financeiros críticos
                </h3>
                <p class="mt-2.5 text-[0.95rem] leading-relaxed text-secondary">
                  Na TRD Consultoria você trata diretamente com <strong>Thiago Rocha Duarte</strong> (Sócio-Diretor e Principal Systems Architect) e especialistas seniores em Java, Angular, Python e PostgreSQL. Sem repasse para equipes juniores e sem burocracia comercial.
                </p>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-3 border-t border-[var(--glass-outline)] pt-5 sm:grid-cols-3">
              <div class="glass-subcard p-3.5">
                <span class="text-xs text-muted">Arquitetura Backend</span>
                <p class="mt-1 text-sm font-semibold text-ink">Java 21, Spring Boot e Node.js</p>
              </div>
              <div class="glass-subcard p-3.5">
                <span class="text-xs text-muted">Persistência e Tuning</span>
                <p class="mt-1 text-sm font-semibold text-ink">PostgreSQL, Oracle e Liquibase</p>
              </div>
              <div class="glass-subcard p-3.5">
                <span class="text-xs text-muted">Interfaces Executivas</span>
                <p class="mt-1 text-sm font-semibold text-ink">Angular 19 e Design Acessível</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 3. EXPERIÊNCIA & AUTORIDADE (Angular 19 httpResource + Real Logos + 4 Real States) -->
    <section id="experiencia" class="py-16 sm:py-20">
      <div class="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div class="max-w-2xl">
            <h2 class="text-2xl font-bold text-ink sm:text-4xl">
              Experiência comprovada em ecossistemas regulados e plataformas próprias
            </h2>
            <p class="mt-4 text-base leading-relaxed text-secondary sm:text-lg">
              Bagagem técnica consolidada em órgãos de Estado, mercado de capitais, bureaus de crédito de alta concorrência e softwares sob medida em produção.
            </p>
          </div>
          <a
            href="https://www.linkedin.com/in/thiagorduarte/"
            target="_blank"
            rel="noopener"
            class="btn-glass-pill self-start lg:self-auto"
          >
            Ver trajetória no LinkedIn
          </a>
        </div>

        <!-- Real Institutional Trajectory Logos on Transparent Glass (ZERO White Boxes!) -->
        @if (portfolioResource.hasValue()) {
          <div
            class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7"
            aria-label="Ecossistemas e instituições de referência técnica"
          >
            @for (logo of portfolioResource.value().authorityLogos; track logo.id) {
              <div class="glass-card flex flex-col items-center justify-between gap-3 px-3 py-4 text-center">
                <div class="client-logo-slot h-11 w-full">
                  <img
                    [src]="logo.src"
                    [alt]="logo.name"
                    [class]="logoClass(logo.contrastMode, logo.aspect)"
                    loading="lazy"
                  />
                </div>
                <span class="text-xs font-medium leading-tight text-secondary">{{ logo.name }}</span>
              </div>
            }
          </div>
        }

        <!-- Interactive Category Segmented Control + Search Filter -->
        <div class="mt-9 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div class="segmented-track" role="tablist" aria-label="Filtrar portfólio por domínio">
            @for (cat of categories; track cat.id) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="selectedCategory() === cat.id"
                [class.is-active]="selectedCategory() === cat.id"
                (click)="selectedCategory.set(cat.id)"
                class="segmented-btn"
              >
                {{ cat.label }}
              </button>
            }
          </div>

          <div class="relative w-full lg:w-80">
            <label for="portfolio-search" class="sr-only">Buscar projetos por nome ou tecnologia</label>
            <input
              id="portfolio-search"
              type="search"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Buscar órgão, case ou stack..."
              class="glass-input min-h-[46px] w-full rounded-full pl-10 pr-10 text-sm placeholder:text-muted"
            />
            <svg
              class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            @if (searchQuery()) {
              <button
                type="button"
                (click)="searchQuery.set('')"
                aria-label="Limpar texto da busca"
                class="absolute right-1.5 top-1/2 inline-flex h-[38px] w-[38px] -translate-y-1/2 items-center justify-center rounded-full text-muted hover:text-ink"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            }
          </div>
        </div>

        <!-- 4 REAL STATES OF httpResource -->
        @if (portfolioResource.isLoading()) {
          <!-- STATE 1: LOADING (.skeleton-box glass cards) -->
          <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12" aria-busy="true" aria-label="Carregando casos reais">
            <div class="glass-panel p-7 lg:col-span-7">
              <div class="skeleton-box h-6 w-40"></div>
              <div class="skeleton-box mt-4 h-8 w-3/4"></div>
              <div class="skeleton-box mt-4 h-16 w-full"></div>
              <div class="mt-6 flex gap-2">
                <div class="skeleton-box h-7 w-20"></div>
                <div class="skeleton-box h-7 w-24"></div>
                <div class="skeleton-box h-7 w-20"></div>
              </div>
            </div>
            <div class="glass-panel p-7 lg:col-span-5">
              <div class="skeleton-box h-6 w-36"></div>
              <div class="skeleton-box mt-4 h-8 w-2/3"></div>
              <div class="skeleton-box mt-4 h-16 w-full"></div>
              <div class="mt-6 flex gap-2">
                <div class="skeleton-box h-7 w-20"></div>
                <div class="skeleton-box h-7 w-24"></div>
              </div>
            </div>
          </div>
        } @else if (portfolioResource.error()) {
          <!-- STATE 2: ERROR (Honest glass error state + Recarregar dados) -->
          <div class="glass-panel mt-8 flex flex-col items-center justify-center p-10 text-center" role="alert">
            <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--status-red-soft)] text-[var(--status-red)]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 class="mt-4 text-xl font-semibold text-ink">
              Não foi possível carregar o catálogo institucional agora
            </h3>
            <p class="mt-2 max-w-md text-sm text-secondary">
              Verifique sua conexão de rede e acione a sincronização abaixo para recarregar os casos técnicos verificados.
            </p>
            <button
              type="button"
              (click)="reloadPortfolio()"
              class="btn-primary-pill mt-6"
            >
              Recarregar dados
            </button>
          </div>
        } @else if (filteredCases().length === 0) {
          <!-- STATE 3: EMPTY (SF-Symbols-inspired glass empty state + Limpar filtro) -->
          <div class="glass-panel mt-8 flex flex-col items-center justify-center p-10 text-center" role="status">
            <div class="inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-[var(--glass-border)] bg-[var(--bg-elevated)] text-[var(--accent-cyan)]">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7"></circle>
                <path d="m20 20-3.5-3.5"></path>
                <path d="M8.5 11h5"></path>
              </svg>
            </div>
            <h3 class="mt-4 text-xl font-semibold text-ink">
              Nenhum projeto encontrado para este filtro
            </h3>
            <p class="mt-2 max-w-md text-sm leading-relaxed text-secondary">
              Não encontramos entregas correspondentes ao termo <strong>"{{ searchQuery() }}"</strong> na categoria selecionada. Restaure os filtros para visualizar todo o acervo técnico.
            </p>
            <button
              type="button"
              (click)="clearFilters()"
              class="btn-primary-pill mt-6"
            >
              Limpar filtro
            </button>
          </div>
        } @else {
          <!-- STATE 4: SUCCESS (Asymmetric Bento Case Cards) -->
          <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
            @for (item of filteredCases(); track item.id) {
              <article
                [class]="'glass-card col-span-1 flex flex-col justify-between p-6 sm:p-7 md:col-span-12 ' + (isUnfiltered() ? item.gridSpan : 'md:col-span-6')"
              >
                <div>
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <span class="inline-block rounded-full bg-[var(--accent-cyan-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-cyan)]">
                        {{ item.sector }}
                      </span>
                      <h3 class="mt-3 text-xl font-bold text-ink">
                        {{ item.organization }}
                      </h3>
                    </div>

                    <div class="client-logo-slot h-11 w-20 shrink-0">
                      <img
                        [src]="resolveCaseLogo(item)"
                        [alt]="'Marca ' + item.organization"
                        [class]="logoClass(item.contrastMode, item.aspect)"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <p class="mt-3.5 text-[0.95rem] leading-relaxed text-secondary">
                    {{ item.summary }}
                  </p>

                  <div class="glass-subcard mt-4 p-3.5">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-xs font-semibold text-ink">Resultado de engenharia</span>
                      <span class="metric-mono text-xs font-bold text-[var(--accent-cyan)]">{{ item.metricValue }}</span>
                    </div>
                    <p class="mt-1 text-xs leading-relaxed text-secondary">
                      {{ item.outcome }}
                    </p>
                  </div>
                </div>

                <div class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--glass-outline)] pt-4">
                  <div class="flex flex-wrap gap-1.5">
                    @for (tech of item.stack; track tech) {
                      <span class="rounded-full border border-[var(--glass-border)] bg-[var(--glass-inset-surface)] px-2.5 py-1 text-xs font-medium text-ink">
                        {{ tech }}
                      </span>
                    }
                  </div>
                  <span class="text-xs font-medium text-muted">{{ item.metricNote }}</span>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </section>

    <!-- 4. COMO FUNCIONA (4 Interactive Engineering Phases + Formal SLA Matrix) -->
    <section id="como-funciona" class="py-16 sm:py-20">
      <div class="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div class="max-w-3xl">
          <h2 class="text-2xl font-bold text-ink sm:text-4xl">
            Como conduzimos seu projeto do diagnóstico ao código em produção
          </h2>
          <p class="mt-4 text-base leading-relaxed text-secondary sm:text-lg">
            Rito previsível de engenharia em quatro etapas com entregáveis verificáveis, homologação assistida e transição formal para operação contínua.
          </p>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <!-- Step Selector -->
          <div class="flex flex-col gap-3 lg:col-span-5" role="tablist" aria-label="Etapas do método de engenharia">
            @for (step of processSteps; track step.id; let i = $index) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="activeStepIndex() === i"
                [class.is-selected]="activeStepIndex() === i"
                (click)="activeStepIndex.set(i)"
                class="interactive-card glass-card flex min-h-[68px] w-full items-center gap-4 p-4 text-left sm:p-5"
              >
                <span
                  class="metric-mono inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold"
                  [class.bg-[var(--accent-cyan)]]="activeStepIndex() === i"
                  [class.text-[var(--accent-ink)]]="activeStepIndex() === i"
                  [class.bg-[var(--bg-elevated)]]="activeStepIndex() !== i"
                  [class.text-ink]="activeStepIndex() !== i"
                >
                  {{ step.index }}
                </span>
                <div>
                  <h3 class="text-base font-semibold text-ink sm:text-lg">{{ step.title }}</h3>
                  <p class="mt-0.5 text-xs text-muted">{{ step.subtitle }}</p>
                </div>
              </button>
            }
          </div>

          <!-- Active Step Detail Panel -->
          <div trdLiquidGlass="card" class="glass-panel-strong flex flex-col justify-between p-6 sm:p-8 lg:col-span-7" role="tabpanel">
            @if (processSteps[activeStepIndex()]; as step) {
              <div>
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="glass-chip px-3.5 py-1 text-xs font-semibold text-[var(--accent-cyan)]">
                    Etapa <span class="metric-mono">{{ step.index }}</span> de <span class="metric-mono">04</span>
                  </span>
                  <span class="metric-mono text-xs font-medium text-muted">{{ step.artifactCode }}</span>
                </div>

                <h3 class="mt-4 text-2xl font-bold text-ink">
                  {{ step.title }}
                </h3>
                <p class="mt-3 text-base leading-relaxed text-secondary">
                  {{ step.description }}
                </p>

                <div class="mt-6">
                  <h4 class="text-sm font-semibold text-ink">Entregáveis técnicos concretos desta fase</h4>
                  <ul class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    @for (deliv of step.deliverables; track deliv) {
                      <li class="glass-subcard flex items-start gap-2.5 p-3.5 text-sm text-secondary">
                        <svg class="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-cyan)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{{ deliv }}</span>
                      </li>
                    }
                  </ul>
                </div>
              </div>

              <div class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--glass-outline)] pt-5">
                <div>
                  <span class="text-xs font-medium text-muted">Marco de validação executiva</span>
                  <p class="mt-0.5 text-sm font-semibold text-ink">{{ step.checkpoint }}</p>
                </div>
                <a
                  href="#arquitetura"
                  (click)="scrollToSection($event, 'arquitetura')"
                  class="btn-glass-pill"
                >
                  Simular meu escopo
                </a>
              </div>
            }
          </div>
        </div>

        <!-- Compact SLA Severity Governance Table -->
        <div trdLiquidGlass="card" class="glass-panel mt-8 overflow-hidden p-6 sm:p-8">
          <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h3 class="text-lg font-bold text-ink sm:text-xl">
                Matriz formal de severidade e tempos de resposta em contrato
              </h3>
              <p class="mt-1 text-sm text-secondary">
                Compromissos objetivos de primeira resposta qualificada em horário comercial para operações assistidas.
              </p>
            </div>
            <span class="text-xs font-medium text-muted">Cobertura nacional em dias úteis</span>
          </div>

          <div class="mt-5 overflow-x-auto">
            <table class="trd-table w-full min-w-[600px] border-collapse text-left text-sm">
              <thead>
                <tr class="border-b border-[var(--glass-outline)] text-xs font-semibold text-muted">
                  <th scope="col" class="py-3 pr-4">Nível</th>
                  <th scope="col" class="py-3 px-4">Cenário operacional</th>
                  <th scope="col" class="py-3 px-4">Primeira resposta</th>
                  <th scope="col" class="py-3 pl-4">Canal de acionamento</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--glass-outline)]">
                <tr>
                  <td class="py-3.5 pr-4">
                    <span class="inline-flex rounded-full bg-[var(--status-red-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--status-red)]">
                      P1 Crítico
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-secondary">Indisponibilidade total da aplicação principal ou banco de dados</td>
                  <td class="metric-mono py-3.5 px-4 font-semibold text-ink">&lt; 2h úteis</td>
                  <td class="py-3.5 pl-4 text-secondary">Linha direta prioritária com a arquitetura sênior</td>
                </tr>
                <tr>
                  <td class="py-3.5 pr-4">
                    <span class="inline-flex rounded-full bg-[var(--status-amber-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--status-amber)]">
                      P2 Alto
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-secondary">Degradação severa de performance ou falha em integração crítica</td>
                  <td class="metric-mono py-3.5 px-4 font-semibold text-ink">&lt; 4h úteis</td>
                  <td class="py-3.5 pl-4 text-secondary">Fila prioritária de sustentação N3</td>
                </tr>
                <tr>
                  <td class="py-3.5 pr-4">
                    <span class="inline-flex rounded-full bg-[var(--accent-cyan-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-cyan)]">
                      P3 Médio
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-secondary">Inconsistência pontual em módulo secundário com contorno ativo</td>
                  <td class="metric-mono py-3.5 px-4 font-semibold text-ink">&lt; 8h úteis</td>
                  <td class="py-3.5 pl-4 text-secondary">Esteira regular auditada</td>
                </tr>
                <tr>
                  <td class="py-3.5 pr-4">
                    <span class="inline-flex rounded-full bg-[var(--status-emerald-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--status-emerald)]">
                      P4 Evolutivo
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-secondary">Novas funcionalidades, relatórios executivos e melhorias planejadas</td>
                  <td class="metric-mono py-3.5 px-4 font-semibold text-ink">Ciclo de sprint</td>
                  <td class="py-3.5 pl-4 text-secondary">Comitê técnico de evolução</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. SIMULADOR DE ESCOPO E ARQUITETURA (@defer (on idle) — 100% Benefícios, ZERO Preços) -->
    <section id="arquitetura" class="py-16 sm:py-20">
      <div class="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div class="mb-8 max-w-3xl">
          <h2 class="text-2xl font-bold text-ink sm:text-4xl">
            Simulador de escopo e arquitetura sob medida
          </h2>
          <p class="mt-4 text-base leading-relaxed text-secondary sm:text-lg">
            Estruture os módulos prioritários da sua empresa, visualize a combinação tecnológica recomendada pela TRD e gere o briefing técnico pronto para alinhamento executivo.
          </p>
        </div>

        @defer (on idle; prefetch on idle) {
          <app-scope-simulator />
        } @placeholder {
          <div class="glass-panel p-8">
            <div class="skeleton-box h-7 w-64"></div>
            <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="skeleton-box h-24 w-full"></div>
              <div class="skeleton-box h-24 w-full"></div>
            </div>
          </div>
        } @loading (minimum 120ms) {
          <div class="glass-panel p-8" aria-busy="true">
            <div class="skeleton-box h-7 w-64"></div>
            <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="skeleton-box h-24 w-full"></div>
              <div class="skeleton-box h-24 w-full"></div>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- 6. CTA EXECUTIVO (#contato) -->
    <section id="contato" class="pt-10 pb-8 sm:pt-14">
      <div class="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div trdLiquidGlass="overlay" class="glass-panel-strong p-8 sm:p-12">
          <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div class="lg:col-span-7">
              <span class="glass-chip inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold text-ink">
                <span class="h-2 w-2 rounded-full bg-[var(--status-emerald)]" aria-hidden="true"></span>
                Alinhamento direto com o arquiteto responsável
              </span>
              <h2 class="mt-4 text-2xl font-bold text-ink sm:text-4xl">
                Construa seu sistema próprio ou proteja sua operação em produção
              </h2>
              <p class="mt-4 max-w-2xl text-base leading-relaxed text-secondary">
                Agende uma conversa técnica objetiva para avaliar a arquitetura do seu novo software sob medida ou estruturar o plano de sustentação com SLA da sua plataforma atual, sob confidencialidade desde o primeiro contato.
              </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:flex-col xl:flex-row xl:justify-end">
              <a
                href="https://wa.me/5561999526374?text=Ol%C3%A1%20Thiago%2C%20estou%20no%20site%20da%20TRD%20Consultoria%20e%20gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20t%C3%A9cnico%20de%20sistema%20ou%20sustenta%C3%A7%C3%A3o."
                target="_blank"
                rel="noopener"
                class="btn-primary-pill w-full sm:w-auto"
              >
                Conversar no WhatsApp
              </a>
              <a
                href="mailto:contato@trdconsultoria.com.br?subject=Diagn%C3%B3stico%20T%C3%A9cnico%20%7C%20TRD%20Consultoria"
                class="btn-glass-pill w-full sm:w-auto"
              >
                Enviar e-mail corporativo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  private readonly doc = inject(DOCUMENT);
  readonly themeService = inject(ThemeService);

  readonly heroView = signal<HeroFrameView>('hub');
  readonly selectedFlowIndex = signal<number>(0);

  readonly selectedCategory = signal<PortfolioCategory>('todos');
  readonly searchQuery = signal<string>('');
  readonly activeStepIndex = signal<number>(0);

  readonly apiEndpoint = signal<string>('/api/institutional.json');
  readonly portfolioResource = httpResource<InstitutionalPayload>(() => this.apiEndpoint());

  readonly categories: { id: PortfolioCategory; label: string }[] = [
    { id: 'todos', label: 'Todos os projetos' },
    { id: 'missao-critica', label: 'Governo e Regulação' },
    { id: 'sob-medida', label: 'Sistemas Sob Medida' },
    { id: 'ia-arquitetura', label: 'Dados e Inteligência' },
  ];

  readonly hubFlows = [
    {
      code: 'CRM-01',
      title: 'Propostas comerciais e funil B2B',
      detail: 'Geração de minuta PDF e disparo automático no WhatsApp',
      status: 'Operacional',
      tone: 'emerald' as const,
      inspection:
        'Acesso multi-perfil sem cobrança por operador, integrado ao histórico completo do cliente.',
    },
    {
      code: 'OPS-04',
      title: 'Ordens de serviço e equipes externas',
      detail: 'Roteirização diária, checklist técnico e baixa em tempo real',
      status: 'Sincronizado',
      tone: 'cyan' as const,
      inspection:
        'Persistência transacional em PostgreSQL dedicado com backup automatizado e validação de integridade.',
    },
    {
      code: 'GOV-09',
      title: 'Painel executivo e trilha LGPD',
      detail: 'Indicadores consolidados para diretoria e auditoria de eventos',
      status: 'Auditado',
      tone: 'emerald' as const,
      inspection:
        'Registro imutável de alterações sensíveis com código-fonte documentado no repositório da empresa.',
    },
  ];

  readonly processSteps: ProcessStep[] = [
    {
      id: 'diagnostico',
      index: '01',
      title: 'Diagnóstico de Fluxo',
      subtitle: 'Mapeamento das regras de negócio, gargalos e riscos',
      description:
        'Imersão objetiva com os decisores da operação para mapear processos críticos, integrações existentes, gargalos de banco de dados e requisitos de segurança sob acordo de confidencialidade (NDA).',
      deliverables: [
        'Mapa arquitetural das entidades e perfis de acesso',
        'Diagnóstico de riscos operacionais e pontos de falha',
        'Definição clara dos módulos prioritários por impacto',
        'Plano técnico fechado com marcos verificáveis',
      ],
      checkpoint: 'Aprovação executiva do escopo arquitetural e assinatura digital Gov.br',
      artifactCode: 'spec/arquitetura-alvo.md',
    },
    {
      id: 'sprints',
      index: '02',
      title: 'Sprints de Engenharia',
      subtitle: 'Construção incremental com demonstrações navegáveis',
      description:
        'Desenvolvimento conduzido diretamente por engenharia sênior utilizando Angular, Java / Spring Boot, Node.js ou Python sobre PostgreSQL dedicado, com entregas visíveis ao cliente a cada ciclo.',
      deliverables: [
        'Interfaces responsivas e acessíveis em ambiente de prévia',
        'APIs documentadas com contratos OpenAPI padronizados',
        'Versionamento estruturado de banco via Liquibase',
        'Integrações ativas com WhatsApp, documentos e sistemas internos',
      ],
      checkpoint: 'Demonstração funcional em ambiente isolado de homologação',
      artifactCode: 'ci/build-pipeline.yml',
    },
    {
      id: 'homologacao',
      index: '03',
      title: 'Homologação e Segurança',
      subtitle: 'Bateria de testes, tuning SQL e validação LGPD',
      description:
        'Antes da entrada em produção, submetemos a plataforma a testes automatizados de regressão, inspeção de planos de execução SQL em cenários de concorrência e verificação estrita de controles LGPD.',
      deliverables: [
        'Suíte de testes automatizados nos fluxos críticos',
        'Otimização de índices compostos e contenção de locks SQL',
        'Trilha de auditoria e segregação rigorosa de credenciais',
        'Treinamento objetivo para os multiplicadores da equipe',
      ],
      checkpoint: 'Termo de aceite técnico após validação assistida com usuários reais',
      artifactCode: 'audit/lgpd-readiness.sql',
    },
    {
      id: 'entrega-sla',
      index: '04',
      title: 'Entrega do Código e SLA',
      subtitle: 'Transferência definitiva de propriedade e operação assistida',
      description:
        'Com a plataforma em produção, formalizamos a transferência integral do código-fonte (Lei 9.609/98), entregamos os runbooks de infraestrutura e ativamos a retaguarda opcional de sustentação e evolução com SLA.',
      deliverables: [
        'Repositório Git completo sob titularidade da sua empresa',
        'Documentação de arquitetura, esquemas e rotinas de restauração',
        'Garantia técnica integral sobre o escopo homologado',
        'Cobertura contínua opcional com SLA P1 até P4 em contrato',
      ],
      checkpoint: 'Operação autônoma em produção com retaguarda sênior garantida',
      artifactCode: 'ops/runbook-producao.md',
    },
  ];

  readonly isUnfiltered = computed(
    () => this.selectedCategory() === 'todos' && this.searchQuery().trim().length === 0
  );

  readonly filteredCases = computed<PortfolioCase[]>(() => {
    if (!this.portfolioResource.hasValue()) {
      return [];
    }
    const allCases = this.portfolioResource.value().cases;
    const category = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();

    return allCases.filter((item) => {
      const matchesCat = category === 'todos' || item.category === category;
      if (!matchesCat) {
        return false;
      }
      if (!query) {
        return true;
      }
      const haystack = [
        item.organization,
        item.sector,
        item.summary,
        item.outcome,
        ...item.stack,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  });

  resolveCaseLogo(item: PortfolioCase): string {
    if (item.contrastMode === 'dual-asset' && item.logoDark) {
      return this.themeService.isDark() ? item.logoDark : item.logo;
    }
    return item.logo;
  }

  logoClass(mode: LogoContrastMode, aspect: 'square' | 'wide'): string {
    const sizeClass =
      aspect === 'square'
        ? 'max-h-10 max-w-[42px] w-auto h-auto object-contain'
        : 'max-h-7 max-w-[108px] w-auto h-auto object-contain';

    switch (mode) {
      case 'mono-invert':
        return `${sizeClass} logo-mono-invert`;
      case 'optical-invert':
        return `${sizeClass} logo-optical-invert`;
      case 'cvm-boost':
        return `${sizeClass} logo-cvm-boost`;
      default:
        return sizeClass;
    }
  }

  clearFilters(): void {
    this.selectedCategory.set('todos');
    this.searchQuery.set('');
  }

  reloadPortfolio(): void {
    this.apiEndpoint.set('/api/institutional.json');
    this.portfolioResource.reload();
  }

  scrollToSection(event: MouseEvent, id: string): void {
    event.preventDefault();
    const target = this.doc.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
