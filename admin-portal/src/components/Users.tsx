'use client';

import { useState, useEffect } from 'react';
import { usersApi } from '@/lib/api-client';
import { Users, Search, Shield, Ban, Key, Smartphone, Eye, Trash2, Edit2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  displayName: string;
  fullName?: string;
  avatar?: string;
  status?: string;
  lastSeen?: number;
  createdAt: number;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  adminRoles: string[];
  adminSince?: number;
  isBlocked?: boolean;
}

export function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAdmin, setFilterAdmin] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoles, setNewRoles] = useState({ isAdmin: false, isSuperAdmin: false, adminRoles: [] as string[] });

  useEffect(() => {
    loadUsers();
  }, [filterAdmin]);

  const loadUsers = async () => {
    try {
      const response = await usersApi.list({ limit: 1000, isAdmin: filterAdmin === 'admin' ? true : undefined });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    try {
      await usersApi.updateRole(selectedUser.id, newRoles);
      setShowRoleModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleBlockUser = async (userId: string) => {
    if (!confirm('Заблокировать пользователя?')) return;
    
    try {
      await usersApi.block(userId);
      loadUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRoles({
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      adminRoles: user.adminRoles || []
    });
    setShowRoleModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(search.toLowerCase()) ||
                         user.displayName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div className="admin-card">Загрузка...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Пользователи</h2>

      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="admin-input pl-10"
              placeholder="Поиск по email или имени..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select 
            className="admin-input w-48"
            value={filterAdmin}
            onChange={(e) => setFilterAdmin(e.target.value)}
          >
            <option value="all">Все пользователи</option>
            <option value="admin">Только админы</option>
            <option value="regular">Обычные пользователи</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Статус</th>
                <th>Права</th>
                <th>Создан</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-700/50">
                  <td>
                    <div className="flex items-center gap-3">
                      {user.avatar && (
                        <img src={user.avatar} alt={user.displayName} className="w-10 h-10 rounded-full" />
                      )}
                      <div>
                        <div className="font-semibold">{user.displayName}</div>
                        {user.fullName && <div className="text-sm text-slate-400">{user.fullName}</div>}
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.isBlocked ? (
                      <span className="badge" style={{ background: '#ef4444' }}>Заблокирован</span>
                    ) : (
                      <span className="badge" style={{ background: '#22c55e' }}>Активен</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {user.isSuperAdmin && (
                        <span className="badge badge-superadmin flex items-center gap-1">
                          <Shield size={12} /> SuperAdmin
                        </span>
                      )}
                      {user.isAdmin && !user.isSuperAdmin && (
                        <span className="badge badge-admin">Admin</span>
                      )}
                      {user.adminRoles?.map(role => (
                        <span key={role} className="badge badge-support capitalize">{role}</span>
                      ))}
                    </div>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openRoleModal(user)}
                        className="p-2 text-blue-400 hover:text-blue-300"
                        title="Изменить права"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleBlockUser(user.id)}
                        className={`p-2 ${user.isBlocked ? 'text-green-400' : 'text-red-400'} hover:opacity-80`}
                        title={user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                      >
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="admin-card w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Изменить права: {selectedUser.displayName}</h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                <input
                  type="checkbox"
                  checked={newRoles.isAdmin}
                  onChange={(e) => setNewRoles({ ...newRoles, isAdmin: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <Shield size={16} /> Admin
                  </div>
                  <p className="text-sm text-slate-400">Базовые права администратора</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                <input
                  type="checkbox"
                  checked={newRoles.isSuperAdmin}
                  onChange={(e) => setNewRoles({ ...newRoles, isSuperAdmin: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-semibold flex items-center gap-2 text-yellow-400">
                    <Shield size={16} /> SuperAdmin
                  </div>
                  <p className="text-sm text-slate-400">Полный доступ ко всем функциям</p>
                </div>
              </label>

              <div>
                <p className="text-sm mb-2">Роли администратора:</p>
                <div className="space-y-2">
                  {['support', 'moderator', 'manager'].map(role => (
                    <label key={role} className="flex items-center gap-3 p-2 bg-slate-700 rounded">
                      <input
                        type="checkbox"
                        checked={newRoles.adminRoles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRoles({ ...newRoles, adminRoles: [...newRoles.adminRoles, role] });
                          } else {
                            setNewRoles({ ...newRoles, adminRoles: newRoles.adminRoles.filter(r => r !== role) });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button onClick={handleUpdateRole} className="btn-primary flex-1">Сохранить</button>
                <button onClick={() => setShowRoleModal(false)} className="btn-secondary flex-1">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
