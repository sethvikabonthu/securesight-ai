import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Shield, ShieldAlert, Globe, Mail, 
  MessageSquare, History, FileText, User, Settings, 
  LogOut, Menu, X, Bell, UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out of session. Access terminated.', 'info');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Scan Media', path: '/scan-media', icon: ShieldAlert },
    { name: 'Scan URL', path: '/scan-url', icon: Globe },
    { name: 'Scan Email', path: '/scan-email', icon: Mail },
    { name: 'Scan SMS', path: '/scan-sms', icon: MessageSquare },
    { name: 'Scan History', path: '/history', icon: History },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Helper to get active page title
  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    return current ? current.name : 'VeriShield AI';
  };

  return (
    <div className="min-h-screen flex text-cyber-gray">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-cyber-dark/80 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-white/5 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyber-cyan shadow-glow-cyan/50" />
            <span className="font-bold text-white tracking-wider text-base">VERISHIELD AI</span>
          </Link>
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-cyber-blue/15 border-l-2 border-cyber-cyan text-white shadow-glow-blue/5' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer (User info & Logout) */}
        <div className="p-4 border-t border-white/5 bg-slate-950/60">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border border-cyber-cyan/30"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Security Analyst'}</p>
              <span className="text-[10px] text-cyber-cyan font-semibold uppercase tracking-wider bg-cyber-cyan/15 px-1.5 py-0.5 rounded flex items-center gap-1 w-max">
                <UserCheck className="w-2.5 h-2.5" />
                {user?.role || 'SecOps Lead'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-red-950/30 text-gray-400 hover:text-red-400 border border-slate-800 hover:border-red-500/20 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-cyber-dark">
        {/* Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-slate-950/40 border-b border-white/5 backdrop-blur-md sticky top-0 z-30">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-white uppercase tracking-wider">{getPageTitle()}</h1>
          </div>

          {/* Right: Notification Alerts & Settings Link */}
          <div className="flex items-center gap-4">
            {/* System Status Indicators */}
            <div className="hidden md:flex items-center gap-3 px-3 py-1 bg-green-950/20 border border-green-500/20 rounded-full text-xs text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <span>Security Shield Active</span>
            </div>
            
            <button 
              onClick={() => showToast('All protection nodes operational. System health nominal.', 'success')}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-slate-950" />
            </button>

            <div className="w-px h-6 bg-white/5" />

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Console mode
              </span>
              <div className="w-2 h-2 rounded-full bg-cyber-cyan shadow-glow-cyan" />
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
