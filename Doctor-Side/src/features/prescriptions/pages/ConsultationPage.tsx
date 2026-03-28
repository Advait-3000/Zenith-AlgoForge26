import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Activity, 
  Clipboard, 
  Plus, 
  Trash2, 
  Save, 
  Calendar, 
  CheckCircle,
  FileText,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/BaseComponents';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export const ConsultationPage: React.FC = () => {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState<Medicine[]>([
        { id: '1', name: '', dosage: '', frequency: '', duration: '' }
    ]);
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const addMedicine = () => {
        setMedicines([...medicines, { id: Math.random().toString(), name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const removeMedicine = (id: string) => {
        setMedicines(medicines.filter(m => m.id !== id));
    };

    const handleComplete = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsFollowUpModalOpen(true);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Navigation & Patient Context */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 font-bold text-cura-text-soft hover:text-cura-primary transition-all group"
                >
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100 group-hover:bg-cura-primary group-hover:text-white transition-all">
                        <ArrowLeft size={20} />
                    </div>
                    Back to Dashboard
                </button>
                <div className="px-6 py-2 bg-emerald-50 rounded-full border border-emerald-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Active Consultation</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Patient Overview & AI Recap */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="cura-card p-8">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden border-4 border-slate-50 shadow-cura-soft mb-4">
                                <img src="https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800">Sarah Jenkins</h3>
                            <p className="text-sm font-bold text-cura-text-soft">Patient ID: #CURA-9023</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest">Vitals Sync (10:25 AM)</span>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Temp</p>
                                        <p className="font-black text-slate-700">98.6°F</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200" />
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Heart</p>
                                        <p className="font-black text-slate-700">72 BPM</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200" />
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase">SpO2</p>
                                        <p className="font-black text-slate-700">99%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="cura-card p-8 bg-cura-primary/5 border-cura-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={60} /></div>
                        <h4 className="font-black text-cura-primary text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Activity size={16} /> AI Real-time Recap
                        </h4>
                        <p className="text-slate-700 font-medium leading-relaxed text-sm">
                            Focus on "Borderline anemia markers" in recent bloodwork. Patient previously reported sensitivity to Aspirin-based compounds.
                        </p>
                    </div>
                </div>

                {/* Right: Prescription & Logic Engine */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="cura-card p-10">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-cura-primary/10 rounded-2xl flex items-center justify-center">
                                    <FileText className="text-cura-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Digital Prescription</h3>
                                    <p className="text-sm font-semibold text-cura-text-soft">Drafting for medical record submission</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {medicines.map((m, index) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={m.id} 
                                    className="p-6 rounded-3xl border border-slate-100 bg-slate-50 relative group transition-all hover:bg-white hover:border-cura-primary/20 hover:shadow-cura-soft"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                             <label className="text-sm font-semibold text-cura-text-soft">Medicine Name</label>
                                             <input className="w-full bg-white border border-cura-border rounded-xl px-4 py-3" placeholder="e.g. Paracetamol 500mg" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                 <label className="text-sm font-semibold text-cura-text-soft">Dosage</label>
                                                 <input className="w-full bg-white border border-cura-border rounded-xl px-4 py-3" placeholder="1 tab" />
                                            </div>
                                            <div className="space-y-2">
                                                 <label className="text-sm font-semibold text-cura-text-soft">Frequency</label>
                                                 <input className="w-full bg-white border border-cura-border rounded-xl px-4 py-3" placeholder="Twice a day" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="w-full max-w-xs">
                                            <input className="w-full bg-white border border-cura-border rounded-xl px-4 py-3" placeholder="Notes / Instruction..." />
                                        </div>
                                        {medicines.length > 1 && (
                                            <button 
                                                onClick={() => removeMedicine(m.id)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center font-black text-[10px] text-cura-text-soft shadow-sm">
                                        {index + 1}
                                    </div>
                                </motion.div>
                            ))}

                            <button 
                                onClick={addMedicine}
                                className="w-full h-16 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center gap-3 text-slate-400 font-bold hover:border-cura-primary hover:bg-cura-primary/5 hover:text-cura-primary transition-all duration-300"
                            >
                                <Plus size={20} /> Add Another Medication
                            </button>
                        </div>

                        <div className="mt-12 space-y-4">
                            <label className="text-sm font-black text-slate-800 uppercase tracking-widest pl-2">Doctor's Clinical Notes</label>
                            <textarea 
                                className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-sm font-medium focus:ring-4 focus:ring-cura-primary/10 transition-all h-32 placeholder:text-slate-300"
                                placeholder="Any specific observations or diagnostic summary..."
                            />
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-50 flex items-center gap-4">
                            <Button className="h-14 flex-1 shadow-lg shadow-teal-500/20" isLoading={loading} onClick={handleComplete}>
                                <Save size={20} /> Finish Consultation
                            </Button>
                            <Button variant="outline" className="h-14 px-8">
                                <Clipboard size={20} /> Save as Draft
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Follow-up / Confirmation Modal */}
            <AnimatePresence>
                {isFollowUpModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
                        >
                            <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                <CheckCircle className="text-emerald-500 w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">Prescription Sync'd</h2>
                            <p className="text-slate-500 font-medium mb-10">Consultation record has been attached to patient timeline successfully.</p>
                            
                            <div className="space-y-6 mb-10">
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-left">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Calendar size={14} className="text-cura-primary" /> Schedule Follow-up
                                    </h4>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <Clock size={18} className="text-cura-text-soft" />
                                            </div>
                                            <span className="font-bold text-slate-700">In 2 Weeks</span>
                                        </div>
                                        <button className="text-cura-primary font-black text-xs hover:underline">CHANGE</button>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full h-14" onClick={() => navigate('/dashboard')}>
                                Return to Dashboard <ChevronRight size={18} />
                            </Button>

                            {/* Corner accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cura-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
