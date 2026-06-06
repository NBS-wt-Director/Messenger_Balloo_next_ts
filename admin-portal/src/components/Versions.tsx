'use client';

import { useState, useEffect } from 'react';
import { versionsApi } from '@/lib/api-client';
import { Tag, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface Version {
  id: string;
  platform: string;
  version: string;
  minVersion?: string;
  updateUrl?: string;
  releaseNotes?: string;
  isForceUpdate?: boolean;
  createdAt: number;
  updatedAt: number;
}

export function VersionsSection() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);

  const [newVersion, setNewVersion] = useState({
    platform: 'android',
    version: '',
    minVersion: '',
    updateUrl: '',
    releaseNotes: '',
    isForceUpdate: false
  });

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      const response = await versionsApi.list();
      setVersions(response.data.versions || []);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVersion = async () => {
    try {
      await versionsApi.create(newVersion);
      setShowCreateModal(false);
      setNewVersion({
        platform: 'android',
        version: '',
        minVersion: '',
        updateUrl: '',
        releaseNotes: '',
        isForceUpdate: false
      });
      loadVersions();
    } catch (error) {
      console.error('Error creating version:', error);
    }
  };

  const handleUpdateVersion = async () => {
    if (!editingVersion) return;
    
    try {
      await versionsApi.update(editingVersion.id, newVersion);
      setEditingVersion(null);
      setNewVersion({
        platform: 'android',
        version: '',
        minVersion: '',
        updateUrl: '',
        releaseNotes: '',
        isForceUpdate: false
      });
      loadVersions();
    } catch (error) {
      console.error('Error updating version:', error);
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    if (!confirm('Удалить версию?')) return;
    
    try {
      await versionsApi.delete(versionId);
      loadVersions();
    } catch (error) {
      console.error('Error deleting version:', error);
    }
  };

  const openEditModal = (version: Version) => {
    setEditingVersion(version);
    setNewVersion({
      platform: version.platform,
      version: version.version,
      minVersion: version.minVersion || '',
      updateUrl: version.updateUrl || '',
      releaseNotes: version.releaseNotes || '',
      isForceUpdate: version.isForceUpdate || false
    });
  };

  const getPlatformBadge = (platform: string) => {
    const colors: Record<string, string> = {
      android: '#22c55e',
      ios: '#3b82f6',
      web: '#f59e0b',
      desktop: '#8b5cf6'
    };
    return (
      <span className="badge" style={{ background: colors[platform] || '#64748b' }}>
        {platform.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return <div className="admin-card">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Версии приложений</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Добавить версию
        </button>
      </div>

      {/* Versions Table */}
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Платформа</th>
                <th>Версия</th>
                <th>Мин. версия</th>
                <th>Force Update</th>
                <th>Создана</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {versions.map(version => (
                <tr key={version.id} className="hover:bg-slate-700/50">
                  <td>{getPlatformBadge(version.platform)}</td>
                  <td className="font-semibold">{version.version}</td>
                  <td>{version.minVersion || '-'}</td>
                  <td>
                    {version.isForceUpdate ? (
                      <span className="badge" style={{ background: '#ef4444' }}>
                        <AlertCircle size={12} className="mr-1" />
                        Обязательное
                      </span>
                    ) : (
                      <span className="badge" style={{ background: '#22c55e' }}>Опциональное</span>
                    )}
                  </td>
                  <td>{new Date(version.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(version)}
                        className="p-2 text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteVersion(version.id)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="admin-card w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Добавить версию</h3>
            <VersionForm 
              version={newVersion}
              setVersion={setNewVersion}
              onSubmit={handleCreateVersion}
              onCancel={() => setShowCreateModal(false)}
              editingVersion={null}
            />
          </div>
        </div>
      )}

      {editingVersion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="admin-card w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Редактировать версию</h3>
            <VersionForm 
              version={newVersion}
              setVersion={setNewVersion}
              onSubmit={handleUpdateVersion}
              onCancel={() => {
                setEditingVersion(null);
                setNewVersion({
                  platform: 'android',
                  version: '',
                  minVersion: '',
                  updateUrl: '',
                  releaseNotes: '',
                  isForceUpdate: false
                });
              }}
              editingVersion={editingVersion}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function VersionForm({ version, setVersion, onSubmit, onCancel, editingVersion }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Платформа *</label>
        <select
          className="admin-input"
          value={version.platform}
          onChange={(e) => setVersion({ ...version, platform: e.target.value })}
        >
          <option value="android">Android</option>
          <option value="ios">iOS</option>
          <option value="web">Web</option>
          <option value="desktop">Desktop</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Версия *</label>
        <input
          type="text"
          className="admin-input"
          value={version.version}
          onChange={(e) => setVersion({ ...version, version: e.target.value })}
          placeholder="1.0.0"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Минимальная версия</label>
        <input
          type="text"
          className="admin-input"
          value={version.minVersion}
          onChange={(e) => setVersion({ ...version, minVersion: e.target.value })}
          placeholder="0.9.0"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">URL обновления</label>
        <input
          type="text"
          className="admin-input"
          value={version.updateUrl}
          onChange={(e) => setVersion({ ...version, updateUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Release Notes</label>
        <textarea
          className="admin-input"
          rows={3}
          value={version.releaseNotes}
          onChange={(e) => setVersion({ ...version, releaseNotes: e.target.value })}
          placeholder="Что нового..."
        />
      </div>

      <label className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
        <input
          type="checkbox"
          checked={version.isForceUpdate}
          onChange={(e) => setVersion({ ...version, isForceUpdate: e.target.checked })}
          className="w-5 h-5"
        />
        <div>
          <div className="font-semibold flex items-center gap-2 text-red-400">
            <AlertCircle size={16} /> Обязательное обновление
          </div>
          <p className="text-sm text-slate-400">Пользователь не сможет работать без обновления</p>
        </div>
      </label>

      <div className="flex gap-2 pt-4">
        <button onClick={onSubmit} disabled={!version.version} className="btn-primary flex-1">
          {editingVersion ? 'Сохранить' : 'Создать'}
        </button>
        <button onClick={onCancel} className="btn-secondary flex-1">Отмена</button>
      </div>
    </div>
  );
}
