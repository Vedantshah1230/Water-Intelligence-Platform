import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [reservoirs, sensors, alerts, groundwater, predictions, health, consumption] = await Promise.all([
      prisma.reservoir.findMany(),
      prisma.sensor.findMany(),
      prisma.alert.findMany({ orderBy: { timestamp: 'desc' }, take: 10 }),
      prisma.groundwaterStation.findMany(),
      prisma.prediction.findMany({ orderBy: { date: 'desc' }, take: 5 }),
      prisma.systemHealth.findMany(),
      prisma.waterConsumption.findMany({ orderBy: { date: 'desc' }, take: 7 })
    ]);

    const activeSensorsCount = sensors.filter(s => s.status === 'Active').length;
    const totalSensorsCount = sensors.length;
    const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;
    const avgReservoirCapacity = reservoirs.length > 0
      ? (reservoirs.reduce((sum, r) => sum + r.current_level, 0) / reservoirs.length).toFixed(1)
      : 0;

    const topRiskPrediction = predictions.length > 0 ? predictions[0] : null;

    res.json({
      timestamp: new Date().toISOString(),
      weather: {
        location: 'Mumbai',
        temp_c: 29.5,
        condition: 'Partly Cloudy',
        humidity: 78,
        rainfall_mm: 12.4
      },
      systemOverview: {
        systemStatus: activeAlertsCount > 2 ? 'Warning' : 'Healthy',
        reservoirsCount: reservoirs.length,
        activeSensors: activeSensorsCount,
        totalSensors: totalSensorsCount,
        avgReservoirLevelPct: Number(avgReservoirCapacity),
        activeAlertsCount
      },
      aiInsight: topRiskPrediction ? {
        riskScore: topRiskPrediction.score,
        riskLevel: topRiskPrediction.risk_level,
        target: topRiskPrediction.target,
        recommendation: topRiskPrediction.recommendedAction
      } : {
        riskScore: 15,
        riskLevel: 'Low',
        target: 'Grid Overview',
        recommendation: 'System operating within optimal parameters.'
      },
      reservoirs,
      sensors,
      activeAlerts: alerts,
      groundwater,
      predictions,
      systemHealth: health,
      recentConsumption: consumption
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch dashboard telemetry', details: error.message });
  }
};

router.get('/', getDashboardStats);
router.get('/stats', getDashboardStats);

export default router;
