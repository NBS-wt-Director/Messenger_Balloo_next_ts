/**
 * Features Controller
 * Голосования за фичи и улучшения
 */

const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Получить все фичи
exports.getFeatures = async (req, res) => {
  try {
    const { status, category, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM features WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY votes DESC, createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const features = db.prepare(query).all(...params);

    const total = db.prepare('SELECT COUNT(*) as count FROM features WHERE 1=1').get().count;

    res.json({
      success: true,
      data: {
        features: features.map(f => ({
          id: f.id,
          title: f.title,
          description: f.description,
          category: f.category,
          status: f.status,
          votes: f.votes,
          votedBy: JSON.parse(f.votedBy || '[]'),
          createdBy: f.createdBy,
          createdByName: f.createdByName,
          adminNote: f.adminNote,
          plannedAt: f.plannedAt,
          completedAt: f.completedAt,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      }
    });
  } catch (error) {
    console.error('GetFeatures error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении фич' }
    });
  }
};

// Получить фичу по ID
exports.getFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(id);
    if (!feature) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Фича не найдена' }
      });
    }

    res.json({
      success: true,
      data: {
        id: feature.id,
        title: feature.title,
        description: feature.description,
        category: feature.category,
        status: feature.status,
        votes: feature.votes,
        votedBy: JSON.parse(feature.votedBy || '[]'),
        createdBy: feature.createdBy,
        createdByName: feature.createdByName,
        adminNote: feature.adminNote,
        plannedAt: feature.plannedAt,
        completedAt: feature.completedAt,
        createdAt: feature.createdAt,
        updatedAt: feature.updatedAt
      }
    });
  } catch (error) {
    console.error('GetFeature error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении фичи' }
    });
  }
};

// Создать фичу
exports.createFeature = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Заголовок и описание обязательны' }
      });
    }

    const id = uuidv4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO features (id, title, description, category, status, votes, votedBy, createdBy, createdByName, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, 'pending', 0, ?, ?, ?, ?, ?)
    `).run(id, title, description, category || 'general', JSON.stringify([]), req.user.id, req.user.displayName, now, now);

    res.status(201).json({
      success: true,
      data: { id, title, status: 'pending', votes: 0, createdAt: now }
    });
  } catch (error) {
    console.error('CreateFeature error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при создании фичи' }
    });
  }
};

// Голосовать за фичу
exports.voteFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(id);
    if (!feature) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Фича не найдена' }
      });
    }

    const votedBy = JSON.parse(feature.votedBy || '[]');
    
    // Если уже голосовал - убрать голос
    const alreadyVoted = votedBy.includes(req.user.id);
    
    if (alreadyVoted) {
      const filtered = votedBy.filter(userId => userId !== req.user.id);
      db.prepare('UPDATE features SET votedBy = ?, votes = votes - 1, updatedAt = ? WHERE id = ?')
        .run(JSON.stringify(filtered), Date.now(), id);
      
      res.json({ success: true, voted: false, votes: feature.votes - 1 });
    } else {
      votedBy.push(req.user.id);
      db.prepare('UPDATE features SET votedBy = ?, votes = votes + 1, updatedAt = ? WHERE id = ?')
        .run(JSON.stringify(votedBy), Date.now(), id);
      
      res.json({ success: true, voted: true, votes: feature.votes + 1 });
    }
  } catch (error) {
    console.error('VoteFeature error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при голосовании' }
    });
  }
};

// Обновить статус фичи (admin)
exports.updateFeatureStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote, plannedAt, completedAt } = req.body;

    const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(id);
    if (!feature) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Фича не найдена' }
      });
    }

    const updates = [];
    const values = [];

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
      if (status === 'completed' && !completedAt) {
        updates.push('completedAt = ?');
        values.push(Date.now());
      }
    }
    if (adminNote !== undefined) {
      updates.push('adminNote = ?');
      values.push(adminNote);
    }
    if (plannedAt !== undefined) {
      updates.push('plannedAt = ?');
      values.push(plannedAt);
    }
    if (completedAt !== undefined) {
      updates.push('completedAt = ?');
      values.push(completedAt);
    }

    updates.push('updatedAt = ?');
    values.push(Date.now());
    values.push(id);

    db.prepare(`UPDATE features SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdateFeatureStatus error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении фичи' }
    });
  }
};

// Удалить фичу (admin)
exports.deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = db.prepare('SELECT id FROM features WHERE id = ?').get(id);
    if (!feature) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Фича не найдена' }
      });
    }

    db.prepare('DELETE FROM features WHERE id = ?').run(id);

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteFeature error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении фичи' }
    });
  }
};
