import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, FileText } from 'lucide-react';

export const FloatingChunks = ({ currentChunk = 0, totalChunks = 126 }) => {
  // Generate array of 6 3D floating blocks representing semantic chunks
  const blocks = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="relative w-full h-40 flex items-center justify-center overflow-hidden my-2 select-none perspective-[800px]">
      
      {/* Central Split Node Canvas */}
      <div className="relative w-48 h-32 flex items-center justify-center preserve-3d">
        
        {/* Source Document Base */}
        <motion.div
          animate={{ rotateY: [-10, 10, -10], rotateX: [5, -5, 5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-2 w-20 h-24 rounded-2xl bg-gradient-to-tr from-[#7C3AED]/80 to-[#3B82F6]/80 p-2.5 border border-white/20 shadow-2xl backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <FileText size={16} className="text-white" />
            <div className="w-2 h-2 rounded-full bg-accent-app animate-ping" />
          </div>
          <div className="space-y-1">
            <div className="w-full h-1 rounded bg-white/40" />
            <div className="w-3/4 h-1 rounded bg-white/40" />
            <div className="w-1/2 h-1 rounded bg-white/40" />
          </div>
        </motion.div>

        {/* 3D Floating Chunks Stream */}
        <div className="absolute right-0 w-24 h-full flex flex-col items-center justify-center gap-2">
          {blocks.map((blockIdx) => {
            const isEmitted = currentChunk > blockIdx * Math.max(1, Math.floor(totalChunks / 6));
            return (
              <motion.div
                key={blockIdx}
                initial={{ opacity: 0, x: -30, scale: 0.5 }}
                animate={
                  isEmitted
                    ? {
                        opacity: [0.7, 1, 0.7],
                        x: [0, 15, 0],
                        y: [blockIdx * 4 - 10, blockIdx * 4 - 15, blockIdx * 4 - 10],
                        scale: 1,
                        rotateZ: blockIdx * 3 - 8,
                      }
                    : { opacity: 0.2, x: -20, scale: 0.6 }
                }
                transition={{
                  duration: 2 + blockIdx * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-16 h-4 rounded-lg bg-gradient-to-r from-primary-app/60 to-accent-app/60 border border-white/20 shadow-lg backdrop-blur-md flex items-center justify-between px-2 text-[9px] text-white font-mono"
              >
                <Layers size={10} className="text-accent-app" />
                <span>#{blockIdx + 1}</span>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Chunk Count Display Overlay */}
      <div className="absolute bottom-1 px-3 py-1 rounded-full glass-effect border border-white/10 text-xs font-mono font-bold text-text-app shadow-lg">
        Chunk: <span className="text-primary-app">{currentChunk}</span> / <span className="text-accent-app">{totalChunks}</span>
      </div>

    </div>
  );
};

export default FloatingChunks;
