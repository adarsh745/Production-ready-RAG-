import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Image as ImageIcon, FileCode, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const UploadCard = ({ isDragging, onDragOver, onDragLeave, onDrop, onFileSelect, accept = ".pdf,.docx,.txt,.png,.jpg,.jpeg,.svg,.webp" }) => {
  const fileInputRef = useRef(null);

  const handleCardClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div className="w-full relative group">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Main Drag-and-Drop Area Container */}
      <motion.div
        onClick={handleCardClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? 'var(--primary-app)' : 'var(--border-app)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={cn(
          'relative w-full rounded-3xl p-6 md:p-8 text-center cursor-pointer overflow-hidden select-none transition-all duration-300',
          'glass-effect border-2 border-dashed shadow-2xl',
          isDragging
            ? 'border-primary-app bg-primary-app/10 shadow-[0_0_50px_rgba(124,58,237,0.25)]'
            : 'hover:border-primary-app/50 hover:bg-card-app/80'
        )}
      >
        {/* Background Ambient Glow Orbs */}
        <div 
          className={cn(
            'absolute inset-0 bg-gradient-to-tr from-primary-app/20 via-accent-app/10 to-secondary-app/20 blur-3xl opacity-50 transition-opacity duration-500 pointer-events-none',
            isDragging ? 'opacity-80 scale-110' : 'group-hover:opacity-75'
          )}
        />

        {/* 3D Floating Stage Centerpiece */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[220px]">
          
          {/* 3D Folder & File Canvas */}
          <div className="relative w-36 h-36 flex items-center justify-center perspective-[1000px]">
            
            {/* Ambient Base Shadow Ellipse */}
            <motion.div
              animate={{
                scale: isDragging ? [1, 1.2, 1] : [1, 0.85, 1],
                opacity: isDragging ? 0.6 : [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-2 w-28 h-6 rounded-[100%] bg-gradient-to-r from-primary-app via-accent-app to-secondary-app blur-md -z-10"
            />

            {/* Floating 3D Folder Container */}
            <motion.div
              animate={
                isDragging
                  ? { y: -8, rotateX: 12, rotateY: 0, scale: 1.05 }
                  : {
                      y: [0, -12, 0],
                      rotateX: [6, -6, 6],
                      rotateY: [-8, 8, -8],
                    }
              }
              transition={{
                duration: isDragging ? 0.3 : 4.5,
                repeat: isDragging ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-28 h-24 preserve-3d"
            >
              {/* Folder Back Plate */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#9333EA] to-[#3B82F6] shadow-xl border border-white/20 overflow-hidden">
                <div className="absolute top-0 left-0 w-12 h-3 bg-white/20 rounded-br-lg" />
              </div>

              {/* Animated Dropping Document (Shown during Dragging / Hover) */}
              <motion.div
                initial={{ y: -30, opacity: 0, scale: 0.8 }}
                animate={
                  isDragging
                    ? { y: 10, opacity: 1, scale: 0.95 }
                    : { y: [ -20, -5, -20 ], opacity: 0.9, scale: 0.85 }
                }
                transition={{ duration: isDragging ? 0.4 : 3, repeat: isDragging ? 0 : Infinity, ease: 'easeInOut' }}
                className="absolute left-4 right-4 top-1 h-20 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-white/40 backdrop-blur-md p-2.5 shadow-lg flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="w-4 h-4 rounded-md bg-primary-app/20 flex items-center justify-center">
                    <FileText size={10} className="text-primary-app" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-accent-app animate-ping" />
                </div>
                <div className="space-y-1">
                  <div className="w-3/4 h-1.5 rounded bg-primary-app/30" />
                  <div className="w-1/2 h-1 rounded bg-secondary-app/30" />
                </div>
              </motion.div>

              {/* Folder Front Flap (Opens when Dragging) */}
              <motion.div
                animate={{
                  rotateX: isDragging ? -35 : 0,
                  transformOrigin: 'bottom',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute bottom-0 inset-x-0 h-16 rounded-2xl bg-gradient-to-tr from-[#6D28D9]/90 via-[#7C3AED]/80 to-[#3B82F6]/90 backdrop-blur-xl border-t border-white/30 shadow-2xl flex items-center justify-center"
              >
                <div className="w-8 h-1 rounded-full bg-white/40" />
              </motion.div>
            </motion.div>

            {/* Glowing Particle Sparkles */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              <Sparkles size={16} className="absolute -top-1 left-2 text-accent-app animate-pulse" />
              <Sparkles size={14} className="absolute bottom-1 right-2 text-secondary-app animate-pulse" />
            </motion.div>
          </div>

          {/* Text Instructions */}
          <div className="mt-4 space-y-1.5 z-10">
            <h3 className="text-base sm:text-lg font-bold text-text-app tracking-tight flex items-center justify-center gap-2">
              <span>{isDragging ? 'Drop your files here' : 'Drag & Drop files or Browse'}</span>
              <UploadCloud size={18} className="text-primary-app animate-bounce" />
            </h3>
            <p className="text-xs text-muted-app max-w-sm mx-auto">
              Supports <span className="text-text-app font-semibold">PDF, DOCX, TXT</span> and <span className="text-text-app font-semibold">Images</span> up to 50MB
            </p>
          </div>

          {/* File Format Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'PDF', icon: FileText, color: 'text-red-400 border-red-500/20 bg-red-500/10' },
              { label: 'DOCX', icon: FileText, color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' },
              { label: 'TXT', icon: FileCode, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
              { label: 'Images', icon: ImageIcon, color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' },
            ].map((tag) => {
              const Icon = tag.icon;
              return (
                <span
                  key={tag.label}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border backdrop-blur-md transition-transform group-hover:scale-105',
                    tag.color
                  )}
                >
                  <Icon size={12} />
                  <span>{tag.label}</span>
                </span>
              );
            })}
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default UploadCard;
