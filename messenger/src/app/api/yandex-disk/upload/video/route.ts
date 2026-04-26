import { NextRequest, NextResponse } from 'next/server';
import { YandexDisk } from '@/lib/yandex-disk';
import { logger } from '@/lib/logger';

/**
 * POST /api/yandex-disk/upload/video - Загрузка видео на Яндекс.Диск
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const accessToken = formData.get('accessToken') as string;

    if (!file || !userId || !accessToken) {
      return NextResponse.json(
        { error: 'Необходимо указать file, userId и accessToken' },
        { status: 400 }
      );
    }

    // Проверка типа файла
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Файл должен быть видео' },
        { status: 400 }
      );
    }

    // Проверка размера (макс 100MB для видео)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Размер видео не должен превышать 100MB' },
        { status: 400 }
      );
    }

    // Инициализация Яндекс.Диска
    const yandexDisk = new YandexDisk(accessToken);

    // Генерация уникального имени файла
    const fileExt = file.name.split('.').pop() || 'mp4';
    const fileName = `video_${userId}_${Date.now()}.${fileExt}`;
    const folderPath = `/messenger/videos/${userId}`;

    // Загрузка файла
    const uploadResult = await yandexDisk.uploadFile(file, fileName, folderPath);

    // Получение публичной ссылки
    const publicUrl = await yandexDisk.getPublicUrl(uploadResult.path);

    return NextResponse.json({
      success: true,
      url: publicUrl.public_url,
      path: uploadResult.path,
      fileName: uploadResult.name,
      fileSize: file.size,
      mimeType: file.type
    });

  } catch (error: any) {
    logger.error('[API] Error uploading video:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при загрузке видео' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/yandex-disk/video/:path - Просмотр видео
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');
    const path = searchParams.get('path');

    if (!accessToken || !path) {
      return NextResponse.json(
        { error: 'Необходимо указать accessToken и path' },
        { status: 400 }
      );
    }

    const yandexDisk = new YandexDisk(accessToken);

    // Скачивание файла
    const videoBlob = await yandexDisk.downloadFile(path);

    return new NextResponse(videoBlob, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': videoBlob.size.toString(),
      },
    });

  } catch (error: any) {
    logger.error('[API] Error streaming video:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при загрузке видео' },
      { status: 500 }
    );
  }
}
