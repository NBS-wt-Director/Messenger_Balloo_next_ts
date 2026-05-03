import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, platform, userId } = body;

    if (!token || !userId) {
      return NextResponse.json({ error: 'Token and userId are required' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const pushTokens = JSON.parse(user.pushTokens || '[]');
    const now = Date.now();
    
    const existingTokenIndex = pushTokens.findIndex((t: any) => t.token === token);

    if (existingTokenIndex >= 0) {
      pushTokens[existingTokenIndex] = {
        token,
        platform: platform || 'web',
        createdAt: now,
        expiresAt: now + (30 * 24 * 60 * 60 * 1000),
        lastUsedAt: now
      };
    } else {
      pushTokens.push({
        token,
        platform: platform || 'web',
        createdAt: now,
        expiresAt: now + (30 * 24 * 60 * 60 * 1000),
        lastUsedAt: now
      });
    }

    db.prepare('UPDATE User SET pushTokens = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(pushTokens), new Date().toISOString(), userId);

    return NextResponse.json({
      success: true,
      message: 'Token saved successfully',
      savedAt: now
    });
  } catch (error: any) {
    console.error('[API] Error saving token:', error);
    return NextResponse.json({ error: 'Failed to save token' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, userId } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const pushTokens = (JSON.parse(user.pushTokens || '[]') as any[]).filter((t: any) => t.token !== token);

    db.prepare('UPDATE User SET pushTokens = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(pushTokens), new Date().toISOString(), userId);

    return NextResponse.json({ success: true, message: 'Token removed successfully' });
  } catch (error: any) {
    console.error('[API] Error removing token:', error);
    return NextResponse.json({ error: 'Failed to remove token' }, { status: 500 });
  }
}
