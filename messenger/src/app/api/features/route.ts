
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/features - Получить список функций
 * query: status?: 'planned' | 'in-progress' | 'completed' | 'all'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const where: any = {};
    if (status !== 'all') {
      where.status = status;
    }

    const features = await prisma.feature.findMany({
      where,
      include: { featureVotes: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      features: features.map(f => ({
        id: f.id,
        title: f.title,
        description: f.description,
        category: f.category,
        status: f.status,
        votes: f.featureVotes.length,
        adminNote: f.adminNote,
        plannedAt: f.plannedAt,
        completedAt: f.completedAt,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
        createdBy: f.createdBy
      }))
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

    const now = new Date();

    const newFeature = await prisma.feature.create({
      data: {
        id: `feat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        category: category || 'general',
        status: 'pending',
        votes: 0,
        adminNote: '',
        plannedAt: null,
        completedAt: null,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: { featureVotes: false }
    });

    return NextResponse.json({
      success: true,
      feature: {
        id: newFeature.id,
        title: newFeature.title,
        description: newFeature.description,
        category: newFeature.category,
        status: newFeature.status,
        votes: newFeature.votes,
        createdBy: newFeature.createdBy,
        createdAt: newFeature.createdAt,
        updatedAt: newFeature.updatedAt
      },
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

    const updatedFeature = await prisma.feature.update({
      where: { id: featureId },
      data: {
        ...updates,
        updatedAt: new Date()
      },
      include: { featureVotes: false }
    });

    return NextResponse.json({
      success: true,
      feature: updatedFeature,
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

    await prisma.feature.delete({
      where: { id: featureId }
    });

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
