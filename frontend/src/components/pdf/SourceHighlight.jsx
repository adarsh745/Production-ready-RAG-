import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const SourceHighlight = ({ snippet = '', page = 1, chunkId = null, onScrollIntoView }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (onScrollIntoView) onScrollIntoView();
    }
  }, [snippet, page]);

  if (!snippet) return null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative my-3 p-4 rounded-2xl bg-yellow-400/15 border border-yellow-400/40 text-yellow-100 shadow-[0_0_25px_rgba(234,179,8,0.25)] overflow-hidden select-text"
    >
      {/* Soft Animated Yellow Glowing Background Layer */}
      <div className="absolute inset-0 rounded-2xl bg-yellow-400/5 pointer-events-none animate-pulse" />

      {/* Header Accent */}
      <div className="flex items-center justify-between gap-2 mb-2 select-none">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
            <Sparkles size={12} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-yellow-300">
            Matched AI Citation (Page {page} {chunkId ? `• Chunk ${chunkId}` : ''})
          </span>
        </div>

        <div className="px-2 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-[9px] font-extrabold text-yellow-300 uppercase tracking-widest">
          Active Highlight
        </div>
      </div>

      {/* Soft Translucent Yellow Highlighted Text Snippet Box */}
      <p className="text-xs text-yellow-100 font-sans leading-relaxed relative z-10 bg-yellow-400/20 p-3 rounded-xl border border-yellow-400/40 font-medium shadow-inner">
        "{snippet}"
      </p>
    </motion.div>
  );
};

export default SourceHighlight;
