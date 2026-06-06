import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Users
export const usersApi = {
  list: async (params?: { limit?: number; offset?: number; search?: string; isAdmin?: boolean }) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },
  
  get: async (userId: string) => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },
  
  updateRole: async (userId: string, data: { isAdmin?: boolean; isSuperAdmin?: boolean; adminRoles?: string[] }) => {
    const response = await apiClient.put(`/admin/users/${userId}/role`, data);
    return response.data;
  },
  
  block: async (userId: string) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },
  
  resetPassword: async (userId: string, newPassword?: string) => {
    const response = await apiClient.post(`/admin/users/${userId}/reset-password`, { newPassword });
    return response.data;
  },
  
  getSessions: async (userId: string) => {
    const response = await apiClient.get(`/admin/users/${userId}/sessions`);
    return response.data;
  },
  
  terminateSession: async (userId: string, sessionId: string) => {
    const response = await apiClient.delete(`/admin/users/${userId}/sessions/${sessionId}`);
    return response.data;
  },
  
  terminateAllSessions: async (userId: string) => {
    const response = await apiClient.delete(`/admin/users/${userId}/sessions`);
    return response.data;
  },
  
  getDevices: async (userId: string) => {
    const response = await apiClient.get(`/admin/users/${userId}/devices`);
    return response.data;
  },
  
  deleteDevice: async (userId: string, deviceId: string) => {
    const response = await apiClient.delete(`/admin/users/${userId}/devices/${deviceId}`);
    return response.data;
  },
  
  getStats: async (period?: string) => {
    const response = await apiClient.get('/admin/users/stats', { params: { period } });
    return response.data;
  },
};

// Chats
export const chatsApi = {
  list: async (params?: { limit?: number; offset?: number; type?: string }) => {
    const response = await apiClient.get('/admin/chats', { params });
    return response.data;
  },
  
  getDetails: async (chatId: string) => {
    const response = await apiClient.get(`/admin/chats/${chatId}`);
    return response.data;
  },
  
  delete: async (chatId: string) => {
    const response = await apiClient.delete(`/admin/chats/${chatId}`);
    return response.data;
  },
};

// Messages
export const messagesApi = {
  search: async (params?: { search?: string; userId?: string; chatId?: string; limit?: number; offset?: number }) => {
    const response = await apiClient.get('/admin/messages/search', { params });
    return response.data;
  },
  
  delete: async (messageId: string) => {
    const response = await apiClient.delete(`/admin/messages/${messageId}`);
    return response.data;
  },
};

// Recordings
export const recordingsApi = {
  getInfo: async () => {
    const response = await apiClient.get('/admin/recordings/info');
    return response.data;
  },
  
  cleanup: async (days: number) => {
    const response = await apiClient.post('/admin/recordings/cleanup', { days });
    return response.data;
  },
};

// Reports
export const reportsApi = {
  list: async (params?: { status?: string; targetType?: string }) => {
    const response = await apiClient.get('/admin/reports', { params });
    return response.data;
  },
  
  process: async (reportId: string, data: { status: string; resolution?: string }) => {
    const response = await apiClient.put(`/admin/reports/${reportId}`, data);
    return response.data;
  },
};

// Versions
export const versionsApi = {
  list: async () => {
    const response = await apiClient.get('/admin/versions');
    return response.data;
  },
  
  create: async (data: { platform: string; version: string; minVersion?: string; updateUrl?: string; releaseNotes?: string; isForceUpdate?: boolean }) => {
    const response = await apiClient.post('/admin/versions', data);
    return response.data;
  },
  
  update: async (versionId: string, data: { platform?: string; version?: string; minVersion?: string; updateUrl?: string; releaseNotes?: string; isForceUpdate?: boolean }) => {
    const response = await apiClient.put(`/admin/versions/${versionId}`, data);
    return response.data;
  },
  
  delete: async (versionId: string) => {
    const response = await apiClient.delete(`/admin/versions/${versionId}`);
    return response.data;
  },
};

// Analytics
export const analyticsApi = {
  getAnalytics: async () => {
    const response = await apiClient.get('/admin/analytics');
    return response.data;
  },
  
  getSystemInfo: async () => {
    const response = await apiClient.get('/admin/system');
    return response.data;
  },
};

// Internal Chat (будет добавлено)
export const internalChatApi = {
  getGroups: async () => {
    const response = await apiClient.get('/admin/internal-chat/groups');
    return response.data;
  },
  
  createGroup: async (data: { name: string; description?: string; memberIds: string[] }) => {
    const response = await apiClient.post('/admin/internal-chat/groups', data);
    return response.data;
  },
  
  addMembers: async (groupId: string, memberIds: string[]) => {
    const response = await apiClient.post(`/admin/internal-chat/groups/${groupId}/members`, { memberIds });
    return response.data;
  },
  
  removeMember: async (groupId: string, userId: string) => {
    const response = await apiClient.delete(`/admin/internal-chat/groups/${groupId}/members/${userId}`);
    return response.data;
  },
};

// Support (будет добавлено)
export const supportApi = {
  getTickets: async (params?: { status?: string; priority?: string; assignedTo?: string }) => {
    const response = await apiClient.get('/admin/support/tickets', { params });
    return response.data;
  },
  
  getTicket: async (ticketId: string) => {
    const response = await apiClient.get(`/admin/support/tickets/${ticketId}`);
    return response.data;
  },
  
  createTicket: async (data: { title: string; description: string; priority?: string; userId?: string }) => {
    const response = await apiClient.post('/admin/support/tickets', data);
    return response.data;
  },
  
  updateTicket: async (ticketId: string, data: { status?: string; priority?: string; assignedTo?: string; resolution?: string }) => {
    const response = await apiClient.put(`/admin/support/tickets/${ticketId}`, data);
    return response.data;
  },
  
  addMessage: async (ticketId: string, content: string) => {
    const response = await apiClient.post(`/admin/support/tickets/${ticketId}/messages`, { content });
    return response.data;
  },
  
  getStaff: async () => {
    const response = await apiClient.get('/admin/support/staff');
    return response.data;
  },
};
