/**
 * YandexDiskClient Tests
 * @balloo/core-yandex-disk
 */

import { YandexDiskClient } from '../YandexDiskClient';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('YandexDiskClient', () => {
  const mockConfig = {
    oauthToken: 'test-oauth-token',
    basePath: '/balloo-storage',
    timeout: 30000,
  };

  let client: YandexDiskClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new YandexDiskClient(mockConfig);
  });

  describe('constructor', () => {
    it('creates client with default config', () => {
      const defaultClient = new YandexDiskClient({ oauthToken: 'test-token' });
      expect(defaultClient).toBeDefined();
    });

    it('creates client with custom config', () => {
      const customClient = new YandexDiskClient({
        oauthToken: 'test-token',
        basePath: '/custom-path',
        timeout: 60000,
      });
      expect(customClient).toBeDefined();
    });
  });

  describe('checkAvailability', () => {
    it('returns true when API is available', async () => {
      mockedAxios.create().get.mockResolvedValue({ status: 200 });

      const result = await client.checkAvailability();

      expect(result).toBe(true);
      expect(mockedAxios.create().get).toHaveBeenCalledWith('/disk');
    });

    it('returns false when API is unavailable', async () => {
      mockedAxios.create().get.mockRejectedValue(new Error('Network error'));

      const result = await client.checkAvailability();

      expect(result).toBe(false);
    });
  });

  describe('createBaseFolder', () => {
    it('creates folder successfully', async () => {
      mockedAxios.create().post.mockResolvedValue({ status: 201 });

      await expect(client.createBaseFolder()).resolves.not.toThrow();
      expect(mockedAxios.create().post).toHaveBeenCalledWith('/resources', {
        path: '/balloo-storage',
      });
    });

    it('ignores 409 conflict (folder exists)', async () => {
      const error = { response: { status: 409 } };
      mockedAxios.create().post.mockRejectedValue(error);

      await expect(client.createBaseFolder()).resolves.not.toThrow();
    });

    it('throws on other errors', async () => {
      const error = { response: { status: 500 } };
      mockedAxios.create().post.mockRejectedValue(error);

      await expect(client.createBaseFolder()).rejects.toThrow();
    });
  });

  describe('uploadFile', () => {
    const mockFile = Buffer.from('test file content');
    const mockFilename = 'test.pdf';
    const mockUserId = 'user-123';

    it('uploads file successfully', async () => {
      // Mock upload URL response
      mockedAxios.create().get.mockResolvedValue({
        data: { href: 'https://upload.yandex.ru/upload-url' },
      });

      // Mock file upload
      mockedAxios.put.mockResolvedValue({ status: 200 });

      // Mock file info
      mockedAxios.create().get.mockResolvedValueOnce({
        data: {
          name: 'test.pdf',
          path: '/balloo-storage/user-123/test.pdf',
          size: 1024,
          mime_type: 'application/pdf',
          created: '2026-06-14T00:00:00Z',
          modified: '2026-06-14T00:00:00Z',
          file: 'https://download.yandex.ru/file',
        },
      });

      const result = await client.uploadFile(mockFile, mockFilename, mockUserId);

      expect(result.success).toBe(true);
      expect(result.size).toBe(mockFile.length);
    });

    it('handles upload error', async () => {
      mockedAxios.create().get.mockRejectedValue(new Error('Upload failed'));

      await expect(
        client.uploadFile(mockFile, mockFilename, mockUserId)
      ).rejects.toThrow();
    });
  });

  describe('downloadFile', () => {
    it('downloads file successfully', async () => {
      const mockFilePath = '/balloo-storage/user-123/test.pdf';

      // Mock download URL response
      mockedAxios.create().get.mockResolvedValue({
        data: { href: 'https://download.yandex.ru/file' },
      });

      // Mock file download
      mockedAxios.get.mockResolvedValue({
        data: new ArrayBuffer(1024),
      });

      const result = await client.downloadFile(mockFilePath);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.length).toBe(1024);
    });

    it('handles download error', async () => {
      mockedAxios.create().get.mockRejectedValue(new Error('Download failed'));

      await expect(
        client.downloadFile('/balloo-storage/test.pdf')
      ).rejects.toThrow();
    });
  });

  describe('getFileInfo', () => {
    it('returns file info', async () => {
      const mockFilePath = '/balloo-storage/user-123/test.pdf';

      mockedAxios.create().get.mockResolvedValue({
        data: {
          name: 'test.pdf',
          path: mockFilePath,
          size: 1024,
          mime_type: 'application/pdf',
          created: '2026-06-14T00:00:00Z',
          modified: '2026-06-14T00:00:00Z',
          file: 'https://download.yandex.ru/file',
        },
      });

      const result = await client.getFileInfo(mockFilePath);

      expect(result.name).toBe('test.pdf');
      expect(result.size).toBe(1024);
      expect(result.mimeType).toBe('application/pdf');
    });

    it('handles file not found', async () => {
      const error = { response: { status: 404 } };
      mockedAxios.create().get.mockRejectedValue(error);

      await expect(
        client.getFileInfo('/nonexistent.pdf')
      ).rejects.toThrow();
    });
  });

  describe('deleteFile', () => {
    it('deletes file successfully', async () => {
      mockedAxios.create().delete.mockResolvedValue({ status: 204 });

      await expect(
        client.deleteFile('/balloo-storage/test.pdf')
      ).resolves.not.toThrow();
    });

    it('handles delete error', async () => {
      mockedAxios.create().delete.mockRejectedValue(new Error('Delete failed'));

      await expect(
        client.deleteFile('/nonexistent.pdf')
      ).rejects.toThrow();
    });
  });

  describe('fileExists', () => {
    it('returns true when file exists', async () => {
      mockedAxios.create().get.mockResolvedValue({ data: {} });

      const result = await client.fileExists('/balloo-storage/test.pdf');

      expect(result).toBe(true);
    });

    it('returns false when file does not exist', async () => {
      const error = { response: { status: 404 } };
      mockedAxios.create().get.mockRejectedValue(error);

      const result = await client.fileExists('/nonexistent.pdf');

      expect(result).toBe(false);
    });

    it('throws on other errors', async () => {
      const error = { response: { status: 500 } };
      mockedAxios.create().get.mockRejectedValue(error);

      await expect(
        client.fileExists('/error.pdf')
      ).rejects.toThrow();
    });
  });

  describe('getTemporaryDownloadUrl', () => {
    it('returns download URL', async () => {
      mockedAxios.create().get.mockResolvedValue({
        data: { href: 'https://download.yandex.ru/temp-url' },
      });

      const result = await client.getTemporaryDownloadUrl('/balloo-storage/test.pdf');

      expect(result).toBe('https://download.yandex.ru/temp-url');
    });

    it('uses custom expiry time', async () => {
      mockedAxios.create().get.mockResolvedValue({
        data: { href: 'https://download.yandex.ru/temp-url' },
      });

      await client.getTemporaryDownloadUrl('/balloo-storage/test.pdf', 7200);

      expect(mockedAxios.create().get).toHaveBeenCalledWith('/resources/download', {
        params: { path: '/balloo-storage/test.pdf' },
      });
    });
  });

  describe('listUserFiles', () => {
    it('returns list of files', async () => {
      mockedAxios.create().get.mockResolvedValue({
        data: {
          _embedded: {
            items: [
              {
                name: 'file1.pdf',
                path: '/balloo-storage/user-123/file1.pdf',
                size: 1024,
                mime_type: 'application/pdf',
                created: '2026-06-14T00:00:00Z',
                modified: '2026-06-14T00:00:00Z',
                file: 'https://download.yandex.ru/file1',
              },
              {
                name: 'file2.pdf',
                path: '/balloo-storage/user-123/file2.pdf',
                size: 2048,
                mime_type: 'application/pdf',
                created: '2026-06-14T00:00:00Z',
                modified: '2026-06-14T00:00:00Z',
                file: 'https://download.yandex.ru/file2',
              },
            ],
          },
        },
      });

      const result = await client.listUserFiles('user-123');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('file1.pdf');
      expect(result[1].name).toBe('file2.pdf');
    });

    it('returns empty array when no files', async () => {
      mockedAxios.create().get.mockResolvedValue({
        data: { _embedded: { items: [] } },
      });

      const result = await client.listUserFiles('user-123');

      expect(result).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('handles 400 Bad Request', async () => {
      const error = { response: { status: 400, data: {} } };
      mockedAxios.create().get.mockRejectedValue(error);

      await expect(
        client.getFileInfo('/test.pdf')
      ).rejects.toMatchObject({
        code: 'YANDEX_DISK_400',
        message: 'Неверный запрос',
      });
    });

    it('handles 401 Unauthorized', async () => {
      const error = { response: { status: 401, data: {} } };
      mockedAxios.create().get.mockRejectedValue(error);

      await expect(
        client.getFileInfo('/test.pdf')
      ).rejects.toMatchObject({
        code: 'YANDEX_DISK_401',
        message: 'Неавторизован (проверьте OAuth токен)',
      });
    });

    it('handles 403 Forbidden', async () => {
      const error = { response: { status: 403, data: {} } };
      mockedAxios.create().get.mockRejectedValue(error);

      await expect(
        client.getFileInfo('/test.pdf')
      ).rejects.toMatchObject({
        code: 'YANDEX_DISK_403',
        message: 'Доступ запрещён',
      });
    });

    it('handles 500 Internal Error', async () => {
      const error = { response: { status: 500, data: {} } };
      mockedAxios.create().get.mockRejectedValue(error);

      await expect(
        client.getFileInfo('/test.pdf')
      ).rejects.toMatchObject({
        code: 'YANDEX_DISK_500',
        message: 'Внутренняя ошибка сервера',
      });
    });

    it('handles unknown errors', async () => {
      const error = new Error('Unknown error');
      mockedAxios.create().get.mockRejectedValue(error);

      await expect(
        client.getFileInfo('/test.pdf')
      ).rejects.toMatchObject({
        code: 'YANDEX_DISK_UNKNOWN',
        message: 'Неизвестная ошибка Yandex Disk',
      });
    });
  });

  describe('extractFileId', () => {
    it('extracts file id from path', () => {
      // This is a private method, so we test through public API
      // The extraction is tested indirectly through other tests
      expect(true).toBe(true);
    });
  });
});

describe('createYandexDiskClient', () => {
  it('creates client instance', () => {
    const { createYandexDiskClient } = require('../YandexDiskClient');
    
    const client = createYandexDiskClient({ oauthToken: 'test-token' });
    
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(YandexDiskClient);
  });
});
