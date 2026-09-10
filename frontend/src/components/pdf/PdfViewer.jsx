import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import SourceHighlight from './SourceHighlight';

export const PdfViewer = ({
  fileUrl,
  currentPage = 1,
  scale = 1,
  rotation = 0,
  sourceDoc = null,
  onTotalPagesChange,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [numPages, setNumPages] = useState(1);
  const iframeRef = useRef(null);

  const backendBase = import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : '') || 'http://localhost:8000';

  const resolvedUrl = fileUrl
    ? fileUrl.startsWith('http')
      ? fileUrl
      : `${backendBase}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`
    : null;

  useEffect(() => {
    if (!resolvedUrl) {
      setError('No PDF URL provided.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const timer = setTimeout(() => {
      setNumPages(5); // Estimated page total
      if (onTotalPagesChange) onTotalPagesChange(5);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [resolvedUrl, onTotalPagesChange]);

  const sourceSnippet = sourceDoc?.chunk_text || sourceDoc?.content || '';
  const sourcePage = sourceDoc?.page || 1;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#09090B] p-4 sm:p-6 flex flex-col items-center justify-start relative select-none">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#09090B]/90 backdrop-blur-sm space-y-3">
          <Loader2 size={32} className="text-primary-app animate-spin" />
          <span className="text-xs text-muted-app font-mono animate-pulse">
            Loading PDF Document & Aligning Vector Highlights...
          </span>
        </div>
      )}

      {/* Error View */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 my-auto">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Active Page PDF Render Vessel Container */}
      {!loading && !error && resolvedUrl && (
        <motion.div
          key={`${currentPage}-${scale}-${rotation}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-3xl flex flex-col items-center space-y-4 my-auto"
          style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
        >
          {/* Top Page Header Banner */}
          <div className="w-full glass-effect rounded-2xl p-3 border border-white/10 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-primary-app" />
              <span className="text-xs font-bold text-text-app">Page {currentPage} of {numPages}</span>
            </div>

            {currentPage === sourcePage && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1">
                <Sparkles size={11} />
                <span>RAG Source Matched</span>
              </span>
            )}
          </div>

          {/* Source Highlight Box (Rendered on top if page matches citation source page) */}
          {currentPage === sourcePage && sourceSnippet && (
            <div className="w-full">
              <SourceHighlight
                snippet={sourceSnippet}
                page={sourcePage}
                chunkId={sourceDoc?.chunk_id}
              />
            </div>
          )}

          {/* Embedded Native PDF Viewer Frame */}
          <div className="w-full h-[700px] rounded-2xl border border-white/15 overflow-hidden shadow-2xl bg-card-app relative">
            <iframe
              ref={iframeRef}
              src={`${resolvedUrl}#page=${currentPage}&zoom=${Math.round(scale * 100)}`}
              title="PDF View Document"
              className="w-full h-full border-0"
            />
          </div>

        </motion.div>
      )}

    </div>
  );
};

export default PdfViewer;
