/**
 * Messages API Wrapper
 * Обёртка для вызова сообщений через новый внешний API
 */

import { messagesApi } from './client';

/**
 * Получить сообщения чата
 */
export async function getMessages(chatId: string, params?: { limit?: number; before?: number; after?: number }) {
  try {
    const response = await messagesApi.get(chatId, params);
    
    if (response.success && response.data) {
      return { success: true, messages: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Failed to get messages' };
  } catch (error: any) {
    console.error('[Messages API] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Отправить сообщение
 */
export async function sendMessage(chatId: string, data: { text?: string; attachmentIds?: string[] }) {
  try {
    const response = await messagesApi.send(chatId, data);
    
    if (response.success && response.data) {
      return { success: true, message: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Failed to send message' };
  } catch (error: any) {
    console.error('[Send Message] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Редактировать сообщение
 */
export async function editMessage(messageId: string, text: string) {
  try {
    const response = await messagesApi.edit(messageId, text);
    
    if (response.success && response.data) {
      return { success: true, message: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Failed to edit message' };
  } catch (error: any) {
    console.error('[Edit Message] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Удалить сообщение
 */
export async function deleteMessage(messageId: string) {
  try {
    const response = await messagesApi.delete(messageId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to delete message' };
  } catch (error: any) {
    console.error('[Delete Message] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Добавить реакцию
 */
export async function addReaction(messageId: string, emoji: string) {
  try {
    const response = await messagesApi.addReaction(messageId, emoji);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to add reaction' };
  } catch (error: any) {
    console.error('[Add Reaction] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Удалить реакцию
 */
export async function removeReaction(messageId: string, emoji: string) {
  try {
    const response = await messagesApi.removeReaction(messageId, emoji);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to remove reaction' };
  } catch (error: any) {
    console.error('[Remove Reaction] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Пометить сообщение как прочитанное
 */
export async function markMessageAsRead(messageId: string) {
  try {
    const response = await messagesApi.markAsRead(messageId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to mark as read' };
  } catch (error: any) {
    console.error('[Mark Message as Read] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}
