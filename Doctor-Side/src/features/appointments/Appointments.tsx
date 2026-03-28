import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, CheckCircle2, MoreHorizontal, RefreshCw } from 'lucide-react';
import { apiService } from '../../services/api';

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.appointments.getAll().then((res: any) => {
      setAppointments(res.data);
      setLoading(false);
    });
  }, []);

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-600 border-amber-100',
      completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      rescheduled: 'bg-primary-50 text-primary-600 border-primary-100',
      upcoming: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    };
    const style = styles[status as keyof typeof styles] || styles.pending;
    return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${style}`}>{status}</span>;
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Clinical Schedule</h2>
          <p className="text-slate-400 font-bold text-sm mt-1">Manage your consultations and patient workflow</p>
        </div>

        <div className="flex bg-white p-2 rounded-[2rem] card-shadow border border-slate-50 gap-2">
          {['all', 'pending', 'upcoming', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] card-shadow border border-slate-50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative group flex-1 max-w-md">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-400 outline-none transition-all text-sm font-bold placeholder:text-slate-300"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-4 bg-slate-50 border border-slate-100 text-slate-600 rounded-[1.5rem] hover:bg-white hover:border-primary-200 transition-all cursor-pointer">
              <Calendar size={20} />
            </button>
            <button className="p-4 bg-slate-50 border border-slate-100 text-slate-600 rounded-[1.5rem] hover:bg-white hover:border-primary-200 transition-all cursor-pointer">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Patient Intelligence</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Requested Slot</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Consultation Type</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-10"><div className="h-6 bg-slate-50 rounded-lg w-full"></div></td>
                  </tr>
                ))
              ) : (
                filteredAppointments.map((app) => (
                   <tr key={app.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm uppercase transition-all group-hover:rotate-6 group-hover:scale-110 ${
                          app.risk === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {app.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 uppercase tracking-tight text-sm group-hover:text-primary-600 transition-colors">{app.patientName}</p>
                          <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-0.5">ID: {app.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-slate-700 uppercase tracking-tighter flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          {app.date}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest pl-5">
                           {app.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest border-b-2 border-slate-100 pb-1">{app.type}</span>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary-500 hover:border-primary-200 rounded-xl transition-all group/btn shadow-sm hover:shadow-lg active:scale-95">
                          <RefreshCw size={18} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                        </button>
                        <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 rounded-xl transition-all group/btn shadow-sm hover:shadow-lg active:scale-95">
                          <CheckCircle2 size={18} />
                        </button>
                        <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                   </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-slate-50 flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
           <span>Showing 1-10 of {appointments.length} Consultations</span>
           <div className="flex items-center gap-4">
              <button disabled className="opacity-30 cursor-not-allowed">Previous</button>
              <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
              <button className="text-primary-600 hover:underline hover:scale-105 transition-transform">Next Batch</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
