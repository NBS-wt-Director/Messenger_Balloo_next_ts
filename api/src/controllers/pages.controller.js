/**
 * Pages Controller
 * Управление статическими страницами (about, privacy, terms, support, etc.)
 */

const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Получить все активные страницы
exports.getPages = async (req, res) => {
  try {
    const pages = db.prepare(`
      SELECT id, slug, title, sections, metadata, isActive, createdAt, updatedAt
      FROM pages WHERE isActive = 1 ORDER BY createdAt ASC
    `).all();

    res.json({
      success: true,
      data: {
        pages: pages.map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          sections: JSON.parse(p.sections || '[]'),
          metadata: JSON.parse(p.metadata || '{}'),
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error('GetPages error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении страниц' }
    });
  }
};

// Получить страницу по slug
exports.getPage = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = db.prepare(`
      SELECT * FROM pages WHERE slug = ? AND isActive = 1
    `).get(slug);

    if (!page) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Страница не найдена' }
      });
    }

    res.json({
      success: true,
      data: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content,
        sections: JSON.parse(page.sections || '[]'),
        metadata: JSON.parse(page.metadata || '{}'),
        createdAt: page.createdAt,
        updatedAt: page.updatedAt
      }
    });
  } catch (error) {
    console.error('GetPage error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении страницы' }
    });
  }
};

// Получить все страницы (для админа)
exports.getAllPages = async (req, res) => {
  try {
    const pages = db.prepare(`
      SELECT id, slug, title, isActive, createdAt, updatedAt
      FROM pages ORDER BY createdAt DESC
    `).all();

    res.json({
      success: true,
      data: {
        pages: pages.map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          isActive: !!p.isActive,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error('GetAllPages error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении страниц' }
    });
  }
};

// Создать страницу (admin)
exports.createPage = async (req, res) => {
  try {
    const { slug, title, content, sections, metadata, isActive = true } = req.body;

    if (!slug || !title || !content) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Slug, заголовок и контент обязательны' }
      });
    }

    // Проверка на дубликат slug
    const existing = db.prepare('SELECT id FROM pages WHERE slug = ?').get(slug);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { code: 'CONFLICT', message: 'Страница с таким slug уже существует' }
      });
    }

    const id = uuidv4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO pages (id, slug, title, content, sections, metadata, isActive, createdBy, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, slug, title, content, JSON.stringify(sections || []), JSON.stringify(metadata || {}), isActive ? 1 : 0, req.user.id, now, now);

    res.status(201).json({
      success: true,
      data: { id, slug, title, createdAt: now }
    });
  } catch (error) {
    console.error('CreatePage error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при создании страницы' }
    });
  }
};

// Обновить страницу (admin)
exports.updatePage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { slug, title, content, sections, metadata, isActive } = req.body;

    const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(pageId);
    if (!page) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Страница не найдена' }
      });
    }

    // Проверка на дубликат slug (если изменён)
    if (slug && slug !== page.slug) {
      const existing = db.prepare('SELECT id FROM pages WHERE slug = ? AND id != ?').get(slug, pageId);
      if (existing) {
        return res.status(400).json({
          success: false,
          error: { code: 'CONFLICT', message: 'Страница с таким slug уже существует' }
        });
      }
    }

    const updates = [];
    const values = [];

    if (slug !== undefined) {
      updates.push('slug = ?');
      values.push(slug);
    }
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
    if (sections !== undefined) {
      updates.push('sections = ?');
      values.push(JSON.stringify(sections));
    }
    if (metadata !== undefined) {
      updates.push('metadata = ?');
      values.push(JSON.stringify(metadata));
    }
    if (isActive !== undefined) {
      updates.push('isActive = ?');
      values.push(isActive ? 1 : 0);
    }

    updates.push('updatedAt = ?');
    values.push(Date.now());
    values.push(pageId);

    db.prepare(`UPDATE pages SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error('UpdatePage error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при обновлении страницы' }
    });
  }
};

// Удалить страницу (admin)
exports.deletePage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const page = db.prepare('SELECT id FROM pages WHERE id = ?').get(pageId);
    if (!page) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Страница не найдена' }
      });
    }

    db.prepare('DELETE FROM pages WHERE id = ?').run(pageId);

    res.json({ success: true });
  } catch (error) {
    console.error('DeletePage error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении страницы' }
    });
  }
};
