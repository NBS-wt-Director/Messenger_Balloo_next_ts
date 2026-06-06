/**
 * Load Testing Script - k6
 * Нагрузочное тестирование API Balloo
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom метрика
const errorRate = new Rate('errors');

// Конфигурация
export const options = {
  // Простой тест (dev)
  stages: [
    { duration: '30s', target: 100 },   // Ramp-up до 100 пользователей
    { duration: '1m', target: 100 },    // Стабилизация на 100
    { duration: '30s', target: 200 },   // Ramp-up до 200
    { duration: '1m', target: 200 },    // Стабилизация на 200
    { duration: '30s', target: 0 },     // Ramp-down
  ],
  
  // Production тест (раскомментируйте для продакшена)
  /*
  stages: [
    { duration: '1m', target: 500 },
    { duration: '5m', target: 500 },
    { duration: '1m', target: 1000 },
    { duration: '5m', target: 1000 },
    { duration: '1m', target: 0 },
  ],
  */
  
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% запросов < 500ms
    http_req_failed: ['rate<0.01'],                 // Ошибки < 1%
    errors: ['rate<0.1'],                           // Кастомные ошибки < 10%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3001';

// ============================================
// AUTH
// ============================================

function login() {
  const res = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify({
    email: 'test@balloo.ru',
    password: 'TestPassword123!',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const data = JSON.parse(res.body);
  return data.data?.accessToken;
}

// ============================================
// TESTS
// ============================================

export default function () {
  // 1. Health check
  let res = http.get(`${BASE_URL}/health`);
  check(res, {
    'health is ok': (r) => r.status === 200,
    'health response time < 100ms': (r) => r.timings.duration < 100,
  });
  errorRate.add(res.status !== 200);
  
  sleep(0.5);
  
  // 2. Login
  const token = login();
  check(token, {
    'token received': (t) => t !== undefined && t !== null,
  });
  errorRate.add(!token);
  
  if (!token) return;
  
  sleep(0.5);
  
  // 3. Get current user
  res = http.get(`${BASE_URL}/api/v1/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  check(res, {
    'get me is ok': (r) => r.status === 200,
    'get me response time < 200ms': (r) => r.timings.duration < 200,
  });
  errorRate.add(res.status !== 200);
  
  sleep(0.5);
  
  // 4. Get chats
  res = http.get(`${BASE_URL}/api/v1/chats`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  check(res, {
    'get chats is ok': (r) => r.status === 200,
    'get chats response time < 300ms': (r) => r.timings.duration < 300,
  });
  errorRate.add(res.status !== 200);
  
  sleep(0.5);
  
  // 5. Create chat (с задержкой чтобы не спамить)
  if (Math.random() < 0.1) { // 10% запросов
    res = http.post(`${BASE_URL}/api/v1/chats`, JSON.stringify({
      participants: ['test-user-id'],
      name: `Load Test Chat ${Date.now()}`,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    check(res, {
      'create chat is ok': (r) => r.status === 201 || r.status === 400, // 400 ок если уже есть
      'create chat response time < 500ms': (r) => r.timings.duration < 500,
    });
    errorRate.add(res.status !== 201 && res.status !== 400);
  }
  
  sleep(1);
  
  // 6. Send message
  res = http.post(`${BASE_URL}/api/v1/chats/test-chat-id/messages`, JSON.stringify({
    content: 'Load test message',
    type: 'text',
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  check(res, {
    'send message is ok': (r) => r.status === 201 || r.status === 404, // 404 ок если чат не существует
    'send message response time < 400ms': (r) => r.timings.duration < 400,
  });
  errorRate.add(res.status !== 201 && res.status !== 404);
  
  sleep(1);
}

// ============================================
// HANDLER
// ============================================

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const { indent = '', enableColors = false } = options;
  
  return `
${indent}Load Test Summary
${indent}==================
${indent}Metrics:
${indent}  - http_reqs: ${data.metrics.http_reqs.values.count}
${indent}  - http_req_duration p(95): ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
${indent}  - http_req_duration p(99): ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms
${indent}  - http_req_failed: ${data.metrics.http_req_failed.values.rate * 100}%
${indent}  - errors: ${data.metrics.errors ? data.metrics.errors.values.rate * 100 : 0}%
${indent}  - duration: ${data.state.testRunDurationMs / 1000}s
`;
}
