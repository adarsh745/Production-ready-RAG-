import React from 'react';
import { useChat } from '../../hooks/useChat';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import Tooltip from '../common/Tooltip';

export const SendButton = ({ disabled }) => {
  return (
    <Tooltip content="Send message" position="top">
      <motion.button
        type="submit"
        disabled={disabled}
        whileHover={disabled ? {} : { scale: 1.05, y: -1 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full transition-all select-none',
          disabled
            ? 'bg-white/[0.03] border border-white/5 text-muted-app/40 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary-app via-accent-app to-secondary-app text-white shadow-[0_0_15px_rgba(124,58,237,0.35)] hover:shadow-[0_0_20px_rgba(236,72,153,0.55)] cursor-pointer'
        )}
      >
        <ArrowUpRight size={16} strokeWidth={2.5} className="transform rotate-0" />
      </motion.button>
    </Tooltip>
  );
};

export default SendButton;
  
