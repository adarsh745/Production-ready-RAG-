import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Circle, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const PipelineStep = ({
  stepId,
  stepNumber,
  title,
  description,
  status = 'waiting', // 'waiting' | 'running' | 'completed' | 'failed'
  detail,
  error,
  icon: Icon,
  children,
  onRetry,
}) => {
  const isWaiting = status === 'waiting';
  const isRunning = status === 'running';
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'relative flex items-start gap-4 p-3.5 rounded-2xl border transition-all duration-300',
        isRunning
          ? 'glass-effect border-primary-app/50 bg-primary-app/10 shadow-[0_0_20px_rgba(124,58,237,0.15)]'
          : isCompleted
          ? 'bg-card-app/60 border-border-app'
          : isFailed
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-card-app/30 border-border-app/40 opacity-60'
      )}
    >
      {/* Left Step Status Circle / Indicator */}
      <div className="relative shrink-0 mt-0.5">
        {isCompleted ? (
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={16} />
          </div>
        ) : isFailed ? (
          <div className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
            <XCircle size={16} />
          </div>
        ) : isRunning ? (
          <div className="w-7 h-7 rounded-full bg-primary-app/20 border border-primary-app/50 text-primary-app flex items-center justify-center">
            <Loader2 size={16} className="animate-spin" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-border-app/30 border border-border-app text-muted-app flex items-center justify-center text-[10px] font-mono font-bold">
            {stepNumber}
          </div>
        )}
      </div>

      {/* Main Step Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={cn(
            'text-xs font-bold tracking-wide flex items-center gap-1.5',
            isRunning ? 'text-primary-app' : isCompleted ? 'text-text-app' : isFailed ? 'text-red-400' : 'text-muted-app'
          )}>
            {Icon && <Icon size={14} className="shrink-0" />}
            <span>{title}</span>
          </h4>

          {/* Status Badge */}
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider',
              isRunning
                ? 'bg-primary-app/20 text-primary-app border border-primary-app/30 animate-pulse'
                : isCompleted
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : isFailed
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-border-app/40 text-muted-app'
            )}
          >
            {status}
          </span>
        </div>

        {/* Description or Dynamic Detail */}
        <p className="text-[11px] text-muted-app mt-0.5 leading-snug">
          {detail || description}
        </p>

        {/* Failed Error Message & Retry */}
        {isFailed && (
          <div className="mt-2 flex items-center justify-between gap-2 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-300">
            <span>{error || 'Step processing failed.'}</span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 text-white hover:bg-red-500/30 transition-colors font-semibold cursor-pointer shrink-0"
              >
                <RefreshCw size={10} />
                <span>Retry</span>
              </button>
            )}
          </div>
        )}

        {/* Nested Active Step Visualization (Floating Chunks, Embedding, etc.) */}
        {isRunning && children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 pt-2 border-t border-border-app/40"
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PipelineStep;
