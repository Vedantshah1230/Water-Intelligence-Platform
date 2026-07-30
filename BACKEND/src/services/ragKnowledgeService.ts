export interface VectorChunk {
  id: string;
  title: string;
  category: string;
  snippet?: string;
  content: string;
  source: string;
  vector: number[];
  timestamp: string;
}

export interface FeedbackEntry {
  id: string;
  messageId: string;
  rating: 'UP' | 'DOWN';
  comment?: string;
  timestamp: string;
}

// Helper to compute token n-gram frequencies for lightweight, high-performance vector embeddings
function generateEmbedding(text: string): number[] {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const vocabulary = [
    'water', 'reservoir', 'groundwater', 'leak', 'pressure', 'flow', 'sensor', 'climate',
    'precipitation', 'drought', 'flood', 'quality', 'sdg', 'cgwb', 'cwc', 'bis',
    'pipeline', 'acoustic', 'telemetry', 'recharge', 'saline', 'aquifer', 'spillway',
    'model', 'prediction', 'risk', 'consumption', 'urban', 'tariff', 'sop', 'hydraulic'
  ];

  const vector = new Array(vocabulary.length).fill(0);
  for (const word of words) {
    const idx = vocabulary.indexOf(word);
    if (idx !== -1) {
      vector[idx] += 1;
    }
  }

  // Normalize vector to unit length
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
}

// Compute Cosine Similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return dotProduct;
}

