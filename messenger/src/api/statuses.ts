/**
 * Statuses API
 * Обёртка для вызова статусов через API
 */

import apiClient from './client';

export interface Status {
  id: string;
  userId: string;
  displayName: string;
  avatar?: string;
  type: 'image' | 'video';
  attachmentId: string;
  publicUrl?: string;
  viewCount: number;
  isViewed: boolean;
  createdAt: number;
  expiresAt: number;
}

/**
 * Получить статусы контактов
 */
export async function getStatuses(): Promise<{ success: boolean; statuses?: Status[]; error?: string }> {
  try {
    const response = await apiClient.get('/statuses');
    if (response.data.success) {
      return { success: true, statuses: response.data.data.statuses };
    }
    return { success: false, error: response.data.error?.message || 'Unknown error' };
  } catch (error: any) {
    console.error('[Statuses API] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Загрузить статус
 */
export async function uploadStatus(
  file: File,
  type: 'image' | 'video'
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiClient.post('/statuses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: response.data.error?.message || 'Failed to upload status' };
  } catch (error: any) {
    console.error('[Upload Status] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Отметить статус как просмотренный
 */
export async function viewStatus(statusId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await apiClient.post(`/statuses/${statusId}/view`);
    if (response.data.success) {
      return { success: true };
    }
    return { success: false, error: response.data.error?.message || 'Failed to view status' };
  } catch (error: any) {
    console.error('[View Status] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить информацию о статусе
 */
export async function getStatus(statusId: string): Promise<{ success: boolean; data?: Status; error?: string }> {
  try {
    const response = await apiClient.get(`/statuses/${statusId}`);
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: response.data.error?.message || 'Failed to get status' };
  } catch (error: any) {
    console.error('[Get Status] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Удалить статус
 */
export async function deleteStatus(statusId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await apiClient.delete(`/statuses/${statusId}`);
    if (response.data.success) {
      return { success: true };
    }
    return { success: false, error: response.data.error?.message || 'Failed to delete status' };
  } catch (error: any) {
    console.error('[Delete Status] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}
