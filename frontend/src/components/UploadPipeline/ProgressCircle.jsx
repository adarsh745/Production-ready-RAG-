import React from 'react';
import { motion } from 'framer-motion';

export const ProgressCircle = ({ progress = 0, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      
      {/* Background Outer Ambient Pulsing Glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7C3AED]/30 via-[#EC4899]/20 to-[#3B82F6]/30 blur-xl pointer-events-none"
      />

      {/* SVG Radial Meter */}
      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        {/* Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border-app/40 fill-none"
        />

        {/* Animated Progress Gradient Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="fill-none"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />

        {/* Define Gradient */}
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-xl font-bold text-text-app tracking-tight font-mono">
          {Math.round(progress)}%
        </span>
        <span className="text-[9px] uppercase tracking-wider text-muted-app font-semibold">
          Pipeline
        </span>
      </div>

    </div>
  );
};

export default ProgressCircle;
