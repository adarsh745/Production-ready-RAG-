import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, FolderKanban, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import DocumentStats from '../components/documents/DocumentStats';
import DocumentSearch from '../components/documents/DocumentSearch';
import DocumentFilters from '../components/documents/DocumentFilters';
import DocumentCard from '../components/documents/DocumentCard';
import DocumentDetailsDrawer from '../components/documents/DocumentDetailsDrawer';
import DeleteConfirmation from '../components/documents/DeleteConfirmation';
import RenameDocumentModal from '../components/documents/RenameDocumentModal';
import ReplaceDocumentModal from '../components/documents/ReplaceDocumentModal';
import UploadPipeline from '../components/UploadPipeline';
import { documentService } from '../services/documentService';

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'indexed' | 'processing' | 'failed'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name'

  // Active Modals & Drawer State
  const [selectedDocForDetails, setSelectedDocForDetails] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [docToRename, setDocToRename] = useState(null);
  const [docToReplace, setDocToReplace] = useState(null);
  const [isUploadPipelineOpen, setIsUploadPipelineOpen] = useState(false);

  // Loading States
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  // Fetch Documents and Stats from Backend API
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await documentService.getDocuments();
      setDocuments(data.documents || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError('Unable to load documents from server. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Filter & Sort Documents Calculation
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        // Status Filter
        const status = doc.status || (doc.is_indexed ? 'indexed' : 'processing');
        if (statusFilter !== 'all' && status !== statusFilter) {
          return false;
        }

        // Search Term Filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim();
          const nameMatch = doc.filename.toLowerCase().includes(term);
          const summaryMatch = (doc.summary || '').toLowerCase().includes(term);
          const tagMatch = (doc.keywords || []).some((kw) => kw.toLowerCase().includes(term));
          return nameMatch || summaryMatch || tagMatch;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.uploaded_at || 0) - new Date(a.uploaded_at || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.uploaded_at || 0) - new Date(b.uploaded_at || 0);
        }
        if (sortBy === 'name') {
          return a.filename.localeCompare(b.filename);
        }
        return 0;
      });
  }, [documents, searchTerm, statusFilter, sortBy]);

  // Handle Download PDF
  const handleDownload = (doc) => {
    if (doc.filepath) {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      window.open(`${API_BASE_URL}/documents/download/${doc.id}`, '_blank');
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async (docId) => {
    setIsDeleting(true);
    try {
      await documentService.deleteDocument(docId);
      setDocToDelete(null);
      await loadDocuments(); // Refresh UI automatically
    } catch (err) {
      console.error('Failed to delete document:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Rename Confirmation
  const handleConfirmRename = async (docId, newFilename) => {
    setIsSavingName(true);
    try {
      await documentService.renameDocument(docId, newFilename);
      setDocToRename(null);
      await loadDocuments(); // Refresh UI automatically
    } catch (err) {
      console.error('Failed to rename document:', err);
    } finally {
      setIsSavingName(false);
    }
  };

  // Handle Replace Confirmation
  const handleConfirmReplace = async (docId, file) => {
    setIsReplacing(true);
    try {
      // Trigger live ingestion stream for replacement
      setDocToReplace(null);
      setIsUploadPipelineOpen(true);
    } catch (err) {
      console.error('Failed to replace document:', err);
    } finally {
      setIsReplacing(false);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 select-none max-w-7xl mx-auto">
      
      {/* Page Title & Refresh Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-text-app tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-app/15 border border-primary-app/20 text-primary-app">
              <FolderKanban size={20} />
            </div>
            <span>Knowledge Base Documents</span>
          </h1>
          <p className="text-xs text-muted-app">
            Manage, inspect vector metadata, filter, and index files into your production RAG pipeline.
          </p>
        </div>

        <button
          onClick={loadDocuments}
          disabled={isLoading}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl glass-effect border border-white/10 text-xs font-semibold text-text-app hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin text-primary-app' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Top Statistics Metrics Row */}
      <DocumentStats stats={stats} />

      {/* Search & Filter Toolbar Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-3xl glass-effect border border-white/10 shadow-lg">
        <DocumentSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          resultCount={filteredDocuments.length}
        />

        <DocumentFilters
          sortBy={sortBy}
          onSortChange={setSortBy}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onUploadClick={() => setIsUploadPipelineOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-48 rounded-2xl glass-effect border border-white/10 p-5 space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
              <div className="h-12 bg-white/5 rounded-xl" />
              <div className="h-4 bg-white/10 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        /* Empty State */
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 glass-effect rounded-3xl border border-white/10">
          <div className="p-4 rounded-2xl bg-primary-app/10 border border-primary-app/20 text-primary-app">
            <FileText size={36} />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-text-app">No Documents Found</h3>
            <p className="text-xs text-muted-app leading-relaxed">
              {searchTerm || statusFilter !== 'all'
                ? 'No documents match your active search or filter parameters.'
                : 'Upload your first document to index into ChromaDB vector store.'}
            </p>
          </div>

          <button
            onClick={() => setIsUploadPipelineOpen(true)}
            className="px-4 py-2.5 rounded-2xl font-semibold text-xs text-white bg-gradient-to-r from-primary-app via-accent-app to-secondary-app hover:opacity-95 shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Upload Document</span>
          </button>
        </div>
      ) : (
        /* Document Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onViewDetails={(d) => setSelectedDocForDetails(d)}
                onDownload={handleDownload}
                onReplace={(d) => setDocToReplace(d)}
                onRename={(d) => setDocToRename(d)}
                onDelete={(d) => setDocToDelete(d)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Details Side Drawer */}
      <DocumentDetailsDrawer
        document={selectedDocForDetails}
        isOpen={Boolean(selectedDocForDetails)}
        onClose={() => setSelectedDocForDetails(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        document={docToDelete}
        isOpen={Boolean(docToDelete)}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDocToDelete(null)}
      />

      {/* Rename Document Modal */}
      <RenameDocumentModal
        document={docToRename}
        isOpen={Boolean(docToRename)}
        isSaving={isSavingName}
        onConfirm={handleConfirmRename}
        onCancel={() => setDocToRename(null)}
      />

      {/* Replace Document Modal */}
      <ReplaceDocumentModal
        document={docToReplace}
        isOpen={Boolean(docToReplace)}
        isReplacing={isReplacing}
        onConfirm={handleConfirmReplace}
        onCancel={() => setDocToReplace(null)}
      />

      {/* Real-time AI Upload Pipeline Modal */}
      <UploadPipeline
        isOpen={isUploadPipelineOpen}
        onClose={() => setIsUploadPipelineOpen(false)}
        onFinish={loadDocuments}
      />
    </div>
  );
};

export default DocumentsPage;
