'use client';

import { FC, useState } from 'react';
import { Download, FileText, Film, Music, Image as ImageIcon, X, ExternalLink } from 'lucide-react';
import type { Attachment } from '@/types';
import './AttachmentViewer.css';

interface AttachmentViewerProps {
  attachment: Attachment;
  onClose?: () => void;
}

export const AttachmentViewer: FC<AttachmentViewerProps> = ({ attachment, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      if (!attachment.url) {
        setError('URL файла недоступен');
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.fileName || 'file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Ошибка при скачивании');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (attachment.type) {
      case 'image':
        return (
          <div className="attachment-image-container">
            <img
              src={attachment.url}
              alt={attachment.fileName}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError('Ошибка загрузки изображения');
                setIsLoading(false);
              }}
            />
          </div>
        );

      case 'video':
        return (
          <div className="attachment-video-container">
            <video
              controls
              autoPlay
              onLoadStart={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
              onError={() => {
                setError('Ошибка загрузки видео');
                setIsLoading(false);
              }}
            >
              <source src={attachment.url} />
              Ваш браузер не поддерживает видео
            </video>
          </div>
        );

      case 'audio':
        return (
          <div className="attachment-audio-container">
            <div className="audio-icon">
              <Music size={48} />
            </div>
            <audio
              controls
              onLoadStart={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
              onError={() => {
                setError('Ошибка загрузки аудио');
                setIsLoading(false);
              }}
            >
              <source src={attachment.url} />
              Ваш браузер не поддерживает аудио
            </audio>
          </div>
        );

      case 'document':
      case 'pdf':
      case 'office':
        return (
          <div className="attachment-document-container">
            <div className="document-icon">
              {attachment.type === 'pdf' ? (
                <FileText size={64} className="icon-pdf" />
              ) : attachment.type === 'office' ? (
                <FileText size={64} className="icon-office" />
              ) : (
                <FileText size={64} className="icon-document" />
              )}
            </div>
            <div className="document-info">
              <p className="document-name">{attachment.fileName}</p>
              <p className="document-size">{formatFileSize(attachment.fileSize)}</p>
              <p className="document-type">{getDocumentTypeLabel(attachment.type)}</p>
            </div>
            <button 
              className="download-btn"
              onClick={handleDownload}
              disabled={isLoading}
            >
              <Download size={20} />
              <span>Скачать</span>
            </button>
          </div>
        );

      default:
        return (
          <div className="attachment-file-container">
            <FileText size={64} />
            <p>{attachment.fileName}</p>
            <button onClick={handleDownload} disabled={isLoading}>
              <Download size={20} />
              <span>Скачать</span>
            </button>
          </div>
        );
    }
  };

  const getDocumentTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      document: 'Документ',
      pdf: 'PDF документ',
      office: 'Office документ',
    };
    return labels[type] || 'Файл';
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Неизвестно';
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    if (bytes === 0) return '0 Б';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="attachment-viewer">
      {onClose && (
        <button className="attachment-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      )}
      
      {isLoading && (
        <div className="attachment-loading">
          <div className="spinner" />
          <p>Загрузка...</p>
        </div>
      )}
      
      {error && (
        <div className="attachment-error">
          <p>{error}</p>
        </div>
      )}
      
      {!isLoading && !error && renderContent()}
      
      {/* Кнопка скачивания для медиа */}
      {['image', 'video', 'audio'].includes(attachment.type) && (
        <button className="download-media-btn" onClick={handleDownload}>
          <Download size={18} />
          <span>Скачать</span>
        </button>
      )}
    </div>
  );
};

// Компонент для отображения миниатюры вложения в сообщении
interface AttachmentThumbnailProps {
  attachment: Attachment;
  onClick?: () => void;
}

export const AttachmentThumbnail: FC<AttachmentThumbnailProps> = ({ attachment, onClick }) => {
  const getIcon = () => {
    switch (attachment.type) {
      case 'image':
        return <ImageIcon size={24} />;
      case 'video':
        return <Film size={24} />;
      case 'audio':
        return <Music size={24} />;
      default:
        return <FileText size={24} />;
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    if (bytes === 0) return '0 Б';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(0)} ${sizes[i]}`;
  };

  return (
    <div className="attachment-thumbnail" onClick={onClick}>
      {attachment.type === 'image' ? (
        <div className="thumbnail-image">
          <img src={attachment.thumbnailUrl || attachment.url} alt={attachment.fileName} />
        </div>
      ) : (
        <div className={`thumbnail-icon thumbnail-${attachment.type}`}>
          {getIcon()}
          {attachment.type === 'video' && <span className="play-overlay">▶</span>}
        </div>
      )}
      
      {attachment.type !== 'image' && (
        <div className="thumbnail-info">
          <span className="thumbnail-filename">{attachment.fileName}</span>
          <span className="thumbnail-size">{formatFileSize(attachment.fileSize)}</span>
        </div>
      )}
      
      {attachment.type === 'document' && (
        <div className="download-overlay">
          <Download size={20} />
        </div>
      )}
    </div>
  );
};
