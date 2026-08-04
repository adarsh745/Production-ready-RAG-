import React from 'react';
import { FileText, Percent, BookOpen, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';
import { cn } from '../../utils/helpers';

export const SourceCard = ({ source, onClick, isActive = false }) => {
  const { title, similarity, confidence, page, content } = source;

  const scoreColor = similarity >= 0.85 
    ? 'text-green-400' 
    : similarity >= 0.70 
      ? 'text-yellow-400' 
      : 'text-orange-400';

  return (
    <div
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-2xl transition-all duration-300 border cursor-pointer select-none text-left flex flex-col gap-2.5',
        isActive
          ? 'bg-white/[0.05] border-primary-app/40 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
          : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] hover:border-white/15'
      )}
    >
      {/* File Header Info */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-muted-app shrink-0">
            <FileText size={14} className="text-primary-app" />
          </div>
          <span className="text-xs font-semibold text-text-app truncate hover:text-white transition-colors">
            {title}
          </span>
        </div>
        <Badge variant={similarity >= 0.8 ? 'primary' : 'glow'} className="shrink-0 text-[9px] px-2 py-0.5">
          {confidence}
        </Badge>
      </div>

      {/* Excerpt Snippet */}
      <p className="text-[11px] text-muted-app/80 leading-normal line-clamp-3 select-text">
        "{content}"
      </p>

      {/* Metadata Indicators (Score, Page) */}
      <div className="flex items-center justify-between border-t border-white/[0.04] pt-2.5 mt-0.5 text-[9px] font-bold text-muted-app uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <Percent size={10} className="text-primary-app" />
          <span>Similarity: <span className={scoreColor}>{Math.round(similarity * 100)}%</span></span>
        </div>
        
        <div className="flex items-center gap-1">
          <BookOpen size={10} className="text-secondary-app" />
          <span>Page {page}</span>
        </div>
      </div>
      
    </div>
  );
};

export default SourceCard;
