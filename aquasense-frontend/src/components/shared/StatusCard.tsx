import React from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface StatusCardProps {
  title: string;
  value: string;
  status: 'Good' | 'Warning' | 'Critical' | 'Info';
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function StatusCard({
  title,
  value,
  status,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  className
}: StatusCardProps) {
  
  const getStatusStyles = () => {
    switch (status) {
      case 'Good':
        return {
          iconBg: 'bg-primary-fixed/50',
          iconColor: 'text-primary',
          badgeBg: 'bg-primary-fixed/40',
          badgeText: 'text-primary'
        };
      case 'Warning':
        return {
          iconBg: 'bg-[#ffedcc]', // fallback custom color if needed
          iconColor: 'text-[#cc7700]',
          badgeBg: 'bg-[#ffedcc]',
          badgeText: 'text-[#cc7700]'
        };
      case 'Critical':
        return {
          iconBg: 'bg-error-container/50',
          iconColor: 'text-error',
          badgeBg: 'bg-error-container/40',
          badgeText: 'text-error'
        };
      case 'Info':
      default:
        return {
          iconBg: 'bg-secondary-container/50',
          iconColor: 'text-secondary',
          badgeBg: 'bg-secondary-container/40',
          badgeText: 'text-secondary'
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <Card className={cn("hover:shadow-md transition-shadow duration-300", className)}>
      <CardContent className="p-gutter pt-gutter flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-4 mb-gutter">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", styles.iconBg)}>
              <Icon className={cn("w-6 h-6", styles.iconColor)} />
            </div>
            <div>
              <p className="font-label-md text-outline uppercase">{title}</p>
              <h4 className="font-headline-lg-mobile text-on-surface">{value}</h4>
            </div>
            <div className="ml-auto">
              <span className={cn("font-label-md px-2 py-1 rounded uppercase", styles.badgeBg, styles.badgeText)}>
                {status}
              </span>
            </div>
          </div>
          <p className="font-body-sm text-on-surface-variant mb-gutter">
            {description}
          </p>
        </div>
        
        {actionLabel && (
          <button 
            onClick={onAction}
            className="w-full py-base border-2 border-outline-variant rounded-lg font-label-md text-primary hover:bg-surface-container-low transition-colors active:scale-[0.98]"
          >
            {actionLabel}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
