import React from 'react';
import { useChat } from '../../hooks/useChat';
import { Mic, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import Tooltip from '../common/Tooltip';

export const VoiceButton = () => {
  const { isVoiceActive, setIsVoiceActive } = useChat();

  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  return (
    <Tooltip content={isVoiceActive ? 'Stop dictation' : 'Voice input'} position="top">
      <button
        type="button"
        onClick={toggleVoice}
        className={cn(
          'relative flex items-center justify-center w-8 h-8 rounded-full border transition-all active:scale-95 z-10',
          isVoiceActive
            ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
            : 'bg-white/[0.03] border-white/10 text-muted-app hover:text-white hover:bg-white/[0.08]'
        )}
      >
        {/* Bouncing radar rings on voice active */}
        {isVoiceActive && (
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border border-red-500/40 pointer-events-none"
          />
        )}

        {isVoiceActive ? (
          <Square size={12} className="fill-red-400" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a6.5 6.5 0 01-6.5-6.5h13a6.5 6.5 0 01-6.5 6.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 8.5h8" />
          </svg>
        )}
      </button>
    </Tooltip>
  );
};

export default VoiceButton;
