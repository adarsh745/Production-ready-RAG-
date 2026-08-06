import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, Cpu, Scan, Layers, Sparkles,
  Database, HardDrive, Zap, Bot, CheckCircle2, AlertCircle, X, RefreshCw
} from 'lucide-react';
import PipelineStep from './PipelineStep';
import ProgressCircle from './ProgressCircle';
import FloatingChunks from './FloatingChunks';
import EmbeddingAnimation from './EmbeddingAnimation';
import DatabaseAnimation from './DatabaseAnimation';
import AISyncAnimation from './AISyncAnimation';
import UploadSuccess from './UploadSuccess';
import UploadCard from '../FileUpload/UploadCard';

const INITIAL_STEPS = [
  { id: 'upload', number: 1, title: 'Uploading Document', description: 'Transferring document bytes to backend server...', icon: UploadCloud },
  { id: 'postgres', number: 2, title: 'Database Initialization', description: 'Creating document metadata record in PostgreSQL...', icon: HardDrive },
  { id: 'type_detection', number: 3, title: 'Detecting Document Type', description: 'Checking searchability and formatting...', icon: Scan },
  { id: 'ocr', number: 4, title: 'OCR Page Scan', description: 'Running Tesseract OCR on scanned pages...', icon: Scan },
  { id: 'parsing', number: 5, title: 'Parsing Layout & Content', description: 'Extracting text, tables, and page structures...', icon: FileText },
  { id: 'summary', number: 6, title: 'Generating AI Summary', description: 'Synthesizing key topics with LLM...', icon: Sparkles },
  { id: 'chunking', number: 7, title: 'Semantic Chunking', description: 'Splitting document into contextual vector chunks...', icon: Layers },
  { id: 'embedding', number: 8, title: 'Creating Vector Embeddings', description: 'Generating high-dimensional embeddings with OpenAI...', icon: Cpu },
  { id: 'vectordb', number: 9, title: 'Saving into ChromaDB', description: 'Persisting vectors into ChromaDB vector store...', icon: Database },
  { id: 'postgres_update', number: 10, title: 'Saving Metadata', description: 'Marking document as indexed in PostgreSQL...', icon: HardDrive },
  { id: 'optimization', number: 11, title: 'Index Optimization', description: 'Refreshing BM25 hybrid search retrieval index...', icon: Zap },
  { id: 'ai_sync', number: 12, title: 'Connecting to AI', description: 'Syncing knowledge graph with OpenAI model...', icon: Bot },
];

