import React from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatHistory = ({ collapsed = false }) => {
  const {
    chatHistory,
    activeChatId,
    selectChat,
    deleteChat
  } = useChat();

  const renderChatItem = (chat) => {
    const isActive = chat.id === activeChatId;

    return (
      <motion.div
        key={chat.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'group relative flex items-center justify-between w-full rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 border border-transparent select-none cursor-pointer',
          isActive
            ? 'bg-primary-app/5 text-primary-app border-primary-app/10 dark:bg-white/[0.04] dark:text-white dark:border-white/5 shadow-sm'
            : 'text-muted-app hover:text-text-app hover:bg-black/[0.02] dark:hover:text-white dark:hover:bg-white/[0.02]'
        )}
        onClick={() => selectChat(chat.id)}
      >
        <div className="flex items-center gap-2.5 truncate flex-1 mr-1">
          <MessageSquare size={13} className={isActive ? 'text-primary-app' : 'text-muted-app group-hover:text-text-app dark:group-hover:text-white'} />
          {!collapsed && (
            <span className="truncate pr-4 text-left">{chat.title}</span>
          )}
        </div>

        {/* Hover Action Controls (Hidden on Collapsed) */}
        {!collapsed && (
          <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity bg-gradient-to-l from-sidebar-app via-sidebar-app/90 to-transparent pl-4 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
              className="text-muted-app hover:text-red-400 transition-colors cursor-pointer"
              title="Delete thread"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex-1 w-full space-y-0.5 overflow-y-auto px-1.5 py-1">
      <AnimatePresence initial={false}>
        {chatHistory.length > 0 ? (
          chatHistory.map(renderChatItem)
        ) : (
          !collapsed && (
            <div className="px-3 py-2 text-xs text-muted-app/60 italic">
              No active chats
            </div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatHistory;
