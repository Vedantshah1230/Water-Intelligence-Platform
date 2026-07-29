import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BellRing, Map, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNavBar() {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Home", end: true },
    { to: "/dashboard/alerts", icon: BellRing, label: "Alerts" },
    { to: "/dashboard/map", icon: Map, label: "Map" },
    { to: "/dashboard/reports", icon: FileText, label: "Reports" },
    { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-surface-container rounded-t-xl shadow-[0_-4px_12px_0_rgba(0,93,167,0.08)]">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center px-4 py-1 active:scale-90 transition-all duration-200 rounded-full",
            isActive 
              ? "bg-secondary-container text-on-secondary-container" 
              : "text-on-surface-variant hover:text-primary"
          )}
        >
          <item.icon className="w-6 h-6 mb-1" />
          <span className="font-label-md text-[10px]">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
