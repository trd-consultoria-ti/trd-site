import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-12 sm:py-16">
      <div class="mx-auto max-w-[920px] px-5 sm:px-8">
        <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
          <span class="glass-chip px-4 py-1.5 text-xs font-semibold text-[var(--accent-cyan)]">
            Lei Federal nº 13.709/2018 (LGPD)
          </span>
          <a routerLink="/" class="btn-glass-pill">
            Voltar para a página inicial
          </a>
        </div>

        <article class="glass-panel-strong p-6 sm:p-10">
          <header class="border-b border-[var(--glass-outline)] pb-6">
            <h1 class="text-2xl font-bold text-ink sm:text-4xl">
              Política de Privacidade e Governança de Dados
            </h1>
            <p class="mt-3 text-sm text-muted">
              Última atualização em 15 de novembro de 2026, sob conformidade integral com a Lei Geral de Proteção de Dados Pessoais.
            </p>
          </header>

          <div class="mt-8 space-y-8 text-[0.975rem] leading-relaxed text-secondary">
            <section>
              <h2 class="text-xl font-bold text-ink">1. Controlador dos Dados</h2>
              <p class="mt-2.5">
                O tratamento dos dados pessoais eventualmente informados neste ambiente digital institucional é controlado por
                <strong class="font-semibold text-ink">THIAGO ROCHA DUARTE - CONSULTORIA E SERVICOS DE TI LTDA</strong>
                ("TRD Consultoria"), pessoa jurídica de direito privado inscrita no CNPJ sob o nº
                <strong class="metric-mono font-semibold text-ink">43.065.207/0001-57</strong>, sediada em Brasília, Distrito Federal, Brasil.
              </p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-ink">2. Dados Pessoais Coletados e Finalidade</h2>
              <p class="mt-2.5">
                A TRD Consultoria adota estritamente o princípio da <strong class="font-semibold text-ink">minimização da coleta de dados</strong> (Art. 6º, inciso III da Lei 13.709/2018). Tratamos apenas as informações voluntariamente compartilhadas pelo titular durante solicitações de atendimento técnico ou comercial:
              </p>
              <ul class="mt-3 space-y-2.5 pl-1">
                <li class="glass-subcard p-4 text-sm">
                  <strong class="font-semibold text-ink">Canais diretos (WhatsApp corporativo e e-mail):</strong>
                  nome, cargo, organização, telefone, endereço de e-mail e contexto arquitetural enviados pelo próprio usuário para agendamento de diagnóstico técnico e elaboração de propostas.
                </li>
                <li class="glass-subcard p-4 text-sm">
                  <strong class="font-semibold text-ink">Base legal aplicável:</strong>
                  execução de procedimentos preliminares relacionados a contrato do qual seja parte o titular ou a empresa que representa, mediante solicitação expressa (Art. 7º, inciso V da Lei 13.709/2018).
                </li>
              </ul>
            </section>

            <section>
              <h2 class="text-xl font-bold text-ink">3. Política de Cookies e Recursos Locais</h2>
              <p class="mt-2.5">
                Esta aplicação institucional estática <strong class="font-semibold text-ink">não utiliza cookies de rastreamento publicitário, scripts invasivos de perfilamento nem comercializa dados de navegação com terceiros</strong>.
              </p>
              <p class="mt-2 text-sm text-muted">
                Tipografia, folhas de estilo e ativos visuais são servidos diretamente a partir do próprio domínio institucional, utilizando apenas armazenamento local estritamente técnico (preferência visual entre modo claro e modo escuro).
              </p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-ink">4. Subprocessadores, Sigilo NDA e Segurança da Informação</h2>
              <p class="mt-2.5">
                Nas operações de desenvolvimento de software sob medida e sustentação de sistemas críticos, a TRD Consultoria atua sob acordos formais de confidencialidade (<em class="italic">Non-Disclosure Agreement</em>), segregação de credenciais e diretriz estrita de <strong class="font-semibold text-ink">retenção nula de dados sensíveis</strong> (<em class="italic">Zero Data Retention</em>) em ferramentas auxiliares de engenharia e telemetria.
              </p>
            </section>

            <section>
              <h2 class="text-xl font-bold text-ink">5. Direitos do Titular e Canal do Encarregado (DPO)</h2>
              <p class="mt-2.5">
                Nos termos do Art. 18 da LGPD, o titular pode solicitar a qualquer momento a confirmação da existência de tratamento, o acesso aos dados cadastrais, a correção de informações incompletas ou a eliminação de registros preliminares.
              </p>
              <div class="mt-4 rounded-2xl border border-[var(--accent-cyan-border)] bg-[var(--accent-cyan-soft)] p-5">
                <h3 class="text-base font-semibold text-ink">Canal Oficial do Encarregado pelo Tratamento de Dados</h3>
                <p class="mt-1.5 text-sm text-secondary">
                  E-mail direto:
                  <a href="mailto:contato@trdconsultoria.com.br" class="font-semibold text-[var(--accent-cyan)] hover:underline">
                    contato&#64;trdconsultoria.com.br
                  </a>
                </p>
                <p class="mt-1 text-sm text-secondary">
                  Jurisdição e sede operacional: Brasília, Distrito Federal, Brasil
                </p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class PrivacyComponent {}
