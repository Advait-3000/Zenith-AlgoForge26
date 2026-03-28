import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  Edit, 
  CheckCircle2, 
  Calendar,
  Zap,
  Phone,
  MoreVertical,
  Mail,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/BaseComponents';

export const ProfilePage: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 fade-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Professional Profile</h2>
                    <p className="text-slate-500 font-semibold mt-1">Manage your medical license and practice details</p>
                </div>
                <Button className="h-12 px-6 shadow-cura-soft">
                    <Edit size={18} /> Edit Basic Info
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Profile Detail Detail Panel */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="cura-card p-10 flex flex-col items-center">
                        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-cura-float mb-6">
                            <img src="https://img.freepik.com/free-photo/doctor-white-coat-isolated-white_144627-4663.jpg" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">Dr. Julian Ross</h3>
                        <p className="text-cura-primary font-black text-sm uppercase tracking-widest mt-1">Chief Cardiologist</p>
                        
                        <div className="flex items-center gap-2 mt-4 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Verified Practitioner</span>
                        </div>

                        <div className="w-full h-px bg-slate-100 my-8" />

                        <div className="w-full space-y-5">
                            <div className="flex items-center gap-4 text-slate-600 font-bold">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><Mail size={18} /></div>
                                <span className="text-sm">julian.ross@cura.com</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 font-bold">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><Phone size={18} /></div>
                                <span className="text-sm">+1 (555) 0922 411</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 font-bold">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><MapPin size={18} /></div>
                                <span className="text-sm">New York, USA</span>
                            </div>
                        </div>
                    </div>

                    <div className="cura-card p-8 bg-sky-50 border-sky-100 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={60} fill="#0EA5E9" /></div>
                        <h4 className="font-black text-sky-600 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Award size={16} /> Key Achievements
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm font-bold text-slate-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                                15+ Yrs Cardiology Exp.
                            </li>
                            <li className="flex gap-3 text-sm font-bold text-slate-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                                3,400+ Successful Consults
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Settings/Information Side */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Practice Details Detail Card */}
                    <div className="cura-card p-10">
                        <h4 className="font-black text-slate-800 text-lg tracking-tight mb-8">Clinical Practice</h4>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest">Hospital Affiliate</p>
                                <p className="text-base font-bold text-slate-800">St. Maria Medical Center</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest">Medical License ID</p>
                                <p className="text-base font-bold text-slate-800">NY-MD-90123-922</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest">Default Consultation Fee</p>
                                <p className="text-base font-bold text-slate-800">$180 / Session</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest">Primary Language</p>
                                <p className="text-base font-bold text-slate-800">English (Native)</p>
                            </div>
                        </div>
                    </div>

                    {/* Verification & License Side Section */}
                    <div className="cura-card p-10 overflow-hidden relative group">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="font-black text-slate-800 text-lg tracking-tight">Verified Credentials</h4>
                            <button className="text-cura-primary font-black text-xs hover:bg-cura-primary/5 px-4 py-2 rounded-xl border border-cura-primary/10 transition-all">UPLOAD NEW</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4 group/item hover:border-cura-primary/30 transition-all cursor-pointer">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-cura-primary shrink-0 transition-transform group-hover/item:scale-110">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-800">MBBS Certificate</h5>
                                    <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mt-0.5">Verified • 2008</p>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4 group/item hover:border-cura-primary/30 transition-all cursor-pointer">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-cura-primary shrink-0 transition-transform group-hover/item:scale-110">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-800">Board Certification</h5>
                                    <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mt-0.5">Renewal Due 2028</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* High-fidelity Availability Management Section */}
                    <div className="cura-card p-10 bg-slate-900 group">
                        <div className="flex items-center justify-between mb-8 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Calendar className="text-white" size={20} /></div>
                                <h4 className="font-black text-lg tracking-tight">Practice Availability</h4>
                            </div>
                            <button className="w-10 h-10 hover:bg-white/10 rounded-full transition-all flex items-center justify-center"><MoreVertical size={20} /></button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                <div key={day} className="p-4 rounded-[1.5rem] bg-white/5 border border-white/10 hover:border-cura-primary/40 hover:bg-white/10 transition-all cursor-pointer text-center group/day">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 group-hover/day:text-cura-primary">{day}</p>
                                    <p className="text-xs font-bold text-white/90">9 AM - 5 PM</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Timezone: America/New_York (EST)</p>
                            <Button variant="ghost" className="text-white hover:bg-white/10 px-4 h-10 text-xs">Update Slots</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
