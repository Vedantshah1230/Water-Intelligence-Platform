import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const router = Router();
const prisma = new PrismaClient();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Ingest sensor data and trigger predictions
router.post('/data', async (req: Request, res: Response) => {
  const { sensor_id, flow_rate, pressure, quality } = req.body;
  try {
    // 1. Save data to database
    const sensorData = await prisma.sensorData.create({
      data: { sensor_id, flow_rate, pressure, quality }
    });

    // 2. Call ML service to check for leaks
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict/leakage`, {
      flow_rate,
      pressure
    });

    const mlResult = mlResponse.data;

    // 3. Create an alert if leak is detected
    if (mlResult.leak_detected) {
      await prisma.alert.create({
        data: {
          type: 'Leak Detection',
          severity: mlResult.risk_level,
          location: `Sensor ${sensor_id}`,
          status: 'Active'
        }
      });
    }

    res.json({ 
      message: 'Data processed', 
      ml_prediction: mlResult 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process sensor data' });
  }
});

export default router;
