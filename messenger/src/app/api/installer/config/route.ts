 import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import fs from 'fs';
import path from 'path';

/**
 * POST /api/installer/config - Обновить config.json
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { push, admin } = body;

    // Путь к config.json
    const configPath = path.join(process.cwd(), 'config.json');

    // Читаем существующий config
    let config: any = {};
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(content);
    }

    // Обновляем поля
    if (push) {
      config.push = { ...config.push, ...push };
    }
    if (admin) {
      config.admin = { ...config.admin, ...admin };
    }

    // Записываем обратно
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

    logger.info('[Installer] config.json обновлён');

    return NextResponse.json({
      success: true,
      message: 'config.json обновлён'
    });
  } catch (error: any) {
    logger.error('[Installer] Error updating config.json:', error);
    return NextResponse.json(
      { error: 'Не удалось обновить config.json: ' + error.message },
      { status: 500 }
    );
  }
}
