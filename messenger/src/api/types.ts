/**
 * Общие типы для API
 */

// Типы ответов API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Токены
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Профиль пользователя с API
export interface ApiUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  publicKey?: string;
}

// Яндекс.Диск
export interface DiskFile {
  name: string;
  path: string;
  size: number;
  created: string;
  modified: string;
  mimeType: string;
  preview?: string;
  downloadUrl?: string;
}

export interface DiskUploadResponse {
  fileName: string;
  filePath: string;
  fileSize: number;
  publicUrl?: string;
}

export interface DiskDownloadResponse {
  blob: Blob;
  fileName: string;
  contentType: string;
}

// Инвайты
export interface InviteResponse {
  code: string;
  expiresAt: number;
  points: number;
  permanent: boolean;
}

// Точки
export interface PointsResponse {
  total: number;
  history: PointTransaction[];
}

export interface PointTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  createdAt: number;
}

// Ошибки API
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Конфигурация API
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 30000,
  retries: 3,
};
