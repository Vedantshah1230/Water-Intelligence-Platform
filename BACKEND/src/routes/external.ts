import { Router, Request, Response } from 'express';
import { weatherService } from '../services/external/weatherService';
import { airQualityService } from '../services/external/airQualityService';
import { disasterService } from '../services/external/disasterService';
import { elevationService } from '../services/external/elevationService';
import { geocodingService } from '../services/external/geocodingService';
import { waterDataService } from '../services/external/waterDataService';

const router = Router();

// GET /api/external/weather?lat=19.076&lng=72.8777
router.get('/weather', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 19.0760;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : 72.8777;
    const weather = await weatherService.getWeatherReport(lat, lng);
    res.json(weather);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve weather report', details: error.message });
  }
});

// GET /api/external/air-quality?lat=19.076&lng=72.8777
router.get('/air-quality', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 19.0760;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : 72.8777;
    const airQuality = await airQualityService.getAirQualityReport(lat, lng);
    res.json(airQuality);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve air quality report', details: error.message });
  }
});

// GET /api/external/disasters
router.get('/disasters', async (req: Request, res: Response) => {
  try {
    const events = await disasterService.getActiveDisasterEvents();
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve disaster events', details: error.message });
  }
});

// GET /api/external/elevation?lat=19.076&lng=72.8777
router.get('/elevation', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 19.0760;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : 72.8777;
    const elevation = await elevationService.getElevation(lat, lng);
    res.json(elevation);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve elevation data', details: error.message });
  }
});

// GET /api/external/geocoding?q=Mumbai or ?lat=19.076&lng=72.8777
router.get('/geocoding', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;

    if (query) {
      const results = await geocodingService.searchLocation(query);
      return res.json(results);
    } else if (lat !== undefined && lng !== undefined) {
      const result = await geocodingService.reverseGeocode(lat, lng);
      return res.json(result);
    } else {
      return res.status(400).json({ error: 'Please provide either ?q=search_term or ?lat=..&lng=..' });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to geocode location', details: error.message });
  }
});

// GET /api/external/water-telemetry
router.get('/water-telemetry', async (req: Request, res: Response) => {
  try {
    const telemetry = await waterDataService.getHydrologicalTelemetry();
    res.json(telemetry);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve water telemetry data', details: error.message });
  }
});

export default router;
