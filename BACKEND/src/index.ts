import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

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
import alertsRoutes from './routes/alerts';
import adminRoutes from './routes/admin';
import reportsRoutes from './routes/reports';
import mapRoutes from './routes/map';
import externalRoutes from './routes/external';
import aiAssistantRoutes from './routes/aiAssistant';

const prisma = new PrismaClient();

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reservoirs', reservoirRoutes);
app.use('/api/consumption', consumptionRoutes);
app.use('/api/advanced', advancedRoutes);
app.use('/api/groundwater', groundwaterRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/ai-assistant', aiAssistantRoutes);

// Health Check API
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    res.json({
      status: 'ok',
      service: 'AquaSense AI Enterprise Backend',
      database: 'Connected (SQLite)',
      registeredUsers: userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ status: 'degraded', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[AquaSense Enterprise Backend] Running on http://localhost:${PORT}`);
});
