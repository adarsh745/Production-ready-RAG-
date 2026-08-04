import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SourceList from '../rightpanel/SourceList';
import { useSidebar } from '../../hooks/useSidebar';
import { useChat } from '../../hooks/useChat';
import { cn } from '../../utils/helpers';

export const MainLayout = ({ children }) => {
  const { isCollapsed } = useSidebar();
  const { isRightPanelOpen, messages } = useChat();

  // Find if current chat has any messages with sources (to enable right panel)
  const currentHasSources = messages.some(msg => msg.sources && msg.sources.length > 0);

  return (
    <div className="flex h-screen w-screen bg-bg-app text-text-app overflow-hidden font-sans">

      {/* Left Sidebar Drawer / Column */}
      <Sidebar />

      {/* Main Core View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Control Bar */}
        <Navbar />

        {/* Dynamic page contents & Optional Right Panel grid */}
        <div className="flex-1 flex w-full min-h-0 overflow-hidden relative">

          {/* Main Router Content Wrapper */}
          <main className="flex-1 min-w-0 overflow-hidden relative flex flex-col">
            <div className="flex-1 w-full mx-auto flex flex-col justify-between min-h-0">
              {children}
            </div>
          </main>

          {/* Right Retrieved Sources Panel */}
          {currentHasSources && isRightPanelOpen && (
            <SourceList />
          )}
        </div>

      </div>
    </div>
  );
};

export default MainLayout;
