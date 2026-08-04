import React from 'react';
import { useChat } from '../../hooks/useChat';
import { X, FileText, Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';

export const DocumentPreview = () => {
  const { selectedSource, setSelectedSource } = useChat();
  const [copied, setCopied] = React.useState(false);

  if (!selectedSource) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSource.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-sidebar-app border-l border-border-app z-30 flex flex-col justify-between select-none"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border-app bg-sidebar-app">
        <div className="flex items-center gap-2 text-xs font-bold text-text-app uppercase tracking-wider">
          <FileText size={14} className="text-secondary-app" />
          <span>Document Preview</span>
        </div>
        
        <button
          onClick={() => setSelectedSource(null)}
          className="p-1 rounded-lg text-muted-app hover:text-text-app hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-all cursor-pointer"
          title="Back to sources list"
        >
          <X size={14} />
        </button>
      </div>

      {/* Drawer Body Scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left select-text">
        {/* Document Meta Header details */}
        <div className="space-y-1 bg-bg-app border border-border-app rounded-2xl p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-text-app truncate max-w-[200px]">
              {selectedSource.title}
            </h3>
            <Badge variant="accent" className="text-[9px]">Page {selectedSource.page}</Badge>
          </div>
          <p className="text-[10px] text-muted-app font-medium">
            Similarity score: <span className="text-green-400 font-bold">{Math.round(selectedSource.similarity * 100)}%</span> • Size: {selectedSource.size || 'N/A'}
          </p>
        </div>

        {/* Full Text area */}
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-muted-app uppercase tracking-wider select-none">
            Retrieved Segment Content
          </span>
          <div className="p-4 rounded-2xl bg-bg-app/80 border border-border-app text-xs text-text-app/90 leading-relaxed font-sans min-h-[160px] whitespace-pre-wrap selection:bg-primary-app/20">
            {selectedSource.content}
          </div>
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 border-t border-border-app bg-sidebar-app flex gap-2 select-none">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-bg-app border border-border-app hover:bg-black/[0.02] dark:hover:bg-white/[0.06] text-xs font-semibold text-text-app transition-all select-none active:scale-98 cursor-pointer"
        >
          {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          <span>{copied ? 'Copied segment' : 'Copy context'}</span>
        </button>
      </div>

    </motion.div>
  );
};

export default DocumentPreview;
