import { NextRequest, NextResponse } from 'next/server';

/**
 * API для загрузки файлов на Яндекс.Диск
 * Использует OAuth2 токен для авторизации
 */

const YANDEX_DISK_URL = 'https://cloud-api.yandex.net/v1/disk';
const YANDEX_OAUTH_TOKEN = process.env.YANDEX_DISK_OAUTH_TOKEN || '';

// Получение ссылки на загрузку
async function getUploadUrl(path: string, overwrite = false): Promise<string> {
  const response = await fetch(
    `${YANDEX_DISK_URL}/resources/upload?path=${encodeURIComponent(path)}&overwrite=${overwrite}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `OAuth ${YANDEX_OAUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Yandex Disk API error: ${error}`);
  }

  const data = await response.json();
  return data.href;
}

// Получение ссылки на скачивание
async function getDownloadUrl(path: string): Promise<string> {
  const response = await fetch(
    `${YANDEX_DISK_URL}/resources/download?path=${encodeURIComponent(path)}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `OAuth ${YANDEX_OAUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Yandex Disk API error: ${error}`);
  }

  const data = await response.json();
  return data.href;
}

// Проверка существования файла
async function fileExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${YANDEX_DISK_URL}/resources?path=${encodeURIComponent(path)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `OAuth ${YANDEX_OAUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

// Удаление файла
async function deleteFile(path: string): Promise<void> {
  const response = await fetch(
    `${YANDEX_DISK_URL}/resources/remove?path=${encodeURIComponent(path)}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `OAuth ${YANDEX_OAUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Yandex Disk API error: ${error}`);
  }
}

// POST - Загрузка файла
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const messageId = formData.get('messageId') as string;
    const chatId = formData.get('chatId') as string;
    const uploaderId = formData.get('uploaderId') as string;
    const encrypt = formData.get('encrypt') === 'true';

    if (!file || !messageId || !chatId || !uploaderId) {
      return NextResponse.json(
        { error: 'file, messageId, chatId и uploaderId обязательны' },
        { status: 400 }
      );
    }

    // Генерация пути на Яндекс.Диске
    const fileExt = file.name.split('.').pop() || 'file';
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const diskPath = `/balloo/${uploaderId}/${chatId}/${fileName}`;

    // Чтение файла в ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    let fileBuffer = arrayBuffer;

    // E2E шифрование если включено
    let encryptionInfo = null;
    if (encrypt) {
      const encrypted = await encryptFile(arrayBuffer);
      fileBuffer = encrypted.buffer;
      encryptionInfo = {
        algorithm: 'AES-GCM',
        keyId: encrypted.keyId,
        iv: Array.from(encrypted.iv),
        authTag: Array.from(encrypted.authTag)
      };
    }

    // Получение ссылки на загрузку
    const uploadUrl = await getUploadUrl(diskPath, true);

    // Загрузка на Яндекс.Диск
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: fileBuffer,
      headers: {
        'Content-Type': file.type || 'application/octet-stream'
      }
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload to Yandex Disk');
    }

    // Получение публичной ссылки
    const downloadUrl = await getDownloadUrl(diskPath);

    // Генерация ID вложения
    const attachmentId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    // Получение размеров для изображений
    let width: number | null = null;
    let height: number | null = null;
    let duration: number | null = null;
    let thumbnailUrl: string | null = null;

    if (file.type.startsWith('image/')) {
      try {
        const img = await createImageBitmap(new Blob([arrayBuffer]));
        width = img.width;
        height = img.height;
        thumbnailUrl = `${downloadUrl}?size=${width}x${height}`;
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error getting image dimensions:', e);
        }
      }
    }

    if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      // Для аудио/видео можно получить длительность через ffmpeg.wasm
      // Пока оставляем null
      duration = null;
    }

    // Определение типа вложения
    let attachmentType = 'document';
    if (file.type.startsWith('image/')) attachmentType = 'image';
    else if (file.type.startsWith('video/')) attachmentType = 'video';
    else if (file.type.startsWith('audio/')) attachmentType = 'audio';
    else if (file.type.includes('pdf')) attachmentType = 'pdf';
    else if (file.type.includes('office') || 
             file.name.match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/)) {
      attachmentType = 'office';
    }

    return NextResponse.json({
      success: true,
      attachment: {
        id: attachmentId,
        messageId,
        chatId,
        uploaderId,
        fileName: file.name,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        url: downloadUrl,
        yandexDiskPath: diskPath,
        yandexDiskId: fileName,
        thumbnailUrl,
        width,
        height,
        duration,
        type: attachmentType,
        status: 'ready',
        encrypted: encrypt,
        encryptionInfo,
        createdAt: now,
        updatedAt: now,
        // Для встраивания
        embedUrl: getEmbedUrl(attachmentType, downloadUrl),
        previewUrl: getPreviewUrl(attachmentType, downloadUrl)
      },
      uploadTime: now
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error uploading to Yandex Disk:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось загрузить файл: ' + error.message },
      { status: 500 }
    );
  }
}

