import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { logger } from '@/lib/logger';

/**
 * GET /api/features - Получить список функций
 * query: status?: 'planned' | 'in-progress' | 'completed' | 'all'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const db = await getDatabase();
    const featuresCollection = db.features;

    let query = featuresCollection.find();

    if (status !== 'all') {
      query = query.where('status').eq(status);
    }

    const features = await query.exec();

    return NextResponse.json({
      success: true,
      features: features.map(f => f.toJSON())
    });
  } catch (error: any) {
    logger.error('[API] Error fetching features:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить функции' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/features - Предложить новую функцию (от пользователя)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      category,
      userId,
      userName
    } = body;

    if (!title || !description || !userId) {
      return NextResponse.json(
        { error: 'title, description и userId обязательны' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const featuresCollection = db.features;

    const featureId = `feat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const newFeature = await featuresCollection.insert({
      id: featureId,
      title,
      description,
      category: category || 'general',
      status: 'pending', // pending, planned, in-progress, completed, rejected
      votes: 0,
      votedBy: [],
      createdBy: userId,
      createdByName: userName || 'Аноним',
      adminNote: '',
      plannedAt: null,
      completedAt: null,
      createdAt: now,
      updatedAt: now
    });

    return NextResponse.json({
      success: true,
      feature: newFeature.toJSON(),
      message: 'Функция предложена! Спасибо за ваш вклад.'
    });
  } catch (error: any) {
    logger.error('[API] Error creating feature:', error);
    return NextResponse.json(
      { error: 'Не удалось создать функцию' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/features - Обновить функцию (для админки)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { featureId, updates } = body;

    if (!featureId || !updates) {
      return NextResponse.json(
        { error: 'featureId и updates обязательны' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const featuresCollection = db.features;

    const feature = await featuresCollection.findOne(featureId).exec();

    if (!feature) {
      return NextResponse.json(
        { error: 'Функция не найдена' },
        { status: 404 }
      );
    }

    await feature.patch({
      ...updates,
      updatedAt: Date.now()
    });

    return NextResponse.json({
      success: true,
      message: 'Функция обновлена'
    });
  } catch (error: any) {
    logger.error('[API] Error updating feature:', error);
    return NextResponse.json(
      { error: 'Не удалось обновить функцию' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/features - Удалить функцию
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featureId = searchParams.get('featureId');

    if (!featureId) {
      return NextResponse.json(
        { error: 'featureId обязателен' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const featuresCollection = db.features;

    const feature = await featuresCollection.findOne(featureId).exec();

    if (!feature) {
      return NextResponse.json(
        { error: 'Функция не найдена' },
        { status: 404 }
      );
    }

    await feature.remove();

    return NextResponse.json({
      success: true,
      message: 'Функция удалена'
    });
  } catch (error: any) {
    logger.error('[API] Error deleting feature:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить функцию' },
      { status: 500 }
    );
  }
}
