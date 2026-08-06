import React, { useState, useEffect } from 'react';
import { useSidebar } from '../../hooks/useSidebar';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import WorkspaceList from '../sidebar/WorkspaceList';
import ChatHistory from '../sidebar/ChatHistory';
import SidebarItem from '../sidebar/SidebarItem';
import { Sparkles, FolderKanban, LogOut, Settings, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export const Sidebar = () => {
  const { isCollapsed, isMobileOpen, closeMobileSidebar } = useSidebar();
  const { createNewChat } = useChat();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = [
    { label: 'Chat Assistant', icon: 'Sparkles', path: '/' },
    { label: 'Documents', icon: 'FolderKanban', path: '/documents' },
    { label: 'Profile', icon: 'User', path: '/profile' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    closeMobileSidebar();
  };

  const handleNewChatClick = () => {
    createNewChat();
    navigate('/');
    closeMobileSidebar();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-sidebar-app border-r border-border-app">
      {/* Top Section: Workspace Header & New Chat */}
      <div className="space-y-4">
        <WorkspaceList />

        {/* New Chat Button */}
        <button
          onClick={handleNewChatClick}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-border-app bg-card-app hover:bg-bg-app text-xs font-semibold text-text-app transition-all select-none duration-300 shadow-sm active:scale-98 cursor-pointer',
            isCollapsed ? 'p-2' : ''
          )}
          title="New Chat"
        >
          <Plus size={14} className="text-text-app" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Middle Section: Navigation Items & History */}
      <div className="flex-1 my-6 flex flex-col min-h-0">
        <div className="space-y-1.5 shrink-0 mb-4">
          {mainNavItems.map((item) => (
            <SidebarItem
              key={item.label}
              iconName={item.icon}
              label={item.label}
              active={
                location.pathname === item.path ||
                (item.path === '/' && (location.pathname === '/chat' || location.pathname.startsWith('/chat/')))
              }
              collapsed={isCollapsed}
              onClick={() => handleNavClick(item.path)}
            />
          ))}
        </div>

        <div className="h-[1px] bg-border-app mb-4 shrink-0" />

        {/* History list for chat discussions */}
        <ChatHistory collapsed={isCollapsed} />
      </div>

      {/* Bottom Section: Settings & Logout */}
      <div className="border-t border-border-app pt-3">
        <div
          className={cn(
            'flex items-center gap-1',
            isCollapsed ? 'flex-col justify-center' : 'justify-between'
          )}
        >
          <button
            onClick={() => {
              navigate('/settings');
              closeMobileSidebar();
            }}
            className={cn(
              'flex items-center gap-2 p-2 rounded-xl text-muted-app hover:text-text-app hover:bg-white/[0.03] transition-all text-xs font-medium cursor-pointer',
              isCollapsed ? 'w-full justify-center' : 'flex-1'
            )}
            title="Settings"
          >
            <Settings size={14} />
            {!isCollapsed && <span>Settings</span>}
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className={cn(
              'flex items-center gap-2 p-2 rounded-xl text-muted-app hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-medium cursor-pointer',
              isCollapsed ? 'w-full justify-center' : ''
            )}
            title="Logout"
          >
            <LogOut size={14} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen shrink-0 transition-all duration-300 z-30',
          isCollapsed ? 'w-[76px]' : 'w-[240px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 transition-opacity duration-300 pointer-events-none',
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        )}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMobileSidebar} />

        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: isMobileOpen ? '0%' : '-100%' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
          className="absolute top-0 bottom-0 left-0 w-[240px] h-full shadow-2xl z-55"
        >
          {sidebarContent}
        </motion.aside>
      </div>
    </>
  );
};

export default Sidebar;