// GET - Получение информации о файле
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const diskPath = searchParams.get('path');

    if (!diskPath) {
      return NextResponse.json(
        { error: 'path требуется' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${YANDEX_DISK_URL}/resources?path=${encodeURIComponent(diskPath)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `OAuth ${YANDEX_OAUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 404 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      file: {
        name: data.name,
        size: data.size,
        type: data.mime_type,
        created: data.created,
        modified: data.modified,
        url: data.file
      }
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error getting file info:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить информацию о файле' },
      { status: 500 }
    );
  }
}

// DELETE - Удаление файла
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const diskPath = searchParams.get('path');

    if (!diskPath) {
      return NextResponse.json(
        { error: 'path требуется' },
        { status: 400 }
      );
    }

    await deleteFile(diskPath);

    return NextResponse.json({
      success: true,
      message: 'Файл удален'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting file:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось удалить файл: ' + error.message },
      { status: 500 }
    );
  }
}

// E2E шифрование файла
async function encryptFile(arrayBuffer: ArrayBuffer) {
  // Генерация ключа
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // Экспорт ключа для хранения
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  const keyId = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Генерация IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Шифрование
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    arrayBuffer
  );

  // Извлечение authTag (последние 16 байт)
  const encryptedBuffer = new Uint8Array(encrypted);
  const authTag = encryptedBuffer.slice(-16);
  const ciphertext = encryptedBuffer.slice(0, -16);

  // Сохранение ключа в localStorage (в реальном приложении - в secure storage)
  await saveEncryptionKey(keyId, exportedKey);

  return {
    buffer: ciphertext.buffer,
    keyId,
    iv,
    authTag
  };
}

// E2E расшифровка файла
async function decryptFile(
  encryptedData: ArrayBuffer,
  keyId: string,
  iv: Uint8Array,
  authTag: Uint8Array
): Promise<ArrayBuffer> {
  // Получение ключа
  const keyData = await getEncryptionKey(keyId);
  if (!keyData) {
    throw new Error('Encryption key not found');
  }

  // Импорт ключа
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  // Объединение ciphertext и authTag
  const ciphertext = new Uint8Array(encryptedData);
  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext);
  combined.set(authTag, ciphertext.length);

  // Расшифровка - combined.buffer может быть SharedArrayBuffer
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv).buffer as ArrayBuffer },
    key,
    combined.buffer.slice(combined.byteOffset, combined.byteOffset + combined.byteLength)
  );

  return decrypted;
}

// Сохранение ключа шифрования
async function saveEncryptionKey(keyId: string, keyData: ArrayBuffer) {
  // В реальном приложении - в secure storage или IndexedDB
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(keyData)));
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(`e2e_key_${keyId}`, keyBase64);
  }
}

// Получение ключа шифрования
async function getEncryptionKey(keyId: string): Promise<ArrayBuffer | null> {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  const keyBase64 = localStorage.getItem(`e2e_key_${keyId}`);
  if (!keyBase64) {
    return null;
  }
  const binaryString = atob(keyBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Получение URL для встраивания
function getEmbedUrl(type: string, url: string): string | null {
  switch (type) {
    case 'image':
      return url;
    case 'video':
      return url;
    case 'pdf':
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    case 'office':
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    default:
      return null;
  }
}

// Получение URL для превью
function getPreviewUrl(type: string, url: string): string | null {
  if (type === 'image') {
    return `${url}?size=400x400`;
  }
  if (type === 'pdf' || type === 'office') {
    return url;
  }
  return null;
}
