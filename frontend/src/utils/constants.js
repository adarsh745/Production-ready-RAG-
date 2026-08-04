export const MODELS = [
  { id: 'grok-zero-point', name: 'Grok Zero point', badge: 'Beta' },
  { id: 'grok-pro', name: 'Grok Pro', badge: 'Fast' },
  { id: 'claude-sonnet', name: 'Claude 3.5 Sonnet', badge: 'Smart' },
  { id: 'gpt-4o', name: 'GPT-4o', badge: 'Pro' }
];

export const WORKSPACES = [
  { id: 'voicifox', name: 'Voicifox', icon: 'zap' },
  { id: 'marketing', name: 'Marketing Growth', icon: 'trending-up' },
  { id: 'engineering', name: 'Engineering Core', icon: 'code' },
  { id: 'design-system', name: 'Design Spec', icon: 'palette' }
];

export const SUGGESTED_PROMPTS = [
  { text: 'Goal-organization', desc: 'Configure and review organizational goals structure' },
  { text: 'Intelligence strategy', desc: 'Generate high-level strategy reports for the project' },
  { text: 'Mind Threads mapping', desc: 'Connect brainstorm threads into visual mindmaps' },
  { text: 'Vision Grid analysis', desc: 'Perform multi-dimensional assessment matrices' }
];

export const INITIAL_CHAT_HISTORY = [
  { id: 'chat-1', title: 'Q3 Strategy Alignment', active: true, pinned: true },
  { id: 'chat-2', title: 'Intelligence Gathering API', active: false, pinned: true },
  { id: 'chat-3', title: 'Agent Swarm Collaboration', active: false, pinned: false },
  { id: 'chat-4', title: 'Mind Threads Node Chart', active: false, pinned: false },
  { id: 'chat-5', title: 'Vision Grid Framework', active: false, pinned: false }
];

export const MOCK_KNOWLEDGE_BASE_DOCS = [
  {
    id: 'doc-1',
    title: 'Q3_Goal_Organization_v2.pdf',
    similarity: 0.94,
    confidence: 'High',
    page: 4,
    size: '1.2 MB',
    content: 'The primary goal for Q3 is the structural organization of our multi-agent RAG pipelines. By integrating Voicifox intelligence layers, we seek to reduce retrieval latencies to under 200ms. Team alignment across Vision Grid and Mind Threads is critical for synchronous state management.'
  },
  {
    id: 'doc-2',
    title: 'Intelligence_Strategy_Brief.docx',
    similarity: 0.87,
    confidence: 'High',
    page: 1,
    size: '450 KB',
    content: 'Intelligence gathering represents our core value proposition. Using advanced vector embeddings stored in a hierarchical vision grid, the model will scan uploaded documents to retrieve context-aware metadata with over 90% accuracy.'
  },
  {
    id: 'doc-3',
    title: 'Mind_Threads_Whitepaper.txt',
    similarity: 0.72,
    confidence: 'Medium',
    page: 12,
    size: '89 KB',
    content: 'Mind Threads provides the visual and graph-logical structure connecting separate vector namespaces. Each node in the grid represents a workspace directory that the RAG model can actively search, filter, and summarize upon user query.'
  },
  {
    id: 'doc-4',
    title: 'Vision_Grid_Technical_Spec.pdf',
    similarity: 0.65,
    confidence: 'Medium',
    page: 2,
    size: '2.4 MB',
    content: 'The Vision Grid is a multi-dimensional data grid displaying real-time task allocations and system telemetry. It handles responsive render trees for dashboard rendering on mobile and desktop layout containers.'
  }
];
