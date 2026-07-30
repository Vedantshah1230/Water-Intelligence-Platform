import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Users (with pagination, search, role filtering)
router.get('/users', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const role = (req.query.role as string) || '';

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { department: { contains: search } }
      ];
    }
    if (role && typeof role === 'string') {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, department: true, status: true, createdAt: true }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Update User status / role
router.patch('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, status, department } = req.body;

    const updated = await prisma.user.update({
      where: { id: String(id) },
      data: { role, status, department }
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_USER',
        details: `Updated user ${updated.email} settings.`,
        userName: 'Admin Supervisor'
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Get Audit Logs
router.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch audit logs', details: error.message });
  }
});

// Get API Keys
router.get('/api-keys', async (req: Request, res: Response) => {
  try {
    const keys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(keys);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch API keys', details: error.message });
  }
});

// Create API Key
router.post('/api-keys', async (req: Request, res: Response) => {
  try {
    const { name, owner } = req.body;
    const key = `ak_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const newKey = await prisma.apiKey.create({
      data: { name, owner, key }
    });

    res.status(201).json(newKey);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate API key', details: error.message });
  }
});

// Get System Health & Infrastructure metrics
router.get('/system-health', async (req: Request, res: Response) => {
  try {
    const health = await prisma.systemHealth.findMany();
    const sensorCount = await prisma.sensor.count();
    const activeSensors = await prisma.sensor.count({ where: { status: 'Active' } });
    const reservoirCount = await prisma.reservoir.count();
    const userCount = await prisma.user.count();

    res.json({
      health,
      metrics: {
        sensorCount,
        activeSensors,
        sensorUptimePct: sensorCount > 0 ? ((activeSensors / sensorCount) * 100).toFixed(1) : 100,
        reservoirCount,
        userCount,
        dbStatus: 'Connected (SQLite)',
        serverMemoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch system health', details: error.message });
  }
});

export default router;
