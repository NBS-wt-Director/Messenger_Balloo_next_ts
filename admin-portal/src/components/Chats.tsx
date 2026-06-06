'use client';

import { useState, useEffect } from 'react';
import { chatsApi } from '@/lib/api-client';
import { MessageCircle, Search, Trash2, Users, Eye, Shield } from 'lucide-react';

interface Chat {
  id: string;
  name?: string;
  type: string;
  participants: string[];
  createdAt: number;
  lastMessageAt?: number;
  messageCount?: number;
  createdBy?: string;
}

export function ChatsSection() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    loadChats();
  }, [filterType]);

  const loadChats = async () => {
    try {
      const response = await chatsApi.list({ limit: 1000 });
      setChats(response.data.chats || []);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string, chatName: string) => {
    if (!confirm(`Удалить чат "${chatName}"?`)) return;
    
    try {
      await chatsApi.delete(chatId);
      loadChats();
    } catch (error: any) {
      console.error('Error deleting chat:', error);
      alert(error.response?.data?.error?.message || 'Ошибка при удалении чата');
    }
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name?.toLowerCase().includes(search.toLowerCase()) || false;
    const matchesType = filterType === 'all' || chat.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'private': return 'Личный';
      case 'group': return 'Группа';
      case 'internal_group': return 'Корпоративная';
      default: return type;
    }
  };

  if (loading) {
    return <div className="admin-card">Загрузка...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Чаты</h2>

      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="admin-input pl-10"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select 
            className="admin-input w-48"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Все типы</option>
            <option value="private">Личные</option>
            <option value="group">Группы</option>
            <option value="internal_group">Корпоративные</option>
          </select>
        </div>
      </div>

      {/* Chats Table */}
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Участники</th>
                <th>Создан</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredChats.map(chat => (
                <tr key={chat.id} className="hover:bg-slate-700/50">
                  <td>
                    <div className="flex items-center gap-3">
                      {chat.type === 'internal_group' ? (
                        <Shield size={20} className="text-yellow-500" />
                      ) : (
                        <MessageCircle size={20} className="text-blue-500" />
                      )}
                      <div>
                        <div className="font-semibold">{chat.name || 'Без названия'}</div>
                        <div className="text-sm text-slate-400">ID: {chat.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge capitalize">
                      {chat.type === 'internal_group' && (
                        <Shield size={12} className="mr-1" />
                      )}
                      {getTypeLabel(chat.type)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-400" />
                      {chat.participants?.length || 0}
                    </div>
                  </td>
                  <td>{new Date(chat.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <div className="flex gap-2">
                      {chat.type !== 'internal_group' && (
                        <button 
                          onClick={() => handleDeleteChat(chat.id, chat.name || 'Без названия')}
                          className="p-2 text-red-400 hover:text-red-300"
                          title="Удалить чат"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      {chat.type === 'internal_group' && (
                        <span className="text-xs text-yellow-500" title="Корпоративная группа">
                          неудаляемо
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
