import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';

// Fix Leaflet's default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerColor = (status: string) => {
  switch (status) {
    case 'Pending': return '#ba1a1a'; // Red for unresolved issues
    case 'Investigating': return '#cc7700'; // Orange
    case 'Resolved': return '#0062a2'; // Blue
    default: return '#0062a2';
  }
};

const createCustomIcon = (status: string) => {
  const color = getMarkerColor(status);
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

interface CitizenReport {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
}

export function MapInterface() {
  const [reports, setReports] = useState<CitizenReport[]>([]);

  useEffect(() => {
    api.get('/advanced/citizen-report')
      .then(res => setReports(res.data))
      .catch(err => console.error("Failed to load map data", err));
  }, []);

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-gutter">
        <h2 className="font-headline-lg text-primary">Live Incident Map</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast('Filters panel opened')}>Filters</Button>
          <Button variant="default" size="sm" onClick={() => toast.success('Exporting map data...')}>Export</Button>
        </div>
      </div>
      
      <Card className="flex-1 overflow-hidden relative border-none">
        <MapContainer center={[19.0760, 72.8777]} zoom={11} className="w-full h-full z-0 rounded-xl">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reports.map(report => (
            <Marker key={report.id} position={[report.latitude, report.longitude]} icon={createCustomIcon(report.status)}>
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-headline-sm mb-1">{report.title}</h3>
                  <p className="font-label-md text-on-surface-variant mb-2">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={cn("px-2 py-0.5 rounded text-xs font-bold text-white", report.status === 'Pending' ? 'bg-error' : report.status === 'Investigating' ? 'bg-[#cc7700]' : 'bg-primary')}>
                      {report.status}
                    </span>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs" onClick={() => toast(`Loading details for: ${report.title}`)}>Details</Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Floating Legend */}
        <div className="absolute bottom-6 left-6 z-10 bg-surface/90 backdrop-blur-md p-4 rounded-xl border border-outline-variant shadow-lg">
          <h4 className="font-label-lg mb-2">Issue Status</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-label-md"><div className="w-3 h-3 rounded-full bg-error"></div> Pending</div>
            <div className="flex items-center gap-2 font-label-md"><div className="w-3 h-3 rounded-full bg-[#cc7700]"></div> Investigating</div>
            <div className="flex items-center gap-2 font-label-md"><div className="w-3 h-3 rounded-full bg-primary"></div> Resolved</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
