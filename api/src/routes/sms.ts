/**
 * SMS Routes
 * Отправка SMS через Android SMS Node
 */

import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { SmsService } from '../services/sms.service';
import { logger } from '../utils/logger';

const router = express.Router();
const smsService = new SmsService();

/**
 * POST /api/sms/send
 * Отправить SMS (только для авторизованных пользователей с правами)
 */
router.post('/send', authenticate, async (req: Request, res: Response) => {
  try {
    const { phone, message, priority = 'normal' } = req.body;
    const userId = (req as any).user.id;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Phone and message are required',
        },
      });
    }

    // Проверка формата телефона
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PHONE',
          message: 'Invalid phone number format',
        },
      });
    }

    // Отправка SMS
    const result = await smsService.sendSMS({
      phone,
      message,
      userId,
      priority,
    });

    logger.info('SMS sent', { userId, phone, messageId: result.messageId });

    res.json({
      success: true,
      data: {
        messageId: result.messageId,
        status: result.status,
        phone,
        sentAt: result.sentAt,
      },
    });
  } catch (error) {
    logger.error('Failed to send SMS', { error });
    res.status(500).json({
      success: false,
      error: {
        code: 'SMS_SEND_FAILED',
        message: 'Failed to send SMS',
      },
    });
  }
});

/**
 * POST /api/sms/otp
 * Отправить OTP код
 */
router.post('/otp', async (req: Request, res: Response) => {
  try {
    const { phone, purpose = 'login' } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Phone is required',
        },
      });
    }

    // Генерация и отправка OTP
    const result = await smsService.sendOTP({
      phone,
      purpose,
    });

    logger.info('OTP sent', { phone, purpose });

    res.json({
      success: true,
      data: {
        otpId: result.otpId,
        expiresAt: result.expiresAt,
        phone,
      },
    });
  } catch (error) {
    logger.error('Failed to send OTP', { error });
    res.status(500).json({
      success: false,
      error: {
        code: 'OTP_SEND_FAILED',
        message: 'Failed to send OTP',
      },
    });
  }
});

/**
 * POST /api/sms/otp/verify
 * Проверить OTP код
 */
router.post('/otp/verify', async (req: Request, res: Response) => {
  try {
    const { otpId, code } = req.body;

    if (!otpId || !code) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'OTP ID and code are required',
        },
      });
    }

    // Проверка OTP
    const result = await smsService.verifyOTP({
      otpId,
      code,
    });

    if (result.valid) {
      logger.info('OTP verified', { otpId });
      res.json({
        success: true,
        data: {
          valid: true,
          verifiedAt: new Date().toISOString(),
        },
      });
    } else {
      logger.warn('OTP verification failed', { otpId });
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_OTP',
          message: 'Invalid or expired OTP code',
        },
      });
    }
  } catch (error) {
    logger.error('Failed to verify OTP', { error });
    res.status(500).json({
      success: false,
      error: {
        code: 'OTP_VERIFY_FAILED',
        message: 'Failed to verify OTP',
      },
    });
  }
});

/**
 * GET /api/sms/status/:messageId
 * Статус SMS
 */
router.get('/status/:messageId', authenticate, async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const status = await smsService.getMessageStatus(messageId);

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    logger.error('Failed to get SMS status', { error });
    res.status(500).json({
      success: false,
      error: {
        code: 'STATUS_CHECK_FAILED',
        message: 'Failed to get SMS status',
      },
    });
  }
});

/**
 * GET /api/sms/history
 * История SMS пользователя
 */
router.get('/history', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { limit = 50, offset = 0 } = req.query;

    const history = await smsService.getUserHistory(userId, {
      limit: Number(limit),
      offset: Number(offset),
    });

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    logger.error('Failed to get SMS history', { error });
    res.status(500).json({
      success: false,
      error: {
        code: 'HISTORY_CHECK_FAILED',
        message: 'Failed to get SMS history',
      },
    });
  }
});

/**
 * GET /api/sms/android-nodes
 * Статус Android SMS узлов
 */
router.get('/android-nodes', authenticate, async (req: Request, res: Response) => {
  try {
    const nodes = await smsService.getAndroidNodesStatus();

    res.json({
      success: true,
      data: {
        nodes,
        total: nodes.length,
        active: nodes.filter(n => n.online).length,
      },
    });
  } catch (error) {
    logger.error('Failed to get Android nodes status', { error });
    res.status(500).json({
      success: false,
      error: {
        code: 'NODES_STATUS_FAILED',
        message: 'Failed to get Android nodes status',
      },
    });
  }
});

export { router as smsRoutes };
