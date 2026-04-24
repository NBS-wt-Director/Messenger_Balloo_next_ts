import { NextResponse } from 'next/server';
import { getVapidKeys } from '@/lib/config';

/**
 * API для получения VAPID публичного ключа
 * GET /api/notifications/vapid-key
 */

const vapidKeys = getVapidKeys();

export async function GET() {
  return NextResponse.json({
    success: true,
    publicKey: vapidKeys.publicKey
  });
}
