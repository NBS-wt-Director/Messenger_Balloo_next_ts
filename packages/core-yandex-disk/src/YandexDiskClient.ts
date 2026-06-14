/**
 * Balloo Platform - Yandex Disk Client
 * Интеграция с Yandex Disk API для хранения файлов
 * 
 * @author NBS-wt
 * @version 0.1.0
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

export interface YandexDiskConfig {
  oauthToken: string;
  basePath?: string;
  timeout?: number;
}

export interface YandexDiskFile {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: string;
  modifiedAt: string;
  downloadUrl: string;
}

export interface YandexDiskUploadResult {
  success: boolean;
  fileId: string;
  path: string;
  downloadUrl: string;
  size: number;
}

export interface YandexDiskError {
  code: string;
  message: string;
  details?: any;
}

export class YandexDiskClient {
  private client: AxiosInstance;
  private basePath: string;
  private oauthToken: string;

  constructor(config: YandexDiskConfig) {
    this.oauthToken = config.oauthToken;
    this.basePath = config.basePath || '/balloo-storage';

    this.client = axios.create({
      baseURL: 'https://cloud-api.yandex.net/v1/disk',
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `OAuth ${this.oauthToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Проверка доступности сервиса
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await this.client.get('/disk');
      return response.status === 200;
    } catch (error) {
      console.error('Yandex Disk unavailable:', error);
      return false;
    }
  }

  /**
   * Создание корневой папки для хранения
   */
  async createBaseFolder(): Promise<void> {
    try {
      await this.client.post('/resources', {
        path: this.basePath,
      });
    } catch (error: any) {
      if (error.response?.status !== 409) {
        // 409 = folder already exists
        throw error;
      }
    }
  }

  /**
   * Загрузка файла на Yandex Disk
   */
  async uploadFile(
    file: Buffer,
    filename: string,
    userId: string,
    metadata?: Record<string, any>
  ): Promise<YandexDiskUploadResult> {
    try {
      // Создаём путь для файла
      const filePath = `${this.basePath}/${userId}/${Date.now()}-${filename}`;

      // Получаем URL для загрузки
      const uploadUrlResponse = await this.client.get('/resources/upload', {
        params: {
          path: filePath,
          overwrite: 'true',
        },
      });

      const uploadUrl = uploadUrlResponse.data.href;

      // Загружаем файл
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      // Получаем информацию о файле
      const fileInfo = await this.getFileInfo(filePath);

      return {
        success: true,
        fileId: this.extractFileId(filePath),
        path: filePath,
        downloadUrl: fileInfo.downloadUrl,
        size: file.length,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Скачивание файла с Yandex Disk
   */
  async downloadFile(filePath: string): Promise<Buffer> {
    try {
      // Получаем URL для скачивания
      const downloadUrlResponse = await this.client.get('/resources/download', {
        params: { path: filePath },
      });

      const downloadUrl = downloadUrlResponse.data.href;

      // Скачиваем файл
      const response = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
      });

      return Buffer.from(response.data);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Получение информации о файле
   */
  async getFileInfo(filePath: string): Promise<YandexDiskFile> {
    try {
      const response = await this.client.get('/resources', {
        params: { path: filePath },
      });

      const data = response.data;

      return {
        id: this.extractFileId(filePath),
        name: data.name,
        path: data.path,
        size: data.size,
        mimeType: data.mime_type,
        createdAt: data.created,
        modifiedAt: data.modified,
        downloadUrl: data.file || '',
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Удаление файла
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await this.client.delete('/resources', {
        params: { path: filePath, permanently: 'false' },
      });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Получение временной ссылки для скачивания
   */
  async getTemporaryDownloadUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    try {
      const response = await this.client.get('/resources/download', {
        params: { path: filePath },
      });

      // Ссылка действительна в течение ограниченного времени
      return response.data.href;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Проверка существования файла
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await this.getFileInfo(filePath);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Получение списка файлов в папке пользователя
   */
  async listUserFiles(userId: string, limit: number = 100): Promise<YandexDiskFile[]> {
    try {
      const userPath = `${this.basePath}/${userId}`;
      
      const response = await this.client.get('/resources', {
        params: {
          path: userPath,
          limit,
        },
      });

      return response.data._embedded?.items?.map((item: any) => ({
        id: this.extractFileId(item.path),
        name: item.name,
        path: item.path,
        size: item.size,
        mimeType: item.mime_type,
        createdAt: item.created,
        modifiedAt: item.modified,
        downloadUrl: item.file || '',
      })) || [];
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Обработка ошибок
   */
  private handleError(error: AxiosError): YandexDiskError {
    if (error.response) {
      return {
        code: `YANDEX_DISK_${error.response.status}`,
        message: this.getErrorMessage(error.response.status),
        details: error.response.data,
      };
    }

    return {
      code: 'YANDEX_DISK_UNKNOWN',
      message: 'Неизвестная ошибка Yandex Disk',
      details: error.message,
    };
  }

  /**
   * Получение сообщения об ошибке по статусу
   */
  private getErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Неверный запрос',
      401: 'Неавторизован (проверьте OAuth токен)',
      403: 'Доступ запрещён',
      404: 'Файл не найден',
      409: 'Конфликт (файл уже существует)',
      413: 'Файл слишком большой',
      429: 'Слишком много запросов',
      500: 'Внутренняя ошибка сервера',
      503: 'Сервис недоступен',
    };

    return messages[status] || `Ошибка ${status}`;
  }

  /**
   * Извлечение ID файла из пути
   */
  private extractFileId(path: string): string {
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  }
}

/**
 * Singleton instance factory
 */
export function createYandexDiskClient(config: YandexDiskConfig): YandexDiskClient {
  return new YandexDiskClient(config);
}

export default YandexDiskClient;
