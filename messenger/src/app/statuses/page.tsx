'use client';

import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useAlert } from '@/hooks/useAlert';
import { getTranslations } from '@/i18n';
import { useSettingsStore } from '@/stores/settings-store';
import { Plus, X } from 'lucide-react';
import { StatusViewer } from '@/components/StatusViewer';
import { StatusUploader } from '@/components/StatusUploader';
import { getStatuses, uploadStatus, viewStatus, deleteStatus } from '@/api/statuses';
import type { Status } from '@/api/statuses';
// import './StatusesPage.css'; // CSS not found

export default function StatusesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const { alert, AlertComponent } = useAlert();

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showViewer, setShowViewer] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string | undefined>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadStatuses();
  }, [isAuthenticated, router]);

  const loadStatuses = async () => {
    try {
      setIsLoading(true);
      const result = await getStatuses();
      
      if (result.success && result.statuses) {
        setStatuses(result.statuses);
      }
    } catch (error) {
      console.error('[Statuses] Error:', error);
      alert({ message: 'Ошибка загрузки статусов', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File, type: 'image' | 'video') => {
    const result = await uploadStatus(file, type);
    
    if (result.success) {
      await loadStatuses();
    } else {
      throw new Error(result.error || 'Ошибка загрузки');
    }
  };

  const handleMarkViewed = async (statusId: string) => {
    await viewStatus(statusId);
    await loadStatuses();
  };

  const handleDelete = async (statusId: string) => {
    await deleteStatus(statusId);
    await loadStatuses();
  };

  const openStatus = (statusId?: string) => {
    setSelectedStatusId(statusId);
    setShowViewer(true);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="statuses-page">
        <div className="statuses-empty">
          <h2>Требуется авторизация</h2>
          <p>Войдите в аккаунт для просмотра статусов</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statuses-page">
      <div className="statuses-header">
        <h1>Статусы</h1>
        <p className="statuses-description">
          Фото и видео контакты исчезают через 24 часа
        </p>
      </div>

      {isLoading ? (
        <div className="statuses-loading">
          <div className="spinner" />
          <p>Загрузка статусов...</p>
        </div>
      ) : statuses.length === 0 ? (
        <div className="statuses-empty">
          <h2>Нет активных статусов</h2>
          <p>Ваши контакты ещё не добавили статусы</p>
        </div>
      ) : (
        <div className="statuses-grid">
          {statuses.map((status) => (
            <div 
              key={status.id}
              className={`status-card ${status.isViewed ? 'viewed' : ''}`}
              onClick={() => openStatus(status.id)}
            >
              <div className="status-card-avatar">
                {status.avatar ? (
                  <img src={status.avatar} alt={status.displayName} />
                ) : (
                  <span>{status.displayName[0]}</span>
                )}
                {status.type === 'video' && (
                  <div className="status-video-badge">🎬</div>
                )}
              </div>
              <span className="status-card-name">{status.displayName}</span>
              {!status.isViewed && <div className="status-unread-indicator" />}
            </div>
          ))}
        </div>
      )}

      {/* Кнопка добавления статуса */}
      <button 
        className="add-status-btn"
        onClick={() => setShowUploader(true)}
        title="Добавить статус"
      >
        <Plus size={24} />
      </button>

      {/* Viewer */}
      {showViewer && statuses.length > 0 && (
        <StatusViewer
          statuses={statuses}
          initialStatusId={selectedStatusId}
          onClose={() => setShowViewer(false)}
          onMarkViewed={handleMarkViewed}
          onDelete={handleDelete}
        />
      )}

      {/* Uploader */}
      {showUploader && (
        <StatusUploader
          onClose={() => setShowUploader(false)}
          onUpload={handleUpload}
        />
      )}

      {AlertComponent}
    </div>
  );
}
