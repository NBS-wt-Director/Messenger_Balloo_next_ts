 /**
 * File Upload Component
 * Загрузка файлов в Yandex Disk
 */

import { useState, useCallback } from 'react';
import { useAlert } from '@/hooks/useAlert';
import { uploadFileToYandexDisk } from '@/api/disk';
import { Paperclip, Image as ImageIcon, Film, FileText, X } from 'lucide-react';

interface FileUploadProps {
  chatId: string;
  onUploadComplete: (attachmentId: string, url: string) => void;
  onUploadError?: (error: string) => void;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/quicktime',
  'audio/mpeg', 'audio/ogg', 'audio/wav',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export function FileUpload({ chatId, onUploadComplete, onUploadError }: FileUploadProps) {
  const { alert } = useAlert();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `Файл слишком большой. Максимум ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Неподдерживаемый тип файла';
    }

    return null;
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert({ message: error, type: 'error' });
      onUploadError?.(error);
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadFileToYandexDisk(
        chatId,
        file,
        file.name,
        '/balloo-uploads',
        (uploadProgress) => {
          setProgress(uploadProgress);
        }
      );

      if (result.fileName) {
        onUploadComplete(result.fileName, result.filePath);
        alert({ message: 'Файл загружен', type: 'success' });
      } else {
        throw new Error('Failed to upload');
      }
    } catch (error: any) {
      console.error('[FileUpload] Error:', error);
      const errorMessage = error.message || 'Ошибка загрузки файла';
      alert({ message: errorMessage, type: 'error' });
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setProgress(0);
      setSelectedFile(null);
    }
  }, [chatId, validateFile, onUploadComplete, onUploadError, alert]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = '';
  }, [handleFileSelect]);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon size={20} />;
    if (fileType.startsWith('video/')) return <Film size={20} />;
    if (fileType.startsWith('audio/')) return <FileText size={20} />;
    return <FileText size={20} />;
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        id="file-upload-input"
        style={{ display: 'none' }}
        onChange={handleInputChange}
        accept={ALLOWED_TYPES.join(',')}
        disabled={isUploading}
      />

      <label
        htmlFor="file-upload-input"
        className={`file-upload-button ${isUploading ? 'disabled' : ''}`}
        title="Прикрепить файл"
      >
        <Paperclip size={20} />
      </label>

      {isUploading && selectedFile && (
        <div className="file-upload-progress">
          <div className="file-upload-info">
            {getFileIcon(selectedFile.type)}
            <span className="file-upload-name">{selectedFile.name}</span>
            <button
              className="file-upload-cancel"
              onClick={() => setIsUploading(false)}
              disabled={progress === 100}
            >
              <X size={16} />
            </button>
          </div>
          <div className="file-upload-progress-bar">
            <div
              className="file-upload-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="file-upload-progress-text">{progress}%</div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
