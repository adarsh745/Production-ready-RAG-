import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, ShieldAlert } from 'lucide-react';

export const AccountStatus = ({ tier = 'Enterprise' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="relative rounded-3xl glass-effect p-6 border border-primary-app/40 shadow-[0_0_40px_rgba(124,58,237,0.25)] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Background Neon Pulse Effect */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-primary-app via-accent-app to-transparent rounded-full blur-2xl opacity-40 animate-pulse" />

      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary-app/20 text-primary-app border border-primary-app/40">
              <Crown size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-muted-app uppercase tracking-wider">AI Tier Status</h4>
              <h3 className="text-lg font-extrabold text-text-app">Active Subscription</h3>
            </div>
          </div>

          {/* Animated Neon Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary-app via-accent-app to-secondary-app text-white text-xs font-extrabold shadow-lg flex items-center gap-1.5 border border-white/20"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>🟣 {tier} User</span>
          </motion.div>
        </div>

        <p className="text-xs text-muted-app leading-relaxed">
          Full unlimited access to Hybrid Search (Vector + BM25), Cross-Encoder Re-ranking, OCR processing, and GPT-4o context synthesis.
        </p>
      </div>

      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-text-app relative z-10">
        <div className="flex items-center gap-1 text-emerald-400">
          <Zap size={13} />
          <span>Priority LLM Queue Active</span>
        </div>
        <button className="text-primary-app hover:text-accent-app font-bold transition-colors cursor-pointer">
          Manage Plan →
        </button>
      </div>
    </motion.div>
  );
};

export default AccountStatus;
