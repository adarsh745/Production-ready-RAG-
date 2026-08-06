import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X, FileText, CheckCircle2, Clock, Scan, Layers, Grid, Cpu,
  HardDrive, Sparkles, Tag, Code, Copy, Check, HelpCircle, MessageSquare
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { useChat } from '../../hooks/useChat';

const formatBytes = (bytes = 0) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const DocumentDetailsDrawer = ({ document, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { sendMessage } = useChat();
  const navigate = useNavigate();

  if (!isOpen || !document) return null;

  const metadataJson = JSON.stringify(document, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(metadataJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuestionClick = (questionText) => {
    onClose();
    navigate('/');
    setTimeout(() => {
      sendMessage(questionText);
    }, 100);
  };

  const suggestedQuestions = document.suggested_questions || [
    `What is the main topic of ${document.filename}?`,
    "What key information is provided in this document?",
    "Summarize the primary sections.",
    "Which technologies or concepts are mentioned?",
    "What are the main takeaways?"
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-hidden select-none">
        
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Sliding Drawer Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 right-0 w-full max-w-lg glass-effect border-l border-white/15 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
        >
          {/* Drawer Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border-app mb-6">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-3 rounded-2xl bg-primary-app/20 border border-primary-app/30 text-primary-app shrink-0">
                  <FileText size={22} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-text-app truncate" title={document.filename}>
                    {document.filename}
                  </h2>
                  <p className="text-xs text-muted-app">
                    Document Details & AI Analysis
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-muted-app hover:text-text-app hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Metrics Quick Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-card-app/60 border border-white/10">
                <div className="text-[10px] text-muted-app font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Layers size={11} className="text-primary-app" />
                  <span>Pages</span>
                </div>
                <div className="text-sm font-bold text-text-app font-mono">{document.pages || 1}</div>
              </div>

              <div className="p-3 rounded-2xl bg-card-app/60 border border-white/10">
                <div className="text-[10px] text-muted-app font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Grid size={11} className="text-secondary-app" />
                  <span>Chunks</span>
                </div>
                <div className="text-sm font-bold text-text-app font-mono">{document.chunks || 1}</div>
              </div>

              <div className="p-3 rounded-2xl bg-card-app/60 border border-white/10">
                <div className="text-[10px] text-muted-app font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Cpu size={11} className="text-accent-app" />
                  <span>Embeddings</span>
                </div>
                <div className="text-sm font-bold text-text-app font-mono">{document.chunks || 1}</div>
              </div>

              <div className="p-3 rounded-2xl bg-card-app/60 border border-white/10">
                <div className="text-[10px] text-muted-app font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <HardDrive size={11} className="text-blue-400" />
                  <span>File Size</span>
                </div>
                <div className="text-sm font-bold text-text-app font-mono">{formatBytes(document.file_size)}</div>
              </div>

              <div className="p-3 rounded-2xl bg-card-app/60 border border-white/10">
                <div className="text-[10px] text-muted-app font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Scan size={11} className="text-purple-400" />
                  <span>OCR Used</span>
                </div>
                <div className="text-sm font-bold text-text-app font-mono">{document.ocr_enabled ? 'Yes' : 'No'}</div>
              </div>

              <div className="p-3 rounded-2xl bg-card-app/60 border border-white/10">
                <div className="text-[10px] text-muted-app font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-400" />
                  <span>Status</span>
                </div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{document.status || 'Indexed'}</div>
              </div>
            </div>

            {/* AI Summary Card (Purple Glassmorphism) */}
            <div className="mb-6 space-y-2">
              <h4 className="text-xs font-bold text-text-app uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary-app" />
                <span>AI Executive Summary (100–150 words)</span>
              </h4>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-app/15 via-accent-app/10 to-card-app border border-primary-app/30 text-xs text-text-app/95 leading-relaxed font-sans shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-app/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary-app/20 transition-all" />
                "{document.summary || `Document '${document.filename}' ingested into vector store with ${document.chunks || 1} chunks.`}"
              </div>
            </div>

            {/* Suggested Questions Section (Interactive Chips) */}
            <div className="mb-6 space-y-2.5">
              <h4 className="text-xs font-bold text-text-app uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-secondary-app" />
                  <span>Suggested Questions ({suggestedQuestions.length})</span>
                </div>
                <span className="text-[10px] text-muted-app font-mono font-normal">Click to ask AI</span>
              </h4>

              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleQuestionClick(q)}
                    className="px-3.5 py-2 rounded-full glass-effect bg-gradient-to-r from-primary-app/15 via-accent-app/10 to-card-app border border-primary-app/30 hover:border-primary-app/60 hover:bg-primary-app/25 text-left text-xs font-semibold text-text-app hover:text-white flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-md group select-none"
                  >
                    <Sparkles size={12} className="text-primary-app group-hover:rotate-12 transition-transform" />
                    <span>{q}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Keywords Section */}
            {document.keywords && document.keywords.length > 0 && (
              <div className="mb-6 space-y-2">
                <h4 className="text-xs font-bold text-text-app uppercase tracking-wider flex items-center gap-1.5">
                  <Tag size={14} className="text-secondary-app" />
                  <span>Extracted Top Keywords</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {document.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-card-app border border-white/10 text-xs font-semibold text-text-app"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Metadata JSON Inspector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-text-app uppercase tracking-wider flex items-center gap-1.5">
                  <Code size={14} className="text-accent-app" />
                  <span>Metadata JSON</span>
                </h4>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 text-[10px] font-semibold text-muted-app hover:text-text-app transition-colors cursor-pointer"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-[11px] font-mono text-emerald-400/90 overflow-x-auto leading-relaxed max-h-48">
                <code>{metadataJson}</code>
              </pre>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="pt-6 border-t border-border-app mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-card-app border border-white/10 hover:bg-white/10 text-xs font-semibold text-text-app transition-colors cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DocumentDetailsDrawer;
