/**
 * Messages Controller
 * Отправка, получение, редактирование сообщений
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

// Получить историю сообщений
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { limit = 50, before, after } = req.query;

    const chat = db.prepare('SELECT participants FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const participants = JSON.parse(chat.participants);
    if (!participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этого чата' }
      });
    }

    let query = `
      SELECT m.*, u.displayName as senderName, u.avatar as senderAvatar
      FROM messages m
      LEFT JOIN users u ON m.senderId = u.id
      WHERE m.chatId = ?
    `;

    const params = [chatId];

    if (before) {
      query += ' AND m.createdAt < (SELECT createdAt FROM messages WHERE id = ?)';
      params.push(before);
    } else if (after) {
      query += ' AND m.createdAt > (SELECT createdAt FROM messages WHERE id = ?)';
      params.push(after);
    }

    query += ' ORDER BY m.createdAt DESC LIMIT ?';
    params.push(parseInt(limit));

    const messages = db.prepare(query).all(...params);

    // Для пагинации "вверх" нужно перевернуть порядок
    if (before) {
      messages.reverse();
    }

    const hasMore = messages.length === parseInt(limit);
    if (hasMore) {
      messages.pop(); // Убираем последний элемент (он уже есть в следующей странице)
    }

    res.json({
      success: true,
      data: {
        messages: messages.map(msg => ({
          id: msg.id,
          chatId: msg.chatId,
          senderId: msg.senderId,
          sender: {
            id: msg.senderId,
            displayName: msg.senderName,
            avatar: msg.senderAvatar
          },
          type: msg.type,
          content: msg.content,
          encryptedInfo: msg.encryptedInfo ? JSON.parse(msg.encryptedInfo) : null,
          attachmentId: msg.attachmentId,
          attachment: msg.attachmentId ? getAttachment(msg.attachmentId) : null,
          replyToId: msg.replyToId,
          replyToMessage: msg.replyToId ? getReplyToMessage(msg.replyToId) : null,
          forwardFromId: msg.forwardFromId,
          reactions: JSON.parse(msg.reactions || '{}'),
          reactionsCount: countReactions(msg.reactions),
          readBy: JSON.parse(msg.readBy || '[]'),
          isRead: JSON.parse(msg.readBy || '[]').includes(req.user.id),
          isEdited: !!msg.edited,
          editedAt: msg.editedAt,
          createdAt: msg.createdAt,
          status: msg.status
        })),
        hasMore
      }
    });
  } catch (error) {
    console.error('GetMessages error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при получении сообщений' }
    });
  }
};

// Вспомогательная функция для получения вложения
function getAttachment(attachmentId) {
  const attachment = db.prepare('SELECT * FROM attachments WHERE id = ?').get(attachmentId);
  if (!attachment) return null;
  return {
    id: attachment.id,
    fileName: attachment.fileName,
    mimeType: attachment.mimeType,
    fileSize: attachment.fileSize,
    yandexDiskPath: attachment.yandexDiskPath,
    publicUrl: attachment.publicUrl,
    thumbnailUrl: attachment.thumbnailUrl,
    width: attachment.width,
    height: attachment.height,
    duration: attachment.duration
  };
}

// Вспомогательная функция для получения reply сообщения
function getReplyToMessage(messageId) {
  const msg = db.prepare('SELECT m.*, u.displayName as senderName FROM messages m LEFT JOIN users u ON m.senderId = u.id WHERE m.id = ?').get(messageId);
  if (!msg) return null;
  return {
    id: msg.id,
    content: msg.content,
    type: msg.type,
    senderId: msg.senderId,
    senderName: msg.senderName
  };
}

// Вспомогательная функция для подсчёта реакций
function countReactions(reactionsJson) {
  const reactions = JSON.parse(reactionsJson || '{}');
  const counts = {};
  
  Object.values(reactions).forEach(reaction => {
    const emoji = reaction.emoji;
    counts[emoji] = (counts[emoji] || 0) + 1;
  });
  
  return counts;
}

// Отправить сообщение
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, type = 'text', encryptedInfo, attachmentId, replyToId, forwardFromId } = req.body;

    const chat = db.prepare('SELECT participants, type FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const participants = JSON.parse(chat.participants);
    if (!participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этого чата' }
      });
    }

    // Проверка прав для групп
    if (chat.type === 'group') {
      const members = JSON.parse(chat.members || '{}');
      const role = members[req.user.id]?.role;
      
      if (role === 'reader' && type === 'text') {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'У вас нет прав на отправку сообщений' }
        });
      }
    }

    const messageId = uuidv4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO messages (id, chatId, senderId, type, content, encryptedInfo, attachmentId, replyToId, forwardFromId, reactions, readBy, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '{}', '[]', 'sent', ?, ?)
    `).run(messageId, chatId, req.user.id, type, content || '', encryptedInfo ? JSON.stringify(encryptedInfo) : null, attachmentId || null, replyToId || null, forwardFromId || null, now, now);

    // Обновить lastMessage в чате
    const messageData = {
      id: messageId,
      content: content,
      type: type,
      createdAt: now,
      senderId: req.user.id
    };

    db.prepare('UPDATE chats SET lastMessage = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(messageData), now, chatId);

    // TODO: Отправить WebSocket событие всем в чате

    res.status(201).json({
      success: true,
      data: {
        id: messageId,
        chatId,
        senderId: req.user.id,
        type,
        content,
        encryptedInfo,
        attachmentId,
        replyToId,
        createdAt: now,
        status: 'sent'
      }
    });
  } catch (error) {
    console.error('SendMessage error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при отправке сообщения' }
    });
  }
};

// Редактировать сообщение
exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content, encryptedInfo } = req.body;

    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: { code: 'MESSAGE_NOT_FOUND', message: 'Сообщение не найдено' }
      });
    }

    if (message.senderId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Можно редактировать только свои сообщения' }
      });
    }

    const now = Date.now();
    db.prepare(`
      UPDATE messages 
      SET content = ?, encryptedInfo = ?, edited = 1, editedAt = ?, updatedAt = ?
      WHERE id = ?
    `).run(content, encryptedInfo ? JSON.stringify(encryptedInfo) : null, now, now, messageId);

    res.json({
      success: true,
      data: {
        id: messageId,
        content,
        isEdited: true,
        editedAt: now
      }
    });
  } catch (error) {
    console.error('EditMessage error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при редактировании сообщения' }
    });
  }
};

// Удалить сообщение
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { deleteForEveryone } = req.query;

    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: { code: 'MESSAGE_NOT_FOUND', message: 'Сообщение не найдено' }
      });
    }

    const chat = db.prepare('SELECT members FROM chats WHERE id = ?').get(message.chatId);
    const members = JSON.parse(chat?.members || '{}');
    const userRole = members[req.user.id]?.role;

    if (message.senderId !== req.user.id && userRole !== 'creator' && userRole !== 'moderator') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Можно удалять только свои сообщения' }
      });
    }

    if (deleteForEveryone === 'true') {
      // Полное удаление
      db.prepare('DELETE FROM messages WHERE id = ?').run(messageId);
    } else {
      // Пометить как удалённое
      db.prepare('UPDATE messages SET content = ?, type = ?, isDeleted = 1, updatedAt = ? WHERE id = ?')
        .run('Сообщение удалено', 'system', Date.now(), messageId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('DeleteMessage error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении сообщения' }
    });
  }
};

// Добавить реакцию
exports.addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const validEmojis = ['👍', '👎', '❤️', '😍', '🎉', '🔥', '😂', '😢', '😮', '👏', '🤔', '😎', '😐', '🤯', '🥳', '💯'];
    if (!validEmojis.includes(emoji)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Неверная реакция' }
      });
    }

    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: { code: 'MESSAGE_NOT_FOUND', message: 'Сообщение не найдено' }
      });
    }

    const reactions = JSON.parse(message.reactions || '{}');
    reactions[req.user.id] = {
      emoji,
      userId: req.user.id,
      createdAt: Date.now()
    };

    db.prepare('UPDATE messages SET reactions = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(reactions), Date.now(), messageId);

    res.json({ success: true });
  } catch (error) {
    console.error('AddReaction error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при добавлении реакции' }
    });
  }
};

// Удалить реакцию
exports.removeReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.params;

    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: { code: 'MESSAGE_NOT_FOUND', message: 'Сообщение не найдено' }
      });
    }

    const reactions = JSON.parse(message.reactions || '{}');
    delete reactions[req.user.id];

    db.prepare('UPDATE messages SET reactions = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(reactions), Date.now(), messageId);

    res.json({ success: true });
  } catch (error) {
    console.error('RemoveReaction error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при удалении реакции' }
    });
  }
};

// Подтвердить прочтение
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: { code: 'MESSAGE_NOT_FOUND', message: 'Сообщение не найдено' }
      });
    }

    const readBy = JSON.parse(message.readBy || '[]');
    if (!readBy.includes(req.user.id)) {
      readBy.push(req.user.id);

      db.prepare('UPDATE messages SET readBy = ?, updatedAt = ? WHERE id = ?')
        .run(JSON.stringify(readBy), Date.now(), messageId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('MarkAsRead error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при подтверждении прочтения' }
    });
  }
};

// Переслать сообщение
exports.forwardMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { chatId } = req.body;

    // Проверка исходного сообщения
    const originalMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        error: { code: 'MESSAGE_NOT_FOUND', message: 'Сообщение не найдено' }
      });
    }

    // Проверка целевого чата
    const chat = db.prepare('SELECT participants, type FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAT_NOT_FOUND', message: 'Чат не найден' }
      });
    }

    const participants = JSON.parse(chat.participants);
    if (!participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Вы не участник этого чата' }
      });
    }

    // Создание пересланного сообщения
    const newMessageId = uuidv4();
    const now = Date.now();

    db.prepare(`
      INSERT INTO messages (id, chatId, senderId, type, content, encryptedInfo, attachmentId, forwardFromId, reactions, readBy, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, '{}', '[]', 'sent', ?, ?)
    `).run(
      newMessageId, 
      chatId, 
      req.user.id, 
      originalMessage.type, 
      originalMessage.content, 
      originalMessage.encryptedInfo, 
      originalMessage.attachmentId, 
      messageId, // forwardFromId - ссылка на оригинальное сообщение
      now, 
      now
    );

    // Обновить lastMessage в чате
    const messageData = {
      id: newMessageId,
      content: originalMessage.content,
      type: originalMessage.type,
      createdAt: now,
      senderId: req.user.id
    };

    db.prepare('UPDATE chats SET lastMessage = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(messageData), now, chatId);

    res.status(201).json({
      success: true,
      data: {
        id: newMessageId,
        chatId,
        senderId: req.user.id,
        type: originalMessage.type,
        content: originalMessage.content,
        forwardFromId: messageId,
        forwardFrom: {
          id: originalMessage.id,
          senderId: originalMessage.senderId,
          senderName: db.prepare('SELECT displayName FROM users WHERE id = ?').get(originalMessage.senderId)?.displayName
        },
        createdAt: now,
        status: 'sent'
      }
    });
  } catch (error) {
    console.error('ForwardMessage error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Ошибка при пересылке сообщения' }
    });
  }
};
