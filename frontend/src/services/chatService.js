import { MOCK_KNOWLEDGE_BASE_DOCS } from '../utils/constants';
import { delay } from '../utils/helpers';

/**
 * RAG AI Service simulating intelligent document retrieval and message streaming.
 */
export const chatService = {
  /**
   * Process a prompt, perform mock vector search on knowledge base, and stream back text.
   * @param {string} prompt - User query
   * @param {function} onChunk - Callback for each token/character chunk
   * @returns {Promise<{ sources: Array }>} - Resolves with retrieved sources
   */
  async generateResponse(prompt, onChunk) {
    // 1. Mock "Vector Search" based on keyword overlap
    const searchTerms = prompt.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    
    let retrieved = MOCK_KNOWLEDGE_BASE_DOCS.map(doc => {
      let matches = 0;
      searchTerms.forEach(term => {
        if (doc.title.toLowerCase().includes(term) || doc.content.toLowerCase().includes(term)) {
          matches += 1;
        }
      });
      
      // Add small randomness to simulate fluctuating similarity scores
      const randomWeight = Math.random() * 0.05;
      const baseScore = matches > 0 ? 0.6 + (matches * 0.1) : 0.1 + randomWeight;
      const finalScore = Math.min(Math.max(baseScore, 0.05), 0.98);
      
      return {
        ...doc,
        similarity: parseFloat(finalScore.toFixed(2))
      };
    });

    // Sort by similarity and filter out very low matches, limit to top 3
    retrieved = retrieved
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    // If score is too low, we might not retrieve anything, but let's always return at least 1 document for demo
    if (retrieved[0].similarity < 0.2) {
      retrieved[0].similarity = 0.52; // Boost to show a source in the UI
    }

    // 2. Draft response based on matched documents
    let responseText = '';
    const mainDoc = retrieved[0];
    
    if (prompt.toLowerCase().includes('goal') || prompt.toLowerCase().includes('org')) {
      responseText = `Based on our company's goal organization documents **[1]**, our main priority for Q3 is restructuring the multi-agent RAG pipeline to achieve latencies below **200ms**.

Here is the current focus breakdown:
* **Latency Reduction:** Tuning embedding cache structures to hit under 200ms.
* **Sync Management:** Standardizing states across \`Vision Grid\` and \`Mind Threads\` **[1]**.
* **Deployment Specs:** Running the containers in production-ready Kubernetes clusters with load balancers.

Do you want me to expand on the syncing strategies for Vision Grid?`;
    } else if (prompt.toLowerCase().includes('intelligence') || prompt.toLowerCase().includes('strategy')) {
      responseText = `According to the **Intelligence Strategy Brief** [1], we are targeting an accuracy threshold of **90%+** using hierarchical vision grids [1, 2].

The key features of our intelligence layer include:
1. **Context-Aware Metadata:** Automatic scanning of document headers to isolate metadata tags [1].
2. **Vector Space Partitioning:** Partitioning namespaces by user-created workspaces (e.g., Voicifox vs Marketing) [2].

Let me know if you would like me to compile a draft strategy report for your active workspace.`;
    } else if (prompt.toLowerCase().includes('mind') || prompt.toLowerCase().includes('thread')) {
      responseText = `Our network structure leverages **Mind Threads** [1], which maps connections across separate vector namespaces.

* **Graph Database Mapping:** Visual nodes representing files are mapped to graph databases [1].
* **Workspace Directories:** Each workspace represents a distinct thread that can be filtered and summarized independently [1, 2].

This links directly with the **Q3 Goals** to streamline task allocations.`;
    } else {
      responseText = `I've analyzed your workspace context and found references in our knowledge base **[1]**. 

Based on my analysis:
- **Retrieval Scope:** Searching the **${mainDoc.title}** document.
- **Similarity Rank:** Ranked with a confidence score of **${mainDoc.confidence}** (Similarity: **${Math.round(mainDoc.similarity * 100)}%**).
- **Core Excerpt:** "${mainDoc.content.substring(0, 120)}..."

How can I help you refine this further or run deeper assessments on these source files?`;
    }

    // 3. Simulate Streaming of text chunks
    const words = responseText.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += words[i] + ' ';
      onChunk(currentText);
      // Faster typing speed for snappy feel
      await delay(Math.random() * 30 + 15);
    }

    return {
      sources: retrieved
    };
  }
};
