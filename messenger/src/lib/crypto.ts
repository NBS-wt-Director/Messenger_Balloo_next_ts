import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';

// Типы ключей
export interface KeyPair {
  publicKey: string; // Base64
  secretKey: string; // Base64
}

// Генерация ключевой пары
export function generateKeyPair(): KeyPair {
  const keyPair = nacl.box.keyPair();
  
  return {
    publicKey: encodeBase64(keyPair.publicKey),
    secretKey: encodeBase64(keyPair.secretKey),
  };
}

// Генерация случайного ключа для симметричного шифрования
export function generateSymmetricKey(): string {
  const key = nacl.randomBytes(32);
  return encodeBase64(key);
}

// Создание общего секретного ключа (DH)
export function createSharedSecret(
  mySecretKey: string, // Base64
  theirPublicKey: string // Base64
): string {
  const mySecretKeyBytes = decodeBase64(mySecretKey);
  const theirPublicKeyBytes = decodeBase64(theirPublicKey);
  
  const sharedKey = nacl.box.before(theirPublicKeyBytes, mySecretKeyBytes);
  return encodeBase64(sharedKey);
}

// Шифрование сообщения (асимметричное - для E2E)
export function encryptMessage(
  message: string,
  sharedSecret: string // Base64
): { encrypted: string; nonce: string } {
  const nonce = nacl.randomBytes(24);
  const messageBytes = decodeUTF8(message);
  const sharedSecretBytes = decodeBase64(sharedSecret);
  
  const encrypted = nacl.box.after(messageBytes, nonce, sharedSecretBytes);
  
  return {
    encrypted: encodeBase64(encrypted),
    nonce: encodeBase64(nonce),
  };
}

// Расшифровка сообщения
export function decryptMessage(
  encrypted: string,
  nonce: string,
  sharedSecret: string // Base64
): string | null {
  try {
    const encryptedBytes = decodeBase64(encrypted);
    const nonceBytes = decodeBase64(nonce);
    const sharedSecretBytes = decodeBase64(sharedSecret);
    
    const decrypted = nacl.box.open.after(encryptedBytes, nonceBytes, sharedSecretBytes);
    
    if (!decrypted) return null;
    
    return encodeUTF8(decrypted);
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Decryption error:', e);
    }
    return null;
  }
}

// Симметричное шифрование (для локального хранения)
export function encryptSymmetric(
  message: string,
  key: string // Base64
): { encrypted: string; nonce: string } {
  const nonce = nacl.randomBytes(24);
  const messageBytes = decodeUTF8(message);
  const keyBytes = decodeBase64(key);
  
  const encrypted = nacl.secretbox(messageBytes, nonce, keyBytes);
  
  return {
    encrypted: encodeBase64(encrypted),
    nonce: encodeBase64(nonce),
  };
}

// Расшифровка симметричная
export function decryptSymmetric(
  encrypted: string,
  nonce: string,
  key: string // Base64
): string | null {
  try {
    const encryptedBytes = decodeBase64(encrypted);
    const nonceBytes = decodeBase64(nonce);
    const keyBytes = decodeBase64(key);
    
    const decrypted = nacl.secretbox.open(encryptedBytes, nonceBytes, keyBytes);
    
    if (!decrypted) return null;
    
    return encodeUTF8(decrypted);
  } catch (e) {
    return null;
  }
}

// Хеширование пароля
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const useSalt = salt || encodeBase64(nacl.randomBytes(16));
  const saltBytes = decodeBase64(useSalt);
  const passwordBytes = decodeUTF8(password);
  
  // Простое хеширование (в продакшене использовать PBKDF2 или Argon2)
  const combined = new Uint8Array([...saltBytes, ...passwordBytes]);
  const hash = nacl.hash(combined);
  
  return {
    hash: encodeBase64(hash.slice(0, 32)),
    salt: useSalt,
  };
}

// Проверка пароля
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const result = hashPassword(password, salt);
  return result.hash === hash;
}

// Утилита для генерации ID
export function generateId(): string {
  const randomBytes = nacl.randomBytes(16);
  return encodeBase64(randomBytes).replace(/[/+=]/g, '').slice(0, 16);
}

// Шифрование файла (простой XOR - для демонстрации)
// В продакшене использовать Web Crypto API
export async function encryptFile(file: File, key: string): Promise<{ encrypted: Buffer; iv: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const keyBytes = decodeBase64(key);
  const iv = nacl.randomBytes(16);
  
  // Простой XOR (для демонстрации)
  const encrypted = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    encrypted[i] = bytes[i] ^ keyBytes[i % keyBytes.length] ^ iv[i % iv.length];
  }
  
  return {
    encrypted: Buffer.from(encrypted),
    iv: encodeBase64(iv),
  };
}

// Дешифрование файла
export async function decryptFile(encrypted: Buffer, key: string, iv: string): Promise<Uint8Array> {
  const keyBytes = decodeBase64(key);
  const ivBytes = decodeBase64(iv);
  const encryptedBytes = new Uint8Array(encrypted);
  
  const decrypted = new Uint8Array(encryptedBytes.length);
  for (let i = 0; i < encryptedBytes.length; i++) {
    decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length] ^ ivBytes[i % ivBytes.length];
  }
  
  return decrypted;
}
