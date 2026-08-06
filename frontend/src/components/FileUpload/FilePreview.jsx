import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image as ImageIcon, FileCode, Trash2, Eye, ExternalLink } from 'lucide-react';
import { formatFileSize, getFileIcon } from './UploadProgress';
import { cn } from '../../utils/helpers';

export const FilePreview = ({ files = [], onDeleteFile, onPreviewFile }) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="w-full space-y-3 mt-6">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold text-text-app uppercase tracking-wider flex items-center gap-2">
          <span>Uploaded Knowledge Files</span>
          <span className="px-2 py-0.5 rounded-full bg-primary-app/15 text-primary-app text-[10px]">
            {files.length}
          </span>
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence>
          {files.map((fileItem) => {
            const file = fileItem.file || fileItem;
            const { icon: Icon, color: iconColor } = getFileIcon(file.type || file.name);

            return (
              <motion.div
                key={fileItem.id || file.name}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="group relative rounded-2xl glass-effect p-3.5 border border-border-app hover:border-primary-app/40 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={cn('p-2.5 rounded-xl flex items-center justify-center shrink-0 border border-white/10', iconColor)}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-text-app truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-app mt-0.5 font-mono">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {onPreviewFile && (
                    <button
                      onClick={() => onPreviewFile(fileItem)}
                      className="p-1.5 rounded-lg text-muted-app hover:text-text-app hover:bg-white/10 transition-colors cursor-pointer"
                      title="Preview file"
                    >
                      <Eye size={14} />
                    </button>
                  )}

                  {onDeleteFile && (
                    <button
                      onClick={() => onDeleteFile(fileItem.id || file.name)}
                      className="p-1.5 rounded-lg text-muted-app hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete file"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FilePreview;
