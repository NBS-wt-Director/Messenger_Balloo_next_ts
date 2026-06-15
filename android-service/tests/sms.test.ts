/**
 * Android SMS Service Tests
 * Тестирование SMS функциональности Android Service
 */

import request from 'supertest';
import { app } from '../src/index';
import { smsService } from '../src/services/sms.service';
import { redis } from '../src/redis';

describe('Android SMS Service', () => {
  describe('SMS Service Unit Tests', () => {
    beforeEach(async () => {
      // Очистка Redis перед каждым тестом
      const keys = await redis.keys('sms:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    });

    describe('canSendSMS', () => {
      it('should allow user under limit', async () => {
        const userId = 'test-user-1';
        
        // Установка лимита
        await redis.set(`user:${userId}:smsLimit`, '100');
        await redis.set(`user:${userId}:smsUsage:2026-06-14`, '50');

        const canSend = await smsService.canSendSMS(userId);
        expect(canSend).toBe(true);
      });

      it('should block user over limit', async () => {
        const userId = 'test-user-2';
        
        await redis.set(`user:${userId}:smsLimit`, '100');
        await redis.set(`user:${userId}:smsUsage:2026-06-14`, '100');

        const canSend = await smsService.canSendSMS(userId);
        expect(canSend).toBe(false);
      });

      it('should use default limit if not set', async () => {
        const userId = 'test-user-3';
        
        const canSend = await smsService.canSendSMS(userId);
        expect(canSend).toBe(true);
      });
    });

    describe('sendViaAndroid', () => {
      it('should queue SMS successfully', async () => {
        const params = {
          messageId: 'test-msg-1',
          phone: '+79991234567',
          message: 'Test message',
          priority: 'normal' as const,
        };

        const result = await smsService.sendViaAndroid(params);

        expect(result.status).toBe('pending');
        expect(result).toHaveProperty('sentAt');

        // Проверка очереди Redis
        const queueLength = await redis.llen('sms:queue');
        expect(queueLength).toBeGreaterThan(0);
      });

      it('should handle high priority messages', async () => {
        const params = {
          messageId: 'test-msg-2',
          phone: '+79991234567',
          message: 'High priority message',
          priority: 'high' as const,
        };

        const result = await smsService.sendViaAndroid(params);

        expect(result.status).toBe('pending');
      });
    });

    describe('updateMessageStatus', () => {
      it('should update SMS status', async () => {
        const messageId = 'test-msg-3';
        
        await smsService.updateMessageStatus(messageId, {
          status: 'sent',
          phone: '+79991234567',
          sentAt: new Date().toISOString(),
        });

        const status = await smsService.getMessageStatus(messageId);
        expect(status.status).toBe('sent');
        expect(status.messageId).toBe(messageId);
      });

      it('should handle delivery status', async () => {
        const messageId = 'test-msg-4';
        
        await smsService.updateMessageStatus(messageId, {
          status: 'pending',
          phone: '+79991234567',
          sentAt: new Date().toISOString(),
        });

        await smsService.updateMessageStatus(messageId, {
          status: 'delivered',
          deliveredAt: new Date().toISOString(),
        });

        const status = await smsService.getMessageStatus(messageId);
        expect(status.status).toBe('delivered');
        expect(status).toHaveProperty('deliveredAt');
      });
    });

    describe('getHistory', () => {
      beforeEach(async () => {
        // Создание тестовых записей
        await smsService.updateMessageStatus('msg-1', {
          status: 'delivered',
          phone: '+79991111111',
          sentAt: new Date().toISOString(),
        });

        await smsService.updateMessageStatus('msg-2', {
          status: 'sent',
          phone: '+79992222222',
          sentAt: new Date().toISOString(),
        });
      });

      it('should return SMS history', async () => {
        const history = await smsService.getHistory({ limit: 10, offset: 0 });

        expect(history).toHaveProperty('total');
        expect(history).toHaveProperty('messages');
        expect(Array.isArray(history.messages)).toBe(true);
      });

      it('should respect pagination', async () => {
        const history1 = await smsService.getHistory({ limit: 1, offset: 0 });
        const history2 = await smsService.getHistory({ limit: 1, offset: 1 });

        expect(history1.messages.length).toBeLessThanOrEqual(1);
        expect(history2.messages.length).toBeLessThanOrEqual(1);
      });
    });

    describe('updateNodeStatus', () => {
      it('should add new node', async () => {
        await smsService.updateNodeStatus('node-1', {
          online: true,
          lastSeen: new Date().toISOString(),
          messagesSent: 0,
          messagesPending: 0,
        });

        const nodes = await smsService.getNodesStatus();
        const node = nodes.find(n => n.nodeId === 'node-1');

        expect(node).toBeDefined();
        expect(node?.online).toBe(true);
      });

      it('should update existing node', async () => {
        await smsService.updateNodeStatus('node-2', {
          online: true,
          messagesSent: 10,
        });

        await smsService.updateNodeStatus('node-2', {
          messagesSent: 20,
          batteryLevel: 85,
        });

        const nodes = await smsService.getNodesStatus();
        const node = nodes.find(n => n.nodeId === 'node-2');

        expect(node?.messagesSent).toBe(20);
        expect(node?.batteryLevel).toBe(85);
      });

      it('should mark node offline', async () => {
        await smsService.updateNodeStatus('node-3', {
          online: true,
        });

        await smsService.updateNodeStatus('node-3', {
          online: false,
          lastSeen: new Date().toISOString(),
        });

        const nodes = await smsService.getNodesStatus();
        const node = nodes.find(n => n.nodeId === 'node-3');

        expect(node?.online).toBe(false);
      });
    });
  });

  describe('SMS API Endpoints', () => {
    let authToken: string;

    beforeAll(async () => {
      // Получение тестового токена
      try {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@android.balloo.su',
            password: 'TestPassword123',
          });

        authToken = response.body.data?.token || '';
      } catch (error) {
        // Token may not exist in test environment
        authToken = 'test-token';
      }
    });

    describe('POST /api/sms/send', () => {
      it('should queue SMS for Android delivery', async () => {
        const response = await request(app)
          .post('/api/sms/send')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            messageId: 'test-api-msg-1',
            phone: '+79991234567',
            message: 'Test API message',
            priority: 'normal',
            userId: 'test-user',
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.status).toBe('pending');
      });

      it('should reject missing messageId', async () => {
        const response = await request(app)
          .post('/api/sms/send')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            phone: '+79991234567',
            message: 'Test message',
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });
    });

    describe('GET /api/sms/nodes/status', () => {
      it('should return nodes status', async () => {
        const response = await request(app)
          .get('/api/sms/nodes/status');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body).toHaveProperty('nodes');
      });
    });
  });
});