// Initial 15-Domain Vector Knowledge Base Seed
const INITIAL_KNOWLEDGE_STORE: Omit<VectorChunk, 'id' | 'vector' | 'timestamp'>[] = [
  {
    title: 'CGWB Managed Aquifer Recharge (MAR) Guidelines',
    category: 'Groundwater',
    content: 'Safe drawdown for coastal alluvial aquifers in Western India is capped at 45m depth. Exceeding 60m introduces severe saline intrusion risk into municipal intake wells. Artificial recharge injection pits should be constructed using coarse gravel (2-5mm filter bed).',
    source: 'Central Ground Water Board (CGWB) Tech Bulletin 2025'
  },
  {
    title: 'CWC Reservoir Outflow Rule Curve Balancing',
    category: 'Reservoirs',
    content: 'Central Water Commission (CWC) Rule Curve specifies maintaining a minimum 12% flood cushion in Bhatsa and Vaitarna reservoirs during peak monsoon (July-August). Spillway gate discharge rates must not exceed downstream channel capacity of 1,200 m3/s.',
    source: 'Central Water Commission (CWC) Operational Manual'
  },
  {
    title: 'Acoustic & Pressure Wave Leak Detection SOP',
    category: 'Leak Detection',
    content: 'For HDPE and Cast Iron trunk lines (>500mm diameter), a continuous pressure drop below -0.4 bar accompanied by acoustic sensor frequency spectrum spikes between 45-80dB indicates structural pipe rupture. Isolation valves must be closed within 4 hours to limit non-revenue water (NRW) loss.',
    source: 'AquaSense Municipal Infrastructure Manual v4.2'
  },
  {
    title: 'BIS 10500 Drinking Water Quality Standards',
    category: 'Water Quality',
    content: 'Bureau of Indian Standards (BIS 10500:2012) mandates acceptable limits: pH 6.5-8.5, Turbidity <1 NTU (max 5 NTU), Total Dissolved Solids (TDS) <500 mg/L (max 2000 mg/L), Nitrate <45 mg/L, Chlorine residual 0.2-1.0 mg/L at distribution consumer end.',
    source: 'Bureau of Indian Standards (BIS 10500)'
  },
  {
    title: 'UN SDG Goal 6 Indicators & Target Framework',
    category: 'Sustainability',
    snippet: 'Target 6.4 requires increasing water-use efficiency across all sectors and reducing the percentage of Non-Revenue Water. Target 6.1 enforces universal, affordable drinking water access.',
    content: 'United Nations Sustainable Development Goal 6 Framework: Target 6.1 (universal access), Target 6.4 (water-use efficiency & sustainable withdrawals), Target 6.6 (protecting water-related ecosystems including wetlands and aquifers).',
    source: 'UN Sustainable Development Goals Framework 2030'
  },
  {
    title: 'IPCC AR6 Regional Climate Adaptation Strategy',
    category: 'Climate & Weather',
    content: 'IPCC 6th Assessment Report indicates a 15-20% increase in short-duration extreme precipitation events coupled with prolonged dry spells for coastal South Asia. Regional water management must expand rainwater harvesting and aquifer storage recovery (ASR).',
    source: 'IPCC AR6 Climate Adaptation Working Group'
  },
  {
    title: 'Non-Revenue Water (NRW) Reduction Directives',
    category: 'Smart Cities',
    content: 'Smart City Urban Water Mandate targets reducing Non-Revenue Water (NRW) from 38% to under 15% through District Metered Areas (DMA), automated acoustic sensors, and smart ultrasonic metering at commercial consumption points.',
    source: 'Ministry of Housing and Urban Affairs (MoHUA)'
  },
  {
    title: 'Greywater Recycling & Industrial Reuse Policy',
    category: 'Water Reuse',
    content: 'All industrial processing units consuming >100,000 Liters/day must treat wastewater to tertiary standards (BOD < 10 mg/L, TSS < 10 mg/L) and recycle at least 40% for cooling tower and landscaping applications.',
    source: 'State Pollution Control Board Directives'
  },
  {
    title: 'IoT Sensor Calibration & Troubleshooting Guide',
    category: 'Sensors & Hardware',
    content: 'Electromagnetic flow meters require zero-point re-calibration every 6 months. Hydrostatic pressure transducers exhibiting ping latency >500ms or drift >0.05 bar/day should undergo hardware diagnostic reset or sensor replacement.',
    source: 'AquaSense Hardware Engineering Datasheet'
  },
  {
    title: 'Hazen-Williams & Friction Head Loss Hydraulics',
    category: 'Hydraulic Engineering',
    content: 'Hazen-Williams equation calculates friction head loss in pressure pipes. Roughness coefficient C=140 for new HDPE, C=100 for aged Cast Iron. Velocity should remain between 0.8 m/s and 2.5 m/s to prevent water hammer and sedimentation.',
    source: 'Environmental Engineering Fluid Hydraulics Manual'
  },
  {
    title: 'AquaSense ML Shortage Risk Model Architecture',
    category: 'ML Models',
    content: 'Shortage_GradientBoost_v3 model combines 6 weighted factors: Reservoir Level (25%), Groundwater Depth (20%), Live Precipitation (20%), Consumption Ratio (15%), Active Leaks (10%), Population Density (10%). F1-Score: 0.931.',
    source: 'AquaSense AI MLOps Documentation'
  },
  {
    title: 'Emergency Flood & Drought Response Protocols',
    category: 'Disaster Management',
    content: 'Under Disaster Management Act rules, when regional drought risk score exceeds 80 (Critical), commercial bottling plants are restricted to 25% capacity, and emergency interconnect pipelines from reserve reservoirs are activated.',
    source: 'National Disaster Management Authority (NDMA)'
  },
  {
    title: 'AquaSense REST API Documentation',
    category: 'API & Platform',
    content: 'AquaSense platform endpoints: GET /api/reservoirs (telemetry), GET /api/external/weather (Open-Meteo live feed), GET /api/advanced/ai/risk-score (dynamic ML score), POST /api/ai-assistant/chat (conversational RAG).',
    source: 'AquaSense Developer API Specification'
  },
  {
    title: 'Platform User FAQs & Troubleshooting',
    category: 'User Support',
    content: 'FAQ: How to report a leak? Navigate to Reports tab or tell the AI Assistant "Report a leak at [Location]". FAQ: How to run digital twin stress test? Open Digital Twin Simulator tab inside the AI Assistant window.',
    source: 'AquaSense Platform User Guide'
  },
  {
    title: 'Rainwater Harvesting Pit Construction Standards',
    category: 'Conservation',
    content: 'Rooftop rainwater harvesting systems require 1 m3 filter pit capacity per 100 m2 roof area. Filter media consists of 40mm aggregate base, 20mm gravel middle, and coarse sand top layer for silt removal.',
    source: 'Municipal Building By-Laws & RWH Manual'
  }
];

