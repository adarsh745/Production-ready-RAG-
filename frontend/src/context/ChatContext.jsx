import React, { createContext, useState, useEffect, useCallback } from 'react';
import { MODELS, WORKSPACES } from '../utils/constants';
import { chatService } from '../services/chatService';
import { chatHistoryService } from '../services/chatHistoryService';
import { documentService } from '../services/documentService';
import { useAuth } from '../hooks/useAuth';
import PdfDrawer from '../components/pdf/PdfDrawer';

export const ChatContext = createContext();

/**
 * Group sessions into Today, Yesterday, Last 7 Days, and Older categories
 */
export const groupSessionsByDate = (sessions = []) => {
  const groups = {
    today: [],
    yesterday: [],
    last7Days: [],
    older: [],
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const sevenDaysAgo = todayStart - 86400000 * 6;

  sessions.forEach((session) => {
    const time = new Date(session.updated_at || session.created_at).getTime();
    if (time >= todayStart) {
      groups.today.push(session);
    } else if (time >= yesterdayStart) {
      groups.yesterday.push(session);
    } else if (time >= sevenDaysAgo) {
      groups.last7Days.push(session);
    } else {
      groups.older.push(session);
    }
  });

  return groups;
};

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(WORKSPACES[0]);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);

  const [activeChatId, setActiveChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Multi-Document Chat Selection State
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([]);
  const [availableDocuments, setAvailableDocuments] = useState([]);

  // PDF Viewer Drawer State
  const [isPdfDrawerOpen, setIsPdfDrawerOpen] = useState(false);
  const [selectedPdfSource, setSelectedPdfSource] = useState(null);

  const openPdfViewer = (sourceDoc) => {
    setSelectedPdfSource(sourceDoc);
    setIsPdfDrawerOpen(true);
  };

  const closePdfViewer = () => {
    setIsPdfDrawerOpen(false);
    setSelectedPdfSource(null);
  };

  // Fetch all available documents for multi-document selector
  const loadAvailableDocuments = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await documentService.getDocuments();
      setAvailableDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to load available documents:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadAvailableDocuments();
  }, [loadAvailableDocuments]);

  // Multi-Document Selection Controls
  const toggleSelectDocument = (docId) => {
    setSelectedDocumentIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const selectAllDocuments = () => {
    setSelectedDocumentIds(availableDocuments.map((d) => d.id));
  };

  const clearSelectedDocuments = () => {
    setSelectedDocumentIds([]);
  };

  // Fetch all chat sessions from PostgreSQL backend on mount / auth change
  const loadChatSessions = useCallback(async () => {
    if (!isAuthenticated) {
      setChatHistory([]);
      setActiveChatId(null);
      setMessages([]);
      return;
    }

    setIsLoadingHistory(true);
    try {
      const sessions = await chatHistoryService.getSessions();
      setChatHistory(sessions || []);

      if (sessions && sessions.length > 0) {
        setActiveChatId((current) => current || sessions[0].id);
      }
    } catch (err) {
      console.error('Failed to load user chat history from PostgreSQL:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadChatSessions();
  }, [loadChatSessions]);

  // Load messages for active chat session directly from PostgreSQL
  useEffect(() => {
    if (!activeChatId || !isAuthenticated) {
      setMessages([]);
      setIsRightPanelOpen(false);
      return;
    }

    let isMounted = true;
    const fetchSessionMessages = async () => {
      try {
        const sessionData = await chatHistoryService.getSessionDetails(activeChatId);
        if (isMounted && sessionData) {
          const loadedMsgs = (sessionData.messages || []).map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            sources: m.sources || [],
            evaluation: m.evaluation,
            timestamp: m.created_at,
          }));

          setMessages(loadedMsgs);

          const lastMsg = loadedMsgs[loadedMsgs.length - 1];
          if (lastMsg && lastMsg.sources && lastMsg.sources.length > 0) {
            setIsRightPanelOpen(true);
          } else {
            setIsRightPanelOpen(false);
          }
        }
      } catch (err) {
        console.error(`Failed to load messages for session ${activeChatId}:`, err);
      }
    };

    fetchSessionMessages();

    return () => {
      isMounted = false;
    };
  }, [activeChatId, isAuthenticated]);

  const createNewChat = async () => {
    if (!isAuthenticated) return;
    try {
      const newSession = await chatHistoryService.createSession('New Chat');
      setChatHistory((prev) => [newSession, ...prev]);
      setActiveChatId(newSession.id);
      setMessages([]);
      return newSession;
    } catch (err) {
      console.error('Failed to create new chat session in PostgreSQL:', err);
    }
  };

  const selectChat = (id) => {
    setActiveChatId(id);
  };

  const renameChat = async (id, newTitle) => {
    if (!id || !newTitle.trim()) return;
    try {
      const updated = await chatHistoryService.renameSession(id, newTitle.trim());
      setChatHistory((prev) =>
        prev.map((ch) => (ch.id === id ? { ...ch, title: updated.title } : ch))
      );
    } catch (err) {
      console.error(`Failed to rename chat session ${id}:`, err);
    }
  };

  const deleteChat = async (id) => {
    if (!id) return;
    try {
      await chatHistoryService.deleteSession(id);
      const updatedHistory = chatHistory.filter((ch) => ch.id !== id);
      setChatHistory(updatedHistory);

      if (activeChatId === id) {
        if (updatedHistory.length > 0) {
          setActiveChatId(updatedHistory[0].id);
        } else {
          setActiveChatId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error(`Failed to delete chat session ${id}:`, err);
    }
  };

  const sendMessage = async (content) => {
    if (!content.trim() || isGenerating) return;

    let sessionId = activeChatId;

    if (!sessionId) {
      const newSession = await createNewChat();
      if (newSession) {
        sessionId = newSession.id;
      } else {
        return;
      }
    }

    const tempUserMsgId = `temp-user-${Date.now()}`;
    const tempAssistantMsgId = `temp-assistant-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const userMessageObj = {
      id: tempUserMsgId,
      role: 'user',
      content,
      timestamp,
      files: [...uploadedFiles],
    };

    const assistantPlaceholderObj = {
      id: tempAssistantMsgId,
      role: 'assistant',
      content: '',
      timestamp,
      sources: [],
    };

    setMessages((prev) => [...prev, userMessageObj, assistantPlaceholderObj]);
    setUploadedFiles([]);
    setIsGenerating(true);

    try {
      const savedUserMsg = await chatHistoryService.addMessage(sessionId, {
        role: 'user',
        content,
      });

      setChatHistory((prev) =>
        prev.map((ch) => {
          if (ch.id === sessionId && ch.title === 'New Chat') {
            const autoTitle = content.length > 30 ? `${content.substring(0, 30)}...` : content;
            return { ...ch, title: autoTitle };
          }
          return ch;
        })
      );

      // Pass selectedDocumentIds to API request for multi-document context filtering
      const responseMeta = await chatService.generateResponse(
        content,
        (streamedText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistantMsgId ? { ...msg, content: streamedText } : msg
            )
          );
        },
        selectedDocumentIds
      );

      const finalAnswerText = responseMeta.answer || "I couldn't find the answer in the uploaded documents.";
      const finalSources = responseMeta.sources || [];

      const savedAssistantMsg = await chatHistoryService.addMessage(sessionId, {
        role: 'assistant',
        content: finalAnswerText,
        sources: finalSources,
      });

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === tempUserMsgId) return { ...msg, id: savedUserMsg.id };
          if (msg.id === tempAssistantMsgId)
            return {
              ...msg,
              id: savedAssistantMsg.id,
              content: finalAnswerText,
              sources: finalSources,
              timestamp: savedAssistantMsg.created_at,
            };
          return msg;
        })
      );

      if (finalSources.length > 0) {
        setIsRightPanelOpen(true);
      }
    } catch (err) {
      console.error('Error in sendMessage flow:', err);
      const errorText =
        err.response?.data?.detail ||
        'Apologies, I encountered an error communicating with the backend RAG engine.';

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAssistantMsgId ? { ...msg, content: errorText } : msg
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadFile = (file) => {
    const newFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
    };
    setUploadedFiles((prev) => [...prev, newFile]);
  };

  const removeUploadedFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <ChatContext.Provider
      value={{
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
        isLoadingHistory,
        uploadedFiles,
        isRightPanelOpen,
        setIsRightPanelOpen,
        selectedSource,
        setSelectedSource,
        isVoiceActive,
        setIsVoiceActive,
        isPdfDrawerOpen,
        selectedPdfSource,
        openPdfViewer,
        closePdfViewer,
        selectedDocumentIds,
        availableDocuments,
        toggleSelectDocument,
        selectAllDocuments,
        clearSelectedDocuments,
        loadAvailableDocuments,
        sendMessage,
        createNewChat,
        selectChat,
        renameChat,
        deleteChat,
        uploadFile,
        removeUploadedFile,
        loadChatSessions,
      }}
    >
      {children}

      {/* Persistent PDF Viewer Drawer */}
      <PdfDrawer
        isOpen={isPdfDrawerOpen}
        onClose={closePdfViewer}
        sourceDoc={selectedPdfSource}
      />
    </ChatContext.Provider>
  );
};

export default ChatProvider;
