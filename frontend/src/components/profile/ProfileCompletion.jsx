import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const ProfileCompletion = ({ percentage = 92 }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative rounded-3xl glass-effect p-6 border border-white/15 shadow-xl flex items-center justify-between gap-4 overflow-hidden select-none"
    >
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary-app uppercase tracking-wider">
          <Sparkles size={13} />
          <span>Profile Setup Progress</span>
        </div>
        <h3 className="text-lg font-bold text-text-app">Profile Completion</h3>
        <p className="text-xs text-muted-app leading-relaxed">
          Your account is <span className="text-primary-app font-bold">{percentage}%</span> configured. Add phone & 2FA to reach 100%!
        </p>

        {/* Progress bar status */}
        <div className="flex items-center gap-3 pt-2 text-[11px] font-semibold text-muted-app">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 size={12} /> {percentage}% Completed
          </span>
          <span>•</span>
          <span className="text-amber-400">{100 - percentage}% Remaining</span>
        </div>
      </div>

      {/* Animated Circular SVG Progress Ring */}
      <div className="relative shrink-0 w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="text-white/10 stroke-current"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated Foreground Arc */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            className="text-primary-app stroke-current"
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-extrabold text-text-app tracking-tight">{percentage}%</span>
        </div>
      </div>

    </motion.div>
  );
};

export default ProfileCompletion;
