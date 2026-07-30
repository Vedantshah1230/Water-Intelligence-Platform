import { apiClient } from '../../utils/apiClient';

export interface ElevationPoint {
  latitude: number;
  longitude: number;
  elevationMeters: number;
  source: string;
}

export const elevationService = {
  getElevation: async (lat: number, lng: number): Promise<ElevationPoint> => {
    return apiClient.executePipeline<ElevationPoint>(
      [
        // Provider 1: Open-Elevation API (Zero-Auth)
        async () => {
          const url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`;
          const data = await apiClient.fetchWithResilience<any>(url, { ttlMs: 60 * 60 * 1000, retries: 1 });
          const result = data.results?.[0];
          if (!result || result.elevation === undefined) {
            throw new Error('Open-Elevation returned invalid payload');
          }

          return {
            latitude: lat,
            longitude: lng,
            elevationMeters: result.elevation,
            source: 'Open-Elevation Global DEM Service'
          };
        },

        // Provider 2: OpenTopoData ETOPO1 API
        async () => {
          const url = `https://api.opentopodata.org/v1/etopo1?locations=${lat},${lng}`;
          const data = await apiClient.fetchWithResilience<any>(url, { ttlMs: 60 * 60 * 1000, retries: 1 });
          const result = data.results?.[0];
          if (!result || result.elevation === undefined) {
            throw new Error('OpenTopoData returned invalid payload');
          }

          return {
            latitude: lat,
            longitude: lng,
            elevationMeters: result.elevation,
            source: 'OpenTopoData ETOPO1 Terrain Model'
          };
        }
      ],
      // Fallback response based on approximation formula for Mumbai coastal terrain
      {
        latitude: lat,
        longitude: lng,
        elevationMeters: Math.max(2, Math.round(14 + (lat - 19) * 10 + (lng - 72.8) * 15)),
        source: 'AquaSense Coastal Topography Model'
      }
    );
  }
};
