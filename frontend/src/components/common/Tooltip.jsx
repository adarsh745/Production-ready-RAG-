import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export const Tooltip = ({
  children,
  content,
  position = 'top', // 'top' | 'bottom' | 'left' | 'right'
  className = '',
  delay = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeout;

  const showTooltip = () => {
    timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearInterval(timeout);
    setIsVisible(false);
  };

  const positionClasses = {
    top: '-translate-y-2 bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'translate-y-2 top-full left-1/2 -translate-x-1/2 mt-2',
    left: '-translate-x-2 right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'translate-x-2 left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-card-app border-x-transparent border-b-transparent border-[5px]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-card-app border-x-transparent border-t-transparent border-[5px]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-card-app border-y-transparent border-r-transparent border-[5px]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-card-app border-y-transparent border-l-transparent border-[5px]',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-2.5 py-1.5 text-xs font-medium text-text-app bg-card-app border border-border-app rounded-md whitespace-nowrap shadow-xl pointer-events-none',
              positionClasses[position],
              className
            )}
          >
            {content}
            <div className={cn('absolute w-0 h-0 border-solid', arrowClasses[position])} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
