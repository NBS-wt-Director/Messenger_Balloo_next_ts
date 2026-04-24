'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Shield, AlertTriangle, Check, X, Eye, Filter, Trash2 } from 'lucide-react';
import './admin-reports.css';

interface Report {
  id: string;
  targetType: 'chat' | 'user' | 'contact' | 'invitation';
  targetId: string;
  reportedBy: string;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'fake' | 'other';
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: number;
  resolution?: string;
  createdAt: number;
  updatedAt: number;
}

const REASON_LABELS: Record<string, string> = {
  spam: 'Спам',
  harassment: 'Оскорбления',
  inappropriate: 'Неуместный контент',
  fake: 'Фейк',
  other: 'Другое'
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  reviewing: 'На рассмотрении',
  resolved: 'Решено',
  rejected: 'Отклонено'
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  reviewing: '#3b82f6',
  resolved: '#10b981',
  rejected: '#ef4444'
};

export default function AdminReportsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push('/login');
      return;
    }
    loadReports();
  }, [isAuthenticated, user?.isAdmin]);

  const loadReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      
      if (response.ok) {
        setReports(data.reports || []);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Reports] Error loading:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: Report['status'], resolution?: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          resolution,
          reviewedBy: user?.id
        })
      });

      if (response.ok) {
        loadReports();
        setSelectedReport(null);
        setResolutionText('');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Reports] Error updating:', error);
      }
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    rejected: reports.filter(r => r.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="admin-reports-page">
        <div className="loading">Загрузка жалоб...</div>
      </div>
    );
  }

  return (
    <div className="admin-reports-page">
      <header className="admin-reports-header">
        <div className="header-left">
          <Shield size={24} />
          <h1>Жалобы пользователей</h1>
        </div>
        <button onClick={() => router.push('/admin')}>
          Назад в админку
        </button>
      </header>

      {/* Статистика */}
      <div className="admin-reports-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Всего</span>
        </div>
        <div className="stat-card pending">
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">Ожидают</span>
        </div>
        <div className="stat-card reviewing">
          <span className="stat-value">{stats.reviewing}</span>
          <span className="stat-label">На рассмотрении</span>
        </div>
        <div className="stat-card resolved">
          <span className="stat-value">{stats.resolved}</span>
          <span className="stat-label">Решено</span>
        </div>
        <div className="stat-card rejected">
          <span className="stat-value">{stats.rejected}</span>
          <span className="stat-label">Отклонено</span>
        </div>
      </div>

      {/* Фильтры */}
      <div className="admin-reports-filters">
        <Filter size={18} />
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Все ({stats.total})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Ожидают ({stats.pending})
        </button>
        <button 
          className={filter === 'reviewing' ? 'active' : ''}
          onClick={() => setFilter('reviewing')}
        >
          На рассмотрении ({stats.reviewing})
        </button>
        <button 
          className={filter === 'resolved' ? 'active' : ''}
          onClick={() => setFilter('resolved')}
        >
          Решено ({stats.resolved})
        </button>
        <button 
          className={filter === 'rejected' ? 'active' : ''}
          onClick={() => setFilter('rejected')}
        >
          Отклонено ({stats.rejected})
        </button>
      </div>

      {/* Список жалоб */}
      <div className="admin-reports-list">
        {filteredReports.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={48} />
            <p>Жалоб не найдено</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <div className="report-id">#{report.id.slice(0, 8)}</div>
                <span 
                  className="report-status"
                  style={{ backgroundColor: STATUS_COLORS[report.status] }}
                >
                  {STATUS_LABELS[report.status]}
                </span>
              </div>

              <div className="report-body">
                <div className="report-info">
                  <div className="report-row">
                    <span className="label">Тип:</span>
                    <span className="value">{report.targetType}</span>
                  </div>
                  <div className="report-row">
                    <span className="label">Причина:</span>
                    <span className="value">{REASON_LABELS[report.reason]}</span>
                  </div>
                  <div className="report-row">
                    <span className="label">От:</span>
                    <span className="value">{report.reportedBy}</span>
                  </div>
                  <div className="report-row">
                    <span className="label">Дата:</span>
                    <span className="value">
                      {new Date(report.createdAt).toLocaleString('ru-RU')}
                    </span>
                  </div>
                </div>

                {report.description && (
                  <div className="report-description">
                    <strong>Описание:</strong>
                    <p>{report.description}</p>
                  </div>
                )}
              </div>

              <div className="report-actions">
                <button 
                  className="btn-view"
                  onClick={() => setSelectedReport(report)}
                >
                  <Eye size={16} />
                  Просмотр
                </button>
                {report.status === 'pending' && (
                  <>
                    <button 
                      className="btn-approve"
                      onClick={() => updateReportStatus(report.id, 'resolved', 'Жалоба удовлетворена')}
                    >
                      <Check size={16} />
                      Принять
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => updateReportStatus(report.id, 'rejected', 'Жалоба отклонена')}
                    >
                      <X size={16} />
                      Отклонить
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Модальное окно просмотра */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Жалоба #{selectedReport.id.slice(0, 8)}</h2>
            
            <div className="modal-body">
              <div className="detail-row">
                <span className="label">Статус:</span>
                <span className="value" style={{ color: STATUS_COLORS[selectedReport.status] }}>
                  {STATUS_LABELS[selectedReport.status]}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Тип цели:</span>
                <span className="value">{selectedReport.targetType}</span>
              </div>
              <div className="detail-row">
                <span className="label">ID цели:</span>
                <span className="value">{selectedReport.targetId}</span>
              </div>
              <div className="detail-row">
                <span className="label">Причина:</span>
                <span className="value">{REASON_LABELS[selectedReport.reason]}</span>
              </div>
              <div className="detail-row">
                <span className="label">От пользователя:</span>
                <span className="value">{selectedReport.reportedBy}</span>
              </div>
              <div className="detail-row">
                <span className="label">Создана:</span>
                <span className="value">
                  {new Date(selectedReport.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>

              {selectedReport.description && (
                <div className="detail-description">
                  <strong>Описание:</strong>
                  <p>{selectedReport.description}</p>
                </div>
              )}

              {selectedReport.resolution && (
                <div className="detail-resolution">
                  <strong>Решение:</strong>
                  <p>{selectedReport.resolution}</p>
                </div>
              )}

              {/* Форма решения */}
              {selectedReport.status === 'pending' && (
                <div className="resolution-form">
                  <label>Комментарий к решению:</label>
                  <textarea
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    placeholder="Введите комментарий..."
                    rows={3}
                  />
                  <div className="form-actions">
                    <button 
                      className="btn-approve"
                      onClick={() => updateReportStatus(selectedReport.id, 'resolved', resolutionText || 'Жалоба удовлетворена')}
                    >
                      <Check size={16} />
                      Принять жалобу
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => updateReportStatus(selectedReport.id, 'rejected', resolutionText || 'Жалоба отклонена')}
                    >
                      <X size={16} />
                      Отклонить жалобу
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="modal-close" onClick={() => setSelectedReport(null)}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
