import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { groupSessionsByDate } from '../../context/ChatContext';
import { MessageSquare, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatHistory = ({ collapsed = false }) => {
  const {
    chatHistory,
    activeChatId,
    selectChat,
    renameChat,
    deleteChat,
    isLoadingHistory,
  } = useChat();

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartRename = (e, chat) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleSaveRename = (e, id) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      renameChat(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const groups = groupSessionsByDate(chatHistory);

  const sections = [
    { key: 'today', label: 'Today', items: groups.today },
    { key: 'yesterday', label: 'Yesterday', items: groups.yesterday },
    { key: 'last7Days', label: 'Previous 7 Days', items: groups.last7Days },
    { key: 'older', label: 'Older', items: groups.older },
  ];

  const renderChatItem = (chat) => {
    const isActive = chat.id === activeChatId;
    const isEditing = editingId === chat.id;

    return (
      <motion.div
        key={chat.id}
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'group relative flex items-center justify-between w-full rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 border select-none cursor-pointer my-0.5',
          isActive
            ? 'bg-primary-app/10 text-primary-app border-primary-app/20 dark:bg-white/[0.06] dark:text-white dark:border-white/10 shadow-sm'
            : 'border-transparent text-muted-app hover:text-text-app hover:bg-black/[0.02] dark:hover:text-white dark:hover:bg-white/[0.03]'
        )}
        onClick={() => !isEditing && selectChat(chat.id)}
      >
        <div className="flex items-center gap-2 truncate flex-1 mr-1 min-w-0">
          <MessageSquare
            size={13}
            className={cn(
              'shrink-0',
              isActive ? 'text-primary-app' : 'text-muted-app group-hover:text-text-app dark:group-hover:text-white'
            )}
          />

          {!collapsed && (
            isEditing ? (
              <div className="flex items-center gap-1 flex-1 pr-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveRename(e, chat.id);
                    if (e.key === 'Escape') handleCancelRename(e);
                  }}
                  autoFocus
                  className="w-full bg-bg-app border border-primary-app/40 rounded px-1.5 py-0.5 text-xs text-text-app outline-none font-sans"
                />
                <button
                  onClick={(e) => handleSaveRename(e, chat.id)}
                  className="text-emerald-400 hover:text-emerald-300 p-0.5"
                  title="Save title"
                >
                  <Check size={12} />
                </button>
                <button
                  onClick={handleCancelRename}
                  className="text-muted-app hover:text-text-app p-0.5"
                  title="Cancel"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <span className="truncate text-left pr-2">{chat.title}</span>
            )
          )}
        </div>

        {/* Hover Controls (Rename & Delete) */}
        {!collapsed && !isEditing && (
          <div className="absolute right-1.5 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity bg-card-app/90 backdrop-blur-md px-1 py-0.5 rounded-lg border border-white/5 z-10">
            <button
              onClick={(e) => handleStartRename(e, chat)}
              className="text-muted-app hover:text-primary-app transition-colors p-1"
              title="Rename session"
            >
              <Edit2 size={11} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
              className="text-muted-app hover:text-red-400 transition-colors p-1"
              title="Delete session"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex-1 w-full space-y-3 overflow-y-auto px-1.5 py-1">
      {isLoadingHistory && (
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-app">
          <Loader2 size={12} className="animate-spin text-primary-app" />
          <span>Loading chat sessions...</span>
        </div>
      )}

      {!isLoadingHistory && chatHistory.length === 0 && !collapsed && (
        <div className="px-3 py-4 text-center text-xs text-muted-app/60 italic">
          No chat history yet
        </div>
      )}

      <AnimatePresence initial={false}>
        {!isLoadingHistory &&
          sections.map(
            (sec) =>
              sec.items.length > 0 && (
                <div key={sec.key} className="space-y-1">
                  {!collapsed && (
                    <div className="px-2 py-1 text-[10px] font-bold text-muted-app/70 uppercase tracking-wider select-none">
                      {sec.label}
                    </div>
                  )}
                  {sec.items.map(renderChatItem)}
                </div>
              )
          )}
      </AnimatePresence>
    </div>
  );
};

export default ChatHistory;
