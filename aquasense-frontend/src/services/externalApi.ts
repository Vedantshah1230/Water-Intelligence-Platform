import api from '@/lib/api';

export interface WeatherReport {
  source: string;
  latitude: number;
  longitude: number;
  temperatureC: number;
  humidityPct: number;
  rainfallMmCurrent: number;
  precipitation24hMm: number;
  surfacePressureHpa: number;
  windSpeedKmh: number;
  forecastDaily: Array<{
    date: string;
    precipitationMm: number;
    tempMaxC: number;
    tempMinC: number;
  }>;
}

export interface AirQualityReport {
  source: string;
  latitude: number;
  longitude: number;
  aqiUs: number;
  pm25: number;
  pm10: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
  ozone: number;
  carbonMonoxide: number;
  qualityCategory: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Hazardous';
}

export interface NaturalDisasterEvent {
  id: string;
  title: string;
  description?: string;
  category: string;
  sourceUrl?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  date: string;
  severityLevel: 'Low' | 'Moderate' | 'Severe' | 'Critical';
}

export interface ElevationPoint {
  latitude: number;
  longitude: number;
  elevationMeters: number;
  source: string;
}

export interface GeocodingResult {
  displayName: string;
  latitude: number;
  longitude: number;
  type?: string;
  source: string;
}

export interface HydrologicalStationTelemetry {
  stationId: string;
  stationName: string;
  source: string;
  streamflowMld: number;
  gaugeHeightMeters: number;
  waterQualityIndex: number;
  lastUpdated: string;
  status: 'Optimal' | 'High Flow' | 'Low Flow' | 'Flood Warning';
}

export const externalService = {
  getWeather: async (lat: number = 19.0760, lng: number = 72.8777): Promise<WeatherReport> => {
    const res = await api.get('/external/weather', { params: { lat, lng } });
    return res.data;
  },

  getAirQuality: async (lat: number = 19.0760, lng: number = 72.8777): Promise<AirQualityReport> => {
    const res = await api.get('/external/air-quality', { params: { lat, lng } });
    return res.data;
  },

  getDisasters: async (): Promise<NaturalDisasterEvent[]> => {
    const res = await api.get('/external/disasters');
    return res.data;
  },

  getElevation: async (lat: number = 19.0760, lng: number = 72.8777): Promise<ElevationPoint> => {
    const res = await api.get('/external/elevation', { params: { lat, lng } });
    return res.data;
  },

  searchGeocoding: async (query: string): Promise<GeocodingResult[]> => {
    const res = await api.get('/external/geocoding', { params: { q: query } });
    return res.data;
  },

  reverseGeocode: async (lat: number, lng: number): Promise<GeocodingResult> => {
    const res = await api.get('/external/geocoding', { params: { lat, lng } });
    return res.data;
  },

  getWaterTelemetry: async (): Promise<HydrologicalStationTelemetry[]> => {
    const res = await api.get('/external/water-telemetry');
    return res.data;
  }
};
