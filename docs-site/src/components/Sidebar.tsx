'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    href: '/docs',
    children: [
      { title: 'Overview', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Configuration', href: '/docs/configuration' },
    ],
  },
  {
    title: 'Architecture',
    href: '/docs/architecture',
    children: [
      { title: 'Overview', href: '/docs/architecture' },
      { title: 'Monorepo', href: '/docs/architecture/monorepo' },
      { title: 'Tech Stack', href: '/docs/architecture/tech-stack' },
    ],
  },
  {
    title: 'API Reference',
    href: '/docs/api',
    children: [
      { title: 'Overview', href: '/docs/api' },
      { title: 'Authentication', href: '/docs/api/auth' },
      { title: 'Messages', href: '/docs/api/messages' },
      { title: 'Chats', href: '/docs/api/chats' },
    ],
  },
  {
    title: 'Guides',
    href: '/docs/guides',
    children: [
      { title: 'Deployment', href: '/docs/deployment' },
      { title: 'Testing', href: '/docs/testing' },
      { title: '2FA Setup', href: '/docs/2fa' },
    ],
  },
  {
    title: 'Migration',
    href: '/migration',
    children: [
      { title: 'Overview', href: '/migration' },
      { title: 'Phase 1-8', href: '/migration/phases' },
      { title: 'Phase 9', href: '/migration/phase-9' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 h-screen sticky top-0">
      <div className="p-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.title}
              </Link>
              {item.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-3 py-1.5 text-sm rounded-md ${
                        pathname === child.href
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
