import React from 'react';
import { cn } from '../../utils/helpers';

export const Badge = ({
  children,
  className = '',
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'glow' | 'gradient'
  ...props
}) => {
  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold leading-none tracking-wide select-none';

  const variants = {
    primary: 'bg-primary-app/20 text-primary-app border border-primary-app/30',
    secondary: 'bg-secondary-app/20 text-secondary-app border border-secondary-app/30',
    accent: 'bg-accent-app/20 text-accent-app border border-accent-app/30',
    gradient: 'bg-gradient-to-r from-primary-app to-accent-app text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]',
    glow: 'bg-white/[0.04] text-text-app border border-white/10 shadow-[0_0_8px_rgba(255,255,255,0.05)]'
  };

  return (
    <span className={cn(baseClasses, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;
