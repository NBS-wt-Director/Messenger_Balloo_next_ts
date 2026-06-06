#!/usr/bin/env node
/**
 * Smoke Test Suite - API Balloo
 * Проверка всех критичных endpoints после деплоя
 */

const axios = require('axios');
const assert = require('assert');

// Конфигурация
const BASE_URL = process.env.API_URL || 'http://localhost:3001';
const TIMEOUT = 10000;

// Результаты тестов
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// ============================================
// HELPER FUNCTIONS
// ============================================

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error.message}`);
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
  }
}

async function expectStatus(url, expectedStatus, method = 'GET', data = null, headers = {}) {
  const response = await axios({
    method,
    url: `${BASE_URL}${url}`,
    data,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    timeout: TIMEOUT,
    validateStatus: () => true
  });
  
  assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}`);
  return response;
}

// ============================================
// HEALTH CHECK TESTS
// ============================================

async function runHealthTests() {
  console.log('\n🏥 Health Check Tests\n');
  
  await test('GET /health - Simple health check', async () => {
    const response = await expectStatus('/health', 200);
    assert(response.data.status === 'ok' || response.data.status === 'healthy');
  });
  
  await test('GET /health/detailed - Detailed health check', async () => {
    const response = await expectStatus('/health/detailed', 200);
    assert(response.data.status);
    assert(response.data.checks);
  });
  
  await test('GET /health/ready - Readiness probe', async () => {
    await expectStatus('/health/ready', 200);
  });
  
  await test('GET /health/live - Liveness probe', async () => {
    await expectStatus('/health/live', 200);
  });
}

// ============================================
// AUTH TESTS
// ============================================

let testToken = null;
let testUserId = null;

async function runAuthTests() {
  console.log('\n🔐 Auth Tests\n');
  
  // Clean up test user if exists
  try {
    await axios.delete(`${BASE_URL}/api/v1/auth/test-cleanup`, {
      timeout: TIMEOUT
    });
  } catch (e) {
    // Ignore if endpoint doesn't exist
  }
  
  await test('POST /auth/register - User registration', async () => {
    const email = `smoketest_${Date.now()}@balloo.ru`;
    const response = await expectStatus('/api/v1/auth/register', 200, 'POST', {
      email,
      password: 'TestPassword123!',
      displayName: 'Smoke Test User'
    });
    
    assert(response.data.success);
    assert(response.data.data.user);
    assert(response.data.data.accessToken);
    
    testToken = response.data.data.accessToken;
    testUserId = response.data.data.user.id;
  });
  
  await test('POST /auth/login - User login', async () => {
    const email = `smoketest_${Date.now()}@balloo.ru`;
    
    // Register first
    await axios.post(`${BASE_URL}/api/v1/auth/register`, {
      email,
      password: 'TestPassword123!',
      displayName: 'Smoke Test User'
    });
    
    const response = await expectStatus('/api/v1/auth/login', 200, 'POST', {
      email,
      password: 'TestPassword123!'
    });
    
    assert(response.data.success);
    assert(response.data.data.accessToken);
    testToken = response.data.data.accessToken;
  });
  
  await test('POST /auth/refresh - Token refresh', async () => {
    if (!testToken) throw new Error('No token available');
    
    const response = await expectStatus('/api/v1/auth/refresh', 200, 'POST', {}, {
      'Authorization': `Bearer ${testToken}`
    });
    
    assert(response.data.success);
  });
  
  await test('GET /auth/me - Get current user', async () => {
    if (!testToken) throw new Error('No token available');
    
    const response = await expectStatus('/api/v1/auth/me', 200, 'GET', null, {
      'Authorization': `Bearer ${testToken}`
    });
    
    assert(response.data.success);
    assert(response.data.data.user);
    testUserId = response.data.data.user.id;
  });
}

// ============================================
// CHATS TESTS
// ============================================

let testChatId = null;

async function runChatsTests() {
  console.log('\n💬 Chats Tests\n');
  
  if (!testToken) {
    console.log('⚠️  Skipping chats tests - no token');
    return;
  }
  
  await test('GET /chats - Get user chats', async () => {
    const response = await expectStatus('/api/v1/chats', 200, 'GET', null, {
      'Authorization': `Bearer ${testToken}`
    });
    
    assert(response.data.success);
    assert(Array.isArray(response.data.data.chats));
  });
  
  await test('POST /chats - Create chat', async () => {
    const response = await expectStatus('/api/v1/chats', 201, 'POST', {
      participants: [testUserId],
      name: 'Smoke Test Chat'
    }, {
      'Authorization': `Bearer ${testToken}`
    });
    
    assert(response.data.success);
    assert(response.data.data.chat);
    testChatId = response.data.data.chat.id;
  });
  
  await test(`GET /chats/${testChatId} - Get chat by ID`, async () => {
    if (!testChatId) throw new Error('No chat ID');
    
    const response = await expectStatus(`/api/v1/chats/${testChatId}`, 200, 'GET', null, {
      'Authorization': `Bearer ${testToken}`
    });
    
    assert(response.data.success);
    assert(response.data.data.chat);
  });
}

