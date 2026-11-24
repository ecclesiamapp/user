import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import { htmlReport } from './reporter.js';

// Métricas Customizadas da Catedral
const pageLatency = new Trend('catedral_pagina_latencia');
const intentionLatency = new Trend('catedral_intencao_latencia');
const successfulIntentions = new Counter('catedral_intencoes_sucesso');
const failedIntentions = new Counter('catedral_intencoes_falha');
const errorRate = new Rate('catedral_taxa_erros');

// Modo de Execução: 'smoke' (validação rápida), 'quick' (100 VUs) ou 'full' (5.000 VUs)
const TEST_MODE = __ENV.TEST_MODE || 'smoke';
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

function getStages() {
  if (TEST_MODE === 'smoke') {
    return [
      { duration: '5s', target: 10 },
      { duration: '10s', target: 10 },
      { duration: '5s', target: 0 },
    ];
  }
  if (TEST_MODE === 'quick') {
    return [
      { duration: '10s', target: 50 },
      { duration: '20s', target: 100 },
      { duration: '10s', target: 0 },
    ];
  }
  if (TEST_MODE === 'peak500') {
    return [
      { duration: '10s', target: 150 },
      { duration: '15s', target: 500 },
      { duration: '20s', target: 500 },
      { duration: '10s', target: 0 },
    ];
  }
  // Modo Completo: Rampa de Natal (5.000 Fiéis Simultâneos)
  return [
    { duration: '30s', target: 500 },    // Chegada inicial dos fiéis
    { duration: '1m', target: 2000 },    // Concentração 30 min antes da missa
    { duration: '1m30s', target: 5000 }, // Pico da Missa do Galo / Natal
    { duration: '2m', target: 5000 },    // Sustentação do pico
    { duration: '1m', target: 1000 },    // Saída pós-celebração
    { duration: '30s', target: 0 },      // Descompressão
  ];
}

export const options = {
  stages: getStages(),
  thresholds: {
    // 95% das páginas devem responder em menos de 800ms
    http_req_duration: ['p(95)<800'],
    // Taxa de erros HTTP (5xx, 4xx) menor que 2% sob carga de pico
    http_req_failed: ['rate<0.02'],
    // Taxa customizada de erro
    catedral_taxa_erros: ['rate<0.02'],
  },
};

