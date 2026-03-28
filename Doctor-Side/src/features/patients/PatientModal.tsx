import React, { useEffect, useState } from 'react';
import { X, Activity, Brain, ShieldAlert, CheckCircle, FileText, User, Info, Smartphone, Download } from 'lucide-react';
import { apiService } from '../../services/api';

interface PatientModalProps {
  patientId: string;
  onClose: () => void;
}

const PatientModal: React.FC<PatientModalProps> = ({ patientId, onClose }) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    high: 'text-red-700 bg-red-50 border-red-200',
    medium: 'text-amber-700 bg-amber-50 border-amber-200',
    low: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  };

  const riskBadge = report.riskLevel as keyof typeof riskColors;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all animate-in fade-in duration-300 font-sans">
      <div className="w-[90%] max-w-5xl h-[90vh] bg-[#F7FEFE] rounded-2xl shadow-xl overflow-hidden flex flex-col scale-in-center animate-in zoom-in-95 duration-500 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white border border-slate-200 text-[#717171] hover:bg-slate-50 hover:text-[#FF7070] rounded-full transition-all z-20"
        >
          <X size={24} />
        </button>

        <div className="flex-1 overflow-y-auto mt-4 p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white border border-[#306F6F]/10 rounded-full flex items-center justify-center text-[#306F6F]">
                  <User size={32} />
                </div>
                <div>
                  <h2 className="text-[28px] font-bold text-[#212121] tracking-tight">
                    {report.patientInfo.name}
                  </h2>
                  <p className="text-[14px] text-[#717171] flex items-center gap-2 mt-1">
                    ID: {patientId} <span className="w-1 h-1 bg-slate-300 rounded-full"></span> {report.patientInfo.age} Yrs
                  </p>
                </div>
              </div>

              {/* OCR File Viewer Box */}
              <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                 <div className="flex flex-col">
                    <span className="font-semibold text-[15px] text-[#212121]">Raw Medical Report</span>
                    <span className="text-[13px] text-[#717171]">OCR Extracted Source Document</span>
                 </div>
                 <button className="px-4 py-2 border border-[#306F6F] text-[#306F6F] hover:bg-[#F7FEFE] rounded-lg text-[13px] font-medium transition-colors flex items-center gap-2">
                    <FileText size={16} /> View Original
                 </button>
              </div>

              <div className={`p-6 rounded-2xl border transition-all ${riskColors[riskBadge]}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <Brain size={20} />
                    <span className="font-semibold text-[15px]">Zenith AI Analysis</span>
                  </div>
                  <div className="px-3 py-1 bg-white border border-current rounded-md font-medium text-[13px] capitalize flex items-center gap-2">
                    <ShieldAlert size={14} />
                    {report.riskLevel} Risk
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed font-medium">
                  "{report.aiSummary}"
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[15px] font-semibold text-[#212121] border-b border-slate-200 pb-3">
                  <Info size={18} className="text-[#306F6F]" />
                  Key Clinical Findings
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {report.keyFindings.map((finding: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#306F6F] transition-colors">
                      <div className="mt-0.5 text-[#306F6F]">
                        <Activity size={16} />
                      </div>
                      <span className="text-[14px] font-medium text-[#212121] leading-tight">
                        {finding}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#306F6F] rounded-2xl text-white shadow-md">
                <h4 className="flex items-center gap-2 text-[15px] font-semibold mb-5">
                  <Smartphone size={18} />
                  AI Recommended Plan
                </h4>
                <div className="space-y-3">
                  {report.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/20">
                      <CheckCircle size={18} className="text-[#F7FEFE]" />
                      <span className="text-[14px] font-medium">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-[15px] font-semibold text-[#212121] mb-5 flex items-center gap-2">
                  <Activity size={18} className="text-[#306F6F]" />
                  Current Vitals
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(report.patientInfo.vitals).map(([key, val]: any) => (
                    <div key={key} className="bg-[#F7FEFE] p-4 rounded-xl border border-slate-100 flex flex-col items-center">
                      <p className="text-[12px] text-[#717171] mb-1 capitalize">{key}</p>
                      <p className="text-[18px] font-semibold text-[#212121]">{val}</p>
                    </div>
                  ))}
                  <div className="bg-[#F7FEFE] p-4 rounded-xl border border-slate-100 flex flex-col items-center">
                    <p className="text-[12px] text-[#717171] mb-1 capitalize">Blood Type</p>
                    <p className="text-[18px] font-semibold text-[#212121]">{report.patientInfo.bloodType}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                  <h4 className="text-[15px] font-semibold text-[#212121] flex items-center gap-2">
                    <FileText size={18} className="text-[#306F6F]" />
                    History
                  </h4>
                  <button className="p-1.5 hover:bg-slate-50 rounded-lg">
                    <Download size={18} className="text-[#A0A0A0]" />
                  </button>
                </div>
                <div className="space-y-3">
                  {report.pastReports.map((r: any) => (
                    <div key={r.id} className="p-4 bg-[#F7FEFE] border border-slate-100 rounded-xl flex items-center justify-between hover:border-slate-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-[#306F6F]">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[#212121]">{r.title}</p>
                          <p className="text-[12px] text-[#717171]">{r.date}</p>
                        </div>
                      </div>
                      <span className="text-[12px] font-medium px-2.5 py-1 bg-white border border-slate-200 text-[#717171] rounded-md capitalize">
                        {r.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <button className="flex-1 py-4 bg-white border border-[#A0A0A0] text-[#717171] hover:border-[#212121] hover:text-[#212121] rounded-[0.75rem] font-semibold text-[15px] transition-colors">
                  Reschedule
                </button>
                <button className="flex-1 py-4 bg-[#306F6F] text-white rounded-[0.75rem] font-semibold text-[15px] hover:opacity-90 transition-opacity">
                  Final Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;
