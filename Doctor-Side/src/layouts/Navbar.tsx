import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, User, HelpCircle } from 'lucide-react';
import { useAppSelector } from '../store';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC<{ title: string }> = ({ title }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-[88px] bg-white border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-8 font-sans">
      <div className="flex items-center gap-10">
        <div className="relative flex items-center group">
          <span className="absolute left-0 text-[#A0A0A0] transition-colors">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Search anything here"
            className="pl-8 pr-4 py-3 bg-transparent border-none outline-none text-[15px] w-96 font-medium placeholder:text-[#A0A0A0] transition-all text-[#212121]"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2.5 bg-[#F7FEFE] border border-slate-200 text-[#717171] hover:text-[#306F6F] hover:border-[#306F6F] rounded-full transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF7070] rounded-full border-2 border-white"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex flex-row items-center cursor-pointer gap-3 ml-2 group"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-slate-200 group-hover:border-[#306F6F] transition-all">
               <img src="https://ui-avatars.com/api/?name=Alexandro&background=306F6F&color=fff" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-semibold text-[#212121]">
                {user?.name || 'Alexandro'}
              </span>
              <ChevronDown size={16} className={`text-[#A0A0A0] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <p className="text-[14px] font-semibold text-[#212121]">{user?.name || 'Dr. Alexandro'}</p>
                <p className="text-[12px] text-[#717171]">Cardiologist</p>
              </div>
              
              <button 
                onClick={() => { setIsDropdownOpen(false); navigate('/profile-setup'); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-[14px] font-medium text-[#717171] hover:bg-slate-50 hover:text-[#306F6F] transition-colors"
              >
                <User size={16} />
                Profile Settings
              </button>
              
              <button 
                onClick={() => { setIsDropdownOpen(false); navigate('/help'); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-[14px] font-medium text-[#717171] hover:bg-slate-50 hover:text-[#306F6F] transition-colors"
              >
                <HelpCircle size={16} />
                Help & Center
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
