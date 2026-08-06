import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, MessageSquarePlus, FolderKanban, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

export const QuickActions = () => {
  const navigate = useNavigate();
  const { createNewChat } = useChat();

  const handleNewChat = async () => {
    await createNewChat();
    navigate('/chat');
  };

  const actionItems = [
    {
      id: 'upload',
      label: 'Upload Document',
      icon: Upload,
      color: 'from-purple-500 to-indigo-600',
      action: () => navigate('/documents'),
    },
    {
      id: 'new-chat',
      label: 'New Chat',
      icon: MessageSquarePlus,
      color: 'from-pink-500 to-rose-600',
      action: handleNewChat,
    },
    {
      id: 'manage-docs',
      label: 'Manage Documents',
      icon: FolderKanban,
      color: 'from-blue-500 to-cyan-600',
      action: () => navigate('/documents'),
    },
    {
      id: 'analytics',
      label: 'Analytics Dashboard',
      icon: BarChart3,
      color: 'from-emerald-500 to-teal-600',
      action: () => navigate('/documents'),
    },
    {
      id: 'security',
      label: 'Security Settings',
      icon: ShieldCheck,
      color: 'from-amber-500 to-orange-600',
      action: () => {
        const sec = document.getElementById('security-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <div className="space-y-3 select-none">
      <h3 className="text-xs font-bold text-muted-app uppercase tracking-wider flex items-center gap-1.5">
        <Zap size={14} className="text-primary-app" />
        <span>Quick Workflows</span>
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actionItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * idx }}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={item.action}
              className="p-4 rounded-2xl glass-effect border border-white/15 hover:border-primary-app/50 shadow-lg hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] flex flex-col items-center text-center gap-2 transition-all cursor-pointer group overflow-hidden"
            >
              <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-md group-hover:rotate-12 transition-transform duration-300`}>
                <IconComp size={18} />
              </div>
              <span className="text-xs font-bold text-text-app group-hover:text-primary-app transition-colors">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
