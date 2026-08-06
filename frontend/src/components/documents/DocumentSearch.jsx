import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

export const DocumentSearch = ({ searchTerm, onSearchChange, resultCount = 0 }) => {
  return (
    <div className="relative flex-1 min-w-[240px] select-none">
      <div className="relative flex items-center">
        <Search size={16} className="absolute left-3.5 text-muted-app pointer-events-none" />
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by filename, summary content, or keywords..."
          className="w-full pl-10 pr-10 py-2.5 rounded-2xl glass-input text-xs text-text-app placeholder-muted-app/60 outline-none border border-white/10 focus:border-primary-app/50 transition-all shadow-inner"
        />

        {searchTerm ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 p-1 rounded-full text-muted-app hover:text-text-app transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        ) : (
          <div className="absolute right-3 text-[10px] font-mono text-muted-app/60 flex items-center gap-1">
            <Sparkles size={10} className="text-primary-app" />
            <span>Search</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSearch;
