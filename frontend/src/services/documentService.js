import { api } from './authService';

export const documentService = {
  /**
   * Fetch all documents and system stats
   */
  async getDocuments() {
    const response = await api.get('/documents/');
    return response.data;
  },

  /**
   * Fetch real-time workspace performance profile stats from PostgreSQL & ChromaDB
   */
  async getProfileStats() {
    const response = await api.get('/documents/profile-stats');
    return response.data;
  },

  /**
   * Fetch details for a specific document
   */
  async getDocument(id) {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  /**
   * Rename a document filename
   */
  async renameDocument(id, filename) {
    const response = await api.put(`/documents/${id}`, { filename });
    return response.data;
  },

  /**
   * Delete document from PostgreSQL, ChromaDB, and disk
   */
  async deleteDocument(id) {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};

export default documentService;
