/**
 * StatusBadge Component
 * Индикатор статуса узлов
 */

interface StatusBadgeProps {
  online: number;
  total: number;
}

export function StatusBadge({ online, total }: StatusBadgeProps) {
  const percentage = Math.round((online / total) * 100);
  
  let statusColor = 'red';
  if (percentage >= 80) statusColor = 'green';
  else if (percentage >= 50) statusColor = 'yellow';

  const colorClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-700 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    red: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className={`px-4 py-2 rounded-lg border ${colorClasses[statusColor]}`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          statusColor === 'green' ? 'bg-green-500 animate-pulse' :
          statusColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>
        <span className="font-medium">
          {online}/{total} узлов онлайн
        </span>
        <span className="text-sm opacity-75">
          ({percentage}%)
        </span>
      </div>
    </div>
  );
}
