import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

import authRoutes from './routes/auth';
import sensorRoutes from './routes/sensor';
import dashboardRoutes from './routes/dashboard';
import reservoirRoutes from './routes/reservoir';
import consumptionRoutes from './routes/consumption';
import advancedRoutes from './routes/advanced';
import groundwaterRoutes from './routes/groundwater';
import cron from 'node-cron';
import axios from 'axios';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reservoirs', reservoirRoutes);
app.use('/api/consumption', consumptionRoutes);
app.use('/api/advanced', advancedRoutes);
app.use('/api/groundwater', groundwaterRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'AquaSense AI Backend is running' });
});

import { PrismaClient } from '@prisma/client';
import { getWeatherData } from './services/weather';

const prisma = new PrismaClient();

// Automated Agent: Runs every hour (using * * * * * for testing purposes so it runs every minute in dev)
cron.schedule('* * * * *', async () => {
  console.log('[Automated Agent] Waking up to check water shortage risks...');
  
  try {
    // 1. Fetch live weather data for the city
    const weather = await getWeatherData('Mumbai');
    
    // 2. Fetch current reservoir levels from DB
    const reservoirs = await prisma.reservoir.findMany();
    let avgLevel = 50; // default fallback
    if (reservoirs.length > 0) {
      avgLevel = reservoirs.reduce((sum: number, r: any) => sum + r.current_level, 0) / reservoirs.length;
    }
    
    // 3. Send data to AI Model for shortage prediction
    const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000'}/predict/shortage`, {
      area: 'Mumbai',
      reservoir_level: avgLevel,
      rainfall_forecast: weather.rainfall_mm,
      population_demand: 1200
    });
    
    const risk = mlResponse.data;
    console.log(`[Automated Agent] Shortage Risk: ${risk.risk_level} (${risk.shortage_probability}%)`);
    
    // 4. Generate Alert if High/Critical
    if (risk.risk_level === 'High' || risk.risk_level === 'Critical') {
      await prisma.alert.create({
        data: {
          type: "Shortage",
          severity: risk.risk_level,
          location: risk.area,
          status: "Active"
        }
      });
      console.log('[Automated Agent] Alert saved to database.');
    }
  } catch (error: any) {
    console.error(`[Automated Agent] Failed to run checks: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
