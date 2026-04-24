 import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * POST /api/profile/avatar - Загрузка аватарки пользователя
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const avatar = formData.get('avatar') as File;
    const userId = formData.get('userId') as string;

    if (!avatar || !userId) {
      return NextResponse.json(
        { error: 'Необходимо указать avatar и userId' },
        { status: 400 }
      );
    }

    // Проверка типа файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(avatar.type)) {
      return NextResponse.json(
        { error: 'Разрешены только изображения (JPEG, PNG, GIF, WebP)' },
        { status: 400 }
      );
    }

    // Проверка размера (макс 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (avatar.size > maxSize) {
      return NextResponse.json(
        { error: 'Размер файла не должен превышать 5MB' },
        { status: 400 }
      );
    }

    // Конвертация в base64 для хранения
    const bytes = await avatar.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    const base64 = Buffer.from(buffer).toString('base64');
    const avatarUrl = `data:${avatar.type};base64,${base64}`;

    // В реальном приложении - загрузка на Яндекс.Диск или CDN
    // Здесь возвращаем base64 для демонстрации

    return NextResponse.json({
      success: true,
      avatarUrl,
      message: 'Аватарка успешно загружена'
    });

  } catch (error: any) {
    logger.error('[API] Error uploading avatar:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при загрузке аватарки' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/avatar - Удаление аватарки
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Необходимо указать userId' },
        { status: 400 }
      );
    }

    // В реальном приложении - удаление с Яндекс.Диска
    // Здесь просто возвращаем успех

    return NextResponse.json({
      success: true,
      message: 'Аватарка успешно удалена'
    });

  } catch (error: any) {
    logger.error('[API] Error deleting avatar:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при удалении аватарки' },
      { status: 500 }
    );
  }
}
