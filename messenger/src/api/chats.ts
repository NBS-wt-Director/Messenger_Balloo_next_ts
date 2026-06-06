/**
 * Chats API Wrapper
 * Обёртка для вызова чатов через новый внешний API
 */

import { chatsApi, messagesApi } from './client';

/**
 * Получить список чатов
 */
export async function getChats(userId?: string) {
  try {
    const response = await chatsApi.get();
    
    if (response.success && response.data) {
      return { 
        success: true, 
        chats: response.data 
      };
    }
    
    return { success: false, error: response.error?.message || 'Unknown error' };
  } catch (error: any) {
    console.error('[Chats API] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить сообщения чата
 */
export async function getMessages(chatId: string, params?: { limit?: number; before?: number }) {
  try {
    const response = await messagesApi.get(chatId, params);
    
    if (response.success && response.data) {
      return { success: true, messages: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Unknown error' };
  } catch (error: any) {
    console.error('[Get Messages] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Отправить сообщение
 */
export async function sendMessage(chatId: string, data: { text?: string; attachmentIds?: string[]; replyToId?: string }) {
  try {
    const response = await messagesApi.send(chatId, {
      text: data.text,
      attachmentIds: data.attachmentIds,
      // replyToId пока не поддерживается API
    });
    
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
 * Получить чат по ID
 */
export async function getChatById(chatId: string) {
  try {
    const response = await chatsApi.getById(chatId);
    
    if (response.success && response.data) {
      return { success: true, chat: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Chat not found' };
  } catch (error: any) {
    console.error('[Chat by ID] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Создать чат
 */
export async function createChat(data: { name?: string; type: 'direct' | 'group'; participantIds?: string[] }) {
  try {
    const response = await chatsApi.create(data);
    
    if (response.success && response.data) {
      return { success: true, chat: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Failed to create chat' };
  } catch (error: any) {
    console.error('[Create Chat] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Обновить чат
 */
export async function updateChat(chatId: string, data: Partial<{ name: string; avatar: string; description: string }>) {
  try {
    const response = await chatsApi.update(chatId, data);
    
    if (response.success && response.data) {
      return { success: true, chat: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Failed to update chat' };
  } catch (error: any) {
    console.error('[Update Chat] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Закрепить/открепить чат
 */
export async function togglePin(chatId: string) {
  try {
    const response = await chatsApi.togglePin(chatId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to toggle pin' };
  } catch (error: any) {
    console.error('[Toggle Pin] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Добавить/убрать из избранного
 */
export async function toggleFavorite(chatId: string) {
  try {
    const response = await chatsApi.toggleFavorite(chatId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to toggle favorite' };
  } catch (error: any) {
    console.error('[Toggle Favorite] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Очистить чат
 */
export async function clearChat(chatId: string) {
  try {
    // Используем delete для очистки
    const response = await chatsApi.delete(chatId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to clear chat' };
  } catch (error: any) {
    console.error('[Clear Chat] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Удалить чат
 */
export async function deleteChat(chatId: string) {
  try {
    const response = await chatsApi.delete(chatId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to delete chat' };
  } catch (error: any) {
    console.error('[Delete Chat] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Пометить как прочитанный
 */
export async function markAsRead(chatId: string) {
  try {
    const response = await chatsApi.markAsRead(chatId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to mark as read' };
  } catch (error: any) {
    console.error('[Mark as Read] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Отправить сигнал "печатает"
 */
export async function sendTyping(chatId: string) {
  try {
    const response = await chatsApi.typing(chatId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to send typing' };
  } catch (error: any) {
    console.error('[Send Typing] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Экспорт chatsApi для прямого использования
 */
export { chatsApi };

/**
 * Получить участников чата
 */
export async function getChatMembers(chatId: string) {
  try {
    const response = await chatsApi.getMembers(chatId);
    
    if (response.success && response.data) {
      return { success: true, members: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Failed to get members' };
  } catch (error: any) {
    console.error('[Get Members] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Добавить участника
 */
export async function addMember(chatId: string, userId: string) {
  try {
    const response = await chatsApi.addMember(chatId, userId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to add member' };
  } catch (error: any) {
    console.error('[Add Member] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Удалить участника
 */
export async function removeMember(chatId: string, userId: string) {
  try {
    const response = await chatsApi.removeMember(chatId, userId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to remove member' };
  } catch (error: any) {
    console.error('[Remove Member] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Отключить/включить уведомления (Mute)
 */
export async function toggleMute(chatId: string, muted: boolean, muteUntil?: number | null) {
  try {
    const response = await fetch(`/api/v1/chats/${chatId}/mute`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`
      },
      body: JSON.stringify({
        muted,
        muteUntil: muteUntil || null
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return { success: true };
    }
    
    return { success: false, error: result.error?.message || 'Failed to toggle mute' };
  } catch (error: any) {
    console.error('[Toggle Mute] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}
