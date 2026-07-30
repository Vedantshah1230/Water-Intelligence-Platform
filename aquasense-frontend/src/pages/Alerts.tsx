import React, { useState, useEffect } from 'react';
import { alertService } from '@/services/apiServices';
import { toast } from 'sonner';
import { AlertTriangle, ShieldAlert, CheckCircle, Search, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertService.getAll();
      setAlerts(data || []);
    } catch (err: any) {
      toast.error('Failed to load alerts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter(a => {
    const matchesSeverity = severityFilter ? a.severity === severityFilter : true;
    const matchesSearch = search ? (
      a.location.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.message?.toLowerCase().includes(search.toLowerCase())
    ) : true;
    return matchesSeverity && matchesSearch;
  });

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Acknowledged' } : a));
    toast.success('Alert acknowledged by command operator.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <span>Active Grid Telemetry Alerts</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time anomaly detection for pressure drops, leaks, shortage risks, and water quality
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search alerts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 pl-8 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <Button onClick={fetchAlerts} variant="outline" size="sm" className="border-slate-700 text-slate-200">
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Sync
          </Button>
        </div>
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-cyan-400" />
          <p className="text-sm">Fetching real-time anomaly stream from database...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
          <p className="font-semibold text-white">No active anomalies found matching criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Water grid telemetry is currently running operating specs.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                alert.severity === 'Critical' || alert.severity === 'High'
                  ? 'bg-red-950/20 border-red-900/50 hover:border-red-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.severity === 'High' || alert.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'
                  }`} />
                  <h3 className="font-bold text-white text-base">{alert.type} Alert</h3>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
                    alert.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                    alert.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                    'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium pl-8">{alert.message || 'Telemetry anomaly observed.'}</p>
                <p className="text-[11px] text-slate-500 pl-8">
                  Location: <span className="text-slate-300">{alert.location}</span> • Triggered: {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-center">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                  alert.status === 'Active' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {alert.status}
                </span>
                {alert.status === 'Active' && (
                  <Button size="sm" onClick={() => handleAcknowledge(alert.id)} className="bg-slate-800 hover:bg-slate-700 text-white text-xs">
                    Acknowledge
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
