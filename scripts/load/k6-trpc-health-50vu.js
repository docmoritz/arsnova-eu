/**
 * k6: 50 virtuelle Nutzer, 30 s, wiederholter tRPC-GET `health.stats`.
 *
 * Installation: https://k6.io/docs/get-started/installation/
 *
 *   BASE_URL=http://127.0.0.1:3000 k6 run scripts/load/k6-trpc-health-50vu.js
 *   npm run load:k6:health
 *
 * Docker (Linux/WSL2):
 *   docker run --rm -i --network host -e BASE_URL=http://127.0.0.1:3000 \
 *     grafana/k6 run - <scripts/load/k6-trpc-health-50vu.js
 *
 * Docker (macOS — ohne --network host, sonst 100 % HTTP-Fehler):
 *   docker run --rm -i -e BASE_URL=http://host.docker.internal:3000 \
 *     grafana/k6 run - <scripts/load/k6-trpc-health-50vu.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const INPUT = encodeURIComponent(JSON.stringify({ 0: { json: null } }));

export const options = {
  vus: 50,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const base = __ENV.BASE_URL || 'http://127.0.0.1:3000';
  const url = `${base.replace(/\/$/, '')}/trpc/health.stats?batch=1&input=${INPUT}`;
  const res = http.get(url);
  check(res, {
    'status 200': (r) => r.status === 200,
    'json body': (r) => r.body && r.body.includes('activeSessions'),
  });
  sleep(0.2 + Math.random() * 0.35);
}
