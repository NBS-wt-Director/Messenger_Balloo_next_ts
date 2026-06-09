/**
 * WebSocket Client
 * Real-time communication with App Balloo API
 */

import { useAuthStore } from '@/stores/auth-store';
import { useChatStore } from '@/stores/chat-store';
import { logger } from './logger';

export interface WebSocketMessage {
  type: 'chat:message' | 'chat:typing' | 'chat:read' | 'user:status' | 'error';
  payload: any;
  timestamp: number;
}

interface MessagePayload {
  id: string;
  chatId: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'audio';
  content: string;
  encryptedInfo?: string;
  createdAt: number;
  readBy: string[];
  status: 'sent' | 'delivered' | 'read';
  reactions: any;
  reactionsCount: any;
}

interface TypingPayload {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

interface ReadPayload {
  chatId: string;
  messageId: string;
  readAt: number;
}

interface StatusPayload {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: number;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Set<(msg: WebSocketMessage) => void> = new Set();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = process.env.NEXT_PUBLIC_WS_HOST || window.location.hostname;
    const wsPort = process.env.NEXT_PUBLIC_WS_PORT || '3001';
    
    this.url = `${wsProtocol}//${wsHost}:${wsPort}/ws`;
    logger.info('WebSocket URL:', this.url);
  }

  /**
   * Подключение к WebSocket серверу
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      logger.info('WebSocket already connected');
      return;
    }

    const token = useAuthStore.getState().user?.accessToken;
    
    if (!token) {
      logger.warn('No auth token, cannot connect WebSocket');
      return;
    }

    logger.info('Connecting to WebSocket...');
    
    try {
      this.ws = new WebSocket(`${this.url}?token=${token}`);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      logger.error('WebSocket connection error:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Отключение от WebSocket сервера
   */
  disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    logger.info('WebSocket disconnected');
  }

  /**
   * Отправка сообщения в чат
   */
  sendChatMessage(chatId: string, content: string, type: string = 'text'): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      logger.error('WebSocket not connected');
      return;
    }

    const message = {
      type: 'chat:message',
      payload: {
        chatId,
        content,
        type,
      },
    };

    try {
      this.ws.send(JSON.stringify(message));
      logger.debug('Message sent:', message);
    } catch (error) {
      logger.error('Failed to send message:', error);
    }
  }

  /**
   * Отправка статуса "печатает..."
   */
  sendTypingStatus(chatId: string, isTyping: boolean): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = {
      type: 'chat:typing',
      payload: {
        chatId,
        isTyping,
      },
    };

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      logger.error('Failed to send typing status:', error);
    }
  }

  /**
   * Отправка подтверждения прочтения
   */
  sendReadReceipt(chatId: string, messageId: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = {
      type: 'chat:read',
      payload: {
        chatId,
        messageId,
        readAt: Date.now(),
      },
    };

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      logger.error('Failed to send read receipt:', error);
    }
  }

  /**
   * Подписка на сообщения
   */
  onMessage(handler: (msg: WebSocketMessage) => void): void {
    this.messageHandlers.add(handler);
  }

  /**
   * Отписка от сообщений
   */
  offMessage(handler: (msg: WebSocketMessage) => void): void {
    this.messageHandlers.delete(handler);
  }

  /**
   * Обработчик открытия соединения
   */
  private handleOpen(): void {
    logger.info('WebSocket connected');
    this.reconnectAttempts = 0;
    
    // Запуск heartbeat
    this.startHeartbeat();
  }

  /**
   * Обработчик получения сообщения
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      logger.debug('Received message:', message);
      
      // Обработка по типам
      switch (message.type) {
        case 'chat:message':
          this.handleNewMessage(message.payload);
          break;
        case 'chat:typing':
          this.handleTypingStatus(message.payload);
          break;
        case 'chat:read':
          this.handleReadReceipt(message.payload);
          break;
        case 'user:status':
          this.handleUserStatus(message.payload);
          break;
        case 'error':
          this.handleError(message.payload);
          break;
        default:
          logger.warn('Unknown message type:', message.type);
      }
      
      // Вызов всех обработчиков
      this.messageHandlers.forEach(handler => handler(message));
    } catch (error) {
      logger.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Обработчик закрытия соединения
   */
  private handleClose(event: CloseEvent): void {
    logger.info('WebSocket closed:', event.code, event.reason);
    this.heartbeatInterval && clearInterval(this.heartbeatInterval);
    
    // Автоматическая переподключение
    if (event.code !== 1000) { // Not normal closure
      this.scheduleReconnect();
    }
  }

  /**
   * Обработчик ошибки
   */
  private handleError(error: Event | any): void {
    logger.error('WebSocket error:', error);
  }

  /**
   * Обработка нового сообщения
   */
  private handleNewMessage(payload: MessagePayload): void {
    const { addMessage } = useChatStore.getState();
    addMessage(payload);
    logger.debug('New message added:', payload.id);
  }

  /**
   * Обработка статуса "печатает..."
   */
  private handleTypingStatus(payload: TypingPayload): void {
    const { setTypingUser } = useChatStore.getState();
    setTypingUser(payload.chatId, payload.userId, payload.isTyping);
  }

  /**
   * Обработка подтверждения прочтения
   */
  private handleReadReceipt(payload: ReadPayload): void {
    const { markMessageAsRead } = useChatStore.getState();
    markMessageAsRead(payload.chatId, payload.messageId, payload.readAt);
  }

  /**
   * Обработка статуса пользователя
   */
  private handleUserStatus(payload: StatusPayload): void {
    const { updateUserStatus } = useChatStore.getState();
    updateUserStatus(payload.userId, payload.status, payload.lastSeen);
  }

  /**
   * Планирование переподключения
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    logger.info(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Запуск heartbeat
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Каждые 30 секунд
  }

  /**
   * Проверка подключения
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const wsClient = new WebSocketClient();

// React hook для использования WebSocket
export function useWebSocket() {
  const { isConnected } = wsClient;
  
  return {
    connect: () => wsClient.connect(),
    disconnect: () => wsClient.disconnect(),
    sendMessage: (chatId: string, content: string) => wsClient.sendChatMessage(chatId, content),
    sendTyping: (chatId: string, isTyping: boolean) => wsClient.sendTypingStatus(chatId, isTyping),
    sendReadReceipt: (chatId: string, messageId: string) => wsClient.sendReadReceipt(chatId, messageId),
    onMessage: (handler: (msg: WebSocketMessage) => void) => wsClient.onMessage(handler),
    offMessage: (handler: (msg: WebSocketMessage) => void) => wsClient.offMessage(handler),
    isConnected: isConnected(),
  };
}
