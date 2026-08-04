import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useSidebar } from '../../hooks/useSidebar';
import { useTheme } from '../../hooks/useTheme';
import { MODELS } from '../../utils/constants';
import Badge from '../common/Badge';
import Tooltip from '../common/Tooltip';
import { cn } from '../../utils/helpers';
import {
  ChevronDown, Globe, Sparkles, Menu, Shield,
  ChevronLeft, ChevronRight, RotateCw, Download, Plus, Copy, Lock, LayoutGrid,
  Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { selectedModel, setSelectedModel } = useChat();
  const { toggleMobileSidebar, toggleSidebar } = useSidebar();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-between px-4 lg:px-8 py-3 border-b border-border-app bg-bg-app select-none">

        {/* Left: Mobile menu toggle + Model selector */}
        <div className="flex items-center gap-3">
          {/* Mobile drawer button */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-muted-app hover:text-text-app hover:bg-black/[0.02] dark:hover:text-white dark:hover:bg-white/[0.04] transition-all"
          >
            <Menu size={18} />
          </button>

          {/* Custom Dropdown for Model Select */}
          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-border-app hover:border-white/15 transition-all text-xs font-semibold text-text-app shadow-sm select-none"
            >
              {/* Orb indicator inside Model select */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-app opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-app"></span>
              </span>

              <span>{selectedModel?.name || 'Grok Zero point'}</span>
              <Badge variant="accent" className="bg-[#EC4899]/15 text-[#EC4899] border-transparent font-medium py-[1px]">
                {selectedModel?.badge || 'Beta'}
              </Badge>
              <ChevronDown size={12} className={cn('text-muted-app transition-transform', isModelDropdownOpen ? 'rotate-180' : '')} />
            </button>

            {/* Model Selection list */}
            <AnimatePresence>
              {isModelDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsModelDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-0 mt-2 w-48 rounded-xl bg-sidebar-app border border-border-app p-1.5 shadow-2xl z-50 space-y-0.5"
                  >
                    <div className="px-2 py-1 text-[10px] font-bold text-muted-app uppercase tracking-wider">
                      Select LLM Model
                    </div>
                    {MODELS.map(model => {
                      const isActive = model.id === selectedModel?.id;
                      return (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model);
                            setIsModelDropdownOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left',
                            isActive
                              ? 'bg-white/[0.08] text-white'
                              : 'text-muted-app hover:text-white hover:bg-white/[0.03]'
                          )}
                        >
                          <span>{model.name}</span>
                          <Badge variant={isActive ? 'accent' : 'glow'} className="py-0 px-1.5 text-[9px]">
                            {model.badge}
                          </Badge>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Search Toggle & Wallet accounts */}
        <div className="flex items-center gap-3">
          {/* Globe Web Search indicator */}
          <button
            className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-muted-app hover:text-white hover:shadow-[0_0_10px_rgba(59,130,246,0.15)] transition-all"
            title="Web Search"
          >
            <Globe size={14} />
          </button>

          {/* Theme Toggle Button */}
          <Tooltip content={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} position="bottom">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-muted-app hover:text-text-app transition-all active:scale-95 cursor-pointer flex items-center justify-center"
              whileHover={{ rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              id="theme-toggle-btn"
            >
              {isDark ? (
                <Moon size={14} className="text-primary-app animate-rotate-slow" />
              ) : (
                <Sun size={14} className="text-[#F59E0B]" />
              )}
            </motion.button>
          </Tooltip>

          {/* Account/Wallet Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-medium text-text-app shadow-inner">
            {/* sparkles icon */}
            <Sparkles size={11} className="text-primary-app animate-pulse-slow" />
            <span className="text-muted-app font-mono text-[10px]">30asdp...Deslo</span>
          </div>
        </div>

    </div>
  );
};

export default Navbar;
