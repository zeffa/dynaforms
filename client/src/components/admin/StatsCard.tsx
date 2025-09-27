import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple';
  loading?: boolean;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    value: 'text-blue-900',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    value: 'text-green-900',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    value: 'text-purple-900',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  loading = false,
}) => {
  const colors = colorMap[color];
  
  return (
    <div className={`${colors.bg} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${colors.text} text-sm font-medium`}>{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className={`${colors.value} text-2xl font-bold`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${colors.bg} bg-opacity-50`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
