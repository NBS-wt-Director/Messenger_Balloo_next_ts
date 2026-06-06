/**
 * Calls API
 * Обёртка для вызова звонков через API
 */

import apiClient from './client';

export interface Call {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser?: { id: string; displayName: string; avatar?: string };
  toUser?: { id: string; displayName: string; avatar?: string };
  chatId?: string;
  type: 'audio' | 'video';
  status: 'offered' | 'connected' | 'ended' | 'missed';
  recording?: boolean;
  recordingUrl?: string;
  duration?: number;
  createdAt: number;
  endedAt?: number;
}

/**
 * Создать звонок
 */
export async function createCall(
  toUserId: string,
  type: 'audio' | 'video',
  chatId?: string
): Promise<{ success: boolean; data?: Call; error?: string }> {
  try {
    const response = await apiClient.post('/calls', { toUserId, type, chatId });
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: response.data.error?.message || 'Failed to create call' };
  } catch (error: any) {
    console.error('[Calls API] Create call error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить информацию о звонке
 */
export async function getCall(callId: string): Promise<{ success: boolean; data?: Call; error?: string }> {
  try {
    const response = await apiClient.get(`/calls/${callId}`);
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: response.data.error?.message || 'Failed to get call' };
  } catch (error: any) {
    console.error('[Calls API] Get call error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить историю звонков
 */
export async function getCallHistory(params?: {
  limit?: number;
  offset?: number;
  type?: 'audio' | 'video';
  status?: string;
}): Promise<{ success: boolean; data?: { calls: Call[]; pagination: any }; error?: string }> {
  try {
    const response = await apiClient.get('/calls/history', { params });
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: response.data.error?.message || 'Failed to get call history' };
  } catch (error: any) {
    console.error('[Calls API] Get history error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Обновить состояние звонка (сигнализация)
 */
export async function updateCall(
  callId: string,
  data: { offer?: any; answer?: any; iceCandidate?: any }
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await apiClient.put(`/calls/${callId}`, data);
    if (response.data.success) {
      return { success: true };
    }
    return { success: false, error: response.data.error?.message || 'Failed to update call' };
  } catch (error: any) {
    console.error('[Calls API] Update call error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Завершить звонок
 */
export async function endCall(
  callId: string,
  duration: number,
  recording?: boolean
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await apiClient.post(`/calls/${callId}/end`, { duration, recording });
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: response.data.error?.message || 'Failed to end call' };
  } catch (error: any) {
    console.error('[Calls API] End call error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Получить запись звонка
 */
export async function getCallRecording(callId: string): Promise<{ success: boolean; data?: { callId: string; recordingUrl: string }; error?: string }> {
  try {
    const response = await apiClient.get(`/calls/${callId}/recording`);
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: response.data.error?.message || 'Failed to get recording' };
  } catch (error: any) {
    console.error('[Calls API] Get recording error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}
