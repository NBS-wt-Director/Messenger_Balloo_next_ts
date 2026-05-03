import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { logger } from '@/lib/logger';
import { optimizeImage, createThumbnail, getImageMetadata } from '@/lib/image-optimizer';

/**
 * POST /api/profile/avatar/upload - Загрузка аватарки с обновлением профиля
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

    // Оптимизация изображения
    const { blob: optimizedBlob } = await optimizeImage(avatar, {
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.8,
      format: 'webp',
    });

    // Создание thumbnail
    const { blob: thumbnailBlob } = await createThumbnail(avatar, 100);

    // Конвертация в base64 для хранения
    const optimizedBytes = await optimizedBlob.arrayBuffer();
    const optimizedBase64 = Buffer.from(optimizedBytes).toString('base64');
    const avatarUrl = `data:image/webp;base64,${optimizedBase64}`;

    const thumbnailBytes = await thumbnailBlob.arrayBuffer();
    const thumbnailBase64 = Buffer.from(thumbnailBytes).toString('base64');
    const thumbnailUrl = `data:image/webp;base64,${thumbnailBase64}`;

    // Обновляем профиль пользователя
    // SQLite db уже доступен
    const usersCollection = db.users;

    const user = await usersCollection.findOne({
      selector: { id: userId }
    }).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    await user.patch({
      avatar: avatarUrl,
      thumbnailUrl,
      updatedAt: Date.now()
    });

    // Инвалидация кэша профиля
    // invalidateCache(`user:${userId}:profile`);

    return NextResponse.json({
      success: true,
      avatarUrl,
      thumbnailUrl,
      message: 'Аватарка успешно загружена и оптимизирована'
    });

  } catch (error: any) {
    logger.error('[API] Error uploading avatar:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при загрузке аватарки' },
      { status: 500 }
    );
  }
}
