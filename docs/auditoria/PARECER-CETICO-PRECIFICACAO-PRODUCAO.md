# PARECER PERICIAL ADVERSARIAL — GOVERNANÇA, PRECIFICAÇÃO E BLINDAGEM OPERACIONAL
**TRD Consultoria e Serviços de TI LTDA**  
**Data:** 23 de Novembro de 2026  
**Auditor:** O Cético (`agent-ecd3a4ae-78ce-4fba-bcc5-a247d711c996`) — Revisor Crítico & Veto Implacável  
**Destinatário:** Ultron (`agent-b250b8ec-6d29-40c8-8c23-05f2d01f7b96`) / Founder Thiago Duarte  
**Objeto:** Nova Estrutura de Precificação por Telas e Funcionalidades em Produção (`https://trdconsultoria.com.br/`)

---

## 1. Veredito Pericial Binário

### **[ APROVADO COM RESSALVAS OPERACIONAIS & ADITIVOS OBRIGATÓRIOS ]**

A nova estrutura de precificação resolve com maestria a principal objeção de vendas de PMEs (atrito de entrada alto e medo de lock-in de SaaS), criando uma esteira comercial lógica de ascensão (*tripwire* -> *core offer* -> *upsell*). 

Entretanto, sob a ótica estrita de **Defesa do Conforto Operacional e Blindagem Jurídica do Founder Thiago Duarte**, a entrada de **R$ 1.490 (ou 12x de ~R$ 150)** e o plano de sustentação de **R$ 490/mês** expõem a consultoria a vetores severos de **Scope Creep**, **Contradição de SLA**, **Custos Ocultos de Infraestrutura** e **Fricção de Expectativa** se não forem amparados por salvaguardas contratuais automáticas e ajustes cirúrgicos no site.

---

## 2. Auditoria Detalhada por Eixo de Risco

### Eixo 1: A Trava de Escopo da Micro-Automação (R$ 1.490)
* **O Risco Identificado:** O cliente de R$ 1.490 é, estatisticamente, o perfil mais ansioso e desestruturado (MEI/Autônomo/Pequeno Comerciante). Ele tende a achar que "1 a 2 telas ou bot de WhatsApp" inclui catálogo completo de e-commerce, gateway de pagamento, emissão automática de NF-e e inteligência artificial generativa.
* **Hermeticidade Contratual:** O `CONTRATO_DESENVOLVIMENTO_SOFTWARE_SOB_MEDIDA.md` possui cláusula anti-scope creep (Item 1.3), mas a modalidade de R$ 1.490 **não está explicitamente descrita no Anexo I**.
* **Aditivo Mandatório 1 (Definição Estrita do Escopo de R$ 1.490):**
  - **Se Tela Web:** Máximo de 2 telas (ex: 1 tela de formulário/captura externa + 1 painel Kanban/tabela de visualização com login básico). Sem multi-níveis de permissão complexos.
  - **Se Bot de WhatsApp:** 1 fluxo conversacional linear de até 5 etapas lógicas com disparo de webhook/e-mail para notificação. Não inclui treinamento de LLM próprio nem fluxos infinitos de atendimento em árvore profunda.
  - Proibição terminante de desenvolvimento sem preenchimento prévio do *Briefing Fechado de Entrada*.

### Eixo 2: Viabilidade Operacional do Prazo (5 a 8 Dias Úteis)
* **O Risco Identificado:** Prazo de 5 a 8 dias úteis é viável para a esteira TRD acelerada por IA/OpenBot, **desde que o cliente não atrase o envio de credenciais e materiais**. No modelo tradicional, o cliente leva 10 dias para enviar o logotipo, a chave do WhatsApp ou a lista de produtos, e depois cobra a entrega alegando "está demorando".
* **Aditivo Mandatório 2 (Gatilho de Contagem de Prazo):**
  - O prazo de 5 a 8 dias úteis inicia-se **estritamente no primeiro dia útil subsequente à entrega cumulativa de:**
    1. Compensação do pagamento (ou aprovação no cartão);
    2. Envio de todos os acessos/credenciais exigidos (Meta Cloud API, domínio, etc.);
    3. Validação formal do fluxo no briefing inicial.
  - Se o cliente demorar mais de 3 dias úteis para homologar ou responder dúvidas, o prazo congela automaticamente.

