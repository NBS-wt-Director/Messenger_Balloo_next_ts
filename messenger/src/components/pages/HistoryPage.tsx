'use client';

import { useState, useEffect } from 'react';
import { getTranslations } from '@/i18n';
import { useSettingsStore } from '@/stores/settings-store';
import { Tag, Calendar, Clock, User, List, Bug, Rocket } from 'lucide-react';
import './HistoryPage.css';

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

export function HistoryPage() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const [versions, setVersions] = useState<VersionsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/versions')
      .then(res => res.json())
      .then(data => {
        setVersions(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getVersionTypeColor = (type: string) => {
    switch (type) {
      case 'release': return '#22c55e';
      case 'beta': return '#f59e0b';
      case 'alpha': return '#ef4444';
      case 'patch': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getVersionTypeLabel = (type: string) => {
    switch (type) {
      case 'release': return 'Релиз';
      case 'beta': return 'Бета';
      case 'alpha': return 'Альфа';
      case 'patch': return 'Исправление';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <main className="history-main">
        <div className="history-header">
          <h1 className="history-title">История Balloo</h1>
          <p className="history-subtitle">
            История развития проекта Balloo Messenger
          </p>
        </div>

        {/* Текущая версия */}
        <div className="history-current-version">
          <div className="history-current-version-badge">
            <Tag size={16} />
            <span>Текущая версия</span>
          </div>
          <div className="history-current-version-number">
            v{versions?.currentVersion || '0.0.0'}
          </div>
        </div>

        {/* Список версий */}
        <div className="history-versions-list">
          {versions?.versions.map((version, index) => (
            <div key={version.version} className="history-version-card">
              <div className="history-version-header">
                <div className="history-version-info">
                  <div className="history-version-number">v{version.version}</div>
                  <div 
                    className="history-version-type"
                    style={{ background: getVersionTypeColor(version.type) }}
                  >
                    {getVersionTypeLabel(version.type)}
                  </div>
                </div>
                <div className="history-version-meta">
                  <div className="history-version-date">
                    <Calendar size={14} />
                    <span>{version.date}</span>
                  </div>
                  <div className="history-version-time">
                    <Clock size={14} />
                    <span>{version.time}</span>
                  </div>
                </div>
              </div>

              {/* Функции */}
              {version.features && version.features.length > 0 && (
                <div className="history-version-section">
                  <div className="history-version-section-title">
                    <Rocket size={16} color="#22c55e" />
                    <span>Новые функции ({version.features.length})</span>
                  </div>
                  <ul className="history-version-list">
                    {version.features.map((feature, i) => (
                      <li key={i} className="history-version-item">
                        <span className="history-version-item-icon" style={{ color: '#22c55e' }}>
                          ✦
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Исправления */}
              {version.fixes && version.fixes.length > 0 && (
                <div className="history-version-section">
                  <div className="history-version-section-title">
                    <Bug size={16} color="#ef4444" />
                    <span>Исправления ({version.fixes.length})</span>
                  </div>
                  <ul className="history-version-list">
                    {version.fixes.map((fix, i) => (
                      <li key={i} className="history-version-item">
                        <span className="history-version-item-icon" style={{ color: '#ef4444' }}>
                          ●
                        </span>
                        {fix}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Автор */}
              <div className="history-version-footer">
                <div className="history-version-author">
                  <User size={14} />
                  <span>{version.author}</span>
                </div>
              </div>

              {index < (versions?.versions.length || 0) - 1 && (
                <div className="history-version-divider" />
              )}
            </div>
          ))}

          {versions?.versions.length === 0 && (
            <div className="history-empty">
              <Tag size={48} />
              <p>История версий пока пуста</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
