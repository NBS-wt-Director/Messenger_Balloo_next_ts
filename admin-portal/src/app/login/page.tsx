'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { authApi } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setToken } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(email, password);
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Проверка на права администратора
        if (!user.isAdmin && !user.isSuperAdmin) {
          setError('У вас нет прав администратора');
          setLoading(false);
          return;
        }

        setToken(token);
        setUser(user);
        
        router.push('/admin');
      } else {
        setError(response.error?.message || 'Ошибка входа');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="admin-card">
          <div className="text-center mb-8">
            <Shield size={48} className="text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Admin Portal</h1>
            <p className="text-slate-400">App Balloo - NBS w-t</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@balloo.ru"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Пароль</label>
              <input
                type="password"
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 text-center text-sm text-slate-400">
            <p>Доступно только для администраторов</p>
          </div>
        </div>
      </div>
    </div>
  );
}
