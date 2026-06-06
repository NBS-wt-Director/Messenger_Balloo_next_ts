'use client';

import { useState, useEffect } from 'react';
import { internalChatApi, usersApi } from '@/lib/api-client';
import { Users, Plus, Trash2, MessageSquare } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description?: string;
  participants: string[];
  adminIds: string[];
  createdBy: string;
  createdAt: number;
}

interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
}

export function InternalChatSection() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    memberIds: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [groupsRes, usersRes] = await Promise.all([
        internalChatApi.getGroups(),
        usersApi.list({ limit: 1000 })
      ]);
      setGroups(groupsRes.data.groups || []);
      setUsers(usersRes.data.users || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await internalChatApi.createGroup(newGroup);
      setShowCreateModal(false);
      setNewGroup({ name: '', description: '', memberIds: [] });
      loadData();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleAddMember = async (groupId: string, userId: string) => {
    try {
      await internalChatApi.addMembers(groupId, [userId]);
      loadData();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (groupId: string, userId: string) => {
    try {
      await internalChatApi.removeMember(groupId, userId);
      loadData();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  if (loading) {
    return <div className="admin-card">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Корпоративный чат NBS w-t</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Создать группу
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Groups List */}
        <div className="admin-card">
          <h3 className="text-lg font-semibold mb-4">Группы</h3>
          {groups.length === 0 ? (
            <p className="text-slate-400">Групп пока нет</p>
          ) : (
            <div className="space-y-3">
              {groups.map(group => (
                <div 
                  key={group.id}
                  className="p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600"
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{group.name}</h4>
                      {group.description && (
                        <p className="text-sm text-slate-400">{group.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Users size={16} />
                      {group.participants.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Group Details */}
        <div className="admin-card">
          <h3 className="text-lg font-semibold mb-4">
            {selectedGroup ? selectedGroup.name : 'Выберите группу'}
          </h3>
          
          {selectedGroup ? (
            <div>
              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-2">Участники ({selectedGroup.participants.length})</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {users
                    .filter(u => selectedGroup.participants.includes(u.id))
                    .map(user => (
                      <div key={user.id} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                        <div className="flex items-center gap-2">
                          {user.avatar && (
                            <img src={user.avatar} alt={user.displayName} className="w-8 h-8 rounded-full" />
                          )}
                          <span>{user.displayName}</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveMember(selectedGroup.id, user.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-2">Добавить участника</p>
                <select 
                  className="admin-input mb-2"
                  onChange={(e) => e.target.value && handleAddMember(selectedGroup.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="">Выберите пользователя</option>
                  {users
                    .filter(u => !selectedGroup.participants.includes(u.id))
                    .map(user => (
                      <option key={user.id} value={user.id}>{user.displayName}</option>
                    ))}
                </select>
              </div>

              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded">
                <p className="text-sm text-blue-300 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Группы корпоративного чата неудаляемы и доступны только из админки
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Выберите группу для просмотра деталей</p>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="admin-card w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Создать группу</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Название *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Описание</label>
                <textarea
                  className="admin-input"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Участники *</label>
                <select
                  multiple
                  className="admin-input h-32"
                  value={newGroup.memberIds}
                  onChange={(e) => setNewGroup({
                    ...newGroup,
                    memberIds: Array.from(e.target.selectedOptions, o => o.value)
                  })}
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.displayName}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">Зажмите Ctrl для выбора нескольких</p>
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  onClick={handleCreateGroup}
                  disabled={!newGroup.name || newGroup.memberIds.length === 0}
                  className="btn-primary flex-1"
                >
                  Создать
                </button>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
