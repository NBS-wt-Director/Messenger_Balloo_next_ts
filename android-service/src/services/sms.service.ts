/**
 * SMS Service для Android Service
 * Интеграция с Android SMS Node
 */

import { logger } from '../utils/logger';
import { redis } from '../redis';

interface SendSMSParams {
  messageId: string;
  phone: string;
  message: string;
  priority: 'low' | 'normal' | 'high';
}

interface SMSResult {
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt: string;
  errorCode?: string;
}

interface SMSStatus {
  messageId: string;
  status: string;
  phone: string;
  sentAt: string;
  deliveredAt?: string;
  errorCode?: string;
}

interface NodeStatus {
  nodeId: string;
  name: string;
  online: boolean;
  lastSeen: string;
  messagesSent: number;
  messagesPending: number;
  batteryLevel?: number;
  signalStrength?: number;
}

interface SMSHistory {
  total: number;
  messages: SMSStatus[];
}

export class SmsService {
  /**
   * Проверка прав на отправку SMS
   */
  async canSendSMS(userId: string): Promise<boolean> {
    // Проверка лимитов пользователя
    const userLimit = await this.getUserLimit(userId);
    const userUsage = await this.getUserUsage(userId);

    if (userUsage >= userLimit) {
      logger.warn('User SMS limit exceeded', { userId, limit: userLimit, usage: userUsage });
      return false;
    }

    return true;
  }

  /**
   * Отправка SMS через Android устройство
   */
  async sendViaAndroid(params: SendSMSParams): Promise<SMSResult> {
    const { messageId, phone, message, priority } = params;

    try {
      // Добавление в очередь Redis
      await redis.lpush(
        'sms:queue',
        JSON.stringify({
          messageId,
          phone,
          message,
          priority,
          createdAt: new Date().toISOString(),
        })
      );

      // Уведомление Android устройств через WebSocket
      await this.notifyAndroidDevices();

      logger.info('SMS queued for Android delivery', { messageId, phone });

      return {
        status: 'pending',
        sentAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to queue SMS', { messageId, error });
      throw error;
    }
  }

  /**
   * Получение статуса SMS
   */
  async getMessageStatus(messageId: string): Promise<SMSStatus> {
    const statusData = await redis.get(`sms:status:${messageId}`);

    if (!statusData) {
      return {
        messageId,
        status: 'unknown',
        phone: '',
        sentAt: '',
      };
    }

    return JSON.parse(statusData);
  }

  /**
   * Обновление статуса SMS
   */
  async updateMessageStatus(messageId: string, status: Partial<SMSStatus>): Promise<void> {
    const existing = await this.getMessageStatus(messageId);
    const updated = { ...existing, ...status };

    await redis.setex(
      `sms:status:${messageId}`,
      7 * 24 * 60 * 60, // 7 дней
      JSON.stringify(updated)
    );

    logger.debug('SMS status updated', { messageId, status: updated.status });
  }

  /**
   * История SMS
   */
  async getHistory(options: { limit: number; offset: number }): Promise<SMSHistory> {
    const { limit, offset } = options;

    // Получение ключей статусов
    const keys = await redis.keys('sms:status:*');
    const slicedKeys = keys.slice(offset, offset + limit);

    const messages: SMSStatus[] = [];
    for (const key of slicedKeys) {
      const data = await redis.get(key);
      if (data) {
        messages.push(JSON.parse(data));
      }
    }

    return {
      total: keys.length,
      messages,
    };
  }

  /**
   * Статус Android узлов
   */
  async getNodesStatus(): Promise<NodeStatus[]> {
    const nodesData = await redis.get('android:nodes:status');

    if (!nodesData) {
      return [];
    }

    return JSON.parse(nodesData);
  }

  /**
   * Обновление статуса узла
   */
  async updateNodeStatus(nodeId: string, status: Partial<NodeStatus>): Promise<void> {
    const nodes = await this.getNodesStatus();
    const nodeIndex = nodes.findIndex(n => n.nodeId === nodeId);

    if (nodeIndex >= 0) {
      nodes[nodeIndex] = { ...nodes[nodeIndex], ...status };
    } else {
      nodes.push({
        nodeId,
        name: `Android Node ${nodeId}`,
        online: true,
        lastSeen: new Date().toISOString(),
        messagesSent: 0,
        messagesPending: 0,
        ...status,
      } as NodeStatus);
    }

    await redis.setex(
      'android:nodes:status',
      60, // 1 минута
      JSON.stringify(nodes)
    );
  }

  /**
   * Уведомление Android устройств
   */
  private async notifyAndroidDevices(): Promise<void> {
    // Публикация события в Redis для WebSocket рассылки
    await redis.publish('sms:new', JSON.stringify({
      type: 'sms:new',
      timestamp: new Date().toISOString(),
    }));

    logger.debug('Android devices notified of new SMS');
  }

  /**
   * Лимит SMS для пользователя
   */
  private async getUserLimit(userId: string): Promise<number> {
    // Получение лимита из БД или Redis
    const limit = await redis.get(`user:${userId}:smsLimit`);
    return limit ? parseInt(limit) : 100; // Default 100 SMS/day
  }

  /**
   * Использование SMS пользователем
   */
  private async getUserUsage(userId: string): Promise<number> {
    const key = `user:${userId}:smsUsage:${new Date().toDateString()}`;
    const usage = await redis.get(key);
    return usage ? parseInt(usage) : 0;
  }
}

export const smsService = new SmsService();
