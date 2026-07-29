import express from 'express';
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
import cron from 'node-cron';
import axios from 'axios';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AquaSense AI Backend is running' });
});

// Scheduled Jobs (runs every hour)
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled AI prediction check...');
  try {
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    // Example: Trigger shortage prediction for Ward 12
    const response = await axios.post(`${ML_SERVICE_URL}/predict/shortage`, {
      area: "Ward 12",
      reservoir_level: 25.0,
      rainfall_forecast: 2.0
    });
    console.log('AI Prediction Result:', response.data);
  } catch (error) {
    console.error('Error connecting to ML service for scheduled job');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
