import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAppSelector } from '../store';

const Navbar: React.FC<{ title: string }> = ({ title }) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="h-20 bg-white border-b border-slate-50 sticky top-0 z-10 flex items-center justify-between px-10">
      <div className="flex items-center gap-10">
        <div className="relative flex items-center group">
          <span className="absolute left-0 text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <Search size={22} />
          </span>
          <input
            type="text"
            placeholder="Search anything here"
            className="pl-10 pr-4 py-3 bg-transparent border-none outline-none text-[15px] w-96 font-medium placeholder:text-slate-300 transition-all focus:w-[450px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button className="p-3 bg-slate-50 border border-slate-50 text-slate-500 hover:bg-primary-50 hover:text-primary-600 rounded-full transition-all relative">
          <Bell size={22} />
          <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-4 pl-8 border-l border-slate-100 cursor-pointer group">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm overflow-hidden group-hover:ring-4 group-hover:ring-primary-50 transition-all duration-300">
             <img src="https://ui-avatars.com/api/?name=Alexandro&background=10b981&color=fff" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-slate-800">
                {user?.name || 'Alexandro'}
              </span>
              <ChevronDown size={18} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
