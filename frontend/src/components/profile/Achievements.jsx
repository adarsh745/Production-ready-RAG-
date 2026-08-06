import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Sparkles, BookOpen, MessageSquare, Zap, Brain, Rocket } from 'lucide-react';

export const Achievements = () => {
  const badgeItems = [
    {
      id: 'first-doc',
      title: 'First Document Uploaded',
      icon: Trophy,
      emoji: '🏆',
      desc: 'Successfully indexed your first PDF into ChromaDB vector store.',
      unlocked: true,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-300',
    },
    {
      id: '100-docs',
      title: '100 Documents',
      icon: BookOpen,
      emoji: '📚',
      desc: 'Processed over 100 enterprise document knowledge bases.',
      unlocked: true,
      color: 'from-blue-500/20 to-indigo-600/10 border-blue-500/40 text-blue-300',
    },
    {
      id: '1000-qs',
      title: '1000 Questions',
      icon: MessageSquare,
      emoji: '💬',
      desc: 'Executed over 1,000 contextual RAG prompt queries.',
      unlocked: true,
      color: 'from-purple-500/20 to-pink-600/10 border-purple-500/40 text-purple-300',
    },
    {
      id: 'ocr-expert',
      title: 'OCR Expert',
      icon: Zap,
      emoji: '⚡',
      desc: 'Extracted text from scanned documents using Tesseract OCR.',
      unlocked: true,
      color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/40 text-emerald-300',
    },
    {
      id: 'ai-power',
      title: 'AI Power User',
      icon: Brain,
      emoji: '🧠',
      desc: 'Mastered Multi-Document Chat and Hybrid RAG Search.',
      unlocked: true,
      color: 'from-pink-500/20 to-rose-600/10 border-pink-500/40 text-pink-300',
    },
    {
      id: 'enterprise-member',
      title: 'Enterprise Member',
      icon: Rocket,
      emoji: '🚀',
      desc: 'Activated top-tier Enterprise RAG API access.',
      unlocked: true,
      color: 'from-violet-500/20 to-purple-600/10 border-violet-500/40 text-violet-300',
    },
  ];

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-app uppercase tracking-wider flex items-center gap-1.5">
          <Award size={15} className="text-primary-app" />
          <span>Platform Achievements ({badgeItems.length})</span>
        </h3>
        <span className="text-[10px] text-muted-app font-mono">100% Unlocked</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {badgeItems.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.05 * idx }}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`relative p-3.5 rounded-2xl bg-gradient-to-br ${badge.color} border shadow-lg flex flex-col items-center text-center space-y-1.5 cursor-pointer group overflow-hidden`}
          >
            {/* Glowing Hover Background Effect */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="text-2xl group-hover:scale-125 transition-transform duration-300">
              {badge.emoji}
            </div>

            <h4 className="text-xs font-bold text-text-app line-clamp-1 group-hover:text-primary-app transition-colors">
              {badge.title}
            </h4>

            {/* Hover Tooltip Popup */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2.5 rounded-xl glass-effect border border-white/20 text-[10px] text-text-app shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-30 text-center">
              <span className="font-bold block mb-0.5 text-primary-app">{badge.title}</span>
              {badge.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
