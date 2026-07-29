import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mockMapLocations } from '@/mock-data/map';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Fix Leaflet's default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerColor = (status: string) => {
  switch (status) {
    case 'Critical': return '#ba1a1a';
    case 'Warning': return '#cc7700';
    case 'Good': return '#0062a2';
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

export function MapInterface() {
  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-gutter">
        <h2 className="font-headline-lg text-primary">Interactive Map</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Filters</Button>
          <Button variant="default" size="sm">Export</Button>
        </div>
      </div>
      
      <Card className="flex-1 overflow-hidden relative border-none">
        <MapContainer center={[34.0522, -118.2437]} zoom={11} className="w-full h-full z-0 rounded-xl">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mockMapLocations.map(loc => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={createCustomIcon(loc.status)}>
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-headline-sm mb-1">{loc.name}</h3>
                  <p className="font-label-md text-on-surface-variant mb-2">{loc.type}</p>
                  <div className="flex items-center justify-between">
                    <span className={cn("px-2 py-0.5 rounded text-xs font-bold text-white", loc.status === 'Critical' ? 'bg-error' : loc.status === 'Warning' ? 'bg-[#cc7700]' : 'bg-primary')}>
                      {loc.status}
                    </span>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">Details</Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Floating Legend */}
        <div className="absolute bottom-6 left-6 z-10 bg-surface/90 backdrop-blur-md p-4 rounded-xl border border-outline-variant shadow-lg">
          <h4 className="font-label-lg mb-2">Status Legend</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-label-md"><div className="w-3 h-3 rounded-full bg-primary"></div> Good</div>
            <div className="flex items-center gap-2 font-label-md"><div className="w-3 h-3 rounded-full bg-[#cc7700]"></div> Warning</div>
            <div className="flex items-center gap-2 font-label-md"><div className="w-3 h-3 rounded-full bg-error"></div> Critical</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
