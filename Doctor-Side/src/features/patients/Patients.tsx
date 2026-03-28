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
    <div className="space-y-8 font-sans animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[28px] font-bold text-[#212121] tracking-tight">Patient Registry</h2>
          <p className="text-[#717171] text-[14px] mt-1">Intelligent monitoring of your clinical cases</p>
        </div>
        <button className="px-6 py-3 bg-[#306F6F] text-white rounded-[0.75rem] font-medium text-[14px] hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-2">
          <UserPlus size={18} />
          Register New Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {patients.map((p) => (
          <div 
            key={p.id}
            onClick={() => setSelectedPatientId(p.id)}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#306F6F] hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 blur-2xl rounded-full opacity-0 transition-opacity group-hover:opacity-20 ${
              p.risk === 'high' ? 'bg-[#FF7070]' : p.risk === 'medium' ? 'bg-amber-400' : 'bg-[#306F6F]'
            }`}></div>
            
            <div className="flex items-start justify-between mb-5 relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[18px] transition-transform group-hover:scale-110 bg-[#F7FEFE] text-[#306F6F] border border-[#306F6F]/10 uppercase">
                {p.name.charAt(0)}
              </div>
              <div className={`px-2.5 py-1 rounded-md text-[12px] font-medium capitalize ${
                p.risk === 'high' ? 'bg-red-50 text-red-700' : 
                p.risk === 'medium' ? 'bg-amber-50 text-amber-700' : 
                'bg-emerald-50 text-emerald-700'
              }`}>
                {p.risk} Risk
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <div>
                <h4 className="font-semibold text-[#212121] text-[16px] group-hover:text-[#306F6F] transition-colors">{p.name}</h4>
                <div className="flex items-center gap-2 text-[13px] text-[#717171] mt-0.5">
                   <span>ID: {p.id}</span>
                   <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                   <span>{p.age} Yrs</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                 <div className="flex items-center gap-2.5 text-[#212121]">
                    <Activity size={16} className="text-[#306F6F]" />
                    <span className="text-[14px] font-medium">{p.condition}</span>
                 </div>
                 <div className="flex items-center gap-2.5 text-[#717171]">
                    <FileText size={16} className="text-[#A0A0A0]" />
                    <span className="text-[13px]">Last visit: {p.lastVisit}</span>
                 </div>
              </div>

              <button className="w-full mt-2 py-2.5 bg-slate-50 border border-slate-200 text-[#717171] text-[14px] font-medium rounded-lg group-hover:bg-[#306F6F] group-hover:text-white group-hover:border-[#306F6F] transition-all flex items-center justify-center gap-2">
                 Inspect Insights
                 <ChevronRight size={16} className="transition-transform" />
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
