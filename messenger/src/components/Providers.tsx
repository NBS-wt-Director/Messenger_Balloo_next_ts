

'use client';

import { ReactNode } from 'react';
import { PWAInstall } from '@/components/PWAInstall';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <PWAInstall />
    </>
  );
}

