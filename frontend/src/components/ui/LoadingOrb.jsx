import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export const LoadingOrb = ({
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  pulsing = true,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 md:w-28 md:h-28',
    lg: 'w-36 h-36 md:w-44 md:h-44'
  };

  return (
    <div className={cn('relative flex items-center justify-center select-none', className)} {...props}>
      {/* Outer Neon Glow Aura */}
      <motion.div
        className={cn(
          'absolute rounded-full filter blur-3xl opacity-20 dark:opacity-60 bg-gradient-to-r from-primary-app via-accent-app to-secondary-app',
          sizeClasses[size]
        )}
        animate={pulsing ? {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Second Glow Layer (Opposing color overlay) */}
      <motion.div
        className={cn(
          'absolute rounded-full filter blur-2xl opacity-10 dark:opacity-40 bg-gradient-to-tr from-secondary-app via-indigo-500 to-pink-500',
          sizeClasses[size]
        )}
        animate={pulsing ? {
          scale: [1.1, 0.9, 1.1],
          rotate: [0, 360],
        } : {}}
        transition={{
          scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 15, repeat: Infinity, ease: 'linear' }
        }}
      />

      {/* Main 3D Spherical Orb Container */}
      <motion.div
        className={cn(
          'relative rounded-full shadow-[inset_0_-8px_20px_rgba(0,0,0,0.6),inset_0_12px_20px_rgba(255,255,255,0.4),0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10',
          sizeClasses[size]
        )}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Animated fluid gradient inside the orb */}
        <motion.div
          className="absolute inset-[-50%] bg-[radial-gradient(circle_at_30%_30%,#EC4899_0%,#7C3AED_30%,#3B82F6_70%,#09090B_100%)]"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Gloss highlight reflection to make it 3D */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 rounded-full pointer-events-none" />
        <div className="absolute top-[8%] left-[15%] w-[35%] h-[20%] bg-gradient-to-b from-white/30 to-transparent rounded-full filter blur-[1px] rotate-[-25deg] pointer-events-none" />
      </motion.div>
    </div>
  );
};

export default LoadingOrb;
