import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName, fullName, birthDate } = body;

    // Валидация
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'email, пароль и имя обязательны' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен быть не менее 6 символов' },
        { status: 400 }
      );
    }

    // Проверка существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      );
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, 10);

    // Создание пользователя через Prisma
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        displayName,
        fullName: fullName || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        avatar: '',
        status: 'online',
        isAdmin: false,
        isSuperAdmin: false,
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[API] ✅ Пользователь зарегистрирован:', user.id);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        fullName: user.fullName,
        avatar: user.avatar,
        status: user.status,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin
      },
      message: 'Пользователь успешно зарегистрирован'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error registering user:', error);
    }
    
    return NextResponse.json(
      { error: 'Не удалось зарегистрировать пользователя' },
      { status: 500 }
    );
  }
}
