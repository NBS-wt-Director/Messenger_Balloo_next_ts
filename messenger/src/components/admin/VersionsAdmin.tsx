'use client';

import { useState, useEffect } from 'react';
import { getTranslations } from '@/i18n';
import { useSettingsStore } from '@/stores/settings-store';
import { useAlert } from '@/hooks/useAlert';
import { Plus, Trash2, Edit2, Save, X, Rocket, Bug } from 'lucide-react';
import './VersionsAdmin.css';

interface Version {
  version: string;
  date: string;
  time: string;
  type: string;
  features: string[];
  fixes: string[];
  author: string;
}

interface VersionsData {
  currentVersion: string;
  versions: Version[];
}

export function VersionsAdmin() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const { alert, confirm, AlertComponent, ConfirmComponent } = useAlert();
  
  const [versions, setVersions] = useState<VersionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Форма
  const [formData, setFormData] = useState({
    version: '',
    type: 'release',
    features: '',
    fixes: '',
    author: 'NLP-Core-Team'
  });

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      const res = await fetch('/api/versions');
      const data = await res.json();
      setVersions(data);
      setLoading(false);
    } catch (error) {
      console.error('[Versions Admin] Error:', error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      version: '',
      type: 'release',
      features: '',
      fixes: '',
      author: 'NLP-Core-Team'
    });
    setShowAddModal(true);
  };

  const handleEdit = (version: Version) => {
    setEditingVersion(version);
    setFormData({
      version: version.version,
      type: version.type,
      features: version.features.join('\n'),
      fixes: version.fixes.join('\n'),
      author: version.author
    });
    setShowAddModal(true);
  };

  const handleDelete = async (version: string) => {
    const confirmed = await confirm(
      `Вы действительно хотите удалить версию ${version}?`,
      'warning',
      'Удалить',
      'Отмена'
    );
    if (!confirmed) return;

    // TODO: Добавить API для удаления
    alert({ message: 'Функция удаления в разработке', type: 'info' });
  };

  const handleSubmit = async () => {
    if (!formData.version) {
      alert({ message: 'Введите номер версии', type: 'error' });
      return;
    }

    try {
      const features = formData.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const fixes = formData.fixes
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const response = await fetch('/api/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: formData.version,
          type: formData.type,
          features,
          fixes,
          author: formData.author
        })
      });

      if (response.ok) {
        alert({ message: 'Версия добавлена', type: 'success' });
        setShowAddModal(false);
        setEditingVersion(null);
        loadVersions();
      } else {
        const error = await response.json();
        alert({ message: 'Ошибка: ' + error.error, type: 'error' });
      }
    } catch (error) {
      console.error('[Versions Admin] Error:', error);
      alert({ message: 'Ошибка при сохранении', type: 'error' });
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingVersion(null);
  };

  if (loading) {
    return (
      <div className="versions-admin">
        <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="versions-admin">
      <div className="versions-admin-header">
        <h2>Управление версиями</h2>
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={16} />
          <span>Добавить версию</span>
        </button>
      </div>

      {/* Текущая версия */}
      <div className="versions-admin-current">
        <div className="versions-admin-current-label">Текущая версия:</div>
        <div className="versions-admin-current-value">v{versions?.currentVersion || '0.0.0'}</div>
      </div>

      {/* Список версий */}
      <div className="versions-admin-list">
        {versions?.versions.map((version, index) => (
          <div key={version.version} className="versions-admin-card">
            <div className="versions-admin-card-header">
              <div className="versions-admin-card-title">v{version.version}</div>
              <div className="versions-admin-card-actions">
                <button 
                  className="versions-admin-action-btn"
                  onClick={() => handleEdit(version)}
                  title="Редактировать"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className="versions-admin-action-btn danger"
                  onClick={() => handleDelete(version.version)}
                  title="Удалить"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="versions-admin-card-meta">
              <span>{version.date} {version.time}</span>
              <span className="versions-admin-version-type">{version.type}</span>
              <span>{version.author}</span>
            </div>

            {version.features.length > 0 && (
              <div className="versions-admin-section">
                <div className="versions-admin-section-title">
                  <Rocket size={14} color="#22c55e" />
                  <span>Функции ({version.features.length})</span>
                </div>
                <ul className="versions-admin-list">
                  {version.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {version.fixes.length > 0 && (
              <div className="versions-admin-section">
                <div className="versions-admin-section-title">
                  <Bug size={14} color="#ef4444" />
                  <span>Исправления ({version.fixes.length})</span>
                </div>
                <ul className="versions-admin-list">
                  {version.fixes.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {index < (versions?.versions.length || 0) - 1 && (
              <div className="versions-admin-divider" />
            )}
          </div>
        ))}

        {versions?.versions.length === 0 && (
          <div className="versions-admin-empty">
            <p>Список версий пуст</p>
          </div>
        )}
      </div>

      {/* Модальное окно добавления/редактирования */}
      {showAddModal && (
        <div className="versions-admin-modal-overlay">
          <div className="versions-admin-modal">
            <div className="versions-admin-modal-header">
              <h3>{editingVersion ? 'Редактировать версию' : 'Добавить версию'}</h3>
              <button onClick={handleCancel}>✕</button>
            </div>

            <div className="versions-admin-modal-body">
              <div className="form-group">
                <label>Номер версии</label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="0.0.1"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Тип</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="form-select"
                >
                  <option value="release">Релиз</option>
                  <option value="beta">Бета</option>
                  <option value="alpha">Альфа</option>
                  <option value="patch">Исправление</option>
                </select>
              </div>

              <div className="form-group">
                <label>Новые функции (каждая с новой строки)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Функция 1&#10;Функция 2&#10;Функция 3"
                  className="form-textarea"
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label>Исправления (каждое с новой строки)</label>
                <textarea
                  value={formData.fixes}
                  onChange={(e) => setFormData({ ...formData, fixes: e.target.value })}
                  placeholder="Исправление 1&#10;Исправление 2"
                  className="form-textarea"
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label>Автор</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="NLP-Core-Team"
                  className="form-input"
                />
              </div>
            </div>

            <div className="versions-admin-modal-footer">
              <button className="btn-secondary" onClick={handleCancel}>
                Отмена
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                <Save size={16} />
                <span>Сохранить</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {AlertComponent}
      {ConfirmComponent}
    </div>
  );
}
