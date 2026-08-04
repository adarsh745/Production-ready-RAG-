import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import UploadButton from './UploadButton';
import VoiceButton from './VoiceButton';
import SendButton from './SendButton';
import { Sparkles, Cloud, X, FileText } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const PromptInput = () => {
  const { sendMessage, isGenerating, uploadedFiles, removeUploadedFile } = useChat();
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
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

  const handlePillClick = (pillText) => {
    sendMessage(pillText);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto px-4 mb-4 select-none">
      
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
          
          {/* Uploaded File Badges Bar (shown only when files are attached) */}
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
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent border-0 outline-none text-sm text-text-app placeholder-muted-app/60 resize-none py-1.5 focus:ring-0 min-h-[32px] leading-relaxed"
              disabled={isGenerating}
            />
          </div>

          {/* Bottom Bar: Action buttons & Suggested tags */}
          <div className="flex items-center justify-between border-t border-border-app pt-2 mt-1">
            
            {/* Left side: Upload + suggestion pills */}
            <div className="flex items-center gap-2">
              <UploadButton />
              
              {/* Sugestion Pills */}
              <button
                type="button"
                onClick={() => handlePillClick('Goal-organization')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-app border border-border-app hover:border-primary-app/30 text-[10px] font-semibold text-muted-app hover:text-text-app transition-all select-none active:scale-95 cursor-pointer"
              >
                <Cloud size={10} className="text-secondary-app" />
                <span>Goal-organization</span>
              </button>
              
              <button
                type="button"
                onClick={() => handlePillClick('Goal-organization')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-app border border-border-app hover:border-primary-app/30 text-[10px] font-semibold text-muted-app hover:text-text-app transition-all select-none active:scale-95 cursor-pointer"
              >
                <Cloud size={10} className="text-secondary-app" />
                <span>Goal-organization</span>
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
