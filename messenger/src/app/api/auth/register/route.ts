import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/database';
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

    const usersCollection = await getUsersCollection();

    // Проверка существующего пользователя
    const existingUser = await usersCollection.findOne({
      selector: { email: email.toLowerCase() }
    }).exec();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      );
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, 10);

    // Создание пользователя
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    await usersCollection.insert({
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      displayName,
      fullName: fullName || undefined,
      birthDate: birthDate ? new Date(birthDate).getTime() : undefined,
      familyRelations: [],
      avatar: '',
      isAdmin: false,
      isSuperAdmin: false,
      adminRoles: [],
      publicKey: '',
      status: 'online',
      isOnline: true,
      createdAt: now,
      lastSeen: now,
      updatedAt: now
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[API] ✅ Пользователь зарегистрирован:', userId);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: email.toLowerCase(),
        displayName,
        fullName: fullName || undefined,
        avatar: '',
        status: 'online',
        isAdmin: false,
        isSuperAdmin: false
      },
      message: 'Пользователь успешно зарегистрирован'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error registering user:', error);
    }
    
    // Обработка ошибок RxDB
    if (error.code === 'CONFLICT') {
      return NextResponse.json(
        { error: 'Пользователь уже существует' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Не удалось зарегистрировать пользователя' },
      { status: 500 }
    );
  }
}

