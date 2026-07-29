import React from 'react';
import { Users, Server, HardDrive, Activity, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function AdminDashboard() {
  const kpis = [
    { title: 'Total Users', value: '2,481', change: '+12%', icon: Users },
    { title: 'Active Sessions', value: '184', change: '+5%', icon: Activity },
    { title: 'API Requests / min', value: '1,204', change: '+18%', icon: Zap },
    { title: 'System Health', value: '99.9%', change: 'Normal', icon: Server },
    { title: 'Storage Used', value: '64%', change: '+2%', icon: HardDrive },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-headline-lg text-primary mb-2">Overview Dashboard</h1>
        <p className="font-body-md text-on-surface-variant">
          Real-time enterprise metrics for the AquaSense platform.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="hover:-translate-y-1 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  kpi.change.startsWith('+') ? 'bg-secondary/20 text-secondary' : 
                  kpi.change === 'Normal' ? 'bg-primary/20 text-primary' : 
                  'bg-error/20 text-error'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <h3 className="font-headline-md text-primary">{kpi.value}</h3>
              <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">{kpi.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardContent className="p-6 h-[400px] flex flex-col justify-center items-center text-on-surface-variant">
            <Activity className="w-12 h-12 mb-4 opacity-50" />
            <p>System Traffic Chart (Coming Soon)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 h-[400px] flex flex-col justify-center items-center text-on-surface-variant">
            <Server className="w-12 h-12 mb-4 opacity-50" />
            <p>Server Load (Coming Soon)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
