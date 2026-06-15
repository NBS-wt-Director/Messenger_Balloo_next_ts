/**
 * Auth API Tests
 * Тестирование аутентификации
 */

import request from 'supertest';
import { app } from '../src/index';

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register new user', async () => {
      const userData = {
        email: `test${Date.now()}@balloo.su`,
        password: 'TestPassword123',
        displayName: 'Test User',
        phone: '+79991234567',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid',
          password: 'TestPassword123',
          displayName: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@balloo.su',
          password: '123',
          displayName: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: `duplicate${Date.now()}@balloo.su`,
        password: 'TestPassword123',
        displayName: 'Test User',
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser: any;

    beforeAll(async () => {
      // Create test user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: `login${Date.now()}@balloo.su`,
          password: 'TestPassword123',
          displayName: 'Login Test User',
        });

      testUser = registerResponse.body.data;
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.user.email,
          password: 'TestPassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('id');
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.user.email,
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@balloo.su',
          password: 'TestPassword123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken: string;

    beforeAll(async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: `me${Date.now()}@balloo.su`,
          password: 'TestPassword123',
        });

      // If login fails (user doesn't exist), register first
      if (loginResponse.status === 401) {
        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send({
            email: `me${Date.now()}@balloo.su`,
            password: 'TestPassword123',
            displayName: 'Me Test User',
          });

        authToken = registerResponse.body.data.token;
      } else {
        authToken = loginResponse.body.data.token;
      }
    });

    it('should get current user', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
    });

    it('should reject without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
    });

    it('should reject with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token', async () => {
      // Register and login
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: `refresh${Date.now()}@balloo.su`,
          password: 'TestPassword123',
          displayName: 'Refresh Test User',
        });

      const token = registerResponse.body.data.token;

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ token });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should send password reset code', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: `forgot${Date.now()}@balloo.su`,
        });

      // Should succeed even if user doesn't exist (security)
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'invalid',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Rate Limiting', () => {
    it('should limit login attempts', async () => {
      // Make multiple failed login attempts
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'ratelimit@balloo.su',
            password: 'wrong',
          });
      }

      // Next attempt should be rate limited
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ratelimit@balloo.su',
          password: 'wrong',
        });

      // Should be 429 Too Many Requests or similar
      expect([429, 403]).toContain(response.status);
    });
  });
});
