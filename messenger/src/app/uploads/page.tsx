'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Upload, X, File, Image, Music, Film, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import './UploadsPage.css';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  status: 'uploading' | 'ready' | 'failed';
  progress: number;
}

export default function UploadsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = Array.from(selectedFiles).map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Имитация загрузки
    for (const file of newFiles) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: UploadedFile) => {
    // Имитация прогресса загрузки
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, progress: i } : f
      ));
    }

    // API вызов для реальной загрузки
    try {
      const formData = new FormData();
      // formData.append('file', ...);
      // formData.append('messageId', ...);
      // formData.append('chatId', ...);
      // formData.append('uploaderId', ...);

      const response = await fetch('/api/attachments', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'ready' } : f
        ));
      } else {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'failed' } : f
        ));
      }
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'failed' } : f
      ));
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={24} />;
    if (type.startsWith('video/')) return <Film size={24} />;
    if (type.startsWith('audio/')) return <Music size={24} />;
    if (type.includes('pdf') || type.includes('document')) return <FileText size={24} />;
    return <File size={24} />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="uploads-page">
      <Header />
      
      <main className="uploads-main">
        <div className="uploads-container">
          <div className="uploads-header">
            <h1>Загрузка файлов</h1>
            <p>Загрузите изображения, видео, аудио или документы</p>
          </div>

          {/* Drop Zone */}
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              style={{ display: 'none' }}
            />
            
            <Upload size={48} />
            <h3>Перетащите файлы сюда</h3>
            <p>или нажмите для выбора файлов</p>
            <p className="hint">Поддерживаются изображения, видео, аудио и документы до 100MB</p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="files-section">
              <h2>Загруженные файлы ({files.length})</h2>
              
              <div className="files-list">
                {files.map(file => (
                  <div key={file.id} className={`file-item ${file.status}`}>
                    <div className="file-icon">
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-meta">
                        {formatSize(file.size)} • {file.type.split('/')[1] || 'file'}
                      </div>
                      
                      {file.status === 'uploading' && (
                        <div className="file-progress">
                          <div className="progress-bar" style={{ width: `${file.progress}%` }} />
                          <span>{file.progress}%</span>
                        </div>
                      )}
                      
                      {file.status === 'ready' && (
                        <div className="file-status ready">
                          <CheckCircle size={16} />
                          Готово
                        </div>
                      )}
                      
                      {file.status === 'failed' && (
                        <div className="file-status failed">
                          <AlertCircle size={16} />
                          Ошибка загрузки
                        </div>
                      )}
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFile(file.id)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="uploads-actions">
            <button className="btn-primary">
              Отправить в чат
            </button>
            <button className="btn-secondary" onClick={() => setFiles([])}>
              Очистить все
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
