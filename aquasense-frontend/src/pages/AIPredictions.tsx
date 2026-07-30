import React, { useState, useEffect } from 'react';
import { predictionService } from '@/services/apiServices';
import { toast } from 'sonner';
import { 
  Cpu, Zap, Activity, CheckCircle, RefreshCw, BarChart2, Shield, AlertTriangle, 
  Layers, Droplets, Database, Play, Check, TrendingDown, Clock, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AIPredictions() {
  const [predictions, setPredictions] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [modelVersions, setModelVersions] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [training, setTraining] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'horizons' | 'riskScore' | 'leaks' | 'mlops'>('horizons');

  const fetchAIData = async () => {
    try {
      setLoading(true);
      const [p, r, m, recs] = await Promise.all([
        predictionService.getFullPredictions(),
        predictionService.getWaterRiskScore(),
        predictionService.getModelVersions(),
        predictionService.getRecommendations()
      ]);
      setPredictions(p);
      setRiskData(r);
      setModelVersions(m || []);
      setRecommendations(recs || []);
    } catch (err: any) {
      toast.error('Failed to load AI intelligence data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIData();
  }, []);

  const handleTrainModels = async () => {
    try {
      setTraining(true);
      toast.info('Initiating MLOps cross-validation & hyperparameter retraining pipeline...');
      const result = await predictionService.triggerModelTraining();
      toast.success(result.message || 'Models retrained and evaluated successfully!');
      fetchAIData();
    } catch (err: any) {
      toast.error('Model training failed: ' + err.message);
    } finally {
      setTraining(false);
    }
  };

  const handleExecuteRecommendation = async (id: string) => {
    try {
      await predictionService.executeRecommendation(id);
      toast.success('AI recommendation executed and logged in audit trail!');
      setRecommendations(prev => prev.map(r => r.id === id ? { ...r, isExecuted: true } : r));
    } catch (err: any) {
      toast.error('Failed to execute recommendation: ' + err.message);
    }
  };

  if (loading && !predictions) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-10 h-10 animate-spin text-cyan-400 mb-3" />
        <p className="font-semibold text-white">Running Environmental AI Neural Inference Engine...</p>
      </div>
    );
  }

  const { horizons, reservoirForecasts, groundwaterForecast, leakDetectionMatrix, sectoralDemandForecast } = predictions || {};

  return (
    <div className="space-y-6">
      {/* Top Bar & Workbench Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>AI Environmental Intelligence & MLOps Suite</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-horizon forecasts, 0-100 composite risk scoring, acoustic leak detection, and automated model training
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={handleTrainModels} disabled={training} className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg">
            <Play className={`w-3.5 h-3.5 mr-1.5 ${training ? 'animate-spin' : ''}`} />
            {training ? 'Retraining Pipeline...' : 'Train ML Models'}
          </Button>

          <Button onClick={fetchAIData} variant="outline" size="sm" className="border-slate-700 text-slate-200">
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Sync
          </Button>
        </div>
      </div>

      {/* Interactive Workbench Tab Selection */}
      <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('horizons')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg transition ${activeTab === 'horizons' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          Multi-Horizon Forecasts
        </button>
        <button
          onClick={() => setActiveTab('riskScore')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg transition ${activeTab === 'riskScore' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          AI Water Risk Score (0-100)
        </button>
        <button
          onClick={() => setActiveTab('leaks')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg transition ${activeTab === 'leaks' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          Leak Detection Matrix
        </button>
        <button
          onClick={() => setActiveTab('mlops')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg transition ${activeTab === 'mlops' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          MLOps Model Evaluation
        </button>
      </div>

      {/* TAB 1: Multi-Horizon & Sectoral Forecasts */}
      {activeTab === 'horizons' && (
        <div className="space-y-6">
          {/* 7D, 30D, 90D Multi-Horizon Shortage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 7 Days */}
            <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">7-Day Shortage Horizon</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">{horizons?.sevenDay?.shortageProbability}%</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${horizons?.sevenDay?.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {horizons?.sevenDay?.riskLevel} Risk
                </span>
              </div>
              <p className="text-xs text-slate-400">{horizons?.sevenDay?.recommendedAction}</p>
            </div>

            {/* 30 Days */}
            <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">30-Day Shortage Horizon</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">{horizons?.thirtyDay?.shortageProbability}%</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${horizons?.thirtyDay?.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {horizons?.thirtyDay?.riskLevel} Risk
                </span>
              </div>
              <p className="text-xs text-slate-400">{horizons?.thirtyDay?.recommendedAction}</p>
            </div>

            {/* 90 Days */}
            <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">90-Day Shortage Horizon</span>
                <Clock className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">{horizons?.ninetyDay?.shortageProbability}%</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${horizons?.ninetyDay?.riskLevel === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {horizons?.ninetyDay?.riskLevel} Risk
                </span>
              </div>
              <p className="text-xs text-slate-400">{horizons?.ninetyDay?.recommendedAction}</p>
            </div>
          </div>

          {/* Reservoir & Sectoral Demand Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reservoir Forecasts */}
            <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Droplets className="w-5 h-5 text-cyan-400" />
                <span>Reservoir Level & Drought Forecast</span>
              </h3>

              <div className="space-y-3">
                {reservoirForecasts?.map((r: any) => (
                  <div key={r.id} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-white">
                      <span>{r.name}</span>
                      <span className="text-cyan-400 font-mono">{r.currentLevel}% Current</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Est. Days Remaining: <strong className="text-white">{r.estimatedDaysRemaining} days</strong></span>
                      <span>Drought Prob: <strong className="text-amber-400">{r.droughtProbability}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sectoral Water Demand Split */}
            <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center space-x-2 border-b border-slate-800 pb-3">
                <BarChart2 className="w-5 h-5 text-indigo-400" />
                <span>Sectoral Demand Distribution</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Residential Usage</span>
                    <span>{sectoralDemandForecast?.breakdown?.residentialPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${sectoralDemandForecast?.breakdown?.residentialPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Industrial Sector</span>
                    <span>{sectoralDemandForecast?.breakdown?.industrialPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${sectoralDemandForecast?.breakdown?.industrialPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Agriculture & Irrigation</span>
                    <span>{sectoralDemandForecast?.breakdown?.agriculturePct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${sectoralDemandForecast?.breakdown?.agriculturePct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI Water Risk Score Breakdown (0-100) */}
      {activeTab === 'riskScore' && (
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gradient-to-r from-cyan-950/80 via-slate-950 to-indigo-950/80 rounded-xl border border-cyan-500/30">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Composite Water Risk Index</span>
              <h2 className="text-4xl font-black text-white">{riskData?.overallRiskScore || 34} / 100</h2>
              <p className="text-sm text-slate-300">
                Risk Classification:{' '}
                <span className="font-bold text-emerald-400">{riskData?.riskCategory || 'Low'} Risk</span>
              </p>
            </div>

            <div className="w-32 h-32 rounded-full border-4 border-cyan-400 flex items-center justify-center bg-slate-900 shadow-2xl">
              <span className="text-3xl font-black text-white">{riskData?.overallRiskScore || 34}</span>
            </div>
          </div>

          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">Risk Model Factor Weights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {Object.entries(riskData?.factors || {}).map(([key, val]: any) => (
              <div key={key} className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">{key.replace('Factor', '')} Weight</span>
                <p className="text-lg font-bold text-white">{val} / 100</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Acoustic & Pressure Leak Detection Matrix */}
      {activeTab === 'leaks' && (
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Activity className="w-5 h-5 text-red-400" />
            <span>Acoustic & Flow Anomaly Leak Detection Matrix</span>
          </h3>

          <div className="space-y-3">
            {leakDetectionMatrix?.map((leak: any) => (
              <div key={leak.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{leak.type}</span>
                    <span className="text-xs text-slate-400 font-mono">[{leak.sensorId}]</span>
                  </div>
                  <p className="text-xs text-slate-300">Location: {leak.location}</p>
                  <p className="text-[11px] text-slate-500">Anomaly Score: {leak.anomalyScore}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded border border-cyan-800/50">
                    {leak.confidence}% Confidence
                  </span>
                  <span className="text-xs font-bold text-red-400 bg-red-950/50 px-3 py-1 rounded border border-red-800/50">
                    {leak.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MLOps Model Training & Comparison Workbench */}
      {activeTab === 'mlops' && (
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>MLOps Model Retraining & Metric Comparison Suite</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Model Name</th>
                  <th className="p-3">Version</th>
                  <th className="p-3">Accuracy</th>
                  <th className="p-3">F1 Score</th>
                  <th className="p-3">MAE</th>
                  <th className="p-3">RMSE</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {modelVersions.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-950/40 transition">
                    <td className="p-3 font-semibold text-white">{m.name}</td>
                    <td className="p-3 font-mono text-cyan-300">{m.version}</td>
                    <td className="p-3 font-mono">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{(m.f1Score * 100).toFixed(1)}%</td>
                    <td className="p-3 font-mono">{m.mae}</td>
                    <td className="p-3 font-mono">{m.rmse}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Automated AI Recommendation Action Engine */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Automated AI Recommendation Action Stream</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    rec.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    rec.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{rec.description}</p>
                <p className="text-[11px] text-slate-500">Sector: <span className="text-slate-300">{rec.targetSector}</span></p>
              </div>

              {rec.isExecuted ? (
                <div className="flex items-center text-xs font-semibold text-emerald-400 pt-2">
                  <Check className="w-4 h-4 mr-1" /> Recommendation Executed
                </div>
              ) : (
                <Button size="sm" onClick={() => handleExecuteRecommendation(rec.id)} className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs mt-2">
                  Execute Recommendation
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
