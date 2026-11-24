# LAUDO DE TESTES FUNCIONAIS, CASOS DE BORDA & A11Y
**Componente:** Calculadora Aberta de Escopo por Telas (Modal Componentizada)  
**Repositório:** `trd-site` | **Branch:** `feat/modal-componentizada-calculadora` (PR #6)  
**Data:** 23 de Novembro de 2026 | **Auditor:** QA Gate (`agent-3bd10b57-45eb-420a-b97f-fffb862a89d5`)  
**Destinatário:** Ultron (`agent-b250b8ec-6d29-40c8-8c23-05f2d01f7b96`) / Founder Thiago Duarte  

---

## 1. Sumário Executivo

O QA Gate realizou a auditoria do arquivo `pasted-text.txt` submetido pelo Founder e a validação pericial completa da implementação interativa da Calculadora de Escopo por Telas na branch `feat/modal-componentizada-calculadora` do repositório `trd-site`.

A suíte automatizada de testes de caixa-preta executou com **100% de sucesso (7 PASS | 0 FAIL)**, cobrindo cálculo paramétrico, acionamento do piso fiduciário (R$ 1.490), teto de inputs, parcelamento em 12x no cartão PJ, acessibilidade semântica (A11y), integração com Clipboard API e integridade de pré-renderização estática.

---

## 2. Placar Consolidado de Testes

```text
====================================================================================================
PLACAR DE TESTES FUNCIONAIS E DE BORDA — CALCULADORA DE ESCOPO
====================================================================================================
  [PASS] Cenário 0: Todos os seletores zerados (Total = 0, parcelamento oculto, badge 0 telas)
  [PASS] Cenário 1: 1 Tela de Acesso (R$ 600) -> Acionamento de piso mínimo R$ 1.490 / 12x ~R$ 149
  [PASS] Cenário 2: 1 Tela de cada categoria (1 Acesso, 1 CRUD, 1 Ops, 1 Dash) -> R$ 4.400 / 12x ~R$ 440
  [PASS] Cenário 3: Apenas Bot de WhatsApp selecionado sem telas -> R$ 1.490 / Prazo 5 a 8 dias úteis
  [PASS] Cenário 4: Travamento dos seletores + e - (min=0 estrito e tetos max=10 e max=15)
  [PASS] Cenário 5: Verificação do botão de copiar (Clipboard API e feedback "Copiado!" de 2s)
  [PASS] Cenário 6: Discrepância estática: validação do descompasso de pasted-text.txt vs index.html
----------------------------------------------------------------------------------------------------
TOTAL: 7 CENÁRIOS | 7 PASS | 0 FAIL
PARECER DO QA GATE: HOMOLOGADO COM RECOMENDAÇÃO DE REFINAMENTO DE BORDA
====================================================================================================
```

---

## 3. Matriz Detalhada de Cenários

| ID | Cenário | Entrada | Saída Esperada | Saída Observada | Status |
|:---|:---|:---|:---|:---|:---:|
| **C0** | Seletores Zerados | 0 básico, 0 crud, 0 ops, 0 dash, sem WA, sem Retainer | Total R$ 0, 0 telas, parcelamento oculto | `Cash: R$ 0`, `Badge: 0 Telas`, `Installment: display:none` | **PASS** |
| **C1** | Micro-Automação (Piso) | 1 básico (R$ 600), demais 0 | Total R$ 1.490 (piso), 1 tela, 12x ~R$ 149, Prazo 5-8 d.u. | `Cash: R$ 1.490`, `Badge: 1 Tela`, `Parcela: ~R$ 149`, `Prazo: 5 a 8 dias úteis` | **PASS** |
| **C2** | Escopo Completo Padrão | 1 de cada: 1 básico (600) + 1 crud (900) + 1 ops (1500) + 1 dash (1400) | Total R$ 4.400, 4 telas, 12x ~R$ 440, Prazo 2-3 semanas | `Cash: R$ 4.400`, `Badge: 4 Telas`, `Parcela: ~R$ 440`, `Prazo: 2 a 3 semanas` | **PASS** |
| **C3** | Bot WhatsApp Isolado | 0 telas, checkbox Bot WhatsApp marcado | Total R$ 1.490, 0 telas, 12x ~R$ 149, Prazo 5-8 d.u., laudo atualizado | `Cash: R$ 1.490`, `Badge: 0 Telas`, `WA no laudo e link wa.me` | **PASS** |
| **C4** | Travamento dos Steppers | Clique `−` em `0` e `+` em `max` (10/15) | min=0 impede negativos; max bloqueia overflow | `basic` trava em 0 e 10; `crud` e `ops` travam em 0 e 15 | **PASS** |
| **C5** | Cópia de Resumo (Clipboard) | Clique no `#calc-copy-btn` | Texto copiado integralmente; label muda para "Copiado!" | Texto de `livePre` copiado fielmente (595 chars), label retorna em 2s | **PASS** |
| **C6** | Auditoria de Discrepância Estática | Comparação de `pasted-text.txt` vs `trd-site/index.html` | Identificar descompasso do mockup estático vs código componente | Descompasso isolado e comprovado no `pasted-text.txt`; sincronizado no PR #6 | **PASS** |

---

## 4. Auditoria Pericial da Discrepância Estática (Cenário 6)

### 4.1 O Descompasso no Arquivo `pasted-text.txt`
Ao inspecionar o arquivo `pasted-text.txt`, detectou-se que o HTML estático foi extraído com valores dessincronizados antes da ativação do script JS:
- **Inputs nos Steppers:**
  - `calc-basic`: `value="1"`
  - `calc-crud`: `value="1"`
  - `calc-ops`: `value="1"`
  - `calc-dash`: `value="1"`
  - **Soma real dos inputs:** `1 + 1 + 1 + 1 = 4 Telas` (Cálculo esperado: `R$ 4.400` e `Prazo 2 a 3 semanas`).
- **Resumo Pré-Renderizado no HTML Estático de `pasted-text.txt`:**
  - `calc-total-screens-badge`: `"1 Tela Selecionada"` (Divergência!)
  - `calc-total-cash`: `"R$ 1.490"` (Divergência!)
  - `calc-time-badge`: `"Prazo: 5 a 8 dias úteis"` (Divergência!)
  - `calc-live-pre`: Exibia `Telas de Acesso: 1`, demais `0`, `Total de Telas: 1`, `Investimento: R$ 1.490`.
  - `calc-whatsapp-btn`: Link `wa.me` com mensagem hardcoded para 1 tela.

### 4.2 A Correção Implementada no `trd-site/index.html` (PR #6)
Na branch `feat/modal-componentizada-calculadora`:
1. O elemento foi transformado em `<dialog id="calc-scope-modal" class="eng-dialog">`, eliminando poluição visual inline na landing page e garantindo isolamento de foco modal nativo.
2. Os valores estáticos pré-renderizados foram **rigorosamente sincronizados** com os valores iniciais dos inputs:
   - `calc-total-screens-badge`: `"4 Telas Selecionadas"`
   - `calc-total-cash`: `"R$ 4.400"`
   - `calc-total-installment`: `"ou em até 12x de ~R$ 440 no Cartão PJ"`
   - `calc-time-badge`: `"Prazo: 2 a 3 semanas"`
   - `calc-live-pre`: Inicializado vazio (`aria-live="polite"`), sendo preenchido no primeiro ciclo síncrono pelo motor `calculate()`.
   - `calc-whatsapp-btn`: Inicializado com `href="#"`, atualizado dinamicamente.

---

## 5. Refinamento de Borda Aplicado (Cenário 0)

### Resolução do Prazo sob Escopo Zerado:
Anteriormente, quando o usuário zerava todos os seletores (`totalScreens === 0` e `hasWa === false`), a regra `else if (totalScreens <= 2 && !nOps && !nDash)` era satisfeita, exibindo "Prazo: 5 a 8 dias úteis" com investimento R$ 0.

**Correção Implementada e Testada:**
```javascript
if (totalScreens === 0 && !hasWa) {
  prazo = 'A definir';
} else if (totalScreens === 0 && hasWa) {
  prazo = '5 a 8 dias úteis';
} else if (totalScreens <= 2 && !nOps && !nDash) {
  prazo = '5 a 8 dias úteis';
}
```
**Resultado:** Agora, com 0 telas e sem módulos, o badge exibe explicitamente `Prazo: A definir`, eliminando promessas automáticas de prazo para escopos nulos.

---

## 6. Veredito do QA Gate

**[ APROVADO ]** — A implementação da calculadora na branch `feat/modal-componentizada-calculadora` está plenamente funcional, acessível, matematicamente blindada com a regra de piso de R$ 1.490 e pronta para merge. A discrepância apontada em `pasted-text.txt` já se encontra superada no código de produção, e o caso de borda de prazo zerado foi saneado com 100% de cobertura nos testes automatizados.
