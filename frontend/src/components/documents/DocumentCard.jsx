import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, CheckCircle2, Clock, AlertCircle, Eye, Download,
  RefreshCw, Edit2, Trash2, Code, Scan, Layers, HardDrive, MoreVertical
} from 'lucide-react';
import { cn, formatDate } from '../../utils/helpers';

const formatBytes = (bytes = 0) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const DocumentCard = ({
  document,
  onViewDetails,
  onDownload,
  onReplace,
  onRename,
  onDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const status = document.status || (document.is_indexed ? 'indexed' : 'processing');
  const isIndexed = status === 'indexed' || document.is_indexed;
  const isProcessing = status === 'processing';
  const isFailed = status === 'failed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative glass-effect rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-primary-app/40 shadow-lg flex flex-col justify-between transition-all duration-300 select-none"
    >
      {/* Top Header: File Icon, Title, Status & Actions */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            
            {/* PDF File Icon Vessel */}
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-primary-app/20 to-accent-app/20 border border-primary-app/30 p-2 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <FileText className="h-6 w-6 text-primary-app" />
            </div>

            <div className="min-w-0 flex-1">
              <h3
                onClick={() => onViewDetails(document)}
                className="text-sm font-bold text-text-app truncate hover:text-primary-app transition-colors cursor-pointer"
                title={document.filename}
              >
                {document.filename}
              </h3>
              <p className="text-[10px] text-muted-app font-medium">
                {document.uploaded_at ? formatDate(document.uploaded_at) : 'Recently uploaded'}
              </p>
            </div>
          </div>

          {/* Action Menu Dropdown Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-xl text-muted-app hover:text-text-app hover:bg-white/10 transition-colors cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>

            {/* Menu Popup */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 w-44 rounded-2xl glass-effect border border-white/15 shadow-2xl p-1.5 z-30 flex flex-col gap-0.5 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onViewDetails(document);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-text-app hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Eye size={14} className="text-primary-app" />
                    <span>View Details</span>
                  </button>

                  {document.filepath && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDownload(document);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-text-app hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Download size={14} className="text-secondary-app" />
                      <span>Download PDF</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onRename(document);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-text-app hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Edit2 size={14} className="text-amber-400" />
                    <span>Rename</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onReplace(document);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-text-app hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={14} className="text-accent-app" />
                    <span>Replace File</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onViewDetails(document);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-text-app hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Code size={14} className="text-blue-400" />
                    <span>View Metadata</span>
                  </button>

                  <div className="h-[1px] bg-white/10 my-1" />

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete(document);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status & Feature Badges Bar */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {/* Status Badge */}
          {isIndexed && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={10} />
              <span>Indexed</span>
            </span>
          )}

          {isProcessing && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
              <Clock size={10} className="animate-spin" />
              <span>Processing</span>
            </span>
          )}

          {isFailed && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <AlertCircle size={10} />
              <span>Failed</span>
            </span>
          )}

          {/* OCR Badge */}
          {document.ocr_enabled && (
            <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1">
              <Scan size={10} />
              <span>OCR Scanned</span>
            </span>
          )}
        </div>

        {/* AI Summary Preview (2 Lines) */}
        <p className="text-xs text-muted-app leading-relaxed line-clamp-2 mb-3 italic">
          "{document.summary || `Document ${document.filename} ingested and indexed into ChromaDB.`}"
        </p>
      </div>

      {/* Card Footer Metrics & Tags */}
      <div>
        {/* Keywords Tags */}
        {document.keywords && document.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {document.keywords.slice(0, 3).map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-lg bg-bg-app border border-white/10 text-[9px] font-semibold text-text-app/80"
              >
                #{kw}
              </span>
            ))}
          </div>
        )}

        {/* Metrics Grid Bar */}
        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-muted-app">
          <div className="flex items-center gap-1">
            <Layers size={11} className="text-primary-app" />
            <span>{document.pages || 1} pages</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-app" />
            <span>{document.chunks || 1} chunks</span>
          </div>

          <div className="flex items-center gap-1">
            <HardDrive size={11} className="text-accent-app" />
            <span>{formatBytes(document.file_size)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard;
