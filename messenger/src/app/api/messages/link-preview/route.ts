import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * POST /api/messages/link-preview - Получить превью ссылки
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL обязателен' },
        { status: 400 }
      );
    }

    // Проверка валидности URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Неверный формат URL' },
        { status: 400 }
      );
    }

    // Проверка протокола
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: 'Поддерживаются только HTTP и HTTPS ссылки' },
        { status: 400 }
      );
    }

    // Для демо возвращаем mock данные
    // В production здесь будет fetch с парсингом Open Graph
    const mockPreview = {
      url,
      title: parsedUrl.hostname,
      description: `Ссылка на ${parsedUrl.hostname}`,
      image: null,
      siteName: parsedUrl.hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=32`
    };

    logger.debug(`[LinkPreview] Generated preview for: ${url}`);

    return NextResponse.json({
      success: true,
      preview: mockPreview
    });
  } catch (error: any) {
    logger.error('[API] Error generating link preview:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при генерации превью' },
      { status: 500 }
    );
  }
}

/**
 * Парсинг Open Graph метаданных (серверная функция)
 * В production раскомментировать и использовать node-fetch или axios
 */
async function fetchUrlMetadata(url: string) {
  // В production:
  // const response = await fetch(url, { 
  //   headers: { 'User-Agent': 'Balloo Messenger Bot' }
  // });
  // const html = await response.text();
  // Парсинг через cheerio или regex для meta tags
  
  return {
    title: '',
    description: '',
    image: '',
    siteName: ''
  };
}
