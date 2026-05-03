
import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';
import { fileLogger } from './file-logger';

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
    
    if (!decrypted) {
      fileLogger.warn('[Crypto] Decryption failed: invalid ciphertext', {
        encryptedLength: encrypted.length,
        nonceLength: nonce.length,
      });
      return null;
    }
    
    return encodeUTF8(decrypted);
  } catch (error: any) {
    fileLogger.error('[Crypto] Decryption error', {
      message: error.message,
      name: error.name,
      encryptedLength: encrypted.length,
    });
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
    
    if (!decrypted) {
      fileLogger.warn('[Crypto] Symmetric decryption failed: invalid MAC', {
        encryptedLength: encrypted.length,
      });
      return null;
    }
    
    return encodeUTF8(decrypted);
  } catch (error: any) {
    fileLogger.error('[Crypto] Symmetric decryption error', {
      message: error.message,
      name: error.name,
    });
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

// AES-GCM шифрование файлов с использованием Web Crypto API
// Безопасное шифрование для production

/**
 * Генерация случайного ключа AES-GCM (256 бит)
 */
export async function generateAESKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Экспорт ключа в Base64
 */
export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  const bytes = new Uint8Array(exported);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

/**
 * Импорт ключа из Base64
 */
export async function importKeyFromBase64(base64Key: string): Promise<CryptoKey> {
  const binary = atob(base64Key);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  return crypto.subtle.importKey(
    'raw',
    bytes,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Шифрование файла с использованием AES-GCM
 */
export async function encryptFileAES(file: File, key: CryptoKey): Promise<{ encrypted: Buffer; iv: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  
  // Генерация случайного IV (12 байт для GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Шифрование
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return {
    encrypted: Buffer.from(encrypted),
    iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
  };
}

/**
 * Расшифровка файла с использованием AES-GCM
 */
export async function decryptFileAES(encrypted: Buffer, key: CryptoKey, ivHex: string): Promise<Uint8Array> {
  // Преобразование hex IV обратно в байты
  const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  
  // Конвертация Buffer в Uint8Array для Web Crypto API
  const encryptedView = new Uint8Array(encrypted.buffer, encrypted.byteOffset, encrypted.byteLength);
  
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedView as any as BufferSource
    );
    
    return new Uint8Array(decrypted);
  } catch (error: any) {
    fileLogger.error('[Crypto] AES-GCM file decryption failed', {
      message: error.message,
      name: error.name,
      encryptedSize: encrypted.length,
      ivHex,
    });
    throw new Error('Failed to decrypt file: invalid key or corrupted data');
  }
}

/**
 * Шифрование текста с использованием AES-GCM
 */
export async function encryptTextAES(text: string, key: CryptoKey): Promise<{ encrypted: string; iv: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  // Конвертация в base64
  const encryptedBytes = new Uint8Array(encrypted);
  let encryptedBinary = '';
  encryptedBytes.forEach((byte) => {
    encryptedBinary += String.fromCharCode(byte);
  });
  
  return {
    encrypted: btoa(encryptedBinary),
    iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
  };
}

/**
 * Расшифровка текста с использованием AES-GCM
 */
export async function decryptTextAES(encryptedBase64: string, key: CryptoKey, ivHex: string): Promise<string> {
  const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  
  const encryptedBytes = new Uint8Array(encryptedBase64.length);
  for (let i = 0; i < encryptedBase64.length; i++) {
    encryptedBytes[i] = encryptedBase64.charCodeAt(i);
  }
  
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBytes
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error: any) {
    fileLogger.error('[Crypto] AES-GCM text decryption failed', {
      message: error.message,
      name: error.name,
      encryptedLength: encryptedBase64.length,
      ivHex,
    });
    throw new Error('Failed to decrypt text: invalid key or corrupted data');
  }
}
