/**
 * Balloo Kodegen
 * AI генерация кода для платформы
 */

'use client';

import { useState } from 'react';

interface GeneratedCode {
  id: string;
  language: string;
  code: string;
  description: string;
  timestamp: string;
}

const templates = [
  { id: 'api-route', name: 'API Route', description: 'REST API endpoint' },
  { id: 'react-component', name: 'React Component', description: 'Functional component' },
  { id: 'typescript-interface', name: 'TypeScript Interface', description: 'Type definition' },
  { id: 'database-model', name: 'Database Model', description: 'Prisma/Sequelize model' },
  { id: 'dockerfile', name: 'Dockerfile', description: 'Container configuration' },
  { id: 'test-file', name: 'Test File', description: 'Jest/Vitest test' },
];

export default function KodegenPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [history, setHistory] = useState<GeneratedCode[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Введите описание кода');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Имитация AI генерации (в реальности - вызов API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const code = generateMockCode(prompt, selectedTemplate);
      
      const result: GeneratedCode = {
        id: Date.now().toString(),
        language: getLanguage(selectedTemplate),
        code,
        description: prompt,
        timestamp: new Date().toISOString(),
      };

      setGeneratedCode(result);
      setHistory(prev => [result, ...prev].slice(0, 10));
    } catch {
      setError('Ошибка генерации кода');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode.code);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🤖 Balloo Kodegen
              </h1>
              <p className="text-gray-400 mt-1">
                AI генерация кода
              </p>
            </div>
            <div className="text-sm text-gray-500">
              v1.0.0
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Описание кода
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Например: создай REST API endpoint для получения пользователя по ID"
                className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            {/* Template Selection */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Шаблон (опционально)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      selectedTemplate === template.id
                        ? 'bg-purple-600 border-purple-500'
                        : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-sm font-medium text-white">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Генерация...
                </span>
              ) : (
                '🚀 Сгенерировать код'
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {/* Generated Code */}
            {generatedCode ? (
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">
                      {generatedCode.language}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    📋 Копировать
                  </button>
                </div>
                <pre className="p-6 overflow-x-auto">
                  <code className="text-sm text-gray-300">
                    {generatedCode.code}
                  </code>
                </pre>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                <div className="text-6xl mb-4">💻</div>
                <p className="text-gray-400">
                  Сгенерированный код появится здесь
                </p>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  История
                </h3>
                <div className="space-y-3">
                  {history.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setGeneratedCode(item)}
                      className="w-full text-left p-3 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="text-sm text-white truncate">
                        {item.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.language} • {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function generateMockCode(prompt: string, template: string): string {
  const codeTemplates: Record<string, string> = {
    'api-route': `import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/resource
 * Получение ресурса по ID
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // TODO: Реализуйте логику получения ресурса
    const resource = await getResourceById(id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Resource not found' }
      });
    }
    
    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
    });
  }
});

export { router as resourceRoutes };`,

    'react-component': `'use client';

import { useState, useEffect } from 'react';

interface ComponentProps {
  title: string;
  onDataLoad?: (data: any) => void;
}

export function GeneratedComponent({ title, onDataLoad }: ComponentProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
        onDataLoad?.(result);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onDataLoad]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}`,

    'typescript-interface': `/**
 * Интерфейс для пользователя
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
}

/**
 * Интерфейс для сообщения
 */
export interface Message {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  read: boolean;
  createdAt: string;
  user?: User;
}

/**
 * Интерфейс для чата
 */
export interface Chat {
  id: string;
  name?: string;
  type: 'private' | 'group';
  members: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}`,

    'database-model': `import { Prisma } from '@prisma/client';

export const User = Prisma.validator<Prisma.UserArgs>()({
  include: {
    chats: true,
    messages: true,
    sessions: true,
  },
});

export type UserWithRelations = Prisma.UserGetPayload<typeof User>;

export const Chat = Prisma.validator<Prisma.ChatArgs>()({
  include: {
    members: true,
    messages: {
      take: 1,
      orderBy: { createdAt: 'desc' },
    },
  },
});

export type ChatWithRelations = Prisma.ChatGetPayload<typeof Chat>;

export const Message = Prisma.validator<Prisma.MessageArgs>()({
  include: {
    user: true,
    chat: true,
    reactions: true,
  },
});

export type MessageWithRelations = Prisma.MessageGetPayload<typeof Message>;`,

    'dockerfile': `FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY npm-lock.yaml* ./

RUN npm ci --only=production

COPY . .

RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER node

CMD ["node", "dist/index.js"]`,

    'test-file': `import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../services/user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const userId = 'test-user-id';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        displayName: 'Test User',
      };

      // Mock implementation
      const getUser = vi.spyOn(service, 'getUserById');
      getUser.mockResolvedValue(mockUser);

      const result = await service.getUserById(userId);

      expect(result).toEqual(mockUser);
      expect(getUser).toHaveBeenCalledWith(userId);
    });

    it('should throw error if user not found', async () => {
      await expect(service.getUserById('invalid-id'))
        .rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create new user', async () => {
      const userData = {
        email: 'new@example.com',
        displayName: 'New User',
        password: 'password123',
      };

      const result = await service.createUser(userData);

      expect(result.email).toBe(userData.email);
      expect(result.id).toBeDefined();
    });
  });
});`,
  };

  // Выбор шаблона или генерация на основе prompt
  if (template && codeTemplates[template]) {
    return codeTemplates[template];
  }

  // Генерация на основе ключевых слов в prompt
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('api') || lowerPrompt.includes('endpoint') || lowerPrompt.includes('route')) {
    return codeTemplates['api-route'];
  }
  if (lowerPrompt.includes('react') || lowerPrompt.includes('component')) {
    return codeTemplates['react-component'];
  }
  if (lowerPrompt.includes('interface') || lowerPrompt.includes('type')) {
    return codeTemplates['typescript-interface'];
  }
  if (lowerPrompt.includes('database') || lowerPrompt.includes('model') || lowerPrompt.includes('prisma')) {
    return codeTemplates['database-model'];
  }
  if (lowerPrompt.includes('docker') || lowerPrompt.includes('container')) {
    return codeTemplates['dockerfile'];
  }
  if (lowerPrompt.includes('test') || lowerPrompt.includes('spec')) {
    return codeTemplates['test-file'];
  }

  // Default
  return codeTemplates['api-route'];
}

function getLanguage(template: string): string {
  const languages: Record<string, string> = {
    'api-route': 'TypeScript',
    'react-component': 'TypeScript React',
    'typescript-interface': 'TypeScript',
    'database-model': 'TypeScript Prisma',
    'dockerfile': 'Dockerfile',
    'test-file': 'TypeScript Vitest',
  };
  return languages[template] || 'Code';
}
