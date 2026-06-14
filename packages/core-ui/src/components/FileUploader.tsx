'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Cloud, Image, Film, Music } from 'lucide-react';

export interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  onFileUpload: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  maxFileSize?: number; // bytes (default: 25MB)
  maxFiles?: number; // default: 10
  acceptedTypes?: string[]; // e.g. ['image/*', 'application/pdf']
  uploadToYandexDisk?: boolean;
  className?: string;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

export function FileUploader({
  onFileSelect,
  onFileUpload,
  maxFileSize = 26214400, // 25MB
  maxFiles = 10,
  acceptedTypes,
  uploadToYandexDisk = true,
  className = ''
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `Файл слишком большой (${(file.size / 1048576).toFixed(2)} MB). Максимум: ${(maxFileSize / 1048576).toFixed(0)} MB`;
    }

    if (acceptedTypes && !acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -2));
      }
      return file.type === type || file.name.endsWith(type.slice(1));
    })) {
      return `Неподдерживаемый тип файла: ${file.type}`;
    }

    return null;
  };

  const handleFiles = useCallback((files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
      
      // Add to uploads queue
      setUploads(prev => [
        ...prev,
        ...validFiles.map(file => ({
          file,
          progress: 0,
          status: 'pending' as const
        }))
      ]);

      // Start uploading
      uploadFiles(validFiles);
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }
  }, [maxFileSize, maxFiles, acceptedTypes, onFileSelect]);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);

    for (const file of files) {
      try {
        setUploads(prev => prev.map(u => 
          u.file === file ? { ...u, status: 'uploading', progress: 0 } : u
        ));

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploads(prev => prev.map(u => 
            u.file === file && u.status === 'uploading'
              ? { ...u, progress: Math.min(u.progress + 10, 90) }
              : u
          ));
        }, 100);

        const result = await onFileUpload(file);

        clearInterval(progressInterval);

        setUploads(prev => prev.map(u => 
          u.file === file
            ? {
                ...u,
                status: result.success ? 'completed' : 'error',
                progress: result.success ? 100 : u.progress,
                url: result.url,
                error: result.error
              }
            : u
        ));
      } catch (error: any) {
        setUploads(prev => prev.map(u => 
          u.file === file
            ? { ...u, status: 'error', error: error.message }
            : u
        ));
      }
    }

    setIsUploading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (file: File) => {
    setUploads(prev => prev.filter(u => u.file !== file));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image size={20} />;
    if (file.type.startsWith('video/')) return <Film size={20} />;
    if (file.type.startsWith('audio/')) return <Music size={20} />;
    return <File size={20} />;
  };

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'pending': return <Cloud size={16} />;
      case 'uploading': return <Upload size={16} className="spinning" />;
      case 'completed': return <CheckCircle size={16} className="text-green" />;
      case 'error': return <AlertCircle size={16} className="text-red" />;
    }
  };

  return (
    <div className={`file-uploader ${className}`}>
      {/* Drop zone */}
      <div
        className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={48} className="file-drop-icon" />
        <div className="file-drop-text">
          Перетащите файлы сюда или <span className="file-drop-link">выберите</span>
        </div>
        <div className="file-drop-hint">
          Максимум {maxFiles} файлов, до {(maxFileSize / 1048576).toFixed(0)} MB каждый
        </div>
        {acceptedTypes && (
          <div className="file-drop-types">
            {acceptedTypes.join(', ')}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes?.join(',')}
        onChange={handleFileInput}
        className="file-input-hidden"
      />

      {/* Upload queue */}
      {uploads.length > 0 && (
        <div className="file-upload-queue">
          <div className="file-queue-header">
            <h4>Загрузка файлов</h4>
            <span className="file-queue-count">
              {uploads.filter(u => u.status === 'completed').length} / {uploads.length}
            </span>
          </div>

          {uploads.map((upload) => (
            <div key={upload.file.name} className="file-upload-item">
              <div className="file-icon">{getFileIcon(upload.file)}</div>
              
              <div className="file-info">
                <div className="file-name">{upload.file.name}</div>
                <div className="file-meta">
                  {(upload.file.size / 1024).toFixed(1)} KB
                  {upload.status === 'uploading' && (
                    <span className="file-progress-text">{upload.progress}%</span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {upload.status === 'uploading' && (
                <div className="file-progress-bar">
                  <div 
                    className="file-progress-fill" 
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}

              {/* Status icon */}
              <div className="file-status">
                {getStatusIcon(upload.status)}
              </div>

              {/* Remove button */}
              {upload.status !== 'uploading' && (
                <button
                  className="file-remove-btn"
                  onClick={() => removeFile(upload.file)}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Yandex Disk indicator */}
      {uploadToYandexDisk && (
        <div className="file-yandex-disk-indicator">
          <Cloud size={14} />
          <span>Файлы загружаются на Яндекс.Диск</span>
        </div>
      )}
    </div>
  );
}