export const UploadPipeline = ({ isOpen, onClose, onFinish }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pipelineState, setPipelineState] = useState('idle'); // 'idle' | 'running' | 'completed' | 'failed'
  const [steps, setSteps] = useState(INITIAL_STEPS.map(s => ({ ...s, status: 'waiting', detail: '' })));
  const [chunkData, setChunkData] = useState({ current: 0, total: 1 });
  const [embeddingPct, setEmbeddingPct] = useState(0);
  const [summaryText, setSummaryText] = useState('');
  const [finalDoc, setFinalDoc] = useState(null);
  const [globalError, setGlobalError] = useState('');

  const abortControllerRef = useRef(null);

  // Update specific step state
  const updateStep = (stepId, status, detail = '') => {
    setSteps((prevSteps) =>
      prevSteps.map((s) => (s.id === stepId ? { ...s, status, detail } : s))
    );
  };

  // Calculate overall progress percentage driven strictly by backend completed steps
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const overallProgress = Math.min(100, Math.round((completedCount / steps.length) * 100));

  // Start Real-time SSE Backend Stream Processing
  const processFileWithBackendStream = async (targetFile) => {
    setFile(targetFile);
    setPipelineState('running');
    setGlobalError('');
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'waiting', detail: '' })));

    const formData = new FormData();
    formData.append('file', targetFile);

    abortControllerRef.current = new AbortController();

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/upload/stream`, {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep unfinished line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', '').trim());
              handleBackendEvent(data);
            } catch (err) {
              console.error('Failed to parse SSE line:', line, err);
            }
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Pipeline SSE stream error:', err);
        setPipelineState('failed');
        setGlobalError(err.message || 'Connection lost to ingestion server');
      }
    }
  };

  // Handle Backend SSE Progress Event
  const handleBackendEvent = (evt) => {
    const { step, status, message, error, detail } = evt;

    if (error || status === 'failed') {
      updateStep(step, 'failed', error || message);
      setPipelineState('failed');
      setGlobalError(error || message || 'Backend processing error');
      return;
    }

    // Step state transition
    if (status === 'running') {
      updateStep(step, 'running', message || detail || '');
    } else if (status === 'completed') {
      updateStep(step, 'completed', message || detail || 'Done');
    }

    // Handle specific step payloads
    if (step === 'chunking' && evt.current_chunk) {
      setChunkData({ current: evt.current_chunk, total: evt.total_chunks || 126 });
    }

    if (step === 'embedding' && evt.progress !== undefined) {
      setEmbeddingPct(evt.progress);
    }

    if (step === 'summary' && evt.summary) {
      setSummaryText(evt.summary);
    }

    if (step === 'finished') {
      setFinalDoc(evt);
      setPipelineState('completed');
      if (onFinish) onFinish(evt);
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileWithBackendStream(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      processFileWithBackendStream(files[0]);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 select-none">
        
        {/* Full-Screen Dark Backdrop with Radial Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (pipelineState !== 'running') onClose();
          }}
          className="absolute inset-0 bg-[#09090B]/90 backdrop-blur-xl"
        />

        {/* Floating Ambient Glowing Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-app/20 blur-[140px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-app/20 blur-[140px] pointer-events-none animate-pulse-slow" />

        {/* Modal Main Glass Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl glass-effect rounded-3xl p-6 sm:p-8 border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border-app shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-app via-accent-app to-secondary-app p-[1px] shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                <div className="h-full w-full bg-card-app rounded-[11px] flex items-center justify-center">
                  <Cpu className="h-5 w-5 text-primary-app animate-pulse" />
                </div>
              </div>
              <div>
                <h2 className="text-base font-bold text-text-app tracking-tight flex items-center gap-2">
                  <span>Real-time RAG Ingestion Pipeline</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-app/15 border border-primary-app/30 text-[#A78BFA] text-[10px] uppercase tracking-wider font-mono">
                    Live Stream
                  </span>
                </h2>
                <p className="text-xs text-muted-app">
                  {file ? `Processing "${file.name}"` : 'Upload your document to begin AI pipeline'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {pipelineState === 'running' && (
                <ProgressCircle progress={overallProgress} size={50} strokeWidth={5} />
              )}
              
              <button
                onClick={() => {
                  if (abortControllerRef.current) abortControllerRef.current.abort();
                  onClose();
                }}
                className="p-2 rounded-xl text-muted-app hover:text-text-app hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body Section */}
          <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
            
            {/* STEP 1: Idle Drag & Drop Selection View */}
            {pipelineState === 'idle' && (
              <UploadCard
                isDragging={isDragging}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileSelect={handleFileSelect}
              />
            )}

            {/* STEP 14: Completed Success View */}
            {pipelineState === 'completed' && (
              <UploadSuccess
                filename={finalDoc?.filename || file?.name}
                pages={finalDoc?.pages}
                chunks={finalDoc?.chunks}
                onStartChat={onClose}
              />
            )}

            {/* Global Error Alert */}
            {pipelineState === 'failed' && globalError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{globalError}</span>
                </div>
                <button
                  onClick={() => file && processFileWithBackendStream(file)}
                  className="px-3 py-1.5 rounded-xl bg-red-500/20 text-white hover:bg-red-500/30 transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Retry Pipeline</span>
                </button>
              </div>
            )}

            {/* Timeline Steps Stream View */}
            {(pipelineState === 'running' || pipelineState === 'failed') && (
              <div className="space-y-3">
                {steps.map((step) => (
                  <PipelineStep
                    key={step.id}
                    stepId={step.id}
                    stepNumber={step.number}
                    title={step.title}
                    description={step.description}
                    status={step.status}
                    detail={step.detail}
                    icon={step.icon}
                    onRetry={() => file && processFileWithBackendStream(file)}
                  >
                    {/* Step Specific 3D Component Visualizations */}
                    {step.id === 'chunking' && (
                      <FloatingChunks currentChunk={chunkData.current} totalChunks={chunkData.total} />
                    )}

                    {step.id === 'embedding' && (
                      <EmbeddingAnimation progress={embeddingPct} />
                    )}

                    {step.id === 'vectordb' && (
                      <DatabaseAnimation type="chromadb" label="ChromaDB Vector Store" />
                    )}

                    {step.id === 'postgres' && (
                      <DatabaseAnimation type="postgres" label="PostgreSQL Database" />
                    )}

                    {step.id === 'ai_sync' && (
                      <AISyncAnimation />
                    )}

                    {step.id === 'summary' && summaryText && (
                      <div className="p-3 rounded-xl bg-bg-app border border-border-app text-xs text-text-app/90 italic font-sans leading-relaxed">
                        "{summaryText}"
                      </div>
                    )}
                  </PipelineStep>
                ))}
              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default UploadPipeline;
