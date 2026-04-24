import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { logger } from '@/lib/logger';

/**
 * POST /api/installer/clear - Очистить базу данных
 */
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();

    // Очищаем все коллекции
    const collections = Object.keys(db.collections) as Array<keyof typeof db.collections>;
    
    for (const collectionName of collections) {
      const collection = db.collections[collectionName];
      const docs = await collection.find().exec();
      
      for (const doc of docs) {
        await doc.remove();
      }
    }

    logger.info('[Installer] База данных очищена');

    return NextResponse.json({
      success: true,
      message: 'База данных очищена',
      clearedCollections: collections
    });
  } catch (error: any) {
    logger.error('[Installer] Error clearing database:', error);
    return NextResponse.json(
      { error: 'Не удалось очистить базу данных: ' + error.message },
      { status: 500 }
    );
  }
}
