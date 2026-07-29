import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all alerts
router.get('/', async (req: Request, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { timestamp: 'desc' }
    });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Mark alert as resolved
router.put('/:id/resolve', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const alert = await prisma.alert.update({
      where: { id },
      data: { status: 'Resolved' }
    });
    res.json({ message: 'Alert resolved', alert });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

export default router;
