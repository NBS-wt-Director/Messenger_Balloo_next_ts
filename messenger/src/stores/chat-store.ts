import { create } from 'zustand';
import { Chat, Message, User } from '@/types';

interface ChatState {
  // Текущий чат
  activeChatId: string | null;
  
  // Списки
  chats: Chat[];
  messages: Record<string, Message[]>; // chatId -> messages
  users: Record<string, User>; // userId -> user
  
  // Статусы
  isLoading: boolean;
  isSending: boolean;
  
  // Действия
  setActiveChat: (chatId: string | null) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  
  setLoading: (loading: boolean) => void;
  setSending: (sending: boolean) => void;
  
  // Getters
  getChat: (chatId: string) => Chat | undefined;
  getMessages: (chatId: string) => Message[];
  getUser: (userId: string) => User | undefined;
  getOtherParticipant: (chat: Chat, currentUserId: string) => User | undefined;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeChatId: null,
  chats: [],
  messages: {},
  users: {},
  isLoading: false,
  isSending: false,

  setActiveChat: (chatId) => set({ activeChatId: chatId }),

  setChats: (chats) => set({ chats }),

  addChat: (chat) => set((state) => ({
    chats: [...state.chats, chat],
  })),

  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map((chat) =>
      chat.id === chatId ? { ...chat, ...updates } : chat
    ),
  })),

  setMessages: (chatId, messages) => set((state) => ({
    messages: { ...state.messages, [chatId]: messages },
  })),

  addMessage: (chatId, message) => set((state) => {
    const chatMessages = state.messages[chatId] || [];
    return {
      messages: {
        ...state.messages,
        [chatId]: [...chatMessages, message],
      },
    };
  }),

  updateMessage: (chatId, messageId, updates) => set((state) => {
    const chatMessages = state.messages[chatId] || [];
    return {
      messages: {
        ...state.messages,
        [chatId]: chatMessages.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
      },
    };
  }),

  setUsers: (users) => set((state) => {
    const usersMap: Record<string, User> = { ...state.users };
    users.forEach((user) => {
      usersMap[user.id] = user;
    });
    return { users: usersMap };
  }),

  addUser: (user) => set((state) => ({
    users: { ...state.users, [user.id]: user },
  })),

  setLoading: (isLoading) => set({ isLoading }),
  setSending: (isSending) => set({ isSending }),

  getChat: (chatId) => get().chats.find((c) => c.id === chatId),

  getMessages: (chatId) => get().messages[chatId] || [],

  getUser: (userId) => get().users[userId],

  getOtherParticipant: (chat, currentUserId) => {
    const otherId = chat.participants.find((id) => id !== currentUserId);
    return otherId ? get().users[otherId] : undefined;
  },
}));
