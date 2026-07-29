export interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'Reservoir' | 'Pump Station' | 'Pipeline' | 'Treatment Plant';
  status: 'Good' | 'Warning' | 'Critical';
}

export const mockMapLocations: MapLocation[] = [
  { id: 'm-1', name: 'Reservoir Alpha', lat: 34.0522, lng: -118.2437, type: 'Reservoir', status: 'Good' },
  { id: 'm-2', name: 'Pump Station 2', lat: 34.0622, lng: -118.2537, type: 'Pump Station', status: 'Warning' },
  { id: 'm-3', name: 'Main Pipeline Sector A', lat: 34.0422, lng: -118.2337, type: 'Pipeline', status: 'Critical' },
];
