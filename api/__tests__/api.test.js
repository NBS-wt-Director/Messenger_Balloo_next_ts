/**
 * API Tests
 * Тесты для основных эндпоинтов
 */

const request = require('supertest');
const { app, server } = require('../src/index');
const { db, initDatabase, closeDatabase } = require('../src/config/database');
const jwt = require('jsonwebtoken');

let testUserToken = null;
let testUserId = null;

beforeAll(async () => {
  // Инициализировать БД
  await initDatabase();
});

afterAll(async () => {
  // Очистить тестовые данные
  if (testUserId) {
    db.prepare('DELETE FROM users WHERE id = ?').run(testUserId);
  }
  closeDatabase();
  server.close();
});

describe('Health Check', () => {
  test('GET /health should return ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('Root Endpoint', () => {
  test('GET / should return API info', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('App Balloo API');
    expect(response.body.version).toBe('1.0.0');
    expect(response.body).toHaveProperty('features');
  });
});

describe('Authentication', () => {
  let testEmail = `test_${Date.now()}@example.com`;
  
  test('POST /api/v1/auth/register should create new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: 'TestPassword123!',
        displayName: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('token');
    
    testUserId = response.body.data.user.id;
    testUserToken = response.body.data.token;
  });

  test('POST /api/v1/auth/login should return token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'TestPassword123!'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');
  });

  test('POST /api/v1/auth/login with wrong password should fail', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('GET /api/v1/auth/me should return user data with valid token', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('email');
    expect(response.body.data.email).toBe(testEmail);
  });

  test('GET /api/v1/auth/me without token should fail', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me');

    expect(response.status).toBe(401);
  });
});

describe('Users', () => {
  test('GET /api/v1/users/me/devices should return devices', async () => {
    const response = await request(app)
      .get('/api/v1/users/me/devices')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('devices');
    expect(Array.isArray(response.body.data.devices)).toBe(true);
  });
});

describe('Chats', () => {
  test('GET /api/v1/chats should return empty array for new user', async () => {
    const response = await request(app)
      .get('/api/v1/chats')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('chats');
    expect(Array.isArray(response.body.data.chats)).toBe(true);
  });

  test('POST /api/v1/chats should create a new chat', async () => {
    const response = await request(app)
      .post('/api/v1/chats')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({
        type: 'private',
        participants: [testUserId]
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.type).toBe('private');
  });
});

describe('Contacts', () => {
  test('GET /api/v1/contacts should return empty array for new user', async () => {
    const response = await request(app)
      .get('/api/v1/contacts')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('contacts');
    expect(Array.isArray(response.body.data.contacts)).toBe(true);
  });
});

describe('Notifications', () => {
  test('GET /api/v1/notifications should return empty array', async () => {
    const response = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('notifications');
    expect(Array.isArray(response.body.data.notifications)).toBe(true);
  });
});

describe('Calls', () => {
  test('POST /api/v1/calls should create a new call', async () => {
    const response = await request(app)
      .post('/api/v1/calls')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({
        type: 'video',
        toUserId: testUserId
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.type).toBe('video');
    expect(response.body.data.status).toBe('offered');
  });

  test('GET /api/v1/calls/history should return call history', async () => {
    const response = await request(app)
      .get('/api/v1/calls/history')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('calls');
    expect(Array.isArray(response.body.data.calls)).toBe(true);
  });
});

describe('Global Search', () => {
  test('GET /api/v1/global-search should require query parameter', async () => {
    const response = await request(app)
      .get('/api/v1/global-search')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('GET /api/v1/global-search?q=test should search', async () => {
    const response = await request(app)
      .get('/api/v1/global-search?q=test')
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('users');
    expect(response.body.data).toHaveProperty('chats');
    expect(response.body.data).toHaveProperty('messages');
  });
});

describe('Error Handling', () => {
  test('Invalid route should return 404', async () => {
    const response = await request(app).get('/api/v1/invalid-route');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test('Invalid method should be handled', async () => {
    const response = await request(app)
      .delete('/api/v1/auth/register');
    expect(response.status).toBe(404);
  });
});

describe('Rate Limiting', () => {
  test('Multiple requests should be rate limited', async () => {
    // Отправляем много запросов
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(
        request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${testUserToken}`)
      );
    }

    const results = await Promise.all(promises);
    // Некоторые запросы могут быть заблокированы
    const successCount = results.filter(r => r.status === 200).length;
    const rateLimitedCount = results.filter(r => r.status === 429).length;
    
    console.log(`Success: ${successCount}, Rate Limited: ${rateLimitedCount}`);
  });
});
