import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Add a new reservoir
router.post('/', async (req: Request, res: Response) => {
  const { name, capacity, current_level } = req.body;
  try {
    const reservoir = await prisma.reservoir.create({
      data: { name, capacity, current_level }
    });
    res.json({ message: 'Reservoir added', reservoir });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add reservoir' });
  }
});

// Get all reservoirs
router.get('/', async (req: Request, res: Response) => {
  try {
    const reservoirs = await prisma.reservoir.findMany();
    res.json(reservoirs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservoirs' });
  }
});

export default router;
