import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const router = Router();
const prisma = new PrismaClient();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

router.post('/predict', async (req: Request, res: Response) => {
  const { extraction_rate, rainfall_mm, temperature_c } = req.body;
  
  try {
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict/groundwater`, {
        extraction_rate,
        rainfall_mm,
        temperature_c
    });
    
    res.json(mlResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to connect to ML service for groundwater prediction" });
  }
});

export default router;
