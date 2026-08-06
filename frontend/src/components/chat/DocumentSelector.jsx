import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckSquare, Square, Search, X, Check, Filter } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const DocumentSelector = ({
  documents = [],
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  onClearAll,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const isAllSelected = documents.length > 0 && selectedIds.length === documents.length;

  return (
    <AnimatePresence>
      <div className="absolute bottom-full mb-3 left-0 w-full max-w-sm glass-effect rounded-2xl border border-white/15 shadow-2xl p-4 z-40 select-none space-y-3">
        
        {/* Header Title & Quick Select Actions */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary-app/20 text-primary-app">
              <Filter size={14} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-app">Filter Context Documents</h4>
              <p className="text-[10px] text-muted-app">
                {selectedIds.length === 0
                  ? 'Searching across ALL documents'
                  : `Searching strictly within ${selectedIds.length} selected ${selectedIds.length === 1 ? 'document' : 'documents'}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-app hover:text-text-app transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative flex items-center">
          <Search size={12} className="absolute left-3 text-muted-app" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter files..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl glass-input text-xs text-text-app outline-none border border-white/10 placeholder-muted-app/60 font-sans"
          />
        </div>

        {/* Action Toggle Buttons */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-app px-1">
          <button
            onClick={isAllSelected ? onClearAll : onSelectAll}
            className="hover:text-primary-app transition-colors cursor-pointer flex items-center gap-1"
          >
            {isAllSelected ? <Square size={12} /> : <CheckSquare size={12} />}
            <span>{isAllSelected ? 'Unselect All' : 'Select All Files'}</span>
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              Clear ({selectedIds.length})
            </button>
          )}
        </div>

        {/* Document Items List */}
        <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
          {filteredDocs.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-app">
              No matching documents found.
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isSelected = selectedIds.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  onClick={() => onToggleSelect(doc.id)}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-xl border transition-all duration-200 cursor-pointer text-xs font-medium',
                    isSelected
                      ? 'bg-primary-app/15 border-primary-app/40 text-text-app shadow-sm'
                      : 'bg-card-app/40 border-white/5 text-muted-app hover:text-text-app hover:bg-white/5'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={14} className={isSelected ? 'text-primary-app' : 'text-muted-app'} />
                    <span className="truncate" title={doc.filename}>{doc.filename}</span>
                  </div>

                  <div className={cn(
                    'w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors',
                    isSelected ? 'bg-primary-app border-primary-app text-white' : 'border-white/20'
                  )}>
                    {isSelected && <Check size={10} />}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </AnimatePresence>
  );
};

export default DocumentSelector;
