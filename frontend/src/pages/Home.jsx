import React from 'react';
import ChatWindow from '../components/chat/ChatWindow';

export const Home = () => {
  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-hidden bg-bg-app">
      <ChatWindow />
    </div>
  );
};

export default Home;
