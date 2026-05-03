import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * API для создания жалобы
 * POST /api/reports
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      targetType, // 'chat', 'user', 'contact', 'invitation'
      targetId,
      reportedBy,
      reason,
      description
    } = body;

    if (!targetType || !targetId || !reportedBy || !reason) {
      return NextResponse.json(
        { error: 'targetType, targetId, reportedBy и reason обязательны' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Проверка на дубликат жалобы
    const existingReport = db.prepare(`
      SELECT id FROM Report WHERE targetType = ? AND targetId = ? AND reportedBy = ? AND status = 'pending'
    `).get(targetType, targetId, reportedBy);

    if (existingReport) {
      return NextResponse.json(
        { error: 'Вы уже подавали жалобу на этот объект' },
        { status: 400 }
      );
    }

    // Создание жалобы
    db.prepare(`
      INSERT INTO Report (id, targetType, targetId, reportedBy, reason, description, status, createdAt, reviewedBy, reviewedAt, resolution)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, NULL, NULL, NULL)
    `).run(reportId, targetType, targetId, reportedBy, reason, description || '', now);

    return NextResponse.json({
      success: true,
      report: {
        id: reportId,
        targetType,
        targetId,
        reportedBy,
        reason,
        description: description || '',
        status: 'pending',
        createdAt: now,
        reviewedBy: null,
        reviewedAt: null,
        resolution: null
      },
      message: 'Жалоба отправлена'
    });
  } catch (error: any) {
    console.error('[API] Error creating report:', error);
    return NextResponse.json(
      { error: 'Не удалось создать жалобу' },
      { status: 500 }
    );
  }
}

/**
 * API для получения списка жалоб (админка)
 * GET /api/reports?status=pending&limit=50
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const targetType = searchParams.get('targetType');

    let query = `
      SELECT * FROM Report WHERE 1=1
    `;
    const params: any[] = [];

    if (status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (targetType) {
      query += ' AND targetType = ?';
      params.push(targetType);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const reports = db.prepare(query).all(...params) as any[];

    // Получение дополнительной информации
    const reportsWithDetails = await Promise.all(
      reports.map(async (report: any) => {
        // Информация о том, кто подал жалобу
        const reporter = db.prepare('SELECT displayName, email FROM User WHERE id = ?').get(report.reportedBy) as any;
        
        // Информация об объекте жалобы
        let targetInfo: any = {};
        if (report.targetType === 'chat') {
          const chat = db.prepare('SELECT name, type FROM Chat WHERE id = ?').get(report.targetId) as any;
          targetInfo = { name: chat?.name, type: chat?.type };
        } else if (report.targetType === 'user') {
          const user = db.prepare('SELECT displayName, email FROM User WHERE id = ?').get(report.targetId) as any;
          targetInfo = { name: user?.displayName, email: user?.email };
        }

        return {
          ...report,
          reporterName: reporter?.displayName || reporter?.email || 'Unknown',
          targetInfo
        };
      })
    );

    const totalQuery = 'SELECT COUNT(*) as count FROM Report WHERE 1=1';
    let totalParams: any[] = [];
    
    if (status !== 'all') {
      query += ' AND status = ?';
      totalParams.push(status);
    }

    if (targetType) {
      totalParams.push(targetType);
    }

    const total = db.prepare(totalQuery).get(...totalParams) as any;

    return NextResponse.json({
      success: true,
      reports: reportsWithDetails,
      total: total.count,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('[API] Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Не удалось получить жалобы' },
      { status: 500 }
    );
  }
}

/**
 * API для обновления статуса жалобы (админка)
 * PUT /api/reports/:id
 */

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    const { status, resolution, reviewedBy } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'id жалобы обязателен' },
        { status: 400 }
      );
    }

    const report = db.prepare('SELECT * FROM Report WHERE id = ?').get(id) as any;

    if (!report) {
      return NextResponse.json(
        { error: 'Жалоба не найдена' },
        { status: 404 }
      );
    }

    const updateStatus = status || report.status;
    const updateResolution = resolution !== undefined ? resolution : report.resolution;
    const updateReviewedBy = reviewedBy || report.reviewedBy;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE Report 
      SET status = ?, resolution = ?, reviewedBy = ?, reviewedAt = ?, updatedAt = ?
      WHERE id = ?
    `).run(updateStatus, updateResolution, updateReviewedBy, now, now, id);

    return NextResponse.json({
      success: true,
      message: 'Жалоба обновлена',
      report: {
        ...report,
        status: updateStatus,
        resolution: updateResolution,
        reviewedBy: updateReviewedBy,
        reviewedAt: now,
        updatedAt: now
      }
    });
  } catch (error: any) {
    console.error('[API] Error updating report:', error);
    return NextResponse.json(
      { error: 'Не удалось обновить жалобу' },
      { status: 500 }
    );
  }
}
