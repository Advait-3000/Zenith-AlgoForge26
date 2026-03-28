import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Plus, 
  ClipboardList,
  User as UserIcon,
  History
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  { icon: ClipboardList, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar, label: 'Appointments', path: '/appointments' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: History, label: 'Consultations', path: '/history' },
  { icon: UserIcon, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Clinic Setup', path: '/settings' },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-cura-bg flex overflow-hidden">
      {/* Premium Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="h-screen bg-white shadow-cura-soft border-r border-slate-100 flex flex-col relative z-30 transition-all duration-300"
      >
        <div className="p-6 flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-cura-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/20">
            <Plus className="text-white w-6 h-6 rotate-45" />
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-black text-slate-800 tracking-tight whitespace-nowrap">Cura</span>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
            {SIDEBAR_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group overflow-hidden ${isActive ? 'bg-cura-primary/10 text-cura-primary' : 'text-cura-text-soft hover:bg-slate-50'}`}
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="sidebar-active"
                                className="absolute left-0 w-1.5 h-6 bg-cura-primary rounded-r-full"
                            />
                        )}
                        <item.icon className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-cura-primary' : 'text-cura-text-soft'}`} size={22} />
                        {isSidebarOpen && (
                            <span className="font-bold text-[15px] whitespace-nowrap">{item.label}</span>
                        )}
                    </Link>
                );
            })}
        </nav>

        <div className="p-4 border-t border-slate-50">
            <button 
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400 font-bold hover:bg-red-50 hover:text-red-500 transition-all group overflow-hidden"
            >
                <LogOut className="shrink-0 transition-transform group-hover:-translate-x-1" size={22} />
                {isSidebarOpen && <span className="whitespace-nowrap">Sign Out</span>}
            </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Modern Navbar */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-50 flex items-center justify-between px-10 relative z-20">
            <div className="flex-1 max-w-xl pr-10">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cura-text-soft transition-colors group-focus-within:text-cura-primary" size={20} />
                    <input 
                        type="search" 
                        placeholder="Search patients, medical history, or ID..." 
                        className="w-full h-12 bg-slate-50 border-none rounded-2xl pl-12 pr-6 text-sm font-medium focus:ring-4 focus:ring-cura-primary/10 transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors group">
                    <Bell className="text-cura-text-soft group-hover:text-cura-primary transition-colors" size={22} />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20" />
                </button>
                
                <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
                    <div className="text-right hidden sm:block">
                        <h4 className="text-sm font-bold text-slate-800">Dr. Julian Ross</h4>
                        <p className="text-xs font-semibold text-cura-primary">Chief Cardiologist</p>
                    </div>
                    <div className="w-12 h-12 bg-cura-primary/10 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-cura-soft cursor-pointer hover:border-cura-primary/40 transition-all">
                        <img 
                            src="https://img.freepik.com/free-photo/doctor-white-coat-isolated-white_144627-4663.jpg" 
                            alt="Doctor" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-cura-bg py-10 px-10">
            {children}
        </main>
      </div>
    </div>
  );
};
