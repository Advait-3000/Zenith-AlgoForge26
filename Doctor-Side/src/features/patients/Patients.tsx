import React, { useState } from 'react';
import { Search, User, Activity, FileText, ChevronRight, UserPlus, Filter, Smartphone, MapPin, Phone } from 'lucide-react';
import PatientModal from './PatientModal';

const Patients: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  const patients = [
    { id: 'p1', name: 'Sarah Jenkins', age: 28, lastVisit: '2026-03-20', risk: 'low', condition: 'Routine Check-up' },
    { id: 'p2', name: 'Michael Brown', age: 45, lastVisit: '2026-03-15', risk: 'medium', condition: 'Hypertension' },
    { id: 'p3', name: 'Emma Watson', age: 34, lastVisit: '2026-03-10', risk: 'high', condition: 'Cardiac Arrhythmia' },
    { id: 'p4', name: 'David Miller', age: 52, lastVisit: '2026-02-28', risk: 'low', condition: 'Diabetes Type 2' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Patient Registry</h2>
          <p className="text-slate-400 font-bold text-sm mt-1">Intelligent monitoring of your clinical cases</p>
        </div>
        <button className="px-8 py-4 bg-primary-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary-200/50 hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
          <UserPlus size={18} />
          Register New Patient Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {patients.map((p) => (
          <div 
            key={p.id}
            onClick={() => setSelectedPatientId(p.id)}
            className="group bg-white p-6 rounded-[2.5rem] card-shadow border border-slate-50 hover:border-primary-100 hover:bg-primary-50/10 transition-all cursor-pointer relative overflow-hidden active:scale-95 duration-300"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full opacity-10 transition-opacity group-hover:opacity-30 ${
              p.risk === 'high' ? 'bg-rose-500' : p.risk === 'medium' ? 'bg-amber-400' : 'bg-emerald-500'
            }`}></div>
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all group-hover:scale-110 shadow-inner ${
                p.risk === 'high' ? 'bg-rose-50 text-rose-600' : p.risk === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {p.name.charAt(0)}
              </div>
              <div className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${
                p.risk === 'high' ? 'bg-rose-500 text-white ring-4 ring-rose-50 animate-pulse' : 
                p.risk === 'medium' ? 'bg-amber-100 text-amber-700 ring-4 ring-amber-50' : 
                'bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50'
              }`}>
                {p.risk} Risk Level
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div>
                <h4 className="font-black text-slate-800 uppercase tracking-tight text-base group-hover:text-primary-600 transition-colors uppercase">{p.name}</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                   <span>ID: {p.id}</span>
                   <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                   <span>{p.age} Yrs old</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 space-y-3">
                 <div className="flex items-center gap-3 text-slate-500 hover:text-slate-800 transition-colors">
                    <Activity size={16} className="text-primary-400 group-hover:text-primary-500 group-hover:animate-bounce duration-500" />
                    <span className="text-[11px] font-black uppercase tracking-tighter">{p.condition}</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-400">
                    <FileText size={16} className="text-slate-300" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">Last visit: {p.lastVisit}</span>
                 </div>
              </div>

              <button className="w-full mt-4 py-3 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-400 group-hover:shadow-lg group-hover:shadow-primary-100 transition-all flex items-center justify-center gap-2">
                 Inspect AI Insights
                 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPatientId && (
        <PatientModal 
          patientId={selectedPatientId} 
          onClose={() => setSelectedPatientId(null)} 
        />
      )}
    </div>
  );
};

export default Patients;
