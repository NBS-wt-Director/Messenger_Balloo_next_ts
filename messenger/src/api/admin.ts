/**
 * Admin API Wrapper
 * Обёртка для вызова админки через новый внешний API
 */

import apiClient from './client';

/**
 * Получить статистику
 */
export async function getAdminStats() {
  try {
    const response = await apiClient.get('/admin/stats');
    
    if (response.data.success) {
      return { success: true, stats: response.data.data };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to get stats' };
  } catch (error: any) {
    console.error('[Admin Stats] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить пользователей
 */
export async function getUsers(params?: { limit?: number; offset?: number; role?: string }) {
  try {
    const response = await apiClient.get('/admin/users', { params });
    
    if (response.data.success) {
      return { success: true, users: response.data.data?.users || [] };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to get users' };
  } catch (error: any) {
    console.error('[Get Users] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Обновить роль пользователя
 */
export async function updateUserRole(userId: string, role: string) {
  try {
    const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
    
    if (response.data.success) {
      return { success: true };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to update role' };
  } catch (error: any) {
    console.error('[Update Role] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Заблокировать пользователя
 */
export async function blockUser(userId: string) {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    
    if (response.data.success) {
      return { success: true };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to block user' };
  } catch (error: any) {
    console.error('[Block User] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить чаты (админ)
 */
export async function getAdminChats(params?: { limit?: number; offset?: number }) {
  try {
    const response = await apiClient.get('/admin/chats', { params });
    
    if (response.data.success) {
      return { success: true, chats: response.data.data?.chats || [] };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to get chats' };
  } catch (error: any) {
    console.error('[Get Admin Chats] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить сообщения (админ)
 */
export async function searchAdminMessages(query: string) {
  try {
    const response = await apiClient.get('/admin/messages/search', { params: { q: query } });
    
    if (response.data.success) {
      return { success: true, messages: response.data.data?.messages || [] };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to search messages' };
  } catch (error: any) {
    console.error('[Search Messages] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить отчёты
 */
export async function getReports(params?: { limit?: number; offset?: number }) {
  try {
    const response = await apiClient.get('/admin/reports', { params });
    
    if (response.data.success) {
      return { success: true, reports: response.data.data?.reports || [] };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to get reports' };
  } catch (error: any) {
    console.error('[Get Reports] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Обработать отчёт
 */
export async function processReport(reportId: string, status: string, notes?: string) {
  try {
    const response = await apiClient.put(`/admin/reports/${reportId}`, { status, notes });
    
    if (response.data.success) {
      return { success: true };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to process report' };
  } catch (error: any) {
    console.error('[Process Report] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить версии
 */
export async function getVersions() {
  try {
    const response = await apiClient.get('/admin/versions');
    
    if (response.data.success) {
      return { success: true, versions: response.data.data?.versions || [] };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to get versions' };
  } catch (error: any) {
    console.error('[Get Versions] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Добавить версию
 */
export async function addVersion(data: { version: string; notes: string; platform: string }) {
  try {
    const response = await apiClient.post('/admin/versions', data);
    
    if (response.data.success) {
      return { success: true, version: response.data.data };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to add version' };
  } catch (error: any) {
    console.error('[Add Version] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить аналитику
 */
export async function getAnalytics(params?: { period?: string; startDate?: number; endDate?: number }) {
  try {
    const response = await apiClient.get('/admin/analytics', { params });
    
    if (response.data.success) {
      return { success: true, analytics: response.data.data };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to get analytics' };
  } catch (error: any) {
    console.error('[Get Analytics] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить системную информацию
 */
export async function getSystemInfo() {
  try {
    const response = await apiClient.get('/admin/system');
    
    if (response.data.success) {
      return { success: true, system: response.data.data };
    }
    
    return { success: false, error: response.data.error?.message || 'Failed to get system info' };
  } catch (error: any) {
    console.error('[Get System] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}
