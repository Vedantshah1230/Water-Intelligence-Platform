import React, { useState, useEffect } from 'react';
import { Droplet, ShieldCheck, ArrowRight, Lightbulb, AlertTriangle, Activity, X } from 'lucide-react';
import { StatusCard } from '@/components/shared/StatusCard';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalSensors: number;
  activeAlerts: number;
  totalReservoirs: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalSensors: 0,
    activeAlerts: 0,
    totalReservoirs: 0
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to load dashboard stats", err));
  }, []);

  const hasAlerts = stats.activeAlerts > 0;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    toast.success('Issue reported successfully to the maintenance team.');
    setShowReportModal(false);
    setReportText('');
  };

  return (
    <>
      <div className="animate-in fade-in duration-500">
        {/* Welcome Header */}
        <section className="mb-gutter">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">👋</span>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface">Welcome back, Sam.</h2>
          </div>
          <p className="font-body-md text-on-surface-variant">
            {hasAlerts ? `You have ${stats.activeAlerts} active alerts.` : 'Water conditions are healthy today.'}
          </p>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          
          {/* Main Water Status Card */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-gutter shadow-sm border border-outline-variant flex flex-col justify-between min-h-[300px] relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-gutter">
                <div>
                  <p className="font-label-md text-on-surface-variant mb-1 uppercase tracking-wider">Current Overall Status</p>
                  <h3 className="font-headline-lg text-primary">System Health</h3>
                </div>
                <span className={`px-4 py-1 rounded-full font-label-md flex items-center gap-2 ${hasAlerts ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                  <span className={`w-2 h-2 rounded-full ${hasAlerts ? 'bg-error' : 'bg-secondary'} status-pulse`}></span>
                  {hasAlerts ? 'Alert Active' : 'Healthy'}
                </span>
              </div>
              <p className="font-body-md text-on-surface-variant max-w-md">
                Monitoring {stats.totalSensors} active IoT sensors across the city grid in real-time.
              </p>
            </div>
            
            <div className="mt-gutter flex items-end justify-between relative z-10">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="font-headline-lg-mobile text-primary">{stats.totalReservoirs}</span>
                  <span className="font-label-md text-outline">Reservoirs</span>
                </div>
                <div className="w-px h-10 bg-outline-variant"></div>
                <div className="flex flex-col">
                  <span className="font-headline-lg-mobile text-primary">{stats.totalSensors}</span>
                  <span className="font-label-md text-outline">Sensors</span>
                </div>
              </div>
              <Button variant="default" size="sm" onClick={() => navigate('/dashboard/map')}>
                Full Systems View
              </Button>
            </div>
            
            {/* Abstract Decorative SVG Element */}
            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none transition-transform group-hover:scale-105 duration-700">
              <svg height="300" viewBox="0 0 200 200" width="300" xmlns="http://www.w3.org/2000/svg">
                <path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,77.3,-44.7C85.4,-31.3,90.5,-15.6,89.4,-0.6C88.3,14.4,81,28.8,72.4,42.4C63.8,56,53.8,68.8,40.4,76.5C27,84.2,10.2,86.8,-6,87.8C-22.2,88.8,-37.8,88.2,-51.2,80.5C-64.6,72.8,-75.8,58.1,-82.1,42.4C-88.4,26.7,-89.8,10,-88.4,-6.2C-87,-22.4,-82.8,-38.1,-74.1,-51.3C-65.4,-64.5,-52.2,-75.2,-37.8,-82C-23.4,-88.8,-7.8,-91.7,3.5,-92.3C14.8,-92.9,29.6,-91.2,44.7,-76.4Z" fill="#38bdf8" transform="translate(100 100)"></path>
              </svg>
            </div>
          </div>

          {/* Daily Tip Card */}
          <div className="md:col-span-4 bg-tertiary-fixed text-on-tertiary-fixed rounded-xl p-gutter border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center mb-gutter shadow-sm">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-headline-lg-mobile mb-base">AI Insight</h4>
              <p className="font-body-md opacity-90">Based on your consumption trends, you can reduce waste by 15%.</p>
            </div>
            <button onClick={() => navigate('/dashboard/predictions')} className="mt-gutter font-label-md text-on-tertiary-fixed-variant flex items-center gap-2 group font-semibold">
              Learn more 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Metric Cards */}
          <StatusCard 
            className="md:col-span-6"
            title="Active Alerts"
            value={stats.activeAlerts.toString()}
            status={stats.activeAlerts > 0 ? 'Critical' : 'Good'}
            description={hasAlerts ? 'AI detected anomalies needing attention.' : 'No active anomalies detected.'}
            actionLabel="View Alerts"
            onAction={() => navigate('/dashboard/alerts')}
            icon={Activity}
          />
          
          <StatusCard 
            className="md:col-span-6"
            title="Reservoir Capacity"
            value={stats.totalReservoirs.toString()}
            status="Good"
            description="Total active reservoirs currently monitored."
            actionLabel="View details"
            onAction={() => navigate('/dashboard/reports')}
            icon={Droplet}
          />
        </div>

        {/* Call to Action Section */}
        <section className="mt-gutter pb-gutter">
          <Button onClick={() => setShowReportModal(true)} variant="error" size="lg" className="w-full flex gap-3 text-xl shadow-lg shadow-error/10 h-16 rounded-xl font-headline-lg-mobile">
            <AlertTriangle className="w-6 h-6" />
            Report an Issue
          </Button>
        </section>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowReportModal(false)} className="absolute top-4 right-4 text-outline hover:text-on-surface">
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-headline-md text-on-surface mb-2">Report an Issue</h3>
            <p className="text-on-surface-variant font-body-sm mb-6">Describe the anomaly or issue you have detected in the network. A support ticket will be generated.</p>
            <form onSubmit={handleReportSubmit}>
              <textarea 
                value={reportText}
                onChange={e => setReportText(e.target.value)}
                placeholder="E.g., Unusual pressure drop at Sector 4 pump station..." 
                className="w-full h-32 bg-surface-container p-4 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-on-surface resize-none mb-4" 
                autoFocus 
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReportModal(false)} type="button">Cancel</Button>
                <Button variant="default" type="submit">Submit Report</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
