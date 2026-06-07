/**
 * Lists Controller
 * Управление списками (чек-листы, списки дел, списки участников)
 */

const db = require('better-sqlite3')('./data/app.db');

/**
 * Создать список
 * POST /api/lists
 */
async function createList(data) {
  const {
    chatId,
    creatorId,
    title,
    description,
    items,
    settings,
    createdAt
  } = data;

  const listId = `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Вставить список
    db.prepare(`
      INSERT INTO List (id, chatId, creatorId, title, description, settings, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(listId, chatId, creatorId, title, description || '', JSON.stringify(settings), createdAt, createdAt);

    // Вставить элементы
    for (const item of items) {
      const itemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      db.prepare(`
        INSERT INTO ListItem (id, listId, text, description, completed, assignedTo, order, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(itemId, listId, item.text, item.description || '', false, item.assignedTo || null, item.order || 0, createdAt);
    }

    return { success: true, listId };
  } catch (error) {
    console.error('[Lists] Error creating list:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Получить список
 * GET /api/lists/:listId
 */
async function getList(listId) {
  try {
    const list = db.prepare('SELECT * FROM List WHERE id = ?').get(listId);
    
    if (!list) {
      return { success: false, error: 'Список не найден' };
    }

    const items = db.prepare(`
      SELECT * FROM ListItem 
      WHERE listId = ? 
      ORDER BY order ASC
    `).all(listId);

    return {
      success: true,
      list: {
        ...list,
        items
      }
    };
  } catch (error) {
    console.error('[Lists] Error getting list:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Добавить элемент в список
 * POST /api/lists/:listId/items
 */
async function addListItem(data) {
  const {
    listId,
    text,
    description,
    assignedTo,
    order,
    createdAt
  } = data;

  const itemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    db.prepare(`
      INSERT INTO ListItem (id, listId, text, description, completed, assignedTo, order, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(itemId, listId, text, description || '', false, assignedTo || null, order || 0, createdAt);

    return { success: true, itemId };
  } catch (error) {
    console.error('[Lists] Error adding item:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Обновить элемент списка
 * PUT /api/lists/:listId/items/:itemId
 */
async function updateListItem(listId, itemId, data) {
  try {
    const { text, description, completed, assignedTo, order } = data;

    const updates = [];
    const values = [];

    if (text !== undefined) {
      updates.push('text = ?');
      values.push(text);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (completed !== undefined) {
      updates.push('completed = ?');
      values.push(completed ? 1 : 0);
    }
    if (assignedTo !== undefined) {
      updates.push('assignedTo = ?');
      values.push(assignedTo);
    }
    if (order !== undefined) {
      updates.push('order = ?');
      values.push(order);
    }

    if (updates.length === 0) {
      return { success: false, error: 'Нет данных для обновления' };
    }

    values.push(itemId, listId);

    db.prepare(`
      UPDATE ListItem 
      SET ${updates.join(', ')}, updatedAt = ?
      WHERE id = ? AND listId = ?
    `).run(new Date().toISOString(), ...values);

    return { success: true };
  } catch (error) {
    console.error('[Lists] Error updating item:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Удалить элемент списка
 * DELETE /api/lists/:listId/items/:itemId
 */
async function deleteListItem(listId, itemId) {
  try {
    db.prepare('DELETE FROM ListItem WHERE id = ? AND listId = ?').run(itemId, listId);
    return { success: true };
  } catch (error) {
    console.error('[Lists] Error deleting item:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Получить статистику списка
 * GET /api/lists/:listId/stats
 */
async function getListStats(listId) {
  try {
    const list = db.prepare('SELECT * FROM List WHERE id = ?').get(listId);
    if (!list) {
      return { success: false, error: 'Список не найден' };
    }

    const items = db.prepare('SELECT * FROM ListItem WHERE listId = ?').all(listId);
    const completed = items.filter(i => i.completed).length;

    return {
      success: true,
      stats: {
        totalItems: items.length,
        completedItems: completed,
        pendingItems: items.length - completed,
        completionPercentage: items.length > 0 ? Math.round((completed / items.length) * 100) : 0
      }
    };
  } catch (error) {
    console.error('[Lists] Error getting stats:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Удалить список
 * DELETE /api/lists/:listId
 */
async function deleteList(listId) {
  try {
    // Удалить все элементы
    db.prepare('DELETE FROM ListItem WHERE listId = ?').run(listId);
    
    // Удалить список
    db.prepare('DELETE FROM List WHERE id = ?').run(listId);

    return { success: true };
  } catch (error) {
    console.error('[Lists] Error deleting list:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  createList,
  getList,
  addListItem,
  updateListItem,
  deleteListItem,
  getListStats,
  deleteList
};
