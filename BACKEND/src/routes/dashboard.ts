import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalReservoirs = await prisma.reservoir.count();
    const totalSensors = await prisma.sensorData.count();
    const activeAlerts = await prisma.alert.count({ where: { status: 'Active' } });

    res.json({
      totalReservoirs,
      totalSensors,
      activeAlerts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
