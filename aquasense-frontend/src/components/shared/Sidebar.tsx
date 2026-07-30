import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BellRing, Map, Users, Settings, FileText, Activity, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function Sidebar() {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/dashboard/alerts", icon: BellRing, label: "Alerts" },
    { to: "/dashboard/map", icon: Map, label: "GIS Map" },
    { to: "/dashboard/reports", icon: FileText, label: "Reports" },
    { to: "/dashboard/predictions", icon: Activity, label: "AI Predictions" },
    { to: "/dashboard/community", icon: Users, label: "Community" },
    { to: "/dashboard/about", icon: FileText, label: "About" },
    { to: "/dashboard/settings", icon: Settings, label: "Settings" },
    { to: "/admin", icon: Shield, label: "Admin Panel" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-outline-variant bg-surface-container-lowest h-[calc(100vh-64px)] sticky top-16">
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-body-md",
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-medium"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-outline-variant">
        <div className="bg-surface-container-low rounded-xl p-4">
          <p className="font-label-md text-primary mb-1">Need help?</p>
          <p className="font-body-sm text-on-surface-variant mb-3">Ask the AquaSense AI Assistant for guidance.</p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-aquasense-ai-chat'))} 
            className="w-full bg-primary text-white py-2 rounded-lg font-label-md hover:brightness-110 transition-all text-sm font-semibold shadow-sm"
          >
            Open Chat
          </button>
        </div>
      </div>
    </aside>
  );
}
