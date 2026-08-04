import React from 'react';
import { cn } from '../../utils/helpers';
import { User, Sparkles } from 'lucide-react';

export const Avatar = ({
  role = 'user', // 'user' | 'assistant'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const isAssistant = role === 'assistant';

  return (
    <div
      className={cn(
        'relative rounded-full flex items-center justify-center shrink-0 border select-none overflow-hidden',
        sizeClasses[size],
        isAssistant
          ? 'bg-card-app border-border-app dark:border-white/10 shadow-sm dark:shadow-[0_0_10px_rgba(124,58,237,0.2)]'
          : 'bg-card-app border-border-app',
        className
      )}
      {...props}
    >
      {isAssistant ? (
        // Custom Voicifox Brand SVG Icon (Flame/Fox curvy shape)
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-[55%] h-[55%] text-text-app dark:text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ) : (
        <User className="w-[50%] h-[50%] text-muted-app" />
      )}

      {/* Decorative Glow Dot for Assistant */}
      {isAssistant && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-accent-app border-2 border-card-app" />
      )}
    </div>
  );
};

export default Avatar;
