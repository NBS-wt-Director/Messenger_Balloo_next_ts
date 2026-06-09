
/**
 * React Hook для WebSocket
 * Интеграция WebSocket клиента с React компонентами
 */

import { useEffect, useCallback } from 'react';
import { wsClient, WebSocketMessage, useWebSocket as useWSClient } from '@/lib/websocket';
import { useChatStore } from '@/stores/chat-store';
import { useAuthStore } from '@/stores/auth-store';
import { logger } from '@/lib/logger';

interface UseWebSocketOptions {
  enabled?: boolean;
  chatId?: string;
  onMessageReceived?: (message: any) => void;
  onTypingStatus?: (chatId: string, userId: string, isTyping: boolean) => void;
  onReadReceipt?: (chatId: string, messageId: string, readAt: number) => void;
  onUserStatus?: (userId: string, status: 'online' | 'offline' | 'away', lastSeen: number) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    enabled = true,
    chatId,
    onMessageReceived,
    onTypingStatus,
    onReadReceipt,
    onUserStatus,
  } = options;

  const { user } = useAuthStore();
  const { addMessage, setTypingUser, markMessageAsRead, updateUserStatus } = useChatStore();
  const ws = useWSClient();

  // Обработчик входящих сообщений
  const handleMessage = useCallback((wsMessage: WebSocketMessage) => {
    logger.debug('[WebSocket] Message received:', wsMessage);

    switch (wsMessage.type) {
      case 'chat:message': {
        const message = wsMessage.payload;
        
        // Добавляем сообщение в store
        addMessage(message);
        
        // Вызываем callback если есть
        onMessageReceived?.(message);
        break;
      }

      case 'chat:typing': {
        const { chatId: msgChatId, userId, isTyping } = wsMessage.payload;
        
        // Обновляем статус печати в store
        setTypingUser(msgChatId, userId, isTyping);
        
        // Вызываем callback если есть
        onTypingStatus?.(msgChatId, userId, isTyping);
        break;
      }

      case 'chat:read': {
        const { chatId: msgChatId, messageId, readAt } = wsMessage.payload;
        
        // Отмечаем сообщение как прочитанное
        markMessageAsRead(msgChatId, messageId, readAt);
        
        // Вызываем callback если есть
        onReadReceipt?.(msgChatId, messageId, readAt);
        break;
      }

      case 'user:status': {
        const { userId, status, lastSeen } = wsMessage.payload;
        
        // Обновляем статус пользователя
        updateUserStatus(userId, status, lastSeen);
        
        // Вызываем callback если есть
        onUserStatus?.(userId, status, lastSeen);
        break;
      }

      case 'error': {
        logger.error('[WebSocket] Error:', wsMessage.payload);
        break;
      }
    }
  }, [addMessage, setTypingUser, markMessageAsRead, updateUserStatus, onMessageReceived, onTypingStatus, onReadReceipt, onUserStatus]);

  // Подключение при монтировании
  useEffect(() => {
    if (!enabled || !user) {
      return;
    }

    // Подключаемся к WebSocket
    ws.connect();

    // Подписываемся на сообщения
    ws.onMessage(handleMessage);

    // Отписка при размонтировании
    return () => {
      ws.offMessage(handleMessage);
      // Не отключаемся полностью, так как соединение может использоваться другими компонентами
    };
  }, [enabled, user, handleMessage, ws]);

  // Отправка сообщения
  const sendMessage = useCallback((chatId: string, content: string) => {
    if (!ws.isConnected) {
      logger.warn('[WebSocket] Not connected, cannot send message');
      return false;
    }

    ws.sendMessage(chatId, content);
    return true;
  }, [ws]);

  // Отправка статуса "печатает..."
  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (!ws.isConnected) return;
    ws.sendTyping(chatId, isTyping);
  }, [ws]);

  // Отправка подтверждения прочтения
  const sendReadReceipt = useCallback((chatId: string, messageId: string) => {
    if (!ws.isConnected) return;
    ws.sendReadReceipt(chatId, messageId);
  }, [ws]);

  return {
    isConnected: ws.isConnected,
    sendMessage,
    sendTyping,
    sendReadReceipt,
  };
}

export default useWebSocket;
