'use client';

import { FC, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useAlert } from '@/hooks/useAlert';
import { X, Eye, Play, Trash2, Upload } from 'lucide-react';
import './StatusViewer.css';

interface Status {
  id: string;
  userId: string;
  displayName: string;
  avatar?: string;
  type: 'image' | 'video';
  attachmentId: string;
  publicUrl?: string;
  viewCount: number;
  isViewed: boolean;
  createdAt: number;
  expiresAt: number;
}

interface StatusViewerProps {
  statuses: Status[];
  initialStatusId?: string;
  onClose: () => void;
  onMarkViewed: (statusId: string) => Promise<void>;
  onDelete?: (statusId: string) => Promise<void>;
}

export const StatusViewer: FC<StatusViewerProps> = ({
  statuses,
  initialStatusId,
  onClose,
  onMarkViewed,
  onDelete
}) => {
  const { user } = useAuthStore();
  const { alert, AlertComponent } = useAlert();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentStatus = statuses[currentIndex];

  useEffect(() => {
    if (initialStatusId) {
      const index = statuses.findIndex(s => s.id === initialStatusId);
      if (index >= 0) {
        setCurrentIndex(index);
      }
    }
  }, [initialStatusId, statuses]);

  useEffect(() => {
    if (!currentStatus) return;

    // Отметить как просмотренный
    if (!currentStatus.isViewed && currentStatus.userId !== user?.id) {
      onMarkViewed(currentStatus.id).catch(console.error);
    }

    // Авто-переключение через 5 секунд для изображений
    if (currentStatus.type === 'image' && !isPaused) {
      const timer = setTimeout(() => {
        nextStatus();
      }, 5000);
      return () => clearTimeout(timer);
    }

    // Прогресс бар
    const startTime = Date.now();
    const duration = currentStatus.type === 'video' ? 15000 : 5000;
    
    const interval = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / duration) * 100;
        
        if (newProgress >= 100) {
          nextStatus();
        } else {
          setProgress(newProgress);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const nextStatus = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const prevStatus = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = confirm('Удалить этот статус?');
    if (!confirmed) return;

    try {
      await onDelete(currentStatus.id);
      alert({ message: 'Статус удалён', type: 'success' });
      
      if (statuses.length === 1) {
        onClose();
      } else if (currentIndex >= statuses.length - 1) {
        setCurrentIndex(currentIndex - 1);
      }
    } catch (error) {
      alert({ message: 'Ошибка при удалении', type: 'error' });
    }
  };

  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  return (
    <div className="status-viewer-overlay" onClick={onClose}>
      <div className="status-viewer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header with progress bars */}
        <div className="status-header">
          {statuses.map((status, index) => (
            <div 
              key={status.id} 
              className={`status-progress-bar ${index === currentIndex ? 'active' : ''} ${status.isViewed ? 'viewed' : ''}`}
            >
              <div 
                className="status-progress-fill" 
                style={{ 
                  width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="status-user-info">
          <div className="status-user-avatar">
            {currentStatus.avatar ? (
              <img src={currentStatus.avatar} alt={currentStatus.displayName} />
            ) : (
              <span>{currentStatus.displayName[0]}</span>
            )}
          </div>
          <div className="status-user-details">
            <span className="status-user-name">{currentStatus.displayName}</span>
            <span className="status-time">
              {new Date(currentStatus.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          {currentStatus.userId === user?.id && onDelete && (
            <button className="status-delete-btn" onClick={handleDelete}>
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* Status content */}
        <div 
          className="status-media-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
        >
          {/* Области для переключения */}
          <div className="status-touch-area left" onClick={prevStatus} />
          <div className="status-touch-area right" onClick={nextStatus} />

          {currentStatus.type === 'image' ? (
            <div className="status-octagon image">
              <img 
                src={currentStatus.publicUrl || '/placeholder.jpg'} 
                alt="Status"
                className="status-image"
              />
            </div>
          ) : (
            <div className="status-octagon video">
              <video 
                src={currentStatus.publicUrl || ''} 
                className="status-video"
                autoPlay
                muted
                playsInline
                onEnded={nextStatus}
              />
              <div className="status-video-overlay">
                <Play size={48} />
              </div>
            </div>
          )}
        </div>

        {/* Views count */}
        {currentStatus.userId === user?.id && (
          <div className="status-views">
            <Eye size={16} />
            <span>{currentStatus.viewCount} просмотров</span>
          </div>
        )}

        {/* Navigation hints */}
        <div className="status-hints">
          <span>← Назад</span>
          <span>Вперёд →</span>
        </div>

        {/* Close button */}
        <button className="status-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {AlertComponent}
    </div>
  );
};
