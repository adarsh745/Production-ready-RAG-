import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import { SidebarProvider } from './context/SidebarContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SidebarProvider>
          <ChatProvider>
            <div className="w-screen h-screen bg-bg-app text-text-app overflow-hidden">
              <AppRoutes />
            </div>
          </ChatProvider>
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
