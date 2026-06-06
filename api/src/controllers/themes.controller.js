/**
 * Themes Controller
 * Управление пользовательскими темами и подписками
 */

const db = require('../config/database');

const themesController = {
  // Получить все доступные темы для пользователя
  getThemes: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Получить пользовательские темы
      const userThemes = db.prepare(`
        SELECT id, name, colors, is_favorite, created_at
        FROM user_themes
        WHERE user_id = ?
        ORDER BY created_at DESC
      `).all(userId);
      
      // Получить последние использованные темы (15)
      const recentThemes = db.prepare(`
        SELECT th.theme_id, ut.name, ut.colors
        FROM theme_history th
        LEFT JOIN user_themes ut ON th.theme_id = ut.id
        WHERE th.user_id = ?
        GROUP BY th.theme_id
        ORDER BY th.used_at DESC
        LIMIT 15
      `).all(userId);
      
      // Получить избранное
      const favorites = db.prepare(`
        SELECT id, name, colors, created_at
        FROM user_themes
        WHERE user_id = ? AND is_favorite = 1
        ORDER BY created_at DESC
        LIMIT 5
      `).all(userId);
      
      // Проверить подписку
      const subscription = db.prepare(`
        SELECT id, expires_at, status
        FROM theme_subscriptions
        WHERE user_id = ? AND status = 'active' AND expires_at > ?
        LIMIT 1
      `).get(userId, Date.now());
      
      res.json({
        success: true,
        data: {
          userThemes: userThemes.map(t => ({
            id: t.id,
            name: t.name,
            colors: JSON.parse(t.colors),
            isFavorite: t.is_favorite === 1,
            createdAt: t.created_at
          })),
          recentThemes: recentThemes.map(t => ({
            id: t.theme_id,
            name: t.name,
            colors: JSON.parse(t.colors)
          })),
          favorites: favorites.map(t => ({
            id: t.id,
            name: t.name,
            colors: JSON.parse(t.colors),
            createdAt: t.created_at
          })),
          subscription: subscription ? {
            isActive: true,
            expiresAt: subscription.expires_at
          } : { isActive: false }
        }
      });
    } catch (error) {
      console.error('[Themes] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch themes'
      });
    }
  },
  
  // Создать пользовательскую тему
  createUserTheme: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, colors, isFavorite } = req.body;
      
      // Проверить лимит избранных
      if (isFavorite) {
        const favoriteCount = db.prepare(`
          SELECT COUNT(*) as count
          FROM user_themes
          WHERE user_id = ? AND is_favorite = 1
        `).get(userId);
        
        if (favoriteCount.count >= 5) {
          return res.status(400).json({
            success: false,
            error: 'Maximum 5 favorite themes allowed'
          });
        }
      }
      
      const themeId = `theme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();
      
      db.prepare(`
        INSERT INTO user_themes (id, user_id, name, colors, is_favorite, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(themeId, userId, name, JSON.stringify(colors), isFavorite ? 1 : 0, now, now);
      
      res.json({
        success: true,
        data: {
          id: themeId,
          name,
          colors,
          isFavorite: isFavorite || false,
          createdAt: now
        }
      });
    } catch (error) {
      console.error('[Themes] Create error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create theme'
      });
    }
  },
  
  // Удалить тему
  deleteUserTheme: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const result = db.prepare(`
        DELETE FROM user_themes
        WHERE id = ? AND user_id = ?
      `).run(id, userId);
      
      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          error: 'Theme not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Theme deleted'
      });
    } catch (error) {
      console.error('[Themes] Delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete theme'
      });
    }
  },
  
  // Добавить в избранное
  addToFavorites: async (req, res) => {
    try {
      const { id } = req.body;
      const userId = req.user.id;
      
      // Проверить лимит
      const favoriteCount = db.prepare(`
        SELECT COUNT(*) as count
        FROM user_themes
        WHERE user_id = ? AND is_favorite = 1
      `).get(userId);
      
      if (favoriteCount.count >= 5) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 5 favorite themes allowed'
        });
      }
      
      db.prepare(`
        UPDATE user_themes
        SET is_favorite = 1, updated_at = ?
        WHERE id = ? AND user_id = ?
      `).run(Date.now(), id, userId);
      
      res.json({
        success: true,
        message: 'Added to favorites'
      });
    } catch (error) {
      console.error('[Themes] Favorite error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add to favorites'
      });
    }
  },
  
  // Удалить из избранного
  removeFromFavorites: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      db.prepare(`
        UPDATE user_themes
        SET is_favorite = 0, updated_at = ?
        WHERE id = ? AND user_id = ?
      `).run(Date.now(), id, userId);
      
      res.json({
        success: true,
        message: 'Removed from favorites'
      });
    } catch (error) {
      console.error('[Themes] Unfavorite error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove from favorites'
      });
    }
  },
  
  // Сохранить использование темы
  recordThemeUsage: async (userId, themeId) => {
    try {
      // Удалить старую запись если есть
      db.prepare(`
        DELETE FROM theme_history
        WHERE user_id = ? AND theme_id = ?
      `).run(userId, themeId);
      
      // Добавить новую запись
      db.prepare(`
        INSERT INTO theme_history (id, user_id, theme_id, used_at)
        VALUES (?, ?, ?, ?)
      `).run(
        `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        themeId,
        Date.now()
      );
      
      // Оставить только 15 последних
      db.prepare(`
        DELETE FROM theme_history
        WHERE id NOT IN (
          SELECT id FROM theme_history
          WHERE user_id = ?
          ORDER BY used_at DESC
          LIMIT 15
        ) AND user_id = ?
      `).run(userId, userId);
    } catch (error) {
      console.error('[Themes] Record usage error:', error);
    }
  }
};

module.exports = themesController;