class RagKnowledgeService {
  private chunks: VectorChunk[] = [];
  private feedbackLog: FeedbackEntry[] = [];

  constructor() {
    this.seedInitialKnowledge();
  }

  private seedInitialKnowledge() {
    this.chunks = INITIAL_KNOWLEDGE_STORE.map((item, idx) => ({
      id: `chunk-seed-${idx + 1}`,
      title: item.title,
      category: item.category,
      content: item.content,
      source: item.source,
      vector: generateEmbedding(`${item.title} ${item.category} ${item.content}`),
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Cosine Similarity Vector Search across RAG Knowledge Store
   */
  public searchVectorKnowledge(query: string, topK: number = 3): Array<VectorChunk & { similarityScore: number }> {
    const queryVector = generateEmbedding(query);
    const hasNonZero = queryVector.some(v => v > 0);

    const scoredChunks = this.chunks.map(chunk => {
      let score = hasNonZero ? cosineSimilarity(queryVector, chunk.vector) : 0;

      // Keyword boost fallback for exact string matches
      const qLower = query.toLowerCase();
      if (chunk.title.toLowerCase().includes(qLower) || chunk.content.toLowerCase().includes(qLower)) {
        score += 0.35;
      }

      return { ...chunk, similarityScore: parseFloat(score.toFixed(3)) };
    });

    // Sort descending by similarity score
    scoredChunks.sort((a, b) => b.similarityScore - a.similarityScore);
    return scoredChunks.slice(0, topK);
  }

  /**
   * Ingest custom document or text snippet into active vector memory (Continuous Learning)
   */
  public ingestDocument(doc: { title: string; category: string; content: string; source?: string }): VectorChunk {
    const chunk: VectorChunk = {
      id: `chunk-user-${Date.now()}`,
      title: doc.title,
      category: doc.category || 'User Uploaded Policy',
      content: doc.content,
      source: doc.source || 'Uploaded Document Ingestion',
      vector: generateEmbedding(`${doc.title} ${doc.category} ${doc.content}`),
      timestamp: new Date().toISOString()
    };

    this.chunks.unshift(chunk);
    console.log(`[RAG Engine] Ingested custom document snippet "${doc.title}". Total Chunks: ${this.chunks.length}`);
    return chunk;
  }

  /**
   * Log user message feedback rating
   */
  public ingestFeedback(feedback: { messageId: string; rating: 'UP' | 'DOWN'; comment?: string }): FeedbackEntry {
    const entry: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      messageId: feedback.messageId,
      rating: feedback.rating,
      comment: feedback.comment,
      timestamp: new Date().toISOString()
    };

    this.feedbackLog.push(entry);
    console.log(`[RAG Engine] Feedback recorded for message ${feedback.messageId}: ${feedback.rating}`);
    return entry;
  }

  /**
   * Get RAG Store Statistics
   */
  public getStats() {
    const categories = Array.from(new Set(this.chunks.map(c => c.category)));
    return {
      totalChunks: this.chunks.length,
      categoriesCount: categories.length,
      categoriesList: categories,
      feedbackCount: this.feedbackLog.length,
      upvotes: this.feedbackLog.filter(f => f.rating === 'UP').length,
      downvotes: this.feedbackLog.filter(f => f.rating === 'DOWN').length
    };
  }
}

export const ragKnowledgeService = new RagKnowledgeService();
