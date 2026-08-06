import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import UploadCard from './UploadCard';
import UploadProgress from './UploadProgress';
import FilePreview from './FilePreview';

export const FileUpload = ({ onUploadComplete, maxFiles = 10, accept }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeUploads, setActiveUploads] = useState([]);
  const [completedFiles, setCompletedFiles] = useState([]);

  // Handle Drag Over
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  // Handle Drag Leave
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // Simulate File Upload Process with realistic progress updates
  const startFileUpload = (file) => {
    const uploadId = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newUploadItem = {
      id: uploadId,
      file,
      progress: 0,
      isCompleted: false,
      error: null,
    };

    setActiveUploads((prev) => [newUploadItem, ...prev]);

    // Simulate progress increments
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 18) + 12;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        // Update active upload status to completed
        setActiveUploads((prev) =>
          prev.map((item) =>
            item.id === uploadId ? { ...item, progress: 100, isCompleted: true } : item
          )
        );

        // Move to completed files after short animation delay
        setTimeout(() => {
          setActiveUploads((prev) => prev.filter((item) => item.id !== uploadId));
          setCompletedFiles((prev) => {
            const updated = [{ id: uploadId, file, uploadedAt: new Date() }, ...prev];
            if (onUploadComplete) onUploadComplete(updated);
            return updated;
          });
        }, 800);
      } else {
        setActiveUploads((prev) =>
          prev.map((item) =>
            item.id === uploadId ? { ...item, progress: currentProgress } : item
          )
        );
      }
    }, 200);
  };

  // Process Selected / Dropped Files
  const handleFiles = (files) => {
    const validFiles = Array.from(files).slice(0, maxFiles);
    validFiles.forEach((file) => {
      startFileUpload(file);
    });
  };

  // Handle Drop Event
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  // Cancel Active Upload
  const handleCancelUpload = (uploadId) => {
    setActiveUploads((prev) => prev.filter((item) => item.id !== uploadId));
  };

  // Delete Completed File
  const handleDeleteCompletedFile = (fileId) => {
    setCompletedFiles((prev) => {
      const updated = prev.filter((item) => item.id !== fileId);
      if (onUploadComplete) onUploadComplete(updated);
      return updated;
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* 3D Drag and Drop Card Zone */}
      <UploadCard
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFileSelect={handleFiles}
        accept={accept}
      />

      {/* Active Uploading Files Progress Section */}
      <AnimatePresence>
        {activeUploads.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-app uppercase tracking-wider px-1">
              Active Uploads ({activeUploads.length})
            </h4>
            {activeUploads.map((item) => (
              <UploadProgress
                key={item.id}
                fileItem={item}
                onCancel={handleCancelUpload}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Completed Uploaded Files List */}
      <FilePreview
        files={completedFiles}
        onDeleteFile={handleDeleteCompletedFile}
      />

    </div>
  );
};

export default FileUpload;
