import React, { useEffect, useState } from 'react';
import { X, Activity, Brain, ShieldAlert, CheckCircle, FileText, ChevronRight, User, Info, Smartphone, Download } from 'lucide-react';
import { apiService } from '../../services/api';

interface PatientModalProps {
  patientId: string;
  onClose: () => void;
}

const PatientModal: React.FC<PatientModalProps> = ({ patientId, onClose }) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
    apiService.patients.getReport(patientId).then((res: any) => {
      setReport(res.data);
      setLoading(false);
    });

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [patientId]);

  if (loading) return null;

  const riskColors = {
    high: 'text-rose-600 bg-rose-50 border-rose-200 shadow-rose-100',
    medium: 'text-amber-600 bg-amber-50 border-amber-200 shadow-amber-100',
    low: 'text-emerald-600 bg-emerald-50 border-emerald-200 shadow-emerald-100',
  };

  const riskBadge = report.riskLevel as keyof typeof riskColors;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-md transition-all animate-in fade-in duration-300">
      <div className="w-[90%] max-w-5xl h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col scale-in-center animate-in zoom-in-95 duration-500 border border-white/50 relative">
        {/* Close Button UI */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-slate-50 border border-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-all z-20 group active:scale-90"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: AI Breakdown */}
            <div className="lg:col-span-7 space-y-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-100/50 rounded-2xl flex items-center justify-center text-primary-600 shadow-inner">
                    <User size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter">
                      {report.patientInfo.name}
                    </h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mt-1">
                      Patient ID: {patientId} <span className="w-1 h-1 bg-slate-300 rounded-full"></span> {report.patientInfo.age} Yrs
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-8 rounded-[2rem] border-2 shadow-lg transition-all ${riskColors[riskBadge]}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Brain className="animate-pulse" size={24} />
                    <span className="font-black uppercase tracking-widest text-sm">Zenith AI Analysis</span>
                  </div>
                  <div className="px-4 py-1.5 bg-white border border-current rounded-full font-black text-[10px] uppercase tracking-tighter flex items-center gap-2">
                    <ShieldAlert size={14} />
                    {report.riskLevel} Risk
                  </div>
                </div>
                <p className="text-lg font-bold leading-relaxed tracking-tight text-slate-800 italic opacity-90">
                  "{report.aiSummary}"
                </p>
              </div>

              <div className="space-y-6">
                <h4 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-4">
                  <Info size={18} className="text-primary-500" />
                  Key Clinical Findings
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {report.keyFindings.map((finding: string, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-100 transition-colors group">
                      <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-primary-500 shadow-sm border border-slate-100 group-hover:bg-primary-500 group-hover:text-white transition-all transform group-hover:rotate-12">
                        <Activity size={12} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 leading-tight">
                        {finding}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-[2.5rem] text-white shadow-xl shadow-primary-200">
                <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.15em] mb-6 opacity-80">
                  <Smartphone size={18} />
                  AI Recommended Plan
                </h4>
                <div className="space-y-4">
                  {report.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 group hover:translate-x-2 transition-transform cursor-pointer">
                      <CheckCircle size={20} className="text-primary-100" />
                      <span className="text-sm font-bold">{rec}</span>
                      <ChevronRight size={16} className="ml-auto opacity-50 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Vitals & History */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3">
                  <Activity size={18} className="text-primary-500" />
                  Current Vital Indicators
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(report.patientInfo.vitals).map(([key, val]: any) => (
                    <div key={key} className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col items-center group hover:scale-105 transition-transform duration-300 shadow-sm">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">{key}</p>
                      <p className="text-xl font-black text-slate-800 group-hover:text-primary-600 transition-colors uppercase">{val}</p>
                    </div>
                  ))}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col items-center group hover:scale-105 transition-transform duration-300 shadow-sm">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Blood</p>
                    <p className="text-xl font-black text-slate-800 group-hover:text-primary-600 transition-colors uppercase">{report.patientInfo.bloodType}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                    <FileText size={18} className="text-primary-500" />
                    Clinical History
                  </h4>
                  <button className="p-2 transition-colors hover:bg-slate-50 rounded-lg group">
                    <Download size={18} className="text-slate-400 group-hover:text-primary-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  {report.pastReports.map((r: any) => (
                    <div key={r.id} className="p-5 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:border-primary-100 hover:shadow-xl hover:shadow-primary-50/50 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{r.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{r.date}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-3 py-1 bg-slate-50 border border-slate-100 text-slate-500 rounded-full group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all`}>
                        {r.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-5 bg-slate-800 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-700 transition-all hover:scale-[1.03] active:scale-[0.98] mt-auto">
                Issue Final Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;
