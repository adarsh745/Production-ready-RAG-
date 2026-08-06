import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Layers, Grid, Cpu, HardDrive } from 'lucide-react';

const formatBytes = (bytes = 0) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const DocumentStats = ({ stats = {} }) => {
  const statCards = [
    {
      title: 'Total Documents',
      value: stats.total_documents || 0,
      icon: FileText,
      color: 'from-purple-500 to-indigo-500',
      badge: 'All Files',
    },
    {
      title: 'Indexed Documents',
      value: stats.indexed_documents || 0,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Ready for RAG',
    },
    {
      title: 'Total Pages',
      value: stats.total_pages || 0,
      icon: Layers,
      color: 'from-blue-500 to-cyan-500',
      badge: 'PDF Pages',
    },
    {
      title: 'Total Chunks',
      value: stats.total_chunks || 0,
      icon: Grid,
      color: 'from-amber-500 to-orange-500',
      badge: 'Vector Splits',
    },
    {
      title: 'Total Embeddings',
      value: stats.total_embeddings || 0,
      icon: Cpu,
      color: 'from-pink-500 to-rose-500',
      badge: 'OpenAI Vectors',
    },
    {
      title: 'Storage Used',
      value: formatBytes(stats.total_storage_bytes || 0),
      icon: HardDrive,
      color: 'from-violet-500 to-purple-500',
      badge: 'Disk Footprint',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 select-none">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="relative glass-effect p-3.5 sm:p-4 rounded-2xl border border-white/10 overflow-hidden shadow-lg group hover:border-primary-app/40 transition-all duration-300"
          >
            {/* Background Ambient Glow */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-xl group-hover:opacity-25 transition-opacity`} />

            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] font-semibold text-muted-app uppercase tracking-wider truncate">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-xl bg-card-app border border-white/10 text-text-app shadow-sm`}>
                <Icon size={14} className="text-primary-app" />
              </div>
            </div>

            <div className="text-lg sm:text-xl font-bold text-text-app tracking-tight font-mono">
              {card.value}
            </div>

            <div className="mt-1 flex items-center gap-1 text-[9px] text-muted-app/80">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-app/60" />
              <span>{card.badge}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DocumentStats;
