import React from 'react';
import {
  FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw,
  Search, Download, X, Maximize2, Sparkles, Layers
} from 'lucide-react';
import { cn } from '../../utils/helpers';

export const PdfToolbar = ({
  filename = 'Document.pdf',
  currentPage = 1,
  totalPages = 1,
  scale = 1,
  onPageChange,
  onZoomChange,
  onRotate,
  onSearchChange,
  searchTerm = '',
  onDownload,
  onClose,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const zoomPercentages = [50, 75, 100, 125, 150, 200];

  return (
    <div className="h-14 px-4 bg-card-app/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-3 select-none z-20 shrink-0">
      
      {/* Left: Thumbnail Sidebar Toggle & Filename */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className={cn(
            'p-2 rounded-xl border transition-all cursor-pointer',
            isSidebarOpen
              ? 'bg-primary-app/20 border-primary-app/40 text-primary-app'
              : 'border-white/10 text-muted-app hover:text-text-app hover:bg-white/5'
          )}
          title="Toggle page thumbnails sidebar"
        >
          <Layers size={16} />
        </button>

        <div className="flex items-center gap-2 truncate">
          <FileText size={16} className="text-primary-app shrink-0" />
          <span className="text-xs font-bold text-text-app truncate max-w-[180px] sm:max-w-[240px]" title={filename}>
            {filename}
          </span>
        </div>
      </div>

      {/* Center: Page Navigation & Zoom Controls */}
      <div className="flex items-center gap-2">
        {/* Page Navigator */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-bg-app border border-white/10 text-xs">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 text-muted-app hover:text-text-app disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft size={14} />
          </button>

          <span className="font-mono text-[11px] font-bold text-text-app px-1">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1 text-muted-app hover:text-text-app disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Next Page"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-bg-app border border-white/10 text-xs">
          <button
            onClick={() => onZoomChange(Math.max(0.5, scale - 0.25))}
            className="p-1 text-muted-app hover:text-text-app cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>

          <select
            value={Math.round(scale * 100)}
            onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
            className="bg-transparent text-[11px] font-mono font-bold text-text-app outline-none cursor-pointer px-1"
          >
            {zoomPercentages.map((pct) => (
              <option key={pct} value={pct} className="bg-card-app text-text-app">
                {pct}%
              </option>
            ))}
          </select>

          <button
            onClick={() => onZoomChange(Math.min(2.5, scale + 0.25))}
            className="p-1 text-muted-app hover:text-text-app cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        {/* Rotate Button */}
        <button
          onClick={onRotate}
          className="p-2 rounded-xl glass-effect border border-white/10 text-muted-app hover:text-text-app hover:bg-white/5 transition-colors cursor-pointer hidden md:flex"
          title="Rotate Page Clockwise"
        >
          <RotateCw size={14} />
        </button>
      </div>

      {/* Right: Search, Download & Close */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative hidden lg:flex items-center">
          <Search size={12} className="absolute left-2.5 text-muted-app" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search PDF..."
            className="pl-7 pr-3 py-1 rounded-xl bg-bg-app border border-white/10 text-xs text-text-app placeholder-muted-app/60 outline-none w-32 focus:w-44 focus:border-primary-app/40 transition-all font-sans"
          />
        </div>

        {/* Download Button */}
        <button
          onClick={onDownload}
          className="p-2 rounded-xl bg-primary-app/15 border border-primary-app/30 text-primary-app hover:bg-primary-app/25 transition-colors cursor-pointer"
          title="Download PDF File"
        >
          <Download size={15} />
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-muted-app hover:text-text-app hover:bg-white/10 transition-colors cursor-pointer"
          title="Close PDF Drawer"
        >
          <X size={18} />
        </button>
      </div>

    </div>
  );
};

export default PdfToolbar;
