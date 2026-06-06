/**
 * Theme Subscriptions Controller
 * Управление подписками на пользовательские темы
 */

const db = require('../config/database');

const subscriptionsController = {
  // Получить статус подписки
  getStatus: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const subscription = db.prepare(`
        SELECT id, activated_at, expires_at, days_count, cost, status
        FROM theme_subscriptions
        WHERE user_id = ? AND status = 'active' AND expires_at > ?
        LIMIT 1
      `).get(userId, Date.now());
      
      if (!subscription) {
        return res.json({
          success: true,
          data: { isActive: false }
        });
      }
      
      res.json({
        success: true,
        data: {
          isActive: true,
          activatedAt: subscription.activated_at,
          expiresAt: subscription.expires_at,
          daysCount: subscription.days_count,
          cost: subscription.cost,
          daysLeft: Math.ceil((subscription.expires_at - Date.now()) / (1000 * 60 * 60 * 24))
        }
      });
    } catch (error) {
      console.error('[Subscription] Status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch subscription status'
      });
    }
  },
  
  // Активировать подписку
  activate: async (req, res) => {
    try {
      const userId = req.user.id;
      const { days } = req.body;
      
      if (!days || days < 1) {
        return res.status(400).json({
          success: false,
          error: 'Invalid days count'
        });
      }
      
      const cost = days * 3; // 3 балла в день
      
      // Проверить баланс
      const user = db.prepare(`
        SELECT points
        FROM users
        WHERE id = ?
      `).get(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      if (user.points < cost) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient balance',
          data: {
            balance: user.points,
            required: cost,
            deficit: cost - user.points
          }
        });
      }
      
      // Списываем баллы
      db.prepare(`
        UPDATE users
        SET points = points - ?
        WHERE id = ?
      `).run(cost, userId);
      
      // Записываем транзакцию
      db.prepare(`
        INSERT INTO point_transactions (
          id, user_id, type, amount, description, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        'spent',
        -cost,
        `Theme subscription for ${days} days`,
        Date.now()
      );
      
      // Активируем подписку
      const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();
      const expiresAt = now + (days * 24 * 60 * 60 * 1000);
      
      db.prepare(`
        INSERT INTO theme_subscriptions (
          id, user_id, activated_at, expires_at, days_count, cost, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
      `).run(
        subscriptionId,
        userId,
        now,
        expiresAt,
        days,
        cost,
        now,
        now
      );
      
      res.json({
        success: true,
        data: {
          id: subscriptionId,
          activatedAt: now,
          expiresAt,
          daysCount: days,
          cost,
          daysLeft: days
        }
      });
    } catch (error) {
      console.error('[Subscription] Activate error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to activate subscription'
      });
    }
  },
  
  // Отменить подписку
  cancel: async (req, res) => {
    try {
      const userId = req.user.id;
      
      db.prepare(`
        UPDATE theme_subscriptions
        SET status = 'cancelled', updated_at = ?
        WHERE user_id = ? AND status = 'active'
      `).run(Date.now(), userId);
      
      res.json({
        success: true,
        message: 'Subscription cancelled'
      });
    } catch (error) {
      console.error('[Subscription] Cancel error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel subscription'
      });
    }
  }
};

module.exports = subscriptionsController;
