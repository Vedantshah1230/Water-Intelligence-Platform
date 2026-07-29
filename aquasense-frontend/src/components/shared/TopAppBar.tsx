import React from 'react';
import { Settings, Bell, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TopAppBar() {
  return (
    <header className="bg-surface dark:bg-on-background sticky top-0 z-50 w-full shadow-sm">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-base max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Menu button for mobile */}
          <button className="md:hidden text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full active:scale-95">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container hidden md:flex items-center justify-center text-on-primary font-bold">
            S
          </div>
          <Link to="/dashboard" className="font-headline-lg-mobile text-headline-lg-mobile font-semibold text-primary">
            AquaSense AI
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
           <button className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95">
             <Search className="w-6 h-6" />
           </button>
           <button className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95 relative">
             <Bell className="w-6 h-6" />
             <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
           </button>
           <Link to="/dashboard/settings" className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95 hidden md:flex">
             <Settings className="w-6 h-6" />
           </Link>
        </div>
      </div>
    </header>
  );
}
