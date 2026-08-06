import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Sparkles } from 'lucide-react';

export const EmbeddingAnimation = ({ progress = 0 }) => {
  // 5 Neural Nodes coordinates
  const nodes = [
    { id: 1, x: 20, y: 30 },
    { id: 2, x: 20, y: 70 },
    { id: 3, x: 50, y: 50 },
    { id: 4, x: 80, y: 30 },
    { id: 5, x: 80, y: 70 },
  ];

  return (
    <div className="relative w-full h-36 flex flex-col items-center justify-center overflow-hidden my-2 select-none">
      
      {/* Node Graph Vector Canvas */}
      <div className="relative w-64 h-24">
        
        {/* SVG Connecting Vector Rays */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.path
            d="M 20% 30% L 50% 50% L 80% 30%"
            stroke="url(#vector-beam-1)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
          />
          <motion.path
            d="M 20% 70% L 50% 50% L 80% 70%"
            stroke="url(#vector-beam-2)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
          />
          <defs>
            <linearGradient id="vector-beam-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="vector-beam-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>

        {/* Neural Network Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            animate={{
              scale: [1, 1.25, 1],
              boxShadow: [
                '0 0 10px rgba(124,58,237,0.3)',
                '0 0 25px rgba(236,72,153,0.6)',
                '0 0 10px rgba(124,58,237,0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: node.id * 0.2 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-card-app border-2 border-primary-app flex items-center justify-center shadow-lg z-10"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <Cpu size={12} className="text-accent-app" />
          </motion.div>
        ))}

        {/* Center Pulsing Sparkle */}
        <motion.div
          animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <Sparkles size={20} className="text-secondary-app" />
        </motion.div>

      </div>

      {/* Embedding Percentage Display */}
      <div className="px-3 py-1 rounded-full glass-effect border border-white/10 text-xs font-mono font-bold text-text-app shadow-lg">
        Vector Embedding: <span className="text-primary-app">{progress}%</span>
      </div>

    </div>
  );
};

export default EmbeddingAnimation;
