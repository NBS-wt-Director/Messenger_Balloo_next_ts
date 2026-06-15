/**
 * NodeGrid Component
 * Сетка узлов
 */

import { ReactNode } from 'react';

interface NodeGridProps {
  children: ReactNode;
}

export function NodeGrid({ children }: NodeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}
