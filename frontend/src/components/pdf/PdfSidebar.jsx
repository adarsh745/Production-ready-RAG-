import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const PdfSidebar = ({
  totalPages = 1,
  currentPage = 1,
  onPageSelect,
  isOpen = true,
  sourcePage = null,
}) => {
  if (!isOpen) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 140, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="h-full bg-sidebar-app border-r border-white/10 flex flex-col overflow-y-auto p-2.5 space-y-3 shrink-0 select-none z-10"
    >
      <div className="text-[10px] font-bold text-muted-app uppercase tracking-wider px-1">
        Page Thumbnails ({totalPages})
      </div>

      <div className="space-y-2">
        {pages.map((pageNum) => {
          const isCurrent = pageNum === currentPage;
          const isSourcePage = pageNum === sourcePage;

          return (
            <div
              key={pageNum}
              onClick={() => onPageSelect(pageNum)}
              className={cn(
                'group relative flex flex-col items-center p-2 rounded-xl border transition-all duration-200 cursor-pointer',
                isCurrent
                  ? 'bg-primary-app/15 border-primary-app shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                  : isSourcePage
                  ? 'bg-amber-500/15 border-amber-500/40'
                  : 'bg-card-app border-white/10 hover:border-white/25 hover:bg-white/5'
              )}
            >
              {/* Miniature Page Skeleton Vessel */}
              <div className="w-16 h-20 bg-bg-app rounded-lg border border-white/10 flex flex-col items-center justify-center space-y-1 p-1 shadow-inner">
                <FileText size={18} className={isCurrent ? 'text-primary-app' : 'text-muted-app/60'} />
                <div className="w-10 h-1 bg-white/10 rounded" />
                <div className="w-8 h-1 bg-white/10 rounded" />
              </div>

              {/* Page Number Label */}
              <span className={cn(
                'text-[10px] font-mono font-bold mt-1.5',
                isCurrent ? 'text-primary-app' : 'text-muted-app group-hover:text-text-app'
              )}>
                Page {pageNum}
              </span>

              {/* Source Highlighted Page Indicator Badge */}
              {isSourcePage && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-[8px] font-extrabold text-black uppercase tracking-wider shadow-md">
                  Source
                </span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PdfSidebar;
