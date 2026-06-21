'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, BookOpen, Home, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setTheme('dark');
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    }
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/docs/app-canonical', label: 'App Docs', icon: BookOpen },
    { href: '/catalog', label: 'Catalog', icon: FileText },
  ];

  return (
    <header className="border-b sticky top-0 z-40" style={{ 
      background: 'var(--card)', 
      borderColor: 'var(--border)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            🎈 Balloo Docs
          </Link>

          <nav className="flex gap-6">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{ color: isActive ? 'var(--primary)' : undefined }}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            style={{ background: 'var(--secondary)' }}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
