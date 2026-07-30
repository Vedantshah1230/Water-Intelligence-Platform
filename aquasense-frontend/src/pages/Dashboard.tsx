import React, { useState } from 'react';
import { dashboardService } from '@/services/apiServices';
import { useLivePolling } from '@/hooks/useLivePolling';
import { 
  Activity, AlertTriangle, Droplets, ShieldCheck, Thermometer, Wind, RefreshCw, Layers, Database, Cpu 
} from 'lucide-react';
import { toast } from 'sonner';

export function Dashboard() {
  const { data, loading, error, lastUpdated, refresh } = useLivePolling(dashboardService.getTelemetry, 5000);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
    toast.success('Dashboard metrics refreshed live');
  };

  if (loading && !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-10 h-10 animate-spin text-cyan-400" />
        <p className="text-slate-300 font-medium">Fetching real-time telemetry from AquaSense backend...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8 bg-red-950/40 border border-red-800/50 rounded-xl text-red-200">
        <h3 className="text-lg font-bold">Telemetry Offline</h3>
        <p className="text-sm text-red-300/80 mb-4">{error}</p>
        <button onClick={handleManualRefresh} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold text-sm transition">
          Retry Connection
        </button>
      </div>
    );
  }

  const { weather, systemOverview, aiInsight, reservoirs, sensors, activeAlerts, groundwater, systemHealth } = data || {};

  return (
    <div className="space-y-6">
      {/* Top Bar with Live Refresh & Status Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Water Command</h1>
            <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE POLLING (5s)</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Last Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Just now'} | Monitoring Metro Water Grid
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition border border-cyan-400/30 shadow-lg shadow-cyan-950/50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Hero Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* System Health */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">System Status</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{systemOverview?.systemStatus || 'Healthy'}</span>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
              100% Operational
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Monitoring {systemOverview?.activeSensors || 0} active IoT sensors in real-time.
          </p>
        </div>

        {/* Reservoir Capacity */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Reservoir Level</span>
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{systemOverview?.avgReservoirLevelPct || 0}%</span>
            <span className="text-xs font-medium text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/50">
              {systemOverview?.reservoirsCount || 0} Dams Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Total capacity: 1,647.9 Million Liters</p>
        </div>

        {/* Active Alerts */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Anomalies</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{systemOverview?.activeAlertsCount || 0}</span>
            <span className="text-xs font-medium text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/50">
              Requires Review
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Leaks, pressure drops, or quality warnings</p>
        </div>

        {/* Live Weather */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Weather</span>
            <Thermometer className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{weather?.temp_c}°C</span>
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
              <Wind className="w-3.0 h-3.0 text-slate-400" /> {weather?.humidity}% Hum
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">{weather?.location} • {weather?.condition}</p>
        </div>
      </div>

      {/* AI Risk Score Banner */}
      <div className="p-6 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 rounded-xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-lg">AI Shortage & Anomaly Risk Analysis</h3>
          </div>
          <p className="text-sm text-slate-300">
            Target: <span className="font-semibold text-cyan-300">{aiInsight?.target}</span> • Risk Level:{' '}
            <span className={`font-bold px-2 py-0.5 rounded text-xs ${aiInsight?.riskLevel === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
              {aiInsight?.riskLevel} ({aiInsight?.riskScore}% Probability)
            </span>
          </p>
          <p className="text-xs text-slate-400">{aiInsight?.recommendation}</p>
        </div>
      </div>

      {/* Reservoir & Sensor Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservoirs */}
        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Monitored Reservoirs</span>
            </h3>
            <span className="text-xs text-slate-400">Live Levels</span>
          </div>

          <div className="space-y-3">
            {reservoirs?.map((r: any) => (
              <div key={r.id} className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-200">{r.name}</span>
                  <span className="text-cyan-400 font-mono font-bold">{r.current_level}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${r.current_level < 65 ? 'bg-amber-500' : 'bg-cyan-500'}`} 
                    style={{ width: `${r.current_level}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Capacity: {r.capacity} ML</span>
                  <span>Inflow: {r.today_inflow} ML/d</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & API Infrastructure Health */}
        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Infrastructure & API Node Status</span>
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">ALL SYSTEMS NOMINAL</span>
          </div>

          <div className="space-y-3">
            {systemHealth?.map((h: any) => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <Database className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{h.serviceName}</p>
                    <p className="text-xs text-slate-500">Latency: {h.latencyMs}ms | RAM: {h.memoryUsageMb}MB</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {h.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
