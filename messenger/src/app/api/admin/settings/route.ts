import { NextRequest, NextResponse } from 'next/server';

interface AdminSettings {
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  maxGroupSize: number;
  maxFileSize: number;
  messageRetentionDays: number;
  maintenanceMode: boolean;
  allowedDomains: string[];
  defaultLanguage: string;
  theme: string;
}

// Хранилище настроек (в реальном приложении - база данных)
let settings: AdminSettings = {
  registrationEnabled: true,
  emailVerificationRequired: false,
  maxGroupSize: 1000,
  maxFileSize: 100 * 1024 * 1024, // 100MB
  messageRetentionDays: 365,
  maintenanceMode: false,
  allowedDomains: ['*'],
  defaultLanguage: 'ru',
  theme: 'dark'
};

// Получение настроек
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json(
        { error: 'adminId требуется' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching settings:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить настройки' },
      { status: 500 }
    );
  }
}

// Обновление настроек
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, updates } = body;

    if (!adminId || !updates) {
      return NextResponse.json(
        { error: 'adminId и updates обязательны' },
        { status: 400 }
      );
    }

    const allowedUpdates = [
      'registrationEnabled',
      'emailVerificationRequired',
      'maxGroupSize',
      'maxFileSize',
      'messageRetentionDays',
      'maintenanceMode',
      'allowedDomains',
      'defaultLanguage',
      'theme'
    ];

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        (settings as any)[key] = updates[key];
      }
    }

    return NextResponse.json({
      success: true,
      settings,
      message: 'Настройки обновлены'
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error updating settings:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось обновить настройки' },
      { status: 500 }
    );
  }
}
