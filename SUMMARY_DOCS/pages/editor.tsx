import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const EDITABLE_FILES = [
  { path: 'To_clean.md', title: 'Файлы на очистку' },
  { path: 'Featurys.md', title: 'Реализованные функции' },
  { path: 'Release_plan.md', title: 'План релиза' },
  { path: 'Realease_calendare.md', title: 'Календарь релиза' },
  { path: 'TZ.md', title: 'Техзадание' },
  { path: 'Errors.md', title: 'Ошибки' },
];

export default function EditorPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const directories = ['Contracts', 'Nodes', 'Modules', 'Tree', 'history_tickets', 'Owner_tickets'];

  useEffect(() => {
    if (selectedFile) {
      loadFile(selectedFile);
    }
  }, [selectedFile]);

  const loadFile = async (filePath: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/file?path=${encodeURIComponent(filePath)}`);
      if (response.ok) {
        const data = await response.text();
        setContent(data);
        setMessage(null);
      } else {
        setMessage({ type: 'error', text: 'Ошибка загрузки файла' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async () => {
    if (!selectedFile) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: selectedFile,
          content: content,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Файл сохранён!' });
        // Trigger revalidation
        if (typeof window !== 'undefined') {
          // Clear Next.js cache
          window.location.reload();
        }
      } else {
        setMessage({ type: 'error', text: result.message || 'Ошибка сохранения' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header title="✏️ Редактор документов" />
      
      <div style={{ display: 'flex', marginTop: '80px' }}>
        <Sidebar directories={directories} />
        
        <main style={{
          marginLeft: '280px',
          padding: '2rem',
          flex: 1,
          maxWidth: 'calc(100% - 280px)'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ 
              fontSize: '2rem', 
              marginBottom: '1.5rem', 
              color: '#1a1a2e',
              borderBottom: '3px solid #e94560',
              paddingBottom: '1rem'
            }}>
              Редактор документов
            </h1>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                Выберите файл для редактирования:
              </label>
              <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '0',
                  background: 'white'
                }}
              >
                <option value="">-- Выберите файл --</option>
                {EDITABLE_FILES.map((file) => (
                  <option key={file.path} value={file.path}>
                    {file.title} ({file.path})
                  </option>
                ))}
              </select>
            </div>

            {message && (
              <div style={{
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '0',
                background: message.type === 'success' ? '#e8f5e9' : '#ffebee',
                color: message.type === 'success' ? '#4caf50' : '#f44336',
                border: `1px solid ${message.type === 'success' ? '#4caf50' : '#f44336'}`
              }}>
                {message.text}
              </div>
            )}

            {selectedFile && (
              <>
                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    Файл: {selectedFile}
                  </span>
                  {loading && <span style={{ color: '#0066cc' }}>Загрузка...</span>}
                </div>
                
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    minHeight: '500px',
                    padding: '1rem',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    border: '1px solid #ddd',
                    borderRadius: '0',
                    resize: 'vertical',
                    background: '#fafafa'
                  }}
                  placeholder="Содержимое файла..."
                />

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={saveFile}
                    disabled={saving || loading}
                    style={{
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      background: saving ? '#ccc' : '#e94560',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {saving ? 'Сохранение...' : '💾 Сохранить'}
                  </button>

                  <button
                    onClick={() => {
                      if (selectedFile) loadFile(selectedFile);
                    }}
                    disabled={loading}
                    style={{
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      background: 'white',
                      color: '#e94560',
                      border: '1px solid #e94560',
                      borderRadius: '0',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 600
                    }}
                  >
                    🔄 Отменить изменения
                  </button>
                </div>

                <div style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  background: '#fff3cd',
                  border: '1px solid #ffc107',
                  color: '#856404'
                }}>
                  <strong>⚠️ Важно:</strong> После сохранения страница автоматически обновится для применения изменений.
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
