import React from 'react';
import { mockAlerts } from '@/mock-data/alerts';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Alerts() {
  const getIcon = (severity: string, resolved: boolean) => {
    if (resolved) return <CheckCircle className="w-6 h-6 text-primary" />;
    switch (severity) {
      case 'Critical': return <AlertTriangle className="w-6 h-6 text-error" />;
      case 'Warning': return <AlertTriangle className="w-6 h-6 text-[#cc7700]" />;
      case 'Info': return <Info className="w-6 h-6 text-secondary" />;
      default: return <Info className="w-6 h-6 text-primary" />;
    }
  };

  const getBgColor = (severity: string, resolved: boolean) => {
    if (resolved) return 'bg-primary-fixed/30 border-l-4 border-primary';
    switch (severity) {
      case 'Critical': return 'bg-error-container/30 border-l-4 border-error';
      case 'Warning': return 'bg-[#ffedcc]/30 border-l-4 border-[#cc7700]';
      case 'Info': return 'bg-secondary-container/30 border-l-4 border-secondary';
      default: return 'bg-surface-container border-l-4 border-primary';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-gutter">
        <h2 className="font-headline-lg text-primary">System Alerts</h2>
        <Button variant="outline" size="sm">Mark all as read</Button>
      </div>

      <div className="space-y-4">
        {mockAlerts.map(alert => (
          <Card key={alert.id} className={cn("overflow-hidden transition-all hover:shadow-md", getBgColor(alert.severity, alert.resolved))}>
            <CardContent className="p-gutter flex items-start gap-4">
              <div className="mt-1 bg-surface-container-lowest p-2 rounded-full shadow-sm">
                {getIcon(alert.severity, alert.resolved)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-headline-sm text-on-surface">{alert.title}</h3>
                  <span className="font-label-sm text-on-surface-variant flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="font-body-md text-on-surface-variant mb-3">{alert.description}</p>
                <div className="flex items-center gap-4">
                  <span className="font-label-sm text-on-surface-variant flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded">
                    <MapPin className="w-3 h-3" />
                    {alert.location}
                  </span>
                  {!alert.resolved && (
                    <Button variant={alert.severity === 'Critical' ? 'error' : 'secondary'} size="sm" className="h-7 text-xs ml-auto">
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
