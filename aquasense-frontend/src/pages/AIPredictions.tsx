import React from 'react';
import { Activity, Droplets, ArrowUpRight, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AIPredictions() {
  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-headline-lg text-on-surface">AI Predictions</h2>
          <p className="font-body-md text-on-surface-variant">Machine learning insights based on historical and real-time data.</p>
        </div>
        <Button variant="default">Generate Custom Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-headline-sm text-on-surface">Consumption Forecast</h3>
          </div>
          <div className="h-48 flex items-end justify-between px-2 pb-2 mt-4 border-b border-outline-variant/30">
            {/* Mock Chart */}
            {[40, 55, 45, 60, 75, 65, 80].map((h, i) => (
              <div key={i} className="w-8 bg-primary rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <p className="text-on-surface-variant mt-4 font-body-sm">
            Expected 15% increase in water usage during the upcoming dry season next month.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-headline-sm text-on-surface">Anomaly Risk</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="p-4 border border-outline-variant/50 rounded-xl bg-surface-container-low flex justify-between items-center">
              <div>
                <h4 className="font-label-md text-on-surface">Sector 4 Pump Station</h4>
                <p className="text-xs text-on-surface-variant">Probability of failure in 7 days</p>
              </div>
              <div className="flex items-center gap-1 text-error font-bold">
                <ArrowUpRight className="w-4 h-4" /> 72%
              </div>
            </div>
            <div className="p-4 border border-outline-variant/50 rounded-xl bg-surface-container-low flex justify-between items-center">
              <div>
                <h4 className="font-label-md text-on-surface">Main Filtration Unit</h4>
                <p className="text-xs text-on-surface-variant">Probability of failure in 7 days</p>
              </div>
              <div className="flex items-center gap-1 text-secondary font-bold">
                <TrendingDown className="w-4 h-4" /> 12%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-tertiary-fixed text-on-tertiary-fixed p-6 rounded-2xl border border-outline-variant">
        <h3 className="font-headline-sm mb-2">Automated Optimization</h3>
        <p className="font-body-sm opacity-90 mb-4">AquaSense AI can automatically adjust valve pressures to minimize leakage risk in high-vulnerability zones during off-peak hours.</p>
        <Button variant="default" className="bg-on-tertiary-fixed text-tertiary-fixed hover:bg-on-tertiary-fixed-variant">Enable Auto-Pilot</Button>
      </div>
    </div>
  );
}
