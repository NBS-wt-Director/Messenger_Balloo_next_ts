/**
 * Shared Auth Utilities - JWT handling for all platforms
 */

import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');

/**
 * Generate JWT token
 */
export async function generateToken(payload: Record<string, any>, expiresIn: string = '7d'): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Decode JWT token without verification
 */
export function decodeToken(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeToken(token);
    return payload.exp && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
