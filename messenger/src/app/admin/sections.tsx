'use client';

import { useState, useEffect } from 'react';
import { useAlert } from '@/hooks/useAlert';

// Секция пользователей
export function AdminUsersSection() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin] Error loading users:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-section">
      <h2>Пользователи</h2>
      <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-search-input"
      />
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.displayName}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Админ' : 'Пользователь'}</td>
                <td>{user.status || 'offline'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Секция чатов
export function AdminChatsSection() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const response = await fetch('/api/admin/chats');
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || []);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin] Error loading chats:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>Чаты</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Участников</th>
              <th>Последнее сообщение</th>
            </tr>
          </thead>
          <tbody>
            {chats.map(chat => (
              <tr key={chat.id}>
                <td>{chat.name || 'Личный'}</td>
                <td>{chat.type}</td>
                <td>{Object.keys(chat.members || {}).length}</td>
                <td>{chat.lastMessage?.content?.substring(0, 30) || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Секция сообщений
export function AdminMessagesSection() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages?limit=50');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin] Error loading messages:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>Сообщения</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>От</th>
              <th>Содержание</th>
              <th>Тип</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg.id}>
                <td>{msg.senderId}</td>
                <td>{msg.content?.substring(0, 50) || '-'}</td>
                <td>{msg.type}</td>
                <td>{new Date(msg.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Секция банов
export function AdminBansSection() {
  const [bans, setBans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [banUserId, setBanUserId] = useState('');
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    loadBans();
  }, []);

  const loadBans = async () => {
    try {
      const response = await fetch('/api/admin/bans');
      if (response.ok) {
        const data = await response.json();
        setBans(data.bans || []);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin] Error loading bans:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    if (!banUserId) return;
    
    try {
      const response = await fetch('/api/admin/bans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: banUserId,
          reason: banReason || 'Нарушение правил'
        })
      });

      if (response.ok) {
        setBanUserId('');
        setBanReason('');
        loadBans();
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin] Error banning user:', error);
      }
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/bans', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        loadBans();
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin] Error unbanning user:', error);
      }
    }
  };

  return (
    <div className="admin-section">
      <h2>Блокировки</h2>
      
      <div className="admin-ban-form">
        <input
          type="text"
          placeholder="User ID"
          value={banUserId}
          onChange={(e) => setBanUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Причина"
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
        />
        <button onClick={handleBan} className="btn-primary">Заблокировать</button>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Причина</th>
              <th>Дата</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {bans.map(ban => (
              <tr key={ban.userId}>
                <td>{ban.userId}</td>
                <td>{ban.reason}</td>
                <td>{new Date(ban.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleUnban(ban.userId)} className="btn-secondary">
                    Разблокировать
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Секция настроек
export function AdminSettingsSection() {
  const [settings, setSettings] = useState<any>({
    registrationEnabled: true,
    maxFileSize: 10485760,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { alert, AlertComponent } = useAlert();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || {});
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin] Error loading settings:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });

      if (response.ok) {
        alert('Настройки сохранены', 'success');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin] Error saving settings:', error);
      }
      alert('Ошибка сохранения', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>Настройки системы</h2>
      
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="admin-settings-form">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.registrationEnabled}
                onChange={(e) => setSettings({...settings, registrationEnabled: e.target.checked})}
              />
              Регистрация включена
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
              />
              Режим обслуживания
            </label>
          </div>

          <div className="form-group">
            <label>
              Максимальный размер файла (байт):
              <input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
              />
            </label>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      )}

      {AlertComponent}
    </div>
  );
}
