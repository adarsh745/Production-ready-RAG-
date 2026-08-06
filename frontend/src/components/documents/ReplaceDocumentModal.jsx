import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, UploadCloud, X, FileText } from 'lucide-react';

export const ReplaceDocumentModal = ({ isOpen, document, onConfirm, onCancel, isReplacing }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen || !document) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onConfirm(document.id, selectedFile);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md glass-effect rounded-3xl p-6 border border-white/15 shadow-2xl z-10 space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border-app">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-accent-app/15 border border-accent-app/30 text-accent-app">
                <RefreshCw size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-app">Replace Document</h3>
                <p className="text-[11px] text-muted-app">Re-indexes document content in ChromaDB</p>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="p-1.5 rounded-xl text-muted-app hover:text-text-app transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-muted-app">
            Replacing <span className="font-semibold text-text-app">"{document.filename}"</span> will purge existing vector embeddings and re-run chunking for the new PDF file.
          </p>

          {/* Upload Dropzone Box */}
          <div className="p-5 rounded-2xl border-2 border-dashed border-white/15 hover:border-primary-app/50 transition-colors flex flex-col items-center justify-center text-center gap-2 bg-card-app/40 cursor-pointer relative">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <UploadCloud size={28} className="text-primary-app animate-pulse" />
            <span className="text-xs font-semibold text-text-app">
              {selectedFile ? selectedFile.name : 'Click or drop replacement PDF file here'}
            </span>
            <span className="text-[10px] text-muted-app">PDF, DOCX, TXT up to 50MB</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              disabled={isReplacing}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-text-app bg-card-app border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={isReplacing || !selectedFile}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-primary-app to-accent-app hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(124,58,237,0.4)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isReplacing ? 'animate-spin' : ''} />
              <span>{isReplacing ? 'Re-indexing...' : 'Replace & Re-index'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReplaceDocumentModal;
