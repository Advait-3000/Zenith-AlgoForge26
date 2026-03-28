import React, { useState } from 'react';
import { Pill, Plus, Trash2, Send, Clock, User, FileText, ChevronRight, CheckCircle, Search } from 'lucide-react';
import { apiService } from '../../services/api';

const InputWrapper = ({ label, children }: any) => (
  <div className="space-y-2">
    <label className="text-[14px] font-medium text-[#212121] block">{label}</label>
    {children}
  </div>
);

const PrescriptionsData: React.FC = () => {
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '' }]);
  const [patientId, setPatientId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '' }]);
  };

  const removeMedicine = (index: number) => {
    const newMeds = [...medicines];
    newMeds.splice(index, 1);
    setMedicines(newMeds);
  };

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const newMeds = [...medicines];
    (newMeds[index] as any)[field] = value;
    setMedicines(newMeds);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    apiService.prescriptions.submit({ patientId, medicines, notes }).then(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 font-sans animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="xl:col-span-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-[#F7FEFE] rounded-full flex items-center justify-center text-[#306F6F] border border-[#306F6F]/10">
            <Pill size={28} />
          </div>
          <div>
            <h2 className="text-[28px] font-bold text-[#212121] tracking-tight">Issue Medication</h2>
            <p className="text-[14px] text-[#717171] mt-1">Digital Prescription Console • Verified by Zenith AI</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <InputWrapper label="Select Target Patient">
             <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]">
                   <User size={18} />
                </span>
                <select
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[0.5rem] focus:ring-4 focus:ring-[#306F6F]/10 focus:border-[#306F6F] outline-none transition-all text-[15px] text-[#212121] appearance-none cursor-pointer"
                >
                  <option value="">Search Patient Registry...</option>
                  <option value="p1">Sarah Jenkins (ID: p1)</option>
                  <option value="p2">Michael Brown (ID: p2)</option>
                  <option value="p3">Emma Watson (ID: p3)</option>
                  <option value="p4">David Miller (ID: p4)</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0A0] pointer-events-none">
                   <Search size={18} />
                </span>
             </div>
          </InputWrapper>

          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-[16px] font-semibold text-[#212121] flex items-center gap-2">
                <Clock size={18} className="text-[#306F6F]" />
                Medication List
              </h3>
              <button
                type="button"
                onClick={addMedicine}
                className="flex items-center gap-2 text-[#306F6F] font-medium text-[14px] hover:bg-[#F7FEFE] px-3 py-1.5 rounded-md transition-colors"
              >
                <Plus size={16} /> Add Drug
              </button>
            </div>

            {medicines.map((med, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-5 p-6 bg-slate-50 rounded-xl border border-slate-200 relative">
                <div className="md:col-span-5">
                   <InputWrapper label="Medicine Name">
                      <input
                        type="text"
                        required
                        value={med.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        placeholder="e.g. Lisinopril 10mg"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-[0.5rem] focus:border-[#306F6F] outline-none transition-all text-[15px] text-[#212121] placeholder:text-[#A0A0A0]"
                      />
                   </InputWrapper>
                </div>
                <div className="md:col-span-3">
                   <InputWrapper label="Dosage">
                      <input
                        type="text"
                        required
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        placeholder="e.g. 1 Tablet"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-[0.5rem] focus:border-[#306F6F] outline-none transition-all text-[15px] text-[#212121] placeholder:text-[#A0A0A0]"
                      />
                   </InputWrapper>
                </div>
                <div className="md:col-span-3">
                   <InputWrapper label="Frequency">
                      <input
                        type="text"
                        required
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        placeholder="e.g. Nightly"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-[0.5rem] focus:border-[#306F6F] outline-none transition-all text-[15px] text-[#212121] placeholder:text-[#A0A0A0]"
                      />
                   </InputWrapper>
                </div>
                <div className="md:col-span-1 flex items-end justify-center pb-1.5">
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    disabled={medicines.length === 1}
                    className="p-2.5 text-[#A0A0A0] hover:text-[#FF7070] hover:bg-red-50 rounded-md transition-all disabled:opacity-0"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <InputWrapper label="Clinical Observation & Notes">
            <textarea
              required
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter specific instructions or diagnostics..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[0.75rem] focus:border-[#306F6F] outline-none transition-all text-[15px] text-[#212121] placeholder:text-[#A0A0A0] resize-none"
            ></textarea>
          </InputWrapper>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-[#306F6F] text-white rounded-[0.5rem] font-medium text-[16px] transition-all flex items-center gap-3 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-95'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : success ? (
                <>
                  <CheckCircle size={20} className="text-white" />
                  Prescription Registered
                </>
              ) : (
                <>
                  <Send size={20} className="text-white" />
                  Finalize & Dispatch
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="xl:col-span-4 space-y-6">
         <div className="bg-[#306F6F] p-8 rounded-2xl text-white shadow-sm">
            <h4 className="text-[16px] font-semibold mb-6 flex items-center gap-2">
               <FileText size={20} />
               Digital Protocol Info
            </h4>
            <div className="space-y-4">
               <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                  <p className="text-[13px] font-semibold text-white/80 mb-1">Automated Syncing</p>
                  <p className="text-[14px] leading-relaxed">Prescriptions are instantly visible for pharmacies and synced with the patient mobile app.</p>
               </div>
               <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                  <p className="text-[13px] font-semibold text-white/80 mb-1">Refill Logic</p>
                  <p className="text-[14px] leading-relaxed">AI analyzes drug interactions and sends alerts if contraindications are found.</p>
               </div>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-[14px] font-semibold text-[#717171] mb-5 flex items-center justify-between">
               Recent Dispatches
               <ChevronRight size={16} />
            </h4>
            <div className="space-y-3">
               {[
                 { patient: 'Sarah J.', med: 'Aspirin', date: 'Just now' },
                 { patient: 'David M.', med: 'Metformin', date: '2h ago' },
                 { patient: 'Emma W.', med: 'Amoxicillin', date: '4h ago' }
               ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                     <div className="w-10 h-10 bg-[#F7FEFE] rounded-full flex items-center justify-center text-[#306F6F]">
                        <Pill size={18} />
                     </div>
                     <div className="flex-1">
                        <p className="text-[14px] font-medium text-[#212121]">{item.patient}</p>
                        <p className="text-[12px] text-[#717171]">{item.med}</p>
                     </div>
                     <p className="text-[12px] text-[#A0A0A0]">{item.date}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default PrescriptionsData;
