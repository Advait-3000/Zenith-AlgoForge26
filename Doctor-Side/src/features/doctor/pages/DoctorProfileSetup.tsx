import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/BaseComponents';
import { 
  MapPin, 
  Clock, 
  FileText, 
  Upload, 
  Check, 
  ChevronRight, 
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SPECIALIZATIONS = [
  'General Physician', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist', 'Psychiatrist'
];

export const DoctorProfileSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    specialization: SPECIALIZATIONS[0],
    hospital: '',
    experience: ''
  });
  
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const isStep1Valid = formData.name.trim() !== '' && formData.hospital.trim() !== '' && formData.experience.trim() !== '';
  const isStep2Valid = selectedDays.length > 0;
  const isStep3Valid = file !== null;

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleFinish = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:3000/auth/updateProfile', 
            {
                name: formData.name,
                specialization: formData.specialization,
                hospital: formData.hospital,
                experience: formData.experience,
                availableDays: selectedDays.join(', ')
            },
            {
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            }
        );
        navigate('/dashboard');
    } catch (error) {
        console.error("Setup Profile Error:", error);
        alert("Failed to setup profile, continuing anyway.");
        navigate('/dashboard');
    } finally {
        setLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-cura-bg py-12 px-6 sm:px-12 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-cura-float p-12 relative overflow-hidden">
        {/* Progress Progress Progress Indicator */}
        <div className="flex items-center justify-between mb-12 relative z-10 px-8">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? 'bg-cura-primary text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                        {step > s ? <Check size={20} /> : s}
                    </div>
                </div>
            ))}
            <div className="absolute top-5 left-20 right-20 h-0.5 bg-slate-100 -z-10 overflow-hidden">
                <motion.div 
                    className="h-full bg-cura-primary"
                    animate={{ width: `${(step - 1) * 50}%` }}
                />
            </div>
        </div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Refine your identity</h2>
                  <p className="text-slate-500 font-medium">How patients will recognize you professionally.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input 
                    label="Professional Full Name" 
                    placeholder="Dr. Julian Ross" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cura-text-soft">Primary Specialization</label>
                    <div className="relative">
                        <select 
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-cura-border rounded-2xl px-4 py-3.5 appearance-none focus:border-cura-primary focus:ring-4 focus:ring-cura-primary/5 transition-all text-cura-text-main font-medium cursor-pointer"
                        >
                            {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <Search className="absolute right-4 top-4 text-cura-text-soft pointer-events-none" size={18} />
                    </div>
                  </div>
                  <Input 
                    label="Hospital / Clinic Name" 
                    placeholder="St. Maria Medical Center" 
                    icon={<MapPin size={20} />} 
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleInputChange}
                  />
                  <Input 
                    label="Years of Experience" 
                    placeholder="8" 
                    type="number" 
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-end pt-8">
                  <Button className="w-48 h-14" onClick={nextStep} disabled={!isStep1Valid}>
                    Next Step <ChevronRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Schedule your care</h2>
                  <p className="text-slate-500 font-medium">Set your default availability slots.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => {
                        const isSelected = selectedDays.includes(d);
                        return (
                        <div 
                          key={d} 
                          onClick={() => toggleDay(d)}
                          className={`p-4 rounded-3xl border transition-all cursor-pointer group flex flex-col items-center ${isSelected ? 'border-cura-primary bg-cura-primary/5 shadow-sm ring-2 ring-cura-primary/20' : 'border-cura-border bg-white hover:border-cura-primary/50'}`}
                        >
                            <span className={`text-sm font-bold mb-2 transition-colors ${isSelected ? 'text-cura-primary' : 'text-slate-400 group-hover:text-cura-primary/70'}`}>{d}</span>
                            <div className="flex items-center gap-1 text-cura-text-main font-bold">
                                <Clock size={16} className={`transition-colors ${isSelected ? "text-cura-primary" : "text-slate-300"}`} />
                                9:00 - 17:00
                            </div>
                        </div>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between pt-8">
                  <button onClick={prevStep} className="font-bold text-slate-500 hover:text-slate-800 transition-colors px-6">Go Back</button>
                  <Button className="w-48 h-14" onClick={nextStep} disabled={!isStep2Valid}>
                    Verification <ChevronRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Verify Credentials</h2>
                  <p className="text-slate-500 font-medium">High security medical verification required.</p>
                </div>

                <div className="relative group">
                    <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                        onChange={handleFile}
                    />
                    <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center transition-all group-hover:border-cura-primary/30 group-hover:bg-cura-primary/5">
                        <div className="w-20 h-20 bg-cura-primary/10 rounded-3xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                            <Upload className="text-cura-primary w-10 h-10" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">Drag & Drop Certificate</h4>
                        <p className="text-slate-500 font-medium">PDF, JPG or PNG (Max 5MB)</p>
                    </div>
                </div>

                {file && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-teal-50 rounded-2xl border border-teal-100 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-cura-primary">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-800 text-sm line-clamp-1">{file.name}</h5>
                                <p className="text-xs text-slate-500 font-medium">Ready for upload</p>
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={20} />
                        </button>
                    </motion.div>
                )}

                <div className="flex items-center justify-between pt-8">
                  <button onClick={prevStep} className="font-bold text-slate-500 hover:text-slate-800 transition-colors px-6">Go Back</button>
                  <Button className="w-48 h-14" onClick={handleFinish} isLoading={loading} disabled={!isStep3Valid}>
                    Complete Profile <Check size={18} />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cura-primary/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cura-secondary/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="mt-8 flex items-center gap-2 text-slate-400 font-semibold text-sm">
        <CheckCircle2 size={16} /> Secure Health Cloud Encryption Active
      </div>
    </div>
  );
};
