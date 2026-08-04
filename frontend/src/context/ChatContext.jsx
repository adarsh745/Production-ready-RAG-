import React, { createContext, useState, useEffect } from 'react';
import { MODELS, WORKSPACES, INITIAL_CHAT_HISTORY, MOCK_KNOWLEDGE_BASE_DOCS } from '../utils/constants';
import { chatService } from '../services/chatService';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(WORKSPACES[0]);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
  const [activeChatId, setActiveChatId] = useState('chat-1');
  const [chatHistory, setChatHistory] = useState(INITIAL_CHAT_HISTORY);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Map to store messages for each chat session
  const [chatMessagesMap, setChatMessagesMap] = useState({
    'chat-1': [
      {
        id: 'm1',
        role: 'user',
        content: 'Tell me about our current Q3 goal organization strategy.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'm2',
        role: 'assistant',
        content: `Sure! Our main focus for Q3 is the structural organization of our multi-agent RAG pipelines [1]. We want to ensure that retrieval latency remains under **200ms** by embedding caching systems.

Key pillars from the Vision Grid [2] spec:
1. **Caching Optimizations:** Storing localized embedding queries.
2. **Mind Threads Integration:** Creating topological maps of related files to query across namespaces [3].

Let me know if you'd like to dive into any of the associated PDFs!`,
        timestamp: new Date(Date.now() - 3600000 * 2 + 60000).toISOString(),
        sources: [MOCK_KNOWLEDGE_BASE_DOCS[0], MOCK_KNOWLEDGE_BASE_DOCS[1], MOCK_KNOWLEDGE_BASE_DOCS[2]]
      }
    ],
    'chat-2': [
      {
        id: 'm3',
        role: 'user',
        content: 'Do we have a document detailing the intelligence retrieval metrics?',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'm4',
        role: 'assistant',
        content: `Yes, we have the **Intelligence Strategy Brief** [1] which details our vector retrieval guidelines. We aim to achieve over **90%** metadata lookup accuracy by partitioning our namespace vectors according to user workspaces.`,
        timestamp: new Date(Date.now() - 3600000 * 5 + 40000).toISOString(),
        sources: [MOCK_KNOWLEDGE_BASE_DOCS[1]]
      }
    ]
  });

  // Sync messages list when active chat changes
  useEffect(() => {
    if (activeChatId && chatMessagesMap[activeChatId]) {
      setMessages(chatMessagesMap[activeChatId]);
      // If the chat has messages with sources, open right panel on desktop
      const lastMessage = chatMessagesMap[activeChatId][chatMessagesMap[activeChatId].length - 1];
      if (lastMessage && lastMessage.sources && lastMessage.sources.length > 0) {
        setIsRightPanelOpen(true);
      } else {
        setIsRightPanelOpen(false);
      }
    } else {
      setMessages([]);
      setIsRightPanelOpen(false);
    }
    setSelectedSource(null);
  }, [activeChatId]);

  // Send message action
  const sendMessage = async (content) => {
    if (!content.trim() || isGenerating) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const newUserMessage = {
      id: userMsgId,
      role: 'user',
      content,
      timestamp,
      files: [...uploadedFiles]
    };

    // Update active chat messages
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setChatMessagesMap(prev => ({
      ...prev,
      [activeChatId]: updatedMessages
    }));

    // Clear uploads
    setUploadedFiles([]);
    setIsGenerating(true);

    // Add empty placeholder for assistant streaming
    const assistantPlaceholder = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      sources: []
    };

    setMessages(prev => [...prev, assistantPlaceholder]);

    try {
      const responseMeta = await chatService.generateResponse(content, (streamedText) => {
        // Stream chunk updates
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId ? { ...msg, content: streamedText } : msg
        ));
      });

      // Update final assistant message with sources
      setMessages(prev => {
        const finalMessages = prev.map(msg => 
          msg.id === assistantMsgId ? { 
            ...msg, 
            sources: responseMeta.sources,
            timestamp: new Date().toISOString()
          } : msg
        );
        
        // Save back to session map
        setChatMessagesMap(m => ({
          ...m,
          [activeChatId]: finalMessages
        }));

        return finalMessages;
      });

      // Open sources panel if we retrieved documents
      if (responseMeta.sources && responseMeta.sources.length > 0) {
        setIsRightPanelOpen(true);
      }

    } catch (err) {
      console.error('Error generating AI response:', err);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId ? { 
          ...msg, 
          content: 'Apologies, I encountered an error searching the workspace indexes. Please try again.' 
        } : msg
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  // Create new chat session
  const createNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newChat = {
      id: newId,
      title: 'New Chat Spec',
      active: true,
      pinned: false
    };

    // Deactivate others
    setChatHistory(prev => prev.map(ch => ({ ...ch, active: false })).concat(newChat));
    setChatMessagesMap(prev => ({
      ...prev,
      [newId]: []
    }));
    setActiveChatId(newId);
  };

  // Select existing chat
  const selectChat = (id) => {
    setChatHistory(prev => prev.map(ch => ({
      ...ch,
      active: ch.id === id
    })));
    setActiveChatId(id);
  };

  // Delete chat session
  const deleteChat = (id) => {
    setChatHistory(prev => prev.filter(ch => ch.id !== id));
    setChatMessagesMap(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    if (activeChatId === id) {
      const remaining = chatHistory.filter(ch => ch.id !== id);
      if (remaining.length > 0) {
        selectChat(remaining[remaining.length - 1].id);
      } else {
        setActiveChatId(null);
        setMessages([]);
      }
    }
  };

  // Toggle chat pinning
  const togglePinChat = (id) => {
    setChatHistory(prev => prev.map(ch => 
      ch.id === id ? { ...ch, pinned: !ch.pinned } : ch
    ));
  };

  // File Upload Simulations
  const uploadFile = (file) => {
    const newFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type
    };
    setUploadedFiles(prev => [...prev, newFile]);
  };

  const removeUploadedFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <ChatContext.Provider value={{
      messages,
      isGenerating,
      selectedModel,
      setSelectedModel,
      selectedWorkspace,
      setSelectedWorkspace,
      isWebSearchEnabled,
      setIsWebSearchEnabled,
      activeChatId,
      chatHistory,
      uploadedFiles,
      isRightPanelOpen,
      setIsRightPanelOpen,
      selectedSource,
      setSelectedSource,
      isVoiceActive,
      setIsVoiceActive,
      sendMessage,
      createNewChat,
      selectChat,
      deleteChat,
      togglePinChat,
      uploadFile,
      removeUploadedFile
    }}>
      {children}
    </ChatContext.Provider>
  );
};
