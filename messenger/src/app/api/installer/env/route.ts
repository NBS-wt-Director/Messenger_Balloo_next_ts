import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import fs from 'fs';
import path from 'path';

/**
 * POST /api/installer/env - Создать .env.local
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content обязателен' },
        { status: 400 }
      );
    }

    // Путь к .env.local
    const envPath = path.join(process.cwd(), '.env.local');

    // Записываем файл
    fs.writeFileSync(envPath, content, 'utf8');

    logger.info('[Installer] .env.local создан');

    return NextResponse.json({
      success: true,
      message: '.env.local создан'
    });
  } catch (error: any) {
    logger.error('[Installer] Error creating .env.local:', error);
    return NextResponse.json(
      { error: 'Не удалось создать .env.local: ' + error.message },
      { status: 500 }
    );
  }
}
