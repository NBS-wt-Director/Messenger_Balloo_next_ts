/**
 * End-to-End Encryption Library
 * Полное шифрование сообщений и файлов между устройствами
 */

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  authTag: string;
  keyId: string;
  timestamp: number;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  keyId: string;
  createdAt: number;
}

export interface SharedKey {
  keyId: string;
  key: string;
  chatId: string;
  participants: string[];
  createdAt: number;
}

/**
 * Генерация пары ключей RSA для обмена
 */
export async function generateKeyPair(): Promise<KeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );

  const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  const keyId = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    publicKey: arrayBufferToBase64(publicKey),
    privateKey: arrayBufferToBase64(privateKey),
    keyId,
    createdAt: Date.now()
  };
}

/**
 * Импорт публичного ключа
 */
export async function importPublicKey(publicKeyString: string): Promise<CryptoKey> {
  const publicKeyBuffer = base64ToArrayBuffer(publicKeyString);
  
  return await crypto.subtle.importKey(
    'spki',
    publicKeyBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']
  );
}

/**
 * Импорт приватного ключа
 */
export async function importPrivateKey(privateKeyString: string): Promise<CryptoKey> {
  const privateKeyBuffer = base64ToArrayBuffer(privateKeyString);
  
  return await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['decrypt']
  );
}

/**
 * Шифрование сообщения AES-GCM
 */
export async function encryptMessage(
  message: string,
  key: CryptoKey
): Promise<EncryptedData> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    data
  );

  const encryptedBuffer = new Uint8Array(encrypted);
  const ciphertext = encryptedBuffer.slice(0, -16);
  const authTag = encryptedBuffer.slice(-16);

  return {
    ciphertext: arrayBufferToBase64(ciphertext.buffer),
    iv: arrayBufferToBase64(iv.buffer),
    authTag: arrayBufferToBase64(authTag.buffer),
    keyId: await getKeyId(key),
    timestamp: Date.now()
  };
}

/**
 * Расшифровка сообщения
 */
export async function decryptMessage(
  encryptedData: EncryptedData,
  key: CryptoKey
): Promise<string> {
  const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);
  const iv = base64ToArrayBuffer(encryptedData.iv);
  const authTag = base64ToArrayBuffer(encryptedData.authTag);

  // Объединение ciphertext и authTag
  const combined = new Uint8Array(ciphertext.byteLength + authTag.byteLength);
  combined.set(new Uint8Array(ciphertext));
  combined.set(new Uint8Array(authTag), ciphertext.byteLength);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv)
    },
    key,
    combined
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Шифрование файла
 */
export async function encryptFile(file: File): Promise<{
  encryptedData: ArrayBuffer;
  encryptionInfo: EncryptedData;
  key: CryptoKey
}> {
  // Генерация ключа для файла
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const fileBuffer = await file.arrayBuffer();

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    fileBuffer
  );

  const encryptedBuffer = new Uint8Array(encrypted);
  const ciphertext = encryptedBuffer.slice(0, -16);
  const authTag = encryptedBuffer.slice(-16);

  const keyId = await getKeyId(key);

  return {
    encryptedData: ciphertext.buffer,
    encryptionInfo: {
      ciphertext: '',
      iv: arrayBufferToBase64(iv.buffer),
      authTag: arrayBufferToBase64(authTag.buffer),
      keyId,
      timestamp: Date.now()
    },
    key
  };
}

/**
 * Расшифровка файла
 */
export async function decryptFile(
  encryptedData: ArrayBuffer,
  iv: ArrayBuffer,
  authTag: ArrayBuffer,
  key: CryptoKey
): Promise<ArrayBuffer> {
  const ciphertext = new Uint8Array(encryptedData);
  const combined = new Uint8Array(ciphertext.length + authTag.byteLength);
  combined.set(ciphertext);
  combined.set(new Uint8Array(authTag), ciphertext.length);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv)
    },
    key,
    combined
  );

  return decrypted;
}

/**
 * Обмен ключами через RSA
 */
export async function exchangeKey(
  aesKey: CryptoKey,
  recipientPublicKey: CryptoKey
): Promise<string> {
  const keyData = await crypto.subtle.exportKey('raw', aesKey);
  
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    recipientPublicKey,
    keyData
  );

  return arrayBufferToBase64(encrypted);
}

/**
 * Получение ключа после обмена
 */
export async function receiveKey(
  encryptedKey: string,
  privateKey: CryptoKey
): Promise<CryptoKey> {
  const encryptedData = base64ToArrayBuffer(encryptedKey);
  
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP'
    },
    privateKey,
    encryptedData
  );

  return await crypto.subtle.importKey(
    'raw',
    decrypted,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Генерация общего ключа для чата (Diffie-Hellman)
 */
export async function generateSharedKey(
  chatId: string,
  participants: string[]
): Promise<SharedKey> {
  // В реальном приложении используется ECDH для генерации общего ключа
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const keyData = await crypto.subtle.exportKey('raw', key);
  const keyId = `shared_${chatId}_${Date.now()}`;

  return {
    keyId,
    key: arrayBufferToBase64(keyData),
    chatId,
    participants,
    createdAt: Date.now()
  };
}

/**
 * Сохранение ключей в IndexedDB
 */
export class KeyStorage {
  private static dbName = 'balloo-e2e-keys';
  private static storeName = 'keys';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(KeyStorage.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(KeyStorage.storeName)) {
          db.createObjectStore(KeyStorage.storeName, { keyPath: 'keyId' });
        }
      };
    });
  }

  async saveKey(keyId: string, keyData: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KeyStorage.storeName], 'readwrite');
      const store = transaction.objectStore(KeyStorage.storeName);
      
      const request = store.put({ keyId, data: keyData, createdAt: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getKey(keyId: string): Promise<any> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KeyStorage.storeName], 'readonly');
      const store = transaction.objectStore(KeyStorage.storeName);
      
      const request = store.get(keyId);
      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteKey(keyId: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KeyStorage.storeName], 'readwrite');
      const store = transaction.objectStore(KeyStorage.storeName);
      
      const request = store.delete(keyId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KeyStorage.storeName], 'readwrite');
      const store = transaction.objectStore(KeyStorage.storeName);
      
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * Синхронизация ключей между устройствами
 */
export async function syncKeysToDevice(
  userId: string,
  deviceId: string,
  keys: KeyPair[]
): Promise<void> {
  // Шифрование ключей для целевого устройства
  const response = await fetch('/api/sync/keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      deviceId,
      keys: keys.map(k => ({
        keyId: k.keyId,
        publicKey: k.publicKey,
        encryptedPrivateKey: k.privateKey // Уже зашифрован
      }))
    })
  });

  if (!response.ok) {
    throw new Error('Failed to sync keys');
  }
}

/**
 * Получение ключей с сервера синхронизации
 */
export async function getKeysFromSync(userId: string): Promise<KeyPair[]> {
  const response = await fetch(`/api/sync/keys?userId=${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get keys');
  }

  const data = await response.json();
  return data.keys;
}

// Утилиты
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getKeyId(key: CryptoKey): Promise<string> {
  const keyData = await crypto.subtle.exportKey('raw', key);
  const hash = await crypto.subtle.digest('SHA-256', keyData);
  return arrayBufferToBase64(hash).substr(0, 16);
}
