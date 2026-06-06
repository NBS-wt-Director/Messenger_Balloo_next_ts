/**
 * API Client
 * Централизованный клиент для вызова API
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Получаем базовый URL API из окружения
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

// Интерфейс ответа API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Создаем axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - добавляем токен
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Получаем токен из localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Добавляем заголовок для определения клиента
    if (config.headers) {
      config.headers['X-Client'] = 'messenger';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Если ошибка 401 и это не попытка рефреша токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Пробуем обновить токен
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Сохраняем новые токены
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', accessToken);
          localStorage.setItem('refresh_token', newRefreshToken);
        }
        
        // Повторяем запрос с новым токеном
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Ошибка при обновлении токена - очищаем сессию
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
        }
        
        // Перенаправляем на логин (если это не сам логин)
        if (typeof window !== 'undefined' && !originalRequest.url?.includes('/auth/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// AUTH
// ============================================
export const authApi = {
  register: async (email: string, password: string, displayName: string) => {
    const response = await apiClient.post<ApiResponse<{ userId: string }>>('/auth/register', {
      email,
      password,
      displayName,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string; user: any }>>(
      '/auth/login',
      { email, password }
    );
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email });
    return response.data;
  },

  verifyCode: async (email: string, code: string) => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/verify-code', { email, code });
    return response.data;
  },

  resetPassword: async (email: string, code: string, newPassword: string) => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', {
      email,
      code,
      newPassword,
    });
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiClient.put<ApiResponse<void>>('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  getSessions: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/auth/sessions');
    return response.data;
  },

  terminateSession: async (sessionId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/auth/sessions/${sessionId}`);
    return response.data;
  },

  terminateAllSessions: async () => {
    const response = await apiClient.delete<ApiResponse<void>>('/auth/sessions');
    return response.data;
  },
};

// ============================================
// USERS
// ============================================
export const usersApi = {
  search: async (query: string) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/users/search', { params: { query } });
    return response.data;
  },

  getById: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/users/${userId}`);
    return response.data;
  },

  updateMe: async (data: Partial<{ displayName: string; bio: string; phone: string }>) => {
    const response = await apiClient.put<ApiResponse<any>>('/users/me', data);
    return response.data;
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.put<ApiResponse<any>>('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateStatus: async (status: string) => {
    const response = await apiClient.put<ApiResponse<any>>('/users/me/status', { status });
    return response.data;
  },

  getContacts: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/users/me/contacts');
    return response.data;
  },

  getDevices: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/users/me/devices');
    return response.data;
  },

  updateDevice: async (deviceId: string, data: any) => {
    const response = await apiClient.put<ApiResponse<any>>(`/users/me/devices/${deviceId}`, data);
    return response.data;
  },

  deleteDevice: async (deviceId: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/users/me/devices/${deviceId}`);
    return response.data;
  },
};

// ============================================
// CHATS
// ============================================
export const chatsApi = {
  get: async (params?: { limit?: number; offset?: number; favorite?: boolean; pinned?: boolean }) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/chats', { params });
    return response.data;
  },

  create: async (data: { name?: string; type: 'direct' | 'group'; participantIds?: string[] }) => {
    const response = await apiClient.post<ApiResponse<any>>('/chats', data);
    return response.data;
  },

  getById: async (chatId: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/chats/${chatId}`);
    return response.data;
  },

  update: async (chatId: string, data: Partial<{ name: string; avatar: string; description: string }>) => {
    const response = await apiClient.put<ApiResponse<any>>(`/chats/${chatId}`, data);
    return response.data;
  },

  delete: async (chatId: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/chats/${chatId}`);
    return response.data;
  },

  toggleFavorite: async (chatId: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/chats/${chatId}/favorite`);
    return response.data;
  },

  togglePin: async (chatId: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/chats/${chatId}/pin`);
    return response.data;
  },

  toggleMute: async (chatId: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/chats/${chatId}/mute`);
    return response.data;
  },

  markAsRead: async (chatId: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/chats/${chatId}/read`);
    return response.data;
  },

  typing: async (chatId: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/chats/${chatId}/typing`);
    return response.data;
  },

  getMembers: async (chatId: string) => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/chats/${chatId}/members`);
    return response.data;
  },

  addMember: async (chatId: string, userId: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/chats/${chatId}/members`, { userId });
    return response.data;
  },

  removeMember: async (chatId: string, userId: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/chats/${chatId}/members/${userId}`);
    return response.data;
  },
};

// ============================================
// MESSAGES
// ============================================
export const messagesApi = {
  get: async (chatId: string, params?: { limit?: number; before?: number; after?: number }) => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/chats/${chatId}/messages`, { params });
    return response.data;
  },

  send: async (chatId: string, data: { text?: string; attachmentIds?: string[] }) => {
    const response = await apiClient.post<ApiResponse<any>>(`/chats/${chatId}/messages`, data);
    return response.data;
  },

  edit: async (messageId: string, text: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/messages/${messageId}`, { text });
    return response.data;
  },

  delete: async (messageId: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/messages/${messageId}`);
    return response.data;
  },

  addReaction: async (messageId: string, emoji: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/messages/${messageId}/reactions`, { emoji });
    return response.data;
  },

  removeReaction: async (messageId: string, emoji: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/messages/${messageId}/reactions/${emoji}`);
    return response.data;
  },

  markAsRead: async (messageId: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/messages/${messageId}/read`);
    return response.data;
  },

  forward: async (messageId: string, chatId: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/messages/${messageId}/forward`, { chatId });
    return response.data;
  },
};

// ============================================
// NOTIFICATIONS
// ============================================
export const notificationsApi = {
  getVapidKey: async () => {
    const response = await apiClient.get<ApiResponse<{ publicKey: string }>>('/notifications/vapid-key');
    return response.data;
  },

  subscribe: async (subscription: PushSubscriptionJSON) => {
    const response = await apiClient.post<ApiResponse<{ subscriptionId: string }>>('/notifications/subscribe', {
      subscription,
    });
    return response.data;
  },

  get: async (params?: { limit?: number; offset?: number; read?: boolean }) => {
    const response = await apiClient.get<ApiResponse<any>>('/notifications', { params });
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.put<ApiResponse<any>>('/notifications/read-all');
    return response.data;
  },

  delete: async (notificationId: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/notifications/${notificationId}`);
    return response.data;
  },
};

// ============================================
// CONTACTS
// ============================================
export const contactsApi = {
  get: async (params?: { search?: string; isFavorite?: boolean }) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/contacts', { params });
    return response.data;
  },

  add: async (userId: string, displayName?: string) => {
    const response = await apiClient.post<ApiResponse<any>>('/contacts', { userId, displayName });
    return response.data;
  },

  remove: async (userId: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/contacts/${userId}`);
    return response.data;
  },

  toggleFavorite: async (userId: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/contacts/${userId}/favorite`);
    return response.data;
  },

  toggleBlock: async (userId: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/contacts/${userId}/block`);
    return response.data;
  },

  getRequests: async (type?: 'received' | 'sent') => {
    const response = await apiClient.get<ApiResponse<any>>('/contacts/requests', { params: { type } });
    return response.data;
  },

  sendRequest: async (userId: string, message?: string) => {
    const response = await apiClient.post<ApiResponse<any>>('/contacts/requests', { userId, message });
    return response.data;
  },

  handleRequest: async (requestId: string, action: 'accept' | 'reject') => {
    const response = await apiClient.put<ApiResponse<any>>(`/contacts/requests/${requestId}`, { action });
    return response.data;
  },
};

// ============================================
// INVITATIONS
// ============================================
export const invitationsApi = {
  get: async (params?: { chatId?: string; isActive?: boolean }) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/invitations', { params });
    return response.data;
  },

  create: async (data: { chatId: string; isPermanent?: boolean; maxUses?: number; expiresAt?: number }) => {
    const response = await apiClient.post<ApiResponse<any>>('/invitations', data);
    return response.data;
  },

  delete: async (invitationId: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/invitations/${invitationId}`);
    return response.data;
  },

  revoke: async (invitationId: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/invitations/${invitationId}/revoke`);
    return response.data;
  },

  getInfo: async (code: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/invite/${code}`);
    return response.data;
  },

  accept: async (code: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/invite/${code}/accept`);
    return response.data;
  },
};

// ============================================
// FEATURES (Голосования)
// ============================================
export const featuresApi = {
  get: async (params?: { status?: string; limit?: number; offset?: number }) => {
    const response = await apiClient.get<ApiResponse<any>>('/features', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/features/${id}`);
    return response.data;
  },

  create: async (data: { title: string; description: string }) => {
    const response = await apiClient.post<ApiResponse<any>>('/features', data);
    return response.data;
  },

  vote: async (id: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/features/${id}/vote`);
    return response.data;
  },
};

// ============================================
// PAGES
// ============================================
export const pagesApi = {
  get: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/pages');
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/pages/${slug}`);
    return response.data;
  },
};

// ============================================
// YANDEX DISK
// ============================================
export const yandexApi = {
  getAuthUrl: async () => {
    const response = await apiClient.get<ApiResponse<{ url: string }>>('/disk/auth');
    return response.data;
  },

  getStatus: async () => {
    const response = await apiClient.get<ApiResponse<{ linked: boolean }>>('/disk/status');
    return response.data;
  },

  link: async () => {
    const response = await apiClient.post<ApiResponse<{ url: string }>>('/disk/link');
    return response.data;
  },

  unlink: async () => {
    const response = await apiClient.post<ApiResponse<void>>('/disk/unlink');
    return response.data;
  },

  getQuota: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/disk/quota');
    return response.data;
  },

  listFiles: async (path?: string) => {
    const response = await apiClient.get<ApiResponse<any>>('/disk/files', { params: { path } });
    return response.data;
  },

  uploadFile: async (file: File, diskPath?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (diskPath) {
      formData.append('diskPath', diskPath);
    }
    
    const response = await apiClient.post<ApiResponse<any>>('/disk/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteFile: async (diskPath: string) => {
    const response = await apiClient.delete<ApiResponse<any>>('/disk/files', { data: { diskPath } });
    return response.data;
  },

  getFileInfo: async (diskPath: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/disk/files/${encodeURIComponent(diskPath)}`);
    return response.data;
  },
};

// ============================================
// UTILS
// ============================================

/**
 * Получить базовый URL API
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

/**
 * Получить WebSocket URL
 */
export function getWsUrl(): string {
  return WS_URL;
}

/**
 * Установить токен (для использования после логина)
 */
export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

/**
 * Удалить токен (при логуте)
 */
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
}

export default apiClient;
