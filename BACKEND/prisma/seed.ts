import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AquaSense AI database...');

  // Clear existing records
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.systemHealth.deleteMany();
  await prisma.prediction.deleteMany();
  await prisma.citizenReport.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.waterConsumption.deleteMany();
  await prisma.pipeline.deleteMany();
  await prisma.groundwaterStation.deleteMany();
  await prisma.sensor.deleteMany();
  await prisma.reservoir.deleteMany();
  await prisma.department.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Supervisor',
      email: 'admin@aquasense.ai',
      password: 'hashed_password_123',
      role: 'ADMIN',
      department: 'Central Command',
      status: 'Active'
    }
  });

  const operator = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'operator@aquasense.ai',
      password: 'hashed_password_123',
      role: 'OPERATOR',
      department: 'Grid Operations',
      status: 'Active'
    }
  });

  // Create Roles
  await prisma.role.createMany({
    data: [
      { name: 'ADMIN', permissions: '["*"]', description: 'Full System Control' },
      { name: 'OPERATOR', permissions: '["read", "write", "manage_alerts"]', description: 'Operations Control Room' },
      { name: 'ANALYST', permissions: '["read", "export_reports"]', description: 'Data & Intelligence' },
      { name: 'CITIZEN', permissions: '["submit_report", "view_status"]', description: 'Public Portal' }
    ]
  });

  // Create Reservoirs
  await prisma.reservoir.createMany({
    data: [
      { name: 'Bhatsa Dam Reservoir', capacity: 942.5, current_level: 82.4, today_inflow: 12.4, today_outflow: 8.1, latitude: 19.5390, longitude: 73.4354, location: 'Thane Region', status: 'Normal' },
      { name: 'Vaitarna Reservoir', capacity: 540.0, current_level: 74.8, today_inflow: 7.2, today_outflow: 5.5, latitude: 19.7890, longitude: 73.2840, location: 'Palghar Region', status: 'Normal' },
      { name: 'Tansa Lake', capacity: 145.0, current_level: 61.2, today_inflow: 2.1, today_outflow: 3.8, latitude: 19.5543, longitude: 73.2625, location: 'North Suburban', status: 'Warning' },
      { name: 'Tulsi Lake', capacity: 20.4, current_level: 89.1, today_inflow: 0.5, today_outflow: 0.4, latitude: 19.2150, longitude: 72.9090, location: 'Sanjay Gandhi Park', status: 'Normal' }
    ]
  });

  // Create Sensors
  await prisma.sensor.createMany({
    data: [
      { sensor_id: 'SNR-101', name: 'Main Intake Flow Sensor A', type: 'Flow', location: 'Bhatsa Pumping Station', latitude: 19.5390, longitude: 73.4354, status: 'Active', flow_rate: 450.5, pressure: 5.2, quality: 98.2 },
      { sensor_id: 'SNR-102', name: 'Suburban Pressure Node 4', type: 'Pressure', location: 'Andheri West Substation', latitude: 19.1197, longitude: 72.8464, status: 'Active', flow_rate: 120.0, pressure: 2.8, quality: 96.5 },
      { sensor_id: 'SNR-103', name: 'South Ward Quality Probe', type: 'Quality', location: 'Colaba Distribution Hub', latitude: 18.9067, longitude: 72.8147, status: 'Active', flow_rate: 85.3, pressure: 3.9, quality: 94.0 },
      { sensor_id: 'SNR-104', name: 'Industrial Belt Acoustic Sensor', type: 'Acoustic', location: 'Thane MIDC Pipeline', latitude: 19.2183, longitude: 72.9781, status: 'Maintenance', flow_rate: 310.0, pressure: 6.1, quality: 91.5 },
      { sensor_id: 'SNR-105', name: 'East Bypass Meter', type: 'Flow', location: 'Ghatkopar Junction', latitude: 19.0860, longitude: 72.9080, status: 'Active', flow_rate: 220.8, pressure: 4.5, quality: 97.0 }
    ]
  });

  // Create Groundwater Stations
  await prisma.groundwaterStation.createMany({
    data: [
      { name: 'Bandra Coastal Well 01', depth_meters: 45.0, water_table_level: 32.4, location: 'Bandra West', latitude: 19.0596, longitude: 72.8295, status: 'Stable' },
      { name: 'Kurla Inland Station B', depth_meters: 60.0, water_table_level: 18.2, location: 'Kurla East', latitude: 19.0657, longitude: 72.8783, status: 'Depleting' },
      { name: 'Navi Mumbai Aquifer Node', depth_meters: 80.0, water_table_level: 55.0, location: 'Vashi Sector 17', latitude: 19.0770, longitude: 72.9980, status: 'Stable' }
    ]
  });

  // Create Pipelines
  await prisma.pipeline.createMany({
    data: [
      { name: 'Trunk Line 01 - North to South', material: 'Steel', length_km: 42.5, startLat: 19.5390, startLng: 73.4354, endLat: 19.0760, endLng: 72.8777, status: 'Good', health_score: 94.5 },
      { name: 'Feeder Line 4B - Eastern Suburbs', material: 'HDPE', length_km: 18.2, startLat: 19.0860, startLng: 72.9080, endLat: 19.0657, endLng: 72.8783, status: 'Risk', health_score: 68.0 },
      { name: 'Industrial Supply Duct C', material: 'Cast Iron', length_km: 12.0, startLat: 19.2183, startLng: 72.9781, endLat: 19.1760, endLng: 72.9500, status: 'Leaking', health_score: 42.0 }
    ]
  });

  // Create Consumption History
  await prisma.waterConsumption.createMany({
    data: [
      { area: 'Mumbai Central', date: new Date('2026-07-24'), liters_used: 1250000, target_liters: 1300000 },
      { area: 'Mumbai Central', date: new Date('2026-07-25'), liters_used: 1280000, target_liters: 1300000 },
      { area: 'Mumbai Central', date: new Date('2026-07-26'), liters_used: 1310000, target_liters: 1300000 },
      { area: 'Mumbai Central', date: new Date('2026-07-27'), liters_used: 1190000, target_liters: 1300000 },
      { area: 'Mumbai Central', date: new Date('2026-07-28'), liters_used: 1240000, target_liters: 1300000 },
      { area: 'Mumbai Central', date: new Date('2026-07-29'), liters_used: 1270000, target_liters: 1300000 },
      { area: 'Mumbai Central', date: new Date('2026-07-30'), liters_used: 1220000, target_liters: 1300000 }
    ]
  });

  // Create Active Alerts
  await prisma.alert.createMany({
    data: [
      { type: 'Leak', severity: 'High', location: 'Thane MIDC Junction', message: 'Acoustic drop detected along Industrial Supply Duct C.', status: 'Active', latitude: 19.2183, longitude: 72.9781 },
      { type: 'Shortage', severity: 'Medium', location: 'Tansa Lake Catchment', message: 'Reservoir level fell below 65% capacity baseline.', status: 'Active', latitude: 19.5543, longitude: 73.2625 },
      { type: 'Low Pressure', severity: 'Low', location: 'Andheri West Substation', message: 'Pressure dropped to 2.8 bar during peak morning usage.', status: 'Acknowledged', latitude: 19.1197, longitude: 72.8464 }
    ]
  });

  // Create Citizen Reports
  await prisma.citizenReport.createMany({
    data: [
      { title: 'Water Leakage on Main Street', description: 'Clean water gushing from underground pipe near City Bank.', category: 'Leakage', latitude: 19.1197, longitude: 72.8464, location: 'Andheri West', status: 'Pending', reportedBy: 'Rohan Sharma', upvotes: 14 },
      { title: 'Discolored Tap Water', description: 'Water coming out yellowish with mild odor.', category: 'Contamination', latitude: 19.0657, longitude: 72.8783, location: 'Kurla East', status: 'Investigating', reportedBy: 'Priya Patel', upvotes: 8 },
      { title: 'Broken Public Hydrant', description: 'Uncontrolled flow from public valve post.', category: 'Waste', latitude: 19.0860, longitude: 72.9080, location: 'Ghatkopar', status: 'Resolved', reportedBy: 'Sunil Kumar', upvotes: 22 }
    ]
  });

  // Create Predictions
  await prisma.prediction.createMany({
    data: [
      { target: 'Sector 4 Pump Station', score: 72.0, risk_level: 'High', confidence: 91.5, recommendedAction: 'Inspect valve seal integrity within 48 hours' },
      { target: 'Main Filtration Unit', score: 12.0, risk_level: 'Low', confidence: 98.0, recommendedAction: 'Routine filter backwash scheduled' },
      { target: 'Eastern Grid Network', score: 58.0, risk_level: 'Medium', confidence: 88.4, recommendedAction: 'Automate off-peak pressure reduction' }
    ]
  });

  // Create System Health
  await prisma.systemHealth.createMany({
    data: [
      { serviceName: 'Database Node Alpha', status: 'Operational', latencyMs: 4.2, memoryUsageMb: 245.0 },
      { serviceName: 'Telemetry Gateway', status: 'Operational', latencyMs: 12.8, memoryUsageMb: 128.5 },
      { serviceName: 'AI Risk Engine', status: 'Operational', latencyMs: 38.0, memoryUsageMb: 512.0 },
      { serviceName: 'Weather API Stream', status: 'Operational', latencyMs: 85.0, memoryUsageMb: 64.0 }
    ]
  });

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      { userId: admin.id, title: 'High Severity Alert', message: 'Leak detected in Thane MIDC Pipeline.', type: 'ALERT' },
      { userId: operator.id, title: 'System Inspection', message: 'Automated pressure check completed for Sector 4.', type: 'INFO' }
    ]
  });

  // Create API Keys
  await prisma.apiKey.createMany({
    data: [
      { name: 'Municipal Command Integration', key: 'ak_live_9f8a3c42b10e45d6', owner: 'City Hall IT', status: 'Active' },
      { name: 'IoT Telemetry Pipeline', key: 'ak_live_7e6d5c4b3a210f9e', owner: 'Grid Sensors Team', status: 'Active' }
    ]
  });

  // Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { userId: admin.id, userName: 'Admin Supervisor', action: 'SYSTEM_STARTUP', details: 'Enterprise backend initialized successfully.', ipAddress: '127.0.0.1' },
      { userId: operator.id, userName: 'Alex Rivera', action: 'ALERT_ACKNOWLEDGE', details: 'Acknowledged low pressure alert on SNR-102.', ipAddress: '192.168.1.15' }
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
