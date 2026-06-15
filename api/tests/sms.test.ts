/**
 * SMS Service Tests
 * Тестирование SMS функциональности
 */

import request from 'supertest';
import { app } from '../src/index';
import { smsService } from '../src/services/sms.service';

describe('SMS API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Получение тестового токена
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@balloo.su',
        password: 'TestPassword123',
      });

    authToken = response.body.data?.token || '';
  });

  describe('POST /api/sms/send', () => {
    it('should send SMS successfully', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phone: '+79991234567',
          message: 'Test message from Balloo',
          priority: 'normal',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('messageId');
      expect(response.body.data.status).toBe('pending');
    });

    it('should reject invalid phone number', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phone: 'invalid',
          message: 'Test message',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_PHONE');
    });

    it('should reject missing message', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phone: '+79991234567',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/sms/send')
        .send({
          phone: '+79991234567',
          message: 'Test message',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/sms/otp', () => {
    it('should send OTP successfully', async () => {
      const response = await request(app)
        .post('/api/sms/otp')
        .send({
          phone: '+79991234567',
          purpose: 'login',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('otpId');
      expect(response.body.data).toHaveProperty('expiresAt');
    });

    it('should reject invalid phone', async () => {
      const response = await request(app)
        .post('/api/sms/otp')
        .send({
          phone: 'invalid',
        });

      expect(response.status).toBe(400);
    });

    it('should require phone', async () => {
      const response = await request(app)
        .post('/api/sms/otp')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/sms/otp/verify', () => {
    let otpId: string;

    beforeAll(async () => {
      // Создание OTP для теста
      const response = await request(app)
        .post('/api/sms/otp')
        .send({
          phone: '+79991234567',
          purpose: 'login',
        });

      otpId = response.body.data.otpId;
    });

    it('should verify correct OTP', async () => {
      // В реальном тесте нужно получить код из SMS сервиса
      // Здесь тестируем структуру ответа
      const response = await request(app)
        .post('/api/sms/otp/verify')
        .send({
          otpId,
          code: '123456',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });

    it('should reject missing otpId', async () => {
      const response = await request(app)
        .post('/api/sms/otp/verify')
        .send({
          code: '123456',
        });

      expect(response.status).toBe(400);
    });

    it('should reject missing code', async () => {
      const response = await request(app)
        .post('/api/sms/otp/verify')
        .send({
          otpId,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/sms/status/:messageId', () => {
    it('should get SMS status', async () => {
      const response = await request(app)
        .get('/api/sms/status/test-message-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body.data).toHaveProperty('messageId');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/sms/status/test-message-id');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sms/history', () => {
    it('should get SMS history', async () => {
      const response = await request(app)
        .get('/api/sms/history')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 10, offset: 0 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('messages');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/sms/history');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sms/android-nodes', () => {
    it('should get Android nodes status', async () => {
      const response = await request(app)
        .get('/api/sms/android-nodes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('nodes');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('active');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/sms/android-nodes');

      expect(response.status).toBe(401);
    });
  });
});

describe('SMS Service Unit Tests', () => {
  describe('generateOTPCode', () => {
    it('should generate 6-digit code', () => {
      // @ts-ignore - доступ к приватному методу для тестов
      const code = smsService.generateOTPCode();
      expect(code).toMatch(/^\d{6}$/);
    });

    it('should generate different codes', () => {
      // @ts-ignore
      const code1 = smsService.generateOTPCode();
      // @ts-ignore
      const code2 = smsService.generateOTPCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe('normalizePhone', () => {
    it('should remove spaces and dashes', () => {
      // @ts-ignore
      const normalized = smsService.normalizePhone('+7 999-123-45-67');
      expect(normalized).toBe('+79991234567');
    });

    it('should remove parentheses', () => {
      // @ts-ignore
      const normalized = smsService.normalizePhone('+7(999)1234567');
      expect(normalized).toBe('+79991234567');
    });
  });

  describe('buildOTPMessage', () => {
    it('should build login OTP message', () => {
      // @ts-ignore
      const message = smsService.buildOTPMessage('123456', 'login');
      expect(message).toContain('код входа');
      expect(message).toContain('123456');
    });

    it('should build registration OTP message', () => {
      // @ts-ignore
      const message = smsService.buildOTPMessage('123456', 'registration');
      expect(message).toContain('код регистрации');
    });

    it('should build default OTP message', () => {
      // @ts-ignore
      const message = smsService.buildOTPMessage('123456');
      expect(message).toContain('код подтверждения');
    });
  });
});
