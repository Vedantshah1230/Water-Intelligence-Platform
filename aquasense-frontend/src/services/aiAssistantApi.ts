import api from '@/lib/api';

export type UserRole = 'CITIZEN' | 'FIELD_WORKER' | 'ENGINEER' | 'WATER_OFFICER' | 'DATA_ANALYST' | 'ADMINISTRATOR';
export type Language = 'en' | 'hi' | 'gu';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  role?: UserRole;
  language?: Language;
  actions?: Array<{
    type: 'HIGHLIGHT_MAP' | 'SIMULATE_SCENARIO' | 'DOWNLOAD_REPORT' | 'NAVIGATE';
    label: string;
    payload: any;
  }>;
  dataCard?: {
    title: string;
    metrics: Array<{ label: string; value: string | number; change?: string; status?: 'normal' | 'warning' | 'critical' }>;
    recommendation?: string;
  };
  tableData?: {
    headers: string[];
    rows: Array<Array<string | number>>;
  };
}

export interface SimulationParams {
  populationChangePct: number;
  rainfallChangePct: number;
  reservoirLossPct: number;
  industrialDemandPct: number;
}

export interface SimulationResult {
  baselineRiskScore: number;
  baselineCategory: string;
  simulatedRiskScore: number;
  simulatedCategory: string;
  projectedDeficitMld: number;
  estimatedDaysRemaining: number;
  mitigationStrategy: string;
  parametersUsed: SimulationParams;
}

export const aiAssistantApi = {
  sendMessage: async (message: string, role: UserRole = 'WATER_OFFICER', language: Language = 'en'): Promise<ChatMessage> => {
    const res = await api.post('/ai-assistant/chat', { message, role, language });
    return res.data;
  },

  runSimulation: async (params: SimulationParams): Promise<SimulationResult> => {
    const res = await api.post('/ai-assistant/simulate', params);
    return res.data;
  },

  downloadReport: async (): Promise<Blob> => {
    const res = await api.post('/ai-assistant/report/export', {}, { responseType: 'blob' });
    return res.data;
  },

  searchKnowledge: async (query: string) => {
    const res = await api.get('/ai-assistant/knowledge-search', { params: { q: query } });
    return res.data;
  },

  executeCommand: async (command: 'CREATE_ALERT' | 'ASSIGN_ENGINEER' | 'COMPARE_RESERVOIRS' | 'EXPORT_CSV', payload?: any) => {
    if (command === 'EXPORT_CSV') {
      const res = await api.post('/ai-assistant/command', { command, payload }, { responseType: 'blob' });
      return res.data;
    }
    const res = await api.post('/ai-assistant/command', { command, payload });
    return res.data;
  }
};
