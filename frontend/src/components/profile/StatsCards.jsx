import React from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Layers, Database, HardDrive, Zap, Cpu } from 'lucide-react';

export const StatsCards = ({ stats = {} }) => {
  const statItems = [
    {
      label: 'Documents Uploaded',
      value: stats.documents || '18',
      suffix: 'Files',
      icon: FileText,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      label: 'Questions Asked',
      value: stats.questions || '584',
      suffix: 'Queries',
      icon: MessageSquare,
      color: 'from-pink-500 to-rose-500',
    },
    {
      label: 'Chats Created',
      value: stats.chats || '146',
      suffix: 'Threads',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Chunks Indexed',
      value: stats.chunks || '3,824',
      suffix: 'Nodes',
      icon: Layers,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Vector Embeddings',
      value: stats.embeddings || '6,820',
      suffix: 'Vectors',
      icon: Database,
      color: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Storage Used',
      value: stats.storage || '120 MB',
      suffix: 'ChromaDB',
      icon: HardDrive,
      color: 'from-violet-500 to-purple-500',
    },
    {
      label: 'Average Response Time',
      value: stats.avgResponse || '1.2 sec',
      suffix: 'Latency',
      icon: Zap,
      color: 'from-[#ec4899] to-[#8b5cf6]',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 select-none">
      {statItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * index }}
            whileHover={{ scale: 1.03, y: -4, rotateY: 5 }}
            className="relative rounded-2xl glass-effect p-4 border border-white/10 hover:border-primary-app/50 shadow-lg hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-300 group overflow-hidden cursor-pointer"
          >
            {/* Glow backdrop on hover */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary-app/10 rounded-full blur-xl group-hover:bg-primary-app/20 transition-all pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                <IconComponent size={16} />
              </div>
              <span className="text-[10px] font-mono font-bold text-muted-app uppercase tracking-wider">
                {item.suffix}
              </span>
            </div>

            <div className="space-y-0.5">
              <h3 className="text-xl font-extrabold text-text-app tracking-tight group-hover:text-primary-app transition-colors">
                {item.value}
              </h3>
              <p className="text-[11px] font-medium text-muted-app truncate">
                {item.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;
