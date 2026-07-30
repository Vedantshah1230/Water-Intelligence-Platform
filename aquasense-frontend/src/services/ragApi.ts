import api from '@/lib/api';

export interface VectorChunk {
  id: string;
  title: string;
  category: string;
  snippet?: string;
  content: string;
  source: string;
  similarityScore?: number;
  timestamp: string;
}

export interface KnowledgeStats {
  totalChunks: number;
  categoriesCount: number;
  categoriesList: string[];
  feedbackCount: number;
  upvotes: number;
  downvotes: number;
}

export const ragApi = {
  searchVectorKnowledge: async (query: string): Promise<VectorChunk[]> => {
    const res = await api.get('/ai-assistant/knowledge-search', { params: { q: query } });
    return res.data;
  },

  submitFeedback: async (messageId: string, rating: 'UP' | 'DOWN', comment?: string) => {
    const res = await api.post('/ai-assistant/feedback', { messageId, rating, comment });
    return res.data;
  },

  ingestDocument: async (doc: { title: string; category?: string; content: string; source?: string }) => {
    const res = await api.post('/ai-assistant/knowledge/ingest', doc);
    return res.data;
  },

  getStats: async (): Promise<KnowledgeStats> => {
    const res = await api.get('/ai-assistant/knowledge/stats');
    return res.data;
  }
};
