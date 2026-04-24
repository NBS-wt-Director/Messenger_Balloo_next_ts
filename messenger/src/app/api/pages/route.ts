import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { logger } from '@/lib/logger';

/**
 * GET /api/pages - Получить контент страницы
 * query: slug: 'support' | 'about-company' | 'about-balloo'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'slug обязателен' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const pagesCollection = db.pages;

    const page = await pagesCollection.findOne(slug).exec();

    if (!page) {
      // Возвращаем дефолтный контент если страница не найдена
      return NextResponse.json({
        success: true,
        page: getDefaultPage(slug),
        isDefault: true
      });
    }

    return NextResponse.json({
      success: true,
      page: page.toJSON(),
      isDefault: false
    });
  } catch (error: any) {
    logger.error('[API] Error fetching page:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить страницу' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pages - Создать/обновить страницу (админка)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      slug, 
      title, 
      content, 
      sections,
      metadata 
    } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'slug и title обязательны' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const pagesCollection = db.pages;

    const existingPage = await pagesCollection.findOne(slug).exec();
    const now = Date.now();

    if (existingPage) {
      // Обновление существующей
      await existingPage.patch({
        title,
        content: content || existingPage.content,
        sections: sections || existingPage.sections,
        metadata: metadata || existingPage.metadata,
        updatedAt: now
      });

      return NextResponse.json({
        success: true,
        message: 'Страница обновлена'
      });
    } else {
      // Создание новой
      await pagesCollection.insert({
        id: slug,
        title,
        content: content || '',
        sections: sections || [],
        metadata: metadata || {},
        isActive: true,
        createdBy: 'admin',
        createdAt: now,
        updatedAt: now
      });

      return NextResponse.json({
        success: true,
        message: 'Страница создана'
      });
    }
  } catch (error: any) {
    logger.error('[API] Error saving page:', error);
    return NextResponse.json(
      { error: 'Не удалось сохранить страницу' },
      { status: 500 }
    );
  }
}

/**
 * GET дефолтный контент для страниц
 */
function getDefaultPage(slug: string) {
  const defaults: Record<string, any> = {
    'support': {
      id: 'support',
      title: 'Поддержать проект',
      content: 'Ваша поддержка помогает развивать Balloo Messenger. Спасибо за ваш вклад!',
      sections: [
        {
          id: 'sbp',
          type: 'payment',
          title: 'СБП (Система Быстрых Платежей)',
          content: 'Мгновенный перевод по номеру телефона без комиссии',
          data: {
            method: 'sbp',
            phone: '8 (912) 202-30-35',
            bank: 'Сбербанк',
            recipient: 'Иван Оберюхтин'
          }
        },
        {
          id: 'qr',
          type: 'qr',
          title: 'QR-код для оплаты',
          content: 'Отсканируйте QR-код для быстрого перевода через СБП',
          data: {
            qrCodeUrl: '' // Администратор может добавить URL QR-кода
          }
        }
      ],
      metadata: {
        icon: 'Heart',
        color: '#ef4444'
      },
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    'about-company': {
      id: 'about-company',
      title: 'О компании',
      content: 'История создания Balloo Messenger',
      sections: [
        {
          id: 'developer',
          type: 'person',
          title: 'Разработчик',
          content: 'Иван Оберюхтин',
          data: {
            name: 'Иван Оберюхтин',
            location: 'Екатеринбург, Россия',
            bio: 'Разработчик-одиночка, создающий Balloo Messenger с любовью к приватности и безопасности',
            interests: [
              { text: 'Разработка на React/Next.js', icon: 'code' },
              { text: 'Ушу (тренируется и тренирует)', icon: 'sport' },
              { text: 'ГРБ (тренируется и тренирует)', icon: 'sport' },
              { text: 'Вайбкодинг — код в потоке', icon: 'flow' }
            ],
            avatar: '/avatars/developer.jpg'
          }
        },
        {
          id: 'story',
          type: 'text',
          title: 'История проекта',
          content: 'Balloo был создан как независимый мессенджер с фокусом на приватность и безопасность',
          data: {}
        },
        {
          id: 'tech',
          type: 'features',
          title: 'Технологии',
          content: 'Современный стек технологий для безопасного общения',
          data: {
            technologies: [
              { name: 'React', icon: '⚛️', description: 'UI библиотека' },
              { name: 'Next.js', icon: '▲', description: 'Фреймворк' },
              { name: 'TypeScript', icon: '📘', description: 'Типизация' },
              { name: 'RxDB', icon: '🗄️', description: 'Локальная БД' },
              { name: 'WebRTC', icon: '📞', description: 'Звонки' },
              { name: 'Web Crypto API', icon: '🔐', description: 'Шифрование' },
              { name: 'Vibe Coding', icon: '🌊', description: 'Код в потоке' }
            ]
          }
        }
      ],
      metadata: {
        icon: 'Building2',
        color: '#3b82f6'
      },
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    'about-balloo': {
      id: 'about-balloo',
      title: 'О Balloo',
      content: 'Balloo Messenger - безопасный мессенджер',
      sections: [
        {
          id: 'features',
          type: 'features-list',
          title: 'Возможности',
          content: 'Все функции мессенджера',
          data: {
            features: []
          }
        }
      ],
      metadata: {
        icon: 'MessageCircle',
        color: '#8b5cf6'
      },
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  };

  return defaults[slug] || {
    id: slug,
    title: slug,
    content: '',
    sections: [],
    metadata: {},
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
