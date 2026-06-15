/**
 * SMS Routes для Android Service
 * Обработка запросов на отправку SMS
 */

import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { smsService } from '../services/sms.service';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * POST /api/sms/send
 * Отправить SMS через Android устройство
 */
router.post('/send', authenticate, async (req: Request, res: Response) => {
  try {
    const { messageId, phone, message, priority = 'normal', userId } = req.body;

    if (!messageId || !phone || !message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'messageId, phone, and message are required',
        },
      });
    }

    // Проверка прав на отправку
    const canSend = await smsService.canSendSMS(userId);
    if (!canSend) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PERMISSION_DENIED',
          message: 'No permission to send SMS',
        },
      });
    }

    // Отправка SMS через Android
    const result = await smsService.sendViaAndroid({
      messageId,
      phone,
      message,
      priority,
    });

    logger.info('SMS sent via Android', { messageId, phone });

    res.json({
      success: true,
      status: result.status,
      messageId,
      sentAt: result.sentAt,
    });
  } catch (error) {
    logger.error('Failed to send SMS', { error });
    res.status(500).json({
      success: false,
      error: {
        code: 'SEND_FAILED',
        message: 'Failed to send SMS',
      },
    });
  }
});

/**
 * GET /api/sms/status/:messageId
 * Статус отправленного SMS
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
 * История отправленных SMS
 */
router.get('/history', authenticate, async (req: Request, res: Response) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const history = await smsService.getHistory({
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
 * GET /api/sms/nodes/status
 * Статус Android SMS узлов
 */
router.get('/nodes/status', async (req: Request, res: Response) => {
  try {
    const nodes = await smsService.getNodesStatus();

    res.json({
      success: true,
      nodes,
    });
  } catch (error) {
    logger.error('Failed to get nodes status', { error });
    res.status(500).json({
      success: false,
      error: {
        code: 'NODES_STATUS_FAILED',
        message: 'Failed to get nodes status',
      },
    });
  }
});

export { router as smsRoutes };