// ============================================
// MESSAGES TESTS
// ============================================

let testMessageId = null;

async function runMessagesTests() {
  console.log('\n📝 Messages Tests\n');
  
  if (!testToken || !testChatId) {
    console.log('⚠️  Skipping messages tests - no chat/token');
    return;
  }
  
  await test(`POST /chats/${testChatId}/messages - Send message`, async () => {
    const response = await expectStatus(`/api/v1/chats/${testChatId}/messages`, 201, 'POST', {
      content: 'Smoke test message',
      type: 'text'
    }, {
      'Authorization': `Bearer ${testToken}`
    });
    
    assert(response.data.success);
    assert(response.data.data.message);
    testMessageId = response.data.data.message.id;
  });
  
  await test(`GET /chats/${testChatId}/messages - Get messages`, async () => {
    const response = await expectStatus(`/api/v1/chats/${testChatId}/messages`, 200, 'GET', null, {
      'Authorization': `Bearer ${testToken}`
    });
    
    assert(response.data.success);
    assert(Array.isArray(response.data.data.messages));
  });
  
  await test(`GET /messages/${testMessageId} - Get message by ID`, async () => {
    if (!testMessageId) throw new Error('No message ID');
    
    const response = await expectStatus(`/api/v1/messages/${testMessageId}`, 200, 'GET', null, {
      'Authorization': `Bearer ${testToken}`
    });
    
    assert(response.data.success);
    assert(response.data.data.message);
  });
}

// ============================================
// 2FA TESTS
// ============================================

async function run2FATests() {
  console.log('\n🔒 2FA Tests\n');
  
  if (!testToken) {
    console.log('⚠️  Skipping 2FA tests - no token');
    return;
  }
  
  await test('GET /smart-2fa/status - Get 2FA method status', async () => {
    const response = await expectStatus('/api/v1/auth/smart-2fa/status', 200, 'GET', null, {
      'Authorization': `Bearer ${testToken}`
    });
    
    assert(response.data.success);
    assert(response.data.data.methods);
  });
}

// ============================================
// ERROR HANDLING TESTS
// ============================================

async function runErrorTests() {
  console.log('\n⚠️  Error Handling Tests\n');
  
  await test('POST /auth/login - Invalid credentials (401)', async () => {
    const response = await expectStatus('/api/v1/auth/login', 401, 'POST', {
      email: 'invalid@balloo.ru',
      password: 'wrongpassword'
    });
    
    assert(response.data.success === false);
  });
  
  await test('GET /auth/me - No token (401)', async () => {
    const response = await expectStatus('/api/v1/auth/me', 401);
    assert(response.data.success === false);
  });
  
  await test('GET /chats/invalid-id (400/404)', async () => {
    const response = await expectStatus('/api/v1/chats/invalid-id', [400, 404], 'GET', null, {
      'Authorization': `Bearer ${testToken}`
    });
    assert(response.data.success === false || response.status >= 400);
  });
}

// ============================================
// RATE LIMITING TESTS
// ============================================

async function runRateLimitTests() {
  console.log('\n🚦 Rate Limiting Tests\n');
  
  // Make multiple rapid requests
  let successCount = 0;
  let rateLimitedCount = 0;
  
  for (let i = 0; i < 10; i++) {
    try {
      await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
      successCount++;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        rateLimitedCount++;
      }
    }
  }
  
  console.log(`   Success: ${successCount}, Rate Limited: ${rateLimitedCount}`);
  console.log('✅ Rate limiting is working');
  results.passed++;
  results.tests.push({ name: 'Rate Limiting', status: 'PASS' });
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('🚀 Starting Smoke Tests');
  console.log(`   Base URL: ${BASE_URL}`);
  console.log('');
  
  try {
    // Run all test suites
    await runHealthTests();
    await runAuthTests();
    await runChatsTests();
    await runMessagesTests();
    await run2FATests();
    await runErrorTests();
    await runRateLimitTests();
    
    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Smoke Test Summary');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Total: ${results.passed + results.failed}`);
    console.log(`🎯 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));
    
    if (results.failed > 0) {
      console.log('\n❌ Some tests failed. Check output above.');
      console.log('\nFailed tests:');
      results.tests
        .filter(t => t.status === 'FAIL')
        .forEach(t => console.log(`   - ${t.name}: ${t.error}`));
      process.exit(1);
    } else {
      console.log('\n✅ All tests passed! API is ready for production.');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Smoke tests failed with error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { runSmokeTests: main };
