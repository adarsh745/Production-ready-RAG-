import { api } from './authService';

export const chatHistoryService = {
  /**
   * Fetch all chat sessions for logged-in user
   */
  async getSessions() {
    const response = await api.get('/chats');
    return response.data;
  },

  /**
   * Create a new chat session
   */
  async createSession(title = 'New Chat') {
    const response = await api.post('/chats', { title });
    return response.data;
  },

  /**
   * Get full details and messages for a specific session
   */
  async getSessionDetails(sessionId) {
    const response = await api.get(`/chats/${sessionId}`);
    return response.data;
  },

  /**
   * Rename a chat session
   */
  async renameSession(sessionId, title) {
    const response = await api.put(`/chats/${sessionId}`, { title });
    return response.data;
  },

  /**
   * Delete a chat session
   */
  async deleteSession(sessionId) {
    const response = await api.delete(`/chats/${sessionId}`);
    return response.data;
  },

  /**
   * Add a message (user or assistant) to a chat session
   */
  async addMessage(sessionId, { role, content, sources = [], evaluation = null }) {
    const response = await api.post(`/chats/${sessionId}/messages`, {
      role,
      content,
      sources,
      evaluation,
    });
    return response.data;
  },
};

export default chatHistoryService;
