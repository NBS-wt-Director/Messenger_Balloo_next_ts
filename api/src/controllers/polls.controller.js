/**
 * Polls Controller
 * Управление голосованиями
 */

const db = require('../config/database');

const pollsController = {
  // Создать голосование
  createPoll: async (req, res) => {
    try {
      const { chatId, messageId, question, options, settings } = req.body;
      const userId = req.user.id;
      
      const pollId = `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();
      
      db.prepare(`
        INSERT INTO polls (
          id, chat_id, message_id, question, options, settings,
          created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        pollId,
        chatId,
        messageId || null,
        question,
        JSON.stringify(options),
        JSON.stringify(settings || {}),
        userId,
        now,
        now
      );
      
      res.json({
        success: true,
        data: {
          pollId,
          question,
          options,
          settings: settings || {},
          createdAt: now
        }
      });
    } catch (error) {
      console.error('[Polls] Create error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create poll'
      });
    }
  },
  
  // Получить голосование с результатами
  getPoll: async (req, res) => {
    try {
      const { pollId } = req.params;
      const userId = req.user.id;
      
      const poll = db.prepare('SELECT * FROM polls WHERE id = ?').get(pollId);
      
      if (!poll) {
        return res.status(404).json({
          success: false,
          error: 'Poll not found'
        });
      }
      
      // Получить ответы пользователя
      const userResponse = db.prepare(`
        SELECT * FROM poll_responses
        WHERE poll_id = ? AND user_id = ?
      `).get(pollId, userId);
      
      // Получить варианты с голосами
      const options = JSON.parse(poll.options).map(option => {
        const votes = db.prepare(`
          SELECT COUNT(*) as count
          FROM poll_responses
          WHERE poll_id = ? AND ? IN (SELECT value FROM json_each(option_ids))
        `).get(pollId, option.id);
        
        return {
          ...option,
          votes: votes.count,
          percentage: 0
        };
      });
      
      // Вычислить проценты
      const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);
      options.forEach(opt => {
        opt.percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
        opt.userVoted = userResponse?.option_ids?.includes(opt.id);
      });
      
      res.json({
        success: true,
        data: {
          pollId: poll.id,
          question: poll.question,
          options,
          settings: JSON.parse(poll.settings),
          totalVotes,
          userResponse: userResponse ? {
            optionIds: userResponse.option_ids,
            textResponse: userResponse.text_response,
            votedAt: userResponse.created_at
          } : undefined
        }
      });
    } catch (error) {
      console.error('[Polls] Get error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch poll'
      });
    }
  },
  
  // Проголосовать
  vote: async (req, res) => {
    try {
      const { pollId } = req.params;
      const { optionIds, textResponse } = req.body;
      const userId = req.user.id;
      
      const poll = db.prepare('SELECT * FROM polls WHERE id = ?').get(pollId);
      if (!poll) {
        return res.status(404).json({
          success: false,
          error: 'Poll not found'
        });
      }
      
      const settings = JSON.parse(poll.settings);
      
      // Проверить срок действия
      if (settings.expiresAt && Date.now() > settings.expiresAt) {
        return res.status(400).json({
          success: false,
          error: 'Poll has expired'
        });
      }
      
      // Проверить множественный выбор
      if (!settings.multipleChoice && optionIds.length > 1) {
        return res.status(400).json({
          success: false,
          error: 'Only one option allowed'
        });
      }
      
      // Проверить макс. выбор
      if (settings.multipleChoice && settings.maxVotes && optionIds.length > settings.maxVotes) {
        return res.status(400).json({
          success: false,
          error: `Maximum ${settings.maxVotes} options allowed`
        });
      }
      
      // Проверить уже голосовал
      const existing = db.prepare(`
        SELECT * FROM poll_responses WHERE poll_id = ? AND user_id = ?
      `).get(pollId, userId);
      
      if (existing && !settings.allowMultipleSubmissions) {
        return res.status(400).json({
          success: false,
          error: 'Already voted'
        });
      }
      
      const now = Date.now();
      
      if (existing) {
        // Обновить ответ
        db.prepare(`
          UPDATE poll_responses
          SET option_ids = ?, text_response = ?, created_at = ?
          WHERE poll_id = ? AND user_id = ?
        `).run(
          JSON.stringify(optionIds),
          textResponse || null,
          now,
          pollId,
          userId
        );
      } else {
        // Создать ответ
        const responseId = `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        db.prepare(`
          INSERT INTO poll_responses (id, poll_id, user_id, option_ids, text_response, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          responseId,
          pollId,
          userId,
          JSON.stringify(optionIds),
          textResponse || null,
          now
        );
        
        // Обновить total_votes
        db.prepare(`
          UPDATE polls SET total_votes = total_votes + 1 WHERE id = ?
        `).run(pollId);
      }
      
      res.json({
        success: true,
        message: 'Vote recorded'
      });
    } catch (error) {
      console.error('[Polls] Vote error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to vote'
      });
    }
  }
};

module.exports = pollsController;