export default function () {
  // IP simulado único para o usuário virtual (evita colisão de rate-limiting em testes)
  const simulatedIp = `10.20.${(__VU % 240) + 1}.${(__ITER % 240) + 1}`;
  const commonHeaders = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) EcclesiamApp-LoadTest/1.0',
    'X-Forwarded-For': simulatedIp,
    'X-Real-IP': simulatedIp,
  };

  // 1. Jornada Maioritária (90% dos Fiéis): Leitura Pastoral & Consulta de Horários
  group('1. Navegação Pastoral (Fiel Consulta Horários e Leituras)', () => {
    // 1.1 Home da Catedral
    const resHome = http.get(`${BASE_URL}/`, { headers: commonHeaders });
    pageLatency.add(resHome.timings.duration);
    const homeOk = check(resHome, {
      'Home respondeu 200': (r) => r.status === 200,
      'Home contém Catedral ou Sagrado Coração': (r) =>
        r.body ? (r.body.includes('Catedral') || r.body.includes('Sagrado Coração') || r.body.includes('Ecclesiam')) : false,
    });
    errorRate.add(!homeOk);

    sleep(Math.random() * 1.5 + 0.5); // Simula leitura do fiel (0.5s a 2s)

    // 1.2 Agenda Litúrgica & Horários de Missas
    const resHorarios = http.get(`${BASE_URL}/agenda-liturgica`, { headers: commonHeaders });
    pageLatency.add(resHorarios.timings.duration);
    const horariosOk = check(resHorarios, {
      'Agenda Litúrgica respondeu 200 ou 307': (r) => r.status === 200 || r.status === 307,
    });
    errorRate.add(!horariosOk);

    // 1.3 Liturgia Diária Oficial (API com cache)
    const resLiturgia = http.get(`${BASE_URL}/api/liturgia`, { headers: commonHeaders });
    pageLatency.add(resLiturgia.timings.duration);
    check(resLiturgia, {
      'API Liturgia respondeu 200': (r) => r.status === 200,
    });

    // 1.4 Diretório das 12 Comunidades (CEBs) + Mensagens Pastorais (ISR 60s)
    const secondaryRoute = __VU % 2 === 0 ? '/comunidades' : '/mensagens';
    const resSecondary = http.get(`${BASE_URL}${secondaryRoute}`, { headers: commonHeaders });
    pageLatency.add(resSecondary.timings.duration);
    const secondaryOk = check(resSecondary, {
      'Página secundária ISR respondeu 200': (r) => r.status === 200,
    });
    errorRate.add(!secondaryOk);

    sleep(Math.random() * 1.2 + 0.5);
  });

  // 2. Ação Concorrente (10% dos Fiéis): Submissão de Intenção de Missa de Natal
  // Simula fiéis enviando pedidos de oração pelo Púlpito com a tag [CARGA-NATAL]
  if (Math.random() < 0.10 || TEST_MODE === 'smoke') {
    group('2. Submissão Concorrente de Intenção de Missa [CARGA-NATAL]', () => {
      const idempotencyKey = `k6-natal-vu${__VU}-iter${__ITER}-${Date.now()}`;
      
      // Telefone e IP únicos por fiel virtual para simular paroquianos distintos
      const uniquePhone = `2798${String(1000000 + (__VU * 100) + __ITER).substring(0, 7)}`;
      
      const payload = JSON.stringify({
        parish_id: 'c0000000-0000-0000-0000-000000000001',
        celebration_date: '2026-12-25',
        celebration_time: '19:00',
        entries: [
          {
            type: 'falecimento',
            names: [`[CARGA-NATAL] Alma Fiel VU-${__VU}`],
          },
        ],
        offered_by: `[CARGA-NATAL] Paroquiano Teste VU-${__VU}`,
        contact_phone: uniquePhone,
        is_anonymous: false,
        notes: `[CARGA-NATAL] Teste de Carga de Natal - VU ${__VU} Iter ${__ITER}`,
        idempotency_key: idempotencyKey,
      });

      const postHeaders = Object.assign({}, commonHeaders, {
        'Content-Type': 'application/json',
      });

      const resIntention = http.post(`${BASE_URL}/api/secretaria/intentions`, payload, {
        headers: postHeaders,
      });

      intentionLatency.add(resIntention.timings.duration);

      const intentionOk = check(resIntention, {
        'Intenção processada com status aceitável (200, 201 ou 429 rate-limit)': (r) =>
          r.status === 200 || r.status === 201 || r.status === 429,
      });

      if (resIntention.status === 200 || resIntention.status === 201) {
        successfulIntentions.add(1);
      } else if (resIntention.status >= 500) {
        failedIntentions.add(1);
        errorRate.add(1);
      }
    });
  }

  sleep(Math.random() * 2 + 1);
}

// Geração Automática do Relatório Visual HTML Interativo
export function handleSummary(data) {
  const reportPath = 'tests/load/load-test-report.html';
  return {
    [reportPath]: htmlReport(data, {
      title: 'Ecclesiam App • Relatório de Teste de Carga & Estresse de Natal',
    }),
    stdout: `\n=======================================================\n` +
      `✝ ECCLESIAM APP • TESTE DE CARGA DE NATAL CONCLUÍDO\n` +
      `=======================================================\n` +
      `✓ Relatório HTML gerado em: ${reportPath}\n` +
      `✓ Requisições Totais: ${data.metrics.http_reqs ? data.metrics.http_reqs.values.count : 'N/A'}\n` +
      `✓ Latência Média: ${data.metrics.http_req_duration ? Math.round(data.metrics.http_req_duration.values.avg) + 'ms' : 'N/A'}\n` +
      `✓ Latência p95: ${data.metrics.http_req_duration ? Math.round(data.metrics.http_req_duration.values['p(95)']) + 'ms' : 'N/A'}\n` +
      `✓ Taxa de Falhas: ${data.metrics.http_req_failed ? (data.metrics.http_req_failed.values.rate * 100).toFixed(2) + '%' : '0%'}\n` +
      `=======================================================\n`,
  };
}
