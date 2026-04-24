import { YandexTokenResponse } from '@/types';

const YANDEX_DISK_API = 'https://cloud-api.yandex.net/v1/disk';

export class YandexDisk {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${YANDEX_DISK_API}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `OAuth ${this.accessToken}`,
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Yandex Disk API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Получить информацию о пользователе
  async getUserInfo() {
    return this.request<{ user: any }>('/');
  }

  // Получить список файлов в папке
  async listFiles(path: string = '/', limit = 100) {
    return this.request<{
      items: Array<{
        name: string;
        path: string;
        type: 'dir' | 'file';
        size?: number;
        mime_type?: string;
      }>;
      _embedded: {
        items: any[];
        total: number;
      };
    }>(`/resources?path=${encodeURIComponent(path)}&limit=${limit}`);
  }

  // Создать папку
  async createFolder(path: string) {
    return this.request<{ name: string; path: string }>('/resources', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
  }

  // Загрузить файл
  async uploadFile(
    file: Blob,
    fileName: string,
    folderPath: string = '/messenger'
  ): Promise<{ path: string; name: string }> {
    // Сначала создаем папку если её нет
    try {
      await this.createFolder(folderPath);
    } catch (e) {
      // Папка уже существует
    }

    const fullPath = `${folderPath}/${fileName}`;
    
    // Получаем URL для загрузки
    const uploadUrlResponse = await this.request<{ href: string }>(
      `/resources/upload?path=${encodeURIComponent(fullPath)}&overwrite=true`,
      { method: 'GET' }
    );

    // Загружаем файл
    const uploadResponse = await fetch(uploadUrlResponse.href, {
      method: 'PUT',
      body: file as BodyInit,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }

    return { path: fullPath, name: fileName };
  }

  // Скачать файл
  async downloadFile(path: string): Promise<Blob> {
    const response = await this.request<{ href: string }>(
      `/resources/download?path=${encodeURIComponent(path)}`
    );

    const fileResponse = await fetch(response.href);
    return fileResponse.blob();
  }

  // Получить публичную ссылку на файл
  async getPublicUrl(path: string) {
    return this.request<{ public_url: string }>('/resources/publish', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
  }

  // Удалить файл
  async deleteFile(path: string) {
    return this.request(`/resources?path=${encodeURIComponent(path)}`, {
      method: 'DELETE',
    });
  }

  // Получить метаинформацию о файле
  async getFileInfo(path: string) {
    return this.request<{
      name: string;
      path: string;
      size: number;
      mime_type: string;
      created: string;
      modified: string;
    }>(`/resources?path=${encodeURIComponent(path)}`);
  }
}

// Функция для получения токена по коду
export async function getTokenByCode(clientId: string, clientSecret: string, code: string, redirectUri: string): Promise<YandexTokenResponse> {
  const response = await fetch('https://oauth.yandex.ru/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get token: ${error}`);
  }

  return response.json();
}

// Функция для обновления токена
export async function refreshToken(clientId: string, clientSecret: string, refreshToken: string): Promise<YandexTokenResponse> {
  const response = await fetch('https://oauth.yandex.ru/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return response.json();
}
