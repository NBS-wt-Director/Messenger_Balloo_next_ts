
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import db from '@/lib/database';

/**
 * GET /api/features - Получить список функций
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    let query = 'SELECT * FROM Feature';
    const params: any[] = [];

    if (status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY createdAt DESC';

    const features = db.prepare(query).all(...params) as any[];

    return NextResponse.json({
      success: true,
      features: features.map(f => ({
        id: f.id,
        title: f.title,
        description: f.description,
        category: f.category,
        status: f.status,
        votes: f.votes,
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
 * POST /api/features - Предложить новую функцию
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, userId } = body;

    if (!title || !description || !userId) {
      return NextResponse.json(
        { error: 'title, description и userId обязательны' },
        { status: 400 }
      );
    }

    const id = `feat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO Feature (id, title, description, category, status, votes, adminNote, createdBy, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, 'pending', 0, '', ?, ?, ?)
    `).run(id, title, description, category || 'general', userId, now, now);

    return NextResponse.json({
      success: true,
      feature: {
        id, title, description, category: category || 'general', status: 'pending', votes: 0,
        createdBy: userId, createdAt: now, updatedAt: now
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
 * PATCH /api/features - Обновить функцию
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

    const updateFields: string[] = [];
    const params: any[] = [];

    for (const key of Object.keys(updates)) {
      updateFields.push(`${key} = ?`);
      params.push(updates[key]);
    }

    const now = new Date().toISOString();
    updateFields.push('updatedAt = ?');
    params.push(now, featureId);

    db.prepare(`UPDATE Feature SET ${updateFields.join(', ')} WHERE id = ?`).run(...params);

    const updatedFeature = db.prepare('SELECT * FROM Feature WHERE id = ?').get(featureId);

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

    db.prepare('DELETE FROM Feature WHERE id = ?').run(featureId);

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
