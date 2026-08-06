import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UploadSuccess = ({ documentId, filename, pages, chunks, onStartChat }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onStartChat) onStartChat();
          else navigate('/chat');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, onStartChat]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-6 space-y-5 select-none"
    >
      {/* Ambient Radial Green Glow */}
      <div className="absolute w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />

      {/* Animated Success Checkmark Ring */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 p-[2px] shadow-[0_0_40px_rgba(16,185,129,0.4)] flex items-center justify-center"
      >
        <div className="w-full h-full bg-[#09090B] rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} className="text-emerald-400" />
        </div>
      </motion.div>

      {/* Title & Document Badge */}
      <div className="space-y-1 z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-text-app tracking-tight flex items-center justify-center gap-2">
          <span>Document Ready</span>
          <Sparkles size={18} className="text-emerald-400" />
        </h2>
        <p className="text-xs text-muted-app font-medium">
          "{filename || 'Uploaded Document'}" successfully indexed ({pages || 1} pages, {chunks || 1} chunks)
        </p>
      </div>

      {/* Action Button & Countdown */}
      <div className="z-10 w-full max-w-xs space-y-3 pt-2">
        <button
          onClick={() => (onStartChat ? onStartChat() : navigate('/chat'))}
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:opacity-95 shadow-[0_4px_20px_rgba(16,185,129,0.35)] transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageSquare size={16} />
          <span>Ask Questions Now</span>
          <ArrowRight size={16} />
        </button>

        <p className="text-[11px] text-muted-app">
          Redirecting to chat automatically in <span className="font-mono font-bold text-emerald-400">{countdown}s</span>...
        </p>
      </div>
    </motion.div>
  );
};

export default UploadSuccess;
