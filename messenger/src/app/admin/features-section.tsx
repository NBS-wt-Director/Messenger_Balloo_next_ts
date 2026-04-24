'use client';

import { useState, useEffect } from 'react';
import { useAlert } from '@/hooks/useAlert';
import { Settings, FileText, Plus, Trash2, Edit, Check, X, Eye } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'planned' | 'in-progress' | 'completed' | 'rejected';
  votes: number;
  createdBy: string;
  createdByName: string;
  createdAt: number;
  adminNote?: string;
}

interface Page {
  id: string;
  title: string;
  content: string;
  sections: any[];
  metadata: any;
  isActive: boolean;
  updatedAt: number;
}

interface PageSection {
  id: string;
  type: string;
  title: string;
  content: string;
  data: any;
}

export function FeaturesSection() {
  const { alert, AlertComponent } = useAlert();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'features' | 'pages'>('features');
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  useEffect(() => {
    loadFeatures();
    loadPages();
  }, []);

  const loadFeatures = async () => {
    try {
      const response = await fetch('/api/features?status=all');
      if (response.ok) {
        const data = await response.json();
        setFeatures(data.features || []);
      }
    } catch (error) {
      alert({ message: 'Ошибка загрузки функций', type: 'error' });
    }
  };

  const loadPages = async () => {
    try {
      const slugs = ['support', 'about-company', 'about-balloo'];
      const pagesData: Page[] = [];
      
      for (const slug of slugs) {
        const response = await fetch(`/api/pages?slug=${slug}`);
        if (response.ok) {
          const data = await response.json();
          if (!data.isDefault) {
            pagesData.push(data.page);
          }
        }
      }
      
      setPages(pagesData);
    } catch (error) {
      alert({ message: 'Ошибка загрузки страниц', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateFeatureStatus = async (featureId: string, status: Feature['status'], adminNote: string = '') => {
    try {
      const response = await fetch('/api/features', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureId,
          updates: { status, adminNote }
        })
      });

      if (response.ok) {
        alert({ message: 'Статус обновлён', type: 'success' });
        loadFeatures();
        setEditingFeature(null);
      } else {
        const data = await response.json();
        alert({ message: data.error, type: 'error' });
      }
    } catch (error) {
      alert({ message: 'Ошибка обновления', type: 'error' });
    }
  };

  const deleteFeature = async (featureId: string) => {
    if (!confirm('Удалить это предложение?')) return;

    try {
      const response = await fetch(`/api/features?featureId=${featureId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert({ message: 'Предложение удалено', type: 'success' });
        loadFeatures();
      } else {
        const data = await response.json();
        alert({ message: data.error, type: 'error' });
      }
    } catch (error) {
      alert({ message: 'Ошибка удаления', type: 'error' });
    }
  };

  const savePage = async (page: Page) => {
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page)
      });

      if (response.ok) {
        alert({ message: 'Страница сохранена', type: 'success' });
        loadPages();
        setEditingPage(null);
      } else {
        const data = await response.json();
        alert({ message: data.error, type: 'error' });
      }
    } catch (error) {
      alert({ message: 'Ошибка сохранения', type: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': '#6b7280',
      'planned': '#8b5cf6',
      'in-progress': '#3b82f6',
      'completed': '#22c55e',
      'rejected': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': '⏳ На рассмотрении',
      'planned': '📅 Запланировано',
      'in-progress': '🔄 В работе',
      'completed': '✅ Реализовано',
      'rejected': '❌ Отклонено'
    };
    return labels[status] || status;
  };

  if (loading) {
    return <div className="p-4">Загрузка...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveTab('features')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'features' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'features' ? 'white' : 'var(--foreground)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Settings size={18} />
          Предложения функций
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'pages' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'pages' ? 'white' : 'var(--foreground)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FileText size={18} />
          Страницы
        </button>
      </div>

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div style={{ display: 'grid', gap: '15px' }}>
          {features.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted-foreground)' }}>
              <Settings size={48} style={{ marginBottom: '15px', opacity: 0.3 }} />
              <p>Пока нет предложений от пользователей</p>
            </div>
          ) : (
            features.map((feature) => (
              <div key={feature.id} style={{ 
                padding: '20px', 
                background: 'var(--card)', 
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)' }}>
                        {feature.title}
                      </h3>
                      <span style={{
                        padding: '4px 10px',
                        background: getStatusColor(feature.status),
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}>
                        {getStatusLabel(feature.status)}
                      </span>
                    </div>
                    <p style={{ color: 'var(--muted-foreground)', marginBottom: '10px' }}>
                      {feature.description}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
                      <span>👤 {feature.createdByName}</span>
                      <span>👍 {feature.votes} голосов</span>
                      <span>📅 {new Date(feature.createdAt).toLocaleDateString('ru-RU')}</span>
                      <span>🏷️ {feature.category}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEditingFeature(feature)}
                      style={{
                        padding: '8px 12px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteFeature(feature.id)}
                      style={{
                        padding: '8px 12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {feature.adminNote && (
                  <div style={{ padding: '12px', background: 'var(--background-secondary)', borderRadius: '8px', fontSize: '13px' }}>
                    <strong>Заметка админа:</strong> {feature.adminNote}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div style={{ display: 'grid', gap: '15px' }}>
          {pages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted-foreground)' }}>
              <FileText size={48} style={{ marginBottom: '15px', opacity: 0.3 }} />
              <p>Страницы используют контент по умолчанию</p>
            </div>
          ) : (
            pages.map((page) => (
              <div key={page.id} style={{ 
                padding: '20px', 
                background: 'var(--card)', 
                borderRadius: '12px',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px', color: 'var(--foreground)' }}>
                    {page.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
                    Slug: {page.id} • Обновлено: {new Date(page.updatedAt).toLocaleString('ru-RU')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`/${page.id === 'support' ? 'support' : page.id === 'about-company' ? 'about-company' : 'about-balloo'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px 12px',
                      background: '#22c55e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Eye size={16} />
                    Просмотр
                  </a>
                  <button
                    onClick={() => setEditingPage(page)}
                    style={{
                      padding: '8px 12px',
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Feature Modal */}
      {editingFeature && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Редактировать предложение</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Статус</label>
              <select
                value={editingFeature.status}
                onChange={(e) => setEditingFeature({ ...editingFeature, status: e.target.value as any })}
                style={selectStyle}
              >
                <option value="pending">На рассмотрении</option>
                <option value="planned">Запланировано</option>
                <option value="in-progress">В работе</option>
                <option value="completed">Реализовано</option>
                <option value="rejected">Отклонено</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Заметка админа</label>
              <textarea
                value={editingFeature.adminNote || ''}
                onChange={(e) => setEditingFeature({ ...editingFeature, adminNote: e.target.value })}
                placeholder="Внутренняя заметка..."
                rows={3}
                style={textareaStyle}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  updateFeatureStatus(editingFeature.id, editingFeature.status, editingFeature.adminNote);
                }}
                style={submitButtonStyle}
              >
                <Check size={18} /> Сохранить
              </button>
              <button
                onClick={() => setEditingFeature(null)}
                style={cancelButtonStyle}
              >
                <X size={18} /> Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Page Modal */}
      {editingPage && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: '700px', maxHeight: '80vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Редактировать страницу</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Заголовок</label>
              <input
                type="text"
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Основной контент</label>
              <textarea
                value={editingPage.content}
                onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                rows={4}
                style={textareaStyle}
              />
            </div>

            {/* Special editors for support and about-company pages */}
            {editingPage.id === 'support' && (
              <PageSupportEditor page={editingPage} setEditingPage={setEditingPage} />
            )}
            
            {editingPage.id === 'about-company' && (
              <PageAboutEditor page={editingPage} setEditingPage={setEditingPage} />
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => savePage(editingPage)}
                style={submitButtonStyle}
              >
                <Check size={18} /> Сохранить
              </button>
              <button
                onClick={() => setEditingPage(null)}
                style={cancelButtonStyle}
              >
                <X size={18} /> Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {AlertComponent}
    </div>
  );
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'var(--card)',
  padding: '30px',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '500px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  background: 'var(--background)',
  color: 'var(--foreground)',
  fontSize: '14px'
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer'
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical'
};

const submitButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  background: 'var(--primary)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px'
};

const cancelButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  background: 'var(--background-tertiary)',
  color: 'var(--foreground)',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px'
};

// ===== Редактор страницы поддержки =====
function PageSupportEditor({ page, setEditingPage }: { page: Page; setEditingPage: (p: Page) => void }) {
  const sbpSection = page.sections.find(s => s.type === 'payment' || s.id === 'sbp');
  const qrSection = page.sections.find(s => s.type === 'qr' || s.id === 'qr');

  const updateSection = (sectionId: string, updates: Partial<PageSection>) => {
    const newSections = page.sections.map(s => {
      if (s.id === sectionId || (sectionId === 'sbp' && s.type === 'payment') || (sectionId === 'qr' && s.type === 'qr')) {
        return { ...s, ...updates };
      }
      return s;
    });
    setEditingPage({ ...page, sections: newSections });
  };

  return (
    <div style={{ marginTop: '20px', borderTop: '2px solid var(--border)', paddingTop: '20px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: 'var(--foreground)' }}>
        Настройки страницы поддержки
      </h3>

      {/* SBP Section */}
      <div style={{ marginBottom: '25px', padding: '15px', background: 'var(--background-secondary)', borderRadius: '12px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--foreground)' }}>
          📱 СБП (Система Быстрых Платежей)
        </h4>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
            Номер телефона
          </label>
          <input
            type="text"
            value={sbpSection?.data?.phone || ''}
            onChange={(e) => updateSection('sbp', { data: { ...sbpSection?.data, phone: e.target.value } })}
            placeholder="8 (912) 202-30-35"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
            Банк
          </label>
          <input
            type="text"
            value={sbpSection?.data?.bank || ''}
            onChange={(e) => updateSection('sbp', { data: { ...sbpSection?.data, bank: e.target.value } })}
            placeholder="Сбербанк"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
            Получатель
          </label>
          <input
            type="text"
            value={sbpSection?.data?.recipient || ''}
            onChange={(e) => updateSection('sbp', { data: { ...sbpSection?.data, recipient: e.target.value } })}
            placeholder="Иван Оберюхтин"
            style={inputStyle}
          />
        </div>
      </div>

      {/* QR Section */}
      <div style={{ padding: '15px', background: 'var(--background-secondary)', borderRadius: '12px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--foreground)' }}>
          📷 QR-код для оплаты
        </h4>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
            URL QR-кода
          </label>
          <input
            type="text"
            value={qrSection?.data?.qrCodeUrl || ''}
            onChange={(e) => updateSection('qr', { data: { ...qrSection?.data, qrCodeUrl: e.target.value } })}
            placeholder="/qr/support-qr.png или https://..."
            style={inputStyle}
          />
          <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '5px' }}>
            Укажите путь к изображению QR-кода (относительно public/ или полный URL)
          </p>
        </div>

        {qrSection?.data?.qrCodeUrl && (
          <div style={{ marginTop: '15px', padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
            <img 
              src={qrSection.data.qrCodeUrl} 
              alt="QR Preview" 
              style={{ maxWidth: '200px', height: 'auto' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <p style={{ fontSize: '12px', color: '#22c55e', marginTop: '10px' }}>✓ QR-код загружен</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Редактор страницы о компании =====
function PageAboutEditor({ page, setEditingPage }: { page: Page; setEditingPage: (p: Page) => void }) {
  const developerSection = page.sections.find(s => s.type === 'person' || s.id === 'developer');
  const techSection = page.sections.find(s => s.type === 'features' || s.id === 'tech');

  const updateDeveloper = (updates: any) => {
    const newSections = page.sections.map(s => {
      if (s.id === 'developer' || s.type === 'person') {
        return { ...s, data: { ...s.data, ...updates } };
      }
      return s;
    });
    setEditingPage({ ...page, sections: newSections });
  };

  const updateTechnology = (index: number, field: string, value: string) => {
    const technologies = techSection?.data?.technologies || [];
    const newTechnologies = [...technologies];
    if (newTechnologies[index]) {
      newTechnologies[index] = { ...newTechnologies[index], [field]: value };
    }
    const newSections = page.sections.map(s => {
      if (s.id === 'tech' || s.type === 'features') {
        return { ...s, data: { ...s.data, technologies: newTechnologies } };
      }
      return s;
    });
    setEditingPage({ ...page, sections: newSections });
  };

  const addTechnology = () => {
    const technologies = techSection?.data?.technologies || [];
    const newSections = page.sections.map(s => {
      if (s.id === 'tech' || s.type === 'features') {
        return { ...s, data: { ...s.data, technologies: [...technologies, { name: '', icon: '', description: '' }] } };
      }
      return s;
    });
    setEditingPage({ ...page, sections: newSections });
  };

  const removeTechnology = (index: number) => {
    const technologies = techSection?.data?.technologies || [];
    const newTechnologies = technologies.filter((_: any, i: number) => i !== index);
    const newSections = page.sections.map(s => {
      if (s.id === 'tech' || s.type === 'features') {
        return { ...s, data: { ...s.data, technologies: newTechnologies } };
      }
      return s;
    });
    setEditingPage({ ...page, sections: newSections });
  };

  return (
    <div style={{ marginTop: '20px', borderTop: '2px solid var(--border)', paddingTop: '20px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: 'var(--foreground)' }}>
        Настройки страницы о компании
      </h3>

      {/* Developer Section */}
      <div style={{ marginBottom: '25px', padding: '15px', background: 'var(--background-secondary)', borderRadius: '12px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--foreground)' }}>
          👤 Разработчик
        </h4>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
            Имя
          </label>
          <input
            type="text"
            value={developerSection?.data?.name || ''}
            onChange={(e) => updateDeveloper({ name: e.target.value })}
            placeholder="Иван Оберюхтин"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
            Локация
          </label>
          <input
            type="text"
            value={developerSection?.data?.location || ''}
            onChange={(e) => updateDeveloper({ location: e.target.value })}
            placeholder="Екатеринбург, Россия"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
            Биография
          </label>
          <textarea
            value={developerSection?.data?.bio || ''}
            onChange={(e) => updateDeveloper({ bio: e.target.value })}
            placeholder="Разработчик-одиночка..."
            rows={3}
            style={textareaStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
            Интересы (через точку с запятой)
          </label>
          <textarea
            value={(developerSection?.data?.interests || []).map((i: any) => typeof i === 'string' ? i : i.text).join('; ')}
            onChange={(e) => updateDeveloper({ 
              interests: e.target.value.split(';').map((text: string) => ({ 
                text: text.trim(), 
                icon: text.includes('Ушу') || text.includes('ГРБ') || text.includes('тренир') ? 'sport' : 'code' 
              })) 
            })}
            placeholder="Разработка на React/Next.js; Ушу (тренируется и тренирует); ГРБ (тренируется и тренирует); Вайбкодинг — код в потоке"
            rows={3}
            style={textareaStyle}
          />
          <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '5px' }}>
            Разделяйте интересы точкой с запятой
          </p>
        </div>
      </div>

      {/* Technologies Section */}
      <div style={{ padding: '15px', background: 'var(--background-secondary)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--foreground)' }}>
            ⚙️ Технологии
          </h4>
          <button
            onClick={addTechnology}
            style={{
              padding: '6px 12px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            + Добавить
          </button>
        </div>
        
        {(techSection?.data?.technologies || []).map((tech: any, index: number) => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', marginBottom: '10px' }}>
            <input
              type="text"
              value={tech.name || ''}
              onChange={(e) => updateTechnology(index, 'name', e.target.value)}
              placeholder="Название"
              style={{ ...inputStyle, fontSize: '13px' }}
            />
            <input
              type="text"
              value={tech.icon || ''}
              onChange={(e) => updateTechnology(index, 'icon', e.target.value)}
              placeholder="Эмодзи"
              style={{ ...inputStyle, fontSize: '13px' }}
            />
            <input
              type="text"
              value={tech.description || ''}
              onChange={(e) => updateTechnology(index, 'description', e.target.value)}
              placeholder="Описание"
              style={{ ...inputStyle, fontSize: '13px' }}
            />
            <button
              onClick={() => removeTechnology(index)}
              style={{
                padding: '8px 12px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
