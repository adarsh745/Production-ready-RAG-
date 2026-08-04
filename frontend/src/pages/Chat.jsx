import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import ChatWindow from '../components/chat/ChatWindow';

export const Chat = () => {
  const { chatId } = useParams();
  const { selectChat, chatHistory } = useChat();

  // Sync route param chatId with active chat session state
  useEffect(() => {
    if (chatId) {
      const exists = chatHistory.some(ch => ch.id === chatId);
      if (exists) {
        selectChat(chatId);
      }
    }
  }, [chatId]);

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-hidden bg-bg-app">
      <ChatWindow />
    </div>
  );
};

export default Chat;
