import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, FileCode, CheckCircle2, X, Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType) => {
  if (fileType.includes('image')) return { icon: ImageIcon, color: 'text-purple-400 bg-purple-500/10' };
  if (fileType.includes('pdf')) return { icon: FileText, color: 'text-red-400 bg-red-500/10' };
  if (fileType.includes('word') || fileType.includes('document')) return { icon: FileText, color: 'text-blue-400 bg-blue-500/10' };
  return { icon: FileCode, color: 'text-emerald-400 bg-emerald-500/10' };
};

export const UploadProgress = ({ fileItem, onCancel }) => {
  const { file, progress, isCompleted, error } = fileItem;
  const { icon: Icon, color: iconColor } = getFileIcon(file.type || file.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full glass-effect rounded-2xl p-4 border border-border-app relative overflow-hidden shadow-lg"
    >
      {/* Background Subtle Progress Fill */}
      <div
        className="absolute inset-y-0 left-0 bg-primary-app/10 transition-all duration-300 pointer-events-none"
        style={{ width: `${progress}%` }}
      />

      <div className="relative z-10 flex items-center justify-between gap-4">
        
        {/* Left: Icon & File Info */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className={cn('p-3 rounded-xl flex items-center justify-center shrink-0 border border-white/10', iconColor)}>
            <Icon size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-text-app truncate" title={file.name}>
                {file.name}
              </span>
              <span className="text-[11px] font-mono font-semibold text-muted-app shrink-0">
                {isCompleted ? '100%' : `${progress}%`}
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-2 rounded-full bg-bg-app border border-border-app overflow-hidden relative">
              <motion.div
                className={cn(
                  'h-full rounded-full transition-all duration-200',
                  error
                    ? 'bg-red-500'
                    : isCompleted
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                    : 'bg-gradient-to-r from-primary-app via-accent-app to-secondary-app animate-pulse-slow'
                )}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            {/* Sub-status Info */}
            <div className="flex items-center justify-between mt-1 text-[10px] text-muted-app">
              <span>{formatFileSize(file.size)}</span>
              <span>
                {error ? (
                  <span className="text-red-400 font-medium">{error}</span>
                ) : isCompleted ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    Upload Complete
                  </span>
                ) : (
                  <span>Uploading...</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right Status Badge & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="p-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
            >
              <CheckCircle2 size={18} />
            </motion.div>
          ) : (
            <Loader2 size={18} className="text-primary-app animate-spin" />
          )}

          {onCancel && (
            <button
              onClick={() => onCancel(fileItem.id)}
              className="p-1.5 rounded-xl text-muted-app hover:text-text-app hover:bg-white/10 transition-all cursor-pointer"
              title="Remove file"
            >
              <X size={14} />
            </button>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default UploadProgress;
