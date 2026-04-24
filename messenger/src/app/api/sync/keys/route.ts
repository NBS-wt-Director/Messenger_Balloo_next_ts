import { NextRequest, NextResponse } from 'next/server';

/**
 * API для синхронизации ключей шифрования между устройствами
 */

interface SyncedKey {
  keyId: string;
  publicKey: string;
  encryptedPrivateKey: string;
  createdAt: number;
}

// Хранилище ключей (в реальном приложении - база данных)
const keyStorage = new Map<string, Map<string, SyncedKey>>();

// POST - Сохранение ключей для синхронизации
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, deviceId, keys } = body;

    if (!userId || !deviceId || !keys) {
      return NextResponse.json(
        { error: 'userId, deviceId и keys обязательны' },
        { status: 400 }
      );
    }

    // Получение или создание хранилища для пользователя
    if (!keyStorage.has(userId)) {
      keyStorage.set(userId, new Map());
    }

    const userKeys = keyStorage.get(userId)!;

    // Сохранение ключей
    for (const key of keys) {
      userKeys.set(key.keyId, {
        ...key,
        createdAt: Date.now()
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Sync] Saved ${keys.length} keys for user ${userId} device ${deviceId}`);
    }

    return NextResponse.json({
      success: true,
      message: `Saved ${keys.length} keys`,
      syncedAt: Date.now()
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error syncing keys:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось синхронизировать ключи' },
      { status: 500 }
    );
  }
}

// GET - Получение ключей пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId требуется' },
        { status: 400 }
      );
    }

    const userKeys = keyStorage.get(userId);

    if (!userKeys) {
      return NextResponse.json({
        success: true,
        keys: []
      });
    }

    const keys = Array.from(userKeys.values());

    return NextResponse.json({
      success: true,
      keys,
      count: keys.length
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error getting keys:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить ключи' },
      { status: 500 }
    );
  }
}

// DELETE - Удаление ключей
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, keyIds } = body;

    if (!userId || !keyIds) {
      return NextResponse.json(
        { error: 'userId и keyIds обязательны' },
        { status: 400 }
      );
    }

    const userKeys = keyStorage.get(userId);
    if (!userKeys) {
      return NextResponse.json({
        success: true,
        message: 'No keys to delete'
      });
    }

    for (const keyId of keyIds) {
      userKeys.delete(keyId);
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${keyIds.length} keys`
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting keys:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось удалить ключи' },
      { status: 500 }
    );
  }
}
