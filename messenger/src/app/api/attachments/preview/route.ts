import { NextRequest, NextResponse } from 'next/server';
import { YandexDisk } from '@/lib/yandex-disk';
import { logger } from '@/lib/logger';

/**
 * POST /api/attachments/preview - Получить предпросмотр вложения
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, type, accessToken } = body;

    if (!url || !type) {
      return NextResponse.json(
        { error: 'Необходимо указать url и type' },
        { status: 400 }
      );
    }

    let preview: any = {};

    switch (type) {
      case 'image':
        preview = await getImagePreview(url);
        break;
      case 'video':
        preview = await getVideoPreview(url, accessToken);
        break;
      case 'document':
        preview = await getDocumentPreview(url);
        break;
      case 'audio':
        preview = await getAudioPreview(url);
        break;
      default:
        preview = {
          type: 'unknown',
          message: 'Предпросмотр недоступен для этого типа файла'
        };
    }

    return NextResponse.json({
      success: true,
      preview
    });

  } catch (error: any) {
    logger.error('[API] Error generating preview:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при создании предпросмотра' },
      { status: 500 }
    );
  }
}

// Получить предпросмотр изображения
async function getImagePreview(url: string) {
  // Для base64 или локальных URL возвращаем как есть
  if (url.startsWith('data:') || url.startsWith('/')) {
    return {
      type: 'image',
      url,
      thumbnailUrl: url, // В будущем можно генерировать уменьшенную версию
      width: null,
      height: null
    };
  }

  // Для внешних URL пробуем получить метаданные
  try {
    // В production здесь будет запрос к Yandex Disk или CDN
    return {
      type: 'image',
      url,
      thumbnailUrl: `${url}?thumb=200x200`
    };
  } catch {
    return {
      type: 'image',
      url
    };
  }
}

// Получить предпросмотр видео
async function getVideoPreview(url: string, accessToken?: string) {
  if (accessToken && url.includes('yandex')) {
    const yandexDisk = new YandexDisk(accessToken);
    try {
      const fileInfo = await yandexDisk.getFileInfo(url);
      return {
        type: 'video',
        url,
        thumbnailUrl: `${url}?thumb`,
        duration: (fileInfo as any).duration || null,
        width: (fileInfo as any).width || null,
        height: (fileInfo as any).height || null,
        fileSize: fileInfo.size
      };
    } catch {
      return {
        type: 'video',
        url
      };
    }
  }

  return {
    type: 'video',
    url,
    thumbnailUrl: `${url}?thumb`
  };
}

// Получить предпросмотр документа
async function getDocumentPreview(url: string) {
  // Распознавание типа документа по расширению
  const ext = url.split('.').pop()?.toLowerCase();
  
  const documentTypes: Record<string, { icon: string; label: string }> = {
    pdf: { icon: '📄', label: 'PDF документ' },
    doc: { icon: '📝', label: 'Word документ' },
    docx: { icon: '📝', label: 'Word документ' },
    xls: { icon: '📊', label: 'Excel таблица' },
    xlsx: { icon: '📊', label: 'Excel таблица' },
    ppt: { icon: '📽️', label: 'PowerPoint презентация' },
    pptx: { icon: '📽️', label: 'PowerPoint презентация' },
    txt: { icon: '📃', label: 'Текстовый файл' },
    zip: { icon: '📦', label: 'ZIP архив' },
    rar: { icon: '📦', label: 'RAR архив' },
  };

  const typeInfo = ext ? (documentTypes[ext] || { icon: '📄', label: 'Документ' }) : { icon: '📄', label: 'Документ' };

  return {
    type: 'document',
    url,
    extension: ext,
    ...typeInfo
  };
}

// Получить предпросмотр аудио
async function getAudioPreview(url: string) {
  return {
    type: 'audio',
    url,
    waveform: true // Индикация возможности воспроизведения
  };
}

/**
 * GET /api/attachments/preview/video - Получить метаданные видео
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'Необходимо указать url' },
        { status: 400 }
      );
    }

    if (accessToken && url.includes('yandex')) {
      const yandexDisk = new YandexDisk(accessToken);
      const fileInfo = await yandexDisk.getFileInfo(url);

      return NextResponse.json({
        success: true,
        metadata: {
          duration: (fileInfo as any).duration,
          width: (fileInfo as any).width,
          height: (fileInfo as any).height,
          size: fileInfo.size,
          mimeType: fileInfo.mime_type
        }
      });
    }

    return NextResponse.json({
      success: true,
      metadata: {}
    });

  } catch (error: any) {
    logger.error('[API] Error getting video metadata:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при получении метаданных' },
      { status: 500 }
    );
  }
}
