import React, { useState } from 'react';
import { Settings, Bell, Search, Menu, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function TopAppBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear auth context/tokens here
    toast('Logged out successfully');
    navigate('/auth/login');
  };

  return (
    <>
      <header className="bg-surface dark:bg-on-background sticky top-0 z-50 w-full shadow-sm border-b border-outline-variant/30">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-base max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => toast('Menu opened')} className="md:hidden text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full active:scale-95">
              <Menu className="w-6 h-6" />
            </button>
            
            <button onClick={() => setShowProfile(!showProfile)} className="relative w-10 h-10 rounded-full overflow-hidden bg-primary-container hidden md:flex items-center justify-center text-on-primary font-bold cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              S
              {showProfile && (
                <div className="absolute top-12 left-0 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-premium z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="p-3 border-b border-outline-variant/50">
                    <p className="font-label-md text-on-surface">Sam User</p>
                    <p className="text-xs text-on-surface-variant">sam@example.com</p>
                  </div>
                  <button onClick={() => navigate('/dashboard/settings')} className="w-full text-left px-4 py-2 hover:bg-surface-container flex items-center gap-2 text-sm text-on-surface">
                    <UserIcon className="w-4 h-4" /> Profile
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-error-container hover:text-on-error-container flex items-center gap-2 text-sm text-error">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </button>
            <Link to="/dashboard" className="font-headline-lg-mobile text-headline-lg-mobile font-semibold text-primary ml-2">
              AquaSense AI
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
             <button onClick={() => setShowSearch(true)} className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95">
               <Search className="w-6 h-6" />
             </button>
             <div className="relative">
               <button onClick={() => setShowNotifications(!showNotifications)} className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95 relative">
                 <Bell className="w-6 h-6" />
                 <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
               </button>
               {showNotifications && (
                  <div className="absolute top-12 right-0 w-72 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-premium z-50 p-4">
                    <h4 className="font-label-md mb-2 text-on-surface">Notifications</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-error-container text-on-error-container rounded-md text-sm border border-error/20">
                        <span className="font-bold">Critical:</span> Pressure anomaly detected at Node 74.
                      </div>
                      <div className="p-2 bg-primary-container text-on-primary-container rounded-md text-sm border border-primary/20">
                        <span className="font-bold">Update:</span> System maintenance scheduled for tomorrow.
                      </div>
                    </div>
                  </div>
               )}
             </div>
             <Link to="/dashboard/settings" className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95 hidden md:flex">
               <Settings className="w-6 h-6" />
             </Link>
          </div>
        </div>
      </header>
      
      {showSearch && (
        <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-24" onClick={() => setShowSearch(false)}>
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <Search className="w-6 h-6 absolute left-3 top-3 text-outline" />
              <input type="text" placeholder="Search alerts, reports, users..." className="w-full bg-surface-container pl-12 pr-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-on-surface" autoFocus />
            </div>
            <div className="mt-4 p-4 text-center text-on-surface-variant font-body-sm">
              Press Enter to search system-wide across all modules.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
