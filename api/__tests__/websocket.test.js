/**
 * WebSocket Tests
 * Тесты для WebSocket функциональности
 */

const WebSocket = require('ws');
const { server } = require('../src/index');
const jwt = require('jsonwebtoken');
const { db, initDatabase, closeDatabase } = require('../src/config/database');

let testToken = null;
let testUserId = null;
let ws = null;

const WS_URL = 'ws://localhost:3001/ws';

beforeAll(async () => {
  await initDatabase();
  
  // Создадим тестового пользователя
  const userId = require('uuid').v4();
  testUserId = userId;
  const now = Date.now();
  
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, passwordHash, displayName, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    `websocket_test_${Date.now()}@example.com`,
    'hashed_password',
    'WebSocket Test User',
    now,
    now
  );
  
  // Создадим токен
  testToken = jwt.sign(
    { userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    process.env.JWT_SECRET
  );
});

afterAll(async () => {
  if (ws) {
    ws.close();
  }
  
  // Очистить тестового пользователя
  if (testUserId) {
    db.prepare('DELETE FROM users WHERE id = ?').run(testUserId);
  }
  
  closeDatabase();
  server.close();
});

describe('WebSocket Connection', () => {
  test('should connect with valid token', (done) => {
    ws = new WebSocket(`${WS_URL}?token=${testToken}`);
    
    ws.on('open', () => {
      expect(ws.readyState).toBe(WebSocket.OPEN);
      done();
    });
    
    ws.on('error', (error) => {
      done(error);
    });
  });

  test('should reject connection without token', (done) => {
    const wsInvalid = new WebSocket(WS_URL);
    
    wsInvalid.on('close', (code) => {
      expect(code).toBe(4001);
      wsInvalid.terminate();
      done();
    });
    
    wsInvalid.on('open', () => {
      wsInvalid.terminate();
      done(new Error('Should not connect'));
    });
  });

  test('should reject connection with invalid token', (done) => {
    const wsInvalid = new WebSocket(`${WS_URL}?token=invalid_token`);
    
    wsInvalid.on('close', (code) => {
      expect(code).toBe(4002);
      wsInvalid.terminate();
      done();
    });
    
    wsInvalid.on('open', () => {
      wsInvalid.terminate();
      done(new Error('Should not connect'));
    });
  });
});

describe('WebSocket Messages', () => {
  beforeEach((done) => {
    ws = new WebSocket(`${WS_URL}?token=${testToken}`);
    ws.on('open', done);
  });

  afterEach(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });

  test('should receive connected event', (done) => {
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      expect(message.type).toBe('connected');
      expect(message).toHaveProperty('userId');
      expect(message).toHaveProperty('timestamp');
      done();
    });
  });

  test('should handle typing event', (done) => {
    const typingHandler = jest.fn();
    
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === 'typing:start') {
        typingHandler();
        done();
      }
    });
    
    ws.send(JSON.stringify({
      type: 'typing',
      chatId: 'test-chat',
      isTyping: true
    }));
    
    expect(typingHandler).toHaveBeenCalled();
  });

  test('should handle message event', (done) => {
    const messageHandler = jest.fn();
    
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === 'message:new') {
        expect(message).toHaveProperty('chatId');
        expect(message).toHaveProperty('senderId');
        expect(message).toHaveProperty('content');
        messageHandler();
        done();
      }
    });
    
    ws.send(JSON.stringify({
      type: 'message',
      chatId: 'test-chat',
      content: 'Test message',
      type: 'text'
    }));
  });

  test('should handle presence update', (done) => {
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      // Presence update может быть подтверждением
      done();
    });
    
    ws.send(JSON.stringify({
      type: 'presence',
      status: 'online'
    }));
  });
});

describe('WebSocket Call Events', () => {
  beforeEach((done) => {
    ws = new WebSocket(`${WS_URL}?token=${testToken}`);
    ws.on('open', done);
  });

  afterEach(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });

  test('should handle call:start event', (done) => {
    // Отправляем запрос звонка (не будет полноценно обработан т.к. нет получателя)
    ws.send(JSON.stringify({
      type: 'call:start',
      toUserId: 'non-existent-user',
      type: 'video',
      offer: { type: 'offer', sdp: 'test' }
    }));
    
    // Должен быть обработан без ошибок
    setTimeout(done, 500);
  });

  test('should handle call:end event', (done) => {
    ws.send(JSON.stringify({
      type: 'call:end',
      callId: 'test-call-id',
      duration: 60
    }));
    
    setTimeout(done, 500);
  });

  test('should handle call:answer event', (done) => {
    ws.send(JSON.stringify({
      type: 'call:answer',
      callId: 'test-call-id',
      answer: { type: 'answer', sdp: 'test' }
    }));
    
    setTimeout(done, 500);
  });

  test('should handle call:ice-candidate event', (done) => {
    ws.send(JSON.stringify({
      type: 'call:ice-candidate',
      callId: 'test-call-id',
      candidate: { candidate: 'test' }
    }));
    
    setTimeout(done, 500);
  });
});

describe('WebSocket Error Handling', () => {
  beforeEach((done) => {
    ws = new WebSocket(`${WS_URL}?token=${testToken}`);
    ws.on('open', done);
  });

  test('should handle invalid message format', (done) => {
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === 'error') {
        expect(message.error).toBeDefined();
        done();
      }
    });
    
    ws.send('invalid json');
  });

  test('should handle unknown message type', (done) => {
    // Неизвестный тип не должен вызывать ошибку
    ws.send(JSON.stringify({
      type: 'unknown-type',
      data: 'test'
    }));
    
    setTimeout(done, 500);
  });
});
