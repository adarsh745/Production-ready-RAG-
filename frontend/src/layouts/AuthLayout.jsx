import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Cpu, Database } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen w-screen bg-[#070709] text-white flex flex-col justify-between overflow-hidden font-sans selection:bg-purple-500/30 select-none">
      
      {/* Dark Grid Background Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" 
      />

      {/* Ambient Purple Bottom Center Glow */}
      <div className="absolute bottom-[-15%] left-[50%] -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-gradient-to-t from-purple-900/30 via-pink-900/10 to-transparent blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between shrink-0">
        {/* Left Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 p-[1.5px] shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <div className="h-full w-full bg-[#121118] rounded-[10px] flex items-center justify-center">
              <Bot className="h-4.5 w-4.5 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white">
              RAG Engine
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-900/30 border border-purple-500/40 text-purple-400">
              PRODUCTION
            </span>
          </div>
        </div>

        {/* Right Status Badges */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121118]/80 border border-purple-500/30 text-purple-300 backdrop-blur-md shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Hybrid Search Active</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121118]/80 border border-pink-500/30 text-pink-300 backdrop-blur-md shadow-sm">
            <Database className="w-3.5 h-3.5 text-pink-400" />
            <span>PostgreSQL Vector</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-4 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[430px] my-auto"
        >
          {/* Main Card Container */}
          <div className="relative rounded-[26px] bg-[#121118]/95 border border-white/10 p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
            
            {/* Bottom Glow Border Accent */}
            <div className="absolute bottom-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

            {/* Title & Subtitle */}
            <div className="mb-4 text-center">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-gray-400 font-medium">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form Content */}
            {children}
          </div>
        </motion.div>
      </main>

    </div>
  );
};

export default AuthLayout;
