import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/apiServices';
import { Users, Shield, Server, Key, Activity, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSystemHealth();
      setMetrics(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span>Enterprise Admin Control Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System administration, user access control, infrastructure monitoring, and security audit logs
          </p>
        </div>

        <button onClick={fetchHealth} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-white font-semibold flex items-center space-x-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Status</span>
        </button>
      </div>

      {/* Navigation Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/admin/users" className="p-5 bg-slate-900/60 hover:bg-slate-800/80 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition group space-y-2">
          <div className="flex justify-between items-center">
            <Users className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition" />
            <span className="text-xs text-cyan-400 font-bold">Manage &rarr;</span>
          </div>
          <h3 className="font-bold text-white text-base">Users & Roles</h3>
          <p className="text-xs text-slate-400">Total Registered: {metrics?.metrics?.userCount || 2}</p>
        </Link>

        <Link to="/admin/system" className="p-5 bg-slate-900/60 hover:bg-slate-800/80 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition group space-y-2">
          <div className="flex justify-between items-center">
            <Server className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition" />
            <span className="text-xs text-emerald-400 font-bold">Monitor &rarr;</span>
          </div>
          <h3 className="font-bold text-white text-base">System Health</h3>
          <p className="text-xs text-slate-400">Memory: {metrics?.metrics?.serverMemoryMb || 128}MB | SQLite DB</p>
        </Link>

        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-emerald-400 font-bold">100%</span>
          </div>
          <h3 className="font-bold text-white text-base">Sensors Online</h3>
          <p className="text-xs text-slate-400">{metrics?.metrics?.activeSensors || 5} of {metrics?.metrics?.sensorCount || 5} Sensors Active</p>
        </div>

        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <Key className="w-6 h-6 text-amber-400" />
            <span className="text-xs text-amber-400 font-bold">Active</span>
          </div>
          <h3 className="font-bold text-white text-base">API Keys & Tokens</h3>
          <p className="text-xs text-slate-400">2 Enterprise Keys Active</p>
        </div>
      </div>
    </div>
  );
}
