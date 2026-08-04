import React from 'react';
import { cn } from '../../utils/helpers';

export const GlowBorder = ({
  children,
  className = '',
  containerClassName = '',
  glowColor = 'primary', // 'primary' | 'accent' | 'secondary' | 'multi'
  focused = false,
  ...props
}) => {
  const glowGradients = {
    primary: 'from-primary-app/40 to-transparent',
    secondary: 'from-secondary-app/40 to-transparent',
    accent: 'from-accent-app/40 to-transparent',
    multi: 'from-primary-app via-accent-app to-secondary-app',
  };

  return (
    <div className={cn('relative p-[1px] rounded-2xl overflow-hidden transition-all duration-500', containerClassName)} {...props}>
      {/* Dynamic Background Glow Layer */}
      <div
        className={cn(
          'absolute -inset-10 bg-gradient-to-r opacity-0 transition-opacity duration-500 blur-2xl pointer-events-none z-0',
          glowGradients[glowColor],
          (focused || glowColor === 'multi') && 'opacity-60 animate-pulse-slow'
        )}
      />

      {/* Shifting Gradient Border Line */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r transition-opacity duration-500 z-0',
          glowGradients[glowColor],
          focused ? 'opacity-100' : 'opacity-20'
        )}
      />

      {/* Internal Content (Pulls overlay back to hide center border glow) */}
      <div className={cn('relative z-10 w-full h-full bg-bg-app rounded-[15px]', className)}>
        {children}
      </div>
    </div>
  );
};

export default GlowBorder;
