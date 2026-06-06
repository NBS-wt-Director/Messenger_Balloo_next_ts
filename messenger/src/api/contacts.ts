/**
 * Contacts API Wrapper
 * Обёртка для вызова контактов через новый внешний API
 */

import { contactsApi } from './client';

/**
 * Получить список контактов
 */
export async function getContacts(params?: { search?: string; isFavorite?: boolean }) {
  try {
    const response = await contactsApi.get(params);
    
    if (response.success && response.data) {
      return { success: true, contacts: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Failed to get contacts' };
  } catch (error: any) {
    console.error('[Contacts API] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Добавить контакт
 */
export async function addContact(userId: string, displayName?: string) {
  try {
    const response = await contactsApi.add(userId, displayName);
    
    if (response.success && response.data) {
      return { success: true, contact: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Failed to add contact' };
  } catch (error: any) {
    console.error('[Add Contact] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Удалить контакт
 */
export async function removeContact(userId: string) {
  try {
    const response = await contactsApi.remove(userId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to remove contact' };
  } catch (error: any) {
    console.error('[Remove Contact] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Добавить/убрать из избранного
 */
export async function toggleFavoriteContact(userId: string) {
  try {
    const response = await contactsApi.toggleFavorite(userId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to toggle favorite' };
  } catch (error: any) {
    console.error('[Toggle Favorite Contact] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Заблокировать/разблокировать
 */
export async function toggleBlockContact(userId: string) {
  try {
    const response = await contactsApi.toggleBlock(userId);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to toggle block' };
  } catch (error: any) {
    console.error('[Toggle Block] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить запросы в друзья
 */
export async function getContactRequests(type?: 'received' | 'sent') {
  try {
    const response = await contactsApi.getRequests(type);
    
    if (response.success && response.data) {
      return { success: true, requests: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Failed to get requests' };
  } catch (error: any) {
    console.error('[Get Requests] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Отправить запрос в друзья
 */
export async function sendContactRequest(userId: string, message?: string) {
  try {
    const response = await contactsApi.sendRequest(userId, message);
    
    if (response.success && response.data) {
      return { success: true, request: response.data };
    }
    
    return { success: false, error: response.error?.message || 'Failed to send request' };
  } catch (error: any) {
    console.error('[Send Request] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Обработать запрос (принять/отклонить)
 */
export async function handleContactRequest(requestId: string, action: 'accept' | 'reject') {
  try {
    const response = await contactsApi.handleRequest(requestId, action);
    
    if (response.success) {
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Failed to handle request' };
  } catch (error: any) {
    console.error('[Handle Request] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}
