import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, FileText, BarChart3, LogOut, UserCircle, Settings, CreditCard, Box, HelpCircle, Moon, Sun } from 'lucide-react';
import { useAppDispatch, logout } from '../store';
import logoImg from '../assets/logo.png';

const Sidebar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const mainMenu = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Patients', path: '/patients' },
    { icon: <Calendar size={20} />, label: 'Appointment', path: '/appointments' },
    { icon: <FileText size={20} />, label: 'Report', path: '/reports' },
  ];

  const otherMenu = [
    { icon: <Box size={20} />, label: 'Department', path: '/departments' },
    { icon: <CreditCard size={20} />, label: 'Payment', path: '/payments' },
    { icon: <FileText size={20} />, label: 'Prescriptions', path: '/prescriptions' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
  ];

  const settingsMenu = [
    { icon: <HelpCircle size={20} />, label: 'Help & Center', path: '/help' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/profile-setup' },
  ];

  const NavItem = ({ item }: { item: any }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
          isActive
            ? 'bg-primary-500/10 text-primary-600 font-bold'
            : 'text-slate-400 font-medium hover:bg-slate-50 hover:text-slate-600'
        }`
      }
    >
      <div className="transition-transform duration-200">
        {item.icon}
      </div>
      <span className="text-[13px]">{item.label}</span>
    </NavLink>
  );

  return (
    <div className="w-60 bg-white h-screen fixed left-0 top-0 border-r border-slate-100 flex flex-col z-20 overflow-y-auto custom-scrollbar">
      <div className="p-6 flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white shadow-sm overflow-hidden">
          <img src={logoImg} alt="Cura Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight text-slate-800">Cura</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">Medical Dashboard</span>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-6">
        <div>
          <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Main Menu</p>
          <div className="space-y-0.5">
            {mainMenu.map((item) => <NavItem key={item.label} item={item} />)}
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Other Menu</p>
          <div className="space-y-0.5">
            {otherMenu.map((item) => <NavItem key={item.label} item={item} />)}
          </div>
        </div>

        <div>
           <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Help & Settings</p>
           <div className="space-y-0.5">
              {settingsMenu.map((item) => <NavItem key={item.label} item={item} />)}
           </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-50 space-y-4">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl">
           <span className="text-[11px] font-bold text-slate-500">Dark mode</span>
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)}
             className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-primary-500' : 'bg-slate-200'}`}
           >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isDarkMode ? 'left-6' : 'left-1'}`}></div>
           </button>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg w-full text-slate-400 font-medium hover:bg-rose-50 hover:text-rose-500 transition-all duration-200"
        >
          <LogOut size={18} />
          <span className="text-[13px]">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
