import React from 'react';
import { motion } from 'framer-motion';
import { Activity, FileText, MessageSquare, Plus, Sparkles, Trash2, Clock } from 'lucide-react';

export const ActivityTimeline = () => {
  const activities = [
    {
      id: 1,
      type: 'upload',
      title: 'Uploaded Resume.pdf',
      timestamp: '10 minutes ago',
      icon: FileText,
      color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    },
    {
      id: 2,
      type: 'question',
      title: 'Asked "What are Razorpay Webhooks?"',
      timestamp: '25 minutes ago',
      icon: MessageSquare,
      color: 'text-pink-400 bg-pink-500/20 border-pink-500/30',
    },
    {
      id: 3,
      type: 'chat',
      title: 'Created New Chat Session',
      timestamp: '1 hour ago',
      icon: Plus,
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    },
    {
      id: 4,
      type: 'upload',
      title: 'Uploaded AWS_Architecture.pdf',
      timestamp: '3 hours ago',
      icon: FileText,
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    },
    {
      id: 5,
      type: 'summary',
      title: 'Generated AI Summary & Suggested Questions',
      timestamp: '5 hours ago',
      icon: Sparkles,
      color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    },
    {
      id: 6,
      type: 'delete',
      title: 'Deleted Legacy_Draft.pdf',
      timestamp: '1 day ago',
      icon: Trash2,
      color: 'text-red-400 bg-red-500/20 border-red-500/30',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="relative rounded-3xl glass-effect p-6 sm:p-7 border border-white/15 shadow-xl select-none"
    >
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary-app/20 text-primary-app">
            <Activity size={16} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-text-app">Recent Activity</h3>
            <p className="text-[10px] text-muted-app">Real-time audit log of your workspace actions</p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-muted-app flex items-center gap-1">
          <Clock size={11} /> Live Stream
        </span>
      </div>

      {/* Timeline Items List */}
      <div className="relative pl-4 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-white/10">
        {activities.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * idx }}
              className="relative flex items-center justify-between gap-3 text-xs"
            >
              {/* Dot Icon */}
              <div className={`absolute -left-4 p-1 rounded-full border shadow-sm ${item.color}`}>
                <IconComp size={11} />
              </div>

              <div className="pl-3 truncate">
                <span className="font-semibold text-text-app truncate block">{item.title}</span>
                <span className="text-[10px] text-muted-app font-mono">{item.timestamp}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ActivityTimeline;
