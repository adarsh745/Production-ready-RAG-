import React from 'react';
import { cn } from '../../utils/helpers';

export const GradientText = ({
  children,
  className = '',
  variant = 'primary', // 'primary' | 'accent' | 'secondary' | 'purple-pink' | 'metallic' | 'serif-italic'
  ...props
}) => {
  const gradients = {
    primary: 'from-primary-app to-secondary-app',
    secondary: 'from-secondary-app to-accent-app',
    accent: 'from-accent-app to-primary-app',
    'purple-pink': 'from-primary-app via-accent-app to-pink-500',
    metallic: 'from-slate-200 via-slate-400 to-slate-200',
    'serif-italic': 'from-[#6B7280] via-[#9333EA]/70 to-[#111827]/95 dark:from-[#94A3B8] dark:via-[#EC4899]/70 dark:to-[#F8FAFC]/90 font-serif italic font-light'
  };

  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent inline-block',
        gradients[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default GradientText;
