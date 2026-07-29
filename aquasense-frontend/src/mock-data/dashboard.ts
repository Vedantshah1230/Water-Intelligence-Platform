import type { DashboardData } from '../types';

export const mockDashboardData: DashboardData = {
  waterStatus: {
    overallHealth: 'Good',
    reservoirLevel: 98,
    turbidity: 0.02,
    lastUpdated: new Date().toISOString(),
    summary: 'Your local water supply is safe and stable. Current data indicates no interruptions for the foreseeable future.'
  },
  dailyTip: {
    title: 'Daily Tip',
    description: 'Consider watering crops before 9 AM to save 20% more water.'
  },
  groundwater: {
    id: 'gw-1',
    title: 'Groundwater Level',
    status: 'Good',
    statusLabel: 'STABLE',
    description: 'Groundwater is healthy and expected to remain stable for the next 30 days.',
    actionLabel: 'View details'
  },
  waterQuality: {
    id: 'wq-1',
    title: 'Water Quality',
    status: 'Good',
    statusLabel: 'SAFE',
    description: 'Quality is within optimal range for drinking and irrigation.',
    actionLabel: 'Download report'
  }
};
