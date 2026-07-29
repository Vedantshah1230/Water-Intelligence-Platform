import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const router = Router();
const prisma = new PrismaClient();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

// 1. Rainwater Harvesting Advisor
router.post('/rainwater', (req: Request, res: Response) => {
  const { roofArea, soilType, rainfall_mm } = req.body;
  
  // Basic calculation: Area * Rainfall * Runoff Coefficient
  let coefficient = 0.8; // default
  if (soilType === 'clay') coefficient = 0.9;
  if (soilType === 'sandy') coefficient = 0.4;
  
  // Calculate potential water saved in Liters
  const potentialLiters = roofArea * rainfall_mm * coefficient;
  
  res.json({
    message: "Rainwater Harvesting Potential",
    roofArea,
    rainfall_mm,
    potential_liters_saved: Math.round(potentialLiters),
    co2_emissions_avoided_kg: +(potentialLiters * 0.0003).toFixed(2) // Fun hackathon metric
  });
});

// 2. Water Demand Simulator (Connects to ML model)
router.post('/simulate-demand', async (req: Request, res: Response): Promise<any> => {
  const { area, reservoir_level, rainfall_forecast, population_demand } = req.body;
  
  try {
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict/shortage`, {
        area,
        reservoir_level,
        rainfall_forecast,
        population_demand
    });
    
    return res.json({
      scenario: "Demand Simulation",
      results: mlResponse.data
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to simulate demand via ML service" });
  }
});

// 3. Citizen Reporting API
router.post('/citizen-report', async (req: Request, res: Response) => {
  const { title, description, latitude, longitude } = req.body;
  try {
    const report = await prisma.citizenReport.create({
      data: {
        title,
        description,
        latitude,
        longitude
      }
    });
    res.json({ message: 'Report submitted successfully!', report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Get all citizen reports
router.get('/citizen-report', async (req: Request, res: Response) => {
  try {
    const reports = await prisma.citizenReport.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// 4. Gamification Leaderboard
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    // In a real scenario, this would aggregate `waterConsumption` by user/area.
    // We'll mock the aggregation for the hackathon UI to show points.
    const leaderboard = [
      { area: "North District", points: 1250, badge: "Aqua Saver 🥇" },
      { area: "East Village", points: 980, badge: "Conservationist 🥈" },
      { area: "South Ward", points: 740, badge: "Eco Warrior 🥉" },
      { area: "West Downtown", points: 400, badge: "Participant" }
    ];
    
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

export default router;
