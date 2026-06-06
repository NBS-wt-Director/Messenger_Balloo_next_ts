/**
 * Reports Controller
 * Отчёты и модерация
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

// Создать отчёт
exports.createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;

    const validTargets = ['chat', 'user', 'contact', 'invitation'];
    const validReasons = ['spam', 'harassment', 'inappropriate', 'fake', 'other'];

    if (!targetType || !validTargets.includes(targetType)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Неверный тип цели' }
      });
    }

    if (!targetId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID цели обязателен' }
      });
    }

    if (!reason || !validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Неверная причина' }
      });
    }

    const reportId = uuidv4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO reports (id, targetType, targetId, reportedBy, reason, description, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `).run(reportId, targetType, targetId, req.user.id, reason, description || '', now, now);

    res.status(201).json({
      success: true,
      data: {
        id: reportId,
        targetType,
        targetId,
        reason,
        status: 'pending',
        createdAt: now
      }
    });
  } catch (error) {
    console.error('CreateReport error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при создании отчёта' }
    });
  }
};

// Получить список отчётов (для админов)
exports.getReports = async (req, res) => {
  try {
    const { status, targetType, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM reports WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (targetType) {
      query += ' AND targetType = ?';
      params.push(targetType);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const reports = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: {
        reports: reports.map(r => ({
          id: r.id,
          targetType: r.targetType,
          targetId: r.targetId,
          reportedBy: r.reportedBy,
          reason: r.reason,
          description: r.description,
          status: r.status,
          reviewedBy: r.reviewedBy,
          reviewedAt: r.reviewedAt,
          resolution: r.resolution,
          createdAt: r.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('GetReports error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении отчётов' }
    });
  }
};

// Обработать отчёт (для админов)
exports.processReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, resolution } = req.body;

    const validStatuses = ['pending', 'reviewing', 'resolved', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Неверный статус' }
      });
    }

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Отчёт не найден' }
      });
    }

    db.prepare(`
      UPDATE reports 
      SET status = ?, resolution = ?, reviewedBy = ?, reviewedAt = ?, updatedAt = ?
      WHERE id = ?
    `).run(status, resolution || '', req.user.id, Date.now(), Date.now(), reportId);

    res.json({ success: true });
  } catch (error) {
    console.error('ProcessReport error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обработке отчёта' }
    });
  }
};
