import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Check, X } from 'lucide-react';

export const RenameDocumentModal = ({ isOpen, document, onConfirm, onCancel, isSaving }) => {
  const [filename, setFilename] = useState('');

  useEffect(() => {
    if (document) {
      setFilename(document.filename || '');
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filename.trim()) {
      onConfirm(document.id, filename.trim());
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
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md glass-effect rounded-3xl p-6 border border-white/15 shadow-2xl z-10 space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border-app">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Edit2 size={18} />
              </div>
              <h3 className="text-sm font-bold text-text-app">Rename Document</h3>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 rounded-xl text-muted-app hover:text-text-app transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-app">Filename</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter document name..."
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-text-app outline-none border border-white/10 focus:border-primary-app/50 font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-text-app bg-card-app border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || !filename.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary-app hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(124,58,237,0.4)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check size={14} />
              <span>{isSaving ? 'Saving...' : 'Save Name'}</span>
            </button>
          </div>
        </motion.form>
      </div>
    </AnimatePresence>
  );
};

export default RenameDocumentModal;
