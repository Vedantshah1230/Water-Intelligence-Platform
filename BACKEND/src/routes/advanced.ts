import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiEngine } from '../services/aiEngine';
import axios from 'axios';

const router = Router();
const prisma = new PrismaClient();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

// 1. Get Multi-Horizon Predictions & AI Forecasts
router.get('/ai/full-predictions', async (req: Request, res: Response) => {
  try {
    const data = await aiEngine.getMultiHorizonPredictions();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate multi-horizon predictions', details: error.message });
  }
});

// 2. Get Composite AI Water Risk Score (0-100)
router.get('/ai/risk-score', async (req: Request, res: Response) => {
  try {
    const riskData = await aiEngine.calculateWaterRiskScore();
    res.json(riskData);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to calculate water risk score', details: error.message });
  }
});

// 3. MLOps Model Retraining Pipeline
router.post('/ai/train-models', async (req: Request, res: Response) => {
  try {
    const newModels = await aiEngine.trainAndEvaluateModels();
    res.json({
      message: 'Automated retraining & model evaluation complete',
      deployedModels: newModels
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Model training pipeline failed', details: error.message });
  }
});

// 4. Get Trained Model Versions & Comparison Metrics
router.get('/ai/models', async (req: Request, res: Response) => {
  try {
    const models = await aiEngine.getModelVersions();
    res.json(models);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch model versions', details: error.message });
  }
});

// 5. Get AI Recommendations List
router.get('/ai/recommendations', async (req: Request, res: Response) => {
  try {
    const recs = await aiEngine.getRecommendations();
    res.json(recs);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch AI recommendations', details: error.message });
  }
});

// 6. Execute an AI Recommendation Action
router.post('/ai/recommendations/:id/execute', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const executed = await aiEngine.executeRecommendation(String(id));
    res.json(executed);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to execute recommendation', details: error.message });
  }
});

// Rainwater Harvesting Advisor
router.post('/rainwater', (req: Request, res: Response) => {
  const { roofArea, soilType, rainfall_mm } = req.body;
  let coefficient = 0.8;
  if (soilType === 'clay') coefficient = 0.9;
  if (soilType === 'sandy') coefficient = 0.4;
  
  const potentialLiters = roofArea * rainfall_mm * coefficient;
  res.json({
    message: "Rainwater Harvesting Potential",
    roofArea,
    rainfall_mm,
    potential_liters_saved: Math.round(potentialLiters),
    co2_emissions_avoided_kg: +(potentialLiters * 0.0003).toFixed(2)
  });
});

// Citizen Reporting API
router.post('/citizen-report', async (req: Request, res: Response) => {
  const { title, description, latitude, longitude } = req.body;
  try {
    const report = await prisma.citizenReport.create({
      data: { title, description, latitude, longitude }
    });
    res.json({ message: 'Report submitted successfully!', report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

router.get('/citizen-report', async (req: Request, res: Response) => {
  try {
    const reports = await prisma.citizenReport.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Gamification Leaderboard
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
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
