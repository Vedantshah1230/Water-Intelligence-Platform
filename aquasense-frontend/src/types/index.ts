export interface WaterStatus {
  overallHealth: 'Good' | 'Warning' | 'Critical';
  reservoirLevel: number; // percentage
  turbidity: number;
  lastUpdated: string;
  summary: string;
}

export interface DailyTip {
  title: string;
  description: string;
}

export interface MetricCard {
  id: string;
  title: string;
  status: 'Good' | 'Warning' | 'Critical' | 'Info';
  statusLabel: string;
  description: string;
  actionLabel: string;
}

export interface DashboardData {
  waterStatus: WaterStatus;
  dailyTip: DailyTip;
  groundwater: MetricCard;
  waterQuality: MetricCard;
}
