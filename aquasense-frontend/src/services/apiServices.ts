import api from '@/lib/api';

export const dashboardService = {
  getTelemetry: async () => {
    try {
      const res = await api.get('/dashboard');
      return res.data;
    } catch (error) {
      console.warn("Backend offline, returning mock telemetry data.");
      return {
        weather: { temp_c: 24, humidity: 45, location: 'Metro Region', condition: 'Clear' },
        systemOverview: { systemStatus: 'Nominal', activeSensors: 124, avgReservoirLevelPct: 82, reservoirsCount: 5, activeAlertsCount: 0 },
        aiInsight: { target: 'Sector 7 Flow Rate', riskLevel: 'Low', riskScore: 12, recommendation: 'Monitor for slight variance during peak hours.' },
        reservoirs: [
          { id: 1, name: 'North Dam', current_level: 85, capacity: 500, today_inflow: 12.5 },
          { id: 2, name: 'East Reservoir', current_level: 60, capacity: 300, today_inflow: 8.2 },
          { id: 3, name: 'West Storage', current_level: 92, capacity: 400, today_inflow: 15.1 }
        ],
        systemHealth: [
          { id: 1, serviceName: 'Telemetry API', latencyMs: 45, memoryUsageMb: 120, status: 'Online' },
          { id: 2, serviceName: 'Predictive Model Engine', latencyMs: 120, memoryUsageMb: 850, status: 'Online' }
        ]
      };
    }
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
    try {
      const res = await api.get('/alerts');
      return res.data;
    } catch (error) {
      console.warn("Backend offline, returning mock alerts.");
      return [
        {
          id: 'alt-001',
          type: 'Pressure Drop',
          severity: 'Critical',
          message: 'Sudden 45% pressure drop detected in primary supply line. Possible major leak.',
          location: 'Sector 4 Pump Station',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          status: 'Active'
        },
        {
          id: 'alt-002',
          type: 'Turbidity Spike',
          severity: 'High',
          message: 'Water turbidity exceeded safe thresholds (NTU > 5).',
          location: 'East Reservoir Intake',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          status: 'Active'
        },
        {
          id: 'alt-003',
          type: 'Pump Malfunction',
          severity: 'Medium',
          message: 'Vibration anomaly detected on Pump C. Predictive maintenance recommended.',
          location: 'Main Filtration Unit',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          status: 'Active'
        },
        {
          id: 'alt-004',
          type: 'Valve Flow Rate',
          severity: 'Low',
          message: 'Slight variance in expected flow rate vs actual.',
          location: 'Sector 7 Distribution',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          status: 'Acknowledged'
        }
      ];
    }
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
    try {
      const res = await api.get('/advanced/ai/full-predictions');
      return res.data;
    } catch (error) {
      console.warn("Backend offline, returning mock full predictions.");
      return {
        horizons: {
          sevenDay: { shortageProbability: 12, riskLevel: 'Low', recommendedAction: 'Maintain current flow rates.' },
          thirtyDay: { shortageProbability: 34, riskLevel: 'Medium', recommendedAction: 'Consider scheduling preventative maintenance.' },
          ninetyDay: { shortageProbability: 68, riskLevel: 'High', recommendedAction: 'Prepare drought contingency plans for Sector B.' }
        },
        reservoirForecasts: [
          { id: 'R1', name: 'North Dam', currentLevel: 85, estimatedDaysRemaining: 120, droughtProbability: 5 },
          { id: 'R2', name: 'East Reservoir', currentLevel: 60, estimatedDaysRemaining: 45, droughtProbability: 25 },
          { id: 'R3', name: 'West Storage', currentLevel: 92, estimatedDaysRemaining: 200, droughtProbability: 2 }
        ],
        leakDetectionMatrix: [
          { id: 'L1', type: 'Acoustic Anomaly', sensorId: 'S-402', location: 'Main Street Line', anomalyScore: 0.89, confidence: 92, status: 'Investigating' },
          { id: 'L2', type: 'Pressure Drop', sensorId: 'S-710', location: 'Industrial Zone B', anomalyScore: 0.65, confidence: 78, status: 'Logged' },
          { id: 'L3', type: 'Flow Rate Mismatch', sensorId: 'S-115', location: 'Residential Grid 4', anomalyScore: 0.95, confidence: 98, status: 'Critical' }
        ],
        sectoralDemandForecast: {
          breakdown: { residentialPct: 45, industrialPct: 35, agriculturePct: 20 }
        }
      };
    }
  },
  getWaterRiskScore: async () => {
    try {
      const res = await api.get('/advanced/ai/risk-score');
      return res.data;
    } catch (error) {
      console.warn("Backend offline, returning mock risk score.");
      return {
        overallRiskScore: 42,
        riskCategory: 'Moderate',
        factors: {
          ClimateFactor: 65,
          InfrastructureFactor: 30,
          DemandFactor: 55
        }
      };
    }
  },
  triggerModelTraining: async () => {
    try {
      const res = await api.post('/advanced/ai/train-models');
      return res.data;
    } catch (error) {
      return { message: 'Mock model training triggered successfully.' };
    }
  },
  getModelVersions: async () => {
    try {
      const res = await api.get('/advanced/ai/models');
      return res.data;
    } catch (error) {
      console.warn("Backend offline, returning mock model versions.");
      return [
        { id: 'M1', name: 'DemandForecaster-Net', version: 'v4.2.1', accuracy: 0.94, f1Score: 0.92, mae: 1.2, rmse: 1.5, status: 'Active' },
        { id: 'M2', name: 'LeakDetect-Transformer', version: 'v2.0.5', accuracy: 0.88, f1Score: 0.85, mae: 0.8, rmse: 1.1, status: 'Active' },
        { id: 'M3', name: 'DroughtPredictor-LSTM', version: 'v3.1.0', accuracy: 0.91, f1Score: 0.89, mae: 2.4, rmse: 3.0, status: 'Training' }
      ];
    }
  },
  getRecommendations: async () => {
    try {
      const res = await api.get('/advanced/ai/recommendations');
      return res.data;
    } catch (error) {
      console.warn("Backend offline, returning mock recommendations.");
      return [
        { id: 'Rec1', title: 'Reduce Flow in Sector B', description: 'Lowering pressure by 15% will reduce stress on aging pipes based on recent acoustic anomaly patterns.', priority: 'HIGH', targetSector: 'Sector B', isExecuted: false },
        { id: 'Rec2', title: 'Schedule Maintenance for Pump 4', description: 'Predictive maintenance suggests a 75% chance of bearing failure within the next 14 days.', priority: 'CRITICAL', targetSector: 'Main Pump Station', isExecuted: false },
        { id: 'Rec3', title: 'Optimize Filter Backwash Cycle', description: 'Current turbidity levels allow for extending the backwash interval by 2 hours, saving energy and water.', priority: 'MEDIUM', targetSector: 'Filtration Unit 2', isExecuted: true }
      ];
    }
  },
  executeRecommendation: async (id: string) => {
    try {
      const res = await api.post(`/advanced/ai/recommendations/${id}/execute`);
      return res.data;
    } catch (error) {
      return { message: 'Mock execution successful.' };
    }
  }
};

export { externalService } from './externalApi';

