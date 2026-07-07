import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'cyber' | 'normal';
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  glow = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'rounded-xl overflow-hidden transition-all duration-300';
  
  const variants = {
    glass: 'glass-panel border border-white/5',
    cyber: 'bg-cyber-navy border border-cyber-cyan/20 hover:border-cyber-cyan/40 shadow-glow-cyan/5',
    normal: 'bg-slate-900 border border-slate-800',
  };

  const glowStyle = glow ? 'shadow-glow-blue/15 hover:shadow-glow-blue/25' : '';

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${glowStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-5 border-b border-white/5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-white tracking-wide flex items-center gap-2 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);
