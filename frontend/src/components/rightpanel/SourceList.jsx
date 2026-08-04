import React from 'react';
import { useChat } from '../../hooks/useChat';
import SourceCard from './SourceCard';
import DocumentPreview from './DocumentPreview';
import { X, Library, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SourceList = () => {
  const { 
    messages, 
    setIsRightPanelOpen, 
    selectedSource, 
    setSelectedSource 
  } = useChat();

  // Find the last message that contains sources to show them
  const messagesWithSources = messages.filter(msg => msg.sources && msg.sources.length > 0);
  const activeSources = messagesWithSources[messagesWithSources.length - 1]?.sources || [];

  return (
    <div className="w-[340px] h-full flex flex-col bg-sidebar-app border-l border-border-app shrink-0 relative select-none">
      
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border-app">
        <div className="flex items-center gap-2 text-xs font-bold text-text-app uppercase tracking-wider">
          <Library size={14} className="text-primary-app animate-pulse-slow" />
          <span>Retrieved Sources</span>
        </div>
        
        <button
          onClick={() => setIsRightPanelOpen(false)}
          className="p-1 rounded-lg text-muted-app hover:text-text-app hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-all cursor-pointer"
          title="Close sources panel"
        >
          <X size={14} />
        </button>
      </div>

      {/* Sources list body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {activeSources.length > 0 ? (
          activeSources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              isActive={selectedSource?.id === source.id}
              onClick={() => setSelectedSource(source)}
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-app/60">
            <AlertCircle size={24} className="mb-2 text-muted-app/40" />
            <span className="text-xs font-medium">No sources retrieved</span>
            <p className="text-[10px] mt-1 leading-normal max-w-[180px]">
              Ask a question related to Q3 goals or strategy documents to display retrieval indexes.
            </p>
          </div>
        )}
      </div>

      {/* Slide-out Document details drawer */}
      <AnimatePresence>
        {selectedSource && (
          <DocumentPreview />
        )}
      </AnimatePresence>

    </div>
  );
};

export default SourceList;
