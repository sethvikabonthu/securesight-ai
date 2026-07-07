import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = '',
}) => {
  const configs = {
    success: {
      bgColor: 'bg-green-950/20 border-green-500/30 text-green-400',
      Icon: CheckCircle,
    },
    error: {
      bgColor: 'bg-red-950/20 border-red-500/30 text-red-400',
      Icon: AlertCircle,
    },
    warning: {
      bgColor: 'bg-yellow-950/20 border-yellow-500/30 text-yellow-400',
      Icon: AlertTriangle,
    },
    info: {
      bgColor: 'bg-cyber-navy border-cyber-cyan/30 text-cyber-cyan',
      Icon: Info,
    },
  };

  const { bgColor, Icon } = configs[type];

  return (
    <div className={`p-4 rounded-lg border flex items-start gap-3 ${bgColor} ${className}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        {title && <h5 className="font-semibold mb-1 text-white">{title}</h5>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
