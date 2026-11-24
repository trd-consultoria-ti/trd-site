/**
 * TRD Consultoria - Bateria de Caos e Fuzzing Adversarial da Calculadora de Escopo
 * Executor: Chaos Hunter & Cético
 */

const PRICES = {
  basic: 600,
  crud: 900,
  ops: 1500,
  dash: 1400,
  whatsapp: 1490
};

function runCalculator(inputs) {
  const nBasic = Math.max(0, parseInt(inputs.basic, 10) || 0);
  const nCrud = Math.max(0, parseInt(inputs.crud, 10) || 0);
  const nOps = Math.max(0, parseInt(inputs.ops, 10) || 0);
  const nDash = Math.max(0, parseInt(inputs.dash, 10) || 0);
  const hasWa = !!inputs.whatsapp;
  const hasSupport = !!inputs.support;

  const totalScreens = nBasic + nCrud + nOps + nDash;

  let total = (nBasic * PRICES.basic) +
              (nCrud * PRICES.crud) +
              (nOps * PRICES.ops) +
              (nDash * PRICES.dash);

  if (hasWa) {
    total += PRICES.whatsapp;
  }

  // Piso técnico
  if (total < 1490 && totalScreens > 0) {
    total = 1490;
  } else if (totalScreens === 0 && !hasWa) {
    total = 0;
  }

  // Estimativa de prazo
  let prazo = '2 a 3 semanas';
  if (totalScreens === 0 && hasWa) {
    prazo = '5 a 8 dias úteis';
  } else if (totalScreens <= 2 && !nOps && !nDash) {
    prazo = '5 a 8 dias úteis';
  } else if (totalScreens <= 4) {
    prazo = '2 a 3 semanas';
  } else if (totalScreens <= 8) {
    prazo = '3 a 4 semanas';
  } else if (totalScreens > 8) {
    prazo = '4 a 6 semanas';
  }

  const parcela = Math.round(total / 10);

  return {
    totalScreens,
    total,
    prazo,
    parcela,
    hasWa,
    hasSupport
  };
}

// Bateria de Testes Destrutivos
const tests = [
  {
    name: 'TC-01: Estado Tripwire Mínimo (1 tela básica)',
    input: { basic: 1, crud: 0, ops: 0, dash: 0, whatsapp: false, support: false },
    expected: { totalScreens: 1, total: 1490, prazo: '5 a 8 dias úteis', parcela: 149 }
  },
  {
    name: 'TC-02: Tripwire de 2 telas básicas (Piso R$ 1.490)',
    input: { basic: 2, crud: 0, ops: 0, dash: 0, whatsapp: false, support: false },
    expected: { totalScreens: 2, total: 1490, prazo: '5 a 8 dias úteis', parcela: 149 }
  },
  {
    name: 'TC-03: 1 Tela CRUD (Piso R$ 1.490 acionado: 900 -> 1490)',
    input: { basic: 0, crud: 1, ops: 0, dash: 0, whatsapp: false, support: false },
    expected: { totalScreens: 1, total: 1490, prazo: '5 a 8 dias úteis', parcela: 149 }
  },
  {
    name: 'TC-04: 1 Tela Operacional (R$ 1.500 > 1490)',
    input: { basic: 0, crud: 0, ops: 1, dash: 0, whatsapp: false, support: false },
    expected: { totalScreens: 1, total: 1500, prazo: '2 a 3 semanas', parcela: 150 }
  },
  {
    name: 'TC-05: 1 Dashboard Gerencial (Piso mantido: 1400 -> 1490)',
    input: { basic: 0, crud: 0, ops: 0, dash: 1, whatsapp: false, support: false },
    expected: { totalScreens: 1, total: 1490, prazo: '2 a 3 semanas', parcela: 149 }
  },
  {
    name: 'TC-06: 0 Telas + Bot WhatsApp isolado (Tripwire R$ 1.490)',
    input: { basic: 0, crud: 0, ops: 0, dash: 0, whatsapp: true, support: false },
    expected: { totalScreens: 0, total: 1490, prazo: '5 a 8 dias úteis', parcela: 149 }
  },
  {
    name: 'TC-07: 0 Telas e sem extras (Zero fiduciário)',
    input: { basic: 0, crud: 0, ops: 0, dash: 0, whatsapp: false, support: false },
    expected: { totalScreens: 0, total: 0, prazo: '5 a 8 dias úteis', parcela: 0 }
  },
  {
    name: 'TC-08: Fuzzing - Valores Negativos (injeção direta)',
    input: { basic: -10, crud: -5, ops: -99, dash: -1, whatsapp: false, support: false },
    expected: { totalScreens: 0, total: 0, parcela: 0 }
  },
  {
    name: 'TC-09: Fuzzing - Payload Malformado / NaN / Injeção de String',
    input: { basic: 'abc', crud: null, ops: undefined, dash: {}, whatsapp: false, support: false },
    expected: { totalScreens: 0, total: 0, parcela: 0 }
  },
  {
    name: 'TC-10: Fuzzing - Float / Centavos fracionados (Zero Float)',
    input: { basic: '1.99', crud: '2.5', ops: '0.1', dash: '3.7', whatsapp: false, support: false },
    // parseInt trunca para inteiros: basic=1, crud=2, ops=0, dash=3 -> totalScreens = 6
    // total = (1*600) + (2*900) + (0*1500) + (3*1400) = 600 + 1800 + 0 + 4200 = 6600
    expected: { totalScreens: 6, total: 6600, prazo: '3 a 4 semanas', parcela: 660 }
  },
  {
    name: 'TC-11: Carga Máxima dos Seletores (10 basic + 15 crud + 15 ops + 10 dash + WhatsApp)',
    input: { basic: 10, crud: 15, ops: 15, dash: 10, whatsapp: true, support: true },
    // basic: 10*600 = 6.000
    // crud: 15*900 = 13.500
    // ops: 15*1500 = 22.500
    // dash: 10*1400 = 14.000
    // wa: 1.490
    // Total = 57.490 | 50 telas
    expected: { totalScreens: 50, total: 57490, prazo: '4 a 6 semanas', parcela: 5749 }
  },
  {
    name: 'TC-12: Composição 4 telas padrão do pasted-text (1 de cada)',
    input: { basic: 1, crud: 1, ops: 1, dash: 1, whatsapp: false, support: false },
    // 600 + 900 + 1500 + 1400 = 4400
    expected: { totalScreens: 4, total: 4400, prazo: '2 a 3 semanas', parcela: 440 }
  }
];

let failed = 0;
console.log('=== TRD CHAOS HUNTER & CÉTICO: EXECUÇÃO DE TESTES DE ESTRESSE ===\n');

tests.forEach((tc, idx) => {
  const res = runCalculator(tc.input);
  let pass = true;
  for (const key of Object.keys(tc.expected)) {
    if (res[key] !== tc.expected[key]) {
      pass = false;
      console.error(`[FAIL] ${tc.name}: Campo '${key}' esperado=${tc.expected[key]}, obtido=${res[key]}`);
    }
  }
  if (pass) {
    console.log(`[PASS] ${tc.name} -> Telas: ${res.totalScreens} | Total: R$ ${res.total} | Prazo: ${res.prazo} | 12x: ~R$ ${res.parcela}`);
  } else {
    failed++;
  }
});

console.log(`\nResultado da Bateria de Caos: ${tests.length - failed}/${tests.length} PASS | ${failed} FAIL`);
if (failed > 0) process.exit(1);
