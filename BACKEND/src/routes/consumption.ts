import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Add consumption record
router.post('/', async (req: Request, res: Response) => {
  const { area, date, liters_used } = req.body;
  try {
    const consumption = await prisma.waterConsumption.create({
      data: { area, date: new Date(date), liters_used }
    });
    res.json({ message: 'Consumption recorded', consumption });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record consumption' });
  }
});

// Get consumption records
router.get('/', async (req: Request, res: Response) => {
  try {
    const consumptionRecords = await prisma.waterConsumption.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(consumptionRecords);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch consumption data' });
  }
});

export default router;
