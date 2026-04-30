import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * GET /api/versions
 * Получение информации о версиях
 */
export async function GET(request: NextRequest) {
  try {
    const filePath = join(process.cwd(), 'versions.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error('[Versions] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при чтении версий' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/versions
 * Добавление новой версии (админка)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { version, type, features, fixes, author } = body;

    if (!version) {
      return NextResponse.json(
        { error: 'Версия обязательна' },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), 'versions.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    const newVersion = {
      version,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      type: type || 'release',
      features: features || [],
      fixes: fixes || [],
      author: author || 'NLP-Core-Team'
    };

    // Обновляем текущую версию
    data.currentVersion = version;
    data.versions.unshift(newVersion);

    // Записываем обратно
    const updatedContent = JSON.stringify(data, null, 2);
    readFileSync(filePath, 'utf-8');
    require('fs').writeFileSync(filePath, updatedContent, 'utf-8');

    return NextResponse.json({
      success: true,
      currentVersion: version,
      version: newVersion
    });
  } catch (error) {
    console.error('[Versions] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при сохранении версии' },
      { status: 500 }
    );
  }
}
