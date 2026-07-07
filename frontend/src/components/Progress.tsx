import React from 'react';

interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'cyan' | 'green' | 'red' | 'purple';
  showValue?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  size = 'md',
  color = 'cyan',
  showValue = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    blue: 'bg-cyber-blue',
    cyan: 'bg-cyber-cyan',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
          {label && <span>{label}</span>}
          {showValue && <span>{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
