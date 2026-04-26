import { NextRequest, NextResponse } from 'next/server';
import { YandexDisk } from '@/lib/yandex-disk';
import { logger } from '@/lib/logger';

/**
 * POST /api/yandex-disk/upload/document - Загрузка документа на Яндекс.Диск
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

    // Проверка размера (макс 50MB для документов)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Размер документа не должен превышать 50MB' },
        { status: 400 }
      );
    }

    // Инициализация Яндекс.Диска
    const yandexDisk = new YandexDisk(accessToken);

    // Генерация уникального имени файла
    const fileExt = file.name.split('.').pop() || 'file';
    const fileName = `doc_${userId}_${Date.now()}.${fileExt}`;
    const folderPath = `/messenger/documents/${userId}`;

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
      mimeType: file.type,
      originalName: file.name
    });

  } catch (error: any) {
    logger.error('[API] Error uploading document:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при загрузке документа' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/yandex-disk/download - Скачивание документа
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');
    const path = searchParams.get('path');
    const fileName = searchParams.get('fileName');

    if (!accessToken || !path) {
      return NextResponse.json(
        { error: 'Необходимо указать accessToken и path' },
        { status: 400 }
      );
    }

    const yandexDisk = new YandexDisk(accessToken);

    // Скачивание файла
    const fileBlob = await yandexDisk.downloadFile(path);

    return new NextResponse(fileBlob, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName || 'download'}"`,
        'Content-Length': fileBlob.size.toString(),
      },
    });

  } catch (error: any) {
    logger.error('[API] Error downloading document:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при скачивании документа' },
      { status: 500 }
    );
  }
}
