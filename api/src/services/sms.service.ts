/**
 * SMS Service
 * Управление отправкой SMS через Android SMS Node
 */

import axios from 'axios';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger';
import { config } from '../config';

interface SendSMSParams {
  phone: string;
  message: string;
  userId: string;
  priority?: 'low' | 'normal' | 'high';
}

interface SendOTPParams {
  phone: string;
  purpose?: 'login' | 'registration' | 'password_reset' | '2fa';
}

interface VerifyOTPParams {
  otpId: string;
  code: string;
}

interface SMSResult {
  messageId: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt: string;
}

interface OTPResult {
  otpId: string;
  expiresAt: string;
}

interface SMSStatus {
  messageId: string;
  status: string;
  phone: string;
  sentAt: string;
  deliveredAt?: string;
  errorCode?: string;
}

interface AndroidNodeStatus {
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
  private otpStore: Map<string, { code: string; phone: string; expiresAt: Date; purpose: string }> = new Map();
  private androidNodesUrl: string;

  constructor() {
    this.androidNodesUrl = process.env.ANDROID_SMS_NODE_URL || 'http://localhost:3005';
    
    // Очистка просроченных OTP каждые 5 минут
    setInterval(() => this.cleanupOTP(), 5 * 60 * 1000);
  }

  /**
   * Отправка SMS через Android SMS Node
   */
  async sendSMS(params: SendSMSParams): Promise<SMSResult> {
    const messageId = randomUUID();
    const normalizedPhone = this.normalizePhone(params.phone);

    try {
      // Попытка отправки через Android SMS Node
      const response = await axios.post(
        `${this.androidNodesUrl}/api/sms/send`,
        {
          messageId,
          phone: normalizedPhone,
          message: params.message,
          priority: params.priority,
          userId: params.userId,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.ANDROID_SMS_NODE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      logger.info('SMS sent via Android node', { messageId, phone: normalizedPhone });

      return {
        messageId,
        status: response.data.status || 'sent',
        sentAt: new Date().toISOString(),
      };
    } catch (error) {
      // Fallback: логирование для последующей отправки
      logger.warn('Android SMS node unavailable, queuing message', { 
        messageId, 
        phone: normalizedPhone,
        error: error instanceof Error ? error.message : error 
      });

      // TODO: Добавить в очередь для последующей отправки
      await this.queueSMS(messageId, params);

      return {
        messageId,
        status: 'pending',
        sentAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Отправка OTP кода
   */
  async sendOTP(params: SendOTPParams): Promise<OTPResult> {
    const otpId = randomUUID();
    const code = this.generateOTPCode();
    const normalizedPhone = this.normalizePhone(params.phone);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут

    // Сохранение OTP
    this.otpStore.set(otpId, {
      code,
      phone: normalizedPhone,
      expiresAt,
      purpose: params.purpose || 'login',
    });

    // Формирование сообщения
    const message = this.buildOTPMessage(code, params.purpose);

    // Отправка SMS
    await this.sendSMS({
      phone: normalizedPhone,
      message,
      userId: 'system',
      priority: 'high',
    });

    logger.info('OTP generated and sent', { otpId, phone: normalizedPhone, purpose: params.purpose });

    return {
      otpId,
      expiresAt: expiresAt.toISOString(),
    };
  }

  /**
   * Проверка OTP кода
   */
  async verifyOTP(params: VerifyOTPParams): Promise<{ valid: boolean }> {
    const otp = this.otpStore.get(params.otpId);

    if (!otp) {
      logger.warn('OTP not found', { otpId: params.otpId });
      return { valid: false };
    }

    // Проверка истечения
    if (new Date() > otp.expiresAt) {
      this.otpStore.delete(params.otpId);
      logger.warn('OTP expired', { otpId: params.otpId });
      return { valid: false };
    }

    // Проверка кода
    const isValid = otp.code === params.code;

    if (isValid) {
      this.otpStore.delete(params.otpId);
      logger.info('OTP verified', { otpId: params.otpId });
    } else {
      logger.warn('OTP verification failed', { otpId: params.otpId });
    }

    return { valid: isValid };
  }

  /**
   * Получение статуса SMS
   */
  async getMessageStatus(messageId: string): Promise<SMSStatus> {
    try {
      const response = await axios.get(
        `${this.androidNodesUrl}/api/sms/status/${messageId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.ANDROID_SMS_NODE_TOKEN}`,
          },
          timeout: 5000,
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to get SMS status', { messageId, error });
      throw new Error('Failed to get SMS status');
    }
  }

  /**
   * История SMS пользователя
   */
  async getUserHistory(userId: string, options: { limit: number; offset: number }): Promise<SMSHistory> {
    try {
      const response = await axios.get(
        `${this.androidNodesUrl}/api/sms/history`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.ANDROID_SMS_NODE_TOKEN}`,
          },
          params: {
            userId,
            limit: options.limit,
            offset: options.offset,
          },
          timeout: 5000,
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to get SMS history', { userId, error });
      return { total: 0, messages: [] };
    }
  }

  /**
   * Статус Android SMS узлов
   */
  async getAndroidNodesStatus(): Promise<AndroidNodeStatus[]> {
    try {
      const response = await axios.get(
        `${this.androidNodesUrl}/api/nodes/status`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.ANDROID_SMS_NODE_TOKEN}`,
          },
          timeout: 5000,
        }
      );

      return response.data.nodes || [];
    } catch (error) {
      logger.error('Failed to get Android nodes status', { error });
      return [];
    }
  }

  /**
   * Генерация OTP кода (6 цифр)
   */
  private generateOTPCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Построение сообщения OTP
   */
  private buildOTPMessage(code: string, purpose?: string): string {
    const purposes: Record<string, string> = {
      login: 'код входа',
      registration: 'код регистрации',
      password_reset: 'код восстановления пароля',
      '2fa': 'код двухфакторной аутентификации',
    };

    const purposeText = purposes[purpose || 'login'] || 'код подтверждения';
    
    return `Balloo: Ваш ${purposeText}: ${code}. Действителен 5 минут. Не сообщайте код никому.`;
  }

  /**
   * Нормализация номера телефона
   */
  private normalizePhone(phone: string): string {
    return phone.replace(/[\s\-\(\)]/g, '');
  }

  /**
   * Очистка просроченных OTP
   */
  private cleanupOTP(): void {
    const now = new Date();
    let cleaned = 0;

    for (const [otpId, otp] of this.otpStore.entries()) {
      if (now > otp.expiresAt) {
        this.otpStore.delete(otpId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug('Cleaned up expired OTPs', { count: cleaned });
    }
  }

  /**
   * Очереди SMS для последующей отправки
   */
  private async queueSMS(messageId: string, params: SendSMSParams): Promise<void> {
    // TODO: Реализовать очередь SMS (Redis)
    logger.info('SMS queued', { messageId, phone: params.phone });
  }
}

export const smsService = new SmsService();
