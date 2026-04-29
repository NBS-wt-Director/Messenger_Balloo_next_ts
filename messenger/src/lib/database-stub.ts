/**
 * Stub Database - временная заглушка для баз данных
 * Чтобы API работали без реальной базы данных
 */

// Временное хранилище в памяти
const memoryStore = {
  messages: new Map<string, any>(),
  chats: new Map<string, any>(),
  users: new Map<string, any>(),
};

// Инициализация тестовых данных
if (memoryStore.chats.size === 0) {
  memoryStore.chats.set('chat1', {
    id: 'chat1',
    type: 'private',
    members: { user1: { role: 'admin', joinedAt: Date.now() }, user2: { role: 'user', joinedAt: Date.now() } },
    unreadCount: {},
    lastMessage: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

class MockCollection {
  private store: Map<string, any>;
  private name: string;

  constructor(store: Map<string, any>, name: string) {
    this.store = store;
    this.name = name;
  }

  async insert(data: any) {
    const id = data.id || `${this.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const doc = { ...data, id };
    this.store.set(id, doc);
    return { toJSON: () => doc };
  }

  async findOne(selector: any) {
    const id = selector.id || selector.chatId || selector.senderId;
    if (!id) return { exec: async () => null };
    
    const doc = Array.from(this.store.values()).find(
      (d: any) => Object.entries(selector).every(([k, v]: [string, any]) => d[k] === v)
    );
    
    if (!doc) return { exec: async () => null };
    
    return {
      exec: async () => doc,
      patch: async (data: any) => {
        Object.assign(doc, data);
        return true;
      },
      remove: async () => {
        this.store.delete(doc.id);
        return true;
      }
    };
  }

  async find(selector: any) {
    const docs = Array.from(this.store.values()).filter(
      (d: any) => !selector.selector || Object.entries(selector.selector).every(([k, v]: [string, any]) => d[k] === v)
    );
    
    return {
      limit: (n: number) => ({
        exec: async () => docs.slice(0, n).map((d: any) => ({ toJSON: () => d }))
      })
    };
  }
}

export async function getMessagesCollection() {
  return new MockCollection(memoryStore.messages, 'messages');
}

export async function getChatsCollection() {
  return new MockCollection(memoryStore.chats, 'chats');
}

export async function getUsersCollection() {
  return new MockCollection(memoryStore.users, 'users');
}

export async function getInvitationsCollection() {
  return new MockCollection(new Map(), 'invitations');
}

export async function getAttachmentsCollection() {
  return new MockCollection(new Map(), 'attachments');
}

export async function getContactsCollection() {
  return new MockCollection(new Map(), 'contacts');
}

export async function getNotificationsCollection() {
  return new MockCollection(new Map(), 'notifications');
}

export async function getReportsCollection() {
  return new MockCollection(new Map(), 'reports');
}

export async function getPagesCollection() {
  return new MockCollection(new Map(), 'pages');
}

export async function getFeaturesCollection() {
  return new MockCollection(new Map(), 'features');
}

export async function clearDatabase() {
  memoryStore.messages.clear();
  memoryStore.chats.clear();
  memoryStore.users.clear();
}

export async function isDatabaseConnected() {
  return true;
}
