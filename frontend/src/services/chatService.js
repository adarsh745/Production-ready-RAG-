import { api } from './authService';

/**
 * Real Production RAG AI Service connected to FastAPI backend.
 */
export const chatService = {
  /**
   * Process user prompt by querying real FastAPI backend & ChromaDB/OpenAI.
   * @param {string} prompt - User query
   * @param {function} onChunk - Callback for each token/character chunk
   * @param {Array} documentIds - Optional document IDs filter
   */
  async generateResponse(prompt, onChunk, documentIds = []) {
    try {
      // Send request to FastAPI RAG endpoint POST /api/chat/
      const res = await api.post('/chat/', {
        question: prompt,
        document_ids: documentIds,
      });

      const answerText = res.data?.answer || "I couldn't find relevant information in the uploaded documents.";

      // Stream text chunks to UI for smooth typing effect
      if (onChunk) {
        const words = answerText.split(' ');
        let current = '';
        for (let i = 0; i < words.length; i++) {
          current += (i === 0 ? '' : ' ') + words[i];
          onChunk(current);
          await new Promise((resolve) => setTimeout(resolve, 15));
        }
      }

      // Format sources from FastAPI response
      const formattedSources = (res.data?.sources || []).map((src, index) => ({
        id: src.document_id || `src-${index}`,
        title: src.filename || `Source ${index + 1}`,
        content: src.content || '',
        page: src.page || src.chunk_id || 1,
        similarity: src.similarity || 0.95,
        confidence: 'High',
      }));

      return {
        answer: answerText,
        sources: formattedSources,
      };
    } catch (err) {
      console.error('FastAPI /chat API error:', err);
      const errorMsg =
        err.response?.data?.detail ||
        "Sorry, I couldn't process your request. Please ensure your backend server is running.";
      if (onChunk) onChunk(errorMsg);
      return {
        answer: errorMsg,
        sources: [],
      };
    }
  },
};

export default chatService;
