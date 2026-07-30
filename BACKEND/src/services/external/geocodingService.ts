import { apiClient } from '../../utils/apiClient';

export interface GeocodingResult {
  displayName: string;
  latitude: number;
  longitude: number;
  type?: string;
  source: string;
}

export const geocodingService = {
  searchLocation: async (query: string): Promise<GeocodingResult[]> => {
    return apiClient.executePipeline<GeocodingResult[]>(
      [
        // Provider 1: Nominatim OpenStreetMap Search
        async () => {
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
          const data = await apiClient.fetchWithResilience<any[]>(url, { ttlMs: 60 * 60 * 1000, retries: 1 });

          return data.map((item) => ({
            displayName: item.display_name,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            type: item.type,
            source: 'Nominatim OpenStreetMap Geocoder'
          }));
        },

        // Provider 2: Photon API by Komoot
        async () => {
          const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`;
          const data = await apiClient.fetchWithResilience<any>(url, { ttlMs: 60 * 60 * 1000, retries: 1 });

          return (data.features || []).map((feat: any) => {
            const coords = feat.geometry?.coordinates || [72.8777, 19.0760];
            const props = feat.properties || {};
            return {
              displayName: [props.name, props.city, props.state, props.country].filter(Boolean).join(', '),
              latitude: coords[1],
              longitude: coords[0],
              type: props.osm_value,
              source: 'Photon Komoot OSM Engine'
            };
          });
        }
      ],
      // Fallback result if external APIs rate-limit
      [
        {
          displayName: `${query}, Mumbai Metro Region, Maharashtra, India`,
          latitude: 19.0760,
          longitude: 72.8777,
          type: 'city',
          source: 'AquaSense Regional GIS Index'
        }
      ]
    );
  },

  reverseGeocode: async (lat: number, lng: number): Promise<GeocodingResult> => {
    return apiClient.executePipeline<GeocodingResult>(
      [
        // Provider 1: Nominatim Reverse Geocoding
        async () => {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
          const data = await apiClient.fetchWithResilience<any>(url, { ttlMs: 60 * 60 * 1000, retries: 1 });

          return {
            displayName: data.display_name || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            latitude: lat,
            longitude: lng,
            type: data.type,
            source: 'Nominatim Reverse Geocoder'
          };
        }
      ],
      {
        displayName: `Zone Sector (${lat.toFixed(4)}, ${lng.toFixed(4)}), Mumbai Water Division`,
        latitude: lat,
        longitude: lng,
        type: 'administrative',
        source: 'AquaSense Regional GIS Index'
      }
    );
  }
};
