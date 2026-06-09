import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chat, Message, User } from '@/types';

interface ChatState {
  // Текущий чат
  activeChatId: string | null;
  
  // Списки
  chats: Chat[];
  messages: Record<string, Message[]>; // chatId -> messages
  users: Record<string, User>; // userId -> user
  
  // Real-time
  typingUsers: Record<string, string[]>; // chatId -> [userIds]
  onlineUsers: Set<string>;
  unreadCounts: Record<string, number>; // chatId -> count
  
  // Статусы
  isLoading: boolean;
  isSending: boolean;
  
  // Действия
  setActiveChat: (chatId: string | null) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  removeChat: (chatId: string) => void;
  
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  markMessageAsRead: (chatId: string, messageId: string, readAt: number) => void;
  
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  
  // Real-time actions
  setTypingUser: (chatId: string, userId: string, isTyping: boolean) => void;
  updateUserStatus: (userId: string, status: 'online' | 'offline' | 'away', lastSeen: number) => void;
  incrementUnread: (chatId: string) => void;
  clearUnread: (chatId: string) => void;
  
  setLoading: (loading: boolean) => void;
  setSending: (sending: boolean) => void;
  
  // Getters
  getChat: (chatId: string) => Chat | undefined;
  getMessages: (chatId: string) => Message[];
  getUser: (userId: string) => User | undefined;
  getTypingUsers: (chatId: string) => string[];
  getUnreadCount: (chatId: string) => number;
  getTotalUnreadCount: () => number;
  getOtherParticipant: (chat: Chat, currentUserId: string) => User | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      activeChatId: null,
      chats: [],
      messages: {},
      users: {},
      typingUsers: {},
      onlineUsers: new Set(),
      unreadCounts: {},
      isLoading: false,
      isSending: false,

      setActiveChat: (chatId) => {
        // Clear unread when activating chat
        if (chatId) {
          set((state) => ({
            unreadCounts: {
              ...state.unreadCounts,
              [chatId]: 0,
            },
          }));
        }
        set({ activeChatId: chatId });
      },

      setChats: (chats) => set({ chats }),

      addChat: (chat) => set((state) => ({
        chats: [...state.chats, chat],
        messages: {
          ...state.messages,
          [chat.id]: state.messages[chat.id] || [],
        },
      })),

      updateChat: (chatId, updates) => set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, ...updates } : chat
        ),
      })),
      
      removeChat: (chatId) => set((state) => ({
        chats: state.chats.filter((chat) => chat.id !== chatId),
        messages: Object.fromEntries(
          Object.entries(state.messages).filter(([id]) => id !== chatId)
        ),
        unreadCounts: Object.fromEntries(
          Object.entries(state.unreadCounts).filter(([id]) => id !== chatId)
        ),
      })),

      setMessages: (chatId, messages) => set((state) => ({
        messages: { ...state.messages, [chatId]: messages },
      })),

      addMessage: (message) => set((state) => {
        const chatId = message.chatId;
        const chatMessages = state.messages[chatId] || [];
        const isNewMessage = !chatMessages.find((m) => m.id === message.id);
        
        return {
          messages: {
            ...state.messages,
            [chatId]: [...chatMessages, message],
          },
          // Increment unread if chat is not active
          unreadCounts:
            state.activeChatId !== chatId && isNewMessage
              ? {
                  ...state.unreadCounts,
                  [chatId]: (state.unreadCounts[chatId] || 0) + 1,
                }
              : state.unreadCounts,
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
      
      markMessageAsRead: (chatId, messageId, readAt) => set((state) => {
        const chatMessages = state.messages[chatId] || [];
        return {
          messages: {
            ...state.messages,
            [chatId]: chatMessages.map((msg) =>
              msg.id === messageId 
                ? { ...msg, readBy: [...(msg.readBy || []), String(readAt)] } 
                : msg
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
      
      // Real-time actions
      setTypingUser: (chatId, userId, isTyping) =>
        set((state) => {
          const currentTyping = state.typingUsers[chatId] || [];
          
          return {
            typingUsers: {
              ...state.typingUsers,
              [chatId]: isTyping
                ? [...currentTyping.filter((id) => id !== userId), userId]
                : currentTyping.filter((id) => id !== userId),
            },
          };
        }),
      
      updateUserStatus: (userId, status, lastSeen) =>
        set((state) => {
          if (status === 'online') {
            const newOnlineUsers = new Set(state.onlineUsers);
            newOnlineUsers.add(userId);
            return { onlineUsers: newOnlineUsers };
          } else {
            const newOnlineUsers = new Set(state.onlineUsers);
            newOnlineUsers.delete(userId);
            return { onlineUsers: newOnlineUsers };
          }
        }),
      
      incrementUnread: (chatId) =>
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [chatId]: (state.unreadCounts[chatId] || 0) + 1,
          },
        })),
      
      clearUnread: (chatId) =>
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [chatId]: 0,
          },
        })),

      setLoading: (isLoading) => set({ isLoading }),
      setSending: (isSending) => set({ isSending }),

      getChat: (chatId) => get().chats.find((c) => c.id === chatId),

      getMessages: (chatId) => get().messages[chatId] || [],

      getUser: (userId) => get().users[userId],
      
      getTypingUsers: (chatId) => get().typingUsers[chatId] || [],
      
      getUnreadCount: (chatId) => get().unreadCounts[chatId] || 0,
      
      getTotalUnreadCount: () => {
        const unreadCounts = get().unreadCounts;
        return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
      },

      getOtherParticipant: (chat, currentUserId) => {
        const otherId = chat.participants.find((id) => id !== currentUserId);
        return otherId ? get().users[otherId] : undefined;
      },
    }),
    {
      name: 'messenger-chat',
      partialize: (state) => ({
        chats: state.chats,
        messages: state.messages,
        users: state.users,
        unreadCounts: state.unreadCounts,
      }),
    }
  )
);
