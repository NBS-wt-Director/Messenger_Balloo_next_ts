'use client';

import { FC, useState, useRef } from 'react';
import { useAlert } from '@/hooks/useAlert';
import { X, Upload, Image, Video } from 'lucide-react';
import './StatusUploader.css';

interface StatusUploaderProps {
  onClose: () => void;
  onUpload: (file: File, type: 'image' | 'video') => Promise<void>;
}

export const StatusUploader: FC<StatusUploaderProps> = ({ onClose, onUpload }) => {
  const { alert, AlertComponent } = useAlert();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера (макс 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert({ message: 'Файл слишком большой (макс 50MB)', type: 'error' });
      return;
    }

    // Определение типа
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    if (type !== 'image' && type !== 'video') {
      alert({ message: 'Неподдерживаемый тип файла', type: 'error' });
      return;
    }

    setSelectedFile(file);
    setSelectedType(type);

    // Предпросмотр
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedType) return;

    try {
      setIsUploading(true);
      await onUpload(selectedFile, selectedType);
      alert({ message: 'Статус опубликован', type: 'success' });
      onClose();
    } catch (error: any) {
      alert({ message: error.message || 'Ошибка при загрузке', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="status-uploader-overlay" onClick={onClose}>
      <div className="status-uploader-content" onClick={(e) => e.stopPropagation()}>
        <button className="status-uploader-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2>Новый статус</h2>
        <p className="status-uploader-description">
          Выберите фото или видео. Статус исчезнет через 24 часа.
        </p>

        {!preview ? (
          <div className="status-upload-options">
            <button 
              className="status-upload-option"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="status-option-icon image">
                <Image size={40} />
              </div>
              <span>Фото</span>
            </button>
            
            <button 
              className="status-upload-option"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="status-option-icon video">
                <Video size={40} />
              </div>
              <span>Видео</span>
            </button>
          </div>
        ) : (
          <div className="status-preview-container">
            {selectedType === 'image' ? (
              <img src={preview} alt="Preview" className="status-preview" />
            ) : (
              <video src={preview} className="status-preview" controls />
            )}
            
            <div className="status-preview-info">
              <span className="status-filename">{selectedFile?.name}</span>
              <span className="status-filesize">
                {(selectedFile!.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
        )}

        <div className="status-uploader-actions">
          {preview && (
            <button 
              className="status-btn-cancel"
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
                setSelectedType(null);
              }}
              disabled={isUploading}
            >
              Отмена
            </button>
          )}
          
          <button 
            className="status-btn-upload"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <div className="status-spinner" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload size={20} />
                {preview ? 'Опубликовать' : 'Выбрать файл'}
              </>
            )}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {AlertComponent}
    </div>
  );
};
