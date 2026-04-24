/**
 * API Яндекс.Диска
 */

import { DiskFile, DiskUploadResponse, DiskDownloadResponse, ApiError } from './types';

const YANDEX_DISK_API = 'https://cloud-api.yandex.net/v1';
const YANDEX_CLIENT_ID = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID || '';
const YANDEX_CLIENT_SECRET = process.env.YANDEX_CLIENT_SECRET || '';

const getRedirectUri = (path: string) => {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${path}`;
};

/**
 * Получить URL для авторизации в Яндекс.Диске
 */
export function getDiskAuthUrl(): string {
  const redirectUri = getRedirectUri('/api/disk/callback');
  const scope = 'disk:read disk:write';
  
  return `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
}

/**
 * Обменять код на токен Диска
 */
export async function exchangeCodeForDiskToken(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const redirectUri = getRedirectUri('/api/disk/callback');
  
  const response = await fetch('https://oauth.yandex.ru/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: YANDEX_CLIENT_ID,
      client_secret: YANDEX_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new ApiError(
      'Failed to exchange code for disk token',
      'DISK_TOKEN_EXCHANGE_FAILED',
      response.status
    );
  }

  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || '',
    expiresIn: data.expires_in,
  };
}

/**
 * Получить информацию о диске
 */
export async function getDiskInfo(accessToken: string): Promise<{
  totalSpace: number;
  usedSpace: number;
  trashSize: number;
}> {
  const response = await fetch(`${YANDEX_DISK_API}/disk`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      'Failed to get disk info',
      'DISK_INFO_FAILED',
      response.status
    );
  }

  const data = await response.json();
  
  return {
    totalSpace: data.total_space,
    usedSpace: data.used_space,
    trashSize: data.trash_size,
  };
}

/**
 * Получить список файлов в папке
 */
export async function getFilesList(
  accessToken: string, 
  path: string = '/',
  limit: number = 50
): Promise<DiskFile[]> {
  const params = new URLSearchParams({
    path,
    limit: limit.toString(),
    fields: '_embedded.items.name,_embedded.items.path,_embedded.items.size,_embedded.items.created,_embedded.items.modified,_embedded.items.mime_type,_embedded.items.preview,_embedded.items.file',
  });

  const response = await fetch(`${YANDEX_DISK_API}/disk/resources?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      'Failed to get files list',
      'FILES_LIST_FAILED',
      response.status
    );
  }

  const data = await response.json();
  
  return (data._embedded?.items || []).map((item: any) => ({
    name: item.name,
    path: item.path,
    size: item.size,
    created: item.created,
    modified: item.modified,
    mimeType: item.mime_type,
    preview: item.preview,
    downloadUrl: item.file,
  }));
}

/**
 * Загрузить файл на Яндекс.Диск
 */
export async function uploadFile(
  accessToken: string,
  file: Blob,
  fileName: string,
  path: string = '/',
  onProgress?: (progress: number) => void
): Promise<DiskUploadResponse> {
  // Сначала получаем URL для загрузки
  const params = new URLSearchParams({
    path: `${path}/${fileName}`,
    overwrite: 'true',
  });

  const uploadUrlResponse = await fetch(`${YANDEX_DISK_API}/disk/resources/upload?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!uploadUrlResponse.ok) {
    throw new ApiError(
      'Failed to get upload URL',
      'UPLOAD_URL_FAILED',
      uploadUrlResponse.status
    );
  }

  const { href: uploadUrl } = await uploadUrlResponse.json();

  // Загружаем файл
  const xhr = new XMLHttpRequest();
  
  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress((event.loaded / event.total) * 100);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          fileName,
          filePath: `${path}/${fileName}`,
          fileSize: file.size,
        });
      } else {
        reject(new ApiError(
          'Failed to upload file',
          'UPLOAD_FAILED',
          xhr.status
        ));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new ApiError(
        'Failed to upload file',
        'UPLOAD_FAILED',
        xhr.status
      ));
    });

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}

/**
 * Скачать файл с Яндекс.Диска
 */
export async function downloadFile(
  accessToken: string,
  path: string
): Promise<DiskDownloadResponse> {
  const params = new URLSearchParams({
    path,
  });

  // Получаем URL для скачивания
  const downloadResponse = await fetch(`${YANDEX_DISK_API}/disk/resources/download?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!downloadResponse.ok) {
    throw new ApiError(
      'Failed to get download URL',
      'DOWNLOAD_URL_FAILED',
      downloadResponse.status
    );
  }

  const { href: downloadUrl, file: fileName } = await downloadResponse.json();

  // Скачиваем файл
  const fileResponse = await fetch(downloadUrl);
  
  if (!fileResponse.ok) {
    throw new ApiError(
      'Failed to download file',
      'DOWNLOAD_FAILED',
      fileResponse.status
    );
  }

  const blob = await fileResponse.blob();
  const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';

  return {
    blob,
    fileName: fileName || path.split('/').pop() || 'file',
    contentType,
  };
}

/**
 * Удалить файл с Яндекс.Диска
 */
export async function deleteFile(
  accessToken: string,
  path: string,
  permanently: boolean = false
): Promise<void> {
  const params = new URLSearchParams({
    path,
    permanently: permanently.toString(),
  });

  const response = await fetch(`${YANDEX_DISK_API}/disk/resources?${params}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 202) {
    throw new ApiError(
      'Failed to delete file',
      'DELETE_FAILED',
      response.status
    );
  }
}

/**
 * Создать папку на Яндекс.Диске
 */
export async function createFolder(
  accessToken: string,
  path: string
): Promise<void> {
  const params = new URLSearchParams({
    path,
  });

  const response = await fetch(`${YANDEX_DISK_API}/disk/resources?${params}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      'Failed to create folder',
      'CREATE_FOLDER_FAILED',
      response.status
    );
  }
}

/**
 * Получить публичную ссылку на файл
 */
export async function getPublicUrl(
  accessToken: string,
  path: string
): Promise<string> {
  const params = new URLSearchParams({
    path,
    public_key: '',
  });

  const response = await fetch(`${YANDEX_DISK_API}/disk/resources/publish?${params}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      'Failed to publish file',
      'PUBLISH_FAILED',
      response.status
    );
  }

  const data = await response.json();
  
  // Получаем публичную ссылку
  const metaParams = new URLSearchParams({
    path,
    fields: 'public_url',
  });

  const metaResponse = await fetch(`${YANDEX_DISK_API}/disk/resources?${metaParams}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const metaData = await metaResponse.json();
  return metaData.public_url;
}
