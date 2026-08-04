import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export const GlowButton = ({
  children,
  className = '',
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'gradient' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  glow = true,
  onClick,
  disabled = false,
  type = 'button',
  iconBefore,
  iconAfter,
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 select-none overflow-hidden';
  
  const variants = {
    primary: 'bg-primary-app hover:bg-primary-app/90 text-white border border-white/10',
    secondary: 'bg-secondary-app hover:bg-secondary-app/90 text-white border border-white/10',
    accent: 'bg-accent-app hover:bg-accent-app/90 text-white border border-white/10',
    gradient: 'bg-gradient-to-r from-primary-app via-accent-app to-secondary-app text-white border border-transparent shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-shadow duration-300 font-semibold',
    ghost: 'bg-white/[0.03] hover:bg-white/[0.08] text-text-app border border-white/[0.08] hover:border-white/[0.15]'
  };

  const glows = {
    primary: 'shadow-[0_0_15px_rgba(124,58,237,0.25)] hover:shadow-[0_0_25px_rgba(124,58,237,0.45)]',
    secondary: 'shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:shadow-[0_0_25px_rgba(59,130,246,0.45)]',
    accent: 'shadow-[0_0_15px_rgba(236,72,153,0.25)] hover:shadow-[0_0_25px_rgba(236,72,153,0.45)]',
    gradient: 'shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]',
    ghost: 'hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        glow && glows[variant],
        disabled && disabledClasses,
        className
      )}
      {...props}
    >
      {/* Glossy Overlay for Gradient buttons */}
      {variant === 'gradient' && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-t from-white/0 to-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {iconBefore && <span className="flex items-center justify-center shrink-0">{iconBefore}</span>}
      {children}
      {iconAfter && <span className="flex items-center justify-center shrink-0">{iconAfter}</span>}
    </motion.button>
  );
};

export default GlowButton;
