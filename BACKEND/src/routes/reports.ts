import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get Reports with filtering, search, pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const category = req.query.category as string;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } }
      ];
    }

    const [reports, total] = await Promise.all([
      prisma.citizenReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.citizenReport.count({ where })
    ]);

    res.json({
      data: reports,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch reports', details: error.message });
  }
});

// Submit a new citizen report
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, category, latitude, longitude, location, reportedBy } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const newReport = await prisma.citizenReport.create({
      data: {
        title,
        description,
        category: category || 'Leakage',
        latitude: parseFloat(latitude) || 19.0760,
        longitude: parseFloat(longitude) || 72.8777,
        location: location || 'City District',
        reportedBy: reportedBy || 'Community Member',
        status: 'Pending'
      }
    });

    // Also trigger an audit log
    await prisma.auditLog.create({
      data: {
        action: 'SUBMIT_REPORT',
        details: `Report submitted: "${title}" in ${location}`,
        userName: reportedBy || 'Community Member'
      }
    });

    res.status(201).json(newReport);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create report', details: error.message });
  }
});

// Get Community Leaderboard
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const leaderboard = [
      { id: '1', district: 'North District', level: 'Aqua Saver', points: 1250, reportsResolved: 42 },
      { id: '2', district: 'East Village', level: 'Conservationist', points: 980, reportsResolved: 31 },
      { id: '3', district: 'South Ward', level: 'Eco Warrior', points: 740, reportsResolved: 24 },
      { id: '4', district: 'West Downtown', level: 'Participant', points: 400, reportsResolved: 12 }
    ];
    res.json(leaderboard);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch leaderboard', details: error.message });
  }
});

// Export Reports as CSV
router.get('/export/csv', async (req: Request, res: Response) => {
  try {
    const reports = await prisma.citizenReport.findMany({ orderBy: { createdAt: 'desc' } });
    
    let csv = 'ID,Title,Category,Status,Location,ReportedBy,Upvotes,CreatedAt\n';
    reports.forEach(r => {
      csv += `"${r.id}","${r.title.replace(/"/g, '""')}","${r.category}","${r.status}","${r.location}","${r.reportedBy}",${r.upvotes},"${r.createdAt.toISOString()}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="aquasense_reports.csv"');
    res.status(200).send(csv);
  } catch (error: any) {
    res.status(500).json({ error: 'CSV Export failed', details: error.message });
  }
});

export default router;
