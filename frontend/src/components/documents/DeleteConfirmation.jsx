import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmation = ({ isOpen, document, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen || !document) return null;

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
          className="relative w-full max-w-md glass-effect rounded-3xl p-6 border border-red-500/30 shadow-2xl z-10 space-y-4"
        >
          {/* Header Icon */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-app">Delete Document</h3>
              <p className="text-xs text-muted-app">This action cannot be undone.</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-app leading-relaxed">
            Are you sure you want to permanently delete <span className="font-semibold text-text-app">"{document.filename}"</span>?
            This will purge the metadata from <span className="text-primary-app">PostgreSQL</span>, vector embeddings from <span className="text-secondary-app">ChromaDB</span>, and the PDF file from disk.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-text-app bg-card-app border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={() => onConfirm(document.id)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>{isDeleting ? 'Deleting...' : 'Permanently Delete'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteConfirmation;
