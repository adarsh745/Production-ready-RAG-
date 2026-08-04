import React from 'react';
import { motion } from 'framer-motion';

export const TypingIndicator = () => {
  const dotVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '100%',
    },
  };

  const containerTransition = {
    start: {
      transition: {
        staggerChildren: 0.15,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  };

  return (
    <div className="flex items-center gap-1.5 py-2 px-3 bg-white/[0.03] border border-white/5 rounded-2xl w-fit">
      <motion.div
        className="flex items-center gap-1 h-3"
        variants={containerTransition}
        initial="start"
        animate="end"
      >
        <motion.span
          variants={dotVariants}
          transition={dotTransition}
          className="w-1.5 h-1.5 rounded-full bg-primary-app/70"
        />
        <motion.span
          variants={dotVariants}
          transition={dotTransition}
          className="w-1.5 h-1.5 rounded-full bg-accent-app/70"
        />
        <motion.span
          variants={dotVariants}
          transition={dotTransition}
          className="w-1.5 h-1.5 rounded-full bg-secondary-app/70"
        />
      </motion.div>
    </div>
  );
};

export default TypingIndicator;
