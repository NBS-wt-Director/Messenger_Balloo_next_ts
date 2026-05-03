import { NextRequest, NextResponse } from 'next/server';
import { fileLogger } from '@/lib/file-logger';
import { logger } from '@/lib/logger';

/**
 * GET /api/health
 * Health check endpoint для проверки работоспособности API
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Проверка базы данных
    let dbStatus = 'healthy';
    let dbTables: string[] = [];
    
    try {
      const { db } = await import('@/lib/database');
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as Array<{ name: string }>;
      dbTables = tables.map(t => t.name);
    } catch (error: any) {
      dbStatus = 'unhealthy';
      logger.error('[Health Check] Database error:', error.message);
    }
    
    const responseTime = Date.now() - startTime;
    
    // Определение статуса
    const isHealthy = dbStatus === 'healthy';
    const status = isHealthy ? 200 : 503;
    
    const healthData = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: {
          status: dbStatus,
          tables: dbTables.length,
        },
      },
    };
    
    // Логирование health check
    if (!isHealthy) {
      fileLogger.error('[Health Check] Service unhealthy', healthData);
    }
    
    return NextResponse.json(healthData, { status });
  } catch (error: any) {
    fileLogger.error('[Health Check] Error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 }
    );
  }
}
