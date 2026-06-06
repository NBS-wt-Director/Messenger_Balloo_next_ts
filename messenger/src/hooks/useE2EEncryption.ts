 /**
 * E2E Encryption Hook
 * Интеграция сквозного шифрования для сообщений
 */

import { useEffect, useState, useCallback } from 'react';
import * as nacl from 'tweetnacl';
import { useAuthStore } from '@/stores/auth-store';

interface KeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

interface SharedSession {
  nonce: Uint8Array;
  key: Uint8Array;
}

export function useE2EEncryption() {
  const { user } = useAuthStore();
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [sessions, setSessions] = useState<Record<string, SharedSession>>({});
  const [isReady, setIsReady] = useState(false);

  // Генерация ключей при инициализации
  useEffect(() => {
    if (!user) {
      setKeyPair(null);
      setIsReady(false);
      return;
    }

    // Пытаемся загрузить ключи из localStorage
    const storedKeys = localStorage.getItem(`e2e_keys_${user.id}`);
    
    if (storedKeys) {
      try {
        const parsed = JSON.parse(storedKeys);
        setKeyPair({
          publicKey: new Uint8Array(parsed.publicKey),
          secretKey: new Uint8Array(parsed.secretKey),
        });
        setIsReady(true);
      } catch (error) {
        console.error('[E2E] Failed to parse stored keys:', error);
        generateKeys();
      }
    } else {
      generateKeys();
    }
  }, [user]);

  // Генерация новой пары ключей
  const generateKeys = useCallback(() => {
    const newKeyPair = nacl.box.keyPair();
    setKeyPair(newKeyPair);
    setIsReady(true);

    // Сохраняем в localStorage
    if (user) {
      localStorage.setItem(`e2e_keys_${user.id}`, JSON.stringify({
        publicKey: Array.from(newKeyPair.publicKey),
        secretKey: Array.from(newKeyPair.secretKey),
      }));
    }
  }, [user]);

  // Получение публичного ключа в base64
  const getPublicKeyBase64 = useCallback(() => {
    if (!keyPair) return null;
    return btoa(String.fromCharCode(...keyPair.publicKey));
  }, [keyPair]);

  // Установка публичного ключа собеседника
  const setPeerPublicKey = useCallback((peerId: string, publicKeyBase64: string) => {
    if (!keyPair) return;

    try {
      const peerPublicKey = new Uint8Array(
        atob(publicKeyBase64).split('').map(c => c.charCodeAt(0))
      );

      // Создаём shared session
      const sharedKey = nacl.box.before(peerPublicKey, keyPair.secretKey);
      const nonce = nacl.randomBytes(nacl.box.nonceLength);

      setSessions(prev => ({
        ...prev,
        [peerId]: { nonce, key: sharedKey },
      }));
    } catch (error) {
      console.error('[E2E] Failed to set peer public key:', error);
    }
  }, [keyPair]);

  // Шифрование сообщения
  const encryptMessage = useCallback((message: string, peerId: string): string | null => {
    const session = sessions[peerId];
    if (!session || !keyPair) {
      console.error('[E2E] No session for peer:', peerId);
      return null;
    }

    try {
      const messageBytes = new TextEncoder().encode(message);
      
      // Инкрементируем nonce для каждого сообщения
      const newNonce = new Uint8Array(session.nonce);
      newNonce[0] = (newNonce[0] + 1) % 256;

      const encrypted = nacl.box.after(messageBytes, newNonce, session.key);
      
      // Обновляем nonce в сессии
      setSessions(prev => ({
        ...prev,
        [peerId]: { ...session, nonce: newNonce },
      }));

      // Возвращаем encrypted + nonce в base64
      return btoa(String.fromCharCode(...encrypted));
    } catch (error) {
      console.error('[E2E] Encryption failed:', error);
      return null;
    }
  }, [sessions, keyPair]);

  // Расшифровка сообщения
  const decryptMessage = useCallback((encryptedBase64: string, peerId: string): string | null => {
    const session = sessions[peerId];
    if (!session || !keyPair) {
      console.error('[E2E] No session for peer:', peerId);
      return null;
    }

    try {
      const encrypted = new Uint8Array(
        atob(encryptedBase64).split('').map(c => c.charCodeAt(0))
      );

      // Инкрементируем nonce (должно совпадать с отправителем)
      const newNonce = new Uint8Array(session.nonce);
      newNonce[0] = (newNonce[0] + 1) % 256;

      const decrypted = nacl.box.open.after(encrypted, newNonce, session.key);
      
      if (!decrypted) {
        console.error('[E2E] Decryption failed');
        return null;
      }

      // Обновляем nonce в сессии
      setSessions(prev => ({
        ...prev,
        [peerId]: { ...session, nonce: newNonce },
      }));

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('[E2E] Decryption failed:', error);
      return null;
    }
  }, [sessions, keyPair]);

  // Экспорт ключей для бэкапа
  const exportKeys = useCallback(() => {
    if (!keyPair) return null;
    
    return {
      publicKey: btoa(String.fromCharCode(...keyPair.publicKey)),
      secretKey: btoa(String.fromCharCode(...keyPair.secretKey)),
    };
  }, [keyPair]);

  // Импорт ключей из бэкапа
  const importKeys = useCallback((publicKeyBase64: string, secretKeyBase64: string) => {
    try {
      const publicKey = new Uint8Array(
        atob(publicKeyBase64).split('').map(c => c.charCodeAt(0))
      );
      const secretKey = new Uint8Array(
        atob(secretKeyBase64).split('').map(c => c.charCodeAt(0))
      );

      setKeyPair({ publicKey, secretKey });
      setIsReady(true);

      if (user) {
        localStorage.setItem(`e2e_keys_${user.id}`, JSON.stringify({
          publicKey: Array.from(publicKey),
          secretKey: Array.from(secretKey),
        }));
      }

      return true;
    } catch (error) {
      console.error('[E2E] Import failed:', error);
      return false;
    }
  }, [user]);

  return {
    isReady,
    publicKey: getPublicKeyBase64(),
    generateKeys,
    setPeerPublicKey,
    encryptMessage,
    decryptMessage,
    exportKeys,
    importKeys,
  };
}

export default useE2EEncryption;
