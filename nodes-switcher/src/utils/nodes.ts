/**
 * Конфигурация узлов платформы Balloo
 */

export interface Node {
  id: string;
  name: string;
  description: string;
  url: string;
  group: 'A' | 'B' | 'C' | 'D' | 'E';
  icon: string;
  color: string;
  priority: number;
}

export const nodes: Node[] = [
  // ==================== GROUP A (Core Infrastructure) ====================
  {
    id: 'api',
    name: 'API Gateway',
    description: 'Центральный API для всех узлов',
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    group: 'A',
    icon: '🔌',
    color: 'blue',
    priority: 1,
  },
  {
    id: 'android-service',
    name: 'Android Service',
    description: 'Backend для мобильных приложений',
    url: process.env.NEXT_PUBLIC_ANDROID_SERVICE_URL || 'http://localhost:3004',
    group: 'A',
    icon: '📱',
    color: 'green',
    priority: 2,
  },
  {
    id: 'android-sms-node',
    name: 'Android SMS Node',
    description: 'Отправка SMS через Android',
    url: process.env.NEXT_PUBLIC_SMS_NODE_URL || 'http://localhost:3005',
    group: 'A',
    icon: '💬',
    color: 'purple',
    priority: 3,
  },
  {
    id: 'kodegen',
    name: 'Kodegen',
    description: 'AI генерация кода',
    url: process.env.NEXT_PUBLIC_KODEGEN_URL || 'http://localhost:3009',
    group: 'A',
    icon: '🤖',
    color: 'indigo',
    priority: 4,
  },
  {
    id: 'alpha',
    name: 'Alpha',
    description: 'Экспериментальные функции',
    url: process.env.NEXT_PUBLIC_ALPHA_URL || 'http://localhost:3012',
    group: 'A',
    icon: '🧪',
    color: 'orange',
    priority: 5,
  },
  {
    id: 'future',
    name: 'Future',
    description: 'Будущие возможности',
    url: process.env.NEXT_PUBLIC_FUTURE_URL || 'http://localhost:3013',
    group: 'A',
    icon: '🔮',
    color: 'pink',
    priority: 6,
  },
  {
    id: 'platform-state',
    name: 'Platform State',
    description: 'Состояние платформы',
    url: process.env.NEXT_PUBLIC_STATE_URL || 'http://localhost:3015',
    group: 'A',
    icon: '📊',
    color: 'cyan',
    priority: 7,
  },

  // ==================== GROUP B (Service Nodes) ====================
  {
    id: 'admin-portal',
    name: 'Admin Portal',
    description: 'Администрирование платформы',
    url: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3003',
    group: 'B',
    icon: '⚙️',
    color: 'slate',
    priority: 8,
  },
  {
    id: 'workdocs',
    name: 'Workdocs',
    description: 'Документация проекта',
    url: process.env.NEXT_PUBLIC_DOCS_URL || 'http://localhost:3006',
    group: 'B',
    icon: '📚',
    color: 'amber',
    priority: 9,
  },
  {
    id: 'docs-site',
    name: 'Docs Site',
    description: 'Сайт документации',
    url: process.env.NEXT_PUBLIC_DOCS_SITE_URL || 'http://localhost:3014',
    group: 'B',
    icon: '📖',
    color: 'teal',
    priority: 10,
  },

  // ==================== GROUP C (Applications) ====================
  {
    id: 'media',
    name: 'Media Server',
    description: 'Обработка медиафайлов',
    url: process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:3010',
    group: 'C',
    icon: '🎬',
    color: 'red',
    priority: 11,
  },
  {
    id: 'desktop',
    name: 'Desktop App',
    description: 'Настольное приложение',
    url: process.env.NEXT_PUBLIC_DESKTOP_URL || 'http://localhost:3020',
    group: 'C',
    icon: '🖥️',
    color: 'gray',
    priority: 12,
  },
  {
    id: 'mobile',
    name: 'Mobile App',
    description: 'Мобильное приложение',
    url: process.env.NEXT_PUBLIC_MOBILE_URL || 'http://localhost:3021',
    group: 'C',
    icon: '📲',
    color: 'violet',
    priority: 13,
  },

  // ==================== GROUP D (Working/Sandbox) ====================
  {
    id: 'working',
    name: 'Working',
    description: 'Рабочая среда',
    url: process.env.NEXT_PUBLIC_WORKING_URL || 'http://localhost:3008',
    group: 'D',
    icon: '🛠️',
    color: 'yellow',
    priority: 14,
  },

  // ==================== GROUP E (Production) ====================
  {
    id: 'balloo-landing',
    name: 'Balloo Landing',
    description: 'Главная страница',
    url: process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3000',
    group: 'E',
    icon: '🎈',
    color: 'emerald',
    priority: 15,
  },
  {
    id: 'messenger',
    name: 'Messenger',
    description: 'Мессенджер для общения',
    url: process.env.NEXT_PUBLIC_MESSENGER_URL || 'http://localhost:3002',
    group: 'E',
    icon: '💬',
    color: 'sky',
    priority: 16,
  },
];

export function getNodeById(id: string): Node | undefined {
  return nodes.find(node => node.id === id);
}

export function getNodesByGroup(group: string): Node[] {
  return nodes.filter(node => node.group === group);
}

export function getOnlineNodes(): Node[] {
  // В реальной реализации проверка через health check
  return nodes;
}

export function getNodesByPriority(limit: number): Node[] {
  return [...nodes]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit);
}

export function searchNodes(query: string): Node[] {
  const q = query.toLowerCase();
  return nodes.filter(
    node =>
      node.name.toLowerCase().includes(q) ||
      node.description.toLowerCase().includes(q)
  );
}
