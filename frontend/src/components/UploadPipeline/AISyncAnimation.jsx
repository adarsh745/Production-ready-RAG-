import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Network, CheckCircle2 } from 'lucide-react';

export const AISyncAnimation = () => {
  return (
    <div className="relative w-full h-36 flex flex-col items-center justify-center overflow-hidden my-2 select-none">
      
      {/* OpenAI Neural Hub */}
      <div className="relative w-48 h-24 flex items-center justify-center">
        
        {/* Glow Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent-app/30 via-primary-app/30 to-secondary-app/30 blur-2xl animate-pulse" />

        {/* Orbit Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute w-28 h-28 rounded-full border border-dashed border-primary-app/40"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-app shadow-[0_0_10px_#EC4899]" />
        </motion.div>

        {/* AI Brain Icon Hub */}
        <motion.div
          animate={{ scale: [0.95, 1.08, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 p-5 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#EC4899] p-[1px] shadow-[0_0_30px_rgba(124,58,237,0.4)]"
        >
          <div className="p-4 rounded-[15px] bg-card-app flex items-center justify-center">
            <Bot size={32} className="text-primary-app animate-bounce" />
          </div>
        </motion.div>

      </div>

      {/* Sync Badge */}
      <div className="px-3 py-1 rounded-full glass-effect border border-white/10 text-xs font-mono font-bold text-text-app shadow-lg flex items-center gap-1.5">
        <Sparkles size={12} className="text-accent-app" />
        <span>Connected to OpenAI LLM</span>
      </div>

    </div>
  );
};

export default AISyncAnimation;
