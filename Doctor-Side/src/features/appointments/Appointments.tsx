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
      pending: 'bg-amber-50 text-amber-700',
      completed: 'bg-emerald-50 text-emerald-700',
      rescheduled: 'bg-indigo-50 text-indigo-700',
      upcoming: 'bg-sky-50 text-sky-700',
    };
    const style = styles[status as keyof typeof styles] || styles.pending;
    return <span className={`px-3 py-1 rounded-md text-[12px] font-medium ${style} capitalize`}>{status}</span>;
  };

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[28px] font-bold text-[#212121] tracking-tight">Clinical Schedule</h2>
          <p className="text-[#717171] text-[14px] mt-1">Manage your consultations and patient workflow</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-[0.75rem] border border-slate-200 gap-1.5">
          {['all', 'pending', 'upcoming', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-[0.5rem] text-[14px] font-medium capitalize transition-all ${
                filter === f ? 'bg-[#306F6F] text-white' : 'text-[#717171] hover:text-[#212121] hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative group flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-[0.5rem] focus:border-[#306F6F] outline-none transition-all text-[14px] text-[#212121] placeholder:text-[#A0A0A0]"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 text-[#717171] rounded-[0.5rem] hover:bg-slate-50 transition-colors">
              <Calendar size={18} />
            </button>
            <button className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 text-[#717171] rounded-[0.5rem] hover:bg-slate-50 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[#A0A0A0] text-[13px] font-medium bg-slate-50/50">
                <th className="px-6 py-4 font-normal">Patient Name</th>
                <th className="px-6 py-4 font-normal">Date & Time</th>
                <th className="px-6 py-4 font-normal">Consultation Type</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6"><div className="h-6 bg-slate-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : (
                filteredAppointments.map((app) => (
                   <tr key={app.id} className="hover:bg-slate-50 transition-colors text-[14px] text-[#212121]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F7FEFE] text-[#306F6F] border border-[#306F6F]/10 flex items-center justify-center font-bold text-[14px] uppercase">
                          {app.patientName.substring(0,2)}
                        </div>
                        <div>
                          <p className="font-medium text-[#212121]">{app.patientName}</p>
                          <p className="text-[13px] text-[#717171] mt-0.5">ID: {app.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-medium text-[#212121] flex items-center gap-2">
                          <Calendar size={14} className="text-[#A0A0A0]" />
                          {app.date}
                        </span>
                        <span className="text-[13px] text-[#717171] pl-5">
                           {app.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] font-medium text-[#717171]">{app.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 text-[#A0A0A0]">
                        <button className="p-2 hover:text-[#306F6F] hover:bg-[#F7FEFE] rounded-md transition-colors">
                          <RefreshCw size={18} />
                        </button>
                        <button className="p-2 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors">
                          <CheckCircle2 size={18} />
                        </button>
                        <button className="p-2 hover:text-[#212121] hover:bg-slate-100 rounded-md transition-colors">
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

        <div className="p-5 border-t border-slate-200 flex items-center justify-between text-[13px] text-[#717171]">
           <span>Showing 1-10 of {appointments.length} Consultations</span>
           <div className="flex items-center gap-4">
              <button disabled className="text-[#A0A0A0] cursor-not-allowed">Previous</button>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <button className="text-[#306F6F] font-medium hover:underline">Next Batch</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
