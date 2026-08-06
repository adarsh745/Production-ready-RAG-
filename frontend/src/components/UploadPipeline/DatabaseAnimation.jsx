import React from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, HardDrive, Shield } from 'lucide-react';

export const DatabaseAnimation = ({ type = 'chromadb', label = 'ChromaDB Vector Store' }) => {
  const isPostgres = type === 'postgres';

  return (
    <div className="relative w-full h-36 flex flex-col items-center justify-center overflow-hidden my-2 select-none">
      
      {/* 3D Database Cylinders & Beam Effects */}
      <div className="relative w-48 h-24 flex items-center justify-center">
        
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-app/20 to-secondary-app/20 blur-2xl animate-pulse" />

        {/* Outer Pulsing Ring */}
        <motion.div
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-24 h-24 rounded-full border border-primary-app/40"
        />

        {/* Database Icon Vessel */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 p-5 rounded-2xl bg-gradient-to-br from-card-app via-slate-900 to-card-app border border-white/20 shadow-2xl flex items-center justify-center"
        >
          {isPostgres ? (
            <HardDrive size={36} className="text-secondary-app" />
          ) : (
            <Database size={36} className="text-primary-app" />
          )}

          {/* Lightning Flash Accent */}
          <motion.div
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-2 -right-2 p-1.5 rounded-full bg-accent-app/20 border border-accent-app/40 text-accent-app"
          >
            <Zap size={14} />
          </motion.div>
        </motion.div>

      </div>

      {/* Database Label */}
      <div className="px-3 py-1 rounded-full glass-effect border border-white/10 text-xs font-mono font-bold text-text-app shadow-lg flex items-center gap-1.5">
        <Shield size={12} className="text-primary-app" />
        <span>{label}</span>
      </div>

    </div>
  );
};

export default DatabaseAnimation;
