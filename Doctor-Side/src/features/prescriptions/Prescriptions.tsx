import React, { useState } from 'react';
import { Pill, Plus, Trash2, Send, Clock, User, FileText, ChevronRight, CheckCircle, Search } from 'lucide-react';
import { apiService } from '../../services/api';

const InputWrapper = ({ label, children }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">{label}</label>
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-in slide-in-from-left duration-500">
      <div className="xl:col-span-8 bg-white p-10 rounded-[3rem] card-shadow border border-slate-50">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-inner">
            <Pill size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Issue Medication</h2>
            <p className="text-slate-400 font-bold text-sm mt-1">Digital Prescription Console • Verified by Zenith AI</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <InputWrapper label="Select Target Patient">
             <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                   <User size={18} />
                </span>
                <select
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-400 outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                >
                  <option value="">Search Patient Registry...</option>
                  <option value="p1">Sarah Jenkins (ID: p1)</option>
                  <option value="p2">Michael Brown (ID: p2)</option>
                  <option value="p3">Emma Watson (ID: p3)</option>
                  <option value="p4">David Miller (ID: p4)</option>
                </select>
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors">
                   <Search size={18} />
                </span>
             </div>
          </InputWrapper>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                <Clock size={18} className="text-primary-500" />
                Medication List
              </h3>
              <button
                type="button"
                onClick={addMedicine}
                className="flex items-center gap-2 text-primary-600 font-black text-[10px] uppercase tracking-widest hover:text-primary-700 hover:scale-105 transition-all bg-primary-50 px-4 py-2 rounded-xl"
              >
                <Plus size={14} /> Add Drug
              </button>
            </div>

            {medicines.map((med, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 group hover:border-primary-100 hover:bg-primary-50/10 transition-all duration-300 relative animate-in zoom-in-95">
                <div className="md:col-span-5">
                   <InputWrapper label="Medicine Name">
                      <input
                        type="text"
                        required
                        value={med.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        placeholder="e.g. Lisinopril 10mg"
                        className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all text-sm font-bold"
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
                        className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all text-sm font-bold"
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
                        className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all text-sm font-bold"
                      />
                   </InputWrapper>
                </div>
                <div className="md:col-span-1 flex items-end justify-center pb-2">
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    disabled={medicines.length === 1}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-0"
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
              className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-400 outline-none transition-all text-sm font-bold"
            ></textarea>
          </InputWrapper>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-12 py-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-primary-100 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-4 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : success ? (
                <>
                  <CheckCircle size={20} className="text-emerald-400" />
                  Prescription Registered
                </>
              ) : (
                <>
                  <Send size={20} className="text-primary-400 animate-pulse" />
                  Finalize & Dispatch
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="xl:col-span-4 space-y-8">
         <div className="bg-gradient-to-br from-primary-600 to-primary-500 p-10 rounded-[3rem] text-white shadow-2xl shadow-primary-200">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-10 opacity-70 flex items-center gap-2">
               <FileText size={18} />
               Digital Protocol Info
            </h4>
            <div className="space-y-6">
               <div className="p-6 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-100 mb-2">Automated Syncing</p>
                  <p className="text-sm font-bold leading-relaxed">Prescriptions are instantly visible for pharmacies and synced with the patient mobile app.</p>
               </div>
               <div className="p-6 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-100 mb-2">Refill Logic</p>
                  <p className="text-sm font-bold leading-relaxed">AI analyzes drug interactions and sends alerts if contraindications are found.</p>
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[3rem] card-shadow border border-slate-50">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-between">
               Recent Dispatches
               <ChevronRight size={14} />
            </h4>
            <div className="space-y-4">
               {[
                 { patient: 'Sarah J.', med: 'Aspirin', date: 'Just now' },
                 { patient: 'David M.', med: 'Metformin', date: '2h ago' },
                 { patient: 'Emma W.', med: 'Amoxicillin', date: '4h ago' }
               ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer border border-slate-50 hover:border-slate-100">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <Pill size={18} />
                     </div>
                     <div className="flex-1">
                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{item.patient}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.med}</p>
                     </div>
                     <p className="text-[8px] font-black text-slate-300 uppercase">{item.date}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default PrescriptionsData;
