import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { Button } from '@/components/ui/button';
import { mapService } from '@/services/apiServices';
import { toast } from 'sonner';
import { Layers, Download, RefreshCw, Filter } from 'lucide-react';

// Fix Leaflet's default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.5);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
};

export function MapInterface() {
  const [layers, setLayers] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'reservoirs' | 'pipelines' | 'alerts'>('all');

  const fetchMapLayers = async () => {
    try {
      setLoading(true);
      const data = await mapService.getLayers();
      setLayers(data);
    } catch (err: any) {
      toast.error('Failed to load GIS layers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapLayers();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Interactive Enterprise GIS Map</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-Time Pipeline Telemetry, Reservoirs, Groundwater Aquifers, & Incident Overlays
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded font-semibold transition ${activeTab === 'all' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All Layers
            </button>
            <button
              onClick={() => setActiveTab('reservoirs')}
              className={`px-3 py-1 rounded font-semibold transition ${activeTab === 'reservoirs' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Reservoirs
            </button>
            <button
              onClick={() => setActiveTab('pipelines')}
              className={`px-3 py-1 rounded font-semibold transition ${activeTab === 'pipelines' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Pipelines
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1 rounded font-semibold transition ${activeTab === 'alerts' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Alerts
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={fetchMapLayers} className="border-slate-700 text-slate-200">
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Sync GIS
          </Button>

          <Button size="sm" onClick={() => toast.success('GIS GeoJSON layers exported')} className="bg-cyan-600 hover:bg-cyan-500 text-white">
            <Download className="w-4 h-4 mr-1" />
            Export GeoJSON
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 rounded-xl overflow-hidden relative border border-slate-800 shadow-2xl">
        <MapContainer center={[19.1200, 72.8800]} zoom={11} className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Reservoirs */}
          {(activeTab === 'all' || activeTab === 'reservoirs') && layers?.reservoirs?.map((r: any) => (
            <Marker key={`res-${r.id}`} position={[r.lat, r.lng]} icon={createCustomIcon('#0284c7')}>
              <Popup>
                <div className="p-1 min-w-[160px]">
                  <h3 className="font-bold text-slate-900 text-sm">{r.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">Level: <b>{r.level}%</b> | Capacity: {r.capacity} ML</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-semibold text-xs">
                    {r.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Groundwater Wells */}
          {(activeTab === 'all') && layers?.wells?.map((w: any) => (
            <Marker key={`well-${w.id}`} position={[w.lat, w.lng]} icon={createCustomIcon('#10b981')}>
              <Popup>
                <div className="p-1 min-w-[160px]">
                  <h3 className="font-bold text-slate-900 text-sm">{w.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">Depth: {w.depth}m | Table: {w.tableLevel}m</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-xs">
                    {w.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Pipelines */}
          {(activeTab === 'all' || activeTab === 'pipelines') && layers?.pipelines?.map((p: any) => (
            <Polyline
              key={`pipe-${p.id}`}
              positions={p.coordinates}
              pathOptions={{
                color: p.status === 'Leaking' ? '#ef4444' : p.status === 'Risk' ? '#f59e0b' : '#3b82f6',
                weight: 5,
                dashArray: p.status === 'Leaking' ? '10, 10' : undefined
              }}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-slate-900">{p.name}</h4>
                  <p className="text-xs text-slate-600">Material: {p.material} | Health: {p.health}%</p>
                  <p className="text-xs font-semibold text-blue-600">Status: {p.status}</p>
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* Incident Alerts */}
          {(activeTab === 'all' || activeTab === 'alerts') && layers?.incidents?.map((inc: any) => (
            <Marker key={`inc-${inc.id}`} position={[inc.lat, inc.lng]} icon={createCustomIcon(inc.status === 'Pending' ? '#ef4444' : '#f59e0b')}>
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-slate-900 text-xs">{inc.title}</h4>
                  <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">{inc.category}</span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Water Zones */}
          {activeTab === 'all' && layers?.waterZones?.map((z: any) => (
            <Polygon
              key={z.id}
              positions={z.polygon}
              pathOptions={{
                color: z.status === 'Warning' ? '#f59e0b' : '#06b6d4',
                fillOpacity: 0.15
              }}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-slate-900">{z.name}</h4>
                  <p className="text-xs text-slate-600">Water Zone Status: {z.status}</p>
                </div>
              </Popup>
            </Polygon>
          ))}
        </MapContainer>

        {/* Floating Legend */}
        <div className="absolute bottom-6 left-6 z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-2xl text-xs space-y-2 text-slate-200">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2 border-b border-slate-800 pb-1">
            GIS Layer Legend
          </h4>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-sky-500 border border-white" />
            <span>Reservoir / Lake Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
            <span>Groundwater Well</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-1 bg-blue-500 rounded" />
            <span>Trunk Pipeline Network</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-1 bg-red-500 rounded" />
            <span>Leakage / High Risk Duct</span>
          </div>
        </div>
      </div>
    </div>
  );
}
