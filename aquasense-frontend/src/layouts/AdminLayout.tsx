import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, Settings, Server, LogOut, Bell, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AquaSenseAIAssistant } from '@/components/chat/AquaSenseAIAssistant';

export function AdminLayout() {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Roles & Permissions', path: '/admin/roles', icon: Shield },
    { name: 'System Monitoring', path: '/admin/system', icon: Server },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'User Dashboard', path: '/dashboard', icon: ArrowLeft },
  ];

  const handleLogout = () => {
    toast('Logging out...');
    navigate('/auth/login');
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 flex flex-col border-r border-white/20 bg-white/40 backdrop-blur-xl shadow-glass m-4 rounded-2xl overflow-hidden">
        <div className="h-16 flex items-center px-6 border-b border-white/20 bg-gradient-to-r from-primary/10 to-transparent">
          <Shield className="w-6 h-6 text-primary mr-2" />
          <h1 className="font-headline-sm text-primary font-bold tracking-tight">AquaAdmin</h1>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-md font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-on-surface-variant hover:bg-white/50 hover:text-primary"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20 bg-white/30">
          <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-error hover:text-error hover:bg-error-container/50 border-error/20">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden p-4 pl-0">
        <header className="h-16 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-glass flex items-center justify-between px-6 mb-4">
          <h2 className="font-headline-sm text-on-surface font-semibold">Enterprise Control Center</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => toast('No new system alerts')} className="relative p-2 rounded-full hover:bg-white/50 text-on-surface-variant transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-white/20 pl-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                SA
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-semibold text-on-surface leading-none mb-1">Super Admin</p>
                <p className="text-on-surface-variant text-xs leading-none">admin@aquasense.ai</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto rounded-2xl">
          <Outlet />
        </div>
      </main>
      <AquaSenseAIAssistant />
    </div>
  );
}
