import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export const GlassCard = ({
  children,
  className = '',
  hoverAnimation = false,
  glow = false,
  glowColor = 'primary', // 'primary' | 'accent' | 'secondary'
  onClick,
  ...props
}) => {
  const glowClasses = {
    primary: 'hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] focus:shadow-[0_0_20px_rgba(124,58,237,0.2)]',
    secondary: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] focus:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
    accent: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] focus:shadow-[0_0_20px_rgba(236,72,153,0.2)]',
  };

  const cardStyle = cn(
    'glass-effect rounded-2xl p-4 transition-all duration-300',
    glow && glowClasses[glowColor],
    onClick && 'cursor-pointer',
    className
  );

  if (hoverAnimation) {
    return (
      <motion.div
        className={cardStyle}
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardStyle} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;