### Eixo 3: Sustentabilidade Financeira & Custos Ocultos de Nuvem
* **O Risco Identificado:** Margem líquida de R$ 1.490 (ou R$ 123 líquidos/mês no parcelamento da máquina) é corroída a zero se a TRD absorver qualquer custo de infraestrutura (Neon PostgreSQL, Supabase, Render, Vercel ou Z-API / WhatsApp Business API oficial).
* **Hermeticidade Contratual:** A Cláusula Quarta do contrato TRD é impecável ao atribuir 100% dos custos de nuvem e APIs à Contratante.
* **Salvaguarda Operacional no Site & Proposta:**
  - O site deve manter o aviso de que servidores e APIs de terceiros rodam no faturamento da Contratante (ex: tier gratuito do Supabase/Neon/Vercel ou contratação direta de R$ 30 a R$ 60/mês pelo cliente). A TRD jamais deve cadastrar cartão de crédito próprio para sustentar banco de cliente de R$ 1.490.

### Eixo 4: Sustentação de R$ 490/mês vs. Matriz de SLA de Missão Crítica
* **O Risco Identificado (CRÍTICO - DESALINHAMENTO EM PRODUÇÃO):**
  - O site apresenta a sustentação a partir de **R$ 490/mês** no banner de precificação aberta (linha 374 e 858 do `index.html`), mas os planos formais da tabela de SLA começam no **Plano Essencial de R$ 3.200/mês (20h)**.
  - Se um cliente de R$ 490/mês exigir atendimento com base na tabela pública de SLA (P1 em até 2h ou 4h úteis), a TRD terá um passivo operacional absurdo: Thiago sendo interrompido para atender chamado de R$ 490/mês com SLA corporativo de banco fiduciário!
* **Aditivo Mandatório 3 (Enquadramento Exclusivo da Sustentação de R$ 490/mês):**
  - O plano de **R$ 490/mês é estritamente um "Retainer Preventivo / Standby"**:
    - Contempla: **3 horas técnicas mensais** (ou monitoramento de integridade e backup + 2h de ajustes).
    - SLA: **P3 / P4 apenas** (Primeira resposta em até **24h úteis**; intervenção em até 48h úteis).
    - **Zero cobertura de plantão P1/P2 imediato** (emergências P1 são cobradas à parte no valor avulso de R$ 180/h ou exigem contratação dos Planos Essencial/Profissional de R$ 3.200 a R$ 5.500/mês).

### Eixo 5: Inconsistência de Código Residual no Simulador do Site
* **Achado Técnico no Código:**
  - O arquivo `index.html` (linhas 1277 e 1860) ainda mantém o cálculo em JavaScript com o valor antigo de `Classe Starter (R$ 9.800)` e `Classe Hub Pro (R$ 16.500)`.
  - Quando o usuário simula "Criação Ágil" no modal de engenharia, o simulador projeta **R$ 9.800**, enquanto os cards de preços na página anunciam **Starter por R$ 4.800** e **Micro-Automação por R$ 1.490**.
  - **Ação Imediata:** Sincronizar o JavaScript do simulador de escopo (`calculateScope`) com a nova tabela comercial (Starter R$ 4.800, Pro R$ 8.900, Plataforma R$ 16.500).

---

## 3. Matriz de Salvaguardas Contratuais para o Pacote de R$ 1.490

Para que o pacote de R$ 1.490 seja um acelerador de caixa sem atrito com o Founder, toda contratação deve ser instrumentalizada com o seguinte **Termo de Escopo Anexo**:

1. **Objeto Restrito:** 1 a 2 telas estáticas/ágeis com integração via API ou 1 automação de mensagens de WhatsApp com até 5 nós de interação.
2. **Homologação Expressa:** O cliente tem 3 (três) dias úteis para homologar. Transcorrido o prazo sem apontamento formal, dá-se o aceite tácito irrevogável.
3. **Canal Assíncrono Estrito:** Atendimento 100% via texto/chamados. Proibidas reuniões síncronas semanais de alinhamento para projetos de R$ 1.490 (reuniões síncronas consom o valor do projeto em 2 horas de conversa).
4. **Sem Plantão:** Suporte dentro da garantia de 30 dias restrito a dias úteis em horário comercial (09h às 18h).
5. **Damage Cap Estrito:** Limitação indenizatória cravada em 100% do valor do contrato (R$ 1.490), com expressa renúncia a lucros cessantes.

---

## 4. Conclusão Executiva

A estratégia comercial é **altamente recomendada** para geração imediata de pipeline e quebra da inércia de contratação. O pacote de R$ 1.490 é a porta de entrada perfeita para faturar rapidamente e construir o relacionamento que deságua na contratação da sustentação ou de módulos maiores.

Com a aplicação imediata do alinhamento do simulador JS e a blindagem contratual do escopo, o Founder Thiago Duarte mantém 100% de sua proteção operacional, saúde de rotina e segurança jurídica.
