import React from 'react';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';

export const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className="w-full py-1">
      {isUser ? (
        <UserMessage message={message} />
      ) : (
        <AssistantMessage message={message} />
      )}
    </div>
  );
};

export default ChatMessage;
