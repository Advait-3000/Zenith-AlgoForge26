import React, { useState, useRef } from 'react';
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
    const [isEditingSlots, setIsEditingSlots] = useState(false);
    const [slots, setSlots] = useState<Record<string, string>>({
        Mon: '9 AM - 5 PM',
        Tue: '9 AM - 5 PM',
        Wed: '9 AM - 5 PM',
        Thu: '9 AM - 5 PM',
        Fri: '9 AM - 5 PM'
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [credentials, setCredentials] = useState([
        { id: 1, title: 'MBBS Certificate', status: 'Verified • 2008', icon: Award },
        { id: 2, title: 'Board Certification', status: 'Renewal Due 2028', icon: ShieldCheck }
    ]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCredentials(prev => [...prev, {
                id: Date.now(),
                title: file.name.replace(/\.[^/.]+$/, "").substring(0, 20) + (file.name.length > 20 ? '...' : ''),
                status: 'Pending Verification',
                icon: CheckCircle2
            }]);
            e.target.value = '';
        }
    };

    const [isEditingBasic, setIsEditingBasic] = useState(false);
    const [basicInfo, setBasicInfo] = useState({
        name: 'Dr. Julian Ross',
        title: 'Chief Cardiologist',
        email: 'julian.ross@cura.com',
        phone: '+1 (555) 0922 411',
        location: 'New York, USA',
        hospital: 'St. Maria Medical Center',
        license: 'NY-MD-90123-922',
        fee: '$180 / Session',
        language: 'English (Native)'
    });

    const handleSlotChange = (day: string, value: string) => {
        setSlots(prev => ({ ...prev, [day]: value }));
    };

    const handleBasicChange = (field: string, value: string) => {
        setBasicInfo(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 fade-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Professional Profile</h2>
                    <p className="text-slate-500 font-semibold mt-1">Manage your medical license and practice details</p>
                </div>
                {isEditingBasic ? (
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-12 px-6 shadow-cura-soft" onClick={() => setIsEditingBasic(false)}>Cancel</Button>
                        <Button className="h-12 px-6 shadow-cura-soft" onClick={() => setIsEditingBasic(false)}>Save Changes</Button>
                    </div>
                ) : (
                    <Button className="h-12 px-6 shadow-cura-soft" onClick={() => setIsEditingBasic(true)}>
                        <Edit size={18} /> Edit Basic Info
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Profile Detail Detail Panel */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="cura-card p-10 flex flex-col items-center">
                        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-cura-float mb-6">
                            <img src="https://img.freepik.com/free-photo/doctor-white-coat-isolated-white_144627-4663.jpg" className="w-full h-full object-cover" />
                        </div>
                        {isEditingBasic ? (
                            <div className="w-full space-y-3 text-center mb-1">
                                <input value={basicInfo.name} onChange={e => handleBasicChange('name', e.target.value)} className="w-full text-center text-xl font-black text-slate-800 border-b border-slate-200 outline-none pb-1 focus:border-cura-primary transition-colors" />
                                <input value={basicInfo.title} onChange={e => handleBasicChange('title', e.target.value)} className="w-full text-center text-cura-primary font-black text-xs uppercase tracking-widest border-b border-slate-200 outline-none pb-1 focus:border-cura-primary transition-colors" />
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-black text-slate-800">{basicInfo.name}</h3>
                                <p className="text-cura-primary font-black text-sm uppercase tracking-widest mt-1">{basicInfo.title}</p>
                            </>
                        )}
                        
                        <div className="flex items-center gap-2 mt-4 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Verified Practitioner</span>
                        </div>

                        <div className="w-full h-px bg-slate-100 my-8" />

                        <div className="w-full space-y-5">
                            <div className="flex items-center gap-4 text-slate-600 font-bold">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><Mail size={18} /></div>
                                {isEditingBasic ? <input value={basicInfo.email} onChange={e => handleBasicChange('email', e.target.value)} className="flex-1 text-sm border-b border-slate-200 outline-none pb-1 focus:border-cura-primary transition-colors" /> : <span className="text-sm">{basicInfo.email}</span>}
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 font-bold">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><Phone size={18} /></div>
                                {isEditingBasic ? <input value={basicInfo.phone} onChange={e => handleBasicChange('phone', e.target.value)} className="flex-1 text-sm border-b border-slate-200 outline-none pb-1 focus:border-cura-primary transition-colors" /> : <span className="text-sm">{basicInfo.phone}</span>}
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 font-bold">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><MapPin size={18} /></div>
                                {isEditingBasic ? <input value={basicInfo.location} onChange={e => handleBasicChange('location', e.target.value)} className="flex-1 text-sm border-b border-slate-200 outline-none pb-1 focus:border-cura-primary transition-colors" /> : <span className="text-sm">{basicInfo.location}</span>}
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
                                {isEditingBasic ? <input value={basicInfo.hospital} onChange={e => handleBasicChange('hospital', e.target.value)} className="w-full text-base font-bold text-slate-800 border border-slate-200 rounded-lg p-2 outline-none focus:border-cura-primary transition-colors" /> : <p className="text-base font-bold text-slate-800">{basicInfo.hospital}</p>}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest">Medical License ID</p>
                                {isEditingBasic ? <input value={basicInfo.license} onChange={e => handleBasicChange('license', e.target.value)} className="w-full text-base font-bold text-slate-800 border border-slate-200 rounded-lg p-2 outline-none focus:border-cura-primary transition-colors" /> : <p className="text-base font-bold text-slate-800">{basicInfo.license}</p>}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest">Default Consultation Fee</p>
                                {isEditingBasic ? <input value={basicInfo.fee} onChange={e => handleBasicChange('fee', e.target.value)} className="w-full text-base font-bold text-slate-800 border border-slate-200 rounded-lg p-2 outline-none focus:border-cura-primary transition-colors" /> : <p className="text-base font-bold text-slate-800">{basicInfo.fee}</p>}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest">Primary Language</p>
                                {isEditingBasic ? <input value={basicInfo.language} onChange={e => handleBasicChange('language', e.target.value)} className="w-full text-base font-bold text-slate-800 border border-slate-200 rounded-lg p-2 outline-none focus:border-cura-primary transition-colors" /> : <p className="text-base font-bold text-slate-800">{basicInfo.language}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Verification & License Side Section */}
                    <div className="cura-card p-10 overflow-hidden relative group">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="font-black text-slate-800 text-lg tracking-tight">Verified Credentials</h4>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-cura-primary font-black text-xs hover:bg-cura-primary/5 px-4 py-2 rounded-xl border border-cura-primary/10 transition-all cursor-pointer"
                            >
                                UPLOAD NEW
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                accept=".pdf,.png,.jpg,.jpeg"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {credentials.map(cred => (
                                <div key={cred.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4 group/item hover:border-cura-primary/30 transition-all cursor-pointer">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-cura-primary shrink-0 transition-transform group-hover/item:scale-110">
                                        <cred.icon size={24} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h5 className="font-bold text-slate-800 truncate">{cred.title}</h5>
                                        <p className="text-[10px] font-black text-cura-text-soft uppercase tracking-widest mt-0.5 truncate">{cred.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* High-fidelity Availability Management Section */}
                    <div className="cura-card p-10 group bg-white border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-cura-primary/10 rounded-xl flex items-center justify-center"><Calendar className="text-cura-primary" size={20} /></div>
                                <h4 className="font-black text-slate-800 text-lg tracking-tight">Practice Availability</h4>
                            </div>
                            <button className="w-10 h-10 hover:bg-slate-50 text-slate-400 rounded-full transition-all flex items-center justify-center"><MoreVertical size={20} /></button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                <div key={day} className={`p-4 rounded-[1.5rem] transition-all cursor-pointer text-center group/day ${isEditingSlots ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-50 border border-slate-100 hover:border-cura-primary/30 hover:bg-white hover:shadow-cura-soft'}`}>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover/day:text-cura-primary">{day}</p>
                                    {isEditingSlots ? (
                                        <input 
                                            type="text" 
                                            value={slots[day]} 
                                            onChange={(e) => handleSlotChange(day, e.target.value)}
                                            className="w-full bg-slate-50/50 text-center text-xs font-bold text-slate-800 py-1.5 px-0.5 rounded-lg border border-slate-200 focus:bg-white focus:border-cura-primary focus:ring-2 focus:ring-cura-primary/20 outline-none transition-all"
                                        />
                                    ) : (
                                        <p className="text-xs font-bold text-slate-800">{slots[day]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Timezone: America/New_York (EST)</p>
                            {isEditingSlots ? (
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="h-10 text-xs px-4" onClick={() => setIsEditingSlots(false)}>Cancel</Button>
                                    <Button className="h-10 text-xs px-4" onClick={() => setIsEditingSlots(false)}>Save Changes</Button>
                                </div>
                            ) : (
                                <Button variant="outline" className="h-10 text-xs px-4" onClick={() => setIsEditingSlots(true)}>Update Slots</Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
