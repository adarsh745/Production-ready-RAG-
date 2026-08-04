import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useSidebar } from '../../hooks/useSidebar';
import { ChevronDown, Sidebar, Plus, Layers, Target, Code, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORKSPACES } from '../../utils/constants';
import Avatar from '../common/Avatar';
import { cn } from '../../utils/helpers';

export const WorkspaceList = () => {
  const { selectedWorkspace, setSelectedWorkspace } = useChat();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);

  const getWorkspaceIcon = (iconName) => {
    switch (iconName) {
      case 'zap': return <Layers size={14} className="text-primary-app" />;
      case 'trending-up': return <Target size={14} className="text-secondary-app" />;
      case 'code': return <Code size={14} className="text-green-400" />;
      case 'palette': return <Palette size={14} className="text-accent-app" />;
      default: return <Layers size={14} />;
    }
  };

  return (
    <div className="relative w-full">
      {/* Workspace Brand Block */}
      <div className={cn(
        'flex items-center justify-between gap-2 px-1 py-2',
        isCollapsed ? 'flex-col justify-center gap-2.5' : ''
      )}>
        <div
          onClick={() => !isCollapsed && setIsOpen(prev => !prev)}
          className={cn(
            'flex items-center gap-2.5 transition-all select-none',
            !isCollapsed ? 'hover:opacity-85 cursor-pointer' : ''
          )}
        >
          {/* Avatar Icon */}
          <Avatar role="assistant" size="sm" className="ring-1 ring-white/10" />
          
          {/* Logo Name & Selector */}
          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-text-app tracking-wide text-sm">
                {selectedWorkspace?.name || 'Voicifox'}
              </span>
              <ChevronDown size={14} className={cn('text-muted-app transition-transform duration-200', isOpen ? 'rotate-180' : '')} />
            </div>
          )}
        </div>

        {/* Sidebar Toggle Panel Button (Desktop only) */}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-muted-app hover:text-text-app hover:bg-black/[0.02] dark:hover:text-white dark:hover:bg-white/[0.04] transition-all cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Sidebar size={16} className={cn('transition-transform duration-300', isCollapsed ? 'rotate-180' : '')} />
        </button>
      </div>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && !isCollapsed && (
          <>
            {/* Backdrop click closer */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 mt-2 z-50 rounded-xl bg-sidebar-app/95 backdrop-blur-xl border border-border-app p-1.5 shadow-2xl space-y-0.5"
            >
              <div className="px-2 py-1 text-[10px] font-bold text-muted-app uppercase tracking-widest">
                Switch Workspace
              </div>
              
              {WORKSPACES.map(ws => {
                const isActive = ws.id === selectedWorkspace.id;
                return (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setSelectedWorkspace(ws);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer',
                      isActive 
                        ? 'bg-primary-app/10 text-primary-app dark:bg-white/[0.08] dark:text-white' 
                        : 'text-muted-app hover:text-text-app hover:bg-black/[0.03] dark:hover:text-white dark:hover:bg-white/[0.03]'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {getWorkspaceIcon(ws.icon)}
                      <span>{ws.name}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-app shadow-[0_0_5px_#7C3AED]" />
                    )}
                  </button>
                );
              })}
              
              <div className="h-[1px] bg-border-app my-1" />
              
              <button
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary-app hover:text-primary-app/80 hover:bg-primary-app/5 transition-all text-left cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <Plus size={12} />
                <span>Create Workspace</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceList;
