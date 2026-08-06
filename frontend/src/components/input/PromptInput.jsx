import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import UploadButton from './UploadButton';
import VoiceButton from './VoiceButton';
import SendButton from './SendButton';
import DocumentSelector from '../chat/DocumentSelector';
import { Sparkles, X, FileText, Filter, CheckSquare } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const PromptInput = () => {
  const {
    sendMessage,
    isGenerating,
    uploadedFiles,
    removeUploadedFile,
    selectedDocumentIds,
    availableDocuments,
    toggleSelectDocument,
    selectAllDocuments,
    clearSelectedDocuments,
  } = useChat();

  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea to fit content heights
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || isGenerating) return;
    sendMessage(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Selected Documents Objects
  const selectedDocs = availableDocuments.filter((d) => selectedDocumentIds.includes(d.id));

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto px-4 mb-4 select-none relative">

      {/* Selected Document Chips Bar (Shown above input when documents are selected) */}
      {selectedDocs.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-2 px-1">
          <span className="text-[10px] font-bold text-muted-app uppercase tracking-wider">
            Context:
          </span>
          {selectedDocs.map((doc) => (
            <span
              key={doc.id}
              className="px-2.5 py-1 rounded-full bg-primary-app/15 border border-primary-app/30 text-primary-app text-[10px] font-semibold flex items-center gap-1.5 shadow-sm animate-in fade-in zoom-in-95"
            >
              <FileText size={10} />
              <span className="truncate max-w-[140px]">{doc.filename}</span>
              <button
                type="button"
                onClick={() => toggleSelectDocument(doc.id)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                <X size={10} />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={clearSelectedDocuments}
            className="text-[9px] font-bold text-muted-app hover:text-red-400 underline ml-1 cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Document Selector Popover Component */}
      <DocumentSelector
        documents={availableDocuments}
        selectedIds={selectedDocumentIds}
        onToggleSelect={toggleSelectDocument}
        onSelectAll={selectAllDocuments}
        onClearAll={clearSelectedDocuments}
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
      />

      {/* Search Container with Focus Glowing Border */}
      <div
        className={cn(
          'relative rounded-2xl transition-all duration-500 z-10 p-[1px]',
          isFocused
            ? 'bg-gradient-to-r from-primary-app via-accent-app to-secondary-app shadow-[0_0_30px_rgba(124,58,237,0.25)]'
            : 'bg-border-app hover:bg-border-app/90 dark:bg-white/[0.08] dark:hover:bg-white/[0.12]'
        )}
      >
        {/* Glow backdrop layer on focus */}
        <div
          className={cn(
            'absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary-app via-accent-app to-secondary-app opacity-0 blur-xl transition-opacity duration-500 -z-10 pointer-events-none',
            isFocused ? 'opacity-30' : 'opacity-0'
          )}
        />

        {/* Input inner body with glassmorphism */}
        <div className="rounded-[15px] glass-input p-3 flex flex-col gap-2">

          {/* Uploaded File Badges Bar (shown only when transient files are attached) */}
          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2 border-b border-border-app">
              {uploadedFiles.map(file => (
                <div
                  key={file.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-app border border-border-app text-[10px] font-semibold text-text-app"
                >
                  <FileText size={10} className="text-primary-app" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeUploadedFile(file.id)}
                    className="text-muted-app hover:text-text-app transition-colors cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Text Area Input Row */}
          <div className="flex gap-2.5 items-start">
            {/* Input AI sparkles icon */}
            <div className="pt-1.5 pl-1 shrink-0">
              <Sparkles size={15} className="text-primary-app drop-shadow-[0_0_5px_rgba(124,58,237,0.5)]" />
            </div>

            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                selectedDocumentIds.length > 0
                  ? `Ask across ${selectedDocumentIds.length} selected documents...`
                  : 'Ask across all uploaded documents...'
              }
              className="flex-1 bg-transparent border-0 outline-none text-sm text-text-app placeholder-muted-app/60 resize-none py-1.5 focus:ring-0 min-h-[32px] leading-relaxed font-sans"
              disabled={isGenerating}
            />
          </div>

          {/* Bottom Bar: Action buttons & Multi-document selector toggle */}
          <div className="flex items-center justify-between border-t border-border-app pt-2 mt-1">

            {/* Left side: Upload + Document Selector Trigger */}
            <div className="flex items-center gap-2">
              <UploadButton />

              {/* Multi-Document Filter Button Trigger */}
              <button
                type="button"
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold transition-all select-none active:scale-95 cursor-pointer',
                  selectedDocumentIds.length > 0
                    ? 'bg-primary-app/20 border-primary-app/40 text-primary-app shadow-[0_0_10px_rgba(124,58,237,0.2)]'
                    : 'bg-bg-app border-border-app hover:border-primary-app/30 text-muted-app hover:text-text-app'
                )}
                title="Select documents to filter search context"
              >
                <Filter size={11} className={selectedDocumentIds.length > 0 ? 'text-primary-app' : 'text-muted-app'} />
                <span>
                  {selectedDocumentIds.length === 0
                    ? 'Filter Documents'
                    : `${selectedDocumentIds.length} Selected`}
                </span>
              </button>
            </div>

            {/* Right side: Microphone & Send Button */}
            <div className="flex items-center gap-2.5">
              <VoiceButton />
              <SendButton disabled={!text.trim() && uploadedFiles.length === 0 || isGenerating} />
            </div>

          </div>

        </div>
      </div>
    </form>
  );
};

export default PromptInput;
