/**
 * Audio Messages API
 * Загрузка и воспроизведение голосовых сообщений
 */

import apiClient from './client';

export interface AudioMessage {
  id: string;
  messageId: string;
  chatId: string;
  uploaderId: string;
  fileName: string;
  duration: number;
  fileSize: number;
  publicUrl?: string;
  thumbnailUrl?: string;
  createdAt: number;
}

/**
 * Загрузить голосовое сообщение
 */
export async function uploadAudioMessage(
  file: File,
  chatId: string,
  messageId: string
): Promise<{ success: boolean; data?: AudioMessage; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chatId);
    formData.append('messageId', messageId);
    formData.append('type', 'audio');

    const response = await apiClient.post('/audio/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: response.data.error?.message || 'Failed to upload audio' };
  } catch (error: any) {
    console.error('[Upload Audio] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить URL для воспроизведения аудио
 */
export async function getAudioUrl(audioId: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const response = await apiClient.get(`/audio/${audioId}/play`);
    if (response.data.success) {
      return { success: true, url: response.data.data.url };
    }
    return { success: false, error: response.data.error?.message || 'Failed to get audio URL' };
  } catch (error: any) {
    console.error('[Get Audio URL] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Удалить голосовое сообщение
 */
export async function deleteAudioMessage(audioId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await apiClient.delete(`/audio/${audioId}`);
    if (response.data.success) {
      return { success: true };
    }
    return { success: false, error: response.data.error?.message || 'Failed to delete audio' };
  } catch (error: any) {
    console.error('[Delete Audio] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить информацию о голосовом сообщении
 */
export async function getAudioInfo(audioId: string): Promise<{ success: boolean; data?: AudioMessage; error?: string }> {
  try {
    const response = await apiClient.get(`/audio/${audioId}`);
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: response.data.error?.message || 'Failed to get audio info' };
  } catch (error: any) {
    console.error('[Get Audio Info] Error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}
