import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, FileText, BarChart3, LogOut } from 'lucide-react';
import { useAppDispatch, logout } from '../store';
import logoImg from '../assets/logo.png';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const mainMenu = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Patients', path: '/patients' },
    { icon: <Calendar size={20} />, label: 'Appointments', path: '/appointments' },
    { icon: <FileText size={20} />, label: 'Prescriptions', path: '/prescriptions' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
  ];

  const NavItem = ({ item }: { item: any }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-[0.5rem] transition-all duration-200 group ${
          isActive
            ? 'bg-[#F7FEFE] text-[#306F6F] font-semibold'
            : 'text-[#717171] font-medium hover:bg-slate-50 hover:text-[#212121]'
        }`
      }
    >
      <div className="transition-transform duration-200">
        {item.icon}
      </div>
      <span className="text-[14px]">{item.label}</span>
    </NavLink>
  );

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-slate-200 flex flex-col z-20 overflow-y-auto font-sans">
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="w-10 h-10 flex items-center justify-center p-1">
          <img src={logoImg} alt="Cura Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[18px] leading-tight text-[#212121]">Cura</span>
          <span className="text-[10px] font-semibold text-[#717171] uppercase tracking-wider">Medical Dashboard</span>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-6">
        <div>
          <p className="px-4 text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2">Main Menu</p>
          <div className="space-y-1">
            {mainMenu.map((item) => <NavItem key={item.label} item={item} />)}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 mt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-[0.5rem] w-full text-[#717171] font-medium hover:bg-slate-50 hover:text-[#FF7070] transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="text-[14px]">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
