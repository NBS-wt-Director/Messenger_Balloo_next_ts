'use client';

import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Download, Smartphone, Monitor, Cloud, Github, Apple, Globe, Code, Laptop, Terminal } from 'lucide-react';
import Link from 'next/link';

interface Platform {
  name: string;
  code: string;
  version: string;
  releaseDate: string;
  downloadUrl: string;
  manifestUrl: string | null;
  status: 'available' | 'coming-soon';
  features: string[];
}

export default function DownloadsPage() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/media/application/platforms.json')
      .then(res => res.json())
      .then(data => {
        setPlatforms(data.platforms || []);
        setLoading(false);
      })
      .catch(() => {
        setPlatforms([]);
        setLoading(false);
      });
  }, []);

  const getIcon = (code: string) => {
    switch (code) {
      case 'android': return Smartphone;
      case 'ios': return Apple;
      case 'windows': return Laptop;
      case 'linux': return Terminal;
      case 'macos': return Monitor;
      case 'web': return Globe;
      case 'git': return Github;
      default: return Download;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'available' ? 'var(--primary)' : '#9ca3af';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid var(--border)', 
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, padding: '40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '800', 
            marginBottom: '16px', 
            color: 'var(--foreground)',
            textAlign: 'center'
          }}>
            {translations.downloads || 'Загрузки'}
          </h1>
          
          <p style={{ 
            fontSize: '18px', 
            color: 'var(--muted-foreground)', 
            marginBottom: '48px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto 48px'
          }}>
            {translations.downloadFor || 'Выберите подходящую версию для вашей платформы'}
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            {platforms.map((platform) => {
              const Icon = getIcon(platform.code);
              const isAvailable = platform.status === 'available';
              
              return (
                <div 
                  key={platform.code}
                  style={{ 
                    padding: '32px', 
                    border: '2px solid var(--border)', 
                    background: 'var(--card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--muted)',
                      border: '2px solid var(--border)'
                    }}>
                      <Icon size={28} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <h2 style={{ 
                        fontSize: '22px', 
                        fontWeight: '700',
                        color: 'var(--foreground)'
                      }}>
                        {translations[platform.code as keyof typeof translations] || platform.name}
                      </h2>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        fontSize: '14px',
                        color: 'var(--muted-foreground)'
                      }}>
                        <span>{translations.version}: {platform.version}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    padding: '12px', 
                    background: 'var(--background)',
                    border: '1px solid var(--border)',
                    fontSize: '14px',
                    color: 'var(--muted-foreground)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>{translations.releaseDate}:</span>
                      <span>{platform.releaseDate}</span>
                    </div>
                    {platform.features && platform.features.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{translations.features}:</div>
                        <ul style={{ 
                          margin: 0, 
                          paddingLeft: '20px',
                          fontSize: '13px'
                        }}>
                          {platform.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {isAvailable ? (
                    platform.code === 'git' ? (
                      <a 
                        href={platform.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '14px 24px',
                          background: 'var(--primary)',
                          color: 'white',
                          border: '2px solid var(--primary)',
                          cursor: 'pointer',
                          fontWeight: '700',
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <Github size={18} />
                        {translations.gitRepo}
                      </a>
                    ) : (
                      <a 
                        href={platform.downloadUrl}
                        style={{
                          padding: '14px 24px',
                          background: 'var(--primary)',
                          color: 'white',
                          border: '2px solid var(--primary)',
                          cursor: 'pointer',
                          fontWeight: '700',
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <Download size={18} />
                        {translations.download}
                      </a>
                    )
                  ) : (
                    <Link 
                      href="/support"
                      style={{
                        padding: '14px 24px',
                        background: 'var(--muted)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--border)',
                        cursor: 'not-allowed',
                        fontWeight: '700',
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {translations.comingSoon}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {platforms.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              background: 'var(--card)',
              border: '2px solid var(--border)'
            }}>
              <Download size={64} style={{ 
                color: 'var(--muted-foreground)', 
                marginBottom: '24px',
                margin: '0 auto 24px'
              }} />
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                marginBottom: '12px',
                color: 'var(--foreground)'
              }}>
                {translations.appNotReady || 'Приложение пока не готово'}
              </h2>
              <p style={{ 
                color: 'var(--muted-foreground)',
                marginBottom: '24px'
              }}>
                {translations.appNotReadyDesc || 'Загрузка будет доступна позднее'}
              </p>
              <Link href="/support">
                <button style={{
                  padding: '14px 32px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '700'
                }}>
                  {translations.supportProject}
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
