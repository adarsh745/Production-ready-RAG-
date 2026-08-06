import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PdfToolbar from './PdfToolbar';
import PdfSidebar from './PdfSidebar';
import PdfViewer from './PdfViewer';

export const PdfDrawer = ({ isOpen, onClose, sourceDoc }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (sourceDoc) {
      if (sourceDoc.page && sourceDoc.page > 0) {
        setCurrentPage(sourceDoc.page);
      }
    }
  }, [sourceDoc]);

  if (!isOpen) return null;

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  const BACKEND_URL = 'http://localhost:8000';

  const docId = sourceDoc?.document_id || sourceDoc?.id;
  const filename = sourceDoc?.filename || 'Document.pdf';

  let fileUrl = null;
  if (sourceDoc) {
    if (docId) {
      fileUrl = `${API_BASE_URL}/documents/view/${docId}`;
    } else if (filename) {
      fileUrl = `${BACKEND_URL}/uploads/${filename}`;
    } else if (sourceDoc.url) {
      fileUrl = sourceDoc.url.startsWith('http')
        ? sourceDoc.url
        : `${BACKEND_URL}${sourceDoc.url.startsWith('/') ? '' : '/'}${sourceDoc.url}`;
    }
  }

  const handleDownload = () => {
    if (docId) {
      window.open(`${API_BASE_URL}/documents/download/${docId}`, '_blank');
    } else if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-hidden select-none">
        
        {/* Dark Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Right-Side Sliding PDF Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 right-0 w-full max-w-5xl glass-effect border-l border-white/15 shadow-2xl flex flex-col justify-between overflow-hidden z-10"
        >
          {/* Top PDF Header Toolbar */}
          <PdfToolbar
            filename={filename}
            currentPage={currentPage}
            totalPages={totalPages}
            scale={scale}
            onPageChange={setCurrentPage}
            onZoomChange={setScale}
            onRotate={() => setRotation((r) => (r + 90) % 360)}
            onSearchChange={setSearchTerm}
            searchTerm={searchTerm}
            onDownload={handleDownload}
            onClose={onClose}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Main Viewer & Sidebar Body Area */}
          <div className="flex-1 flex overflow-hidden relative">
            <PdfSidebar
              totalPages={totalPages}
              currentPage={currentPage}
              onPageSelect={setCurrentPage}
              isOpen={isSidebarOpen}
              sourcePage={sourceDoc?.page}
            />

            <PdfViewer
              fileUrl={fileUrl}
              currentPage={currentPage}
              scale={scale}
              rotation={rotation}
              sourceDoc={sourceDoc}
              onTotalPagesChange={setTotalPages}
            />
          </div>

        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default PdfDrawer;
