import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/apiServices';
import { Server, Database, Shield, Activity, RefreshCw, Key, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function SystemHealth() {
  const [healthData, setHealthData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [keyName, setKeyName] = useState('');
  const [keyOwner, setKeyOwner] = useState('');

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      const [h, logs, keys] = await Promise.all([
        adminService.getSystemHealth(),
        adminService.getAuditLogs(),
        adminService.getApiKeys()
      ]);
      setHealthData(h);
      setAuditLogs(logs || []);
      setApiKeys(keys || []);
    } catch (err: any) {
      toast.error('Failed to load system health: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName || !keyOwner) {
      toast.error('Please enter name and owner');
      return;
    }
    try {
      await adminService.createApiKey({ name: keyName, owner: keyOwner });
      toast.success('API key generated successfully!');
      setKeyName('');
      setKeyOwner('');
      fetchSystemData();
    } catch (err: any) {
      toast.error('Failed to create key: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Server className="w-6 h-6 text-emerald-400" />
            <span>Infrastructure Health & Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time server latencies, database connectivity, audit telemetry, and developer API key access
          </p>
        </div>

        <Button onClick={fetchSystemData} variant="outline" size="sm" className="border-slate-700 text-slate-200">
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Sync Metrics
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Logs Stream */}
        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span>Real-Time Audit & Security Logs</span>
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-cyan-400">{log.action}</span>
                  <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-300">{log.details}</p>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                  <span>User: {log.userName}</span>
                  <span>IP: {log.ipAddress || '127.0.0.1'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Key Management */}
        <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Key className="w-5 h-5 text-amber-400" />
            <span>Developer & Municipal API Keys</span>
          </h3>

          <form onSubmit={handleCreateApiKey} className="flex gap-2 text-xs">
            <input
              type="text"
              placeholder="Key Name (e.g. Scada Integration)"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none"
            />
            <input
              type="text"
              placeholder="Owner"
              value={keyOwner}
              onChange={(e) => setKeyOwner(e.target.value)}
              className="w-1/3 p-2 bg-slate-950 border border-slate-800 rounded text-white focus:outline-none"
            />
            <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-500 text-white">
              <Plus className="w-4 h-4 mr-1" /> Create
            </Button>
          </form>

          <div className="space-y-2">
            {apiKeys.map((k) => (
              <div key={k.id} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{k.name}</p>
                  <p className="font-mono text-slate-500 text-[11px]">{k.key}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {k.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
