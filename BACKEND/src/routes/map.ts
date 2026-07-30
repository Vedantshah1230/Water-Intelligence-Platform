import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get GIS map layers (reservoirs, wells, sensors, pipelines, citizen incident markers, water zones)
router.get('/layers', async (req: Request, res: Response) => {
  try {
    const [reservoirs, sensors, wells, pipelines, incidents, alerts] = await Promise.all([
      prisma.reservoir.findMany(),
      prisma.sensor.findMany(),
      prisma.groundwaterStation.findMany(),
      prisma.pipeline.findMany(),
      prisma.citizenReport.findMany(),
      prisma.alert.findMany()
    ]);

    const waterZones = [
      {
        id: 'zone-1',
        name: 'Zone A - Metro North',
        status: 'Optimal',
        polygon: [
          [19.1200, 72.8200],
          [19.1500, 72.8600],
          [19.1100, 72.8900],
          [19.0800, 72.8400]
        ]
      },
      {
        id: 'zone-2',
        name: 'Zone B - Eastern Industrial Belt',
        status: 'Warning',
        polygon: [
          [19.2000, 72.9500],
          [19.2400, 72.9900],
          [19.1800, 73.0200],
          [19.1500, 72.9600]
        ]
      }
    ];

    res.json({
      reservoirs: reservoirs.map(r => ({
        id: r.id,
        name: r.name,
        lat: r.latitude || 19.5390,
        lng: r.longitude || 73.4354,
        capacity: r.capacity,
        level: r.current_level,
        status: r.status
      })),
      sensors: sensors.map(s => ({
        id: s.sensor_id,
        name: s.name,
        type: s.type,
        lat: s.latitude,
        lng: s.longitude,
        status: s.status,
        flow: s.flow_rate,
        pressure: s.pressure
      })),
      wells: wells.map(w => ({
        id: w.id,
        name: w.name,
        lat: w.latitude,
        lng: w.longitude,
        depth: w.depth_meters,
        tableLevel: w.water_table_level,
        status: w.status
      })),
      pipelines: pipelines.map(p => ({
        id: p.id,
        name: p.name,
        material: p.material,
        status: p.status,
        health: p.health_score,
        coordinates: [
          [p.startLat, p.startLng],
          [p.endLat, p.endLng]
        ]
      })),
      incidents: incidents.map(i => ({
        id: i.id,
        title: i.title,
        lat: i.latitude,
        lng: i.longitude,
        status: i.status,
        category: i.category
      })),
      alerts: alerts.map(a => ({
        id: a.id,
        type: a.type,
        severity: a.severity,
        lat: a.latitude || 19.0760,
        lng: a.longitude || 72.8777,
        location: a.location,
        status: a.status
      })),
      waterZones
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch map layers', details: error.message });
  }
});

export default router;
