export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'Warning' | 'Info';
  timestamp: string;
  location: string;
  resolved: boolean;
}

export const mockAlerts: Alert[] = [
  {
    id: 'alt-1',
    title: 'High Turbidity Detected',
    description: 'Turbidity levels in Reservoir A exceeded 0.05 NTU. Automatic filtration increased.',
    severity: 'Warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    location: 'Reservoir A',
    resolved: false
  },
  {
    id: 'alt-2',
    title: 'Pipeline Pressure Drop',
    description: 'Sudden pressure drop detected in Main Sector 4. Potential leak. Field team notified.',
    severity: 'Critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    location: 'Main Sector 4',
    resolved: false
  },
  {
    id: 'alt-3',
    title: 'Routine Maintenance Complete',
    description: 'Pump Station 2 maintenance finished successfully.',
    severity: 'Info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    location: 'Pump Station 2',
    resolved: true
  }
];
