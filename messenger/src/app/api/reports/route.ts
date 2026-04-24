import { NextRequest, NextResponse } from 'next/server';
import { getReportsCollection, getChatsCollection, getUsersCollection } from '@/lib/database';

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

    const reportsCollection = await getReportsCollection();
    const now = Date.now();

    // Проверка на дубликат жалобы
    const existingReport = await reportsCollection
      .findOne({
        selector: {
          targetType,
          targetId,
          reportedBy,
          status: 'pending'
        }
      })
      .exec();

    if (existingReport) {
      return NextResponse.json(
        { error: 'Вы уже подавали жалобу на этот объект' },
        { status: 400 }
      );
    }

    // Создание жалобы
    const newReport = await reportsCollection.insert({
      id: `report_${now}_${Math.random().toString(36).substr(2, 9)}`,
      targetType,
      targetId,
      reportedBy,
      reason,
      description: description || '',
      status: 'pending', // pending, reviewing, resolved, rejected
      createdAt: now,
      updatedAt: now,
      reviewedBy: null,
      reviewedAt: null,
      resolution: null
    });

    return NextResponse.json({
      success: true,
      report: newReport.toJSON(),
      message: 'Жалоба отправлена'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error creating report:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось создать жалобу: ' + error.message },
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

    const reportsCollection = await getReportsCollection();
    const selector: any = {};

    if (status !== 'all') {
      selector.status = status;
    }

    if (targetType) {
      selector.targetType = targetType;
    }

    const reports = await reportsCollection
      .find({
        selector,
        sort: [{ createdAt: 'desc' }],
        limit,
        skip: offset
      })
      .exec();

    // Получение дополнительной информации
    const reportsWithDetails = await Promise.all(
      reports.map(async (report) => {
        const reportData = report.toJSON();
        
        // Информация о том, кто подал жалобу
        const usersCollection = await getUsersCollection();
        const reporter = await usersCollection.findOne({ selector: { id: reportData.reportedBy } }).exec();
        
        // Информация об объекте жалобы
        let targetInfo: any = {};
        if (reportData.targetType === 'chat') {
          const chatsCollection = await getChatsCollection();
          const chat = await chatsCollection.findOne({ selector: { id: reportData.targetId } }).exec();
          targetInfo = { name: chat?.name, type: chat?.type };
        } else if (reportData.targetType === 'user') {
          const chat = await usersCollection.findOne({ selector: { id: reportData.targetId } }).exec();
          targetInfo = { name: chat?.displayName, email: chat?.email };
        }

        return {
          ...reportData,
          reporterName: reporter?.displayName || reporter?.email || 'Unknown',
          targetInfo
        };
      })
    );

    const total = await reportsCollection.count(selector).exec();

    return NextResponse.json({
      success: true,
      reports: reportsWithDetails,
      total,
      limit,
      offset
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching reports:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить жалобы: ' + error.message },
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

    const reportsCollection = await getReportsCollection();
    const report = await reportsCollection.findOne({ selector: { id } }).exec();

    if (!report) {
      return NextResponse.json(
        { error: 'Жалоба не найдена' },
        { status: 404 }
      );
    }

    const updateData: any = {
      status: status || report.status,
      resolution: resolution !== undefined ? resolution : report.resolution,
      reviewedBy: reviewedBy || report.reviewedBy,
      reviewedAt: Date.now(),
      updatedAt: Date.now()
    };

    await report.patch(updateData);

    return NextResponse.json({
      success: true,
      message: 'Жалоба обновлена',
      report: { ...report.toJSON(), ...updateData }
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error updating report:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось обновить жалобу: ' + error.message },
      { status: 500 }
    );
  }
}
