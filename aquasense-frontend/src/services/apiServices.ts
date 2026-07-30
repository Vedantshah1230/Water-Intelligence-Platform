import api from '@/lib/api';

export const dashboardService = {
  getTelemetry: async () => {
    const res = await api.get('/dashboard');
    return res.data;
  }
};

export const sensorService = {
  getAll: async () => {
    const res = await api.get('/sensors');
    return res.data;
  }
};

export const alertService = {
  getAll: async () => {
    const res = await api.get('/alerts');
    return res.data;
  }
};

export const reportService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; status?: string; category?: string }) => {
    const res = await api.get('/reports', { params });
    return res.data;
  },
  submitReport: async (reportData: { title: string; description: string; category?: string; location?: string; latitude?: number; longitude?: number; reportedBy?: string }) => {
    const res = await api.post('/reports', reportData);
    return res.data;
  },
  getLeaderboard: async () => {
    const res = await api.get('/reports/leaderboard');
    return res.data;
  },
  exportCSV: async () => {
    const res = await api.get('/reports/export/csv', { responseType: 'blob' });
    return res.data;
  }
};

export const mapService = {
  getLayers: async () => {
    const res = await api.get('/map/layers');
    return res.data;
  }
};

export const adminService = {
  getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },
  updateUser: async (id: string, data: { role?: string; status?: string; department?: string }) => {
    const res = await api.patch(`/admin/users/${id}`, data);
    return res.data;
  },
  getAuditLogs: async () => {
    const res = await api.get('/admin/audit-logs');
    return res.data;
  },
  getApiKeys: async () => {
    const res = await api.get('/admin/api-keys');
    return res.data;
  },
  createApiKey: async (data: { name: string; owner: string }) => {
    const res = await api.post('/admin/api-keys', data);
    return res.data;
  },
  getSystemHealth: async () => {
    const res = await api.get('/admin/system-health');
    return res.data;
  }
};

export const predictionService = {
  getFullPredictions: async () => {
    const res = await api.get('/advanced/ai/full-predictions');
    return res.data;
  },
  getWaterRiskScore: async () => {
    const res = await api.get('/advanced/ai/risk-score');
    return res.data;
  },
  triggerModelTraining: async () => {
    const res = await api.post('/advanced/ai/train-models');
    return res.data;
  },
  getModelVersions: async () => {
    const res = await api.get('/advanced/ai/models');
    return res.data;
  },
  getRecommendations: async () => {
    const res = await api.get('/advanced/ai/recommendations');
    return res.data;
  },
  executeRecommendation: async (id: string) => {
    const res = await api.post(`/advanced/ai/recommendations/${id}/execute`);
    return res.data;
  }
};

export { externalService } from './externalApi';

