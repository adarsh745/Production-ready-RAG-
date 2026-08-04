import React, { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import PromptInput from '../input/PromptInput';
import LoadingOrb from '../ui/LoadingOrb';
import GradientText from '../ui/GradientText';
import { Bookmark, Copy, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ChatWindow = () => {
  const { messages, isGenerating } = useChat();
  const chatEndRef = useRef(null);

  // Auto-scroll chat area to bottom when messages list updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col justify-between h-full relative overflow-hidden select-none">
      
      {/* Scrollable Message Panel */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        {isEmpty ? (
          
          /* ========================================================
             EMPTY WELCOME STATE (Match reference image exactly)
             ======================================================== */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 min-h-[50vh] py-12">
            
            {/* Center Glowing 3D AI Orb */}
            <LoadingOrb size="lg" pulsing={true} />

            {/* Welcome Typography Grid */}
            <div className="space-y-1.5 max-w-xl">
              <h2 className="text-2xl md:text-3xl font-light text-text-app tracking-wide leading-tight">
                Let's get started how
              </h2>
              <div className="text-2xl md:text-3xl font-light text-text-app tracking-wide leading-tight flex items-center justify-center gap-1.5 flex-wrap">
                <span>can I</span>
                <GradientText variant="serif-italic" className="text-3xl md:text-4xl pl-1 pr-2 pb-1">
                  assist you today?
                </GradientText>
              </div>
            </div>

          </div>
        ) : (
          
          /* ========================================================
             CHATTING MESSAGE LIST
             ======================================================== */
          <div className="max-w-4xl mx-auto w-full space-y-4 pt-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Typing status dots */}
            {isGenerating && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-start gap-3 px-1.5">
                <div className="w-8 h-8 rounded-full bg-card-app border border-border-app flex items-center justify-center shrink-0">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-app opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-app"></span>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-text-app">Assistant</span>
                  <TypingIndicator />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Floating Right Bar Action Icons (Matches screenshot right column buttons) */}
      <div className="absolute right-4 top-1/3 -translate-y-1/2 flex flex-col gap-3 z-20">
        <button 
          className="p-2.5 rounded-full bg-card-app border border-border-app text-muted-app hover:text-text-app hover:bg-black/[0.02] dark:hover:bg-white/[0.08] transition-all shadow-md active:scale-95 cursor-pointer"
          title="Save discussion"
        >
          <Bookmark size={15} />
        </button>
        <button 
          className="p-2.5 rounded-full bg-card-app border border-border-app text-muted-app hover:text-text-app hover:bg-black/[0.02] dark:hover:bg-white/[0.08] transition-all shadow-md active:scale-95 cursor-pointer"
          title="Duplicate thread"
        >
          <Copy size={15} />
        </button>
        <button 
          className="p-2.5 rounded-full bg-card-app border border-border-app text-muted-app hover:text-text-app hover:bg-black/[0.02] dark:hover:bg-white/[0.08] transition-all shadow-md active:scale-95 cursor-pointer"
          title="Share workspace link"
        >
          <Share2 size={15} />
        </button>
      </div>

      {/* Prompt Search Input Footer */}
      <PromptInput />

    </div>
  );
};

export default ChatWindow;
