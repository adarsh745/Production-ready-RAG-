import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import * as Icons from 'lucide-react';

export const SidebarItem = ({
  iconName,
  label,
  active = false,
  onClick,
  collapsed = false,
  className = '',
  ...props
}) => {
  // Dynamically resolve icon from Lucide React
  const IconComponent = Icons[iconName] || Icons.HelpCircle;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 select-none outline-none border border-transparent',
        active
          ? 'bg-primary-app/10 text-primary-app border-primary-app/20 shadow-sm dark:bg-white/[0.06] dark:text-white dark:border-white/[0.08] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_15px_rgba(124,58,237,0.1)]'
          : 'text-muted-app hover:text-text-app hover:bg-black/[0.04] dark:hover:text-white dark:hover:bg-white/[0.03]',
        collapsed ? 'justify-center px-2' : '',
        className
      )}
      {...props}
    >
      {/* Selection Glow Indicator */}
      {active && (
        <motion.div
          layoutId="sidebar-active-glow"
          className="absolute left-0 w-1 h-5 rounded-r-full bg-primary-app shadow-[0_0_10px_#7C3AED]"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}

      {/* Icon */}
      <div className={cn(
        'shrink-0 transition-transform duration-300 group-hover:scale-105',
        active ? 'text-primary-app drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]' : 'text-muted-app group-hover:text-text-app dark:group-hover:text-white'
      )}>
        <IconComponent size={18} strokeWidth={active ? 2.5 : 2} />
      </div>

      {/* Label (hides on collapse) */}
      {!collapsed && (
        <span className={cn(
          'transition-colors duration-300 truncate',
          active ? 'font-semibold text-text-app' : 'text-muted-app group-hover:text-text-app dark:group-hover:text-white'
        )}>
          {label}
        </span>
      )}

      {/* Tooltip on collapse */}
      {collapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-card-app border border-border-app rounded-md text-xs font-semibold text-text-app opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-2xl">
          {label}
        </div>
      )}
    </button>
  );
};

export default SidebarItem;
