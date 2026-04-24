import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, platform, userId } = body;

    // Валидация
    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Token and userId are required' },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne(userId).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Сохранение токена в базу данных
    const pushTokens = user.pushTokens || [];
    const existingTokenIndex = pushTokens.findIndex((t: any) => t.token === token);

    if (existingTokenIndex >= 0) {
      // Обновление существующего токена
      pushTokens[existingTokenIndex] = {
        token,
        platform: platform || 'web',
        createdAt: Date.now(),
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 дней
        lastUsedAt: Date.now()
      };
    } else {
      // Добавление нового токена
      pushTokens.push({
        token,
        platform: platform || 'web',
        createdAt: Date.now(),
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000),
        lastUsedAt: Date.now()
      });
    }

    const userDoc = await usersCollection.findOne({ selector: { id: userId } }).exec();
    if (userDoc) {
      await userDoc.patch({
        pushTokens,
        updatedAt: Date.now()
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[API] Saved notification token for user:', userId);
    }

    return NextResponse.json({
      success: true,
      message: 'Token saved successfully',
      savedAt: Date.now()
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error saving token:', error);
    }
    return NextResponse.json(
      { error: 'Failed to save token: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, userId } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ selector: { id: userId } }).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Удаление токена из базы данных
    const pushTokens = (user.pushTokens || []).filter((t: any) => t.token !== token);

    await user.patch({
      pushTokens,
      updatedAt: Date.now()
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[API] Removed notification token for user:', userId);
    }

    return NextResponse.json({
      success: true,
      message: 'Token removed successfully'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error removing token:', error);
    }
    return NextResponse.json(
      { error: 'Failed to remove token: ' + error.message },
      { status: 500 }
    );
  }
}
